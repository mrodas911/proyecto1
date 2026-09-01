import { z } from "zod";
import { audit } from "@/lib/audit";
import { apiUser, handler, ok, parseBody } from "@/lib/http";
import { getRules, saveRules } from "@/lib/settings";

const schema = z.object({
  companyId: z.string().nullable().optional(),
  toolsAllowedCurrentRole: z.number().int().min(1).max(50).optional(),
  toolsAllowedFutureRole: z.number().int().min(1).max(50).optional(),
  maxCompetencies: z.number().int().min(1).max(10).optional(),
  minCompetencies: z.number().int().min(1).max(10).optional(),
  minActionsPer10: z.number().int().min(0).max(10).optional(),
  minActionsPer20: z.number().int().min(0).max(10).optional(),
  minActionsPer70: z.number().int().min(0).max(10).optional(),
  completionThreshold: z.number().int().min(0).max(100).optional(),
});

export const GET = handler(async (request) => {
  await apiUser(["SUPERADMIN", "COMPANY_ADMIN"]);
  const url = new URL(request.url);
  const companyId = url.searchParams.get("companyId");
  return ok({ rules: await getRules(companyId) });
});

export const PUT = handler(async (request) => {
  const user = await apiUser(["SUPERADMIN"]);
  const { companyId, ...patch } = await parseBody(request, schema);
  const rules = await saveRules(companyId ?? null, patch);
  await audit({
    companyId: companyId ?? null, userId: user.id,
    action: "rules.update", entity: "CompanySetting", metadata: patch,
  });
  return ok({ rules });
});
