import { z } from "zod";
import { audit } from "@/lib/audit";
import { apiUser, handler, ok, parseBody, HttpError } from "@/lib/http";
import { prisma } from "@/lib/prisma";

const levelSchema = z.object({
  level: z.number().int().min(1).max(5),
  name: z.string().min(1),
  description: z.string().min(1),
});

const schema = z.object({
  companyId: z.string().nullable().optional(),
  name: z.string().min(2, "El nombre es demasiado corto."),
  definition: z.string().min(10, "Escribe una definición."),
  expectedBehavior: z.string().min(10, "Describe el comportamiento esperado."),
  category: z.enum(["LEADERSHIP", "BUSINESS", "INTERPERSONAL", "STRATEGIC", "EXECUTION"]),
  levels: z.array(levelSchema).length(5).optional(),
});

const DEFAULT_LEVEL_NAMES = ["Inicial", "En desarrollo", "Competente", "Avanzado", "Referente"];

export const POST = handler(async (request) => {
  const user = await apiUser(["SUPERADMIN"]);
  const body = await parseBody(request, schema);

  const duplicate = await prisma.competency.findFirst({
    where: { companyId: body.companyId ?? null, name: body.name },
  });
  if (duplicate) throw new HttpError(409, "Ya existe una competencia con ese nombre.");

  const levels =
    body.levels ??
    DEFAULT_LEVEL_NAMES.map((name, index) => ({
      level: index + 1,
      name,
      description: `Nivel ${index + 1} de ${body.name}. Edita esta descripción desde el panel.`,
    }));

  const competency = await prisma.competency.create({
    data: {
      companyId: body.companyId ?? null,
      name: body.name,
      definition: body.definition,
      expectedBehavior: body.expectedBehavior,
      category: body.category,
      levels: { create: levels },
    },
  });

  await audit({
    companyId: body.companyId ?? null, userId: user.id,
    action: "competency.create", entity: "Competency", entityId: competency.id,
  });
  return ok({ competency }, 201);
});
