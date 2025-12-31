import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isEmailAllowed } from "@/lib/admin";

type Body = { access_token?: string };

/**
 * Verify the currently signed-in user by validating their access token.
 * We intentionally use the **anon** key here so you do NOT need to expose
 * your Supabase Service Role key to Vercel.
 */
function getAnonClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    "";
  if (!url || !anonKey) return null;
  return createClient(url, anonKey, { auth: { persistSession: false } });
}

export async function POST(req: Request) {
  const supabase = getAnonClient();
  if (!supabase) {
    return NextResponse.json(
      { ok: false, error: "Server missing Supabase URL/ANON key" },
      { status: 500 }
    );
  }

  let body: Body = {};
  try {
    body = (await req.json()) as Body;
  } catch {
    // ignore
  }

  const token = body.access_token;
  if (!token) {
    return NextResponse.json({ ok: false, error: "Missing access_token" }, { status: 401 });
  }

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) {
    return NextResponse.json({ ok: false, error: "Invalid session" }, { status: 401 });
  }

  const email = data.user.email ?? null;
  if (!isEmailAllowed(email)) {
    return NextResponse.json({ ok: false, error: "Not allowed" }, { status: 403 });
  }

  return NextResponse.json({ ok: true, email });
}
