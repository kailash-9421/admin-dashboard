"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "../../services/authService";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (loading) return;
    setError("");
    setLoading(true);
    try {
      const data = await loginUser(username.trim(), password);
      localStorage.setItem("token", data.accessToken);
      router.replace("/products");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid username or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 flex items-center justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm border border-slate-200 space-y-5">
        <div><h1 className="text-2xl font-bold">Product Admin</h1><p className="text-sm text-slate-500 mt-1">Sign in to manage products.</p></div>
        <label className="block text-sm font-medium">Username<input value={username} onChange={(e) => setUsername(e.target.value)} className="mt-2 w-full rounded-lg border px-3 py-2" required /></label>
        <label className="block text-sm font-medium">Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2 w-full rounded-lg border px-3 py-2" required /></label>
        {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</p>}
        <button disabled={loading} className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-white disabled:opacity-50">{loading ? "Logging in..." : "Login"}</button>
        <p className="text-xs text-slate-500">Assignment login: emilys / emilyspass</p>
      </form>
    </main>
  );
}
