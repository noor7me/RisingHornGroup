import { createClient, type SupabaseClient } from "@supabase/supabase-js";

function readEnv(name: string): string | undefined {
  // Support both modern NEXT_PUBLIC_* and legacy non-prefixed env vars
  return (
    process.env[`NEXT_PUBLIC_${name}`] ||
    process.env[name] ||
    undefined
  );
}

/**
 * Returns a Supabase client (anon) if env vars are configured, otherwise null.
 *
 * Required:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY  (Supabase dashboard may label this "Publishable key")
 *
 * Legacy supported:
 *   SUPABASE_URL
 *   SUPABASE_ANON_KEY
 */
export function getSupabaseClient(): SupabaseClient | null {
  const url = readEnv("SUPABASE_URL");
  const anon = readEnv("SUPABASE_ANON_KEY");
  if (!url || !anon) return null;

  return createClient(url, anon, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

/**
 * Server-only Supabase client (service role).
 *
 * Configure in Vercel environment variables:
 *   SUPABASE_SERVICE_ROLE_KEY = <your Supabase service role key>
 *
 * IMPORTANT: never use NEXT_PUBLIC_ for this value.
 */
export function getSupabaseServiceClient(): SupabaseClient | null {
  const url = readEnv("SUPABASE_URL");
  const service =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_KEY ||
    process.env.SUPABASE_SECRET_KEY;

  if (!url || !service) return null;

  return createClient(url, service, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}
