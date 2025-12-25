"use client";

import { useMemo, useState } from "react";
import jsPDF from "jspdf";
import Section from "../../components/Section";
import { CONTACT } from "@/lib/contact";
import { PRODUCTS } from "@/lib/products";

type CartItem = { sku: string; qty: string };

function findProduct(sku: string) {
  return PRODUCTS.find((p) => p.sku === sku);
}

function waLink(e164: string) {
  return `https://wa.me/${e164}`;
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
}) {
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
    const p = findProduct(item.sku);
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
}) {
  const orderText = buildOrderText(args);
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
  const [query, setQuery] = useState("");
  const [pickerSku, setPickerSku] = useState(PRODUCTS[0]?.sku ?? "");
  const [pickerQty, setPickerQty] = useState("1");
  const [cart, setCart] = useState<CartItem[]>([]);

  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return PRODUCTS;
    return PRODUCTS.filter((p) =>
      [p.sku, p.name, p.category, p.brand, p.origin].filter(Boolean).join(" ").toLowerCase().includes(q)
    );
  }, [query]);

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
    const doc = makePdf({ cart, name, company, phone, email, notes });
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

      const message = buildOrderText({ cart, name, company, phone, email, notes });

      let pdfBase64: string | undefined;
      let pdfFilename: string | undefined;
      if (attachPdf) {
        const doc = makePdf({ cart, name, company, phone, email, notes });
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
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
          <input
            className="input"
            placeholder="Search products (SKU, name, category...)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div style={{ display: "grid", gap: 12, gridTemplateColumns: "minmax(0, 1fr) 180px" }}>
            <select className="input" value={pickerSku} onChange={(e) => setPickerSku(e.target.value)}>
              {PRODUCTS.map((p) => (
                <option key={p.sku} value={p.sku}>
                  {p.sku} — {p.name}
                </option>
              ))}
            </select>
            <div style={{ display: "flex", gap: 10 }}>
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
                const p = findProduct(item.sku);
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
          {filtered.map((p) => (
            <div key={p.sku} className="card">
              <div
                style={{
                  display: "grid",
                  gap: 10,
                  gridTemplateColumns: "180px 1fr",
                  alignItems: "start",
                }}
              >
                <img
                  src={p.image}
                  alt={p.name}
                  width={180}
                  height={120}
                  style={{
                    width: 180,
                    height: 120,
                    objectFit: "cover",
                    borderRadius: 12,
                    border: "1px solid #e6eee8",
                  }}
                />
                <div>
                  <div className="badge">{p.category}</div>
                  <div style={{ fontWeight: 900, fontSize: 18, marginTop: 6 }}>{p.name}</div>
                  <div className="p" style={{ margin: "6px 0 0" }}>
                    SKU: {p.sku}
                    {p.brand ? ` • Brand: ${p.brand}` : ""}
                    {p.origin ? ` • Origin: ${p.origin}` : ""}
                  </div>
                  {p.size ? <div className="p" style={{ margin: "6px 0 0" }}>Size: {p.size}</div> : null}
                  {p.casePack ? <div className="p" style={{ margin: "0" }}>Case: {p.casePack}</div> : null}
                  {p.moq ? <div className="p" style={{ margin: "0" }}>MOQ: {p.moq}</div> : null}

                  <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <button type="button" className="button" onClick={() => addToCart(p.sku, "1")}>Add 1 carton</button>
                    <button type="button" className="button" onClick={() => addToCart(p.sku, "10")}>Add 10 cartons</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Submit Order Request">
        <form className="card" onSubmit={(e) => submit(e, true)}>
          <div className="grid" style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
            <div>
              <div className="p" style={{ margin: "0 0 6px" }}>Name</div>
              <input className="input" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
              <div className="p" style={{ margin: "0 0 6px" }}>Company</div>
              <input className="input" value={company} onChange={(e) => setCompany(e.target.value)} />
            </div>
            <div>
              <div className="p" style={{ margin: "0 0 6px" }}>Phone</div>
              <input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            </div>
            <div>
              <div className="p" style={{ margin: "0 0 6px" }}>Email (optional)</div>
              <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            <div className="p" style={{ margin: "0 0 6px" }}>Notes (optional)</div>
            <textarea className="textarea" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14, alignItems: "center" }}>
            <button
              type="button"
              className="button"
              onClick={downloadPdf}
              disabled={cart.length === 0}
            >
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
            {status === "error" ? (
              <span className="p" style={{ margin: 0 }}>Error sending. Please try again or email us.</span>
            ) : null}
          </div>
        </form>
      </Section>
    </>
  );
}
