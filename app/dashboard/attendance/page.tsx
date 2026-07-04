"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  LogIn,
  LogOut as LogOutIcon,
  Loader2,
  UserCheck,
  CalendarDays,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { getMyAttendance, getTodayStatus, checkIn, checkOut } from "@/lib/actions/attendance";
import type { AttendanceRecord } from "@/lib/types";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function AttendancePage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [todayStatus, setTodayStatus] = useState<AttendanceRecord | null>(null);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);
  const [checkingIn, setCheckingIn] = useState(false);

  const loadData = useCallback(async (uid: string) => {
    const [attendanceResult, statusResult] = await Promise.all([
      getMyAttendance(uid, month, year),
      getTodayStatus(uid),
    ]);
    if (attendanceResult.success && attendanceResult.data) setRecords(attendanceResult.data);
    if (statusResult.success) setTodayStatus(statusResult.data ?? null);
    setLoading(false);
  }, [month, year]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUserId(data.user.id);
        loadData(data.user.id);
      }
    });
  }, [loadData]);

  const handleCheckIn = async () => {
    if (!userId) return;
    setCheckingIn(true);
    await checkIn(userId);
    await loadData(userId);
    setCheckingIn(false);
  };

  const handleCheckOut = async () => {
    if (!userId) return;
    setCheckingIn(true);
    await checkOut(userId);
    await loadData(userId);
    setCheckingIn(false);
  };

  const prevMonth = () => {
    if (month === 1) { setMonth(12); setYear(year - 1); }
    else setMonth(month - 1);
    setLoading(true);
  };

  const nextMonth = () => {
    if (month === 12) { setMonth(1); setYear(year + 1); }
    else setMonth(month + 1);
    setLoading(true);
  };

  const isCheckedIn = !!todayStatus?.check_in_at;
  const isCheckedOut = !!todayStatus?.check_out_at;

  // Stats
  const daysPresent = records.filter((r) => r.status === "present").length;
  const daysOnLeave = records.filter((r) => r.status === "on_leave").length;
  const daysInMonth = new Date(year, month, 0).getDate();
  const totalWorkHours = records.reduce((sum, r) => sum + (r.work_hours || 0), 0);
  const avgWorkHours = daysPresent > 0 ? totalWorkHours / daysPresent : 0;

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Attendance</h1>
          <p className="text-sm text-muted-foreground">
            Track your daily check-ins and work hours
          </p>
        </div>

        {/* Check In / Check Out */}
        <div className="flex items-center gap-3">
          {isCheckedIn && !isCheckedOut && todayStatus?.check_in_at && (
            <Badge variant="secondary" className="text-xs">
              <Clock className="mr-1 size-3" />
              In since{" "}
              {new Date(todayStatus.check_in_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Badge>
          )}
          {isCheckedOut ? (
            <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
              <UserCheck className="mr-1 size-3" />
              Day complete — {todayStatus?.work_hours?.toFixed(1)}h
            </Badge>
          ) : (
            <Button
              onClick={isCheckedIn ? handleCheckOut : handleCheckIn}
              disabled={checkingIn}
              size="sm"
              className={isCheckedIn ? "bg-amber-600 hover:bg-amber-700 text-white" : "bg-emerald-600 hover:bg-emerald-700 text-white"}
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
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard icon={<UserCheck className="size-5" />} label="Days Present" value={String(daysPresent)} color="text-emerald-600 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-400" />
        <StatCard icon={<AlertCircle className="size-5" />} label="Days on Leave" value={String(daysOnLeave)} color="text-amber-600 bg-amber-50 dark:bg-amber-950 dark:text-amber-400" />
        <StatCard icon={<CalendarDays className="size-5" />} label="Working Days" value={String(daysInMonth)} color="text-blue-600 bg-blue-50 dark:bg-blue-950 dark:text-blue-400" />
        <StatCard icon={<TrendingUp className="size-5" />} label="Avg Work Hours" value={avgWorkHours.toFixed(1) + "h"} color="text-purple-600 bg-purple-50 dark:bg-purple-950 dark:text-purple-400" />
      </div>

      {/* Month Navigation */}
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" className="size-8" onClick={prevMonth}>
          <ChevronLeft className="size-4" />
        </Button>
        <span className="font-semibold text-sm min-w-[140px] text-center">
          {MONTHS[month - 1]} {year}
        </span>
        <Button variant="outline" size="icon" className="size-8" onClick={nextMonth}>
          <ChevronRight className="size-4" />
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-xl border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Day</TableHead>
              <TableHead>Check In</TableHead>
              <TableHead>Check Out</TableHead>
              <TableHead className="text-right">Work Hours</TableHead>
              <TableHead className="text-right">Extra Hours</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No attendance records for this month.
                </TableCell>
              </TableRow>
            ) : (
              records.map((rec) => {
                const date = new Date(rec.date);
                const dayName = DAYS[date.getDay()];
                return (
                  <TableRow key={rec.id}>
                    <TableCell className="text-sm font-medium">
                      {date.toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{dayName}</TableCell>
                    <TableCell className="text-sm">
                      {rec.check_in_at
                        ? new Date(rec.check_in_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                        : "—"}
                    </TableCell>
                    <TableCell className="text-sm">
                      {rec.check_out_at
                        ? new Date(rec.check_out_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                        : "—"}
                    </TableCell>
                    <TableCell className="text-sm text-right">{rec.work_hours?.toFixed(1) || "—"}</TableCell>
                    <TableCell className="text-sm text-right">
                      {rec.extra_hours > 0 ? (
                        <span className="text-emerald-600 font-medium">+{rec.extra_hours.toFixed(1)}</span>
                      ) : "—"}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={rec.status} />
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

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-2">
      <div className={`inline-flex items-center justify-center size-9 rounded-lg ${color}`}>{icon}</div>
      <p className="text-xl font-bold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    present: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
    absent: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
    on_leave: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
    half_day: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400",
  };
  return (
    <Badge className={`text-[10px] ${styles[status] || ""}`}>
      {status.replace("_", " ").replace(/^\w/, (c) => c.toUpperCase())}
    </Badge>
  );
}
