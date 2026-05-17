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

function productImage(p?: Product | null) {
  return p?.image_url || p?.image || "/products/placeholder.svg";
}

function safeNum(value: string) {
  const n = Number(String(value ?? "").trim());
  return Number.isFinite(n) && n > 0 ? n : 0;
}

function buildOrderText(
  args: {
    cart: CartItem[];
    name: string;
    company: string;
    phone: string;
    email: string;
    notes: string;
  },
  productsList: Product[]
) {
  const { cart, name, company, phone, email, notes } = args;
  const lines: string[] = [];

  lines.push("RisingHorn Group order request");
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
    if (p.casePack) lines.push(`  Case pack: ${p.casePack}`);
    if (p.moq) lines.push(`  MOQ: ${p.moq}`);
    if (p.origin) lines.push(`  Origin: ${p.origin}`);
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

function makePdf(
  args: {
    cart: CartItem[];
    name: string;
    company: string;
    phone: string;
    email: string;
    notes: string;
  },
  productsForText: Product[]
) {
  const orderText = buildOrderText(args, productsForText);
  const doc = new jsPDF({ unit: "pt", format: "a4" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("RisingHorn Group - Order Request", 40, 50);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(`Date: ${new Date().toLocaleString()}`, 40, 72);
  doc.text("Website: risinghorn.com", 40, 88);

  const body = doc.splitTextToSize(orderText, 515);
  doc.text(body, 40, 124);
  return doc;
}

export default function OrderPage() {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [query, setQuery] = useState("");
  const [pickerSku, setPickerSku] = useState(PRODUCTS[0]?.sku || "");
  const [pickerQty, setPickerQty] = useState("1");
  const [qtyBySku, setQtyBySku] = useState<Record<string, string>>({});
  const [cart, setCart] = useState<CartItem[]>([]);
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

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

  useEffect(() => {
    if (!products.length) return;
    setPickerSku((current) => current || products[0].sku);
  }, [products]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const sku = new URLSearchParams(window.location.search).get("sku");
    if (sku) {
      setPickerSku(sku);
      setCart((prev) => (prev.some((item) => item.sku === sku) ? prev : [...prev, { sku, qty: "1" }]));
    }
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) =>
      [p.sku, p.name, p.category, p.brand, p.origin, p.notes].filter(Boolean).join(" ").toLowerCase().includes(q)
    );
  }, [products, query]);

  const cartonTotal = useMemo(() => cart.reduce((sum, i) => sum + safeNum(i.qty), 0), [cart]);

  function addToCart(sku: string, qty: string = "1") {
    if (!sku) return;
    setStatus("idle");
    setCart((prev) => {
      const existing = prev.find((x) => x.sku === sku);
      if (existing) {
        return prev.map((x) =>
          x.sku === sku ? { ...x, qty: String(safeNum(x.qty) + safeNum(qty) || 1) } : x
        );
      }
      return [...prev, { sku, qty: String(safeNum(qty) || 1) }];
    });
  }

  function removeFromCart(sku: string) {
    setCart((prev) => prev.filter((x) => x.sku !== sku));
  }

  function updateQty(sku: string, qty: string) {
    setCart((prev) => prev.map((x) => (x.sku === sku ? { ...x, qty } : x)));
  }

  function resetForm() {
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
        pdfBase64 = arrayBufferToBase64(doc.output("arraybuffer"));
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
      <header className="pageHeader">
        <p className="eyebrow">Order request</p>
        <h1 className="pageTitle">Build a wholesale inquiry</h1>
        <p className="lead">
          Select products, enter carton quantities, and send a focused request. We will confirm
          availability, pricing, and delivery options before any order is finalized.
        </p>
        <div className="catalogSummary">
          <div className="catalogStat">
            <div className="catalogStatValue">{products.length}</div>
            <div className="catalogStatLabel">Products loaded</div>
          </div>
          <div className="catalogStat">
            <div className="catalogStatValue">{cart.length}</div>
            <div className="catalogStatLabel">Selected SKUs</div>
          </div>
          <div className="catalogStat">
            <div className="catalogStatValue">{cartonTotal}</div>
            <div className="catalogStatLabel">Cartons requested</div>
          </div>
        </div>
        <div className="pageActions" style={{ marginTop: 18 }}>
          {CONTACT.whatsapp.map((w) => (
            <a key={w.e164} className="button secondary" href={waLink(w.e164)} target="_blank" rel="noreferrer">
              WhatsApp {w.label}
            </a>
          ))}
          <a className="button secondary" href={`mailto:${CONTACT.emails.orders}`}>
            Email Orders
          </a>
        </div>
      </header>

      <div className="orderShell">
        <div>
          <Section title="Choose products">
            <div className="orderTopControls">
              <input
                className="input"
                placeholder="Search products by SKU, name, category..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <div className="orderPicker">
                <select className="input" value={pickerSku} onChange={(e) => setPickerSku(e.target.value)}>
                  {products.map((p) => (
                    <option key={p.sku} value={p.sku}>
                      {p.sku} - {p.name}
                    </option>
                  ))}
                </select>
                <div className="orderPickerActions">
                  <input
                    className="input"
                    placeholder="Qty"
                    inputMode="numeric"
                    value={pickerQty}
                    onChange={(e) => setPickerQty(e.target.value)}
                  />
                  <button type="button" className="button" onClick={() => addToCart(pickerSku, pickerQty)}>
                    Add
                  </button>
                </div>
              </div>
            </div>

            <div className="orderProductList">
              {filtered.map((p) => {
                const desc = (p.notes || "").trim();
                return (
                  <article key={p.sku} className="card productCard">
                    <button
                      type="button"
                      className="productMedia"
                      onClick={() => setActiveProduct(p)}
                      aria-label={`View details for ${p.name}`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img className="productImg" src={productImage(p)} alt={p.name} />
                    </button>

                    <div className="productInfo">
                      <div className="metaRow">
                        <span className="pill">{p.category}</span>
                        {p.origin ? <span className="pill">Origin: {p.origin}</span> : null}
                        <span className="pill">SKU: {p.sku}</span>
                      </div>
                      <div>
                        <h2 className="productTitle">{p.name}</h2>
                        {desc ? (
                          <button type="button" className="productDesc" onClick={() => setActiveProduct(p)}>
                            {desc}
                          </button>
                        ) : null}
                      </div>
                      <div className="orderAddRow">
                        <label className="fieldLabel" style={{ maxWidth: 140 }}>
                          Qty cartons
                          <input
                            className="textInput"
                            inputMode="numeric"
                            value={qtyBySku[p.sku] ?? "1"}
                            onChange={(e) => setQtyBySku((prev) => ({ ...prev, [p.sku]: e.target.value }))}
                          />
                        </label>
                        <button className="button" type="button" onClick={() => addToCart(p.sku, qtyBySku[p.sku] ?? "1")}>
                          Add to Request
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </Section>
        </div>

        <aside className="orderSummary">
          <div className="card">
            <div className="cartTotals">
              <span>Request summary</span>
              <span>{cartonTotal} cartons</span>
            </div>

            {cart.length === 0 ? (
              <p className="muted">Your selected products will appear here.</p>
            ) : (
              <div className="cartList" style={{ marginTop: 10 }}>
                {cart.map((item) => {
                  const p = findProduct(products, item.sku);
                  return (
                    <div key={item.sku} className="cartRow">
                      <div className="cartName">
                        {p ? p.name : item.sku}
                        <div className="cartNameSmall">{item.sku}</div>
                      </div>
                      <label className="cartQtyWrap">
                        <span className="cartQtyLabel">Cartons</span>
                        <input
                          className="input"
                          value={item.qty}
                          onChange={(e) => updateQty(item.sku, e.target.value)}
                          inputMode="numeric"
                        />
                      </label>
                      <button type="button" className="button secondary" onClick={() => removeFromCart(item.sku)}>
                        Remove
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <form className="card formStack" onSubmit={(e) => submit(e, true)}>
            <h2 className="cardTitle">Submit request</h2>
            <label className="fieldLabel">
              Your name
              <input className="input" value={name} onChange={(e) => setName(e.target.value)} required />
            </label>
            <label className="fieldLabel">
              Company
              <input className="input" value={company} onChange={(e) => setCompany(e.target.value)} />
            </label>
            <label className="fieldLabel">
              Phone
              <input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            </label>
            <label className="fieldLabel">
              Email
              <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            <label className="fieldLabel">
              Notes
              <textarea className="textarea" value={notes} onChange={(e) => setNotes(e.target.value)} />
            </label>

            <div className="formActions">
              <button type="button" className="button secondary" onClick={downloadPdf} disabled={cart.length === 0}>
                Download PDF
              </button>
              <button
                type="button"
                className="button secondary"
                onClick={(e) => submit(e as unknown as React.FormEvent, false)}
                disabled={status === "sending" || cart.length === 0}
              >
                Email Only
              </button>
              <button type="submit" className="button" disabled={status === "sending" || cart.length === 0}>
                Send with PDF
              </button>
            </div>

            {status === "sent" ? <p className="muted">Sent. We will respond soon.</p> : null}
            {status === "error" ? <p className="muted">Add at least one product, then try again.</p> : null}
          </form>
        </aside>
      </div>

      {activeProduct ? (
        <div className="modalOverlay" onClick={() => setActiveProduct(null)}>
          <div className="modalCard" onClick={(e) => e.stopPropagation()}>
            <div className="modalHeader">
              <div>
                <div className="modalTitle">{activeProduct.name}</div>
                <div className="modalSubtitle">
                  {activeProduct.category}
                  {activeProduct.origin ? ` | ${activeProduct.origin}` : ""}
                </div>
              </div>
              <button type="button" className="modalClose" onClick={() => setActiveProduct(null)} aria-label="Close">
                X
              </button>
            </div>
            <div className="modalBody">
              <div className="modalMedia">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={productImage(activeProduct)} alt={activeProduct.name} className="modalImg" />
              </div>
              <div className="modalInfo">
                <div className="modalFacts">
                  <div><b>SKU:</b> {activeProduct.sku}</div>
                  {activeProduct.brand ? <div><b>Brand:</b> {activeProduct.brand}</div> : null}
                  {activeProduct.size ? <div><b>Size:</b> {activeProduct.size}</div> : null}
                  {activeProduct.casePack ? <div><b>Case pack:</b> {activeProduct.casePack}</div> : null}
                  {activeProduct.moq ? <div><b>MOQ:</b> {activeProduct.moq}</div> : null}
                </div>
                {activeProduct.notes ? <div className="modalDesc">{activeProduct.notes}</div> : null}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
