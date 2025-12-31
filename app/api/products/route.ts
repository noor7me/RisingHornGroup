import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";

/**
 * Normalize image URLs:
 * - If already absolute, return as-is
 * - If storage path, build Supabase public URL
 */
function normalizeImageUrl(path?: string | null) {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return `/${path}`;
  return `${base.replace(/\/$/, "")}/storage/v1/object/public/${path}`;
}

export async function GET() {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ source: "no-supabase-env", products: [] }, { status: 500 });
  }

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("available", true)
    .order("sort_order", { ascending: true });

  if (error) {
    return NextResponse.json(
      { source: "supabase-error", error: error.message },
      { status: 500 }
    );
  }

  const products = (data ?? []).map((p: any) => ({
    ...p,
    image_url: normalizeImageUrl(p.image_url),
  }));

  return NextResponse.json({
    source: "supabase",
    products,
  });
}
