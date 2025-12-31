import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";

/**
 * Normalize image URLs:
 * - If already absolute, return as-is
 * - If storage path, build Supabase public URL
 */
function normalizeImageUrl(path?: string | null) {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return `/${path}`;
  return `${base.replace(/\/$/, "")}/storage/v1/object/public/${path}`;
}

export async function GET() {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return NextResponse.json(
      { source: "no-supabase-env", products: [] },
      { status: 500 }
    );
  }

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("available", true)
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    return NextResponse.json(
      { source: "supabase-error", error: error.message, products: [] },
      { status: 500 }
    );
  }

  const products = (data ?? []).map((p: any) => {
    const img = normalizeImageUrl(p.image_url ?? p.image ?? null);
    return {
      sku: String(p.sku ?? ""),
      name: String(p.name ?? ""),
      category: String(p.category ?? ""),
      brand: String(p.brand ?? ""),
      origin: String(p.origin ?? ""),
      size: String(p.size ?? ""),
      casePack: String(p.case_pack ?? p.casePack ?? ""),
      moq: String(p.moq ?? ""),
      notes: String(p.description ?? p.notes ?? ""),
      image: img || undefined,      // <-- what the UI expects
      image_url: img || undefined,  // <-- keep for debugging/compat
    };
  }).filter((p: any) => p.sku && p.name);

  return NextResponse.json({ source: "supabase", products });
}
