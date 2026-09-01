import { z } from "zod";
import { audit } from "@/lib/audit";
import { apiUser, fail, handler, ok, parseBody } from "@/lib/http";
import { getEditablePlan, getPlanForUser } from "@/lib/plans";
import { recomputeCompletion } from "@/lib/plan-service";
import { prisma } from "@/lib/prisma";

type Ctx = { params: Promise<{ id: string }> };

const patchSchema = z.object({
  objectiveType: z.enum(["CURRENT_ROLE", "FUTURE_ROLE"]).nullable().optional(),
  objectiveStatement: z.string().max(2000).nullable().optional(),
  targetPositionId: z.string().nullable().optional(),
  targetPositionTitle: z.string().max(200).nullable().optional(),
  targetPositionArea: z.string().max(200).nullable().optional(),
  horizon: z.enum(["LT_12M", "M12_24", "GT_24M"]).nullable().optional(),
  planDate: z.string().nullable().optional(),
  wizardStep: z.number().int().min(1).max(9).optional(),
});

export const GET = handler(async (_request, ctx: Ctx) => {
  const user = await apiUser();
  const { id } = await ctx.params;
  const plan = await getPlanForUser(id, user);
  return ok({ plan });
});

export const PATCH = handler(async (request, ctx: Ctx) => {
  const user = await apiUser();
  const { id } = await ctx.params;
  const plan = await getEditablePlan(id, user);
  const body = await parseBody(request, patchSchema);

  // Cambiar el objetivo del plan modifica la cuota de herramientas disponible,
  // por eso se recalcula la completitud inmediatamente después.
  await prisma.developmentPlan.update({
    where: { id: plan.id },
    data: {
      ...(body.objectiveType !== undefined ? { objectiveType: body.objectiveType } : {}),
      ...(body.objectiveStatement !== undefined
        ? { objectiveStatement: body.objectiveStatement }
        : {}),
      ...(body.targetPositionId !== undefined ? { targetPositionId: body.targetPositionId } : {}),
      ...(body.targetPositionTitle !== undefined
        ? { targetPositionTitle: body.targetPositionTitle }
        : {}),
      ...(body.targetPositionArea !== undefined
        ? { targetPositionArea: body.targetPositionArea }
        : {}),
      ...(body.horizon !== undefined ? { horizon: body.horizon } : {}),
      ...(body.planDate ? { planDate: new Date(body.planDate) } : {}),
      ...(body.wizardStep !== undefined
        ? { wizardStep: Math.max(plan.wizardStep, body.wizardStep) }
        : {}),
    },
  });

  const completion = await recomputeCompletion(plan.id);
  return ok({ ok: true, completion });
});

export const DELETE = handler(async (_request, ctx: Ctx) => {
  const user = await apiUser();
  const { id } = await ctx.params;
  const plan = await getPlanForUser(id, user);

  if (user.role === "LEADER" && plan.authorUserId !== user.id) {
    return fail("Solo quien creó el plan puede eliminarlo.", 403);
  }
  await prisma.developmentPlan.delete({ where: { id: plan.id } });
  await audit({
    companyId: plan.companyId, userId: user.id,
    action: "plan.delete", entity: "DevelopmentPlan", entityId: plan.id,
  });
  return ok({ ok: true });
});
