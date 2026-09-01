import { z } from "zod";
import { audit } from "@/lib/audit";
import { apiUser, handler, ok, parseBody } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { saveRules } from "@/lib/settings";

type Ctx = { params: Promise<{ id: string }> };

const schema = z.object({
  name: z.string().min(2).optional(),
  logoUrl: z.string().url().nullable().optional().or(z.literal("")),
  primaryColor: z.string().max(20).optional(),
  pdfCoverNote: z.string().max(200).nullable().optional(),
  maxUsers: z.number().int().min(1).max(10_000).optional(),
  commercialPlan: z.string().max(40).optional(),
  active: z.boolean().optional(),
  /** Reglas específicas de esta empresa (sobrescriben las globales). */
  rules: z.record(z.string(), z.number().int().min(0).max(100)).optional(),
});

export const PATCH = handler(async (request, ctx: Ctx) => {
  const user = await apiUser(["SUPERADMIN"]);
  const { id } = await ctx.params;
  const body = await parseBody(request, schema);

  const { rules, logoUrl, pdfCoverNote, ...rest } = body;
  await prisma.company.update({
    where: { id },
    data: {
      ...rest,
      ...(logoUrl !== undefined ? { logoUrl: logoUrl || null } : {}),
      ...(pdfCoverNote !== undefined ? { pdfCoverNote: pdfCoverNote || null } : {}),
    },
  });
  if (rules) await saveRules(id, rules as never);

  await audit({
    companyId: id, userId: user.id,
    action: "company.update", entity: "Company", entityId: id, metadata: body,
  });
  return ok({ ok: true });
});
