/**
 * Definición de las reglas configurables de la plataforma.
 *
 * Vive separado de `settings.ts` (que consulta la base de datos) para que los
 * formularios del panel puedan reutilizar tipos y etiquetas en el cliente.
 */
import type { ObjectiveType } from "@prisma/client";

export type PlatformRules = {
  /** Herramientas del catálogo principal disponibles para plan de puesto actual. */
  toolsAllowedCurrentRole: number;
  /** Herramientas disponibles para plan de posición futura. */
  toolsAllowedFutureRole: number;
  /** Máximo de competencias recomendadas por PDI. */
  maxCompetencies: number;
  /** Mínimo de competencias para considerar el plan válido. */
  minCompetencies: number;
  /** Mínimo de acciones exigidas por competencia en cada etapa. */
  minActionsPer10: number;
  minActionsPer20: number;
  minActionsPer70: number;
  /** Umbral de completitud a partir del cual se permite generar el plan. */
  completionThreshold: number;
};

export const DEFAULT_RULES: PlatformRules = {
  toolsAllowedCurrentRole: 5,
  toolsAllowedFutureRole: 8,
  maxCompetencies: 3,
  minCompetencies: 1,
  minActionsPer10: 1,
  minActionsPer20: 1,
  minActionsPer70: 1,
  completionThreshold: 80,
};

export const RULE_LABELS: Record<keyof PlatformRules, string> = {
  toolsAllowedCurrentRole: "Herramientas disponibles — plan de puesto actual",
  toolsAllowedFutureRole: "Herramientas disponibles — plan de posición futura",
  maxCompetencies: "Máximo de competencias por plan",
  minCompetencies: "Mínimo de competencias por plan",
  minActionsPer10: "Acciones mínimas de 10% por competencia",
  minActionsPer20: "Acciones mínimas de 20% por competencia",
  minActionsPer70: "Acciones mínimas de 70% por competencia",
  completionThreshold: "Completitud mínima para generar el plan (%)",
};

/** Cuántas herramientas puede usar un plan según su objetivo (regla 5/8 y 8/8). */
export function toolQuota(rules: PlatformRules, objective: ObjectiveType | null): number {
  return objective === "FUTURE_ROLE"
    ? rules.toolsAllowedFutureRole
    : rules.toolsAllowedCurrentRole;
}
