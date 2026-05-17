"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Section from "@/components/Section";
import { getSupabaseBrowserClient } from "@/lib/supabaseBrowser";

type ProductRow = {
  id: string;
  sku: string;
  name: string;
  category: string;
  origin: string | null;
  size: string | null;
  case_pack: string | null;
  moq: string | null;
  description: string | null;
  image_url: string | null;
  available: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
};

function emptyDraft(): Omit<ProductRow, "id"> {
  return {
    sku: "",
    name: "",
    category: "",
    origin: null,
    size: null,
    case_pack: null,
    moq: null,
    description: null,
    image_url: null,
    available: true,
    sort_order: 0,
  };
}

export default function AdminProductsPage() {
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState<string>("");
  const [rows, setRows] = useState<ProductRow[]>([]);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | "available" | "hidden">("all");

  const [showEditor, setShowEditor] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Omit<ProductRow, "id">>(emptyDraft());
  const isEditing = Boolean(editingId);

  async function getAccessToken(): Promise<string | null> {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setStatus("error");
      setError("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY.");
      return null;
    }
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token ?? null;
  }

  async function api<T>(method: string, body?: any): Promise<T> {
    const token = await getAccessToken();
    const res = await fetch("/api/admin/products", {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(json?.error || `Request failed (${res.status})`);
    }
    return json as T;
  }

  async function load() {
    try {
      setStatus("loading");
      setError("");
      const out = await api<{ products: ProductRow[] }>("GET");
      setRows(out.products || []);
      setStatus("ready");
    } catch (e: any) {
      setStatus("error");
      setError(e?.message || "Failed to load products");
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const viewRows = useMemo(() => {
    const query = q.trim().toLowerCase();
    return rows
      .filter((r) => {
        if (filter === "available") return r.available;
        if (filter === "hidden") return !r.available;
        return true;
      })
      .filter((r) => {
        if (!query) return true;
        return (
          r.name.toLowerCase().includes(query) ||
          r.sku.toLowerCase().includes(query) ||
          r.category.toLowerCase().includes(query) ||
          (r.origin ?? "").toLowerCase().includes(query)
        );
      })
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  }, [rows, q, filter]);

  function startCreate() {
    setEditingId(null);
    setDraft(emptyDraft());
    setShowEditor(true);
  }

  function startEdit(r: ProductRow) {
    setEditingId(r.id);
    const { id: _id, ...rest } = r;
    setDraft({ ...rest });
    setShowEditor(true);
  }

  async function save() {
    try {
      if (!draft.sku || !draft.name || !draft.category) {
        alert("SKU, Name, and Category are required.");
        return;
      }
      if (isEditing && editingId) {
        await api("PUT", { id: editingId, ...draft });
      } else {
        await api("POST", draft);
      }
      setShowEditor(false);
      await load();
    } catch (e: any) {
      alert(e?.message || "Save failed");
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this product?")) return;
    try {
      await api("DELETE", { id });
      await load();
    } catch (e: any) {
      alert(e?.message || "Delete failed");
    }
  }

  async function toggleAvailable(r: ProductRow) {
    try {
      const { id, ...rest } = r;
      await api("PUT", { id, ...rest, available: !r.available });
      await load();
    } catch (e: any) {
      alert(e?.message || "Update failed");
    }
  }

  return (
    <div style={{ display: "grid", gap: 18 }}>
      <Section title="Admin - Products">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search (name, SKU, category, origin)"
              className="input"
              style={{ minWidth: 260 }}
            />
            <select value={filter} onChange={(e) => setFilter(e.target.value as any)} className="input" style={{ minWidth: 160 }}>
              <option value="all">All</option>
              <option value="available">Available</option>
              <option value="hidden">Hidden</option>
            </select>
            <button type="button" className="button" onClick={load}>
              Refresh
            </button>
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <Link href="/products" className="button" style={{ textDecoration: "none" }}>
              View Products page
            </Link>
            <Link href="/order" className="button" style={{ textDecoration: "none" }}>
              View Order page
            </Link>
            <button type="button" className="button" onClick={startCreate}>
              + New Product
            </button>
          </div>
        </div>

        {status === "loading" ? <p style={{ marginTop: 12 }}>Loading...</p> : null}
        {status === "error" ? <p style={{ marginTop: 12, color: "crimson" }}>{error}</p> : null}

        {status === "ready" ? (
          <div className="adminTableWrap" style={{ marginTop: 14 }}>
            <table className="adminTable">
              <thead>
                <tr>
                  <th>Available</th>
                  <th>SKU</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Origin</th>
                  <th>Sort</th>
                  <th style={{ width: 220 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {viewRows.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <input type="checkbox" checked={r.available} onChange={() => toggleAvailable(r)} />
                    </td>
                    <td>{r.sku}</td>
                    <td>{r.name}</td>
                    <td>{r.category}</td>
                    <td>{r.origin ?? ""}</td>
                    <td>{r.sort_order ?? 0}</td>
                    <td>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <button type="button" className="button" onClick={() => startEdit(r)}>
                          Edit
                        </button>
                        <button type="button" className="button" onClick={() => remove(r.id)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </Section>

      {showEditor ? (
        <div className="modalOverlay" onClick={() => setShowEditor(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modalHead">
              <div>
                <div className="modalTitle">{isEditing ? "Edit Product" : "New Product"}</div>
                <div className="modalSub">Fields are stored in Supabase public.products</div>
              </div>
              <button type="button" className="modalClose" onClick={() => setShowEditor(false)} aria-label="Close">
                X
              </button>
            </div>

            <div className="adminFormGrid">
              <label className="adminLabel">
                SKU *
                <input className="input" value={draft.sku} onChange={(e) => setDraft((d) => ({ ...d, sku: e.target.value }))} />
              </label>
              <label className="adminLabel">
                Name *
                <input className="input" value={draft.name} onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))} />
              </label>
              <label className="adminLabel">
                Category *
                <input className="input" value={draft.category} onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value }))} />
              </label>
              <label className="adminLabel">
                Origin
                <input className="input" value={draft.origin ?? ""} onChange={(e) => setDraft((d) => ({ ...d, origin: e.target.value || null }))} />
              </label>
              <label className="adminLabel">
                Size
                <input className="input" value={draft.size ?? ""} onChange={(e) => setDraft((d) => ({ ...d, size: e.target.value || null }))} />
              </label>
              <label className="adminLabel">
                Case
                <input
                  className="input"
                  value={draft.case_pack ?? ""}
                  onChange={(e) => setDraft((d) => ({ ...d, case_pack: e.target.value || null }))}
                />
              </label>
              <label className="adminLabel">
                MOQ
                <input className="input" value={draft.moq ?? ""} onChange={(e) => setDraft((d) => ({ ...d, moq: e.target.value || null }))} />
              </label>
              <label className="adminLabel">
                Sort Order
                <input
                  className="input"
                  type="number"
                  value={draft.sort_order ?? 0}
                  onChange={(e) => setDraft((d) => ({ ...d, sort_order: Number(e.target.value || 0) }))}
                />
              </label>
              <label className="adminLabel" style={{ gridColumn: "1 / -1" }}>
                Image URL (public)
                <input
                  className="input"
                  value={draft.image_url ?? ""}
                  onChange={(e) => setDraft((d) => ({ ...d, image_url: e.target.value || null }))}
                  placeholder="https://.../storage/v1/object/public/product-images/your-image.png"
                />
              </label>
              <label className="adminLabel" style={{ gridColumn: "1 / -1" }}>
                Description
                <textarea
                  className="input"
                  value={draft.description ?? ""}
                  onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value || null }))}
                  rows={4}
                />
              </label>

              <label className="adminCheck" style={{ gridColumn: "1 / -1" }}>
                <input type="checkbox" checked={draft.available} onChange={(e) => setDraft((d) => ({ ...d, available: e.target.checked }))} />
                Available
              </label>
            </div>

            <div className="modalFoot">
              <button type="button" className="button" onClick={() => setShowEditor(false)}>
                Cancel
              </button>
              <button type="button" className="button" onClick={save}>
                Save
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
