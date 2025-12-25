"use client";

import { useMemo, useState } from "react";
import { jsPDF } from "jspdf";
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

  function toIntQty(qty: string) {
    const n = Number.parseInt((qty || "").trim(), 10);
    return Number.isFinite(n) && n > 0 ? n : 0;
  }

  function parseMoqCartons(moq?: string) {
    if (!moq) return 0;
    const m = moq.match(/(\d+)/);
    if (!m) return 0;
    const n = Number.parseInt(m[1], 10);
    return Number.isFinite(n) && n > 0 ? n : 0;
  }

  const totalCartons = useMemo(() => cart.reduce((sum, it) => sum + toIntQty(it.qty), 0), [cart]);

  const moqIssues = useMemo(() => {
    return cart
      .map((it) => {
        const p = findProduct(it.sku);
        if (!p) return null;
        const min = parseMoqCartons(p.moq);
        if (!min) return null;
        const q = toIntQty(it.qty);
        if (q >= min) return null;
        return { sku: it.sku, name: p.name, min, qty: q };
      })
      .filter(Boolean) as Array<{ sku: string; name: string; min: number; qty: number }>;
  }, [cart]);

  const canSubmit = cart.length > 0 && moqIssues.length === 0;

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

  function buildOrderText() {
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
      lines.push(`  Quantity: ${toIntQty(item.qty)} cartons`);
      if (p.size) lines.push(`  Size: ${p.size}`);
      if (p.casePack) lines.push(`  Case: ${p.casePack}`);
      if (p.moq) lines.push(`  MOQ: ${p.moq}`);
      if (p.origin) lines.push(`  Origin: ${p.origin}`);
    }
    lines.push("");
    lines.push(`Total cartons: ${totalCartons}`);
    if (notes) {
      lines.push("");
      lines.push("Notes:");
      lines.push(notes);
    }
    return lines.join("\n");
  }

  function buildPdfFileName() {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    const stamp = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}`;
    return `RisingHorn_Order_${stamp}.pdf`;
  }

  function buildOrderPdfBase64() {
    const doc = new jsPDF({ unit: "pt", format: "letter" });
    const text = buildOrderText();
    const lines = doc.splitTextToSize(text, 520);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(lines, 46, 60);
    const dataUri = doc.output("datauristring");
    const base64 = dataUri.split(",")[1] || "";
    return base64;
  }

  function downloadPdf() {
    const doc = new jsPDF({ unit: "pt", format: "letter" });
    const text = buildOrderText();
    const lines = doc.splitTextToSize(text, 520);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(lines, 46, 60);
    doc.save(buildPdfFileName());
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (cart.length === 0 || !canSubmit) {
      setStatus("error");
      return;
    }
    try {
      setStatus("sending");

      const message = buildOrderText();
      const pdfFileName = buildPdfFileName();
      const pdfBase64 = buildOrderPdfBase64();

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
          attachmentName: pdfFileName,
          attachmentBase64: pdfBase64,
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

        <div className="orderControls">
          <input
            className="input"
            placeholder="Search products (SKU, name, category...)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="orderPicker">
            <select className="input" value={pickerSku} onChange={(e) => setPickerSku(e.target.value)}>
              {PRODUCTS.map((p) => (
                <option key={p.sku} value={p.sku}>
                  {p.sku} — {p.name}
                </option>
              ))}
            </select>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
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
            <div className="p" style={{ margin: "0 0 10px" }}>
              Carton total: <strong>{totalCartons}</strong>
            </div>

            {moqIssues.length > 0 && (
              <div className="card" style={{ background: "var(--green-100)", borderColor: "rgba(11,107,58,.25)", marginBottom: 12 }}>
                <div style={{ fontWeight: 800, marginBottom: 6 }}>MOQ warning</div>
                <div className="p" style={{ margin: 0 }}>
                  One or more items are below MOQ. Please increase quantities before submitting.
                </div>
              </div>
            )}

            <div style={{ display: "grid", gap: 10 }}>
              {cart.map((item) => {
                const p = findProduct(item.sku);
                const min = parseMoqCartons(p?.moq);
                const q = toIntQty(item.qty);
                const belowMoq = min > 0 && q > 0 && q < min;
                return (
                  <div key={item.sku} className="cartRow">
                    <div className="cartName">
                      {p ? p.name : item.sku} <span style={{ fontWeight: 500 }}>({item.sku})</span>
                      {p?.moq ? (
                        <div className="p" style={{ margin: "6px 0 0" }}>
                          MOQ: {p.moq}
                        </div>
                      ) : null}
                      {belowMoq ? (
                        <div className="p" style={{ margin: "6px 0 0", fontWeight: 700 }}>
                          Below MOQ — need at least {min} cartons
                        </div>
                      ) : null}
                    </div>

                    <div className="cartQty">
                      <span className="p" style={{ margin: 0 }}>Qty (cartons)</span>
                      <input
                        className="input"
                        style={{ width: 120 }}
                        value={item.qty}
                        onChange={(e) => updateQty(item.sku, e.target.value)}
                      />
                    </div>

                    <button type="button" className="button cartRemove" onClick={() => removeFromCart(item.sku)}>
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
              <div className="productCardGrid">
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
            <div className="orderControls">
              <input className="input" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} required />
              <input className="input" placeholder="Company (optional)" value={company} onChange={(e) => setCompany(e.target.value)} />
            </div>

            <div className="orderControls">
              <input className="input" placeholder="Phone number" value={phone} onChange={(e) => setPhone(e.target.value)} required />
              <input className="input" placeholder="Email (optional)" value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
            </div>

            {cart.length === 0 && (
              <p className="p" style={{ margin: 0 }}>
                Please add at least one product above ("Add" or "Add to order") before submitting.
              </p>
            )}

            {cart.length > 0 && moqIssues.length > 0 && (
              <p className="p" style={{ margin: 0, fontWeight: 700 }}>
                MOQ warning: Increase quantities (shown above) before you can submit this order.
              </p>
            )}

            {cart.length > 0 && moqIssues.length > 0 && (
              <div className="card" style={{ background: "var(--green-100)", borderColor: "rgba(11,107,58,.25)" }}>
                <div style={{ fontWeight: 800, marginBottom: 6 }}>MOQ validation</div>
                <div className="p" style={{ margin: 0 }}>
                  Please increase quantities to meet MOQ before submitting.
                </div>
              </div>
            )}

            <textarea
              className="textarea"
              placeholder="Notes (destination city, delivery timing, preferred brand, etc.)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />

            <div className="orderControls">
              <button
                className="button"
                type="button"
                disabled={cart.length === 0}
                onClick={downloadPdf}
              >
                Download PDF
              </button>

              <button className="button" type="submit" disabled={status === "sending" || !canSubmit}>
                {status === "sending" ? "Submitting..." : "Submit Order (PDF attached)"}
              </button>
            </div>

            {status === "sent" && <p className="p">Order request submitted. We’ll contact you soon.</p>}
            {status === "error" && (
              <p className="p">
                {cart.length === 0
                  ? "Please select at least one product."
                  : moqIssues.length > 0
                    ? "Please meet MOQ for all items before submitting."
                    : "Something went wrong. Please try again."}
              </p>
            )}
          </form>
        </div>
      </Section>
    </>
  );
}
