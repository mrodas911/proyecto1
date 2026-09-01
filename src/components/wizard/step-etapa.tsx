"use client";

import { useEffect, useMemo, useState } from "react";
import type { Methodology } from "@prisma/client";
import { api, ApiError } from "@/lib/client-api";
import { STAGES } from "@/lib/constants";
import { Alert } from "@/components/ui";
import { Icon } from "@/components/icons";
import { ActivityCard, type CatalogActivity } from "./activity-card";
import { WizardFrame, type WizardHeader } from "./frame";
import { useSaveState } from "./save-state";

export type StageCompetency = {
  planCompetencyId: string;
  competencyId: string;
  name: string;
  objective: string | null;
  /** Acciones ya elegidas para esta etapa. */
  actions: { id: string; title: string; activityId: string | null; toolName: string | null }[];
};

export type ToolUsageView = { usedCount: number; quota: number };

export function StepEtapa({
  header, methodology, competencies: initial, usage: initialUsage, stepNumber,
}: {
  header: WizardHeader;
  methodology: Methodology;
  competencies: StageCompetency[];
  usage: ToolUsageView;
  stepNumber: number;
}) {
  const stage = STAGES[methodology];
  const [competencies, setCompetencies] = useState(initial);
  const [usage, setUsage] = useState(initialUsage);
  const [catalog, setCatalog] = useState<CatalogActivity[] | null>(null);
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const { run, runOrThrow } = useSaveState();

  useEffect(() => {
    let cancelled = false;
    api
      .get<{ items: CatalogActivity[] }>(
        `/api/plans/${header.planId}/recommendations?methodology=${methodology}`
      )
      .then((data) => {
        if (!cancelled) setCatalog(data.items);
      })
      .catch(() => {
        if (!cancelled) setCatalog([]);
      });
    return () => {
      cancelled = true;
    };
  }, [header.planId, methodology]);

  const filteredCatalog = useMemo(() => {
    if (!catalog) return null;
    if (!query.trim()) return catalog;
    const q = query.toLowerCase();
    return catalog.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.benefit.toLowerCase().includes(q)
    );
  }, [catalog, query]);

  async function addFromCatalog(competency: StageCompetency, activity: CatalogActivity) {
    setNotice(null);
    try {
      const result = await runOrThrow(() =>
        api.post<{
          activity: { id: string; title: string; activityId: string | null };
          usage: { used: string[]; quota: number };
        }>(`/api/plans/${header.planId}/activities`, {
          planCompetencyId: competency.planCompetencyId,
          methodology,
          activityId: activity.id,
        })
      );
      setCompetencies((prev) =>
        prev.map((c) =>
          c.planCompetencyId === competency.planCompetencyId
            ? {
                ...c,
                actions: [
                  ...c.actions,
                  {
                    id: result.activity.id,
                    title: result.activity.title,
                    activityId: activity.id,
                    toolName: activity.toolName,
                  },
                ],
              }
            : c
        )
      );
      setUsage({ usedCount: result.usage.used.length, quota: result.usage.quota });
    } catch (error) {
      setNotice(
        error instanceof ApiError ? error.message : "No pudimos agregar esta actividad."
      );
    }
  }

  async function addCustom(competency: StageCompetency, title: string) {
    setNotice(null);
    try {
      const result = await runOrThrow(() =>
        api.post<{ activity: { id: string; title: string } }>(
          `/api/plans/${header.planId}/activities`,
          { planCompetencyId: competency.planCompetencyId, methodology, title }
        )
      );
      setCompetencies((prev) =>
        prev.map((c) =>
          c.planCompetencyId === competency.planCompetencyId
            ? {
                ...c,
                actions: [
                  ...c.actions,
                  { id: result.activity.id, title: result.activity.title, activityId: null, toolName: null },
                ],
              }
            : c
        )
      );
    } catch (error) {
      setNotice(error instanceof ApiError ? error.message : "No pudimos agregar la acción.");
    }
  }

  async function removeAction(competency: StageCompetency, actionId: string) {
    const result = await run(() =>
      api.del<{ usage: { used: string[]; quota: number } }>(
        `/api/plans/${header.planId}/activities/${actionId}`
      )
    );
    if (!result) return;
    setCompetencies((prev) =>
      prev.map((c) =>
        c.planCompetencyId === competency.planCompetencyId
          ? { ...c, actions: c.actions.filter((a) => a.id !== actionId) }
          : c
      )
    );
    setUsage({ usedCount: result.usage.used.length, quota: result.usage.quota });
  }

  const missing = competencies.filter((c) => c.actions.length === 0);

  return (
    <WizardFrame
      header={header}
      title={`Paso ${stepNumber} · ${stage.pct} ${stage.title}`}
      question={stage.question}
      hint={stage.hint}
      nextDisabled={competencies.length === 0}
    >
      <div className="space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white px-5 py-4 shadow-[var(--shadow-card)]">
          <p className="text-sm text-ink-700">
            Has seleccionado{" "}
            <strong className="text-brand-700">
              {usage.usedCount} de {usage.quota}
            </strong>{" "}
            herramientas disponibles.
          </p>
          <div className="flex gap-1.5" aria-hidden>
            {Array.from({ length: usage.quota }).map((_, index) => (
              <span
                key={index}
                className={`h-2.5 w-7 rounded-full ${
                  index < usage.usedCount ? "bg-brand-500" : "bg-sand-200"
                }`}
              />
            ))}
          </div>
        </div>

        {notice && <Alert tone="warning">{notice}</Alert>}

        {missing.length > 0 && missing.length < competencies.length && (
          <Alert tone="info">
            Todavía no has elegido nada para: {missing.map((c) => c.name).join(", ")}.
          </Alert>
        )}

        <div className="relative max-w-md">
          <Icon.search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            className="input pl-9"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar en el catálogo"
          />
        </div>

        {competencies.map((competency) => {
          const chosenIds = new Set(
            competency.actions.map((a) => a.activityId).filter(Boolean) as string[]
          );
          const recommended =
            filteredCatalog?.filter((a) => a.competencyIds.includes(competency.competencyId)) ??
            null;
          const others =
            filteredCatalog?.filter((a) => !a.competencyIds.includes(competency.competencyId)) ??
            null;

          return (
            <section key={competency.planCompetencyId}>
              <header className="mb-4">
                <h2 className="text-lg font-bold uppercase tracking-wide text-ink-900">
                  {competency.name}
                </h2>
                {competency.objective && (
                  <p className="mt-1 max-w-3xl text-sm text-ink-500">{competency.objective}</p>
                )}
              </header>

              {competency.actions.length > 0 && (
                <ul className="mb-5 space-y-2">
                  {competency.actions.map((action) => (
                    <li
                      key={action.id}
                      className="flex items-center justify-between gap-3 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3"
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold text-brand-900">
                          {action.title}
                        </span>
                        {action.toolName && (
                          <span className="block text-xs text-brand-700">{action.toolName}</span>
                        )}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeAction(competency, action.id)}
                        className="btn-ghost shrink-0 px-2 text-brand-700"
                        aria-label={`Quitar ${action.title}`}
                      >
                        <Icon.trash className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <CustomActivity
                placeholder={stage.customPlaceholder}
                onAdd={(title) => addCustom(competency, title)}
              />

              {recommended === null ? (
                <p className="muted mt-6 animate-pulse-soft">Buscando recomendaciones…</p>
              ) : (
                <>
                  <Rail
                    title={`Recomendado para ${competency.name}`}
                    activities={recommended}
                    competencyName={competency.name}
                    chosenIds={chosenIds}
                    onAdd={(activity) => addFromCatalog(competency, activity)}
                  />
                  {others && others.length > 0 && (
                    <Rail
                      title="Otras opciones del catálogo"
                      activities={others.slice(0, 12)}
                      competencyName={competency.name}
                      chosenIds={chosenIds}
                      showRecommendation={false}
                      onAdd={(activity) => addFromCatalog(competency, activity)}
                    />
                  )}
                </>
              )}
            </section>
          );
        })}
      </div>
    </WizardFrame>
  );
}

function Rail({
  title, activities, competencyName, chosenIds, showRecommendation = true, onAdd,
}: {
  title: string;
  activities: CatalogActivity[];
  competencyName: string;
  chosenIds: Set<string>;
  showRecommendation?: boolean;
  onAdd: (activity: CatalogActivity) => void;
}) {
  if (activities.length === 0) return null;
  return (
    <div className="mt-6">
      <h3 className="mb-3 text-sm font-semibold text-ink-700">{title}</h3>
      <div className="rail">
        {activities.map((activity) => (
          <ActivityCard
            key={activity.id}
            activity={activity}
            competencyName={competencyName}
            added={chosenIds.has(activity.id)}
            showRecommendation={showRecommendation}
            onAdd={() => onAdd(activity)}
          />
        ))}
      </div>
    </div>
  );
}

function CustomActivity({
  placeholder, onAdd,
}: {
  placeholder: string; onAdd: (title: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="btn-secondary">
        <Icon.edit className="h-4 w-4" />
        Escribir mi propia actividad
      </button>
    );
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (!title.trim()) return;
        onAdd(title.trim());
        setTitle("");
        setOpen(false);
      }}
      className="flex flex-wrap gap-2"
    >
      <input
        className="input flex-1"
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder={placeholder}
      />
      <button type="submit" className="btn-primary">
        Agregar
      </button>
      <button type="button" className="btn-ghost" onClick={() => setOpen(false)}>
        Cancelar
      </button>
    </form>
  );
}
