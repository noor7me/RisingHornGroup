"use client";

import { useEffect, useMemo, useState } from "react";
import Section from "../../components/Section";
import { getSupabaseBrowserClient } from "@/lib/supabaseBrowser";

type AdminStatus = "checking" | "signed_out" | "link_sent" | "not_admin" | "admin" | "error";

export default function AdminPage() {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [status, setStatus] = useState<AdminStatus>("checking");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string>("");

  async function verifyAdmin(accessToken: string) {
    const res = await fetch("/api/admin/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ access_token: accessToken }),
    });

    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      setStatus("not_admin");
      if (txt) setMessage(txt);
      return;
    }

    const json = (await res.json()) as { ok?: boolean };
    if (json?.ok) {
      setStatus("admin");
    } else {
      setStatus("not_admin");
    }
  }

  useEffect(() => {
    let unsub: (() => void) | undefined;

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

    unsub = () => sub.subscription.unsubscribe();
    return () => unsub?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function sendMagicLink(e: React.FormEvent) {
    e.preventDefault();
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
      options: {
        emailRedirectTo: redirectTo,
      },
    });

    if (error) {
      setStatus("error");
      setMessage(error.message);
      return;
    }

    setStatus("link_sent");
  }

  async function signOut() {
    await supabase.auth.signOut();
    setStatus("signed_out");
    setMessage("");
  }

  return (
    <main className="container">
      <Section title="Admin">
        {status === "checking" ? (
          <p>Checking session…</p>
        ) : null}

        {status === "signed_out" ? (
          <div className="card" style={{ maxWidth: 520 }}>
            <p style={{ marginTop: 0 }}>
              Sign in with a magic link. We will email you a secure sign-in link.
            </p>

            <form onSubmit={sendMagicLink} style={{ display: "grid", gap: 12 }}>
              <label style={{ display: "grid", gap: 6 }}>
                <span style={{ fontWeight: 600 }}>Admin email</span>
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
              ✅ Check your email for the magic link. After you click it, you will return here and be signed in.
            </p>
            <p style={{ marginBottom: 0, opacity: 0.8 }}>
              (If you don’t see it, check spam/junk and make sure your Supabase Email provider is enabled.)
            </p>
          </div>
        ) : null}

        {status === "not_admin" ? (
          <div className="card" style={{ maxWidth: 720 }}>
            <p style={{ marginTop: 0 }}>
              You are signed in, but your account is not authorized for admin access.
            </p>
            <button className="button" type="button" onClick={signOut}>
              Sign out
            </button>
          </div>
        ) : null}

        {status === "admin" ? (
          <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <div>
                <h3 style={{ marginTop: 0 }}>Welcome, Admin</h3>
                <p style={{ margin: 0, opacity: 0.8 }}>
                  Next step: we can add a simple Products Manager here (create/update/disable products, upload images).
                </p>
              </div>

              <button className="button" type="button" onClick={signOut}>
                Sign out
              </button>
            </div>

            <div style={{ marginTop: 16, display: "grid", gap: 12 }}>
              <a className="button" href="/products" style={{ textDecoration: "none", textAlign: "center" }}>
                View Products page
              </a>
              <a className="button" href="/order" style={{ textDecoration: "none", textAlign: "center" }}>
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
    </main>
  );
}
