"use client";

import { useEffect, useMemo, useState } from "react";
import jsPDF from "jspdf";
import Section from "../../components/Section";
import { CONTACT } from "@/lib/contact";
import { PRODUCTS, type Product } from "@/lib/products";

type CartItem = { sku: string; qty: string };

function findProduct(list: Product[], sku: string) {
  return list.find((p) => p.sku === sku);
}

function waLink(e164: string) {
  return `https://wa.me/${e164}`;
}

// Normalize product image URLs so images display correctly in the product cards.
function toProductImageSrc(imageUrl?: string | null): string {
  if (!imageUrl) return "/products/placeholder.svg";
  const url = String(imageUrl).trim();
  if (!url) return "/products/placeholder.svg";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;

  // If the DB stores a Storage path, build the public URL.
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const cleaned = url.replace(/^\/+/, "");
  const looksLikeStoragePath =
    cleaned.startsWith("product-images/") ||
    cleaned.startsWith("public/product-images/") ||
    cleaned.includes("/storage/v1/object/public/");

  if (base && looksLikeStoragePath && !cleaned.includes("/storage/v1/object/public/")) {
    // Accept both `product-images/x.png` and `public/product-images/x.png`
    const storagePath = cleaned.startsWith("public/") ? cleaned : `public/${cleaned}`;
    return `${base.replace(/\/$/, "")}/storage/v1/object/${storagePath}`;
  }

  // Site-relative path
  return url.startsWith("/") ? url : `/${url}`;
}

function safeNum(value: string) {
  const n = Number(String(value ?? "").trim());
  return Number.isFinite(n) && n > 0 ? n : 0;
}

function buildOrderText(args: {
  cart: CartItem[];
  name: string;
  company: string;
  phone: string;
  email: string;
  notes: string;
}, productsList: Product[]) {
  const { cart, name, company, phone, email, notes } = args;

  const lines: string[] = [];
  lines.push("Order request");
  lines.push(`Company: ${company || "(not provided)"}`);
  lines.push(`Name: ${name || "(not provided)"}`);
  lines.push(`Phone: ${phone || "(not provided)"}`);
  if (email) lines.push(`Email: ${email}`);
  lines.push("");
  lines.push("Items:");

  for (const item of cart) {
    const p = findProduct(productsList, item.sku);
    if (!p) continue;
    lines.push(`- ${p.name} (SKU: ${p.sku})`);
    lines.push(`  Quantity: ${item.qty} cartons`);
    if (p.size) lines.push(`  Size: ${p.size}`);
    if (p.casePack) lines.push(`  Case: ${p.casePack}`);
    if (p.moq) lines.push(`  MOQ: ${p.moq}`);
    if (p.origin) lines.push(`  Origin: ${p.origin}`);
    lines.push("  ---");
  }

  if (notes) {
    lines.push("");
    lines.push("Notes:");
    lines.push(notes);
  }
  return lines.join("\n");
}

function arrayBufferToBase64(buf: ArrayBuffer) {
  const bytes = new Uint8Array(buf);
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

function makePdf(args: {
  cart: CartItem[];
  name: string;
  company: string;
  phone: string;
  email: string;
  notes: string;
}, productsForText: Product[]) {
  const orderText = buildOrderText(args, productsForText);
  const doc = new jsPDF({ unit: "pt", format: "a4" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("RisingHorn Group — Order Request", 40, 50);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(`Date: ${new Date().toLocaleString()}`, 40, 70);
  doc.text(`Website: risinghorn.com`, 40, 86);

  const body = doc.splitTextToSize(orderText, 515);
  doc.text(body, 40, 120);

  return doc;
}

export default function OrderPage() {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const viewProducts = products && products.length ? products : PRODUCTS;
  const productsList = viewProducts;

  // Product details modal (opened when the user taps an image/description)
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [activeImage, setActiveImage] = useState<string>("");

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

// When the product details modal opens, default to the main image.
useEffect(() => {
  if (!activeProduct) return;
  const main = (activeProduct.image_url || activeProduct.image || "").toString();
  const extras = Array.isArray(activeProduct.images) ? activeProduct.images : [];
  const all = [main, ...extras].filter(Boolean);
  setActiveImage(all[0] || "");
}, [activeProduct]);



const [query, setQuery] = useState("");
  const [pickerSku, setPickerSku] = useState("");
  const [pickerQty, setPickerQty] = useState("1");

  useEffect(() => {
    if (!pickerSku) {
      const first = products[0]?.sku || "";
      if (first) setPickerSku(first);
    }
  }, [products, pickerSku]);
  const [cart, setCart] = useState<CartItem[]>([]);

    const [qtyBySku, setQtyBySku] = useState<Record<string, string>>({});
const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  
  const [quickAddQty, setQuickAddQty] = useState<number>(1);
  const [selectedSku, setSelectedSku] = useState<string>("");
const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return viewProducts;
    return viewProducts.filter((p) =>
      [p.sku, p.name, p.category, p.brand, p.origin].filter(Boolean).join(" ").toLowerCase().includes(q)
    );
  }, [query, viewProducts]);

  const cartonTotal = useMemo(() => cart.reduce((sum, i) => sum + safeNum(i.qty), 0), [cart]);

  function addToCart(sku: string, qty: string = "1") {
    setCart((prev) => {
      const existing = prev.find((x) => x.sku === sku);
      if (existing) {
        return prev.map((x) =>
          x.sku === sku ? { ...x, qty: String(safeNum(x.qty) + safeNum(qty) || 1) } : x
        );
      }
      return [...prev, { sku, qty: qty || "1" }];
    });
  }

  function removeFromCart(sku: string) {
    setCart((prev) => prev.filter((x) => x.sku !== sku));
  }

  function updateQty(sku: string, qty: string) {
    setCart((prev) => prev.map((x) => (x.sku === sku ? { ...x, qty } : x)));
  }

  function resetForm() {
    setQuery("");
    setPickerQty("1");
    setCart([]);
    setName("");
    setCompany("");
    setPhone("");
    setEmail("");
    setNotes("");
  }

  async function downloadPdf() {
    if (cart.length === 0) return;
    const doc = makePdf({ cart, name, company, phone, email, notes }, products);
    doc.save(`RHG-Order-${new Date().toISOString().slice(0, 10)}.pdf`);
  }

  async function submit(e: React.FormEvent, attachPdf: boolean) {
    e.preventDefault();
    if (cart.length === 0) {
      setStatus("error");
      return;
    }
    try {
      setStatus("sending");

      const message = buildOrderText({ cart, name, company, phone, email, notes }, products);

      let pdfBase64: string | undefined;
      let pdfFilename: string | undefined;
      if (attachPdf) {
        const doc = makePdf({ cart, name, company, phone, email, notes }, products);
        const buf = doc.output("arraybuffer");
        pdfBase64 = arrayBufferToBase64(buf);
        pdfFilename = `RHG-Order-${new Date().toISOString().slice(0, 10)}.pdf`;
      }

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inquiryType: "orders",
          name,
          company,
          phone,
          email,
          message,
          pdfBase64,
          pdfFilename,
        }),
      });

      if (!res.ok) throw new Error("Request failed");
      setStatus("sent");
      resetForm();
    } catch {
      setStatus("error");
    }
  }

  return (
    <>
      <h1 className="h1">Order</h1>
      <p className="p">View currently available products and place an order request.</p>

      <Section title="Order Contact">
        <div className="card" style={{ marginBottom: 14 }}>
          <p className="p" style={{ margin: 0 }}>
            For availability and orders, email{" "}
            <a className="underline" href={`mailto:${CONTACT.emails.orders}`}>
              {CONTACT.emails.orders}
            </a>
            {" "}or contact us on WhatsApp.
          </p>
          <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 10 }}>
            {CONTACT.whatsapp.map((w) => (
              <a
                key={w.e164}
                className="button"
                href={waLink(w.e164)}
                target="_blank"
                rel="noreferrer"
                style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
              >
                <span aria-hidden>📱</span> {w.label}
              </a>
            ))}
          </div>
        </div>
      </Section>

      <Section title="Available Products">
        {/*
          Mobile fix: these controls must stack on small screens.
          Inline grid columns can cause the <select value={selectedSku} onChange={(e) => setSelectedSku(e.target.value)}> to collapse/clip on mobile.
        */}
        <div className="orderTopControls">
          <input
            className="input"
            placeholder="Search products (SKU, name, category...)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="orderPicker">
            <select className="input orderPickerSelect" value={pickerSku} onChange={(e) => setPickerSku(e.target.value)}>
              {products.map((p) => (
                <option key={p.sku} value={p.sku}>
                  {p.sku} — {p.name}
                </option>
              ))}
            </select>
            <div className="orderPickerActions">
              <input
                className="input"
                placeholder="Qty"
                value={pickerQty}
                onChange={(e) => setPickerQty(e.target.value)}
              />
              <button type="button" className="button" onClick={() => addToCart(pickerSku, pickerQty)}>
                Add
              </button>
            </div>
          </div>
        </div>

        {cart.length > 0 && (
          <div className="card" style={{ marginTop: 14 }}>
            <div className="cartTotals">
              <div style={{ fontWeight: 900 }}>Selected items</div>
              <div style={{ fontWeight: 800 }}>
                Total cartons: <span style={{ fontWeight: 900 }}>{cartonTotal}</span>
              </div>
            </div>

            <div className="cartList" style={{ marginTop: 10 }}>
              {cart.map((item) => {
                const p = findProduct(productsList, item.sku);
                return (
                  <div key={item.sku} className="cartRow">
                    <div className="cartName">
                      {p ? p.name : item.sku} <span className="cartNameSmall">({item.sku})</span>
                      {p?.size ? <div className="p" style={{ margin: "6px 0 0" }}>Size: {p.size}</div> : null}
                      {p?.casePack ? <div className="p" style={{ margin: "0" }}>Case: {p.casePack}</div> : null}
                      {p?.moq ? <div className="p" style={{ margin: "0" }}>MOQ: {p.moq}</div> : null}
                    </div>

                    <div className="cartQtyWrap">
                      <span className="cartQtyLabel">Qty (cartons)</span>
                      <input
                        className="input cartQtyInput"
                        value={item.qty}
                        onChange={(e) => updateQty(item.sku, e.target.value)}
                        inputMode="numeric"
                      />
                    </div>

                    <button type="button" className="button" onClick={() => removeFromCart(item.sku)}>
                      Remove
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div style={{ marginTop: 14, display: "grid", gap: 12 }}>
          {filtered.map((p) => {
            const desc = (((p as any).description ?? p.notes ?? "") as string).trim();
            const imgSrc = toProductImageSrc((p as any).imageUrl ?? (p as any).image_url ?? (p as any).image);
return (
              <div key={p.sku} className="card productCard">
                <button
                  type="button"
                  className="productMedia"
                  onClick={() => setActiveProduct(p)}
                  aria-label={`View details for ${p.name}`}
                >
                  <img className="productImg" src={imgSrc} alt={p.name} />
                </button>

                <div className="productInfo">
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                    <span className="pill">{p.category}</span>
                  </div>

                  <div style={{ marginTop: 6 }}>
                    <div style={{ fontSize: 20, fontWeight: 800, color: "var(--rhg-dark)" }}>{p.name}</div>
                    {desc ? (
                      <button type="button" className="productDesc" onClick={() => setActiveProduct(p)}>
                        {desc}
                      </button>
                    ) : null}
                  </div>

                  <div className="orderAddRow">
                    <div style={{ fontWeight: 700, color: "var(--rhg-dark)", whiteSpace: "nowrap" }}>Qty (cartons)</div>
                    <input
                      className="textInput"
                      inputMode="numeric"
                      value={qtyBySku[p.sku] ?? "1"}
                      onChange={(e) => setQtyBySku((prev) => ({ ...prev, [p.sku]: e.target.value }))}
                      style={{ maxWidth: 140 }}
                    />
                    <button
                      className="button"
                      type="button"
                      onClick={() => addToCart(p.sku, qtyBySku[p.sku] ?? "1")}
                    >
                      Add to Order
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {filtered.length === 0 ? (
            <div className="card" style={{ padding: 14, color: "var(--rhg-muted)" }}>
              No products match your search.
            </div>
          ) : null}
        </div>
      </Section>

      <Section title="Submit Order Request" subtitle="Send your order request by email. You can also download a PDF copy.">
        <form
          onSubmit={(e) => submit(e, true)}
          style={{
            background: "rgba(255,255,255,0.7)",
            border: "1px solid rgba(9, 80, 33, 0.18)",
            borderRadius: 18,
            padding: 14,
          }}
        >
          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
            <div>
              <div className="p" style={{ margin: "0 0 6px" }}>
                Your name
              </div>
              <input className="input" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
              <div className="p" style={{ margin: "0 0 6px" }}>
                Company
              </div>
              <input className="input" value={company} onChange={(e) => setCompany(e.target.value)} />
            </div>
            <div>
              <div className="p" style={{ margin: "0 0 6px" }}>
                Phone
              </div>
              <input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            </div>
            <div>
              <div className="p" style={{ margin: "0 0 6px" }}>
                Email (optional)
              </div>
              <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            <div className="p" style={{ margin: "0 0 6px" }}>
              Notes (optional)
            </div>
            <textarea className="textarea" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14, alignItems: "center" }}>
            <button type="button" className="button" onClick={downloadPdf} disabled={cart.length === 0}>
              Download PDF
            </button>
            <button
              type="button"
              className="button"
              onClick={(e) => submit(e as any, false)}
              disabled={status === "sending" || cart.length === 0}
            >
              Submit (email only)
            </button>
            <button type="submit" className="button" disabled={status === "sending" || cart.length === 0}>
              Submit (PDF attached)
            </button>
            {status === "sent" ? <span className="p" style={{ margin: 0 }}>Sent! We will respond soon.</span> : null}
            {status === "error" ? <span className="p" style={{ margin: 0 }}>Error sending. Please try again or email us.</span> : null}
          </div>
        </form>
      </Section>

      {activeProduct ? (
        <div className="modalOverlay" onClick={() => setActiveProduct(null)}>
          <div className="modalCard" onClick={(e) => e.stopPropagation()}>
            <div className="modalHeader">
              <div>
                <div className="modalTitle">{activeProduct.name}</div>
                <div className="modalSubtitle">{activeProduct.category}{activeProduct.origin ? ` • ${activeProduct.origin}` : ""}</div>
              </div>
              <button type="button" className="modalClose" onClick={() => setActiveProduct(null)} aria-label="Close">
                ✕
              </button>
            </div>
            <div className="modalBody">
              <div className="modalMedia">
                <img
                  src={toProductImageSrc(activeImage || activeProduct.image_url || (activeProduct as any).image)}
                  alt={activeProduct.name}
                  className="modalImg"
                />
                {(() => {
                  const main = (activeProduct.image_url || (activeProduct as any).image || "").toString();
                  const extras = Array.isArray(activeProduct.images) ? activeProduct.images : [];
                  const all = [main, ...extras].filter(Boolean);
                  if (all.length <= 1) return null;
                  return (
                    <div className="thumbRow" role="list" aria-label="More product images">
                      {all.map((src, i) => {
                        const u = toProductImageSrc(src);
                        const isActive = src === activeImage;
                        return (
                          <button
                            key={`${src}-${i}`}
                            type="button"
                            className={isActive ? "thumbBtn thumbActive" : "thumbBtn"}
                            onClick={() => setActiveImage(src)}
                            aria-label={`View image ${i + 1}`}
                          >
                            <img src={u} alt={`${activeProduct.name} image ${i + 1}`} className="thumbImg" />
                          </button>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
              <div className="modalInfo">
                <div className="modalFacts">
                  {activeProduct.sku ? <div><b>SKU:</b> {activeProduct.sku}</div> : null}
                  {activeProduct.brand ? <div><b>Brand:</b> {activeProduct.brand}</div> : null}
                  {activeProduct.size ? <div><b>Size:</b> {activeProduct.size}</div> : null}
                  {(activeProduct.casePack) ? <div><b>Case:</b> {activeProduct.casePack}</div> : null}
                  {activeProduct.moq ? <div><b>MOQ:</b> {activeProduct.moq}</div> : null}
                </div>
                {(activeProduct.notes) ? (
                  <div className="modalDesc">{activeProduct.notes}</div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}