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

  return (
    <>
      <header className="catalogHeader">
        <div>
          <p className="eyebrow">Products</p>
          <h1 className="pageTitle">Catalog</h1>
        </div>
      </header>

      <section className="catalogControls" aria-label="Catalog controls">
        <div className="catalogSearchRow">
          <input
            className="input"
            placeholder="Search products, SKU, origin..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Link className="button" href="/order">
            Request Order
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
      </section>

      <div className="catalogCount">
        {filtered.length} {filtered.length === 1 ? "product" : "products"}
      </div>

      <div className="productsGrid compactProductsGrid">
        {filtered.map((p) => (
          <article key={p.sku} className="card productCatalogCard">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="prodImg" src={productImage(p)} alt={p.name} />
            <div className="prodBody">
              <div className="metaRow">
                <span className="pill">{p.category}</span>
                <span className="pill">SKU {p.sku}</span>
              </div>

              <h2 className="prodName">{p.name}</h2>

              <div className="prodDetails compactProdDetails">
                {p.origin ? <div><b>Origin:</b> {p.origin}</div> : null}
                {p.size ? <div><b>Size:</b> {p.size}</div> : null}
                {p.casePack ? <div><b>Case:</b> {p.casePack}</div> : null}
                {p.moq ? <div><b>MOQ:</b> {p.moq}</div> : null}
              </div>

              <Link href={`/order?sku=${encodeURIComponent(p.sku)}`} className="button">
                Add to Request
              </Link>
            </div>
          </article>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card" style={{ marginTop: 18 }}>
          <h2 className="cardTitle">No products found</h2>
          <p className="muted">Try another search or category.</p>
        </div>
      ) : null}

      <Link className="mobileRequestBar" href="/order">
        Request Order
      </Link>
    </>
  );
}
