import { z } from "zod";
import { audit } from "@/lib/audit";
import { apiUser, handler, ok, parseBody } from "@/lib/http";
import { prisma } from "@/lib/prisma";

type Ctx = { params: Promise<{ id: string }> };

const schema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().min(10).optional(),
  methodology: z.enum(["M10", "M20", "M70"]).optional(),
  icon: z.string().max(40).optional(),
  isCore: z.boolean().optional(),
  developmentType: z.enum(["CURRENT", "FUTURE", "BOTH"]).optional(),
  active: z.boolean().optional(),
  order: z.number().int().min(0).max(99).optional(),
});

export const PATCH = handler(async (request, ctx: Ctx) => {
  const user = await apiUser(["SUPERADMIN"]);
  const { id } = await ctx.params;
  const body = await parseBody(request, schema);
  await prisma.developmentTool.update({ where: { id }, data: body });
  await audit({
    userId: user.id, action: "tool.update", entity: "DevelopmentTool", entityId: id,
  });
  return ok({ ok: true });
});
