import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser-safe Supabase client using the **anon** (public) key.
 *
 * Subject to Row Level Security — can only read the authenticated
 * user's own row.  Safe to import from "use client" components.
 *
 * Uses @supabase/ssr so sessions are stored in cookies that the
 * middleware (proxy.ts) can read.
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
