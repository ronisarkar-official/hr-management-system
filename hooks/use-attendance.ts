"use client";

import { useState, useCallback } from "react";
import { checkIn, checkOut, getTodayStatus } from "@/lib/actions/attendance";
import type { AttendanceRecord } from "@/lib/types";

export function useAttendance(profileId: string) {
  const [todayStatus, setTodayStatus] = useState<AttendanceRecord | null>(null);
  const [checkingIn, setCheckingIn] = useState(false);

  const refresh = useCallback(async () => {
    const result = await getTodayStatus(profileId);
    if (result.success) setTodayStatus(result.data ?? null);
  }, [profileId]);

  const handleCheckIn = useCallback(async () => {
    setCheckingIn(true);
    const result = await checkIn(profileId);
    if (result.success) await refresh();
    setCheckingIn(false);
    return result;
  }, [profileId, refresh]);

  const handleCheckOut = useCallback(async () => {
    setCheckingIn(true);
    const result = await checkOut(profileId);
    if (result.success) await refresh();
    setCheckingIn(false);
    return result;
  }, [profileId, refresh]);

  const isCheckedIn = !!todayStatus?.check_in_at;
  const isCheckedOut = !!todayStatus?.check_out_at;

  return {
    todayStatus,
    checkingIn,
    isCheckedIn,
    isCheckedOut,
    handleCheckIn,
    handleCheckOut,
    refresh,
    setTodayStatus,
  };
}
