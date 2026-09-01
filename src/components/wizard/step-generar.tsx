"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api, ApiError } from "@/lib/client-api";
import { WIZARD_STEPS } from "@/lib/constants";
import { Alert, ProgressBar } from "@/components/ui";
import { Icon } from "@/components/icons";
import { WizardFrame, type WizardHeader } from "./frame";
import type { ValidationView } from "./step-revisar";

export function StepGenerar({
  header, validation, threshold, summary,
}: {
  header: WizardHeader;
  validation: ValidationView;
  threshold: number;
  summary: { competencies: number; actions: number; stages: Record<string, number> };
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const canGenerate = validation.completion >= threshold;

  async function generate() {
    setLoading(true);
    setError(null);
    try {
      await api.post(`/api/plans/${header.planId}/finalize`);
      router.push(`/planes/${header.planId}?generado=1`);
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No pudimos generar el plan.");
      setLoading(false);
    }
  }

  return (
    <WizardFrame
      header={header}
      title="Paso 9 · El documento"
      question="Todo listo para generar el plan"
      hint="Revisamos automáticamente que el plan tenga lo necesario para ser útil."
    >
      <div className="space-y-6">
        <section className="card px-6 py-7">
          <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-xl font-bold text-ink-900">
              Tu plan está {validation.completion}% completo
            </h2>
            <p className="muted">Mínimo para generar: {threshold}%</p>
          </div>
          <ProgressBar
            value={validation.completion}
            tone={canGenerate ? "brand" : "warning"}
            className="h-3"
          />

          <ul className="mt-6 space-y-2.5">
            {validation.checks.map((check) => {
              const step = WIZARD_STEPS.find((s) => s.step === check.step);
              return (
                <li key={check.id} className="flex items-start gap-2.5 text-sm">
                  {check.ok ? (
                    <Icon.check className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--color-positive)]" />
                  ) : (
                    <Icon.warning className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--color-warning)]" />
                  )}
                  <span className={check.ok ? "text-ink-500" : "text-ink-900"}>
                    {check.label}
                    {check.detail && <span className="text-ink-400"> — {check.detail}</span>}
                    {!check.ok && step && (
                      <Link
                        href={`/planes/${header.planId}/wizard/${step.slug}`}
                        className="ml-2 font-medium text-brand-700 hover:underline"
                      >
                        Corregir
                      </Link>
                    )}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <SummaryTile label="Competencias" value={summary.competencies} />
          <SummaryTile label="Acciones" value={summary.actions} />
          <SummaryTile label="10% Aprendo" value={summary.stages.M10 ?? 0} />
          <SummaryTile label="20% Me acompañan" value={summary.stages.M20 ?? 0} />
          <SummaryTile label="70% En práctica" value={summary.stages.M70 ?? 0} />
        </section>

        {error && <Alert tone="danger">{error}</Alert>}

        <section className="card flex flex-col items-center gap-4 px-6 py-10 text-center">
          <p className="max-w-lg text-sm text-ink-500">
            Al generar el plan quedará registrado en el histórico y podrás descargar el
            documento en PDF. Si más adelante necesitas cambiarlo, podrás crear una nueva
            versión sin perder esta.
          </p>
          <button
            type="button"
            onClick={generate}
            disabled={!canGenerate || loading}
            className="btn-primary btn-lg uppercase tracking-wide"
          >
            {loading ? "Generando…" : "Generar mi plan de desarrollo"}
          </button>
          {!canGenerate && (
            <p className="text-xs text-[color:var(--color-warning)]">
              Completa los puntos pendientes para poder generarlo.
            </p>
          )}
        </section>
      </div>
    </WizardFrame>
  );
}

function SummaryTile({ label, value }: { label: string; value: number }) {
  return (
    <div className="card px-4 py-4 text-center">
      <p className="text-2xl font-bold text-ink-900">{value}</p>
      <p className="mt-1 text-xs text-ink-400">{label}</p>
    </div>
  );
}
