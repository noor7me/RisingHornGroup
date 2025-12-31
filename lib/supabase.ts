import { createClient } from "@supabase/supabase-js";

function env(name: string): string | undefined {
  return process.env[name] || process.env[`NEXT_PUBLIC_${name}`];
}

/**
 * Returns a Supabase client if env vars are configured, otherwise null.
 * Supports either:
 * - NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY (recommended)
 * - SUPABASE_URL / SUPABASE_ANON_KEY (legacy)
 */
export function getSupabaseClient() {
  const url = env("SUPABASE_URL");
  const anon = env("SUPABASE_ANON_KEY");
  if (!url || !anon) return null;
  return createClient(url, anon, { auth: { persistSession: false } });
}

/**
 * Server-only Supabase client (service role).
 *
 * Configure in Vercel environment variables:
 *   SUPABASE_SERVICE_ROLE_KEY = <your Supabase service role key>
 *
 * IMPORTANT: never use NEXT_PUBLIC_ for this value.
 */
export function getSupabaseServiceClient() {
  const url = env("SUPABASE_URL");
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SECRET_KEY;
  if (!url || !service) return null;
  return createClient(url, service, { auth: { persistSession: false } });
}
