"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Calendar as CalendarIcon,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  Paperclip,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/lib/supabase/client";
import { getLeaveBalances, getMyLeaveRequests, createLeaveRequest } from "@/lib/actions/leaves";
import { formatDateNumeric } from "@/lib/locale";
import type { LeaveBalance, LeaveRequest, LeaveType } from "@/lib/types";

export default function LeavesPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [balances, setBalances] = useState<LeaveBalance[]>([]);
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async (uid: string) => {
    const [balResult, reqResult] = await Promise.all([
      getLeaveBalances(uid),
      getMyLeaveRequests(uid),
    ]);
    if (balResult.success && balResult.data) setBalances(balResult.data);
    if (reqResult.success && reqResult.data) setRequests(reqResult.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUserId(data.user.id);
        loadData(data.user.id);
      }
    });
  }, [loadData]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Leave Management"
        description="View your balances and submit time-off requests"
        icon={<CalendarIcon className="size-6" />}
        action={userId && (
          <NewLeaveRequestDialog
            userId={userId}
            balances={balances}
            onSuccess={() => loadData(userId)}
          />
        )}
      />

      {/* Leave Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {balances.map((b) => {
          const lt = b.leave_type as LeaveType | undefined;
          const typeName = lt?.name || "Leave";
          const available = b.allocated_days - b.used_days;
          const pct = b.allocated_days > 0 ? (b.used_days / b.allocated_days) * 100 : 0;

          return (
            <div key={b.id} className="rounded-xl border border-border bg-card p-5 space-y-3 hover:shadow-md hover:border-primary/20 transition-all duration-200">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-sm">{typeName}</p>
                <Badge variant="secondary" className="text-[10px]">
                  {b.used_days} / {b.allocated_days} used
                </Badge>
              </div>
              <p className="text-3xl font-bold">
                {available}{" "}
                <span className="text-sm font-normal text-muted-foreground">
                  days available
                </span>
              </p>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    pct > 80 ? "bg-destructive" : pct > 50 ? "bg-amber-500" : "bg-emerald-500"
                  }`}
                  style={{ width: `${Math.min(pct, 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Leave Requests Table */}
      <div className="space-y-3">
        <h3 className="font-semibold text-sm">Leave Requests</h3>
        <div className="rounded-xl border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead className="text-right">Days</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Remarks</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-0">
                    <EmptyState
                      icon={<CalendarIcon className="size-12" />}
                      title="No leave requests yet"
                      description="Submit a new leave request to get started."
                    />
                  </TableCell>
                </TableRow>
              ) : (
                requests.map((req) => {
                  const lt = req.leave_type as LeaveType | undefined;
                  return (
                    <TableRow key={req.id}>
                      <TableCell className="text-sm font-medium">
                        {lt?.name || "—"}
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatDateNumeric(req.start_date)}
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatDateNumeric(req.end_date)}
                      </TableCell>
                      <TableCell className="text-sm text-right">{req.days_requested}</TableCell>
                      <TableCell>
                        <LeaveStatusBadge status={req.status} />
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">
                        {req.remarks || "—"}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

/* ── New Leave Request Dialog ─────────────────────────────────────────── */

function NewLeaveRequestDialog({
  userId,
  balances,
  onSuccess,
}: {
  userId: string;
  balances: LeaveBalance[];
  onSuccess: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [leaveTypeId, setLeaveTypeId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const daysRequested =
    startDate && endDate
      ? Math.max(
          1,
          Math.ceil(
            (new Date(endDate).getTime() - new Date(startDate).getTime()) /
              (1000 * 60 * 60 * 24)
          ) + 1
        )
      : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!leaveTypeId || !startDate || !endDate) {
      setError("Please fill all required fields.");
      return;
    }

    if (daysRequested <= 0) {
      setError("End date must be on or after start date.");
      return;
    }

    setLoading(true);
    const result = await createLeaveRequest({
      profileId: userId,
      leaveTypeId,
      startDate,
      endDate,
      daysRequested,
      remarks: remarks || undefined,
    });

    if (!result.success) {
      setError(result.error || "Failed to submit request.");
      setLoading(false);
      return;
    }

    setOpen(false);
    setLeaveTypeId("");
    setStartDate("");
    setEndDate("");
    setRemarks("");
    setLoading(false);
    onSuccess();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-2 size-4" />
          New Request
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle>New Leave Request</DialogTitle>
          <DialogDescription>
            Submit a time-off request for your manager to review.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <Label className="text-xs">Leave Type</Label>
            <Select value={leaveTypeId} onValueChange={setLeaveTypeId}>
              <SelectTrigger className="h-8">
                <SelectValue placeholder="Select type..." />
              </SelectTrigger>
              <SelectContent>
                {balances.map((b) => {
                  const lt = b.leave_type as LeaveType | undefined;
                  const available = b.allocated_days - b.used_days;
                  return (
                    <SelectItem key={b.leave_type_id} value={b.leave_type_id}>
                      {lt?.name || "Leave"} ({available} days available)
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Start Date</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="h-8"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">End Date</Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="h-8"
                required
                min={startDate}
              />
            </div>
          </div>

          {daysRequested > 0 && (
            <Badge variant="secondary" className="text-xs">
              <CalendarIcon className="mr-1 size-3" />
              {daysRequested} day{daysRequested > 1 ? "s" : ""} requested
            </Badge>
          )}

          <div className="space-y-1.5">
            <Label className="text-xs">Remarks (optional)</Label>
            <Textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              rows={3}
              placeholder="Reason for leave..."
              className="text-sm"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} size="sm">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} size="sm">
              {loading ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Paperclip className="mr-2 size-4" />}
              Submit Request
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
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
