"use client";

import React, { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import {
  Users,
  UserCheck,
  Calendar,
  CreditCard,
  ArrowRight,
  Clock,
  Briefcase,
  LogIn,
  LogOut as LogOutIcon,
  Search,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { StatCard } from "@/components/ui/stat-card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import Link from "next/link";
import { getMyProfile, getAllEmployees } from "@/lib/actions/profile";
import { getTodayStatus, checkIn, checkOut, getMyAttendance } from "@/lib/actions/attendance";
import { getLeaveBalances } from "@/lib/actions/leaves";
import { formatTime } from "@/lib/locale";
import { ActivityFeed } from "@/components/activity-feed";
import type { Profile, AttendanceRecord, LeaveBalance } from "@/lib/types";

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      setUser(data.user);
      if (data.user) {
        const result = await getMyProfile(data.user.id);
        if (result.success && result.data) {
          setProfile(result.data);
        }
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  if (profile.role === "admin") {
    return <AdminDashboardView profile={profile} />;
  }

  return <EmployeeDashboardView profile={profile} />;
}

/* =========================================================================
   ADMIN / HR OFFICER DASHBOARD VIEW
   ========================================================================= */
function AdminDashboardView({ profile }: { profile: Profile }) {
  const [employees, setEmployees] = useState<Profile[]>([]);
  const [todayStatuses, setTodayStatuses] = useState<Map<string, string>>(new Map());
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const result = await getAllEmployees(profile.company_id);
      if (result.success && result.data) {
        setEmployees(result.data);

        // Fetch today's attendance for each employee
        const statusMap = new Map<string, string>();
        await Promise.all(
          result.data.map(async (emp) => {
            const status = await getTodayStatus(emp.id);
            if (status.success && status.data?.check_in_at) {
              statusMap.set(emp.id, "checked_in");
            }
          })
        );
        setTodayStatuses(statusMap);
      }
      setLoading(false);
    }
    load();
  }, [profile.company_id]);

  const filtered = employees.filter(
    (e) =>
      `${e.first_name} ${e.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
      (e.department || "").toLowerCase().includes(search.toLowerCase()) ||
      (e.login_id || "").toLowerCase().includes(search.toLowerCase())
  );

  const totalEmployees = employees.length;
  const checkedInToday = todayStatuses.size;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${profile.first_name}`}
        description="HR Admin Dashboard — manage your team"
      />

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Users className="size-5" />}
          label="Total Employees"
          value={String(totalEmployees)}
          color="text-blue-600 bg-blue-50 dark:bg-blue-950 dark:text-blue-400"
        />
        <StatCard
          icon={<UserCheck className="size-5" />}
          label="Checked In Today"
          value={String(checkedInToday)}
          color="text-emerald-600 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-400"
        />
        <StatCard
          icon={<Calendar className="size-5" />}
          label="Absent Today"
          value={String(Math.max(0, totalEmployees - checkedInToday))}
          color="text-amber-600 bg-amber-50 dark:bg-amber-950 dark:text-amber-400"
        />
        <StatCard
          icon={<CreditCard className="size-5" />}
          label="Departments"
          value={String(new Set(employees.map((e) => e.department).filter(Boolean)).size)}
          color="text-purple-600 bg-purple-50 dark:bg-purple-950 dark:text-purple-400"
        />
      </div>

      {/* Activity Feed */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
          <Clock className="size-4" />
          Recent Activity
        </h3>
        <ActivityFeed companyId={profile.company_id} limit={10} />
      </div>

      {/* Search + Employee Grid */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search employees..."
              className="h-9 pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Link href="/dashboard/admin/employees">
            <Button variant="outline" size="sm">
              <Users className="mr-2 size-4" />
              View All
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          employees.length === 0 ? (
            <EmptyState
              icon={<Users className="size-12" />}
              title="No employees yet"
              description="Add your first employee from the Employee Directory."
              action={
                <Link href="/dashboard/admin/employees">
                  <Button size="sm">
                    <Users className="mr-2 size-4" />
                    Add Employees
                  </Button>
                </Link>
              }
            />
          ) : (
            <EmptyState
              icon={<Search className="size-12" />}
              title="No results found"
              description="No employees match your search. Try a different name, department, or Login ID."
            />
          )
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((emp) => {
              const isCheckedIn = todayStatuses.has(emp.id);
              const initials = `${emp.first_name?.[0] || ""}${emp.last_name?.[0] || ""}`.toUpperCase();

              return (
                <Link
                  key={emp.id}
                  href={`/dashboard/admin/employees?id=${emp.id}`}
                  className="group"
                >
                  <div className="rounded-xl border border-border bg-card p-4 hover:shadow-md hover:border-primary/20 transition-all duration-200 cursor-pointer">
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <Avatar className="size-10">
                          <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <span
                          className={`absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-card ${
                            isCheckedIn
                              ? "bg-emerald-500"
                              : "bg-orange-400"
                          }`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {emp.first_name} {emp.last_name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {emp.job_title || "—"}
                        </p>
                        <p className="text-xs text-muted-foreground/70 truncate mt-0.5">
                          {emp.department || "No department"}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================================
   EMPLOYEE DASHBOARD VIEW
   ========================================================================= */
function EmployeeDashboardView({ profile }: { profile: Profile }) {
  const [todayStatus, setTodayStatus] = useState<AttendanceRecord | null>(null);
  const [leaveBalances, setLeaveBalances] = useState<LeaveBalance[]>([]);
  const [monthAttendance, setMonthAttendance] = useState<AttendanceRecord[]>([]);
  const [checkingIn, setCheckingIn] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    const [statusResult, balanceResult, attendanceResult] = await Promise.all([
      getTodayStatus(profile.id),
      getLeaveBalances(profile.id),
      getMyAttendance(profile.id, new Date().getMonth() + 1, new Date().getFullYear()),
    ]);

    if (statusResult.success) setTodayStatus(statusResult.data ?? null);
    if (balanceResult.success && balanceResult.data) setLeaveBalances(balanceResult.data);
    if (attendanceResult.success && attendanceResult.data) setMonthAttendance(attendanceResult.data);
    setLoading(false);
  }, [profile.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCheckIn = async () => {
    setCheckingIn(true);
    const result = await checkIn(profile.id);
    if (result.success) {
      await loadData();
    }
    setCheckingIn(false);
  };

  const handleCheckOut = async () => {
    setCheckingIn(true);
    const result = await checkOut(profile.id);
    if (result.success) {
      await loadData();
    }
    setCheckingIn(false);
  };

  const isCheckedIn = !!todayStatus?.check_in_at;
  const isCheckedOut = !!todayStatus?.check_out_at;
  const daysPresent = monthAttendance.filter((a) => a.status === "present").length;
  const totalPtoAvailable = leaveBalances.reduce(
    (sum, b) => sum + (b.allocated_days - b.used_days),
    0
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Good ${getGreeting()}, ${profile.first_name}!`}
        description={`${profile.job_title || "Employee"}${profile.department ? ` \u2022 ${profile.department}` : ""}`}
        action={
          <div className="flex items-center gap-3">
            {isCheckedIn && !isCheckedOut && todayStatus?.check_in_at && (
              <Badge variant="secondary" className="text-xs">
                <Clock className="mr-1 size-3" />
                In since{" "}
                {formatTime(todayStatus.check_in_at, { hour: "2-digit", minute: "2-digit" })}
              </Badge>
            )}
            {isCheckedOut ? (
              <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 border-emerald-200">
                <UserCheck className="mr-1 size-3" />
                Day complete — {todayStatus?.work_hours?.toFixed(1)}h
              </Badge>
            ) : (
              <Button
                onClick={isCheckedIn ? handleCheckOut : handleCheckIn}
                disabled={checkingIn}
                size="sm"
                className={
                  isCheckedIn
                    ? "bg-warning hover:bg-warning/90 text-warning-foreground"
                    : "bg-success hover:bg-success/90 text-success-foreground"
                }
              >
                {checkingIn ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : isCheckedIn ? (
                  <LogOutIcon className="mr-2 size-4" />
                ) : (
                  <LogIn className="mr-2 size-4" />
                )}
                {isCheckedIn ? "Check Out" : "Check In"}
              </Button>
            )}
          </div>
        }
      />

      {/* Quick-access cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <QuickCard
          href="/dashboard/profile"
          icon={<Briefcase className="size-5" />}
          label="My Profile"
          value={profile.login_id || "—"}
          sublabel="Login ID"
          color="text-blue-600 bg-blue-50 dark:bg-blue-950 dark:text-blue-400"
        />
        <QuickCard
          href="/dashboard/attendance"
          icon={<UserCheck className="size-5" />}
          label="Attendance"
          value={`${daysPresent} days`}
          sublabel="Present this month"
          color="text-emerald-600 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-400"
        />
        <QuickCard
          href="/dashboard/leaves"
          icon={<Calendar className="size-5" />}
          label="Leave Balance"
          value={`${totalPtoAvailable} days`}
          sublabel="Available"
          color="text-amber-600 bg-amber-50 dark:bg-amber-950 dark:text-amber-400"
        />
        <QuickCard
          href="/dashboard/payroll"
          icon={<CreditCard className="size-5" />}
          label="Payroll"
          value="View"
          sublabel="Salary structure"
          color="text-purple-600 bg-purple-50 dark:bg-purple-950 dark:text-purple-400"
        />
      </div>

      {/* Leave Balances Breakdown */}
      {leaveBalances.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="font-semibold text-sm mb-3">Leave Balances</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {leaveBalances.map((b) => {
              const available = b.allocated_days - b.used_days;
              const typeName =
                (b.leave_type as LeaveBalance["leave_type"] & { name?: string })?.name ||
                "Leave";
              return (
                <div
                  key={b.id}
                  className="rounded-lg bg-muted/50 p-3 space-y-1"
                >
                  <p className="text-xs text-muted-foreground font-medium">
                    {typeName}
                  </p>
                  <p className="text-lg font-bold">
                    {available}{" "}
                    <span className="text-xs font-normal text-muted-foreground">
                      / {b.allocated_days} days
                    </span>
                  </p>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{
                        width: `${b.allocated_days > 0 ? ((b.used_days / b.allocated_days) * 100) : 0}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Shared UI helpers ──────────────────────────────────────────────────── */

function QuickCard({
  href,
  icon,
  label,
  value,
  sublabel,
  color,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  value: string;
  sublabel: string;
  color: string;
}) {
  return (
    <Link href={href} className="group">
      <div className="rounded-xl border border-border bg-card p-4 hover:shadow-md hover:border-primary/20 transition-all duration-200 space-y-3">
        <div className="flex items-center justify-between">
          <div className={`inline-flex items-center justify-center size-10 rounded-lg ${color}`}>
            {icon}
          </div>
          <ArrowRight className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <div>
          <p className="font-semibold text-sm">{label}</p>
          <p className="text-lg font-bold">{value}</p>
          <p className="text-xs text-muted-foreground">{sublabel}</p>
        </div>
      </div>
    </Link>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}