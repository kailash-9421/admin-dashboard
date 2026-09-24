"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Navbar from "../../../components/Navbar";
import ProtectedRoute from "../../../components/ProtectedRoute";
import ProductForm from "../../../components/ProductForm";
import Loader from "../../../components/Loader";
import { getProductById, updateProduct } from "../../../services/productService";
import { saveUpdated } from "../../../lib/productStore";

function ProductContent() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const editing = searchParams.get("edit") === "1";
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let active = true;
    getProductById(id).then((data) => { if (active) setProduct(data); }).catch(() => { if (active) setNotFound(true); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);

  async function submit(values) {
    if (saving) return;
    setSaving(true);
    try { const updated = await updateProduct(id, values); saveUpdated(id, updated); setProduct((old) => ({ ...old, ...updated })); router.replace(`/products/${id}`); }
    catch { alert("Unable to save product. Please retry."); }
    finally { setSaving(false); }
  }

  if (loading) return <Loader text="Loading product..." />;
  if (notFound || !product) return <main className="mx-auto max-w-3xl px-4 py-16 text-center"><h1 className="text-2xl font-bold">Product Not Found</h1><button onClick={() => router.push("/products")} className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-white">Back to Products</button></main>;

  return editing ? <main className="mx-auto max-w-3xl px-4 py-6"><ProductForm mode="edit" initial={product} saving={saving} onSubmit={submit} /></main> : <main className="mx-auto max-w-4xl px-4 py-6"><div className="rounded-2xl border bg-white p-6"><button onClick={() => router.push("/products")} className="mb-5 text-sm text-blue-700">← Back to products</button><div className="grid gap-6 md:grid-cols-2"><div><img src={product.thumbnail} alt={product.title} className="aspect-square w-full rounded-xl object-cover" /></div><div><h1 className="text-3xl font-bold">{product.title}</h1><p className="mt-3 text-slate-600">{product.description}</p><dl className="mt-6 grid grid-cols-2 gap-4"><div><dt className="text-sm text-slate-500">Price</dt><dd className="font-semibold">${Number(product.price).toFixed(2)}</dd></div><div><dt className="text-sm text-slate-500">Rating</dt><dd>{product.rating}</dd></div><div><dt className="text-sm text-slate-500">Category</dt><dd>{product.category}</dd></div><div><dt className="text-sm text-slate-500">Stock</dt><dd>{product.stock}</dd></div></dl><button onClick={() => router.push(`/products/${id}?edit=1`)} className="mt-6 rounded-lg bg-slate-900 px-4 py-2 text-white">Edit Product</button></div></div><section className="mt-8 border-t pt-6"><h2 className="text-xl font-bold">Reviews</h2>{product.reviews?.length ? <div className="mt-4 space-y-3">{product.reviews.map((review, i) => <article key={i} className="rounded-lg bg-slate-50 p-4"><div className="font-medium">{review.reviewerName} · {review.rating}/5</div><p className="mt-1 text-sm text-slate-600">{review.comment}</p></article>)}</div> : <p className="mt-2 text-sm text-slate-500">No reviews available.</p>}</section></div></main>;
}

export default function ProductPage() { return <ProtectedRoute><Navbar /><ProductContent /></ProtectedRoute>; }
