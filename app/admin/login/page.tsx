"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Something went wrong");
      return;
    }

    router.push(params.get("from") || "/admin");
    router.refresh();
  }

  return (
    <main className="max-w-sm mx-auto px-4 py-24">
      <h1 className="text-2xl font-semibold mb-2">Admin</h1>
      <p className="text-sm text-muted-foreground mb-6">
        This is a demo admin panel. Menu and gallery changes made here are
        sandboxed to your browser only — nothing you do can affect the live
        site's real data.
      </p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="password"
          placeholder="Password"
          required
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded-md p-2"
        />
        {error && <p className="text-sm text-red-800">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="bg-foreground text-background rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          {loading ? "Checking..." : "Enter"}
        </button>
      </form>
    </main>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
