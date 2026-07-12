"use server";

import { supabaseAdmin } from "@/lib/supabase/server";
import { logActivity } from "@/lib/actions/activity";
import type { ActionResult, Company, Profile } from "@/lib/types";

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

    let updateData: Record<string, unknown>;

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

/**
 * Delete an employee (admin-only).
 * Removes auth user (cascades to profile, leave balances, attendance, etc.).
 */
export async function deleteEmployee(
  employeeId: string,
  adminUserId: string
): Promise<ActionResult> {
  try {
    // Verify admin exists and get their company
    const { data: adminProfile } = await supabaseAdmin
      .from("profiles")
      .select("company_id, role")
      .eq("id", adminUserId)
      .single();

    if (!adminProfile || adminProfile.role !== "admin") {
      return { success: false, error: "Only admins can delete employees." };
    }

    // Get the employee to verify same company
    const { data: employee } = await supabaseAdmin
      .from("profiles")
      .select("company_id, first_name, last_name, login_id")
      .eq("id", employeeId)
      .single();

    if (!employee) {
      return { success: false, error: "Employee not found." };
    }

    if (employee.company_id !== adminProfile.company_id) {
      return { success: false, error: "Employee does not belong to your company." };
    }

    // Clean up orphaned data before deleting auth user
    await supabaseAdmin.from("activity_log").delete().eq("profile_id", employeeId);
    await supabaseAdmin.from("notifications").delete().eq("profile_id", employeeId);

    // Delete auth user — cascades to profile, leave_balances, leave_requests,
    // attendance, salary_structures (and their salary_components)
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(employeeId);

    if (authError) {
      return { success: false, error: authError.message };
    }

    // Log activity
    await logActivity({
      companyId: adminProfile.company_id,
      profileId: adminUserId,
      action: "employee_deleted",
      details: `Deleted employee ${employee.first_name} ${employee.last_name} (${employee.login_id || employeeId})`,
    });

    return { success: true };
  } catch (err) {
    console.error("deleteEmployee error:", err);
    return { success: false, error: "An unexpected error occurred." };
  }
}

/**
 * Get company details by ID.
 */
export async function getCompany(
  companyId: string
): Promise<ActionResult<Pick<Company, "name" | "company_code">>> {
  try {
    const { data, error } = await supabaseAdmin
      .from("companies")
      .select("name, company_code")
      .eq("id", companyId)
      .single();

    if (error || !data) {
      return { success: false, error: error?.message || "Company not found." };
    }

    return { success: true, data };
  } catch (err) {
    console.error("getCompany error:", err);
    return { success: false, error: "An unexpected error occurred." };
  }
}
