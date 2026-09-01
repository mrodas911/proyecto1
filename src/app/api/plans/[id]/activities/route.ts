import { z } from "zod";
import { apiUser, handler, ok, parseBody, HttpError } from "@/lib/http";
import { getEditablePlan } from "@/lib/plans";
import { assertToolAllowed, nextOrder, recomputeCompletion, toolUsage } from "@/lib/plan-service";
import { prisma } from "@/lib/prisma";
import { getRules } from "@/lib/settings";

type Ctx = { params: Promise<{ id: string }> };

const schema = z.object({
  planCompetencyId: z.string().min(1),
  methodology: z.enum(["M10", "M20", "M70"]),
  /** Actividad tomada del catálogo… */
  activityId: z.string().optional(),
  /** …o escrita por el usuario. */
  title: z.string().max(300).optional(),
  objective: z.string().max(1000).optional(),
  toolId: z.string().nullable().optional(),
});

export const POST = handler(async (request, ctx: Ctx) => {
  const user = await apiUser();
  const { id } = await ctx.params;
  const plan = await getEditablePlan(id, user);
  const body = await parseBody(request, schema);
  const rules = await getRules(plan.companyId);

  const planCompetency = plan.competencies.find((c) => c.id === body.planCompetencyId);
  if (!planCompetency) throw new HttpError(404, "Esa competencia no está en el plan.");

  let title = body.title?.trim();
  let objective = body.objective?.trim() || null;
  let toolId = body.toolId ?? null;
  let indicator: string | null = null;
  let evidence: string | null = null;
  let responsibleType: "EMPLOYEE" | "LEADER" | "MENTOR" | "HR" | "OTHER" = "EMPLOYEE";

  if (body.activityId) {
    const source = await prisma.activity.findFirst({
      where: {
        id: body.activityId,
        active: true,
        OR: [{ companyId: null }, { companyId: plan.companyId }],
      },
    });
    if (!source) throw new HttpError(404, "La actividad no está disponible.");
    if (source.methodology !== body.methodology) {
      throw new HttpError(422, "La actividad no corresponde a esta etapa del plan.");
    }
    const duplicated = planCompetency.activities.some((a) => a.activityId === source.id);
    if (duplicated) throw new HttpError(409, "Esa actividad ya está en esta competencia.");

    title = source.title;
    objective = objective ?? source.benefit;
    toolId = source.toolId;
    indicator = source.suggestedIndicator;
    evidence = source.suggestedEvidence;
    responsibleType = source.suggestedResponsible;
  }

  if (!title) throw new HttpError(422, "Escribe qué va a hacer la persona.");

  // Regla 5 de 8 / 8 de 8: se comprueba antes de crear la acción.
  assertToolAllowed(plan, rules, toolId);

  const activity = await prisma.planActivity.create({
    data: {
      planId: plan.id,
      planCompetencyId: planCompetency.id,
      activityId: body.activityId ?? null,
      toolId,
      methodology: body.methodology,
      title,
      objective,
      successIndicator: indicator,
      expectedEvidence: evidence,
      responsibleType,
      order: await nextOrder(planCompetency.id, body.methodology),
    },
    include: { tool: true },
  });

  const completion = await recomputeCompletion(plan.id);
  const refreshed = await getEditablePlan(id, user);
  return ok({ activity, completion, usage: toolUsage(refreshed, rules) }, 201);
});
