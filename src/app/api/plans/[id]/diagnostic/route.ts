import { z } from "zod";
import { audit } from "@/lib/audit";
import { apiUser, handler, ok, parseBody, HttpError } from "@/lib/http";
import { nineBoxCell } from "@/lib/constants";
import { getEditablePlan } from "@/lib/plans";
import { recomputeCompletion } from "@/lib/plan-service";
import { prisma } from "@/lib/prisma";
import { can } from "@/lib/rbac";

type Ctx = { params: Promise<{ id: string }> };

const schema = z.object({
  source: z.enum(["EXISTING", "MANUAL"]).default("MANUAL"),
  performance: z.enum(["LOW", "MEDIUM", "HIGH"]),
  potential: z.enum(["LOW", "MEDIUM", "HIGH"]),
  aspiration: z
    .enum(["GROW_LEADERSHIP", "GROW_SPECIALIST", "LATERAL_MOVE", "CONSOLIDATE", "UNDEFINED"])
    .default("UNDEFINED"),
  aspirationNote: z.string().max(500).nullable().optional(),
  notes: z.string().max(2000).nullable().optional(),
});

/** El diagnóstico es información confidencial: exige permiso explícito. */
export const PUT = handler(async (request, ctx: Ctx) => {
  const user = await apiUser();
  if (!can(user.role, "diagnostic.write")) {
    throw new HttpError(403, "No tienes permisos para registrar el diagnóstico.");
  }
  const { id } = await ctx.params;
  const plan = await getEditablePlan(id, user);
  const body = await parseBody(request, schema);
  const nineBox = nineBoxCell(body.performance, body.potential);

  const data = {
    companyId: plan.companyId,
    employeeId: plan.employeeId,
    source: body.source,
    performance: body.performance,
    potential: body.potential,
    aspiration: body.aspiration,
    aspirationNote: body.aspirationNote ?? null,
    notes: body.notes ?? null,
    nineBox,
  };

  if (plan.diagnostic) {
    await prisma.diagnostic.update({ where: { id: plan.diagnostic.id }, data });
  } else {
    await prisma.diagnostic.create({ data: { ...data, planId: plan.id } });
  }

  await audit({
    companyId: plan.companyId, userId: user.id,
    action: "plan.diagnostic", entity: "DevelopmentPlan", entityId: plan.id,
    metadata: { nineBox },
  });

  const completion = await recomputeCompletion(plan.id);
  return ok({ ok: true, nineBox, completion });
});
