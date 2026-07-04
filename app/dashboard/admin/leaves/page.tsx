"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  MessageSquare,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/lib/supabase/client";
import { getMyProfile } from "@/lib/actions/profile";
import {
  getAllLeaveRequests,
  approveLeaveRequest,
  rejectLeaveRequest,
} from "@/lib/actions/leaves";
import type { LeaveRequest, LeaveType, Profile } from "@/lib/types";

export default function AdminLeavesPage() {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [adminId, setAdminId] = useState<string | null>(null);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  // Remarks dialog
  const [remarksDialog, setRemarksDialog] = useState<{
    open: boolean;
    requestId: string;
    action: "approve" | "reject";
  }>({ open: false, requestId: "", action: "approve" });
  const [adminRemarks, setAdminRemarks] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const loadData = useCallback(async (cId: string, status: string) => {
    setLoading(true);
    const result = await getAllLeaveRequests(cId, status);
    if (result.success && result.data) {
      setRequests(result.data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (data.user) {
        setAdminId(data.user.id);
        const profile = await getMyProfile(data.user.id);
        if (profile.success && profile.data) {
          setCompanyId(profile.data.company_id);
          await loadData(profile.data.company_id, statusFilter);
        }
      }
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (companyId) loadData(companyId, statusFilter);
  }, [statusFilter, companyId, loadData]);

  const handleAction = async () => {
    if (!adminId) return;
    setActionLoading(true);

    if (remarksDialog.action === "approve") {
      await approveLeaveRequest(remarksDialog.requestId, adminId, adminRemarks || undefined);
    } else {
      await rejectLeaveRequest(remarksDialog.requestId, adminId, adminRemarks || undefined);
    }

    setRemarksDialog({ open: false, requestId: "", action: "approve" });
    setAdminRemarks("");
    setActionLoading(false);
    if (companyId) loadData(companyId, statusFilter);
  };

  const filtered = requests.filter((r) => {
    const profile = r.profile as Pick<Profile, "first_name" | "last_name" | "login_id" | "department"> | undefined;
    if (!profile) return true;
    const name = `${profile.first_name} ${profile.last_name}`.toLowerCase();
    const q = search.toLowerCase();
    return name.includes(q) || (profile.login_id || "").toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Calendar className="size-6" />
          Leave Approvals
        </h1>
        <p className="text-sm text-muted-foreground">
          Review and manage employee leave requests
        </p>
      </div>

      <Tabs value={statusFilter} onValueChange={setStatusFilter}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>

          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search by employee..."
              className="h-9 pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <TabsContent value={statusFilter} className="mt-4">
          {loading ? (
            <Skeleton className="h-64 rounded-xl" />
          ) : (
            <div className="rounded-xl border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead className="text-right">Days</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Remarks</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No leave requests found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((req) => {
                      const profile = req.profile as Pick<Profile, "first_name" | "last_name" | "login_id" | "department"> | undefined;
                      const lt = req.leave_type as LeaveType | undefined;
                      return (
                        <TableRow key={req.id}>
                          <TableCell>
                            <div>
                              <p className="text-sm font-medium">
                                {profile?.first_name} {profile?.last_name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {profile?.department || "—"}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">{lt?.name || "—"}</TableCell>
                          <TableCell className="text-sm">
                            <span>
                              {new Date(req.start_date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                              {" — "}
                              {new Date(req.end_date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                            </span>
                          </TableCell>
                          <TableCell className="text-sm text-right">{req.days_requested}</TableCell>
                          <TableCell>
                            <LeaveStatusBadge status={req.status} />
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground max-w-[150px] truncate">
                            {req.remarks || "—"}
                          </TableCell>
                          <TableCell className="text-right">
                            {req.status === "pending" && (
                              <div className="flex items-center gap-1.5 justify-end">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-7 text-xs text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                                  onClick={() =>
                                    setRemarksDialog({ open: true, requestId: req.id, action: "approve" })
                                  }
                                >
                                  <CheckCircle2 className="mr-1 size-3" />
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-7 text-xs text-red-600 border-red-200 hover:bg-red-50"
                                  onClick={() =>
                                    setRemarksDialog({ open: true, requestId: req.id, action: "reject" })
                                  }
                                >
                                  <XCircle className="mr-1 size-3" />
                                  Reject
                                </Button>
                              </div>
                            )}
                            {req.status !== "pending" && req.admin_remarks && (
                              <span className="text-xs text-muted-foreground italic">
                                {req.admin_remarks}
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Remarks Dialog */}
      <Dialog
        open={remarksDialog.open}
        onOpenChange={(o) => setRemarksDialog((prev) => ({ ...prev, open: o }))}
      >
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>
              {remarksDialog.action === "approve" ? "Approve" : "Reject"} Leave Request
            </DialogTitle>
            <DialogDescription>
              Add optional remarks for the employee.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium flex items-center gap-1.5">
                <MessageSquare className="size-3.5" />
                Admin Remarks (optional)
              </label>
              <Textarea
                value={adminRemarks}
                onChange={(e) => setAdminRemarks(e.target.value)}
                rows={3}
                placeholder="e.g., Approved. Please ensure handover."
                className="text-sm"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRemarksDialog({ open: false, requestId: "", action: "approve" })}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleAction}
              disabled={actionLoading}
              className={
                remarksDialog.action === "approve"
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                  : "bg-red-600 hover:bg-red-700 text-white"
              }
            >
              {actionLoading ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : remarksDialog.action === "approve" ? (
                <CheckCircle2 className="mr-2 size-4" />
              ) : (
                <XCircle className="mr-2 size-4" />
              )}
              {remarksDialog.action === "approve" ? "Approve" : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function LeaveStatusBadge({ status }: { status: string }) {
  const config: Record<string, { className: string; icon: React.ReactNode }> = {
    pending: {
      className: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
      icon: <Clock className="mr-1 size-3" />,
    },
    approved: {
      className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
      icon: <CheckCircle2 className="mr-1 size-3" />,
    },
    rejected: {
      className: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
      icon: <XCircle className="mr-1 size-3" />,
    },
  };
  const c = config[status] || config.pending;
  return (
    <Badge className={`text-[10px] ${c.className}`}>
      {c.icon}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}
