/**
 * Validación del plan antes de generar el documento.
 * Devuelve un porcentaje de completitud y la lista de lo que falta.
 */
import type { Methodology } from "@prisma/client";
import type { PlatformRules } from "./settings";

export type ValidatablePlan = {
  objectiveType: unknown;
  objectiveStatement?: string | null;
  targetPositionTitle?: string | null;
  horizon?: unknown;
  diagnostic: { performance: unknown; potential: unknown } | null;
  competencies: {
    id: string;
    objective?: string | null;
    competency: { name: string };
    activities: {
      methodology: Methodology;
      startDate: Date | null;
      targetDate: Date | null;
      responsibleName: string | null;
      successIndicator: string | null;
      expectedEvidence: string | null;
    }[];
  }[];
};

export type CheckResult = {
  id: string;
  label: string;
  ok: boolean;
  weight: number;
  detail?: string;
  /** Paso del asistente donde se corrige. */
  step: number;
};

export type ValidationReport = {
  completion: number;
  checks: CheckResult[];
  missing: CheckResult[];
  canGenerate: boolean;
};

export function validatePlan(
  plan: ValidatablePlan,
  rules: PlatformRules
): ValidationReport {
  const checks: CheckResult[] = [];
  const allActivities = plan.competencies.flatMap((c) => c.activities);

  checks.push({
    id: "diagnostic",
    label: "Tiene diagnóstico de desempeño y potencial",
    ok: Boolean(plan.diagnostic?.performance && plan.diagnostic?.potential),
    weight: 10,
    step: 2,
  });

  checks.push({
    id: "objective",
    label: "Tiene objetivo de desarrollo definido",
    ok: Boolean(plan.objectiveType),
    weight: 10,
    step: 3,
  });

  const futureOk =
    plan.objectiveType !== "FUTURE_ROLE" ||
    Boolean(plan.targetPositionTitle && plan.horizon);
  checks.push({
    id: "target",
    label: "Tiene posición objetivo y horizonte",
    ok: futureOk,
    weight: 5,
    detail:
      plan.objectiveType === "FUTURE_ROLE"
        ? undefined
        : "No aplica a los planes de puesto actual.",
    step: 3,
  });

  const compCount = plan.competencies.length;
  checks.push({
    id: "competencies",
    label: `Tiene entre ${rules.minCompetencies} y ${rules.maxCompetencies} competencias priorizadas`,
    ok: compCount >= rules.minCompetencies && compCount <= rules.maxCompetencies,
    weight: 15,
    detail: `${compCount} seleccionada${compCount === 1 ? "" : "s"}.`,
    step: 4,
  });

  const stageChecks: { m: Methodology; label: string; min: number; step: number }[] = [
    { m: "M10", label: "Tiene acciones de 10% en cada competencia", min: rules.minActionsPer10, step: 5 },
    { m: "M20", label: "Tiene acciones de 20% en cada competencia", min: rules.minActionsPer20, step: 6 },
    { m: "M70", label: "Tiene acciones de 70% en cada competencia", min: rules.minActionsPer70, step: 7 },
  ];

  for (const stage of stageChecks) {
    const incomplete = plan.competencies.filter(
      (c) => c.activities.filter((a) => a.methodology === stage.m).length < stage.min
    );
    checks.push({
      id: `stage-${stage.m}`,
      label: stage.label,
      ok: compCount > 0 && incomplete.length === 0,
      weight: stage.m === "M70" ? 15 : 10,
      detail:
        incomplete.length > 0
          ? `Falta en: ${incomplete.map((c) => c.competency.name).join(", ")}.`
          : undefined,
      step: stage.step,
    });
  }

  const withoutDates = allActivities.filter((a) => !a.startDate || !a.targetDate);
  checks.push({
    id: "dates",
    label: "Todas las acciones tienen fecha de inicio y fecha objetivo",
    ok: allActivities.length > 0 && withoutDates.length === 0,
    weight: 10,
    detail: withoutDates.length > 0 ? `${withoutDates.length} acción(es) sin fechas.` : undefined,
    step: 8,
  });

  const withoutResponsible = allActivities.filter((a) => !a.responsibleName?.trim());
  checks.push({
    id: "responsible",
    label: "Todas las acciones tienen responsable",
    ok: allActivities.length > 0 && withoutResponsible.length === 0,
    weight: 8,
    detail:
      withoutResponsible.length > 0
        ? `${withoutResponsible.length} acción(es) sin responsable.`
        : undefined,
    step: 8,
  });

  const withoutIndicator = allActivities.filter((a) => !a.successIndicator?.trim());
  checks.push({
    id: "indicators",
    label: "Todas las acciones tienen indicador de éxito",
    ok: allActivities.length > 0 && withoutIndicator.length === 0,
    weight: 12,
    detail:
      withoutIndicator.length > 0
        ? `${withoutIndicator.length} acción(es) sin indicador.`
        : undefined,
    step: 8,
  });

  const withoutObjective = plan.competencies.filter((c) => !c.objective?.trim());
  checks.push({
    id: "competency-objectives",
    label: "Cada competencia tiene su objetivo de desarrollo",
    ok: compCount > 0 && withoutObjective.length === 0,
    weight: 5,
    detail:
      withoutObjective.length > 0
        ? `Falta en: ${withoutObjective.map((c) => c.competency.name).join(", ")}.`
        : undefined,
    step: 4,
  });

  const total = checks.reduce((sum, c) => sum + c.weight, 0);
  const earned = checks.reduce((sum, c) => sum + (c.ok ? c.weight : 0), 0);
  const completion = total === 0 ? 0 : Math.round((earned / total) * 100);
  const missing = checks.filter((c) => !c.ok);

  return {
    completion,
    checks,
    missing,
    canGenerate: completion >= rules.completionThreshold,
  };
}
