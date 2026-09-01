"use client";

import { useState } from "react";
import { Alert, Field } from "@/components/ui";

export function ForgotForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [devLink, setDevLink] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    const response = await fetch("/api/auth/forgot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await response.json().catch(() => ({}));
    setDevLink(data.devLink ?? null);
    setSent(true);
    setLoading(false);
  }

  if (sent) {
    return (
      <Alert tone="success" title="Revisa tu correo">
        Si la dirección existe en la plataforma, recibirás un enlace para crear una
        contraseña nueva. El enlace caduca en una hora.
        {devLink && (
          <p className="mt-3 break-all text-xs">
            Entorno de desarrollo —{" "}
            <a href={devLink} className="font-medium underline">
              abrir enlace de restablecimiento
            </a>
          </p>
        )}
      </Alert>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Field label="Correo corporativo">
        <input
          type="email" required autoFocus className="input" value={email}
          onChange={(e) => setEmail(e.target.value)} placeholder="nombre@empresa.com"
        />
      </Field>
      <button type="submit" className="btn-primary w-full" disabled={loading}>
        {loading ? "Enviando…" : "Enviar instrucciones"}
      </button>
    </form>
  );
}
