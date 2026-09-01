import { z } from "zod";
import { audit } from "@/lib/audit";
import { apiUser, handler, ok, parseBody } from "@/lib/http";
import { prisma } from "@/lib/prisma";

/**
 * Alta de actividades desde el panel. Es el punto clave del producto: el
 * catálogo crece sin tocar el código y, en cuanto se guarda, la actividad ya
 * puede aparecer en las recomendaciones.
 */
const schema = z.object({
  companyId: z.string().nullable().optional(),
  title: z.string().min(5, "Escribe el título de la actividad."),
  description: z.string().min(10, "Describe en qué consiste."),
  benefit: z.string().min(10, "Explica para qué sirve."),
  methodology: z.enum(["M10", "M20", "M70"]),
  toolId: z.string().nullable().optional(),
  difficulty: z.enum(["BASIC", "INTERMEDIATE", "ADVANCED"]).default("INTERMEDIATE"),
  developmentType: z.enum(["CURRENT", "FUTURE", "BOTH"]).default("BOTH"),
  duration: z.string().min(2, "Indica una duración estimada."),
  suggestedIndicator: z.string().nullable().optional(),
  suggestedEvidence: z.string().nullable().optional(),
  suggestedResponsible: z
    .enum(["EMPLOYEE", "LEADER", "MENTOR", "HR", "OTHER"])
    .default("EMPLOYEE"),
  minPerformance: z.enum(["LOW", "MEDIUM", "HIGH"]).nullable().optional(),
  minPotential: z.enum(["LOW", "MEDIUM", "HIGH"]).nullable().optional(),
  competencyIds: z.array(z.string()).min(1, "Relaciona al menos una competencia."),
});

export const GET = handler(async (request) => {
  await apiUser(["SUPERADMIN"]);
  const url = new URL(request.url);
  const query = url.searchParams.get("q")?.trim();
  const activities = await prisma.activity.findMany({
    where: query ? { title: { contains: query, mode: "insensitive" } } : {},
    orderBy: [{ methodology: "asc" }, { title: "asc" }],
    include: { tool: true, competencies: { include: { competency: true } } },
    take: 300,
  });
  return ok({ activities });
});

export const POST = handler(async (request) => {
  const user = await apiUser(["SUPERADMIN"]);
  const { competencyIds, ...body } = await parseBody(request, schema);

  const activity = await prisma.activity.create({
    data: {
      ...body,
      companyId: body.companyId ?? null,
      toolId: body.toolId || null,
      suggestedIndicator: body.suggestedIndicator || null,
      suggestedEvidence: body.suggestedEvidence || null,
      minPerformance: body.minPerformance ?? null,
      minPotential: body.minPotential ?? null,
      competencies: {
        // La primera competencia listada es la principal y pesa más al recomendar.
        create: competencyIds.map((competencyId, index) => ({
          competencyId,
          weight: Math.max(40, 100 - index * 15),
        })),
      },
    },
  });

  await audit({
    userId: user.id, action: "activity.create", entity: "Activity", entityId: activity.id,
  });
  return ok({ activity }, 201);
});
