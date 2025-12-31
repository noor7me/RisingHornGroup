import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Browser-side Supabase client (uses NEXT_PUBLIC_* env vars).
 * Safe to use in client components.
 */
let _client: SupabaseClient | null = null;

export function getSupabaseBrowserClient(): SupabaseClient {
  if (_client) return _client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    // Fail fast with a helpful error instead of returning null and causing runtime bugs.
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. Add them to .env.local and Vercel Environment Variables."
    );
  }

  _client = createClient(url, anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });

  return _client;
}
