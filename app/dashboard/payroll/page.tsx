"use client";

import React, { useState, useEffect, useCallback } from "react";
import { CreditCard } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase/client";
import { getMyProfile } from "@/lib/actions/profile";
import { getSalaryStructure } from "@/lib/actions/salary";
import { getMyAttendance } from "@/lib/actions/attendance";
import { SalaryInfo } from "@/components/salary-info";
import type { Profile, SalaryStructure, SalaryComponent } from "@/lib/types";

export default function PayrollPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [salaryData, setSalaryData] = useState<{
    structure: SalaryStructure;
    components: SalaryComponent[];
  } | null>(null);
  const [daysPresent, setDaysPresent] = useState(0);
  const [loading, setLoading] = useState(true);

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
        <Skeleton className="h-32 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  const now = new Date();
  const totalWorkingDays = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const monthlyWage = salaryData ? Number(salaryData.structure.monthly_wage) : 0;
  const payableDays = daysPresent;
  const netPay = totalWorkingDays > 0 ? (monthlyWage / totalWorkingDays) * payableDays : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <CreditCard className="size-6" />
          My Payroll
        </h1>
        <p className="text-sm text-muted-foreground">
          View your salary structure and current period summary
        </p>
      </div>

      {/* Current Period Summary */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="font-semibold text-sm mb-4">
          Current Period — {now.toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Total Working Days</p>
            <p className="text-xl font-bold">{totalWorkingDays}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Payable Days</p>
            <p className="text-xl font-bold">{payableDays}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Monthly Wage</p>
            <p className="text-xl font-bold">₹{monthlyWage.toLocaleString("en-IN")}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Estimated Net Pay</p>
            <p className="text-xl font-bold text-emerald-600">
              ₹{Math.round(netPay).toLocaleString("en-IN")}
            </p>
            {payableDays < totalWorkingDays && (
              <Badge variant="secondary" className="text-[10px]">
                Pro-rated
              </Badge>
            )}
          </div>
        </div>
      </div>

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
