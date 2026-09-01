"use client";

import { useState } from "react";
import type { Aspiration, DiagnosticSource, RatingLevel } from "@prisma/client";
import { api } from "@/lib/client-api";
import {
  ASPIRATION_LABELS,
  NINE_BOX_LABELS,
  NINE_BOX_READINGS,
  RATING_LABELS,
  nineBoxCell,
} from "@/lib/constants";
import { Alert, Field } from "@/components/ui";
import { WizardFrame, type WizardHeader } from "./frame";
import { useSaveState } from "./save-state";

export type DiagnosticData = {
  source: DiagnosticSource;
  performance: RatingLevel | null;
  potential: RatingLevel | null;
  aspiration: Aspiration;
  aspirationNote: string;
  notes: string;
};

export type ExistingEvaluation = {
  period: string;
  rating: RatingLevel;
  comment: string | null;
};

const RATINGS: RatingLevel[] = ["LOW", "MEDIUM", "HIGH"];
const ASPIRATIONS: Aspiration[] = [
  "GROW_LEADERSHIP",
  "GROW_SPECIALIST",
  "LATERAL_MOVE",
  "CONSOLIDATE",
  "UNDEFINED",
];

export function StepDiagnostico({
  header, data, performanceEval, potentialEval,
}: {
  header: WizardHeader;
  data: DiagnosticData;
  performanceEval: ExistingEvaluation | null;
  potentialEval: ExistingEvaluation | null;
}) {
  const hasExisting = Boolean(performanceEval || potentialEval);
  const [state, setState] = useState<DiagnosticData>(data);
  const { run } = useSaveState();

  function persist(next: DiagnosticData) {
    setState(next);
    if (!next.performance || !next.potential) return;
    run(() =>
      api.put(`/api/plans/${header.planId}/diagnostic`, {
        source: next.source,
        performance: next.performance,
        potential: next.potential,
        aspiration: next.aspiration,
        aspirationNote: next.aspirationNote || null,
        notes: next.notes || null,
      })
    );
  }

  function useExisting() {
    persist({
      ...state,
      source: "EXISTING",
      performance: performanceEval?.rating ?? state.performance,
      potential: potentialEval?.rating ?? state.potential,
    });
  }

  const cell =
    state.performance && state.potential
      ? nineBoxCell(state.performance, state.potential)
      : null;

  return (
    <WizardFrame
      header={header}
      title="Paso 2 · Punto de partida"
      question="¿De dónde parte esta persona hoy?"
      hint="El plan no puede ser igual para todos. Desempeño, potencial y aspiración determinan qué tipo de experiencias tienen sentido."
      nextDisabled={!state.performance || !state.potential}
    >
      <div className="space-y-6">
        {hasExisting && (
          <Alert tone="info" title="Tu empresa ya tiene un diagnóstico cargado">
            <div className="mt-2 flex flex-wrap items-center gap-4">
              {performanceEval && (
                <span>
                  Desempeño {performanceEval.period}:{" "}
                  <strong>{RATING_LABELS[performanceEval.rating]}</strong>
                </span>
              )}
              {potentialEval && (
                <span>
                  Potencial {potentialEval.period}:{" "}
                  <strong>{RATING_LABELS[potentialEval.rating]}</strong>
                </span>
              )}
              <button type="button" onClick={useExisting} className="btn-secondary py-1.5 text-xs">
                Usar estos resultados
              </button>
            </div>
          </Alert>
        )}

        <section className="card px-6 py-6">
          <h2 className="section-title">Desempeño</h2>
          <p className="muted mb-4 mt-1">¿Cómo son sus resultados en el rol actual?</p>
          <RatingPicker
            value={state.performance}
            onChange={(value) => persist({ ...state, performance: value, source: "MANUAL" })}
            descriptions={{
              LOW: "Aún no alcanza lo esperado en su rol.",
              MEDIUM: "Cumple con lo esperado de forma consistente.",
              HIGH: "Supera lo esperado y es referente para otros.",
            }}
          />
        </section>

        <section className="card px-6 py-6">
          <h2 className="section-title">Potencial</h2>
          <p className="muted mb-4 mt-1">
            ¿Qué capacidad tiene de asumir responsabilidades mayores o distintas?
          </p>
          <RatingPicker
            value={state.potential}
            onChange={(value) => persist({ ...state, potential: value, source: "MANUAL" })}
            descriptions={{
              LOW: "Su recorrido natural está en el rol actual.",
              MEDIUM: "Puede crecer con acompañamiento y tiempo.",
              HIGH: "Podría asumir un salto relevante en el corto plazo.",
            }}
          />
        </section>

        <section className="card px-6 py-6">
          <h2 className="section-title">Aspiración de carrera</h2>
          <p className="muted mb-4 mt-1">
            Una persona con alto potencial no necesariamente quiere dirigir. Lo que ella
            quiere también define la ruta.
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {ASPIRATIONS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => persist({ ...state, aspiration: option })}
                className={`rounded-xl border px-4 py-3 text-left text-sm transition-all ${
                  state.aspiration === option
                    ? "border-brand-500 bg-brand-50 font-semibold text-brand-800"
                    : "border-sand-300 bg-white text-ink-700 hover:border-brand-300"
                }`}
              >
                {ASPIRATION_LABELS[option]}
              </button>
            ))}
          </div>
          <div className="mt-4">
            <Field label="¿Algo que haya dicho ella misma sobre su futuro?">
              <input
                className="input"
                value={state.aspirationNote}
                onChange={(e) => setState({ ...state, aspirationNote: e.target.value })}
                onBlur={() => persist(state)}
                placeholder="Manifiesta interés en asumir una gerencia regional."
              />
            </Field>
          </div>
        </section>

        {cell && (
          <section className="card px-6 py-6">
            <h2 className="section-title mb-1">Lectura del diagnóstico</h2>
            <p className="muted mb-5">
              Matriz de talento — esta lectura orienta las recomendaciones, no las impone.
            </p>
            <NineBox performance={state.performance!} potential={state.potential!} />
            <div className="mt-5 rounded-xl bg-brand-50 px-4 py-4">
              <p className="font-semibold text-brand-800">{NINE_BOX_LABELS[cell]}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-brand-900/80">
                {NINE_BOX_READINGS[cell]}
              </p>
            </div>
          </section>
        )}

        <section className="card px-6 py-6">
          <Field label="Observaciones del diagnóstico" hint="Opcional. Solo visible para roles con acceso al diagnóstico.">
            <textarea
              className="input min-h-24"
              value={state.notes}
              onChange={(e) => setState({ ...state, notes: e.target.value })}
              onBlur={() => persist(state)}
              placeholder="Contexto relevante para entender el punto de partida."
            />
          </Field>
        </section>
      </div>
    </WizardFrame>
  );
}

function RatingPicker({
  value, onChange, descriptions,
}: {
  value: RatingLevel | null;
  onChange: (value: RatingLevel) => void;
  descriptions: Record<RatingLevel, string>;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {RATINGS.map((rating) => {
        const selected = value === rating;
        return (
          <button
            key={rating}
            type="button"
            onClick={() => onChange(rating)}
            aria-pressed={selected}
            className={`rounded-2xl border px-5 py-5 text-left transition-all ${
              selected
                ? "border-brand-500 bg-brand-50 shadow-[0_0_0_3px_var(--color-brand-100)]"
                : "border-sand-300 bg-white hover:border-brand-300"
            }`}
          >
            <span
              className={`block text-base font-bold ${
                selected ? "text-brand-800" : "text-ink-900"
              }`}
            >
              {RATING_LABELS[rating]}
            </span>
            <span className="mt-1.5 block text-xs leading-relaxed text-ink-500">
              {descriptions[rating]}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/** Matriz 9 Box: desempeño en filas (alto arriba), potencial en columnas. */
function NineBox({
  performance, potential,
}: {
  performance: RatingLevel; potential: RatingLevel;
}) {
  const rows: RatingLevel[] = ["HIGH", "MEDIUM", "LOW"];
  const cols: RatingLevel[] = ["LOW", "MEDIUM", "HIGH"];
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[420px] border-separate border-spacing-1 text-xs">
        <thead>
          <tr>
            <th className="w-28" />
            {cols.map((c) => (
              <th key={c} className="pb-1 font-medium text-ink-400">
                Potencial {RATING_LABELS[c].toLowerCase()}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row}>
              <th className="pr-2 text-right font-medium text-ink-400">
                Desempeño {RATING_LABELS[row].toLowerCase()}
              </th>
              {cols.map((col) => {
                const active = row === performance && col === potential;
                const cell = nineBoxCell(row, col);
                return (
                  <td key={col}>
                    <div
                      className={`flex h-16 items-center justify-center rounded-lg px-2 text-center leading-tight ${
                        active
                          ? "bg-brand-600 font-semibold text-white"
                          : "bg-sand-100 text-ink-400"
                      }`}
                    >
                      {NINE_BOX_LABELS[cell]}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
