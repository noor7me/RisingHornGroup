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
  image_url: string | null;
  available: boolean;
  sort_order: number | null;
};

export async function GET() {
  const supabase = getSupabaseClient();

  // Fallback: static list if Supabase isn't configured
  if (!supabase) {
    return NextResponse.json({ source: "fallback-empty", products: PRODUCTS });
  }

  // 1) Fetch available products
  const { data: rows, error } = await supabase
    .from("products")
    .select(
      "id, sku, name, category, brand, origin, size, case_pack, moq, description, notes, image_url, available, sort_order"
    )
    .eq("available", true)
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error || !rows) {
    return NextResponse.json({ source: "fallback-empty", products: PRODUCTS });
  }

  const productsDb = rows as unknown as DbProduct[];
  const productIds = productsDb.map((p) => p.id).filter(Boolean);

  // 2) Fetch gallery images (admin-managed) from product_images table
  let imagesByProduct: Record<string, string[]> = {};
  if (productIds.length) {
    const { data: imgs, error: imgErr } = await supabase
      .from("product_images")
      .select("product_id, image_url, sort_order")
      .in("product_id", productIds)
      .order("sort_order", { ascending: true });

    if (!imgErr && Array.isArray(imgs)) {
      for (const row of imgs as any[]) {
        const pid = String(row.product_id || "");
        const url = normalizeImageUrl(row.image_url);
        if (!pid || !url) continue;
        if (!imagesByProduct[pid]) imagesByProduct[pid] = [];
        imagesByProduct[pid].push(url);
      }
    }
  }

  // 3) Map to UI shape
  const products = productsDb
    .map((p) => {
      const gallery = (imagesByProduct[p.id] || []).filter(Boolean);
      const main = normalizeImageUrl(p.image_url) || gallery[0] || undefined;
      // Avoid duplicates (main image already in gallery)
      const images = gallery.filter((u) => !main || u !== main);

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
        image: main || "/products/placeholder.svg", // what UI expects
        images, // additional images for modal gallery
        image_url: main || undefined,
      };
    })
    .filter((p) => p.sku && p.name);

  return NextResponse.json({ source: "supabase", products });
}
