"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  UserCheck,
  Clock,
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
import { getMyProfile } from "@/lib/actions/profile";
import { getAllAttendance } from "@/lib/actions/attendance";

interface AttendanceWithProfile {
  id: string;
  profile_id: string;
  date: string;
  check_in_at: string | null;
  check_out_at: string | null;
  work_hours: number;
  extra_hours: number;
  status: string;
  profile: {
    first_name: string;
    last_name: string;
    login_id: string | null;
    department: string | null;
  };
}

export default function AdminAttendancePage() {
  const [records, setRecords] = useState<AttendanceWithProfile[]>([]);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async (cId: string, date: string) => {
    setLoading(true);
    const result = await getAllAttendance(cId, date);
    if (result.success && result.data) {
      setRecords(result.data as AttendanceWithProfile[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (data.user) {
        const profile = await getMyProfile(data.user.id);
        if (profile.success && profile.data) {
          setCompanyId(profile.data.company_id);
          await loadData(profile.data.company_id, selectedDate);
        }
      }
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (companyId) {
      loadData(companyId, selectedDate);
    }
  }, [selectedDate, companyId, loadData]);

  const prevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    setSelectedDate(d.toISOString().split("T")[0]);
  };

  const nextDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    setSelectedDate(d.toISOString().split("T")[0]);
  };

  const filtered = records.filter((r) => {
    const name = `${r.profile.first_name} ${r.profile.last_name}`.toLowerCase();
    const loginId = (r.profile.login_id || "").toLowerCase();
    const dept = (r.profile.department || "").toLowerCase();
    const q = search.toLowerCase();
    return name.includes(q) || loginId.includes(q) || dept.includes(q);
  });

  const dateDisplay = new Date(selectedDate + "T00:00:00").toLocaleDateString("en-IN", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <UserCheck className="size-6" />
          Attendance Overview
        </h1>
        <p className="text-sm text-muted-foreground">
          View employee attendance for any date
        </p>
      </div>

      {/* Date Navigation + Search */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" className="size-8" onClick={prevDay}>
            <ChevronLeft className="size-4" />
          </Button>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="h-8 rounded-md border border-input bg-background px-3 text-sm"
            />
          </div>
          <Button variant="outline" size="icon" className="size-8" onClick={nextDay}>
            <ChevronRight className="size-4" />
          </Button>
          <span className="text-sm text-muted-foreground hidden sm:inline">
            {dateDisplay}
          </span>
        </div>

        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search employees..."
            className="h-9 pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Summary */}
      <div className="flex items-center gap-4">
        <Badge variant="secondary" className="text-xs">
          <Clock className="mr-1 size-3" />
          {records.length} record{records.length !== 1 ? "s" : ""}
        </Badge>
      </div>

      {/* Table */}
      {loading ? (
        <Skeleton className="h-64 rounded-xl" />
      ) : (
        <div className="rounded-xl border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Login ID</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Check In</TableHead>
                <TableHead>Check Out</TableHead>
                <TableHead className="text-right">Work Hours</TableHead>
                <TableHead className="text-right">Extra Hours</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    {records.length === 0
                      ? "No attendance records for this date."
                      : "No matching employees."}
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((rec) => (
                  <TableRow key={rec.id}>
                    <TableCell className="text-sm font-medium">
                      {rec.profile.first_name} {rec.profile.last_name}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground font-mono">
                      {rec.profile.login_id || "—"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {rec.profile.department || "—"}
                    </TableCell>
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
                    <TableCell className="text-sm text-right">
                      {rec.work_hours ? Number(rec.work_hours).toFixed(1) : "—"}
                    </TableCell>
                    <TableCell className="text-sm text-right">
                      {Number(rec.extra_hours) > 0 ? (
                        <span className="text-emerald-600 font-medium">
                          +{Number(rec.extra_hours).toFixed(1)}
                        </span>
                      ) : "—"}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={rec.status} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
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
