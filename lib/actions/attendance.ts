"use server";

import { supabaseAdmin } from "@/lib/supabase/server";
import { createNotification } from "@/lib/actions/notifications";
import { logActivity } from "@/lib/actions/activity";
import type { ActionResult, AttendanceRecord } from "@/lib/types";

/**
 * Check in — creates an attendance row for today.
 */
export async function checkIn(
  profileId: string
): Promise<ActionResult<AttendanceRecord>> {
  try {
    const today = new Date().toISOString().split("T")[0];

    // Check if already checked in today
    const { data: existing } = await supabaseAdmin
      .from("attendance")
      .select("*")
      .eq("profile_id", profileId)
      .eq("date", today)
      .single();

    if (existing?.check_in_at) {
      return { success: false, error: "Already checked in today." };
    }

    const now = new Date().toISOString();

    if (existing) {
      // Update existing row
      const { data, error } = await supabaseAdmin
        .from("attendance")
        .update({ check_in_at: now, status: "present" })
        .eq("id", existing.id)
        .select()
        .single();

      if (error) return { success: false, error: error.message };
      return { success: true, data: data as AttendanceRecord };
    }

    // Create new row
    const { data, error } = await supabaseAdmin
      .from("attendance")
      .insert({
        profile_id: profileId,
        date: today,
        check_in_at: now,
        status: "present",
      })
      .select()
      .single();

    if (error) return { success: false, error: error.message };

    // Log activity
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("company_id")
      .eq("id", profileId)
      .single();
    if (profile) {
      await Promise.all([
        logActivity({
          companyId: profile.company_id,
          profileId,
          action: "check_in",
          details: "Checked in",
        }),
        createNotification({
          profileId,
          title: "Check-In",
          message: "You checked in successfully.",
          type: "attendance",
        }),
      ]);
    }

    return { success: true, data: data as AttendanceRecord };
  } catch (err) {
    console.error("checkIn error:", err);
    return { success: false, error: "An unexpected error occurred." };
  }
}

/**
 * Check out — updates today's attendance with check_out_at and calculated hours.
 */
export async function checkOut(
  profileId: string
): Promise<ActionResult<AttendanceRecord>> {
  try {
    const today = new Date().toISOString().split("T")[0];

    const { data: existing } = await supabaseAdmin
      .from("attendance")
      .select("*")
      .eq("profile_id", profileId)
      .eq("date", today)
      .single();

    if (!existing || !existing.check_in_at) {
      return { success: false, error: "You haven't checked in today." };
    }

    if (existing.check_out_at) {
      return { success: false, error: "Already checked out today." };
    }

    const now = new Date();
    const checkInTime = new Date(existing.check_in_at);
    const diffHours = (now.getTime() - checkInTime.getTime()) / (1000 * 60 * 60);
    const workHours = Math.round(diffHours * 100) / 100;
    const extraHours = Math.max(0, Math.round((workHours - 8) * 100) / 100);

    const { data, error } = await supabaseAdmin
      .from("attendance")
      .update({
        check_out_at: now.toISOString(),
        work_hours: workHours,
        extra_hours: extraHours,
      })
      .eq("id", existing.id)
      .select()
      .single();

    if (error) return { success: false, error: error.message };

    // Log activity
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("company_id")
      .eq("id", profileId)
      .single();
    if (profile) {
      await Promise.all([
        logActivity({
          companyId: profile.company_id,
          profileId,
          action: "check_out",
          details: `Checked out after ${workHours.toFixed(1)}h`,
        }),
        createNotification({
          profileId,
          title: "Check-Out",
          message: `You checked out after ${workHours.toFixed(1)} hours.`,
          type: "attendance",
        }),
      ]);
    }

    return { success: true, data: data as AttendanceRecord };
  } catch (err) {
    console.error("checkOut error:", err);
    return { success: false, error: "An unexpected error occurred." };
  }
}

/**
 * Get today's attendance status for a profile.
 */
export async function getTodayStatus(
  profileId: string
): Promise<ActionResult<AttendanceRecord | null>> {
  try {
    const today = new Date().toISOString().split("T")[0];

    const { data, error } = await supabaseAdmin
      .from("attendance")
      .select("*")
      .eq("profile_id", profileId)
      .eq("date", today)
      .maybeSingle();

    if (error) return { success: false, error: error.message };
    return { success: true, data: (data as AttendanceRecord) || null };
  } catch (err) {
    console.error("getTodayStatus error:", err);
    return { success: false, error: "An unexpected error occurred." };
  }
}

/**
 * Get attendance records for a specific month.
 */
export async function getMyAttendance(
  profileId: string,
  month: number,
  year: number
): Promise<ActionResult<AttendanceRecord[]>> {
  try {
    const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
    const endDate = new Date(year, month, 0).toISOString().split("T")[0]; // last day of month

    const { data, error } = await supabaseAdmin
      .from("attendance")
      .select("*")
      .eq("profile_id", profileId)
      .gte("date", startDate)
      .lte("date", endDate)
      .order("date", { ascending: true });

    if (error) return { success: false, error: error.message };
    return { success: true, data: (data || []) as AttendanceRecord[] };
  } catch (err) {
    console.error("getMyAttendance error:", err);
    return { success: false, error: "An unexpected error occurred." };
  }
}

/**
 * Get all attendance for a company on a specific date (admin-only).
 */
export async function getAllAttendance(
  companyId: string,
  date: string
): Promise<ActionResult<(AttendanceRecord & { profile: { first_name: string; last_name: string; login_id: string | null; department: string | null } })[]>> {
  try {
    // Get all profile IDs for the company
    const { data: profiles } = await supabaseAdmin
      .from("profiles")
      .select("id, first_name, last_name, login_id, department")
      .eq("company_id", companyId);

    if (!profiles) return { success: true, data: [] };

    const profileIds = profiles.map((p) => p.id);

    const { data: attendance, error } = await supabaseAdmin
      .from("attendance")
      .select("*")
      .in("profile_id", profileIds)
      .eq("date", date);

    if (error) return { success: false, error: error.message };

    // Merge profile info
    const profileMap = new Map(profiles.map((p) => [p.id, p]));
    const result = (attendance || []).map((a) => ({
      ...(a as AttendanceRecord),
      profile: profileMap.get(a.profile_id) || { first_name: "", last_name: "", login_id: null, department: null },
    }));

    return { success: true, data: result };
  } catch (err) {
    console.error("getAllAttendance error:", err);
    return { success: false, error: "An unexpected error occurred." };
  }
}
