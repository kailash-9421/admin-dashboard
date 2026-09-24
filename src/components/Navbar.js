"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { logout } from "../lib/auth";

export default function Navbar() {
  const router = useRouter();
  function handleLogout() { logout(); router.replace("/login"); }
  return <header className="border-b bg-white"><div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4"><Link href="/products" className="font-bold">Product Admin</Link><nav className="flex items-center gap-3 text-sm"><Link href="/products">Products</Link><Link href="/products/new">Add Product</Link><button onClick={handleLogout} className="rounded-lg border px-3 py-2">Logout</button></nav></div></header>;
}
