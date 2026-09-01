/**
 * Operaciones de dominio sobre un plan: recálculo de completitud, control de
 * la cuota de herramientas (regla 5/8 y 8/8) y creación de nuevas versiones.
 */
import "server-only";
import type { Methodology } from "@prisma/client";
import { HttpError } from "./http";
import { planDetailInclude, type PlanDetail } from "./plans";
import { prisma } from "./prisma";
import { getRules, toolQuota, type PlatformRules } from "./settings";
import { validatePlan } from "./plan-validation";

export async function loadPlan(planId: string): Promise<PlanDetail> {
  const plan = await prisma.developmentPlan.findUnique({
    where: { id: planId },
    include: planDetailInclude,
  });
  if (!plan) throw new HttpError(404, "El plan no existe.");
  return plan;
}

/** Recalcula y persiste el porcentaje de completitud del plan. */
export async function recomputeCompletion(planId: string): Promise<number> {
  const plan = await loadPlan(planId);
  const rules = await getRules(plan.companyId);
  const { completion } = validatePlan(plan, rules);
  if (completion !== plan.completion) {
    await prisma.developmentPlan.update({
      where: { id: planId },
      data: { completion },
    });
  }
  return completion;
}

export type ToolUsage = {
  used: string[];
  quota: number;
  remaining: number;
};

/** Herramientas distintas ya utilizadas en el plan y cuántas quedan. */
export function toolUsage(plan: PlanDetail, rules: PlatformRules): ToolUsage {
  const used = new Set<string>();
  for (const competency of plan.competencies) {
    for (const activity of competency.activities) {
      if (activity.toolId) used.add(activity.toolId);
    }
  }
  const quota = toolQuota(rules, plan.objectiveType);
  return {
    used: [...used],
    quota,
    remaining: Math.max(0, quota - used.size),
  };
}

/**
 * Comprueba que añadir una actividad con `toolId` no supere la cuota.
 * Las actividades sin herramienta asociada (escritas a mano) nunca consumen cuota.
 */
export function assertToolAllowed(
  plan: PlanDetail,
  rules: PlatformRules,
  toolId: string | null | undefined
): void {
  if (!toolId) return;
  const usage = toolUsage(plan, rules);
  if (usage.used.includes(toolId)) return;
  if (usage.remaining > 0) return;
  throw new HttpError(
    409,
    `Este plan permite ${usage.quota} herramientas y ya has utilizado las ${usage.quota}. ` +
      "Elimina una actividad de otra herramienta o elige una actividad de las herramientas ya seleccionadas."
  );
}

/** Siguiente posición dentro de una etapa, para mantener el orden estable. */
export async function nextOrder(
  planCompetencyId: string,
  methodology: Methodology
): Promise<number> {
  const last = await prisma.planActivity.findFirst({
    where: { planCompetencyId, methodology },
    orderBy: { order: "desc" },
    select: { order: true },
  });
  return (last?.order ?? -1) + 1;
}

/**
 * Duplica un plan finalizado como nueva versión editable.
 * El histórico conserva la versión anterior intacta.
 */
export async function createNewVersion(planId: string, authorUserId: string): Promise<string> {
  const source = await loadPlan(planId);
  const siblings = await prisma.developmentPlan.count({
    where: { OR: [{ id: source.parentPlanId ?? source.id }, { parentPlanId: source.parentPlanId ?? source.id }] },
  });

  const copy = await prisma.developmentPlan.create({
    data: {
      companyId: source.companyId,
      employeeId: source.employeeId,
      authorUserId,
      status: "DRAFT",
      objectiveType: source.objectiveType,
      objectiveStatement: source.objectiveStatement,
      targetPositionId: source.targetPositionId,
      targetPositionTitle: source.targetPositionTitle,
      targetPositionArea: source.targetPositionArea,
      horizon: source.horizon,
      wizardStep: 8,
      version: siblings + 1,
      parentPlanId: source.parentPlanId ?? source.id,
    },
  });

  if (source.diagnostic) {
    await prisma.diagnostic.create({
      data: {
        companyId: source.companyId,
        employeeId: source.employeeId,
        planId: copy.id,
        source: source.diagnostic.source,
        performance: source.diagnostic.performance,
        potential: source.diagnostic.potential,
        aspiration: source.diagnostic.aspiration,
        aspirationNote: source.diagnostic.aspirationNote,
        nineBox: source.diagnostic.nineBox,
        notes: source.diagnostic.notes,
      },
    });
  }

  for (const competency of source.competencies) {
    const created = await prisma.planCompetency.create({
      data: {
        planId: copy.id,
        competencyId: competency.competencyId,
        priority: competency.priority,
        currentLevel: competency.currentLevel,
        requiredLevel: competency.requiredLevel,
        objective: competency.objective,
      },
    });
    for (const activity of competency.activities) {
      await prisma.planActivity.create({
        data: {
          planId: copy.id,
          planCompetencyId: created.id,
          activityId: activity.activityId,
          toolId: activity.toolId,
          methodology: activity.methodology,
          title: activity.title,
          objective: activity.objective,
          responsibleType: activity.responsibleType,
          responsibleName: activity.responsibleName,
          startDate: activity.startDate,
          targetDate: activity.targetDate,
          frequency: activity.frequency,
          successIndicator: activity.successIndicator,
          expectedEvidence: activity.expectedEvidence,
          notes: activity.notes,
          order: activity.order,
        },
      });
    }
  }

  await recomputeCompletion(copy.id);
  return copy.id;
}
