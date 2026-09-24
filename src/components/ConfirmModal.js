export default function ConfirmModal({ product, loading, onCancel, onConfirm }) {
  if (!product) return null;
  return <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4"><div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"><h2 className="text-lg font-bold">Delete product?</h2><p className="mt-2 text-sm text-slate-600">Are you sure you want to delete “{product.title}”?</p><div className="mt-6 flex justify-end gap-3"><button onClick={onCancel} disabled={loading} className="rounded-lg border px-4 py-2">Cancel</button><button onClick={onConfirm} disabled={loading} className="rounded-lg bg-red-600 px-4 py-2 text-white disabled:opacity-50">{loading ? "Deleting..." : "Delete"}</button></div></div></div>;
}
