"use client";

import type { Difficulty, Methodology } from "@prisma/client";
import { DEVELOPMENT_TYPE_LABELS, DIFFICULTY_LABELS, METHODOLOGY_SHORT } from "@/lib/constants";
import { Icon } from "@/components/icons";

export type CatalogActivity = {
  id: string;
  title: string;
  description: string;
  benefit: string;
  methodology: Methodology;
  duration: string;
  difficulty: Difficulty;
  developmentType: "CURRENT" | "FUTURE" | "BOTH";
  toolId: string | null;
  toolName: string | null;
  competencyIds: string[];
  recommended: boolean;
  reasons: string[];
};

/** Tarjeta del catálogo. Toda la información que el líder necesita para decidir. */
export function ActivityCard({
  activity, competencyName, added, disabled, showRecommendation = true, onAdd,
}: {
  activity: CatalogActivity;
  competencyName: string;
  added: boolean;
  disabled?: boolean;
  /** El distintivo de recomendación solo tiene sentido en su propio carril. */
  showRecommendation?: boolean;
  onAdd: () => void;
}) {
  const chipClass =
    activity.methodology === "M10"
      ? "chip-m10"
      : activity.methodology === "M20"
        ? "chip-m20"
        : "chip-m70";

  return (
    <article className="card flex w-[290px] shrink-0 flex-col px-5 py-5">
      <div className="mb-3 flex items-center gap-2">
        <span className={chipClass}>{METHODOLOGY_SHORT[activity.methodology]}</span>
        {showRecommendation && activity.recommended && (
          <span className="chip-brand">
            <Icon.sparkles className="h-3 w-3" /> Recomendada
          </span>
        )}
      </div>

      <h4 className="text-sm font-bold leading-snug text-ink-900">{activity.title}</h4>
      <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-ink-500">
        {activity.description}
      </p>

      <dl className="mt-4 space-y-1.5 text-xs text-ink-500">
        <div className="flex justify-between gap-3">
          <dt className="text-ink-400">Se añadirá a</dt>
          <dd className="truncate text-right font-medium text-ink-700">{competencyName}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-ink-400">Duración</dt>
          <dd className="font-medium text-ink-700">{activity.duration}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-ink-400">Dificultad</dt>
          <dd className="font-medium text-ink-700">{DIFFICULTY_LABELS[activity.difficulty]}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-ink-400">Orientada a</dt>
          <dd className="font-medium text-ink-700">
            {DEVELOPMENT_TYPE_LABELS[activity.developmentType]}
          </dd>
        </div>
        {activity.toolName && (
          <div className="flex justify-between gap-3">
            <dt className="text-ink-400">Herramienta</dt>
            <dd className="truncate text-right font-medium text-ink-700">{activity.toolName}</dd>
          </div>
        )}
      </dl>

      <p className="mt-3 rounded-lg bg-sand-100 px-3 py-2 text-xs leading-relaxed text-ink-600">
        <span className="font-semibold text-ink-700">Para qué sirve: </span>
        {activity.benefit}
      </p>

      {showRecommendation && activity.recommended && activity.reasons[0] && (
        <p className="mt-2 text-[11px] leading-relaxed text-brand-700">
          {activity.reasons.slice(0, 2).join(" · ")}
        </p>
      )}

      <button
        type="button"
        onClick={onAdd}
        disabled={added || disabled}
        className={added ? "btn-secondary mt-4" : "btn-primary mt-4"}
      >
        {added ? (
          <>
            <Icon.check className="h-4 w-4" /> En mi plan
          </>
        ) : (
          <>
            <Icon.plus className="h-4 w-4" /> Agregar a mi plan
          </>
        )}
      </button>
    </article>
  );
}
