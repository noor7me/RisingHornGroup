"use client";

import { useState } from "react";
import Section from "../../components/Section";

const WHATSAPP_NUMBERS = [
  "+252 61 234 5678",
  "+252 62 345 6789",
  "+252 65 987 6543"
];

function WhatsAppIcon() {
  // Simple inline icon (not official trademarked logo)
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" style={{ marginRight: 8 }}>
      <path fill="#0b6b3a" d="M12 2a10 10 0 0 0-8.66 15l-1.2 4.4 4.5-1.18A10 10 0 1 0 12 2zm0 18a8 8 0 0 1-4.09-1.12l-.3-.18-2.65.7.7-2.58-.2-.33A8 8 0 1 1 20 12a8 8 0 0 1-8 8zm4.6-5.77c-.25-.12-1.47-.73-1.7-.81-.23-.09-.4-.12-.57.12-.17.25-.65.8-.8.97-.15.17-.3.18-.55.06-.25-.12-1.06-.39-2.02-1.24-.75-.67-1.25-1.5-1.4-1.75-.15-.25-.02-.38.1-.5.11-.11.25-.3.37-.45.12-.15.17-.25.25-.42.08-.17.04-.31-.02-.43-.06-.12-.57-1.38-.78-1.89-.2-.48-.41-.41-.57-.41h-.49c-.17 0-.43.06-.66.31-.23.25-.87.85-.87 2.07s.9 2.4 1.02 2.56c.12.17 1.78 2.72 4.32 3.82.6.26 1.06.41 1.42.53.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.67-1.18.2-.58.2-1.08.14-1.18-.06-.1-.23-.16-.48-.28z"/>
    </svg>
  );
}

export default function ContactPage() {
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Website Contact",
          company: null,
          email: email || "noemail@example.com",
          message: `Phone: ${phone}\nMessage: ${msg}`
        })
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("sent");
      setPhone(""); setEmail(""); setMsg("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <>
      <h1 className="h1">Contact</h1>
      <p className="p">Send us a message or reach us directly on WhatsApp-enabled numbers.</p>

      <Section title="Reach Us (WhatsApp Enabled)">
        <div className="card">
          <div style={{ display: "grid", gap: 10 }}>
            {WHATSAPP_NUMBERS.map((n) => (
              <div key={n} style={{ display: "flex", alignItems: "center", fontWeight: 700 }}>
                <WhatsAppIcon />
                <span>{n}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section title="Send a Message">
        <div className="card">
          <form onSubmit={submit} style={{ display: "grid", gap: 12 }}>
            <input
              className="input"
              placeholder="Phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            <input
              className="input"
              placeholder="Email (optional)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
            />
            <textarea
              className="textarea"
              placeholder="Message"
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
      </Section>
    </>
  );
}
