import Link from "next/link";

export default function ProductCard({ products, onDelete }) {
  return <div className="grid gap-4 md:hidden">{products.map((p) => <article key={p.id} className="rounded-xl border bg-white p-4"><div className="flex gap-4"><img src={p.thumbnail} alt="" className="h-20 w-20 rounded-lg object-cover" /><div className="min-w-0"><h2 className="font-semibold">{p.title}</h2><p className="text-sm text-slate-500">{p.category}</p><p className="mt-1 font-medium">${Number(p.price).toFixed(2)}</p></div></div><div className="mt-3 flex justify-between text-sm"><span>Rating: {p.rating}</span><span>Stock: {p.stock}</span></div><div className="mt-4 flex gap-4 text-sm"><Link href={`/products/${p.id}`} className="text-blue-700">View</Link><Link href={`/products/${p.id}?edit=1`} className="text-amber-700">Edit</Link><button onClick={() => onDelete(p)} className="text-red-700">Delete</button></div></article>)}</div>;
}
