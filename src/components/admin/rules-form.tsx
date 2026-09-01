"use client";

import { useState } from "react";
import { api, ApiError } from "@/lib/client-api";
import { RULE_LABELS, type PlatformRules } from "@/lib/rules";
import { Alert, Field } from "@/components/ui";

const HINTS: Partial<Record<keyof PlatformRules, string>> = {
  toolsAllowedCurrentRole:
    "La regla «5 de 8»: cuántas herramientas del catálogo puede combinar un plan de puesto actual.",
  toolsAllowedFutureRole:
    "La regla «8 de 8»: los planes de posición futura acceden al catálogo completo.",
  maxCompetencies:
    "Por encima de este número, la plataforma avisa de que el plan pierde foco.",
  completionThreshold: "Porcentaje mínimo de completitud para poder generar el documento.",
};

export function RulesForm({
  initial, defaults,
}: {
  initial: PlatformRules; defaults: PlatformRules;
}) {
  const [rules, setRules] = useState(initial);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      await api.put("/api/admin/rules", { companyId: null, ...rules });
      setMessage("Reglas guardadas. Se aplican a todas las empresas sin configuración propia.");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No pudimos guardar las reglas.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={save} className="space-y-6">
      <div>
        <h2 className="section-title">Reglas globales de la plataforma</h2>
        <p className="muted mt-1 max-w-2xl">
          Estas reglas gobiernan el comportamiento del asistente. Cada empresa puede
          sobrescribirlas desde su ficha, y ninguna está escrita en el código.
        </p>
      </div>

      {message && <Alert tone="success">{message}</Alert>}
      {error && <Alert tone="danger">{error}</Alert>}

      <div className="card grid gap-5 px-6 py-6 sm:grid-cols-2">
        {(Object.keys(defaults) as (keyof PlatformRules)[]).map((key) => (
          <Field key={key} label={RULE_LABELS[key]} hint={HINTS[key]}>
            <input
              type="number"
              min={0}
              className="input"
              value={rules[key]}
              onChange={(e) => setRules({ ...rules, [key]: Number(e.target.value) })}
            />
          </Field>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? "Guardando…" : "Guardar reglas"}
        </button>
        <button
          type="button"
          className="btn-secondary"
          onClick={() => setRules(defaults)}
        >
          Restaurar valores por defecto
        </button>
      </div>
    </form>
  );
}
