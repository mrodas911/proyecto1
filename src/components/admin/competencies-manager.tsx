"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { CompetencyCategory } from "@prisma/client";
import { api, ApiError } from "@/lib/client-api";
import { CATEGORY_LABELS } from "@/lib/constants";
import { Alert, Field } from "@/components/ui";
import { Icon } from "@/components/icons";

type Level = { level: number; name: string; description: string };

type Competency = {
  id: string;
  name: string;
  definition: string;
  expectedBehavior: string;
  category: CompetencyCategory;
  active: boolean;
  global: boolean;
  levels: Level[];
  counts: { activities: number; planCompetencies: number };
};

const CATEGORIES: CompetencyCategory[] = [
  "LEADERSHIP", "BUSINESS", "INTERPERSONAL", "STRATEGIC", "EXECUTION",
];

const EMPTY = {
  name: "",
  definition: "",
  expectedBehavior: "",
  category: "LEADERSHIP" as CompetencyCategory,
};

export function CompetenciesManager({ competencies }: { competencies: Competency[] }) {
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function create(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    try {
      await api.post("/api/admin/competencies", form);
      setForm(EMPTY);
      setCreating(false);
      setMessage("Competencia creada. Ya puede usarse en los planes.");
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No pudimos crear la competencia.");
    }
  }

  async function toggle(competency: Competency) {
    await api.patch(`/api/admin/competencies/${competency.id}`, { active: !competency.active });
    router.refresh();
  }

  return (
    <div className="space-y-6">
      {error && <Alert tone="danger">{error}</Alert>}
      {message && <Alert tone="success">{message}</Alert>}

      <div className="flex items-center justify-between">
        <h2 className="section-title">
          {competencies.length} competencia{competencies.length === 1 ? "" : "s"}
        </h2>
        <button type="button" onClick={() => setCreating((v) => !v)} className="btn-primary">
          <Icon.plus className="h-4 w-4" />
          Nueva competencia
        </button>
      </div>

      {creating && (
        <form onSubmit={create} className="card grid gap-4 px-6 py-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nombre" required>
              <input className="input" required value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </Field>
            <Field label="Categoría">
              <select className="input" value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value as CompetencyCategory })
                }>
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {CATEGORY_LABELS[category]}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <Field label="Definición" required hint="Empieza por «Capacidad de…» para que los objetivos se redacten con naturalidad.">
            <textarea className="input min-h-20" required value={form.definition}
              onChange={(e) => setForm({ ...form, definition: e.target.value })} />
          </Field>
          <Field label="Comportamiento esperado" required>
            <textarea className="input min-h-20" required value={form.expectedBehavior}
              onChange={(e) => setForm({ ...form, expectedBehavior: e.target.value })} />
          </Field>
          <p className="hint">
            Se crearán los cinco niveles con descripciones provisionales que podrás editar.
          </p>
          <div>
            <button type="submit" className="btn-primary">Crear competencia</button>
          </div>
        </form>
      )}

      <ul className="space-y-3">
        {competencies.map((competency) => (
          <li key={competency.id} className="card px-6 py-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-semibold text-ink-900">
                  {competency.name}
                  {!competency.active && (
                    <span className="ml-2 chip bg-sand-200 text-ink-500">Inactiva</span>
                  )}
                  {!competency.global && (
                    <span className="ml-2 chip-brand">Propia de una empresa</span>
                  )}
                </p>
                <p className="mt-1 text-xs text-ink-400">
                  {CATEGORY_LABELS[competency.category]} · {competency.counts.activities}{" "}
                  actividades relacionadas · usada en {competency.counts.planCompetencies} planes
                </p>
                <p className="mt-2 max-w-3xl text-sm text-ink-500">{competency.definition}.</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => setEditing(editing === competency.id ? null : competency.id)}
                  className="btn-secondary"
                >
                  {editing === competency.id ? "Cerrar" : "Editar"}
                </button>
                <button type="button" onClick={() => toggle(competency)} className="btn-ghost">
                  {competency.active ? "Desactivar" : "Activar"}
                </button>
              </div>
            </div>

            {editing === competency.id && (
              <CompetencyEditor competency={competency} onSaved={() => router.refresh()} />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function CompetencyEditor({
  competency, onSaved,
}: {
  competency: Competency; onSaved: () => void;
}) {
  const [state, setState] = useState({
    name: competency.name,
    definition: competency.definition,
    expectedBehavior: competency.expectedBehavior,
    category: competency.category,
  });
  const [levels, setLevels] = useState<Level[]>(competency.levels);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setError(null);
    try {
      await api.patch(`/api/admin/competencies/${competency.id}`, { ...state, levels });
      setMessage("Guardado.");
      onSaved();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No pudimos guardar.");
    }
  }

  return (
    <div className="mt-5 space-y-4 border-t border-sand-200 pt-5">
      {message && <Alert tone="success">{message}</Alert>}
      {error && <Alert tone="danger">{error}</Alert>}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nombre">
          <input className="input" value={state.name}
            onChange={(e) => setState({ ...state, name: e.target.value })} />
        </Field>
        <Field label="Categoría">
          <select className="input" value={state.category}
            onChange={(e) =>
              setState({ ...state, category: e.target.value as CompetencyCategory })
            }>
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>{CATEGORY_LABELS[category]}</option>
            ))}
          </select>
        </Field>
      </div>
      <Field label="Definición">
        <textarea className="input min-h-20" value={state.definition}
          onChange={(e) => setState({ ...state, definition: e.target.value })} />
      </Field>
      <Field label="Comportamiento esperado">
        <textarea className="input min-h-20" value={state.expectedBehavior}
          onChange={(e) => setState({ ...state, expectedBehavior: e.target.value })} />
      </Field>

      <div>
        <h4 className="mb-3 text-sm font-semibold text-ink-900">Niveles de dominio</h4>
        <div className="space-y-3">
          {levels.map((level, index) => (
            <div key={level.level} className="grid gap-2 sm:grid-cols-[80px_180px_1fr]">
              <span className="pt-2.5 text-sm font-semibold text-ink-400">
                Nivel {level.level}
              </span>
              <input
                className="input" value={level.name}
                onChange={(e) => {
                  const next = [...levels];
                  next[index] = { ...level, name: e.target.value };
                  setLevels(next);
                }}
              />
              <input
                className="input" value={level.description}
                onChange={(e) => {
                  const next = [...levels];
                  next[index] = { ...level, description: e.target.value };
                  setLevels(next);
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <button type="button" onClick={save} className="btn-primary">
        Guardar cambios
      </button>
    </div>
  );
}
