"use client";

import { useMemo, useState } from "react";
import Section from "../../components/Section";
import { CONTACT } from "@/lib/contact";
import { PRODUCTS } from "@/lib/products";

export default function OrderPage() {
  const [query, setQuery] = useState("");
  const [selectedSku, setSelectedSku] = useState(PRODUCTS[0]?.sku ?? "");
  const [qty, setQty] = useState("1");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return PRODUCTS;
    return PRODUCTS.filter(p =>
      [
        p.sku,
        p.name,
        p.category,
        p.brand ?? "",
        p.origin ?? "",
        p.size ?? "",
        p.casePack ?? "",
        p.moq ?? "",
        p.notes ?? ""
      ].join(" ").toLowerCase().includes(q)
    );
  }, [query]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      // For now we reuse /api/contact as a simple receiver.
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name || "Order Request",
          email: email || undefined,
          phone: phone || undefined,
          inquiryType: "orders",
          message: `Order request\nCompany: ${company || "(not provided)"}\nSKU: ${selectedSku}\nQuantity: ${qty}\n\n${message}`
        })
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("sent");
      setQuery(""); setQty("1"); setName(""); setCompany(""); setPhone(""); setEmail(""); setMessage("");
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
                style={{ textDecoration: "none" }}
                href={`https://wa.me/${w.e164}`}
                target="_blank"
                rel="noreferrer"
              >
                WhatsApp {w.label}
              </a>
            ))}
          </div>
        </div>

        <input
          className="input"
          placeholder="Search products (SKU, name, category...)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div style={{ marginTop: 14, display: "grid", gap: 12 }}>
          {filtered.map((p) => (
            <label key={p.sku} className="card" style={{ cursor: "pointer" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
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
                    <div className="p" style={{ margin: "6px 0 0" }}>
                      {p.size ? `Size: ${p.size}` : ""}
                      {p.casePack ? ` • Case: ${p.casePack}` : ""}
                      {p.moq ? ` • MOQ: ${p.moq}` : ""}
                    </div>
                    {p.notes ? <div className="p" style={{ margin: "8px 0 0" }}>{p.notes}</div> : null}
                    <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>
                      <button
                        type="button"
                        className="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedSku(p.sku);
                          const el = document.getElementById("order-form");
                          el?.scrollIntoView({ behavior: "smooth", block: "start" });
                        }}
                      >
                        Select for order
                      </button>
                    </div>
                  </div>
                </div>
                <input
                  type="radio"
                  name="sku"
                  value={p.sku}
                  checked={selectedSku === p.sku}
                  onChange={() => setSelectedSku(p.sku)}
                  aria-label={`Select ${p.sku}`}
                />
              </div>
            </label>
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

            <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
              <select className="input" value={selectedSku} onChange={(e) => setSelectedSku(e.target.value)}>
                {PRODUCTS.map(p => <option key={p.sku} value={p.sku}>{p.sku} — {p.name}</option>)}
              </select>
              <input className="input" placeholder="Quantity (cartons)" value={qty} onChange={(e) => setQty(e.target.value)} />
            </div>

            <textarea className="textarea" placeholder="Notes (destination city, delivery timing, etc.)"
              value={message} onChange={(e) => setMessage(e.target.value)} />

            <button className="button" type="submit" disabled={status === "sending"}>
              {status === "sending" ? "Submitting..." : "Submit Order Request"}
            </button>

            {status === "sent" && <p className="p">Order request submitted. We’ll contact you soon.</p>}
            {status === "error" && <p className="p">Something went wrong. Please try again.</p>}
          </form>
        </div>
      </Section>
    </>
  );
}