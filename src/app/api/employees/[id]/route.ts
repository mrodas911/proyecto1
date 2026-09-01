import { z } from "zod";
import { apiUser, handler, ok, parseBody, HttpError } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { can } from "@/lib/rbac";

type Ctx = { params: Promise<{ id: string }> };

const schema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  email: z.string().email().nullable().optional().or(z.literal("")),
  area: z.string().nullable().optional(),
  positionTitle: z.string().nullable().optional(),
  managerName: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  businessUnit: z.string().nullable().optional(),
  hierarchyLevel: z.number().int().min(1).max(9).nullable().optional(),
  hiredAt: z.string().nullable().optional(),
  active: z.boolean().optional(),
});

export const PATCH = handler(async (request, ctx: Ctx) => {
  const user = await apiUser();
  if (!can(user.role, "employees.manage")) {
    throw new HttpError(403, "No tienes permisos para editar colaboradores.");
  }
  const { id } = await ctx.params;
  const employee = await prisma.employee.findUnique({ where: { id } });
  if (!employee) throw new HttpError(404, "El colaborador no existe.");
  if (user.role !== "SUPERADMIN" && employee.companyId !== user.companyId) {
    throw new HttpError(403, "No puedes editar colaboradores de otra empresa.");
  }

  const body = await parseBody(request, schema);
  await prisma.employee.update({
    where: { id },
    data: {
      ...(body.firstName !== undefined ? { firstName: body.firstName } : {}),
      ...(body.lastName !== undefined ? { lastName: body.lastName } : {}),
      ...(body.email !== undefined ? { email: body.email || null } : {}),
      ...(body.area !== undefined ? { area: body.area || null } : {}),
      ...(body.positionTitle !== undefined ? { positionTitle: body.positionTitle || null } : {}),
      ...(body.managerName !== undefined ? { managerName: body.managerName || null } : {}),
      ...(body.location !== undefined ? { location: body.location || null } : {}),
      ...(body.businessUnit !== undefined ? { businessUnit: body.businessUnit || null } : {}),
      ...(body.hierarchyLevel !== undefined ? { hierarchyLevel: body.hierarchyLevel } : {}),
      ...(body.hiredAt !== undefined ? { hiredAt: body.hiredAt ? new Date(body.hiredAt) : null } : {}),
      ...(body.active !== undefined ? { active: body.active } : {}),
    },
  });

  return ok({ ok: true });
});
