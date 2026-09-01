"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Alert, Field } from "@/components/ui";

export function ResetForm() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token") ?? "";
  const email = params.get("email") ?? "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!token || !email) {
    return (
      <Alert tone="danger">
        El enlace no es válido.{" "}
        <Link href="/recuperar" className="font-medium underline">
          Solicita uno nuevo
        </Link>
        .
      </Alert>
    );
  }

  if (done) {
    return (
      <Alert tone="success" title="Contraseña actualizada">
        Ya puedes{" "}
        <Link href="/login" className="font-medium underline">
          entrar con tu nueva contraseña
        </Link>
        .
      </Alert>
    );
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError("Las dos contraseñas no coinciden.");
      return;
    }
    setLoading(true);
    const response = await fetch("/api/auth/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, token, password }),
    });
    const data = await response.json().catch(() => ({}));
    setLoading(false);
    if (!response.ok) {
      setError(data.error ?? "No pudimos actualizar la contraseña.");
      return;
    }
    setDone(true);
    setTimeout(() => router.push("/login"), 2500);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error && <Alert tone="danger">{error}</Alert>}
      <Field label="Nueva contraseña">
        <input
          type="password" required autoFocus className="input" value={password}
          onChange={(e) => setPassword(e.target.value)} minLength={10}
        />
      </Field>
      <Field label="Repite la contraseña">
        <input
          type="password" required className="input" value={confirm}
          onChange={(e) => setConfirm(e.target.value)} minLength={10}
        />
      </Field>
      <button type="submit" className="btn-primary w-full" disabled={loading}>
        {loading ? "Guardando…" : "Guardar contraseña"}
      </button>
    </form>
  );
}
