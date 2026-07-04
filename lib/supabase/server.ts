import { createClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase client using the **service_role** key.
 *
 * This key bypasses Row Level Security and must NEVER be exposed
 * to the browser.  Only import this module from:
 *   - API routes        (app/api/…/route.ts)
 *   - Server components (app/…/page.tsx with no "use client")
 *   - Auth callbacks    (auth.ts)
 *   - Server-only libs  (lib/users.ts)
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
  );
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
