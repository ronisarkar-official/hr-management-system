"use server";

import { supabaseAdmin } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/types";

export interface ActivityEvent {
  id: string;
  company_id: string;
  profile_id: string;
  action: string;
  details: string | null;
  created_at: string;
  profile?: {
    first_name: string;
    last_name: string;
    role: string;
    profile_picture_url: string | null;
  };
}

export async function logActivity(data: {
  companyId: string;
  profileId: string;
  action: string;
  details?: string;
}): Promise<ActionResult> {
  try {
    const { error } = await supabaseAdmin
      .from("activity_log")
      .insert({
        company_id: data.companyId,
        profile_id: data.profileId,
        action: data.action,
        details: data.details || null,
      });

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err) {
    console.error("logActivity error:", err);
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function getRecentActivity(
  companyId: string,
  limit: number = 20
): Promise<ActionResult<ActivityEvent[]>> {
  try {
    const { data, error } = await supabaseAdmin
      .from("activity_log")
      .select("*, profile:profiles!activity_log_profile_id_fkey(first_name, last_name, role, profile_picture_url)")
      .eq("company_id", companyId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) return { success: false, error: error.message };
    return { success: true, data: (data || []) as ActivityEvent[] };
  } catch (err) {
    console.error("getRecentActivity error:", err);
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function getMyActivity(
  profileId: string,
  limit: number = 10
): Promise<ActionResult<ActivityEvent[]>> {
  try {
    const { data, error } = await supabaseAdmin
      .from("activity_log")
      .select("*")
      .eq("profile_id", profileId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) return { success: false, error: error.message };
    return { success: true, data: (data || []) as ActivityEvent[] };
  } catch (err) {
    console.error("getMyActivity error:", err);
    return { success: false, error: "An unexpected error occurred." };
  }
}
