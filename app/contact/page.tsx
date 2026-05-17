"use client";

import { useState } from "react";
import Section from "../../components/Section";
import { CONTACT } from "@/lib/contact";

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
        body: JSON.stringify({
          name,
          email: email || undefined,
          phone: phone || undefined,
          message: msg,
          inquiryType,
        }),
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
      <header className="pageHeader">
        <p className="eyebrow">Contact</p>
        <h1 className="pageTitle">Contact sales</h1>
        <div className="heroPoints">
          <span>Orders</span>
          <span>Supplier introductions</span>
          <span>General questions</span>
          <span>1-2 business day response</span>
        </div>
      </header>

      <Section title="Direct contact">
        <div className="contactGrid">
          <div className="card contactStack">
            <div className="contactMethod">
              <div className="contactLabel">Customers and orders</div>
              <a className="underline" href={`mailto:${emails.orders}`}>
                {emails.orders}
              </a>
            </div>

            <div className="contactMethod">
              <div className="contactLabel">Suppliers and partnerships</div>
              <a className="underline" href={`mailto:${emails.sales}`}>
                {emails.sales}
              </a>
            </div>

            <div className="contactMethod">
              <div className="contactLabel">General inquiries</div>
              <a className="underline" href={`mailto:${emails.info}`}>
                {emails.info}
              </a>
            </div>

            <div className="contactMethod">
              <div className="contactLabel">WhatsApp</div>
              <div className="contactStack">
                {whatsapp.map((w) => (
                  <a
                    key={w.e164}
                    className="button secondary"
                    href={`https://wa.me/${w.e164}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {w.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <form className="card formStack" onSubmit={onSubmit}>
            <div>
              <h2 className="cardTitle">Send a message</h2>
              <div className="miniLine">Choose type. Add details. Submit.</div>
            </div>

            <label className="fieldLabel">
              Inquiry type
              <select
                className="input"
                value={inquiryType}
                onChange={(e) => setInquiryType(e.target.value as "general" | "orders" | "sales")}
              >
                <option value="general">General inquiry</option>
                <option value="orders">Customer or order inquiry</option>
                <option value="sales">Supplier or partnership inquiry</option>
              </select>
            </label>

            <label className="fieldLabel">
              Name
              <input className="input" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </label>

            <div className="grid2">
              <label className="fieldLabel">
                Phone
                <input className="input" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </label>
              <label className="fieldLabel">
                Email
                <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </label>
            </div>

            <label className="fieldLabel">
              Message
              <textarea className="textarea" value={msg} onChange={(e) => setMsg(e.target.value)} required />
            </label>

            <div className="formActions">
              <button className="button" type="submit" disabled={status === "sending"}>
                {status === "sending" ? "Sending..." : "Submit Message"}
              </button>
            </div>

            {status === "sent" ? <p className="muted">Message received. We will respond soon.</p> : null}
            {status === "error" ? <p className="muted">Something went wrong. Please try again or email us directly.</p> : null}
          </form>
        </div>
      </Section>
    </>
  );
}
