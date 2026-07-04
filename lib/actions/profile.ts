"use server";

import { supabaseAdmin } from "@/lib/supabase/server";
import type { ActionResult, Profile } from "@/lib/types";

/**
 * Get the current user's profile.
 */
export async function getMyProfile(
  userId: string
): Promise<ActionResult<Profile>> {
  try {
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error || !data) {
      return { success: false, error: error?.message || "Profile not found." };
    }

    return { success: true, data: data as Profile };
  } catch (err) {
    console.error("getMyProfile error:", err);
    return { success: false, error: "An unexpected error occurred." };
  }
}

/**
 * Get any profile by user ID (admin access).
 */
export async function getProfile(
  userId: string
): Promise<ActionResult<Profile>> {
  try {
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error || !data) {
      return { success: false, error: error?.message || "Profile not found." };
    }

    return { success: true, data: data as Profile };
  } catch (err) {
    console.error("getProfile error:", err);
    return { success: false, error: "An unexpected error occurred." };
  }
}

/**
 * Update a profile with field-level permission checks.
 * Employees can only update: phone, address, about, interests, skills,
 * certifications, personal_email, profile_picture_url, emergency_contact.
 * Admins can update everything.
 */
export async function updateProfile(
  profileId: string,
  data: Partial<Profile>,
  isAdmin: boolean
): Promise<ActionResult> {
  try {
    const employeeEditableFields = new Set([
      "phone",
      "address",
      "about",
      "interests",
      "skills",
      "certifications",
      "personal_email",
      "profile_picture_url",
      "emergency_contact",
      "gender",
      "marital_status",
      "date_of_birth",
      "nationality",
      "bank_account_no",
      "bank_ifsc",
      "tax_id",
      "government_id",
    ]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let updateData: Record<string, any>;

    if (isAdmin) {
      // Admin can edit everything except id, company_id, created_at
      const { id: _id, company_id: _cid, created_at: _ca, ...rest } = data;
      void _id; void _cid; void _ca;
      updateData = rest;
    } else {
      // Filter to only employee-editable fields
      updateData = {};
      for (const [key, value] of Object.entries(data)) {
        if (employeeEditableFields.has(key)) {
          updateData[key] = value;
        }
      }
    }

    if (Object.keys(updateData).length === 0) {
      return { success: false, error: "No editable fields provided." };
    }

    const { error } = await supabaseAdmin
      .from("profiles")
      .update(updateData)
      .eq("id", profileId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error("updateProfile error:", err);
    return { success: false, error: "An unexpected error occurred." };
  }
}

/**
 * Get all employees in a company (admin-only).
 */
export async function getAllEmployees(
  companyId: string
): Promise<ActionResult<Profile[]>> {
  try {
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("company_id", companyId)
      .order("created_at", { ascending: true });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: (data || []) as Profile[] };
  } catch (err) {
    console.error("getAllEmployees error:", err);
    return { success: false, error: "An unexpected error occurred." };
  }
}
