"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  CreditCard,
  Search,
  ChevronRight,
  ArrowLeft,
  Download,
  Users,
  Wallet,
  BadgeCheck,
  XCircle,
  Briefcase,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { StatCard } from "@/components/ui/stat-card";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Pagination } from "@/components/ui/pagination";
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
import { formatCurrency } from "@/lib/locale";
import { exportToCSV } from "@/lib/services/csv-export";
import { PAGINATION } from "@/lib/constants";
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
  const [selectedEmployee, setSelectedEmployee] =
    useState<EmployeePayrollData | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGINATION.defaultPageSize);

  const loadData = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const profileResult = await getMyProfile(user.id);
    if (!profileResult.success || !profileResult.data) return;

    const empResult = await getAllEmployees(profileResult.data.company_id);
    if (!empResult.success || !empResult.data) return;

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

  const filtered = useMemo(() => employees.filter((e) => {
    const name = `${e.profile.first_name} ${e.profile.last_name}`.toLowerCase();
    const q = search.toLowerCase();
    return (
      name.includes(q) ||
      (e.profile.login_id || "").toLowerCase().includes(q) ||
      (e.profile.department || "").toLowerCase().includes(q)
    );
  }), [employees, search]);

  const totalEmployees = employees.length;
  const configuredCount = employees.filter((e) => e.salary).length;
  const totalMonthlyPayroll = employees.reduce(
    (sum, e) => sum + (e.salary ? Number(e.salary.structure.monthly_wage) : 0),
    0
  );
  const avgWage = configuredCount > 0 ? Math.round(totalMonthlyPayroll / configuredCount) : 0;
  const configPercent = totalEmployees > 0 ? Math.round((configuredCount / totalEmployees) * 100) : 0;

  const paginated = useMemo(() =>
    filtered.slice((page - 1) * pageSize, page * pageSize),
    [filtered, page, pageSize]
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
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
        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-primary/30 via-primary/20 to-transparent" />
          <div className="p-5 flex items-center gap-4">
            <Avatar className="size-12">
              <AvatarFallback className="bg-primary text-primary-foreground text-sm font-bold">
                {(
                  selectedEmployee.profile.first_name?.[0] +
                  (selectedEmployee.profile.last_name?.[0] || "")
                ).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-lg font-bold">
                {selectedEmployee.profile.first_name} {selectedEmployee.profile.last_name}
              </h2>
              <p className="text-sm text-muted-foreground">
                {selectedEmployee.profile.job_title || "—"} &bull;{" "}
                {selectedEmployee.profile.department || "—"}
              </p>
            </div>
          </div>
        </div>
        <SalaryInfo
          profileId={selectedEmployee.profile.id}
          salaryData={selectedEmployee.salary}
          readOnly={false}
          onUpdate={() => {
            loadData().then(() => {
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

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payroll Management"
        description="Manage employee salary structures and payroll"
        icon={<CreditCard className="size-6" />}
        action={
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              exportToCSV(
                employees.map((e) => ({
                  Name: `${e.profile.first_name} ${e.profile.last_name}`,
                  "Login ID": e.profile.login_id || "",
                  Department: e.profile.department || "",
                  "Monthly Wage": e.salary ? Number(e.salary.structure.monthly_wage) : 0,
                  "Yearly Wage": e.salary ? Number(e.salary.structure.yearly_wage) : 0,
                  Status: e.salary ? "Configured" : "Not Set",
                })),
                "payroll-export"
              );
            }}
          >
            <Download className="mr-2 size-4" />
            Export CSV
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Users className="size-5" />}
          label="Total Employees"
          value={String(totalEmployees)}
          color="text-blue-600 bg-blue-50 dark:bg-blue-950 dark:text-blue-400"
        />
        <StatCard
          icon={<Wallet className="size-5" />}
          label="Monthly Payroll"
          value={formatCurrency(totalMonthlyPayroll)}
          color="text-emerald-600 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-400"
        />
        <StatCard
          icon={<BadgeCheck className="size-5" />}
          label="Salary Configured"
          value={`${configuredCount} / ${totalEmployees}`}
          color="text-purple-600 bg-purple-50 dark:bg-purple-950 dark:text-purple-400"
        />
        <StatCard
          icon={<TrendingUp className="size-5" />}
          label="Avg Monthly Wage"
          value={formatCurrency(avgWage)}
          color="text-amber-600 bg-amber-50 dark:bg-amber-950 dark:text-amber-400"
        />
      </div>

      {/* Salary config progress */}
      {totalEmployees > 0 && (
        <div className="rounded-xl border bg-card shadow-sm p-5">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="font-medium">Salary Configuration Progress</span>
            <span className="text-muted-foreground">{configPercent}% complete</span>
          </div>
          <div className="h-2.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all duration-700"
              style={{ width: `${configPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, department, or Login ID..."
          className="h-9 pl-10"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
      </div>

      {/* Table */}
      <div className="rounded-xl border overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 [&>th]:sticky [&>th]:top-0 [&>th]:bg-muted/30 [&>th]:z-10">
              <TableHead className="py-3">Employee</TableHead>
              <TableHead className="py-3">Login ID</TableHead>
              <TableHead className="py-3">Department</TableHead>
              <TableHead className="py-3 text-right">Monthly</TableHead>
              <TableHead className="py-3 text-right">Yearly</TableHead>
              <TableHead className="py-3">Status</TableHead>
              <TableHead className="py-3 w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-0">
                  <EmptyState
                    icon={<Search className="size-12" />}
                    title={employees.length === 0 ? "No employees" : "No results found"}
                    description={
                      employees.length === 0
                        ? "Add employees to start managing payroll."
                        : "Try a different search term."
                    }
                  />
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((emp) => {
                const wage = emp.salary ? Number(emp.salary.structure.monthly_wage) : 0;
                const yearlyWage = emp.salary ? Number(emp.salary.structure.yearly_wage) : 0;
                const initials = (
                  (emp.profile.first_name?.[0] || "") +
                  (emp.profile.last_name?.[0] || "")
                ).toUpperCase();

                return (
                  <TableRow
                    key={emp.profile.id}
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => setSelectedEmployee(emp)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="size-9">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{emp.profile.first_name} {emp.profile.last_name}</p>
                          <p className="text-xs text-muted-foreground">{emp.profile.job_title || "—"}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs font-mono text-muted-foreground">
                      {emp.profile.login_id || "—"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {emp.profile.department || "—"}
                    </TableCell>
                    <TableCell className="text-sm text-right font-medium tabular-nums">
                      {wage > 0 ? formatCurrency(wage) : "—"}
                    </TableCell>
                    <TableCell className="text-sm text-right text-muted-foreground tabular-nums">
                      {yearlyWage > 0 ? formatCurrency(yearlyWage) : "—"}
                    </TableCell>
                    <TableCell>
                      {emp.salary ? (
                        <Badge className="text-[10px] bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 border-0 font-medium">
                          <BadgeCheck className="mr-1 size-3" />
                          Configured
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-[10px] text-muted-foreground">
                          <XCircle className="mr-1 size-3" />
                          Not Set
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <ChevronRight className="size-4 text-muted-foreground/50" />
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {filtered.length > pageSize && (
        <Pagination
          currentPage={page}
          totalItems={filtered.length}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
        />
      )}
    </div>
  );
}
