import { createClient } from "@supabase/supabase-js";

/**
 * Browser-safe Supabase client using the **anon** (public) key.
 *
 * Subject to Row Level Security — can only read the authenticated
 * user's own row.  Safe to import from "use client" components.
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
