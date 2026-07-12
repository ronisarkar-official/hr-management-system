"use server";

import { supabaseAdmin } from "@/lib/supabase/server";
import { sendLeaveStatusEmail, sendWelcomeEmail } from "@/lib/services/email";
import type { ActionResult } from "@/lib/types";

export async function notifyLeaveStatus(params: {
  requestId: string;
  status: "approved" | "rejected";
  adminRemarks?: string | null;
}): Promise<ActionResult> {
  try {
    const { data: request } = await supabaseAdmin
      .from("leave_requests")
      .select("*, leave_type:leave_types(id, name), profile:profiles!leave_requests_profile_id_fkey(email, first_name, last_name)")
      .eq("id", params.requestId)
      .single();

    if (!request) return { success: false, error: "Request not found." };

    const profile = request.profile as { email: string; first_name: string; last_name: string };
    const leaveType = request.leave_type as { name: string };

    await sendLeaveStatusEmail({
      employeeEmail: profile.email,
      employeeName: `${profile.first_name} ${profile.last_name}`,
      leaveType: leaveType?.name || "Leave",
      startDate: request.start_date,
      endDate: request.end_date,
      status: params.status,
      adminRemarks: params.adminRemarks,
    });

    return { success: true };
  } catch (err) {
    console.error("notifyLeaveStatus error:", err);
    return { success: false, error: "Failed to send notification." };
  }
}

export async function notifyNewEmployee(params: {
  profileId: string;
  loginId: string;
  tempPassword: string;
}): Promise<ActionResult> {
  try {
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("email, first_name, last_name")
      .eq("id", params.profileId)
      .single();

    if (!profile) return { success: false, error: "Profile not found." };

    await sendWelcomeEmail({
      email: profile.email,
      name: `${profile.first_name} ${profile.last_name}`,
      loginId: params.loginId,
      tempPassword: params.tempPassword,
    });

    return { success: true };
  } catch (err) {
    console.error("notifyNewEmployee error:", err);
    return { success: false, error: "Failed to send notification." };
  }
}
