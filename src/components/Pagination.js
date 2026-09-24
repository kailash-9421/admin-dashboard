export default function Pagination({ page, totalPages, pageSize, onPageChange, onPageSizeChange }) {
  const pages = [];
  const start = Math.max(1, Math.min(page - 2, totalPages - 4));
  const end = Math.min(totalPages, start + 4);
  for (let n = start; n <= end; n += 1) pages.push(n);
  return <div className="flex flex-wrap items-center justify-between gap-3"><select value={pageSize} onChange={(e) => onPageSizeChange(Number(e.target.value))} className="rounded-lg border bg-white px-3 py-2 text-sm"><option value={10}>10 / page</option><option value={20}>20 / page</option><option value={50}>50 / page</option></select><div className="flex flex-wrap items-center gap-2"><button disabled={page <= 1} onClick={() => onPageChange(page - 1)} className="rounded-lg border px-3 py-2 text-sm disabled:opacity-40">Previous</button>{pages.map((n) => <button key={n} onClick={() => onPageChange(n)} className={`rounded-lg border px-3 py-2 text-sm ${n === page ? "bg-slate-900 text-white" : "bg-white"}`}>{n}</button>)}<button disabled={page >= totalPages} onClick={() => onPageChange(page + 1)} className="rounded-lg border px-3 py-2 text-sm disabled:opacity-40">Next</button></div></div>;
}
