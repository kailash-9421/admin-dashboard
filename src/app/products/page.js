"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Navbar from "../../components/Navbar";
import ProtectedRoute from "../../components/ProtectedRoute";
import ProductTable from "../../components/ProductTable";
import ProductCard from "../../components/ProductCard";
import Pagination from "../../components/Pagination";
import Loader from "../../components/Loader";
import ErrorState from "../../components/ErrorState";
import ConfirmModal from "../../components/ConfirmModal";
import { deleteProduct, getCategories, getProducts } from "../../services/productService";
import { applyLocalChanges, saveDeleted } from "../../lib/productStore";

function ProductsContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const parsedPage = Number(searchParams.get("page"));
  const parsedSize = Number(searchParams.get("pageSize"));
  const page = Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const pageSize = [10, 20, 50].includes(parsedSize) ? parsedSize : 10;
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const sortBy = searchParams.get("sortBy") || "title";
  const order = searchParams.get("order") === "desc" ? "desc" : "asc";

  const [searchInput, setSearchInput] = useState(search);
  const [categories, setCategories] = useState([]);
  const [data, setData] = useState({ products: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const updateParams = useCallback((updates) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === "" || value === null || value === undefined) params.delete(key);
      else params.set(key, String(value));
    });
    router.push(`${pathname}?${params.toString()}`);
  }, [pathname, router, searchParams]);

  useEffect(() => setSearchInput(search), [search]);

  useEffect(() => {
    getCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  const load = useCallback(async (signal) => {
    setLoading(true); setError("");
    try {
      const result = await getProducts({ limit: pageSize, skip: (page - 1) * pageSize, search, category: search ? "" : category, sortBy, order, signal });
      const products = applyLocalChanges(result.products || []);
      setData({ products, total: result.total || products.length });
    } catch (err) {
      if (err.name !== "CanceledError" && err.code !== "ERR_CANCELED") setError("Unable to load products.");
    } finally { if (!signal.aborted) setLoading(false); }
  }, [page, pageSize, search, category, sortBy, order]);

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, [load]);

  const totalPages = Math.max(1, Math.ceil(data.total / pageSize));
  useEffect(() => {
    if (!loading && page > totalPages) updateParams({ page: totalPages });
  }, [loading, page, totalPages, updateParams]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== search) updateParams({ search: searchInput, page: 1, category: "" });
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput, search, updateParams]);

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteProduct(deleteTarget.id);
      saveDeleted(deleteTarget.id);
      setDeleteTarget(null);
      load(new AbortController().signal);
    } catch { setError("Delete failed. Please retry."); }
    finally { setDeleting(false); }
  }

  const start = data.total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, data.total);
  const categoryOptions = useMemo(() => categories.map((c) => typeof c === "string" ? c : c.slug || c.name).filter(Boolean), [categories]);

  return <>
    <Navbar />
    <main className="mx-auto max-w-7xl px-4 py-6 space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3"><div><h1 className="text-2xl font-bold">Products</h1><p className="text-sm text-slate-500">Manage your product catalog.</p></div><button onClick={() => router.push("/products/new")} className="rounded-lg bg-slate-900 px-4 py-2 text-sm text-white">Add Product</button></div>
      <div className="grid gap-3 md:grid-cols-4">
        <input value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="Search products..." className="rounded-lg border bg-white px-3 py-2" />
        <select value={category} disabled={Boolean(search)} onChange={(e) => updateParams({ category: e.target.value, page: 1, search: "" })} className="rounded-lg border bg-white px-3 py-2 disabled:bg-slate-100"><option value="">All categories</option>{categoryOptions.map((c) => <option key={c} value={c}>{c}</option>)}</select>
        <select value={sortBy} onChange={(e) => updateParams({ sortBy: e.target.value, page: 1 })} className="rounded-lg border bg-white px-3 py-2"><option value="title">Sort: Title</option><option value="price">Sort: Price</option><option value="rating">Sort: Rating</option></select>
        <select value={order} onChange={(e) => updateParams({ order: e.target.value, page: 1 })} className="rounded-lg border bg-white px-3 py-2"><option value="asc">Ascending</option><option value="desc">Descending</option></select>
      </div>
      {search && <p className="text-xs text-slate-500">Category filter is disabled while search is active.</p>}
      {error ? <ErrorState message={error} onRetry={() => load(new AbortController().signal)} /> : loading ? <Loader text="Loading products..." /> : data.products.length === 0 ? <div className="rounded-xl border bg-white p-12 text-center text-slate-500">No products found.</div> : <><div className="text-sm text-slate-500">Showing {start}–{end} of {data.total}</div><ProductTable products={data.products} onDelete={setDeleteTarget} /><ProductCard products={data.products} onDelete={setDeleteTarget} /><Pagination page={page} totalPages={totalPages} pageSize={pageSize} onPageChange={(next) => updateParams({ page: next })} onPageSizeChange={(size) => updateParams({ page: 1, pageSize: size })} /></>}
    </main>
    <ConfirmModal product={deleteTarget} loading={deleting} onCancel={() => setDeleteTarget(null)} onConfirm={confirmDelete} />
  </>;
}

export default function ProductsPage() { return <ProtectedRoute><ProductsContent /></ProtectedRoute>; }
