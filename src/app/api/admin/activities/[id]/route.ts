import { z } from "zod";
import { audit } from "@/lib/audit";
import { apiUser, handler, ok, parseBody } from "@/lib/http";
import { prisma } from "@/lib/prisma";

type Ctx = { params: Promise<{ id: string }> };

const schema = z.object({
  title: z.string().min(5).optional(),
  description: z.string().min(10).optional(),
  benefit: z.string().min(10).optional(),
  methodology: z.enum(["M10", "M20", "M70"]).optional(),
  toolId: z.string().nullable().optional(),
  difficulty: z.enum(["BASIC", "INTERMEDIATE", "ADVANCED"]).optional(),
  developmentType: z.enum(["CURRENT", "FUTURE", "BOTH"]).optional(),
  duration: z.string().min(2).optional(),
  suggestedIndicator: z.string().nullable().optional(),
  suggestedEvidence: z.string().nullable().optional(),
  suggestedResponsible: z.enum(["EMPLOYEE", "LEADER", "MENTOR", "HR", "OTHER"]).optional(),
  minPerformance: z.enum(["LOW", "MEDIUM", "HIGH"]).nullable().optional(),
  minPotential: z.enum(["LOW", "MEDIUM", "HIGH"]).nullable().optional(),
  active: z.boolean().optional(),
  competencyIds: z.array(z.string()).min(1).optional(),
});

export const PATCH = handler(async (request, ctx: Ctx) => {
  const user = await apiUser(["SUPERADMIN"]);
  const { id } = await ctx.params;
  const { competencyIds, toolId, ...rest } = await parseBody(request, schema);

  await prisma.activity.update({
    where: { id },
    data: { ...rest, ...(toolId !== undefined ? { toolId: toolId || null } : {}) },
  });

  if (competencyIds) {
    await prisma.activityCompetency.deleteMany({ where: { activityId: id } });
    await prisma.activityCompetency.createMany({
      data: competencyIds.map((competencyId, index) => ({
        activityId: id,
        competencyId,
        weight: Math.max(40, 100 - index * 15),
      })),
    });
  }

  await audit({ userId: user.id, action: "activity.update", entity: "Activity", entityId: id });
  return ok({ ok: true });
});

/** Se desactiva si ya forma parte de algún plan, para no romper el histórico. */
export const DELETE = handler(async (_request, ctx: Ctx) => {
  const user = await apiUser(["SUPERADMIN"]);
  const { id } = await ctx.params;
  const inUse = await prisma.planActivity.count({ where: { activityId: id } });

  if (inUse > 0) {
    await prisma.activity.update({ where: { id }, data: { active: false } });
    await audit({
      userId: user.id, action: "activity.deactivate", entity: "Activity", entityId: id,
    });
    return ok({ ok: true, deactivated: true, plansAffected: inUse });
  }

  await prisma.activity.delete({ where: { id } });
  await audit({ userId: user.id, action: "activity.delete", entity: "Activity", entityId: id });
  return ok({ ok: true, deactivated: false });
});
