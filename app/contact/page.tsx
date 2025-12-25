"use client";

import { useState } from "react";
import Section from "../../components/Section";
import { CONTACT } from "@/lib/contact";

function WhatsAppIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" style={{ marginRight: 8 }}>
      <path
        fill="currentColor"
        d="M20 3H4a2 2 0 0 0-2 2v16l4-4h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z"
      />
    </svg>
  );
}

export default function ContactPage() {
  const { emails, whatsapp } = CONTACT;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [inquiryType, setInquiryType] = useState<"general" | "orders" | "sales">("general");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");

    try {
      const r = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email: email || undefined, phone: phone || undefined, message: msg, inquiryType }),
      });

      if (!r.ok) throw new Error("Request failed");

      setStatus("sent");
      setName("");
      setPhone("");
      setEmail("");
      setMsg("");
      setInquiryType("general");
    } catch {
      setStatus("error");
    }
  }

  return (
    <>
      <Section title="Contact">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left: direct contact */}
          <div className="card">
            <h3 className="h3">Email</h3>

            <div className="mt-4 space-y-3">
              <div>
                <div className="font-semibold">Customers & Orders</div>
                <a className="underline" href={`mailto:${emails.orders}`}>
                  {emails.orders}
                </a>
              </div>

              <div>
                <div className="font-semibold">Suppliers & Partnerships</div>
                <a className="underline" href={`mailto:${emails.sales}`}>
                  {emails.sales}
                </a>
              </div>

              <div>
                <div className="font-semibold">General Inquiries</div>
                <a className="underline" href={`mailto:${emails.info}`}>
                  {emails.info}
                </a>
              </div>
            </div>

            <h3 className="h3 mt-8">WhatsApp</h3>
            <ul className="mt-3 space-y-2">
              {whatsapp.map((w) => (
                <li key={w.e164}>
                  <a
                    className="inline-flex items-center underline"
                    href={`https://wa.me/${w.e164}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <WhatsAppIcon />
                    {w.label}
                  </a>
                </li>
              ))}
            </ul>

            <p className="p mt-6">
              We typically respond within 1–2 business days.
            </p>
          </div>

          {/* Right: contact form */}
          <div className="card">
            <h3 className="h3">Send a Message</h3>
            <p className="p">
              Use this form for quick questions. For orders, we recommend emailing{" "}
              <a className="underline" href={`mailto:${emails.orders}`}>
                {emails.orders}
              </a>
              .
            </p>

            <form className="mt-4 space-y-3" onSubmit={onSubmit}>
              <input
                className="input"
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <input
                className="input"
                type="tel"
                placeholder="Phone (optional)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <input
                className="input"
                type="email"
                placeholder="Email (optional)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <textarea
                className="input"
                placeholder="Message"
                rows={6}
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                required
              />
              <button className="button" type="submit" disabled={status === "sending"}>
                {status === "sending" ? "Sending..." : "Submit"}
              </button>

              {status === "sent" && <p className="p">Message received. We’ll respond soon.</p>}
              {status === "error" && <p className="p">Something went wrong. Please try again.</p>}
            </form>
          </div>
        </div>
      </Section>
    </>
  );
}
