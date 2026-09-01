/**
 * Consultas de planes con las reglas de visibilidad aplicadas.
 *
 * Privacidad: el diagnóstico (desempeño, potencial, aspiración) es información
 * confidencial. `canSeeDiagnostic` decide si se entrega al usuario actual.
 */
import "server-only";
import { notFound } from "next/navigation";
import type { Prisma, Role } from "@prisma/client";
import { prisma } from "./prisma";
import { can } from "./rbac";
import type { ApiUser } from "./http";
import { HttpError } from "./http";

export const planDetailInclude = {
  employee: { include: { position: true } },
  author: { select: { id: true, firstName: true, lastName: true, email: true } },
  company: true,
  diagnostic: true,
  targetPosition: true,
  competencies: {
    orderBy: { priority: "asc" },
    include: {
      competency: { include: { levels: { orderBy: { level: "asc" } } } },
      activities: {
        orderBy: [{ methodology: "asc" }, { order: "asc" }],
        include: { tool: true, activity: true },
      },
    },
  },
} satisfies Prisma.DevelopmentPlanInclude;

export type PlanDetail = Prisma.DevelopmentPlanGetPayload<{
  include: typeof planDetailInclude;
}>;

/** Filtro de visibilidad según el rol. Nunca cruza la frontera de empresa. */
export function planVisibilityFilter(user: ApiUser): Prisma.DevelopmentPlanWhereInput {
  if (user.role === "SUPERADMIN") return {};
  const base: Prisma.DevelopmentPlanWhereInput = { companyId: user.companyId ?? "__none__" };
  if (user.role === "COMPANY_ADMIN") return base;
  if (user.role === "LEADER") {
    return {
      ...base,
      OR: [{ authorUserId: user.id }, { employee: { leaderUserId: user.id } }],
    };
  }
  // Colaborador: únicamente su propio plan, y solo si ya fue finalizado.
  return {
    ...base,
    employee: { account: { id: user.id } },
    status: { in: ["FINALIZED", "DOWNLOADED", "IN_PROGRESS", "COMPLETED"] },
  };
}

export async function getPlanForUser(planId: string, user: ApiUser): Promise<PlanDetail> {
  const plan = await prisma.developmentPlan.findFirst({
    where: { AND: [{ id: planId }, planVisibilityFilter(user)] },
    include: planDetailInclude,
  });
  if (!plan) throw new HttpError(404, "El plan no existe o no tienes acceso a él.");
  return plan;
}

/** Solo los roles con permiso pueden editar, y nunca un plan ya finalizado. */
export async function getEditablePlan(planId: string, user: ApiUser): Promise<PlanDetail> {
  if (!can(user.role, "plans.edit")) {
    throw new HttpError(403, "No tienes permisos para modificar planes.");
  }
  const plan = await getPlanForUser(planId, user);
  if (plan.status !== "DRAFT") {
    throw new HttpError(
      409,
      "El plan ya fue generado. Crea una nueva versión para poder modificarlo."
    );
  }
  return plan;
}

/**
 * Variante para páginas: en lugar de lanzar un error de API, muestra la
 * pantalla de «no encontrado», que es lo que corresponde en el navegador.
 */
export async function getPlanForPage(planId: string, user: ApiUser): Promise<PlanDetail> {
  const plan = await prisma.developmentPlan.findFirst({
    where: { AND: [{ id: planId }, planVisibilityFilter(user)] },
    include: planDetailInclude,
  });
  if (!plan) notFound();
  return plan;
}

export function canSeeDiagnostic(role: Role): boolean {
  return can(role, "diagnostic.read");
}

/** Marca el paso alcanzado del asistente (permite «guardar y continuar»). */
export async function touchWizardStep(planId: string, step: number): Promise<void> {
  await prisma.developmentPlan.update({
    where: { id: planId },
    data: { wizardStep: { set: step } },
  });
}

export async function advanceWizard(planId: string, current: number, step: number) {
  if (step > current) await touchWizardStep(planId, step);
}
