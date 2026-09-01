import { z } from "zod";
import { audit } from "@/lib/audit";
import { apiUser, handler, ok, parseBody, HttpError } from "@/lib/http";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  companyId: z.string().nullable().optional(),
  name: z.string().min(2),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, "Usa solo minúsculas, números y guiones."),
  description: z.string().min(10),
  methodology: z.enum(["M10", "M20", "M70"]),
  icon: z.string().max(40).default("sparkles"),
  isCore: z.boolean().default(true),
  developmentType: z.enum(["CURRENT", "FUTURE", "BOTH"]).default("BOTH"),
  order: z.number().int().min(0).max(99).default(99),
});

export const POST = handler(async (request) => {
  const user = await apiUser(["SUPERADMIN"]);
  const body = await parseBody(request, schema);
  const duplicate = await prisma.developmentTool.findFirst({
    where: { companyId: body.companyId ?? null, slug: body.slug },
  });
  if (duplicate) throw new HttpError(409, "Ya existe una herramienta con ese identificador.");

  const tool = await prisma.developmentTool.create({
    data: { ...body, companyId: body.companyId ?? null },
  });
  await audit({
    userId: user.id, action: "tool.create", entity: "DevelopmentTool", entityId: tool.id,
  });
  return ok({ tool }, 201);
});
