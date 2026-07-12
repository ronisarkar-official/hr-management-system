"use client";

import React, { useState, useEffect, Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Users, Search, ArrowLeft, Trash2, Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase/client";
import { getAllEmployees, getMyProfile, getProfile, deleteEmployee } from "@/lib/actions/profile";
import { AddEmployeeDialog } from "@/components/add-employee-dialog";
import { EmployeeProfileView } from "@/components/employee-profile-view";
import { Pagination } from "@/components/ui/pagination";
import { PAGINATION } from "@/lib/constants";
import type { Profile } from "@/lib/types";

export default function AdminEmployeesPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <Skeleton className="h-10 w-64" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-xl" />
            ))}
          </div>
        </div>
      }
    >
      <AdminEmployeesContent />
    </Suspense>
  );
}

function AdminEmployeesContent() {
  const searchParams = useSearchParams();
  const selectedId = searchParams.get("id");

  const [employees, setEmployees] = useState<Profile[]>([]);
  const [adminProfile, setAdminProfile] = useState<Profile | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Profile | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"list" | "detail">(selectedId ? "detail" : "list");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGINATION.defaultPageSize);
  const [editMode, setEditMode] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; employee: Profile | null }>({
    open: false,
    employee: null,
  });
  const [deleting, setDeleting] = useState(false);

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const myProfile = await getMyProfile(user.id);
    if (myProfile.success && myProfile.data) {
      setAdminProfile(myProfile.data);
      const result = await getAllEmployees(myProfile.data.company_id);
      if (result.success && result.data) {
        setEmployees(result.data);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Load selected employee if ID is in URL
  useEffect(() => {
    if (selectedId && employees.length > 0) {
      const emp = employees.find((e) => e.id === selectedId);
      if (emp) {
        setSelectedEmployee(emp);
        setViewMode("detail");
      } else {
        // Try fetching directly
        getProfile(selectedId).then((result) => {
          if (result.success && result.data) {
            setSelectedEmployee(result.data);
            setViewMode("detail");
          }
        });
      }
    }
  }, [selectedId, employees]);

  const handleDelete = async () => {
    if (!deleteDialog.employee || !adminProfile) return;
    setDeleting(true);
    const result = await deleteEmployee(deleteDialog.employee.id, adminProfile.id);
    setDeleting(false);
    setDeleteDialog({ open: false, employee: null });
    if (result.success) {
      loadData();
    } else {
      alert(result.error || "Failed to delete employee.");
    }
  };

  const filtered = useMemo(() => employees.filter(
    (e) =>
      `${e.first_name} ${e.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
      (e.login_id || "").toLowerCase().includes(search.toLowerCase()) ||
      (e.department || "").toLowerCase().includes(search.toLowerCase()) ||
      (e.job_title || "").toLowerCase().includes(search.toLowerCase())
  ), [employees, search]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (viewMode === "detail" && selectedEmployee) {
    return (
      <div className="space-y-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setViewMode("list");
            setSelectedEmployee(null);
            setEditMode(false);
            // Clear URL param
            window.history.replaceState(null, "", "/dashboard/admin/employees");
          }}
        >
          <ArrowLeft className="mr-2 size-4" />
          Back to Directory
        </Button>
        <div className="flex items-center justify-end">
          <Button
            size="sm"
            variant={editMode ? "default" : "outline"}
            onClick={() => setEditMode(!editMode)}
          >
            {editMode ? "Cancel Edit" : "Edit Employee"}
          </Button>
        </div>
        <EmployeeProfileView
          profile={selectedEmployee}
          isAdmin={true}
          readOnly={!editMode}
          onSave={() => {
            loadData();
            getProfile(selectedEmployee.id).then((r) => {
              if (r.success && r.data) setSelectedEmployee(r.data);
            });
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Users className="size-6" />
            Employee Directory
          </h1>
          <p className="text-sm text-muted-foreground">
            {employees.length} employee{employees.length !== 1 ? "s" : ""} in your organization
          </p>
        </div>
        {adminProfile && (
          <AddEmployeeDialog
            adminUserId={adminProfile.id}
            onSuccess={loadData}
          />
        )}
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, ID, department..."
          className="h-9 pl-10"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <Users className="mx-auto size-12 text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground font-medium">
            {employees.length === 0
              ? "No employees yet"
              : "No matching employees"}
          </p>
          <p className="text-sm text-muted-foreground/70 mt-1">
            {employees.length === 0
              ? "Add your first employee using the button above."
              : "Try adjusting your search."}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.slice((page - 1) * pageSize, page * pageSize).map((emp) => {
            const initials = `${emp.first_name?.[0] || ""}${emp.last_name?.[0] || ""}`.toUpperCase();
            return (
              <div
                key={emp.id}
                className="relative group rounded-xl border border-border bg-card p-4 hover:shadow-md hover:border-primary/20 transition-all duration-200"
              >
                <button
                  onClick={() => {
                    setSelectedEmployee(emp);
                    setViewMode("detail");
                  }}
                  className="text-left w-full"
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="size-10">
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {emp.first_name} {emp.last_name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {emp.job_title || "—"}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                          {emp.login_id || "—"}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground/70">
                          {emp.department || ""}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteDialog({ open: true, employee: emp });
                  }}
                  className="absolute top-2 right-2 size-7 flex items-center justify-center rounded-md opacity-0 group-hover:opacity-100 hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all"
                  title="Delete employee"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            );
            })}
          </div>
          <Pagination
            currentPage={page}
            totalItems={filtered.length}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
          />
        </>
      )}

      <Dialog
        open={deleteDialog.open}
        onOpenChange={(o) => setDeleteDialog((prev) => ({ ...prev, open: o }))}
      >
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="size-5" />
              Delete Employee
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <strong>
                {deleteDialog.employee?.first_name} {deleteDialog.employee?.last_name}
              </strong>
              ? This will permanently remove their profile, leave records, attendance
              history, and salary data. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteDialog({ open: false, employee: null })}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 size-4" />
              )}
              Delete Employee
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
