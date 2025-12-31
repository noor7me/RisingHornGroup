import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";
import { PRODUCTS, type Product } from "@/lib/products";

/**
 * Returns active products from Supabase (public.products table),
 * falling back to local sample PRODUCTS if Supabase is not configured
 * or the query fails.
 */
export async function GET() {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ source: "fallback", products: PRODUCTS });
    }

    // Expected columns in Supabase:
    // sku, name, category, brand, origin, size, case_pack, moq, notes, image, active, sort_order
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) throw error;

    const products: Product[] = (data || [])
      .filter((row: any) => row.active !== false)
      .map((row: any) => ({
        sku: String(row.sku ?? ""),
        name: String(row.name ?? ""),
        category: (row.category ?? "Snack") as any,
        brand: row.brand ?? undefined,
        origin: row.origin ?? undefined,
        size: row.size ?? undefined,
        casePack: row.case_pack ?? row.casePack ?? undefined,
        moq: row.moq ?? undefined,
        notes: row.notes ?? undefined,
        image: row.image ?? row.image_url ?? undefined,
      }))
      .filter((p) => p.sku && p.name);

    // If your DB is empty, still show fallback samples
    if (!products.length) {
      return NextResponse.json({ source: "fallback-empty", products: PRODUCTS });
    }

    return NextResponse.json({ source: "supabase", products });
  } catch (e: any) {
    return NextResponse.json(
      { source: "fallback-error", products: PRODUCTS, error: String(e?.message || e) },
      { status: 200 }
    );
  }
}
