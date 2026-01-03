import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";
import { PRODUCTS } from "@/lib/products";

/**
 * Normalize image URLs:
 * - If already absolute, return as-is
 * - If a Supabase Storage path (e.g. "product-images/x.png"), build a public URL
 * - If a site-relative path, return as-is
 */
function normalizeImageUrl(path?: string | null) {
  if (!path) return null;
  const p = String(path).trim();
  if (!p) return null;
  if (p.startsWith("http://") || p.startsWith("https://")) return p;
  if (p.startsWith("/")) return p;

  const base = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  if (!base) return `/${p}`;

  // Expect "bucket/path" (e.g. "product-images/foo.png")
  return `${base.replace(/\/$/, "")}/storage/v1/object/public/${p}`;
}

type DbProduct = {
  id: string;
  sku: string;
  name: string;
  category: string;
  brand: string | null;
  origin: string | null;
  size: string | null;
  case_pack: string | null;
  moq: string | null;
  description: string | null;
  notes: string | null;
  image_url: string | null; // single image per product
  available: boolean;
  sort_order: number;
};

export async function GET() {
  const supabase = getSupabaseClient();

  // If env vars are not set, fall back to local sample products
  if (!supabase) {
    return NextResponse.json({ source: "fallback-env-missing", products: PRODUCTS });
  }

  const { data: rows, error } = await supabase
    .from("products")
    .select("*")
    .eq("available", true)
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  // If Supabase fails for any reason, fall back to local sample products
  if (error || !rows) {
    return NextResponse.json({ source: "fallback-supabase-error", products: PRODUCTS });
  }

  const productsDb = rows as unknown as DbProduct[];

  const products = productsDb
    .map((p) => {
      const main = normalizeImageUrl(p.image_url) || undefined;

      return {
        id: p.id,
        sku: String(p.sku ?? ""),
        name: String(p.name ?? ""),
        category: String(p.category ?? ""),
        brand: p.brand ? String(p.brand) : "",
        origin: p.origin ? String(p.origin) : "",
        size: p.size ? String(p.size) : "",
        casePack: p.case_pack ? String(p.case_pack) : "",
        moq: p.moq ? String(p.moq) : "",
        notes: String(p.description ?? p.notes ?? ""),
        // what UI expects:
        image: main || "/products/placeholder.svg",
        image_url: main || undefined,
        // no multi-image gallery in this reset version
        images: undefined as undefined,
      };
    })
    .filter((p) => p.sku && p.name);

  return NextResponse.json({ source: "supabase", products });
}
