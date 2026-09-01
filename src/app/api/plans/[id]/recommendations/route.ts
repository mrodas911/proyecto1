import { apiUser, handler, ok, HttpError } from "@/lib/http";
import { getPlanForUser } from "@/lib/plans";
import { prisma } from "@/lib/prisma";
import { recommendActivities } from "@/lib/recommender";
import type { Methodology } from "@prisma/client";

type Ctx = { params: Promise<{ id: string }> };

/**
 * Actividades del catálogo ordenadas por su ajuste al plan.
 * Devuelve todas las disponibles: el sistema recomienda, el líder decide.
 */
export const GET = handler(async (request, ctx: Ctx) => {
  const user = await apiUser();
  const { id } = await ctx.params;
  const plan = await getPlanForUser(id, user);

  const url = new URL(request.url);
  const methodology = url.searchParams.get("methodology") as Methodology | null;
  if (methodology && !["M10", "M20", "M70"].includes(methodology)) {
    throw new HttpError(422, "Etapa no válida.");
  }
  const query = url.searchParams.get("q")?.trim().toLowerCase();

  const activities = await prisma.activity.findMany({
    where: {
      active: true,
      OR: [{ companyId: null }, { companyId: plan.companyId }],
      ...(methodology ? { methodology } : {}),
    },
    include: { competencies: true, tool: true },
  });

  const scored = recommendActivities(
    activities,
    {
      objectiveType: plan.objectiveType,
      performance: plan.diagnostic?.performance ?? null,
      potential: plan.diagnostic?.potential ?? null,
      aspiration: plan.diagnostic?.aspiration ?? null,
      competencies: plan.competencies.map((c) => ({
        competencyId: c.competencyId,
        gap: c.requiredLevel - c.currentLevel,
      })),
    },
    methodology ?? undefined
  );

  const filtered = query
    ? scored.filter(
        (item) =>
          item.activity.title.toLowerCase().includes(query) ||
          item.activity.description.toLowerCase().includes(query)
      )
    : scored;

  return ok({
    items: filtered.map((item) => ({
      id: item.activity.id,
      title: item.activity.title,
      description: item.activity.description,
      benefit: item.activity.benefit,
      methodology: item.activity.methodology,
      duration: item.activity.duration,
      difficulty: item.activity.difficulty,
      developmentType: item.activity.developmentType,
      toolId: item.activity.toolId,
      toolName: item.activity.tool?.name ?? null,
      competencyIds: item.activity.competencies.map((c) => c.competencyId),
      recommended: item.recommended,
      reasons: item.reasons,
      score: item.score,
    })),
  });
});
