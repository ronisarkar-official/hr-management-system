"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  CreditCard,
  Search,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/lib/supabase/client";
import { getMyProfile, getAllEmployees } from "@/lib/actions/profile";
import { getSalaryStructure } from "@/lib/actions/salary";
import { SalaryInfo } from "@/components/salary-info";
import type { Profile, SalaryStructure, SalaryComponent } from "@/lib/types";

interface EmployeePayrollData {
  profile: Profile;
  salary: { structure: SalaryStructure; components: SalaryComponent[] } | null;
}

export default function AdminPayrollPage() {
  const [employees, setEmployees] = useState<EmployeePayrollData[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeePayrollData | null>(null);

  const loadData = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const profileResult = await getMyProfile(user.id);
    if (!profileResult.success || !profileResult.data) return;

    const empResult = await getAllEmployees(profileResult.data.company_id);
    if (!empResult.success || !empResult.data) return;

    // Fetch salary data for each employee
    const enriched: EmployeePayrollData[] = await Promise.all(
      empResult.data.map(async (emp) => {
        const salaryResult = await getSalaryStructure(emp.id);
        return {
          profile: emp,
          salary: salaryResult.success ? salaryResult.data ?? null : null,
        };
      })
    );

    setEmployees(enriched);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filtered = employees.filter((e) => {
    const name = `${e.profile.first_name} ${e.profile.last_name}`.toLowerCase();
    const q = search.toLowerCase();
    return (
      name.includes(q) ||
      (e.profile.login_id || "").toLowerCase().includes(q) ||
      (e.profile.department || "").toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  if (selectedEmployee) {
    return (
      <div className="space-y-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSelectedEmployee(null)}
        >
          <ArrowLeft className="mr-2 size-4" />
          Back to Payroll
        </Button>
        <div className="rounded-xl border border-border bg-card p-5 mb-4">
          <h2 className="text-lg font-bold">
            {selectedEmployee.profile.first_name} {selectedEmployee.profile.last_name}
          </h2>
          <p className="text-sm text-muted-foreground">
            {selectedEmployee.profile.job_title || "—"} •{" "}
            {selectedEmployee.profile.department || "—"} •{" "}
            {selectedEmployee.profile.login_id || "—"}
          </p>
        </div>
        <SalaryInfo
          profileId={selectedEmployee.profile.id}
          salaryData={selectedEmployee.salary}
          readOnly={false}
          onUpdate={() => {
            loadData().then(() => {
              // Refresh selected employee
              const updated = employees.find(
                (e) => e.profile.id === selectedEmployee.profile.id
              );
              if (updated) setSelectedEmployee(updated);
            });
          }}
        />
      </div>
    );
  }

  const totalMonthlyPayroll = employees.reduce(
    (sum, e) => sum + (e.salary ? Number(e.salary.structure.monthly_wage) : 0),
    0
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <CreditCard className="size-6" />
            Payroll Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage employee salary structures and payroll
          </p>
        </div>
        <Badge variant="secondary" className="text-sm px-3 py-1.5">
          Monthly Total: ₹{totalMonthlyPayroll.toLocaleString("en-IN")}
        </Badge>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Search employees..."
          className="h-9 pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="rounded-xl border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Login ID</TableHead>
              <TableHead>Department</TableHead>
              <TableHead className="text-right">Monthly Wage</TableHead>
              <TableHead className="text-right">Yearly Wage</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No employees found.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((emp) => {
                const wage = emp.salary
                  ? Number(emp.salary.structure.monthly_wage)
                  : 0;
                const yearlyWage = emp.salary
                  ? Number(emp.salary.structure.yearly_wage)
                  : 0;

                return (
                  <TableRow
                    key={emp.profile.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => setSelectedEmployee(emp)}
                  >
                    <TableCell>
                      <p className="text-sm font-medium">
                        {emp.profile.first_name} {emp.profile.last_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {emp.profile.job_title || "—"}
                      </p>
                    </TableCell>
                    <TableCell className="text-xs font-mono text-muted-foreground">
                      {emp.profile.login_id || "—"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {emp.profile.department || "—"}
                    </TableCell>
                    <TableCell className="text-sm text-right font-medium">
                      {wage > 0 ? `₹${wage.toLocaleString("en-IN")}` : "—"}
                    </TableCell>
                    <TableCell className="text-sm text-right text-muted-foreground">
                      {yearlyWage > 0 ? `₹${yearlyWage.toLocaleString("en-IN")}` : "—"}
                    </TableCell>
                    <TableCell>
                      {wage > 0 ? (
                        <Badge className="text-[10px] bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                          Configured
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-[10px]">
                          Not Set
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <ChevronRight className="size-4 text-muted-foreground" />
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
