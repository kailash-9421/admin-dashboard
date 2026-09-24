const KEY = "dashboard-product-changes";

function read() {
  if (typeof window === "undefined") return { added: [], updated: {}, deleted: [] };
  try { return JSON.parse(localStorage.getItem(KEY)) || { added: [], updated: {}, deleted: [] }; }
  catch { return { added: [], updated: {}, deleted: [] }; }
}

function write(value) { localStorage.setItem(KEY, JSON.stringify(value)); }

export function applyLocalChanges(products) {
  const changes = read();
  const deleted = new Set(changes.deleted.map(String));
  const base = products.filter((p) => !deleted.has(String(p.id))).map((p) => changes.updated[p.id] ? { ...p, ...changes.updated[p.id] } : p);
  const existing = new Set(base.map((p) => String(p.id)));
  return [...changes.added.filter((p) => !existing.has(String(p.id))), ...base];
}

export function saveAdded(product) { const c = read(); c.added.unshift(product); write(c); }
export function saveUpdated(id, product) { const c = read(); c.updated[id] = product; write(c); }
export function saveDeleted(id) { const c = read(); c.deleted.push(id); write(c); }
