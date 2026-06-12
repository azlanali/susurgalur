/**
 * Server-side Supabase clients. NEVER import this file from a client component.
 *
 * serviceClient() uses the service-role key, which BYPASSES Row-Level Security.
 * It exists only for trusted server jobs: /api/health and /api/admin/stats
 * (aggregate counts). All user-facing data access must go through the anon
 * client + RLS once auth lands in Stage 2 step 3.
 */
import { createClient } from "@supabase/supabase-js";

export function isConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export function serviceClient() {
  if (!isConfigured()) return null;
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } }
  );
}
