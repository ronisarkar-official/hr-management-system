"use server";

import { supabaseAdmin } from "@/lib/supabase/server";
import { generateLoginId } from "@/lib/login-id";
import type { ActionResult, CreateEmployeeResult } from "@/lib/types";

/**
 * Sign up a new company admin.
 * Creates: company → auth user → profile row.
 */
export async function signUpCompanyAdmin(formData: {
  companyName: string;
  companyCode: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}): Promise<ActionResult<{ userId: string; companyId: string }>> {
  try {
    const code = formData.companyCode.toUpperCase().trim();

    // Validate company code
    if (code.length < 2 || code.length > 6 || !/^[A-Z]+$/.test(code)) {
      return { success: false, error: "Company code must be 2-6 uppercase letters." };
    }

    // Check if company code already exists
    const { data: existingCompany } = await supabaseAdmin
      .from("companies")
      .select("id")
      .eq("company_code", code)
      .single();

    if (existingCompany) {
      return { success: false, error: "This company code is already taken." };
    }

    // 1. Create the company
    const { data: company, error: companyError } = await supabaseAdmin
      .from("companies")
      .insert({ name: formData.companyName.trim(), company_code: code })
      .select()
      .single();

    if (companyError || !company) {
      return { success: false, error: companyError?.message || "Failed to create company." };
    }

    // 2. Create auth user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: formData.email.trim(),
      password: formData.password,
      email_confirm: true,
      user_metadata: {
        full_name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
        role: "admin",
      },
    });

    if (authError || !authData.user) {
      // Rollback company creation
      await supabaseAdmin.from("companies").delete().eq("id", company.id);
      return { success: false, error: authError?.message || "Failed to create user account." };
    }

    // 3. Generate Login ID
    const joiningYear = new Date().getFullYear();
    const loginId = await generateLoginId(code, joiningYear, company.id);

    // 4. Create profile
    const { error: profileError } = await supabaseAdmin.from("profiles").insert({
      id: authData.user.id,
      company_id: company.id,
      login_id: loginId,
      first_name: formData.firstName.trim(),
      last_name: formData.lastName.trim(),
      email: formData.email.trim(),
      role: "admin",
      date_of_joining: new Date().toISOString().split("T")[0],
    });

    if (profileError) {
      // Rollback
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      await supabaseAdmin.from("companies").delete().eq("id", company.id);
      return { success: false, error: profileError.message };
    }

    // 5. Create default leave balances for admin
    const { data: leaveTypes } = await supabaseAdmin
      .from("leave_types")
      .select("id, default_allocation_days")
      .eq("company_id", company.id);

    if (leaveTypes && leaveTypes.length > 0) {
      const balances = leaveTypes.map((lt) => ({
        profile_id: authData.user.id,
        leave_type_id: lt.id,
        allocated_days: lt.default_allocation_days,
        used_days: 0,
        year: joiningYear,
      }));
      await supabaseAdmin.from("leave_balances").insert(balances);
    }

    return {
      success: true,
      data: { userId: authData.user.id, companyId: company.id },
    };
  } catch (err) {
    console.error("signUpCompanyAdmin error:", err);
    return { success: false, error: "An unexpected error occurred." };
  }
}

/**
 * Create a new employee (admin-only).
 * Creates: auth user with temp password → profile → default leave balances.
 */
export async function createEmployee(formData: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  department?: string;
  jobTitle?: string;
  dateOfJoining?: string;
  adminUserId: string;
}): Promise<ActionResult<CreateEmployeeResult>> {
  try {
    // Look up admin's company
    const { data: adminProfile } = await supabaseAdmin
      .from("profiles")
      .select("company_id, role")
      .eq("id", formData.adminUserId)
      .single();

    if (!adminProfile || adminProfile.role !== "admin") {
      return { success: false, error: "Only admins can create employees." };
    }

    const companyId = adminProfile.company_id;

    // Get company code
    const { data: company } = await supabaseAdmin
      .from("companies")
      .select("company_code")
      .eq("id", companyId)
      .single();

    if (!company) {
      return { success: false, error: "Company not found." };
    }

    // Generate temp password (12 chars, mixed)
    const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%";
    let tempPassword = "";
    for (let i = 0; i < 12; i++) {
      tempPassword += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    // Create auth user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: formData.email.trim(),
      password: tempPassword,
      email_confirm: true,
      user_metadata: {
        full_name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
        role: "employee",
      },
    });

    if (authError || !authData.user) {
      return { success: false, error: authError?.message || "Failed to create user." };
    }

    // Generate Login ID
    const joiningYear = formData.dateOfJoining
      ? new Date(formData.dateOfJoining).getFullYear()
      : new Date().getFullYear();
    const loginId = await generateLoginId(company.company_code, joiningYear, companyId);

    // Create profile
    const { error: profileError } = await supabaseAdmin.from("profiles").insert({
      id: authData.user.id,
      company_id: companyId,
      login_id: loginId,
      first_name: formData.firstName.trim(),
      last_name: formData.lastName.trim(),
      email: formData.email.trim(),
      phone: formData.phone?.trim() || null,
      role: "employee",
      department: formData.department?.trim() || null,
      job_title: formData.jobTitle?.trim() || null,
      date_of_joining: formData.dateOfJoining || new Date().toISOString().split("T")[0],
    });

    if (profileError) {
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      return { success: false, error: profileError.message };
    }

    // Create default leave balances
    const { data: leaveTypes } = await supabaseAdmin
      .from("leave_types")
      .select("id, default_allocation_days")
      .eq("company_id", companyId);

    if (leaveTypes && leaveTypes.length > 0) {
      const currentYear = new Date().getFullYear();
      const balances = leaveTypes.map((lt) => ({
        profile_id: authData.user.id,
        leave_type_id: lt.id,
        allocated_days: lt.default_allocation_days,
        used_days: 0,
        year: currentYear,
      }));
      await supabaseAdmin.from("leave_balances").insert(balances);
    }

    console.log(`[HRMS] Employee created — Login ID: ${loginId}, Temp Password: ${tempPassword}`);

    return {
      success: true,
      data: {
        loginId,
        tempPassword,
        profileId: authData.user.id,
      },
    };
  } catch (err) {
    console.error("createEmployee error:", err);
    return { success: false, error: "An unexpected error occurred." };
  }
}

/**
 * Resolve a Login ID to the user's email address (for login flow).
 */
export async function resolveLoginId(
  loginId: string
): Promise<ActionResult<{ email: string }>> {
  try {
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select("email")
      .eq("login_id", loginId.toUpperCase().trim())
      .single();

    if (error || !data) {
      return { success: false, error: "Login ID not found." };
    }

    return { success: true, data: { email: data.email } };
  } catch (err) {
    console.error("resolveLoginId error:", err);
    return { success: false, error: "An unexpected error occurred." };
  }
}
