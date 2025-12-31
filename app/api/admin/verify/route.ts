import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isEmailAllowed } from "@/lib/admin";

type Body = { access_token?: string };

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, { auth: { persistSession: false } });
}

export async function POST(req: Request) {
  const supabase = getServiceClient();
  if (!supabase) {
    return NextResponse.json(
      { ok: false, error: "Server missing SUPABASE_SERVICE_ROLE_KEY" },
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
