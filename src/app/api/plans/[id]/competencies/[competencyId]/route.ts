import { z } from "zod";
import { apiUser, handler, ok, parseBody, HttpError } from "@/lib/http";
import { draftCompetencyObjective } from "@/lib/recommender";
import { getEditablePlan } from "@/lib/plans";
import { recomputeCompletion } from "@/lib/plan-service";
import { prisma } from "@/lib/prisma";

type Ctx = { params: Promise<{ id: string; competencyId: string }> };

const schema = z.object({
  currentLevel: z.number().int().min(1).max(5).optional(),
  requiredLevel: z.number().int().min(1).max(5).optional(),
  objective: z.string().max(2000).nullable().optional(),
  priority: z.number().int().min(1).max(10).optional(),
  /** Vuelve a redactar el objetivo a partir de los niveles indicados. */
  regenerateObjective: z.boolean().optional(),
});

export const PATCH = handler(async (request, ctx: Ctx) => {
  const user = await apiUser();
  const { id, competencyId } = await ctx.params;
  const plan = await getEditablePlan(id, user);
  const item = plan.competencies.find((c) => c.id === competencyId);
  if (!item) throw new HttpError(404, "Esa competencia no está en el plan.");

  const body = await parseBody(request, schema);
  const currentLevel = body.currentLevel ?? item.currentLevel;
  const requiredLevel = body.requiredLevel ?? item.requiredLevel;

  const objective = body.regenerateObjective
    ? draftCompetencyObjective({
        competencyName: item.competency.name,
        definition: item.competency.definition,
        currentLevel,
        requiredLevel,
      })
    : body.objective;

  await prisma.planCompetency.update({
    where: { id: item.id },
    data: {
      currentLevel,
      requiredLevel,
      ...(objective !== undefined ? { objective } : {}),
      ...(body.priority !== undefined ? { priority: body.priority } : {}),
    },
  });

  const completion = await recomputeCompletion(plan.id);
  return ok({ ok: true, completion, objective });
});

export const DELETE = handler(async (_request, ctx: Ctx) => {
  const user = await apiUser();
  const { id, competencyId } = await ctx.params;
  const plan = await getEditablePlan(id, user);
  const item = plan.competencies.find((c) => c.id === competencyId);
  if (!item) throw new HttpError(404, "Esa competencia no está en el plan.");

  // Al quitar una competencia se eliminan también sus acciones (cascada).
  await prisma.planCompetency.delete({ where: { id: item.id } });
  const completion = await recomputeCompletion(plan.id);
  return ok({ ok: true, completion });
});
