"use client";

import { useEffect, useState } from "react";

const empty = { title: "", category: "", price: "", stock: "", description: "", thumbnail: "" };

export default function ProductForm({ initial = empty, mode = "add", saving, onSubmit }) {
  const [form, setForm] = useState({ ...empty, ...initial });
  const [error, setError] = useState("");
  useEffect(() => setForm({ ...empty, ...initial }), [initial]);

  function change(e) { setForm((old) => ({ ...old, [e.target.name]: e.target.value })); }

  function submit(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.category.trim() || !form.description.trim()) return setError("Title, category and description are required.");
    if (Number(form.price) < 0 || Number(form.stock) < 0) return setError("Price and stock cannot be negative.");
    setError("");
    onSubmit({ ...form, price: Number(form.price), stock: Number(form.stock) });
  }

  return <form onSubmit={submit} className="rounded-2xl border bg-white p-6 space-y-5">
    <div><h1 className="text-2xl font-bold">{mode === "edit" ? "Edit Product" : "Add Product"}</h1><p className="mt-1 text-sm text-slate-500">Validated product form.</p></div>
    <div className="grid gap-4 md:grid-cols-2">
      <label className="text-sm font-medium">Title<input name="title" value={form.title} onChange={change} className="mt-2 w-full rounded-lg border px-3 py-2" /></label>
      <label className="text-sm font-medium">Category<input name="category" value={form.category} onChange={change} className="mt-2 w-full rounded-lg border px-3 py-2" /></label>
      <label className="text-sm font-medium">Price<input name="price" type="number" min="0" step="0.01" value={form.price} onChange={change} className="mt-2 w-full rounded-lg border px-3 py-2" /></label>
      <label className="text-sm font-medium">Stock<input name="stock" type="number" min="0" value={form.stock} onChange={change} className="mt-2 w-full rounded-lg border px-3 py-2" /></label>
      <label className="text-sm font-medium md:col-span-2">Image URL<input name="thumbnail" value={form.thumbnail} onChange={change} className="mt-2 w-full rounded-lg border px-3 py-2" /></label>
      <label className="text-sm font-medium md:col-span-2">Description<textarea name="description" rows="5" value={form.description} onChange={change} className="mt-2 w-full rounded-lg border px-3 py-2" /></label>
    </div>
    {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    <button disabled={saving} className="rounded-lg bg-slate-900 px-5 py-2.5 text-white disabled:opacity-50">{saving ? "Saving..." : mode === "edit" ? "Save Changes" : "Create Product"}</button>
  </form>;
}
