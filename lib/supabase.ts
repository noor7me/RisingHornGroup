import { createClient } from "@supabase/supabase-js";

function env(name: string): string | undefined {
  return process.env[name] || process.env[`NEXT_PUBLIC_${name}`];
}

export function getSupabaseClient() {
  const url = env("SUPABASE_URL");
  const anon = env("SUPABASE_ANON_KEY");

  if (!url || !anon) return null;
  return createClient(url, anon, {
    auth: { persistSession: false },
  });
}
