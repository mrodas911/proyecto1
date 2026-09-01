import crypto from "node:crypto";
import { z } from "zod";
import { audit } from "@/lib/audit";
import { apiUser, handler, ok, parseBody } from "@/lib/http";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  companyId: z.string().min(1),
  role: z.enum(["COMPANY_ADMIN", "LEADER", "EMPLOYEE"]).default("LEADER"),
  maxUses: z.number().int().min(1).max(500).default(10),
  expiresInDays: z.number().int().min(1).max(730).default(365),
});

/** Código legible para dictar por teléfono o pegar en un correo. */
function generateCode(prefix: string): string {
  const random = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `${prefix.slice(0, 6).toUpperCase()}-${random}`;
}

export const POST = handler(async (request) => {
  const user = await apiUser(["SUPERADMIN"]);
  const body = await parseBody(request, schema);
  const company = await prisma.company.findUniqueOrThrow({ where: { id: body.companyId } });

  const code = await prisma.accessCode.create({
    data: {
      companyId: company.id,
      code: generateCode(company.slug.replace(/-/g, "")),
      role: body.role,
      maxUses: body.maxUses,
      expiresAt: new Date(Date.now() + body.expiresInDays * 86_400_000),
    },
  });

  await audit({
    companyId: company.id, userId: user.id,
    action: "access_code.create", entity: "AccessCode", entityId: code.id,
  });
  return ok({ code }, 201);
});
