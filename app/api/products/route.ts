import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase";

export const runtime = "nodejs";

export async function GET() {
  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("products")
      .select("id, sku, name, category, origin, size, case_pack, moq, description, image_url, available, sort_order")
      .eq("available", true)
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const products = (data ?? []).map((p: any) => ({
      id: p.id,
      sku: p.sku,
      name: p.name,
      category: p.category,
      origin: p.origin ?? "",
      size: p.size ?? "",
      casePack: p.case_pack ?? "",
      moq: p.moq ?? "",
      description: p.description ?? "",
      image: p.image_url || "",
    }));

    return NextResponse.json({ products });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Server error" }, { status: 500 });
  }
}
