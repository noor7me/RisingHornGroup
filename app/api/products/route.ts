import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";
import { PRODUCTS, type Product } from "@/lib/products";

export const runtime = "nodejs";

/**
 * Reads products from Supabase table `products`.
 * Falls back to local sample PRODUCTS if:
 * - Supabase env vars are missing
 * - query fails
 * - table is empty
 *
 * Expected DB columns (flexible):
 * sku, name, category, origin, size, case_pack, moq, notes, image_url (or image), active (bool), sort_order (int)
 */
export async function GET() {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ source: "fallback-no-env", products: PRODUCTS });
    }

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });

    if (error) {
      return NextResponse.json({ source: "fallback-error", products: PRODUCTS, error: error.message });
    }

    const rows = Array.isArray(data) ? data : [];
    const mapped: Product[] = rows
      .filter((r: any) => r.active !== false && r.available !== false)
      .map((r: any) => ({
        sku: String(r.sku ?? ""),
        name: String(r.name ?? ""),
        category: (r.category ?? "Snack") as any,
        origin: r.origin ?? undefined,
        size: r.size ?? undefined,
        casePack: r.case_pack ?? r.casePack ?? undefined,
        moq: r.moq ?? undefined,
        notes: r.notes ?? r.description ?? undefined,
        image: r.image_url ?? r.image ?? undefined,
      }))
      .filter((p) => p.sku && p.name);

    if (!mapped.length) {
      return NextResponse.json({ source: "fallback-empty", products: PRODUCTS });
    }

    return NextResponse.json({ source: "supabase", products: mapped });
  } catch (e: any) {
    return NextResponse.json({ source: "fallback-exception", products: PRODUCTS, error: String(e?.message || e) });
  }
}
