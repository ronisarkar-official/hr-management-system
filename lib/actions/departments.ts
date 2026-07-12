"use server";

import { supabaseAdmin } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/types";

export interface Department {
  id: string;
  company_id: string;
  name: string;
  head_count?: number;
}

export async function getDepartments(
  companyId: string
): Promise<ActionResult<Department[]>> {
  try {
    const { data: profiles } = await supabaseAdmin
      .from("profiles")
      .select("department")
      .eq("company_id", companyId)
      .not("department", "is", null);

    const deptMap = new Map<string, number>();
    for (const p of profiles || []) {
      if (p.department) {
        deptMap.set(p.department, (deptMap.get(p.department) || 0) + 1);
      }
    }

    const departments: Department[] = Array.from(deptMap.entries()).map(
      ([name, count], index) => ({
        id: `dept-${index}`,
        company_id: companyId,
        name,
        head_count: count,
      })
    );

    return { success: true, data: departments.sort((a, b) => a.name.localeCompare(b.name)) };
  } catch (err) {
    console.error("getDepartments error:", err);
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function updateEmployeeDepartment(
  profileId: string,
  department: string | null
): Promise<ActionResult> {
  try {
    const { error } = await supabaseAdmin
      .from("profiles")
      .update({ department })
      .eq("id", profileId);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err) {
    console.error("updateEmployeeDepartment error:", err);
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function getDepartmentEmployees(
  companyId: string,
  department: string
): Promise<ActionResult<{ id: string; first_name: string; last_name: string; job_title: string | null; login_id: string | null }[]>> {
  try {
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select("id, first_name, last_name, job_title, login_id")
      .eq("company_id", companyId)
      .eq("department", department);

    if (error) return { success: false, error: error.message };
    return { success: true, data: data || [] };
  } catch (err) {
    console.error("getDepartmentEmployees error:", err);
    return { success: false, error: "An unexpected error occurred." };
  }
}
