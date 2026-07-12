"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Building2, Users, ChevronRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/lib/supabase/client";
import { getMyProfile } from "@/lib/actions/profile";
import { getDepartments, getDepartmentEmployees } from "@/lib/actions/departments";
import type { Department } from "@/lib/actions/departments";

export default function AdminDepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDept, setSelectedDept] = useState<string | null>(null);
  const [deptEmployees, setDeptEmployees] = useState<{ id: string; first_name: string; last_name: string; job_title: string | null; login_id: string | null }[]>([]);
  const [deptLoading, setDeptLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (data.user) {
        const profile = await getMyProfile(data.user.id);
        if (profile.success && profile.data) {
          setCompanyId(profile.data.company_id);
          const result = await getDepartments(profile.data.company_id);
          if (result.success && result.data) setDepartments(result.data);
        }
      }
      setLoading(false);
    });
  }, []);

  const loadDeptEmployees = useCallback(async (deptName: string) => {
    if (!companyId) return;
    setDeptLoading(true);
    const result = await getDepartmentEmployees(companyId, deptName);
    if (result.success && result.data) setDeptEmployees(result.data);
    setDeptLoading(false);
  }, [companyId]);

  const handleSelectDept = (name: string) => {
    setSelectedDept(name);
    loadDeptEmployees(name);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
        </div>
      </div>
    );
  }

  if (selectedDept) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" size="sm" onClick={() => { setSelectedDept(null); setDeptEmployees([]); }}>
          <ArrowLeft className="mr-2 size-4" />
          All Departments
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Building2 className="size-6" />
            {selectedDept}
          </h1>
          <p className="text-sm text-muted-foreground">
            {deptEmployees.length} employee{deptEmployees.length !== 1 ? "s" : ""}
          </p>
        </div>
        {deptLoading ? (
          <Skeleton className="h-48 rounded-xl" />
        ) : deptEmployees.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No employees in this department.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {deptEmployees.map((emp) => {
              const initials = `${emp.first_name?.[0] || ""}${emp.last_name?.[0] || ""}`.toUpperCase();
              return (
                <div key={emp.id} className="rounded-xl border border-border bg-card p-4 hover:shadow-md transition-all">
                  <div className="flex items-start gap-3">
                    <Avatar className="size-10">
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm truncate">{emp.first_name} {emp.last_name}</p>
                      <p className="text-xs text-muted-foreground truncate">{emp.job_title || "—"}</p>
                      <Badge variant="secondary" className="text-[10px] mt-1">{emp.login_id || "—"}</Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Building2 className="size-6" />
          Departments
        </h1>
        <p className="text-sm text-muted-foreground">
          {departments.length} department{departments.length !== 1 ? "s" : ""} in your organization
        </p>
      </div>

      {departments.length === 0 ? (
        <div className="text-center py-16">
          <Building2 className="mx-auto size-12 text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground font-medium">No departments yet</p>
          <p className="text-sm text-muted-foreground/70 mt-1">
            Departments appear once employees are assigned to them.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map((dept) => (
            <button
              key={dept.name}
              onClick={() => handleSelectDept(dept.name)}
              className="text-left rounded-xl border border-border bg-card p-5 hover:shadow-md hover:border-primary/20 transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-lg bg-blue-50 dark:bg-blue-950 flex items-center justify-center">
                    <Building2 className="size-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{dept.name}</p>
                    <p className="text-xs text-muted-foreground">
                      <Users className="size-3 inline mr-1" />
                      {dept.head_count} employee{dept.head_count !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                <ChevronRight className="size-4 text-muted-foreground" />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
