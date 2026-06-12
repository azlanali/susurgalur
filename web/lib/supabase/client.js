/**
 * Browser-side Supabase client (anon key — safe to expose, RLS enforces walls).
 * Used from Stage 2 step 3 onwards (auth + tree CRUD).
 */
import { createClient } from "@supabase/supabase-js";

let _client = null;

export function supabaseBrowser() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null;
  if (!_client) {
    _client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
  }
  return _client;
}
