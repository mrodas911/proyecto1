import { apiUser, handler, ok } from "@/lib/http";
import { prisma } from "@/lib/prisma";

/** Catálogo de competencias visible para la empresa del usuario. */
export const GET = handler(async (request) => {
  const user = await apiUser();
  const url = new URL(request.url);
  const query = url.searchParams.get("q")?.trim();
  const category = url.searchParams.get("category");

  const competencies = await prisma.competency.findMany({
    where: {
      active: true,
      OR: [{ companyId: null }, { companyId: user.companyId ?? "__none__" }],
      ...(category ? { category: category as never } : {}),
      ...(query ? { name: { contains: query, mode: "insensitive" as const } } : {}),
    },
    orderBy: [{ order: "asc" }, { name: "asc" }],
    include: { levels: { orderBy: { level: "asc" } } },
  });

  return ok({ competencies });
});
