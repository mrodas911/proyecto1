import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ActivitiesManager } from "@/components/admin/activities-manager";

export const metadata: Metadata = { title: "Actividades" };
export const dynamic = "force-dynamic";

export default async function AdminActivitiesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; etapa?: string }>;
}) {
  const { q, etapa } = await searchParams;

  const [activities, competencies, tools] = await Promise.all([
    prisma.activity.findMany({
      where: {
        ...(etapa ? { methodology: etapa as never } : {}),
        ...(q ? { title: { contains: q, mode: "insensitive" } } : {}),
      },
      orderBy: [{ methodology: "asc" }, { title: "asc" }],
      include: {
        tool: { select: { id: true, name: true } },
        competencies: { select: { competencyId: true } },
        _count: { select: { planActivities: true } },
      },
      take: 300,
    }),
    prisma.competency.findMany({
      where: { active: true },
      orderBy: [{ order: "asc" }],
      select: { id: true, name: true },
    }),
    prisma.developmentTool.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
      select: { id: true, name: true, methodology: true },
    }),
  ]);

  return (
    <ActivitiesManager
      query={q ?? ""}
      stage={etapa ?? ""}
      competencies={competencies}
      tools={tools}
      activities={activities.map((activity) => ({
        id: activity.id,
        title: activity.title,
        description: activity.description,
        benefit: activity.benefit,
        methodology: activity.methodology,
        toolId: activity.toolId,
        toolName: activity.tool?.name ?? null,
        difficulty: activity.difficulty,
        developmentType: activity.developmentType,
        duration: activity.duration,
        suggestedIndicator: activity.suggestedIndicator ?? "",
        suggestedEvidence: activity.suggestedEvidence ?? "",
        suggestedResponsible: activity.suggestedResponsible,
        minPerformance: activity.minPerformance,
        minPotential: activity.minPotential,
        active: activity.active,
        competencyIds: activity.competencies.map((c) => c.competencyId),
        usedInPlans: activity._count.planActivities,
      }))}
    />
  );
}
