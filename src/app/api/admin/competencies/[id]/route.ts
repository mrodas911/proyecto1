import { z } from "zod";
import { audit } from "@/lib/audit";
import { apiUser, handler, ok, parseBody, HttpError } from "@/lib/http";
import { prisma } from "@/lib/prisma";

type Ctx = { params: Promise<{ id: string }> };

const schema = z.object({
  name: z.string().min(2).optional(),
  definition: z.string().min(10).optional(),
  expectedBehavior: z.string().min(10).optional(),
  category: z
    .enum(["LEADERSHIP", "BUSINESS", "INTERPERSONAL", "STRATEGIC", "EXECUTION"])
    .optional(),
  active: z.boolean().optional(),
  order: z.number().int().min(0).max(999).optional(),
  levels: z
    .array(z.object({ level: z.number().int().min(1).max(5), name: z.string(), description: z.string() }))
    .optional(),
});

export const PATCH = handler(async (request, ctx: Ctx) => {
  const user = await apiUser(["SUPERADMIN"]);
  const { id } = await ctx.params;
  const { levels, ...rest } = await parseBody(request, schema);

  await prisma.competency.update({ where: { id }, data: rest });
  for (const level of levels ?? []) {
    await prisma.competencyLevel.upsert({
      where: { competencyId_level: { competencyId: id, level: level.level } },
      create: { competencyId: id, ...level },
      update: { name: level.name, description: level.description },
    });
  }

  await audit({ userId: user.id, action: "competency.update", entity: "Competency", entityId: id });
  return ok({ ok: true });
});

/**
 * Desactiva la competencia en lugar de borrarla si ya se usó en algún plan:
 * el histórico debe seguir siendo legible.
 */
export const DELETE = handler(async (_request, ctx: Ctx) => {
  const user = await apiUser(["SUPERADMIN"]);
  const { id } = await ctx.params;
  const inUse = await prisma.planCompetency.count({ where: { competencyId: id } });

  if (inUse > 0) {
    await prisma.competency.update({ where: { id }, data: { active: false } });
    await audit({
      userId: user.id, action: "competency.deactivate", entity: "Competency", entityId: id,
    });
    return ok({ ok: true, deactivated: true, plansAffected: inUse });
  }

  await prisma.competency.delete({ where: { id } }).catch(() => {
    throw new HttpError(409, "No se pudo eliminar la competencia.");
  });
  await audit({ userId: user.id, action: "competency.delete", entity: "Competency", entityId: id });
  return ok({ ok: true, deactivated: false });
});
