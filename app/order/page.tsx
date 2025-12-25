"use client";

import { useMemo, useState } from "react";
import Section from "../../components/Section";
import { CONTACT } from "@/lib/contact";
import { PRODUCTS } from "@/lib/products";

type CartItem = { sku: string; qty: string };

function findProduct(sku: string) {
  return PRODUCTS.find((p) => p.sku === sku);
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

  function addToCart(sku: string, qty: string = "1") {
    setCart((prev) => {
      const existing = prev.find((x) => x.sku === sku);
      if (existing) {
        return prev.map((x) =>
          x.sku === sku ? { ...x, qty: String(Number(x.qty || "0") + Number(qty || "0") || 1) } : x
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

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (cart.length === 0) {
      setStatus("error");
      return;
    }
    try {
      setStatus("sending");

      const lines: string[] = [];
      lines.push("Order request");
      lines.push(`Company: ${company || "(not provided)"}`);
      lines.push(`Name: ${name}`);
      lines.push(`Phone: ${phone}`);
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
      }
      if (notes) {
        lines.push("");
        lines.push("Notes:");
        lines.push(notes);
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
          message: lines.join("\n"),
        }),
      });

      if (!res.ok) throw new Error("Request failed");
      setStatus("sent");
      setQuery("");
      setPickerQty("1");
      setCart([]);
      setName("");
      setCompany("");
      setPhone("");
      setEmail("");
      setNotes("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <>
      <h1 className="h1">Order</h1>
      <p className="p">View currently available products and place an order request.</p>

      <Section title="Available Products">
        <div className="card" style={{ marginBottom: 14 }}>
          <p className="p" style={{ margin: 0 }}>
            To place an order or request current availability, email{" "}
            <a className="underline" href={`mailto:${CONTACT.emails.orders}`}>{CONTACT.emails.orders}</a>
            {" "}or contact us on WhatsApp.
          </p>
          <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 10 }}>
            {CONTACT.whatsapp.map((w) => (
              <a
                key={w.e164}
                className="button"
                href={`https://wa.me/${w.e164}`}
                target="_blank"
                rel="noreferrer"
                style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
              >
                <span aria-hidden>📱</span> {w.label}
              </a>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
          <input
            className="input"
            placeholder="Search products (SKU, name, category...)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div style={{ display: "grid", gap: 12, gridTemplateColumns: "minmax(0, 1fr) 160px" }}>
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
            <div style={{ fontWeight: 800, marginBottom: 10 }}>Selected items</div>
            <div style={{ display: "grid", gap: 10 }}>
              {cart.map((item) => {
                const p = findProduct(item.sku);
                return (
                  <div key={item.sku} style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                    <div style={{ minWidth: 220, fontWeight: 700 }}>
                      {p ? p.name : item.sku} <span style={{ fontWeight: 500 }}>({item.sku})</span>
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <span className="p" style={{ margin: 0 }}>Qty (cartons)</span>
                      <input
                        className="input"
                        style={{ width: 140 }}
                        value={item.qty}
                        onChange={(e) => updateQty(item.sku, e.target.value)}
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
              <div style={{ display: "grid", gap: 10, gridTemplateColumns: "180px 1fr", alignItems: "start" }}>
                <img
                  src={p.image}
                  alt={p.name}
                  width={180}
                  height={120}
                  style={{ width: 180, height: 120, objectFit: "cover", borderRadius: 12, border: "1px solid #e6eee8" }}
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
                  {p.casePack ? <div className="p" style={{ margin: "4px 0 0" }}>Case: {p.casePack}</div> : null}
                  {p.moq ? <div className="p" style={{ margin: "4px 0 0" }}>MOQ: {p.moq}</div> : null}

                  {p.notes ? <div className="p" style={{ margin: "8px 0 0" }}>{p.notes}</div> : null}

                  <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <button type="button" className="button" onClick={() => addToCart(p.sku, "1")}>
                      Add to order
                    </button>
                    <a className="button" href="#order-form">Order request form</a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Place Order Request">
        <div className="card">
          <form id="order-form" onSubmit={submit} style={{ display: "grid", gap: 12 }}>
            <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
              <input className="input" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} required />
              <input className="input" placeholder="Company (optional)" value={company} onChange={(e) => setCompany(e.target.value)} />
            </div>

            <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
              <input className="input" placeholder="Phone number" value={phone} onChange={(e) => setPhone(e.target.value)} required />
              <input className="input" placeholder="Email (optional)" value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
            </div>

            {cart.length === 0 && (
              <p className="p" style={{ margin: 0 }}>
                Please add at least one product above ("Add" or "Add to order") before submitting.
              </p>
            )}

            <textarea
              className="textarea"
              placeholder="Notes (destination city, delivery timing, preferred brand, etc.)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />

            <button className="button" type="submit" disabled={status === "sending"}>
              {status === "sending" ? "Submitting..." : "Submit Order Request"}
            </button>

            {status === "sent" && <p className="p">Order request submitted. We’ll contact you soon.</p>}
            {status === "error" && (
              <p className="p">
                {cart.length === 0 ? "Please select at least one product." : "Something went wrong. Please try again."}
              </p>
            )}
          </form>
        </div>
      </Section>
    </>
  );
}
