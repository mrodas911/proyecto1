"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type {
  Difficulty, DevelopmentType, Methodology, RatingLevel, ResponsibleType,
} from "@prisma/client";
import { api, ApiError } from "@/lib/client-api";
import {
  DEVELOPMENT_TYPE_LABELS, DIFFICULTY_LABELS, METHODOLOGY_LABELS,
  METHODOLOGY_SHORT, RATING_LABELS, RESPONSIBLE_LABELS, STAGE_ORDER,
} from "@/lib/constants";
import { Alert, Field } from "@/components/ui";
import { Icon } from "@/components/icons";

type ActivityForm = {
  title: string;
  description: string;
  benefit: string;
  methodology: Methodology;
  toolId: string | null;
  difficulty: Difficulty;
  developmentType: DevelopmentType;
  duration: string;
  suggestedIndicator: string;
  suggestedEvidence: string;
  suggestedResponsible: ResponsibleType;
  minPerformance: RatingLevel | null;
  minPotential: RatingLevel | null;
  competencyIds: string[];
};

type Activity = ActivityForm & {
  id: string;
  toolName: string | null;
  active: boolean;
  usedInPlans: number;
};

const EMPTY: ActivityForm = {
  title: "", description: "", benefit: "",
  methodology: "M70", toolId: null, difficulty: "INTERMEDIATE",
  developmentType: "BOTH", duration: "", suggestedIndicator: "",
  suggestedEvidence: "", suggestedResponsible: "EMPLOYEE",
  minPerformance: null, minPotential: null, competencyIds: [],
};

export function ActivitiesManager({
  activities, competencies, tools, query, stage,
}: {
  activities: Activity[];
  competencies: { id: string; name: string }[];
  tools: { id: string; name: string; methodology: Methodology }[];
  query: string;
  stage: string;
}) {
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function toggle(activity: Activity) {
    await api.patch(`/api/admin/activities/${activity.id}`, { active: !activity.active });
    router.refresh();
  }

  return (
    <div className="space-y-6">
      {error && <Alert tone="danger">{error}</Alert>}
      {message && <Alert tone="success">{message}</Alert>}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="section-title">
          {activities.length} actividad{activities.length === 1 ? "" : "es"}
        </h2>
        <button type="button" onClick={() => setCreating((v) => !v)} className="btn-primary">
          <Icon.plus className="h-4 w-4" />
          Nueva actividad
        </button>
      </div>

      <form className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <Icon.search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input name="q" defaultValue={query} className="input w-64 pl-9" placeholder="Buscar actividad" />
        </div>
        <div className="flex gap-1.5">
          <Link
            href="/admin/actividades"
            className={`rounded-full px-3 py-1.5 text-sm ${!stage ? "bg-brand-600 text-white" : "bg-white text-ink-500"}`}
          >
            Todas
          </Link>
          {STAGE_ORDER.map((methodology) => (
            <Link
              key={methodology}
              href={`/admin/actividades?etapa=${methodology}`}
              className={`rounded-full px-3 py-1.5 text-sm ${
                stage === methodology ? "bg-brand-600 text-white" : "bg-white text-ink-500"
              }`}
            >
              {METHODOLOGY_SHORT[methodology]}
            </Link>
          ))}
        </div>
        <button type="submit" className="btn-secondary">Buscar</button>
      </form>

      {creating && (
        <ActivityForm
          initial={EMPTY}
          competencies={competencies}
          tools={tools}
          submitLabel="Crear actividad"
          onCancel={() => setCreating(false)}
          onSubmit={async (values) => {
            try {
              await api.post("/api/admin/activities", values);
              setCreating(false);
              setMessage("Actividad creada. Ya puede aparecer en las recomendaciones.");
              router.refresh();
            } catch (err) {
              setError(err instanceof ApiError ? err.message : "No pudimos crear la actividad.");
            }
          }}
        />
      )}

      <ul className="space-y-3">
        {activities.map((activity) => (
          <li key={activity.id} className="card px-6 py-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-semibold text-ink-900">
                  {activity.title}
                  {!activity.active && (
                    <span className="ml-2 chip bg-sand-200 text-ink-500">Inactiva</span>
                  )}
                </p>
                <p className="mt-1 text-xs text-ink-400">
                  {METHODOLOGY_LABELS[activity.methodology]} ·{" "}
                  {activity.toolName ?? "Sin herramienta"} ·{" "}
                  {DIFFICULTY_LABELS[activity.difficulty]} ·{" "}
                  {DEVELOPMENT_TYPE_LABELS[activity.developmentType]} · {activity.duration} ·{" "}
                  {activity.competencyIds.length} competencias · usada en{" "}
                  {activity.usedInPlans} planes
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => setEditing(editing === activity.id ? null : activity.id)}
                  className="btn-secondary"
                >
                  {editing === activity.id ? "Cerrar" : "Editar"}
                </button>
                <button type="button" onClick={() => toggle(activity)} className="btn-ghost">
                  {activity.active ? "Desactivar" : "Activar"}
                </button>
              </div>
            </div>

            {editing === activity.id && (
              <div className="mt-5 border-t border-sand-200 pt-5">
                <ActivityForm
                  initial={activity}
                  competencies={competencies}
                  tools={tools}
                  submitLabel="Guardar cambios"
                  onCancel={() => setEditing(null)}
                  onSubmit={async (values) => {
                    try {
                      await api.patch(`/api/admin/activities/${activity.id}`, values);
                      setEditing(null);
                      setMessage("Actividad actualizada.");
                      router.refresh();
                    } catch (err) {
                      setError(
                        err instanceof ApiError ? err.message : "No pudimos guardar los cambios."
                      );
                    }
                  }}
                />
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ActivityForm({
  initial, competencies, tools, submitLabel, onSubmit, onCancel,
}: {
  initial: ActivityForm;
  competencies: { id: string; name: string }[];
  tools: { id: string; name: string; methodology: Methodology }[];
  submitLabel: string;
  onSubmit: (values: ActivityForm) => Promise<void>;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<ActivityForm>({ ...initial });
  const [saving, setSaving] = useState(false);
  const availableTools = tools.filter((tool) => tool.methodology === form.methodology);

  function toggleCompetency(id: string) {
    setForm((prev) => ({
      ...prev,
      competencyIds: prev.competencyIds.includes(id)
        ? prev.competencyIds.filter((c) => c !== id)
        : [...prev.competencyIds, id],
    }));
  }

  return (
    <form
      className="card space-y-4 px-6 py-6"
      onSubmit={async (event) => {
        event.preventDefault();
        setSaving(true);
        await onSubmit(form);
        setSaving(false);
      }}
    >
      <Field label="Actividad" required>
        <input className="input" required value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Liderar el comité mensual de operaciones" />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Descripción" required>
          <textarea className="input min-h-20" required value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="En qué consiste la actividad." />
        </Field>
        <Field label="Beneficio" required hint="Para qué le sirve a la persona.">
          <textarea className="input min-h-20" required value={form.benefit}
            onChange={(e) => setForm({ ...form, benefit: e.target.value })} />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Etapa" required>
          <select className="input" value={form.methodology}
            onChange={(e) =>
              setForm({ ...form, methodology: e.target.value as Methodology, toolId: null })
            }>
            {STAGE_ORDER.map((methodology) => (
              <option key={methodology} value={methodology}>
                {METHODOLOGY_LABELS[methodology]}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Herramienta">
          <select className="input" value={form.toolId ?? ""}
            onChange={(e) => setForm({ ...form, toolId: e.target.value || null })}>
            <option value="">Sin herramienta (no consume cuota)</option>
            {availableTools.map((tool) => (
              <option key={tool.id} value={tool.id}>{tool.name}</option>
            ))}
          </select>
        </Field>
        <Field label="Duración estimada" required>
          <input className="input" required value={form.duration}
            onChange={(e) => setForm({ ...form, duration: e.target.value })}
            placeholder="90 días · 6 semanas" />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Nivel">
          <select className="input" value={form.difficulty}
            onChange={(e) => setForm({ ...form, difficulty: e.target.value as Difficulty })}>
            {(["BASIC", "INTERMEDIATE", "ADVANCED"] as Difficulty[]).map((level) => (
              <option key={level} value={level}>{DIFFICULTY_LABELS[level]}</option>
            ))}
          </select>
        </Field>
        <Field label="Tipo de desarrollo">
          <select className="input" value={form.developmentType}
            onChange={(e) =>
              setForm({ ...form, developmentType: e.target.value as DevelopmentType })
            }>
            {(["BOTH", "CURRENT", "FUTURE"] as DevelopmentType[]).map((type) => (
              <option key={type} value={type}>{DEVELOPMENT_TYPE_LABELS[type]}</option>
            ))}
          </select>
        </Field>
        <Field label="Responsable sugerido">
          <select className="input" value={form.suggestedResponsible}
            onChange={(e) =>
              setForm({ ...form, suggestedResponsible: e.target.value as ResponsibleType })
            }>
            {(["EMPLOYEE", "LEADER", "MENTOR", "HR", "OTHER"] as ResponsibleType[]).map((r) => (
              <option key={r} value={r}>{RESPONSIBLE_LABELS[r]}</option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Indicador de éxito sugerido">
          <input className="input" value={form.suggestedIndicator}
            onChange={(e) => setForm({ ...form, suggestedIndicator: e.target.value })} />
        </Field>
        <Field label="Evidencia esperada sugerida">
          <input className="input" value={form.suggestedEvidence}
            onChange={(e) => setForm({ ...form, suggestedEvidence: e.target.value })} />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Desempeño mínimo recomendado" hint="Solo afecta al orden de las recomendaciones; nunca bloquea.">
          <select className="input" value={form.minPerformance ?? ""}
            onChange={(e) =>
              setForm({ ...form, minPerformance: (e.target.value || null) as RatingLevel | null })
            }>
            <option value="">Sin requisito</option>
            {(["LOW", "MEDIUM", "HIGH"] as RatingLevel[]).map((r) => (
              <option key={r} value={r}>{RATING_LABELS[r]}</option>
            ))}
          </select>
        </Field>
        <Field label="Potencial mínimo recomendado">
          <select className="input" value={form.minPotential ?? ""}
            onChange={(e) =>
              setForm({ ...form, minPotential: (e.target.value || null) as RatingLevel | null })
            }>
            <option value="">Sin requisito</option>
            {(["LOW", "MEDIUM", "HIGH"] as RatingLevel[]).map((r) => (
              <option key={r} value={r}>{RATING_LABELS[r]}</option>
            ))}
          </select>
        </Field>
      </div>

      <div>
        <p className="label">
          Competencias que desarrolla <span className="text-[color:var(--color-danger)]">*</span>
        </p>
        <p className="hint mb-2">
          Una misma actividad puede desarrollar varias. La primera que marques pesa más al
          recomendar.
        </p>
        <div className="flex flex-wrap gap-2">
          {competencies.map((competency) => {
            const selected = form.competencyIds.includes(competency.id);
            return (
              <button
                key={competency.id}
                type="button"
                onClick={() => toggleCompetency(competency.id)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  selected ? "bg-brand-600 text-white" : "bg-sand-100 text-ink-600 hover:bg-sand-200"
                }`}
              >
                {competency.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="btn-primary"
          disabled={saving || form.competencyIds.length === 0}
        >
          {saving ? "Guardando…" : submitLabel}
        </button>
        <button type="button" className="btn-ghost" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
