"use client";

import Link from "next/link";
import { useState } from "react";
import type { Methodology, ResponsibleType } from "@prisma/client";
import { api } from "@/lib/client-api";
import { METHODOLOGY_SHORT, RESPONSIBLE_LABELS, STAGES, STAGE_ORDER, WIZARD_STEPS } from "@/lib/constants";
import { toDateInput } from "@/lib/format";
import { Alert, Field, ProgressBar } from "@/components/ui";
import { Icon } from "@/components/icons";
import { WizardFrame, type WizardHeader } from "./frame";
import { useSaveState } from "./save-state";

export type ReviewAction = {
  id: string;
  methodology: Methodology;
  title: string;
  objective: string;
  responsibleType: ResponsibleType;
  responsibleName: string;
  startDate: string;
  targetDate: string;
  frequency: string;
  successIndicator: string;
  expectedEvidence: string;
  notes: string;
  toolName: string | null;
};

export type ReviewCompetency = {
  planCompetencyId: string;
  name: string;
  objective: string | null;
  currentLevel: number;
  requiredLevel: number;
  actions: ReviewAction[];
};

export type ValidationView = {
  completion: number;
  checks: { id: string; label: string; ok: boolean; detail?: string; step: number }[];
};

const RESPONSIBLES: ResponsibleType[] = ["EMPLOYEE", "LEADER", "MENTOR", "HR", "OTHER"];

export function StepRevisar({
  header, competencies: initial, validation, suggestions,
}: {
  header: WizardHeader;
  competencies: ReviewCompetency[];
  validation: ValidationView;
  suggestions: { employeeName: string; leaderName: string };
}) {
  const [competencies, setCompetencies] = useState(initial);
  const [report, setReport] = useState(validation);
  const { run } = useSaveState();

  function patchLocal(actionId: string, patch: Partial<ReviewAction>) {
    setCompetencies((prev) =>
      prev.map((c) => ({
        ...c,
        actions: c.actions.map((a) => (a.id === actionId ? { ...a, ...patch } : a)),
      }))
    );
  }

  async function save(actionId: string, patch: Partial<ReviewAction>) {
    const result = await run(() =>
      api.patch<{ completion: number }>(
        `/api/plans/${header.planId}/activities/${actionId}`,
        Object.fromEntries(
          Object.entries(patch).map(([key, value]) => [key, value === "" ? null : value])
        )
      )
    );
    if (result) setReport((prev) => ({ ...prev, completion: result.completion }));
  }

  async function remove(actionId: string) {
    const result = await run(() =>
      api.del<{ completion: number }>(`/api/plans/${header.planId}/activities/${actionId}`)
    );
    if (!result) return;
    setCompetencies((prev) =>
      prev.map((c) => ({ ...c, actions: c.actions.filter((a) => a.id !== actionId) }))
    );
    setReport((prev) => ({ ...prev, completion: result.completion }));
  }

  const missing = report.checks.filter((c) => !c.ok);
  const totalActions = competencies.reduce((sum, c) => sum + c.actions.length, 0);

  return (
    <WizardFrame
      header={header}
      title="Paso 8 · Mi ruta de desarrollo"
      question="Así queda la ruta. ¿La ajustamos?"
      hint="Aquí se define lo que hace real un plan: fechas, responsables e indicadores. Todo es editable."
      nextLabel="Ir a generar el plan"
    >
      <div className="space-y-8">
        <section className="card px-6 py-6">
          <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="section-title">Tu plan está {report.completion}% completo</h2>
            <p className="muted">
              {competencies.length} competencia{competencies.length === 1 ? "" : "s"} ·{" "}
              {totalActions} acción{totalActions === 1 ? "" : "es"}
            </p>
          </div>
          <ProgressBar value={report.completion} tone={report.completion >= 80 ? "brand" : "warning"} />
          {missing.length > 0 ? (
            <ul className="mt-5 space-y-2">
              {missing.map((check) => {
                const step = WIZARD_STEPS.find((s) => s.step === check.step);
                return (
                  <li key={check.id} className="flex items-start gap-2.5 text-sm">
                    <Icon.warning className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--color-warning)]" />
                    <span className="text-ink-700">
                      {check.label}
                      {check.detail && <span className="text-ink-400"> — {check.detail}</span>}
                      {step && check.step !== 8 && (
                        <Link
                          href={`/planes/${header.planId}/wizard/${step.slug}`}
                          className="ml-2 font-medium text-brand-700 hover:underline"
                        >
                          Ir a {step.label}
                        </Link>
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <Alert tone="success" title="El plan está completo">
              Puedes generarlo cuando quieras.
            </Alert>
          )}
        </section>

        {competencies.map((competency) => (
          <section key={competency.planCompetencyId} className="space-y-4">
            <header>
              <h2 className="text-lg font-bold uppercase tracking-wide text-ink-900">
                {competency.name}
              </h2>
              <p className="muted mt-1">
                Nivel {competency.currentLevel} → {competency.requiredLevel}
                {competency.objective ? ` · ${competency.objective}` : ""}
              </p>
            </header>

            {STAGE_ORDER.map((methodology) => {
              const actions = competency.actions.filter((a) => a.methodology === methodology);
              const stage = STAGES[methodology];
              return (
                <div key={methodology}>
                  <p
                    className="mb-2 text-xs font-bold uppercase tracking-widest"
                    style={{ color: stage.color }}
                  >
                    {METHODOLOGY_SHORT[methodology]} · {stage.title}
                  </p>
                  {actions.length === 0 ? (
                    <p className="rounded-xl border border-dashed border-sand-300 px-4 py-3 text-sm text-ink-400">
                      Sin acciones todavía.{" "}
                      <Link
                        href={`/planes/${header.planId}/wizard/${
                          WIZARD_STEPS[STAGE_ORDER.indexOf(methodology) + 4]?.slug
                        }`}
                        className="font-medium text-brand-700 hover:underline"
                      >
                        Añadir
                      </Link>
                    </p>
                  ) : (
                    <ul className="space-y-3">
                      {actions.map((action) => (
                        <ActionEditor
                          key={action.id}
                          action={action}
                          suggestions={suggestions}
                          onChange={(patch) => patchLocal(action.id, patch)}
                          onSave={(patch) => save(action.id, patch)}
                          onRemove={() => remove(action.id)}
                        />
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </section>
        ))}
      </div>
    </WizardFrame>
  );
}

function ActionEditor({
  action, suggestions, onChange, onSave, onRemove,
}: {
  action: ReviewAction;
  suggestions: { employeeName: string; leaderName: string };
  onChange: (patch: Partial<ReviewAction>) => void;
  onSave: (patch: Partial<ReviewAction>) => void;
  onRemove: () => void;
}) {
  const [open, setOpen] = useState(
    !action.startDate || !action.targetDate || !action.successIndicator || !action.responsibleName
  );
  const incomplete =
    !action.startDate || !action.targetDate || !action.successIndicator || !action.responsibleName;

  function defaultResponsibleName(type: ResponsibleType): string {
    if (type === "EMPLOYEE") return suggestions.employeeName;
    if (type === "LEADER") return suggestions.leaderName;
    return action.responsibleName;
  }

  return (
    <li className="card px-5 py-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <input
            className="w-full border-0 bg-transparent p-0 text-sm font-semibold text-ink-900 focus:outline-none"
            value={action.title}
            onChange={(e) => onChange({ title: e.target.value })}
            onBlur={() => onSave({ title: action.title })}
          />
          <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-ink-400">
            {action.toolName && <span>{action.toolName}</span>}
            {action.responsibleName && <span>· {action.responsibleName}</span>}
            {action.startDate && action.targetDate && (
              <span>
                · {action.startDate} → {action.targetDate}
              </span>
            )}
            {incomplete && (
              <span className="text-[color:var(--color-warning)]">· falta información</span>
            )}
          </p>
        </div>
        <div className="flex shrink-0 gap-1">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="btn-ghost px-2"
            aria-expanded={open}
          >
            <Icon.edit className="h-4 w-4" />
            <span className="sr-only">Editar detalles</span>
          </button>
          <button type="button" onClick={onRemove} className="btn-ghost px-2">
            <Icon.trash className="h-4 w-4" />
            <span className="sr-only">Eliminar acción</span>
          </button>
        </div>
      </div>

      {open && (
        <div className="mt-5 grid gap-4 border-t border-sand-200 pt-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Field label="Objetivo" hint="¿Para qué lo va a hacer?">
              <textarea
                className="input min-h-16"
                value={action.objective}
                onChange={(e) => onChange({ objective: e.target.value })}
                onBlur={() => onSave({ objective: action.objective })}
              />
            </Field>
          </div>

          <Field label="Responsable">
            <select
              className="input"
              value={action.responsibleType}
              onChange={(e) => {
                const type = e.target.value as ResponsibleType;
                const name = action.responsibleName || defaultResponsibleName(type);
                onChange({ responsibleType: type, responsibleName: name });
                onSave({ responsibleType: type, responsibleName: name });
              }}
            >
              {RESPONSIBLES.map((option) => (
                <option key={option} value={option}>
                  {RESPONSIBLE_LABELS[option]}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Nombre del responsable">
            <input
              className="input"
              value={action.responsibleName}
              onChange={(e) => onChange({ responsibleName: e.target.value })}
              onBlur={() => onSave({ responsibleName: action.responsibleName })}
              placeholder={defaultResponsibleName(action.responsibleType)}
            />
          </Field>

          <Field label="Fecha de inicio">
            <input
              type="date"
              className="input"
              value={toDateInput(action.startDate)}
              onChange={(e) => {
                onChange({ startDate: e.target.value });
                onSave({ startDate: e.target.value });
              }}
            />
          </Field>

          <Field label="Fecha objetivo">
            <input
              type="date"
              className="input"
              value={toDateInput(action.targetDate)}
              onChange={(e) => {
                onChange({ targetDate: e.target.value });
                onSave({ targetDate: e.target.value });
              }}
            />
          </Field>

          <Field label="Frecuencia">
            <input
              className="input"
              value={action.frequency}
              onChange={(e) => onChange({ frequency: e.target.value })}
              onBlur={() => onSave({ frequency: action.frequency })}
              placeholder="Mensual · Quincenal · Una vez"
            />
          </Field>

          <Field label="Evidencia esperada">
            <input
              className="input"
              value={action.expectedEvidence}
              onChange={(e) => onChange({ expectedEvidence: e.target.value })}
              onBlur={() => onSave({ expectedEvidence: action.expectedEvidence })}
              placeholder="Informe, acta, presentación…"
            />
          </Field>

          <div className="sm:col-span-2">
            <Field label="Indicador de éxito" hint="¿Cómo sabremos que avanzó?">
              <input
                className="input"
                value={action.successIndicator}
                onChange={(e) => onChange({ successIndicator: e.target.value })}
                onBlur={() => onSave({ successIndicator: action.successIndicator })}
                placeholder="Iniciativa implementada con las tres áreas y resultados presentados"
              />
            </Field>
          </div>

          <div className="sm:col-span-2">
            <Field label="Observaciones">
              <textarea
                className="input min-h-16"
                value={action.notes}
                onChange={(e) => onChange({ notes: e.target.value })}
                onBlur={() => onSave({ notes: action.notes })}
              />
            </Field>
          </div>
        </div>
      )}
    </li>
  );
}
