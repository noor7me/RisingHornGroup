"use client";

import { useEffect, useState } from "react";
import Section from "../../components/Section";
import { getSupabaseBrowserClient } from "@/lib/supabaseBrowser";

type AdminStatus = "checking" | "signed_out" | "link_sent" | "not_admin" | "admin" | "error";

export default function AdminPage() {
  const [status, setStatus] = useState<AdminStatus>("checking");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  async function verifyAdmin(accessToken: string) {
    const res = await fetch("/api/admin/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ access_token: accessToken }),
    });

    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      setStatus(res.status >= 500 ? "error" : "not_admin");
      if (txt) setMessage(txt);
      return;
    }

    const json = (await res.json()) as { ok?: boolean };
    setStatus(json?.ok ? "admin" : "not_admin");
  }

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setStatus("error");
      setMessage("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY.");
      return;
    }

    (async () => {
      const { data } = await supabase.auth.getSession();
      const accessToken = data.session?.access_token ?? "";
      if (!accessToken) {
        setStatus("signed_out");
        return;
      }
      await verifyAdmin(accessToken);
    })();

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const accessToken = session?.access_token ?? "";
      if (!accessToken) {
        setStatus("signed_out");
        return;
      }
      await verifyAdmin(accessToken);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  async function sendMagicLink(e: React.FormEvent) {
    e.preventDefault();
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setStatus("error");
      setMessage("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY.");
      return;
    }
    setMessage("");
    setStatus("checking");

    const emailTrim = email.trim().toLowerCase();
    if (!emailTrim) {
      setStatus("signed_out");
      setMessage("Please enter your email.");
      return;
    }

    const redirectTo = typeof window !== "undefined" ? `${window.location.origin}/admin` : undefined;
    const { error } = await supabase.auth.signInWithOtp({
      email: emailTrim,
      options: { emailRedirectTo: redirectTo },
    });

    if (error) {
      setStatus("error");
      setMessage(error.message);
      return;
    }

    setStatus("link_sent");
  }

  async function signOut() {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    await supabase.auth.signOut();
    setStatus("signed_out");
    setMessage("");
  }

  return (
    <>
      <Section title="Admin">
        {status === "checking" ? <p>Checking session...</p> : null}

        {status === "signed_out" ? (
          <div className="card" style={{ maxWidth: 520 }}>
            <p style={{ marginTop: 0 }}>Sign in with a magic link. We will email you a secure sign-in link.</p>
            <form onSubmit={sendMagicLink} className="formStack">
              <label className="fieldLabel">
                Admin email
                <input
                  className="input"
                  type="email"
                  required
                  placeholder="abdinur@risinghorn.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
              <button className="button" type="submit">
                Send magic link
              </button>
              {message ? <p style={{ margin: 0, color: "crimson" }}>{message}</p> : null}
            </form>
          </div>
        ) : null}

        {status === "link_sent" ? (
          <div className="card" style={{ maxWidth: 640 }}>
            <p style={{ marginTop: 0 }}>
              Check your email for the magic link. After you click it, you will return here and be signed in.
            </p>
            <p style={{ marginBottom: 0, opacity: 0.8 }}>
              If you do not see it, check spam/junk and make sure your Supabase email provider is enabled.
            </p>
          </div>
        ) : null}

        {status === "not_admin" ? (
          <div className="card" style={{ maxWidth: 720 }}>
            <p style={{ marginTop: 0 }}>You are signed in, but your account is not authorized for admin access.</p>
            {message ? <p style={{ whiteSpace: "pre-wrap", opacity: 0.8, marginTop: 8 }}>{message}</p> : null}
            <button className="button" type="button" onClick={signOut}>
              Sign out
            </button>
          </div>
        ) : null}

        {status === "admin" ? (
          <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <div>
                <h3 className="cardTitle">Welcome, Admin</h3>
                <p className="muted" style={{ marginBottom: 0 }}>
                  Manage your catalog and images from the Products Manager.
                </p>
              </div>
              <button className="button secondary" type="button" onClick={signOut}>
                Sign out
              </button>
            </div>
            <div className="formStack" style={{ marginTop: 16 }}>
              <a className="button" href="/admin/products">
                Products Manager
              </a>
              <a className="button secondary" href="/products">
                View Products page
              </a>
              <a className="button secondary" href="/order">
                View Order page
              </a>
            </div>
          </div>
        ) : null}

        {status === "error" ? (
          <div className="card" style={{ maxWidth: 900 }}>
            <p style={{ marginTop: 0, color: "crimson", fontWeight: 700 }}>Admin check error</p>
            <p style={{ marginBottom: 0, whiteSpace: "pre-wrap" }}>{message}</p>
          </div>
        ) : null}
      </Section>
    </>
  );
}
