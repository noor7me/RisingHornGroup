import { NextResponse } from "next/server";
import { isEmailAllowed } from "@/lib/admin";
import { getSupabaseClient, getSupabaseServiceClient } from "@/lib/supabase";

type AdminProductPayload = {
  id?: string;
  sku: string;
  name: string;
  category: string;
  origin?: string | null;
  size?: string | null;
  case_pack?: string | null;
  moq?: string | null;
  description?: string | null;
  image_url?: string | null;
  available?: boolean;
  sort_order?: number;
};

async function requireAdmin(request: Request) {
  // Accept token either via Authorization Bearer or JSON body.
  const header = request.headers.get("authorization") || "";
  const headerToken = header.toLowerCase().startsWith("bearer ") ? header.slice(7) : "";

  let bodyToken = "";
  try {
    if (!headerToken && request.method !== "GET") {
      const body = (await request.clone().json()) as any;
      if (typeof body?.access_token === "string") bodyToken = body.access_token;
    }
  } catch {
    // ignore
  }

  const token = headerToken || bodyToken;
  if (!token) return { ok: false as const, status: 401, message: "Missing access token" };

  const supabase = getSupabaseClient();
  if (!supabase) return { ok: false as const, status: 500, message: "Supabase env is not configured" };

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user?.email) {
    return { ok: false as const, status: 401, message: "Invalid session" };
  }
  if (!isEmailAllowed(data.user.email)) {
    return { ok: false as const, status: 403, message: "Not authorized" };
  }
  return { ok: true as const, token, email: data.user.email };
}

export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }

  const svc = getSupabaseServiceClient();
  if (!svc) {
    return NextResponse.json(
      {
        error:
          "Server is missing SUPABASE_SERVICE_ROLE_KEY. Add it to Vercel environment variables (server-only).",
      },
      { status: 500 }
    );
  }

  const { data, error } = await svc.from("products").select("*").order("sort_order", { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ products: data ?? [] });
}

export async function POST(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }

  const svc = getSupabaseServiceClient();
  if (!svc) {
    return NextResponse.json(
      {
        error:
          "Server is missing SUPABASE_SERVICE_ROLE_KEY. Add it to Vercel environment variables (server-only).",
      },
      { status: 500 }
    );
  }

  const body = (await request.json()) as AdminProductPayload;
  const payload = {
    sku: body.sku?.trim(),
    name: body.name?.trim(),
    category: body.category?.trim(),
    origin: body.origin ?? null,
    size: body.size ?? null,
    case_pack: body.case_pack ?? null,
    moq: body.moq ?? null,
    description: body.description ?? null,
    image_url: body.image_url ?? null,
    available: body.available ?? true,
    sort_order: typeof body.sort_order === "number" ? body.sort_order : 0,
  };

  if (!payload.sku || !payload.name || !payload.category) {
    return NextResponse.json({ error: "sku, name, and category are required" }, { status: 400 });
  }

  const { data, error } = await svc.from("products").insert(payload).select("*").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ product: data });
}

export async function PUT(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }

  const svc = getSupabaseServiceClient();
  if (!svc) {
    return NextResponse.json(
      {
        error:
          "Server is missing SUPABASE_SERVICE_ROLE_KEY. Add it to Vercel environment variables (server-only).",
      },
      { status: 500 }
    );
  }

  const body = (await request.json()) as AdminProductPayload;
  if (!body.id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const patch: any = {
    sku: body.sku?.trim(),
    name: body.name?.trim(),
    category: body.category?.trim(),
    origin: body.origin ?? null,
    size: body.size ?? null,
    case_pack: body.case_pack ?? null,
    moq: body.moq ?? null,
    description: body.description ?? null,
    image_url: body.image_url ?? null,
    available: body.available ?? true,
    sort_order: typeof body.sort_order === "number" ? body.sort_order : 0,
  };

  const { data, error } = await svc.from("products").update(patch).eq("id", body.id).select("*").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ product: data });
}

export async function DELETE(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }

  const svc = getSupabaseServiceClient();
  if (!svc) {
    return NextResponse.json(
      {
        error:
          "Server is missing SUPABASE_SERVICE_ROLE_KEY. Add it to Vercel environment variables (server-only).",
      },
      { status: 500 }
    );
  }

  const url = new URL(request.url);
  let id = url.searchParams.get("id");
  if (!id) {
    try {
      const body = (await request.json()) as { id?: string };
      id = body.id || null;
    } catch {
      // ignore malformed or empty bodies
    }
  }
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const { error } = await svc.from("products").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
