"use client";

import { useRouter } from "next/navigation";
import Navbar from "../../../components/Navbar";
import ProtectedRoute from "../../../components/ProtectedRoute";
import ProductForm from "../../../components/ProductForm";
import { addProduct } from "../../../services/productService";
import { saveAdded } from "../../../lib/productStore";
import { useState } from "react";

export default function NewProductPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  async function submit(product) {
    if (saving) return;
    setSaving(true);
    try { const created = await addProduct(product); saveAdded(created); router.replace("/products"); }
    catch { alert("Unable to add product. Please retry."); }
    finally { setSaving(false); }
  }
  return <ProtectedRoute><Navbar /><main className="mx-auto max-w-3xl px-4 py-6"><ProductForm saving={saving} onSubmit={submit} /></main></ProtectedRoute>;
}
