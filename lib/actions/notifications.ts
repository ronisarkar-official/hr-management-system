"use server";

import { supabaseAdmin } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/types";

export interface AppNotification {
  id: string;
  profile_id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  created_at: string;
}

export async function createNotification(data: {
  profileId: string;
  title: string;
  message: string;
  type: string;
}): Promise<ActionResult<AppNotification>> {
  try {
    const { data: notif, error } = await supabaseAdmin
      .from("notifications")
      .insert({
        profile_id: data.profileId,
        title: data.title,
        message: data.message,
        type: data.type,
      })
      .select()
      .single();

    if (error) return { success: false, error: error.message };
    return { success: true, data: notif as AppNotification };
  } catch (err) {
    console.error("createNotification error:", err);
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function getMyNotifications(
  profileId: string,
  limit: number = 20
): Promise<ActionResult<AppNotification[]>> {
  try {
    const { data, error } = await supabaseAdmin
      .from("notifications")
      .select("*")
      .eq("profile_id", profileId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) return { success: false, error: error.message };
    return { success: true, data: (data || []) as AppNotification[] };
  } catch (err) {
    console.error("getMyNotifications error:", err);
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function getUnreadNotificationCount(
  profileId: string
): Promise<ActionResult<number>> {
  try {
    const { count, error } = await supabaseAdmin
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("profile_id", profileId)
      .eq("read", false);

    if (error) return { success: false, error: error.message };
    return { success: true, data: count || 0 };
  } catch (err) {
    console.error("getUnreadNotificationCount error:", err);
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function markNotificationRead(
  notificationId: string
): Promise<ActionResult> {
  try {
    const { error } = await supabaseAdmin
      .from("notifications")
      .update({ read: true })
      .eq("id", notificationId);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err) {
    console.error("markNotificationRead error:", err);
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function markAllNotificationsRead(
  profileId: string
): Promise<ActionResult> {
  try {
    const { error } = await supabaseAdmin
      .from("notifications")
      .update({ read: true })
      .eq("profile_id", profileId)
      .eq("read", false);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err) {
    console.error("markAllNotificationsRead error:", err);
    return { success: false, error: "An unexpected error occurred." };
  }
}
