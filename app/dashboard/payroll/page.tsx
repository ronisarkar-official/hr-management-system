"use client";

import React, { useState, useEffect, useCallback } from "react";
import { CreditCard, FileText, CalendarDays, Wallet, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { supabase } from "@/lib/supabase/client";
import { getMyProfile } from "@/lib/actions/profile";
import { getSalaryStructure } from "@/lib/actions/salary";
import { getMyAttendance } from "@/lib/actions/attendance";
import { formatDate, formatCurrency } from "@/lib/locale";
import { SalaryInfo } from "@/components/salary-info";
import { PayslipView } from "@/components/payslip-view";
import type { Profile, SalaryStructure, SalaryComponent } from "@/lib/types";

export default function PayrollPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [salaryData, setSalaryData] = useState<{
    structure: SalaryStructure;
    components: SalaryComponent[];
  } | null>(null);
  const [daysPresent, setDaysPresent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showPayslip, setShowPayslip] = useState(false);

  const loadData = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const [profileResult, salaryResult, attendanceResult] = await Promise.all([
      getMyProfile(user.id),
      getSalaryStructure(user.id),
      getMyAttendance(user.id, new Date().getMonth() + 1, new Date().getFullYear()),
    ]);

    if (profileResult.success && profileResult.data) setProfile(profileResult.data);
    if (salaryResult.success && salaryResult.data) setSalaryData(salaryResult.data);
    if (attendanceResult.success && attendanceResult.data) {
      setDaysPresent(attendanceResult.data.filter((a) => a.status === "present").length);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

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

  const now = new Date();
  const totalWorkingDays = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const monthlyWage = salaryData ? Number(salaryData.structure.monthly_wage) : 0;
  const payableDays = daysPresent;
  const netPay = totalWorkingDays > 0 ? (monthlyWage / totalWorkingDays) * payableDays : 0;
  const hasSalary = !!salaryData;

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Payroll"
        description="View your salary structure and current period summary"
        icon={<CreditCard className="size-6" />}
      />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Wallet className="size-5" />}
          label="Monthly Wage"
          value={hasSalary ? formatCurrency(monthlyWage) : "—"}
          color="text-blue-600 bg-blue-50 dark:bg-blue-950 dark:text-blue-400"
        />
        <StatCard
          icon={<TrendingUp className="size-5" />}
          label="Estimated Net Pay"
          value={hasSalary ? formatCurrency(Math.round(netPay)) : "—"}
          color="text-emerald-600 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-400"
        />
        <StatCard
          icon={<CalendarDays className="size-5" />}
          label="Days Present"
          value={`${daysPresent} / ${totalWorkingDays}`}
          color="text-purple-600 bg-purple-50 dark:bg-purple-950 dark:text-purple-400"
        />
        <StatCard
          icon={<FileText className="size-5" />}
          label="Payslip"
          value={hasSalary ? "Available" : "—"}
          color={hasSalary ? "text-amber-600 bg-amber-50 dark:bg-amber-950 dark:text-amber-400" : "text-muted-foreground bg-muted/50"}
        />
      </div>

      {/* Current Period Card */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-primary/30 via-primary/20 to-transparent" />
        <div className="p-6">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
            <div>
              <h3 className="font-semibold">
                {formatDate(now, { month: "long", year: "numeric" })} Period
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Salary pro-rated based on attendance
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPayslip(true)}
              disabled={!hasSalary}
            >
              <FileText className="mr-2 size-4" />
              View Payslip
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div>
              <p className="text-xs text-muted-foreground font-medium">Working Days</p>
              <p className="text-2xl font-bold mt-1">{totalWorkingDays}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Present</p>
              <p className="text-2xl font-bold mt-1">{daysPresent}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Payable Days</p>
              <p className="text-2xl font-bold mt-1">{payableDays}</p>
              {payableDays < totalWorkingDays && (
                <Badge variant="secondary" className="text-[10px] mt-1">Pro-rated</Badge>
              )}
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Net Pay</p>
              <p className="text-2xl font-bold mt-1 text-emerald-600">
                {hasSalary ? formatCurrency(Math.round(netPay)) : "—"}
              </p>
            </div>
          </div>

          {/* Attendance bar */}
          {hasSalary && totalWorkingDays > 0 && (
            <div className="mt-5">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                <span>Attendance Rate</span>
                <span>{Math.round((daysPresent / totalWorkingDays) * 100)}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${(daysPresent / totalWorkingDays) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* No salary configured warning */}
      {!hasSalary && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900 p-5 text-sm text-amber-800 dark:text-amber-300">
          <p className="font-medium">Salary not configured yet</p>
          <p className="text-amber-600 dark:text-amber-400 mt-1">
            Your salary structure hasn&apos;t been set up. Contact your HR admin to configure it.
          </p>
        </div>
      )}

      {/* Payslip Dialog */}
      <Dialog open={showPayslip} onOpenChange={setShowPayslip}>
        <DialogContent className="sm:max-w-[720px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="size-5 text-muted-foreground" />
              Payslip — {formatDate(now, { month: "long", year: "numeric" })}
            </DialogTitle>
          </DialogHeader>
          {profile && salaryData && (
            <PayslipView
              employeeName={`${profile.first_name} ${profile.last_name}`}
              employeeId={profile.login_id || ""}
              department={profile.department || ""}
              month={now.toLocaleString("default", { month: "long" })}
              year={now.getFullYear()}
              salaryStructure={salaryData.structure}
              components={salaryData.components}
              daysPresent={daysPresent}
              totalWorkingDays={totalWorkingDays}
              onClose={() => setShowPayslip(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Salary Structure (read-only) */}
      {profile && (
        <SalaryInfo
          profileId={profile.id}
          salaryData={salaryData}
          readOnly={true}
          onUpdate={loadData}
        />
      )}
    </div>
  );
}
