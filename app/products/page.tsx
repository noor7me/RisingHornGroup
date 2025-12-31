"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PRODUCTS, type Product } from "@/lib/products";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/products", { cache: "no-store" })
      .then((r) => r.json())
      .then((j) => {
        if (!cancelled && Array.isArray(j?.products) && j.products.length) {
          setProducts(j.products);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <h1 className="h1">Products</h1>
      <p className="p">Browse currently available products. (Catalog loads from database when configured.)</p>

      <div className="productsGrid">
        {products.map((p) => (
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
                {p.notes ? <div style={{ marginTop: 6 }}><b>Notes:</b> {p.notes}</div> : null}
              </div>
            </div>

            <div style={{ marginTop: 12 }}>
              <Link href="/order" className="btn" style={{ width: "100%" }}>
                Order Request
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
