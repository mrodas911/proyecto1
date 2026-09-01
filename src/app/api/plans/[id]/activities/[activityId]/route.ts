import { z } from "zod";
import { apiUser, handler, ok, parseBody, HttpError } from "@/lib/http";
import { getEditablePlan } from "@/lib/plans";
import { recomputeCompletion, toolUsage } from "@/lib/plan-service";
import { prisma } from "@/lib/prisma";
import { getRules } from "@/lib/settings";

type Ctx = { params: Promise<{ id: string; activityId: string }> };

const nullableDate = z.string().nullable().optional();

const schema = z.object({
  title: z.string().min(1).max(300).optional(),
  objective: z.string().max(1000).nullable().optional(),
  responsibleType: z.enum(["EMPLOYEE", "LEADER", "MENTOR", "HR", "OTHER"]).optional(),
  responsibleName: z.string().max(200).nullable().optional(),
  startDate: nullableDate,
  targetDate: nullableDate,
  frequency: z.string().max(200).nullable().optional(),
  successIndicator: z.string().max(500).nullable().optional(),
  expectedEvidence: z.string().max(500).nullable().optional(),
  notes: z.string().max(1000).nullable().optional(),
});

function findActivity(plan: Awaited<ReturnType<typeof getEditablePlan>>, activityId: string) {
  for (const competency of plan.competencies) {
    const found = competency.activities.find((a) => a.id === activityId);
    if (found) return found;
  }
  throw new HttpError(404, "Esa acción no pertenece al plan.");
}

export const PATCH = handler(async (request, ctx: Ctx) => {
  const user = await apiUser();
  const { id, activityId } = await ctx.params;
  const plan = await getEditablePlan(id, user);
  const activity = findActivity(plan, activityId);
  const body = await parseBody(request, schema);

  const start = body.startDate !== undefined ? toDate(body.startDate) : undefined;
  const target = body.targetDate !== undefined ? toDate(body.targetDate) : undefined;

  const nextStart = start !== undefined ? start : activity.startDate;
  const nextTarget = target !== undefined ? target : activity.targetDate;
  if (nextStart && nextTarget && nextTarget < nextStart) {
    throw new HttpError(422, "La fecha objetivo no puede ser anterior a la de inicio.");
  }

  await prisma.planActivity.update({
    where: { id: activity.id },
    data: {
      ...(body.title !== undefined ? { title: body.title } : {}),
      ...(body.objective !== undefined ? { objective: body.objective } : {}),
      ...(body.responsibleType !== undefined ? { responsibleType: body.responsibleType } : {}),
      ...(body.responsibleName !== undefined ? { responsibleName: body.responsibleName } : {}),
      ...(start !== undefined ? { startDate: start } : {}),
      ...(target !== undefined ? { targetDate: target } : {}),
      ...(body.frequency !== undefined ? { frequency: body.frequency } : {}),
      ...(body.successIndicator !== undefined ? { successIndicator: body.successIndicator } : {}),
      ...(body.expectedEvidence !== undefined ? { expectedEvidence: body.expectedEvidence } : {}),
      ...(body.notes !== undefined ? { notes: body.notes } : {}),
    },
  });

  const completion = await recomputeCompletion(plan.id);
  return ok({ ok: true, completion });
});

export const DELETE = handler(async (_request, ctx: Ctx) => {
  const user = await apiUser();
  const { id, activityId } = await ctx.params;
  const plan = await getEditablePlan(id, user);
  const activity = findActivity(plan, activityId);

  await prisma.planActivity.delete({ where: { id: activity.id } });
  const completion = await recomputeCompletion(plan.id);
  const rules = await getRules(plan.companyId);
  const refreshed = await getEditablePlan(id, user);
  return ok({ ok: true, completion, usage: toolUsage(refreshed, rules) });
});

function toDate(value: string | null | undefined): Date | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) throw new HttpError(422, "La fecha no es válida.");
  return date;
}
