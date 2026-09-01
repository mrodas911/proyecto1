"use client";

import { useMemo, useState } from "react";
import type { CompetencyCategory } from "@prisma/client";
import { api, ApiError } from "@/lib/client-api";
import { CATEGORY_LABELS } from "@/lib/constants";
import { Alert } from "@/components/ui";
import { Icon } from "@/components/icons";
import { WizardFrame, type WizardHeader } from "./frame";
import { useSaveState } from "./save-state";

export type CatalogCompetency = {
  id: string;
  name: string;
  definition: string;
  expectedBehavior: string;
  category: CompetencyCategory;
  levels: { level: number; name: string; description: string }[];
};

export type SelectedCompetency = {
  id: string;
  competencyId: string;
  currentLevel: number;
  requiredLevel: number;
  objective: string;
};

const CATEGORIES: CompetencyCategory[] = [
  "LEADERSHIP",
  "BUSINESS",
  "INTERPERSONAL",
  "STRATEGIC",
  "EXECUTION",
];

export function StepCompetencias({
  header, catalog, initialSelected, maxCompetencies,
}: {
  header: WizardHeader;
  catalog: CatalogCompetency[];
  initialSelected: SelectedCompetency[];
  maxCompetencies: number;
}) {
  const [selected, setSelected] = useState(initialSelected);
  const [category, setCategory] = useState<CompetencyCategory | "ALL">("ALL");
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const { run, runOrThrow } = useSaveState();

  const byId = useMemo(() => new Map(catalog.map((c) => [c.id, c])), [catalog]);
  const selectedIds = new Set(selected.map((s) => s.competencyId));
  const full = selected.length >= maxCompetencies;

  const visible = catalog.filter((competency) => {
    if (category !== "ALL" && competency.category !== category) return false;
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      competency.name.toLowerCase().includes(q) ||
      competency.definition.toLowerCase().includes(q)
    );
  });

  async function add(competencyId: string) {
    if (full) {
      setNotice(
        `Para lograr mayor impacto recomendamos trabajar máximo ${maxCompetencies} competencias simultáneamente.`
      );
      return;
    }
    setNotice(null);
    try {
      const result = await runOrThrow(() =>
        api.post<{ planCompetency: { id: string; objective: string | null } }>(
          `/api/plans/${header.planId}/competencies`,
          { competencyId }
        )
      );
      setSelected((prev) => [
        ...prev,
        {
          id: result.planCompetency.id,
          competencyId,
          currentLevel: 2,
          requiredLevel: 4,
          objective: result.planCompetency.objective ?? "",
        },
      ]);
    } catch (error) {
      setNotice(
        error instanceof ApiError ? error.message : "No pudimos añadir la competencia."
      );
    }
  }

  async function remove(planCompetencyId: string) {
    const done = await run(() =>
      api.del(`/api/plans/${header.planId}/competencies/${planCompetencyId}`)
    );
    if (done) setSelected((prev) => prev.filter((s) => s.id !== planCompetencyId));
  }

  function updateLocal(planCompetencyId: string, patch: Partial<SelectedCompetency>) {
    setSelected((prev) =>
      prev.map((s) => (s.id === planCompetencyId ? { ...s, ...patch } : s))
    );
  }

  async function saveLevels(item: SelectedCompetency, patch: Partial<SelectedCompetency>) {
    const next = { ...item, ...patch };
    updateLocal(item.id, patch);
    const result = await run(() =>
      api.patch<{ objective?: string | null }>(
        `/api/plans/${header.planId}/competencies/${item.id}`,
        {
          currentLevel: next.currentLevel,
          requiredLevel: next.requiredLevel,
          regenerateObjective: true,
        }
      )
    );
    if (result?.objective) updateLocal(item.id, { objective: result.objective });
  }

  function saveObjective(item: SelectedCompetency) {
    run(() =>
      api.patch(`/api/plans/${header.planId}/competencies/${item.id}`, {
        objective: item.objective,
      })
    );
  }

  return (
    <WizardFrame
      header={header}
      title="Paso 4 · Las brechas"
      question="¿Qué competencias necesita desarrollar?"
      hint={`Elige entre 1 y ${maxCompetencies}. Menos competencias y más profundidad siempre funciona mejor que una lista larga.`}
      nextDisabled={selected.length === 0}
    >
      <div className="space-y-8">
        {selected.length > 0 && (
          <section>
            <h2 className="section-title mb-4">
              Competencias del plan ({selected.length} de {maxCompetencies})
            </h2>
            <div className="space-y-4">
              {selected.map((item) => {
                const competency = byId.get(item.competencyId);
                if (!competency) return null;
                return (
                  <article key={item.id} className="card px-6 py-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="chip-brand mb-2">
                          {CATEGORY_LABELS[competency.category]}
                        </span>
                        <h3 className="text-lg font-bold uppercase tracking-wide text-ink-900">
                          {competency.name}
                        </h3>
                        <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-ink-500">
                          {competency.definition}.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(item.id)}
                        className="btn-ghost shrink-0 px-2"
                        aria-label={`Quitar ${competency.name} del plan`}
                      >
                        <Icon.trash className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mt-6 grid gap-6 lg:grid-cols-2">
                      <LevelPicker
                        label="Nivel actual"
                        value={item.currentLevel}
                        levels={competency.levels}
                        onChange={(value) => saveLevels(item, { currentLevel: value })}
                        tone="neutral"
                      />
                      <LevelPicker
                        label="Nivel requerido"
                        value={item.requiredLevel}
                        levels={competency.levels}
                        onChange={(value) => saveLevels(item, { requiredLevel: value })}
                        tone="brand"
                      />
                    </div>

                    <div className="mt-5">
                      <label className="label">Objetivo de desarrollo</label>
                      <textarea
                        className="input min-h-20"
                        value={item.objective}
                        onChange={(e) => updateLocal(item.id, { objective: e.target.value })}
                        onBlur={() => saveObjective(item)}
                      />
                      <p className="hint">
                        Lo redactamos por ti a partir de la brecha. Puedes ajustarlo con tus
                        palabras.
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {notice && <Alert tone="warning">{notice}</Alert>}

        <section>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="section-title">Catálogo de competencias</h2>
            <div className="relative">
              <Icon.search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
              <input
                className="input w-64 pl-9"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar competencia"
              />
            </div>
          </div>

          <div className="mb-5 flex flex-wrap gap-2">
            <FilterChip active={category === "ALL"} onClick={() => setCategory("ALL")}>
              Todas
            </FilterChip>
            {CATEGORIES.map((option) => (
              <FilterChip
                key={option}
                active={category === option}
                onClick={() => setCategory(option)}
              >
                {CATEGORY_LABELS[option]}
              </FilterChip>
            ))}
          </div>

          <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {visible.map((competency) => {
              const chosen = selectedIds.has(competency.id);
              return (
                <li key={competency.id}>
                  <article
                    className={`card flex h-full flex-col px-5 py-5 ${
                      chosen ? "border-brand-300 bg-brand-50/40" : ""
                    }`}
                  >
                    <span className="chip-neutral mb-3 self-start">
                      {CATEGORY_LABELS[competency.category]}
                    </span>
                    <h3 className="text-sm font-bold uppercase tracking-wide text-ink-900">
                      {competency.name}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-500">
                      {competency.definition}.
                    </p>
                    <button
                      type="button"
                      onClick={() => (chosen ? undefined : add(competency.id))}
                      disabled={chosen || (full && !chosen)}
                      className={chosen ? "btn-secondary mt-4" : "btn-primary mt-4"}
                    >
                      {chosen ? (
                        <>
                          <Icon.check className="h-4 w-4" /> En el plan
                        </>
                      ) : (
                        "Desarrollar esta competencia"
                      )}
                    </button>
                  </article>
                </li>
              );
            })}
          </ul>
          {visible.length === 0 && (
            <p className="muted py-8 text-center">
              No encontramos competencias con ese filtro.
            </p>
          )}
        </section>
      </div>
    </WizardFrame>
  );
}

function FilterChip({
  active, onClick, children,
}: {
  active: boolean; onClick: () => void; children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
        active ? "bg-brand-600 text-white" : "bg-white text-ink-500 hover:bg-sand-200"
      }`}
    >
      {children}
    </button>
  );
}

function LevelPicker({
  label, value, levels, onChange, tone,
}: {
  label: string;
  value: number;
  levels: { level: number; name: string; description: string }[];
  onChange: (value: number) => void;
  tone: "neutral" | "brand";
}) {
  const current = levels.find((l) => l.level === value);
  return (
    <div>
      <p className="label">
        {label} <span className="font-normal text-ink-400">— {value} de 5</span>
      </p>
      <div className="flex gap-1.5">
        {[1, 2, 3, 4, 5].map((level) => (
          <button
            key={level}
            type="button"
            onClick={() => onChange(level)}
            aria-label={`${label} ${level}`}
            className={`h-9 flex-1 rounded-lg text-sm font-semibold transition-colors ${
              level <= value
                ? tone === "brand"
                  ? "bg-brand-500 text-white"
                  : "bg-ink-400 text-white"
                : "bg-sand-200 text-ink-400 hover:bg-sand-300"
            }`}
          >
            {level}
          </button>
        ))}
      </div>
      {current && (
        <p className="mt-2 text-xs leading-relaxed text-ink-500">
          <strong className="text-ink-700">{current.name}.</strong> {current.description}
        </p>
      )}
    </div>
  );
}
