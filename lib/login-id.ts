import { supabaseAdmin } from "@/lib/supabase/server";

/**
 * Generates a unique Login ID for a new employee.
 * Format: {COMPANY_CODE}{YYYY}{SERIAL_4DIGITS}
 * Example: ODSO20260001
 */
export async function generateLoginId(
  companyCode: string,
  joiningYear: number,
  companyId: string
): Promise<string> {
  const prefix = `${companyCode.toUpperCase()}${joiningYear}`;

  // Find the highest serial number for this company
  const { data: existing } = await supabaseAdmin
    .from("profiles")
    .select("login_id")
    .eq("company_id", companyId)
    .like("login_id", `${prefix}%`)
    .order("login_id", { ascending: false })
    .limit(1);

  let nextSerial = 1;

  if (existing && existing.length > 0 && existing[0].login_id) {
    const lastId = existing[0].login_id;
    const serialPart = lastId.slice(prefix.length);
    const parsed = parseInt(serialPart, 10);
    if (!isNaN(parsed)) {
      nextSerial = parsed + 1;
    }
  }

  const serial = String(nextSerial).padStart(4, "0");
  return `${prefix}${serial}`;
}
