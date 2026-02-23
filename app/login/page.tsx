"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("founder@example.com");
  const [password, setPassword] = useState("foundr123");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      if (res.ok) {
        router.push("/dashboard");
      } else {
        setError("Invalid credentials. Use founder@example.com / foundr123.");
      }
    } catch {
      setError("Unable to reach auth server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-950/90 p-6 shadow-xl shadow-black/60"
      >
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
          Founder access
        </div>
        <h1 className="mt-2 text-xl font-semibold text-slate-50">
          Sign in to simulator
        </h1>
        <p className="mt-1 text-xs text-slate-400">
          Demo credentials are prefilled for you. This is a lightweight mock auth layer
          backed by in-memory data.
        </p>

        <div className="mt-5 space-y-3">
          <div className="space-y-1">
            <label className="metric-label">Email</label>
            <input
              type="email"
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none ring-emerald-500/40 focus:border-emerald-400 focus:ring-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="metric-label">Password</label>
            <input
              type="password"
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none ring-emerald-500/40 focus:border-emerald-400 focus:ring-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        {error && (
          <div className="mt-3 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-100">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-5 w-full rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-slate-950 shadow-lg shadow-emerald-500/40 hover:bg-emerald-400 disabled:cursor-wait disabled:opacity-70"
        >
          {loading ? "Checking credentials..." : "Enter simulator"}
        </button>
      </form>
    </div>
  );
}

