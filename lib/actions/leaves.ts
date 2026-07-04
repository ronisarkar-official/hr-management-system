"use server";

import { supabaseAdmin } from "@/lib/supabase/server";
import type { ActionResult, LeaveBalance, LeaveRequest } from "@/lib/types";

/**
 * Get leave balances for a profile (with leave type info).
 */
export async function getLeaveBalances(
  profileId: string
): Promise<ActionResult<LeaveBalance[]>> {
  try {
    const { data, error } = await supabaseAdmin
      .from("leave_balances")
      .select("*, leave_type:leave_types(*)")
      .eq("profile_id", profileId)
      .eq("year", new Date().getFullYear());

    if (error) return { success: false, error: error.message };
    return { success: true, data: (data || []) as LeaveBalance[] };
  } catch (err) {
    console.error("getLeaveBalances error:", err);
    return { success: false, error: "An unexpected error occurred." };
  }
}

/**
 * Create a leave request.
 */
export async function createLeaveRequest(data: {
  profileId: string;
  leaveTypeId: string;
  startDate: string;
  endDate: string;
  daysRequested: number;
  remarks?: string;
  attachmentUrl?: string;
}): Promise<ActionResult<LeaveRequest>> {
  try {
    // Validate balance
    const { data: balance } = await supabaseAdmin
      .from("leave_balances")
      .select("allocated_days, used_days")
      .eq("profile_id", data.profileId)
      .eq("leave_type_id", data.leaveTypeId)
      .eq("year", new Date().getFullYear())
      .single();

    if (balance) {
      const available = balance.allocated_days - balance.used_days;
      // Only check balance for leave types that have allocations (not unpaid)
      if (balance.allocated_days > 0 && data.daysRequested > available) {
        return {
          success: false,
          error: `Insufficient leave balance. Available: ${available} days.`,
        };
      }
    }

    const { data: request, error } = await supabaseAdmin
      .from("leave_requests")
      .insert({
        profile_id: data.profileId,
        leave_type_id: data.leaveTypeId,
        start_date: data.startDate,
        end_date: data.endDate,
        days_requested: data.daysRequested,
        remarks: data.remarks || null,
        attachment_url: data.attachmentUrl || null,
      })
      .select()
      .single();

    if (error) return { success: false, error: error.message };
    return { success: true, data: request as LeaveRequest };
  } catch (err) {
    console.error("createLeaveRequest error:", err);
    return { success: false, error: "An unexpected error occurred." };
  }
}

/**
 * Approve a leave request (admin-only).
 * Deducts from leave balance.
 */
export async function approveLeaveRequest(
  requestId: string,
  adminId: string,
  adminRemarks?: string
): Promise<ActionResult> {
  try {
    // Get the request
    const { data: request, error: reqError } = await supabaseAdmin
      .from("leave_requests")
      .select("*")
      .eq("id", requestId)
      .single();

    if (reqError || !request) {
      return { success: false, error: "Leave request not found." };
    }

    if (request.status !== "pending") {
      return { success: false, error: "This request has already been processed." };
    }

    // Update request status
    const { error: updateError } = await supabaseAdmin
      .from("leave_requests")
      .update({
        status: "approved",
        admin_remarks: adminRemarks || null,
        reviewed_by: adminId,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", requestId);

    if (updateError) return { success: false, error: updateError.message };

    // Deduct from leave balance
    const { data: balance } = await supabaseAdmin
      .from("leave_balances")
      .select("id, used_days")
      .eq("profile_id", request.profile_id)
      .eq("leave_type_id", request.leave_type_id)
      .eq("year", new Date().getFullYear())
      .single();

    if (balance) {
      await supabaseAdmin
        .from("leave_balances")
        .update({ used_days: balance.used_days + request.days_requested })
        .eq("id", balance.id);
    }

    return { success: true };
  } catch (err) {
    console.error("approveLeaveRequest error:", err);
    return { success: false, error: "An unexpected error occurred." };
  }
}

/**
 * Reject a leave request (admin-only).
 */
export async function rejectLeaveRequest(
  requestId: string,
  adminId: string,
  adminRemarks?: string
): Promise<ActionResult> {
  try {
    const { data: request } = await supabaseAdmin
      .from("leave_requests")
      .select("status")
      .eq("id", requestId)
      .single();

    if (!request) return { success: false, error: "Leave request not found." };
    if (request.status !== "pending") {
      return { success: false, error: "This request has already been processed." };
    }

    const { error } = await supabaseAdmin
      .from("leave_requests")
      .update({
        status: "rejected",
        admin_remarks: adminRemarks || null,
        reviewed_by: adminId,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", requestId);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err) {
    console.error("rejectLeaveRequest error:", err);
    return { success: false, error: "An unexpected error occurred." };
  }
}

/**
 * Get leave requests for a specific profile.
 */
export async function getMyLeaveRequests(
  profileId: string
): Promise<ActionResult<LeaveRequest[]>> {
  try {
    const { data, error } = await supabaseAdmin
      .from("leave_requests")
      .select("*, leave_type:leave_types(id, name)")
      .eq("profile_id", profileId)
      .order("created_at", { ascending: false });

    if (error) return { success: false, error: error.message };
    return { success: true, data: (data || []) as LeaveRequest[] };
  } catch (err) {
    console.error("getMyLeaveRequests error:", err);
    return { success: false, error: "An unexpected error occurred." };
  }
}

/**
 * Get all leave requests for a company (admin-only).
 */
export async function getAllLeaveRequests(
  companyId: string,
  status?: string
): Promise<ActionResult<LeaveRequest[]>> {
  try {
    // Get profile IDs for the company
    const { data: profiles } = await supabaseAdmin
      .from("profiles")
      .select("id, first_name, last_name, login_id, department")
      .eq("company_id", companyId);

    if (!profiles || profiles.length === 0) {
      return { success: true, data: [] };
    }

    const profileIds = profiles.map((p) => p.id);

    let query = supabaseAdmin
      .from("leave_requests")
      .select("*, leave_type:leave_types(id, name)")
      .in("profile_id", profileIds)
      .order("created_at", { ascending: false });

    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) return { success: false, error: error.message };

    // Attach profile info
    const profileMap = new Map(profiles.map((p) => [p.id, p]));
    const result = (data || []).map((r) => ({
      ...(r as LeaveRequest),
      profile: profileMap.get(r.profile_id),
    }));

    return { success: true, data: result as LeaveRequest[] };
  } catch (err) {
    console.error("getAllLeaveRequests error:", err);
    return { success: false, error: "An unexpected error occurred." };
  }
}

/**
 * Update leave allocation for an employee (admin-only).
 */
export async function updateLeaveAllocation(
  profileId: string,
  leaveTypeId: string,
  allocatedDays: number
): Promise<ActionResult> {
  try {
    const year = new Date().getFullYear();

    const { data: existing } = await supabaseAdmin
      .from("leave_balances")
      .select("id")
      .eq("profile_id", profileId)
      .eq("leave_type_id", leaveTypeId)
      .eq("year", year)
      .maybeSingle();

    if (existing) {
      const { error } = await supabaseAdmin
        .from("leave_balances")
        .update({ allocated_days: allocatedDays })
        .eq("id", existing.id);

      if (error) return { success: false, error: error.message };
    } else {
      const { error } = await supabaseAdmin
        .from("leave_balances")
        .insert({
          profile_id: profileId,
          leave_type_id: leaveTypeId,
          allocated_days: allocatedDays,
          used_days: 0,
          year,
        });

      if (error) return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error("updateLeaveAllocation error:", err);
    return { success: false, error: "An unexpected error occurred." };
  }
}
