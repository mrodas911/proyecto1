import { apiUser, handler, ok } from "@/lib/http";
import { prisma } from "@/lib/prisma";

/** Buscador de la biblioteca: por texto, etapa, competencia, nivel y tipo. */
export const GET = handler(async (request) => {
  const user = await apiUser();
  const url = new URL(request.url);
  const query = url.searchParams.get("q")?.trim();
  const methodology = url.searchParams.get("methodology");
  const competencyId = url.searchParams.get("competencyId");
  const difficulty = url.searchParams.get("difficulty");
  const developmentType = url.searchParams.get("developmentType");
  const toolId = url.searchParams.get("toolId");

  const activities = await prisma.activity.findMany({
    where: {
      active: true,
      OR: [{ companyId: null }, { companyId: user.companyId ?? "__none__" }],
      ...(methodology ? { methodology: methodology as never } : {}),
      ...(difficulty ? { difficulty: difficulty as never } : {}),
      ...(toolId ? { toolId } : {}),
      ...(developmentType
        ? { developmentType: { in: [developmentType as never, "BOTH" as never] } }
        : {}),
      ...(competencyId ? { competencies: { some: { competencyId } } } : {}),
      ...(query
        ? {
            AND: [
              {
                OR: [
                  { title: { contains: query, mode: "insensitive" as const } },
                  { description: { contains: query, mode: "insensitive" as const } },
                  { benefit: { contains: query, mode: "insensitive" as const } },
                ],
              },
            ],
          }
        : {}),
    },
    orderBy: [{ methodology: "asc" }, { title: "asc" }],
    include: {
      tool: true,
      competencies: { include: { competency: { select: { id: true, name: true } } } },
    },
    take: 200,
  });

  return ok({ activities });
});
