"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Alert, Field } from "@/components/ui";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "No pudimos iniciar la sesión.");
        return;
      }
      const next = params.get("next");
      router.push(next && next.startsWith("/") ? next : "/dashboard");
      router.refresh();
    } catch {
      setError("No pudimos conectar con el servidor. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error && <Alert tone="danger">{error}</Alert>}
      <Field label="Correo corporativo">
        <input
          type="email" required autoComplete="email" autoFocus className="input"
          value={email} onChange={(e) => setEmail(e.target.value)}
          placeholder="nombre@empresa.com"
        />
      </Field>
      <Field label="Contraseña">
        <input
          type="password" required autoComplete="current-password" className="input"
          value={password} onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />
      </Field>
      <button type="submit" className="btn-primary w-full" disabled={loading}>
        {loading ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}
