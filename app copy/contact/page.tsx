"use client";

import { useState } from "react";
import Section from "../../components/Section";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, company, email, message })
      });

      if (!res.ok) throw new Error("Request failed");
      setStatus("sent");
      setName(""); setCompany(""); setEmail(""); setMessage("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <>
      <h1 className="h1">Contact</h1>
      <p>Request pricing, availability, or sourcing support.</p>

      <Section title="Send a Message">
        <div className="card">
          <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
            <input className="input" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} required />
            <input className="input" placeholder="Company (optional)" value={company} onChange={(e) => setCompany(e.target.value)} />
            <input className="input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required type="email" />
            <textarea className="textarea" placeholder="Message" value={message} onChange={(e) => setMessage(e.target.value)} required />
            <button className="button" type="submit" disabled={status === "sending"}>
              {status === "sending" ? "Sending..." : "Submit"}
            </button>

            {status === "sent" && <p>Message received. We’ll respond soon.</p>}
            {status === "error" && <p>Something went wrong. Please try again.</p>}
          </form>
        </div>
      </Section>
    </>
  );
}
