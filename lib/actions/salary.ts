"use server";

import { supabaseAdmin } from "@/lib/supabase/server";
import { createNotification } from "@/lib/actions/notifications";
import { logActivity } from "@/lib/actions/activity";
import type { ActionResult, SalaryStructure, SalaryComponent } from "@/lib/types";

/**
 * Get salary structure + components for a profile.
 */
export async function getSalaryStructure(
  profileId: string
): Promise<ActionResult<{ structure: SalaryStructure; components: SalaryComponent[] } | null>> {
  try {
    const { data: structure, error } = await supabaseAdmin
      .from("salary_structures")
      .select("*")
      .eq("profile_id", profileId)
      .maybeSingle();

    if (error) return { success: false, error: error.message };
    if (!structure) return { success: true, data: null };

    const { data: components, error: compError } = await supabaseAdmin
      .from("salary_components")
      .select("*")
      .eq("salary_structure_id", structure.id)
      .order("name", { ascending: true });

    if (compError) return { success: false, error: compError.message };

    return {
      success: true,
      data: {
        structure: structure as SalaryStructure,
        components: (components || []) as SalaryComponent[],
      },
    };
  } catch (err) {
    console.error("getSalaryStructure error:", err);
    return { success: false, error: "An unexpected error occurred." };
  }
}

/**
 * Create or update a salary structure (admin-only).
 */
export async function upsertSalaryStructure(
  profileId: string,
  data: {
    wage_type: "monthly" | "hourly";
    monthly_wage: number;
    working_days_per_week?: number;
    working_hours_per_week?: number;
    pf_rate?: number;
    professional_tax?: number;
  }
): Promise<ActionResult<SalaryStructure>> {
  try {
    const yearlyWage = data.monthly_wage * 12;

    // Get profile for company_id
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("company_id, first_name, last_name")
      .eq("id", profileId)
      .single();
    if (!profile) return { success: false, error: "Profile not found." };

    const { data: existing } = await supabaseAdmin
      .from("salary_structures")
      .select("id")
      .eq("profile_id", profileId)
      .maybeSingle();

    if (existing) {
      const { data: updated, error } = await supabaseAdmin
        .from("salary_structures")
        .update({
          wage_type: data.wage_type,
          monthly_wage: data.monthly_wage,
          yearly_wage: yearlyWage,
          working_days_per_week: data.working_days_per_week ?? 5,
          working_hours_per_week: data.working_hours_per_week ?? 40,
          pf_rate: data.pf_rate ?? 12,
          professional_tax: data.professional_tax ?? 200,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id)
        .select()
        .single();

      if (error) return { success: false, error: error.message };

      // Notify + log
      await Promise.all([
        createNotification({
          profileId,
          title: "Salary Updated",
          message: "Your salary structure has been updated.",
          type: "salary_updated",
        }),
        logActivity({
          companyId: profile.company_id,
          profileId,
          action: "salary_updated",
          details: "Salary structure updated",
        }),
      ]);

      return { success: true, data: updated as SalaryStructure };
    }

    const { data: created, error } = await supabaseAdmin
      .from("salary_structures")
      .insert({
        profile_id: profileId,
        wage_type: data.wage_type,
        monthly_wage: data.monthly_wage,
        yearly_wage: yearlyWage,
        working_days_per_week: data.working_days_per_week ?? 5,
        working_hours_per_week: data.working_hours_per_week ?? 40,
        pf_rate: data.pf_rate ?? 12,
        professional_tax: data.professional_tax ?? 200,
      })
      .select()
      .single();

    if (error) return { success: false, error: error.message };

    // Notify + log
    await Promise.all([
      createNotification({
        profileId,
        title: "Salary Structure Created",
        message: "Your salary structure has been set up.",
        type: "salary_updated",
      }),
      logActivity({
        companyId: profile.company_id,
        profileId,
        action: "salary_updated",
        details: "Salary structure created",
      }),
    ]);

    return { success: true, data: created as SalaryStructure };
  } catch (err) {
    console.error("upsertSalaryStructure error:", err);
    return { success: false, error: "An unexpected error occurred." };
  }
}

/**
 * Update salary components with auto-computation.
 * Replaces all components for a given salary structure.
 */
export async function updateSalaryComponents(
  structureId: string,
  components: {
    name: string;
    computation_type: "fixed" | "percentage_of_wage" | "percentage_of_basic";
    value: number;
  }[]
): Promise<ActionResult<SalaryComponent[]>> {
  try {
    // Get the salary structure for computation
    const { data: structure } = await supabaseAdmin
      .from("salary_structures")
      .select("monthly_wage")
      .eq("id", structureId)
      .single();

    if (!structure) return { success: false, error: "Salary structure not found." };

    const monthlyWage = Number(structure.monthly_wage);

    // Find basic salary component for percentage_of_basic calculations
    const basicComp = components.find(
      (c) => c.name.toLowerCase().includes("basic")
    );
    let basicAmount = 0;

    // First pass: compute basic salary if it exists
    if (basicComp) {
      if (basicComp.computation_type === "fixed") {
        basicAmount = basicComp.value;
      } else if (basicComp.computation_type === "percentage_of_wage") {
        basicAmount = (basicComp.value / 100) * monthlyWage;
      }
    }

    // Compute all amounts
    const computedComponents = components.map((c) => {
      let computedAmount = 0;
      switch (c.computation_type) {
        case "fixed":
          computedAmount = c.value;
          break;
        case "percentage_of_wage":
          computedAmount = (c.value / 100) * monthlyWage;
          break;
        case "percentage_of_basic":
          computedAmount = (c.value / 100) * basicAmount;
          break;
      }
      return {
        salary_structure_id: structureId,
        name: c.name,
        computation_type: c.computation_type,
        value: c.value,
        computed_amount: Math.round(computedAmount * 100) / 100,
      };
    });

    // Validate total
    const total = computedComponents.reduce((sum, c) => sum + c.computed_amount, 0);
    if (total > monthlyWage) {
      return {
        success: false,
        error: `Total components exceed monthly wage.`,
      };
    }

    // Delete existing components and insert new ones
    await supabaseAdmin
      .from("salary_components")
      .delete()
      .eq("salary_structure_id", structureId);

    const { data, error } = await supabaseAdmin
      .from("salary_components")
      .insert(computedComponents)
      .select();

    if (error) return { success: false, error: error.message };
    return { success: true, data: (data || []) as SalaryComponent[] };
  } catch (err) {
    console.error("updateSalaryComponents error:", err);
    return { success: false, error: "An unexpected error occurred." };
  }
}
