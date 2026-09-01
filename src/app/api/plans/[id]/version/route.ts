import { audit } from "@/lib/audit";
import { apiUser, handler, ok, HttpError } from "@/lib/http";
import { getPlanForUser } from "@/lib/plans";
import { createNewVersion } from "@/lib/plan-service";
import { can } from "@/lib/rbac";

type Ctx = { params: Promise<{ id: string }> };

/** Crea una versión editable a partir de un plan ya finalizado. */
export const POST = handler(async (_request, ctx: Ctx) => {
  const user = await apiUser();
  if (!can(user.role, "plans.edit")) {
    throw new HttpError(403, "No tienes permisos para modificar planes.");
  }
  const { id } = await ctx.params;
  const plan = await getPlanForUser(id, user);
  if (plan.status === "DRAFT") {
    throw new HttpError(409, "Este plan todavía es un borrador: puedes editarlo directamente.");
  }

  const newPlanId = await createNewVersion(plan.id, user.id);
  await audit({
    companyId: plan.companyId, userId: user.id,
    action: "plan.new_version", entity: "DevelopmentPlan", entityId: newPlanId,
    metadata: { from: plan.id },
  });

  return ok({ planId: newPlanId }, 201);
});
