import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { CompetenciesManager } from "@/components/admin/competencies-manager";

export const metadata: Metadata = { title: "Competencias" };
export const dynamic = "force-dynamic";

export default async function AdminCompetenciesPage() {
  const competencies = await prisma.competency.findMany({
    orderBy: [{ order: "asc" }, { name: "asc" }],
    include: {
      levels: { orderBy: { level: "asc" } },
      _count: { select: { activities: true, planCompetencies: true } },
    },
  });

  return (
    <CompetenciesManager
      competencies={competencies.map((competency) => ({
        id: competency.id,
        name: competency.name,
        definition: competency.definition,
        expectedBehavior: competency.expectedBehavior,
        category: competency.category,
        active: competency.active,
        global: competency.companyId === null,
        levels: competency.levels.map((l) => ({
          level: l.level, name: l.name, description: l.description,
        })),
        counts: competency._count,
      }))}
    />
  );
}
