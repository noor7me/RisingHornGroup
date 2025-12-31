"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { PRODUCTS as FALLBACK_PRODUCTS } from "@/lib/products";

type Product = {
  id?: string;
  sku: string;
  name: string;
  category: string;
  origin?: string;
  size?: string;
  casePack?: string;
  moq?: string;
  description?: string;
  image?: string;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setError("");
        const res = await fetch("/api/products", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load products");
        const j = await res.json();
        const list = Array.isArray(j?.products) ? j.products : [];
        if (!cancelled) setProducts(list);
      } catch (e: any) {
        if (!cancelled) {
          setError(e?.message || "Failed to load products");
          setProducts([]);
        }
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const view = useMemo(() => {
    if (products && products.length > 0) return products;
    return FALLBACK_PRODUCTS.map((p: any) => ({
      sku: p.sku,
      name: p.name,
      category: p.category,
      origin: p.origin,
      size: p.size,
      casePack: p.casePack,
      moq: p.moq,
      description: p.notes || "",
      image: p.image,
    }));
  }, [products]);

  return (
    <div>
      <h1 className="h1">Products</h1>
      <p className="p">Products load from our live catalog. If empty, sample items are shown.</p>

      {error ? (
        <div className="card" style={{ borderColor: "#f3c7c7", marginBottom: 14 }}>
          <div style={{ color: "#b42318", fontWeight: 800 }}>Live catalog unavailable</div>
          <div style={{ color: "#6b4a4a" }}>{error}. Showing sample items.</div>
        </div>
      ) : null}

      <div className="productsGrid">
        {view.map((p) => (
          <div key={p.sku} className="card">
            {p.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="prodImg" src={p.image} alt={p.name} />
            ) : (
              <div className="prodImg" aria-label="No product image yet">
                <div style={{ textAlign: "center", color: "#245b3f", fontWeight: 800 }}>Image coming soon</div>
              </div>
            )}

            <div className="prodName">{p.name}</div>
            <div className="meta">
              <div className="metaRow">
                <span className="badge">{p.category}</span>
                {p.origin ? <span className="badge">Origin: {p.origin}</span> : null}
                <span className="badge">SKU: {p.sku}</span>
              </div>
              <div style={{ marginTop: 8 }}>
                {p.size ? <div><b>Size:</b> {p.size}</div> : null}
                {p.casePack ? <div><b>Case:</b> {p.casePack}</div> : null}
                {p.moq ? <div><b>MOQ:</b> {p.moq}</div> : null}
                {p.description ? <div style={{ marginTop: 6 }}><b>Notes:</b> {p.description}</div> : null}
              </div>
            </div>

            <div style={{ marginTop: 12 }}>
              <Link href="/order" className="btn" style={{ width: "100%" }}>Order Request</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
