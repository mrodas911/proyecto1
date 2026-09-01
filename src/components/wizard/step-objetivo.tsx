"use client";

import { useState } from "react";
import type { Horizon, ObjectiveType } from "@prisma/client";
import { api } from "@/lib/client-api";
import {
  HORIZON_LABELS,
  OBJECTIVE_DESCRIPTIONS,
  OBJECTIVE_LABELS,
} from "@/lib/constants";
import { Alert, Field } from "@/components/ui";
import { Icon } from "@/components/icons";
import { WizardFrame, type WizardHeader } from "./frame";
import { useSaveState } from "./save-state";

export type ObjetivoData = {
  objectiveType: ObjectiveType | null;
  objectiveStatement: string;
  targetPositionTitle: string;
  targetPositionArea: string;
  horizon: Horizon | null;
  personName: string;
};

const HORIZONS: Horizon[] = ["LT_12M", "M12_24", "GT_24M"];

export function StepObjetivo({
  header, data, quotaCurrent, quotaFuture, usedTools,
}: {
  header: WizardHeader;
  data: ObjetivoData;
  quotaCurrent: number;
  quotaFuture: number;
  usedTools: number;
}) {
  const [state, setState] = useState(data);
  const { run } = useSaveState();

  function save(patch: Partial<ObjetivoData>) {
    const next = { ...state, ...patch };
    setState(next);
    run(() =>
      api.patch(`/api/plans/${header.planId}`, {
        objectiveType: next.objectiveType,
        objectiveStatement: next.objectiveStatement || null,
        targetPositionTitle: next.targetPositionTitle || null,
        targetPositionArea: next.targetPositionArea || null,
        horizon: next.horizon,
      })
    );
  }

  const isFuture = state.objectiveType === "FUTURE_ROLE";
  const quota = isFuture ? quotaFuture : quotaCurrent;
  const overQuota = usedTools > quota;

  return (
    <WizardFrame
      header={header}
      title="Paso 3 · El propósito del plan"
      question="¿Cuál es el objetivo principal de este plan de desarrollo?"
      hint="Esta decisión cambia el tipo de experiencias que la plataforma te va a proponer."
      nextDisabled={!state.objectiveType || (isFuture && !state.targetPositionTitle.trim())}
    >
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          {(["CURRENT_ROLE", "FUTURE_ROLE"] as ObjectiveType[]).map((option) => {
            const selected = state.objectiveType === option;
            return (
              <button
                key={option}
                type="button"
                onClick={() => save({ objectiveType: option })}
                aria-pressed={selected}
                className={`rounded-2xl border px-6 py-7 text-left transition-all ${
                  selected
                    ? "border-brand-500 bg-brand-50 shadow-[0_0_0_3px_var(--color-brand-100)]"
                    : "border-sand-300 bg-white hover:-translate-y-0.5 hover:border-brand-300"
                }`}
              >
                <span
                  className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${
                    selected ? "bg-brand-600 text-white" : "bg-sand-100 text-brand-600"
                  }`}
                >
                  {option === "CURRENT_ROLE" ? (
                    <Icon.target className="h-5 w-5" />
                  ) : (
                    <Icon.route className="h-5 w-5" />
                  )}
                </span>
                <span className="mt-4 block text-lg font-bold text-ink-900">
                  {OBJECTIVE_LABELS[option]}
                </span>
                <span className="mt-2 block text-sm leading-relaxed text-ink-500">
                  {OBJECTIVE_DESCRIPTIONS[option]}
                </span>
                <span className="mt-4 block text-xs font-semibold text-brand-700">
                  {option === "CURRENT_ROLE"
                    ? `Podrás utilizar ${quotaCurrent} herramientas del catálogo`
                    : `Tendrás acceso a las ${quotaFuture} herramientas completas`}
                </span>
              </button>
            );
          })}
        </div>

        {overQuota && (
          <Alert tone="warning" title="Revisa las herramientas que ya usaste">
            Este objetivo permite {quota} herramientas y tu plan ya utiliza {usedTools}.
            Ajusta las acciones en el paso de revisión antes de generar el documento.
          </Alert>
        )}

        {isFuture && (
          <section className="card animate-rise px-6 py-6">
            <h2 className="section-title">¿Cuál es la posición objetivo?</h2>
            <p className="muted mb-5 mt-1">
              Nos permite proponer experiencias que preparen realmente para ese salto.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Cargo futuro" required>
                <input
                  className="input"
                  value={state.targetPositionTitle}
                  onChange={(e) => setState({ ...state, targetPositionTitle: e.target.value })}
                  onBlur={() => save({})}
                  placeholder="Gerente Regional"
                />
              </Field>
              <Field label="Área">
                <input
                  className="input"
                  value={state.targetPositionArea}
                  onChange={(e) => setState({ ...state, targetPositionArea: e.target.value })}
                  onBlur={() => save({})}
                  placeholder="Comercial"
                />
              </Field>
            </div>
            <div className="mt-5">
              <p className="label">Horizonte estimado</p>
              <div className="grid gap-2 sm:grid-cols-3">
                {HORIZONS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => save({ horizon: option })}
                    className={`rounded-xl border px-4 py-3 text-sm transition-all ${
                      state.horizon === option
                        ? "border-brand-500 bg-brand-50 font-semibold text-brand-800"
                        : "border-sand-300 bg-white text-ink-700 hover:border-brand-300"
                    }`}
                  >
                    {HORIZON_LABELS[option]}
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {state.objectiveType && (
          <section className="card px-6 py-6">
            <Field
              label="En una frase, ¿qué queremos lograr con este plan?"
              hint="Aparecerá en el documento final. Puedes escribirlo con tus propias palabras."
            >
              <textarea
                className="input min-h-24"
                value={state.objectiveStatement}
                onChange={(e) => setState({ ...state, objectiveStatement: e.target.value })}
                onBlur={() => save({})}
                placeholder={
                  isFuture
                    ? `Preparar a ${state.personName} para asumir la posición de ${
                        state.targetPositionTitle || "…"
                      }, ampliando su mirada de negocio y su capacidad de movilizar a otras áreas.`
                    : `Llevar el desempeño de ${state.personName} a un nivel superior en su rol actual, consolidando su autonomía y su impacto en los resultados del área.`
                }
              />
            </Field>
          </section>
        )}
      </div>
    </WizardFrame>
  );
}
