import { audit } from "@/lib/audit";
import { apiUser, handler, ok, HttpError } from "@/lib/http";
import { getEditablePlan } from "@/lib/plans";
import { validatePlan } from "@/lib/plan-validation";
import { prisma } from "@/lib/prisma";
import { getRules } from "@/lib/settings";

type Ctx = { params: Promise<{ id: string }> };

export const POST = handler(async (_request, ctx: Ctx) => {
  const user = await apiUser();
  const { id } = await ctx.params;
  const plan = await getEditablePlan(id, user);
  const rules = await getRules(plan.companyId);
  const report = validatePlan(plan, rules);

  if (!report.canGenerate) {
    throw new HttpError(
      422,
      `Tu plan está ${report.completion}% completo. Necesitas al menos ${rules.completionThreshold}% para generarlo.`
    );
  }

  await prisma.developmentPlan.update({
    where: { id: plan.id },
    data: {
      status: "FINALIZED",
      completion: report.completion,
      finalizedAt: new Date(),
      wizardStep: 9,
    },
  });

  await audit({
    companyId: plan.companyId, userId: user.id,
    action: "plan.finalize", entity: "DevelopmentPlan", entityId: plan.id,
    metadata: { completion: report.completion, version: plan.version },
  });

  return ok({ ok: true, completion: report.completion });
});
