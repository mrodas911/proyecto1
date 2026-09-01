import { z } from "zod";
import { apiUser, handler, ok, parseBody, HttpError } from "@/lib/http";
import { draftCompetencyObjective } from "@/lib/recommender";
import { getEditablePlan } from "@/lib/plans";
import { recomputeCompletion } from "@/lib/plan-service";
import { prisma } from "@/lib/prisma";
import { getRules } from "@/lib/settings";

type Ctx = { params: Promise<{ id: string }> };

const schema = z.object({
  competencyId: z.string().min(1),
  currentLevel: z.number().int().min(1).max(5).default(2),
  requiredLevel: z.number().int().min(1).max(5).default(4),
});

export const POST = handler(async (request, ctx: Ctx) => {
  const user = await apiUser();
  const { id } = await ctx.params;
  const plan = await getEditablePlan(id, user);
  const body = await parseBody(request, schema);
  const rules = await getRules(plan.companyId);

  if (plan.competencies.length >= rules.maxCompetencies) {
    throw new HttpError(
      409,
      `Para lograr mayor impacto recomendamos trabajar máximo ${rules.maxCompetencies} competencias simultáneamente.`
    );
  }
  if (plan.competencies.some((c) => c.competencyId === body.competencyId)) {
    throw new HttpError(409, "Esa competencia ya forma parte del plan.");
  }

  const competency = await prisma.competency.findFirst({
    where: {
      id: body.competencyId,
      active: true,
      OR: [{ companyId: null }, { companyId: plan.companyId }],
    },
  });
  if (!competency) throw new HttpError(404, "La competencia no está disponible.");

  const planCompetency = await prisma.planCompetency.create({
    data: {
      planId: plan.id,
      competencyId: competency.id,
      priority: plan.competencies.length + 1,
      currentLevel: body.currentLevel,
      requiredLevel: body.requiredLevel,
      objective: draftCompetencyObjective({
        competencyName: competency.name,
        definition: competency.definition,
        currentLevel: body.currentLevel,
        requiredLevel: body.requiredLevel,
      }),
    },
  });

  const completion = await recomputeCompletion(plan.id);
  return ok({ planCompetency, completion }, 201);
});
