"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { PRODUCTS, type Product } from "@/lib/products";

function productImage(p: Product) {
  return p.image || p.image_url || "/products/placeholder.svg";
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

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

  const categories = useMemo(() => {
    return ["All", ...Array.from(new Set(products.map((p) => p.category).filter(Boolean)))];
  }, [products]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      const matchesCategory = category === "All" || p.category === category;
      const haystack = [p.sku, p.name, p.category, p.brand, p.origin, p.size, p.casePack, p.notes]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return matchesCategory && (!q || haystack.includes(q));
    });
  }, [products, query, category]);

  const visibleCategories = useMemo(() => {
    return Array.from(new Set(filtered.map((p) => p.category).filter(Boolean))).length;
  }, [filtered]);

  return (
    <>
      <header className="pageHeader">
        <p className="eyebrow">Wholesale catalog</p>
        <h1 className="pageTitle">Browse available products</h1>
        <p className="lead">
          Review current product details and start a carton-based order request. Availability,
          pricing, and delivery options are confirmed after inquiry.
        </p>
      </header>

      <div className="catalogSummary">
        <div className="catalogStat">
          <div className="catalogStatValue">{filtered.length}</div>
          <div className="catalogStatLabel">Matching products</div>
        </div>
        <div className="catalogStat">
          <div className="catalogStatValue">{visibleCategories}</div>
          <div className="catalogStatLabel">Active categories</div>
        </div>
        <div className="catalogStat">
          <div className="catalogStatValue">MOQ</div>
          <div className="catalogStatLabel">Carton-based requests</div>
        </div>
      </div>

      <div className="catalogToolbar">
        <input
          className="input"
          placeholder="Search by SKU, product, origin, category..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Link className="button" href="/order">
          Build Order Request
        </Link>
      </div>

      <div className="filterPills" aria-label="Product category filters">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            className={c === category ? "filterButton filterButtonActive" : "filterButton"}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="productsGrid" style={{ marginTop: 18 }}>
        {filtered.map((p) => (
          <article key={p.sku} className="card productCatalogCard">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="prodImg" src={productImage(p)} alt={p.name} />
            <div className="prodBody">
              <div className="metaRow">
                <span className="pill">{p.category}</span>
                <span className="pill statusPill">Ask availability</span>
              </div>

              <div>
                <h2 className="prodName">{p.name}</h2>
                <p className="muted" style={{ margin: "6px 0 0" }}>
                  SKU {p.sku}
                  {p.origin ? ` | Origin: ${p.origin}` : ""}
                </p>
              </div>

              <div className="prodDetails">
                {p.size ? <div><b>Size:</b> {p.size}</div> : null}
                {p.casePack ? <div><b>Case pack:</b> {p.casePack}</div> : null}
                {p.moq ? <div><b>MOQ:</b> {p.moq}</div> : null}
                {p.notes ? <div><b>Notes:</b> {p.notes}</div> : null}
              </div>

              <div className="prodFooter">
                <Link href={`/order?sku=${encodeURIComponent(p.sku)}`} className="button">
                  Add to Request
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card" style={{ marginTop: 18 }}>
          <h2 className="cardTitle">No products found</h2>
          <p className="muted">Try a different search term or category.</p>
        </div>
      ) : null}
    </>
  );
}
