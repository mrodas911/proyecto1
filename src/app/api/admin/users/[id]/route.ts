import { z } from "zod";
import { hashPassword } from "@/lib/auth";
import { audit } from "@/lib/audit";
import { apiUser, handler, ok, parseBody, HttpError } from "@/lib/http";
import { prisma } from "@/lib/prisma";

type Ctx = { params: Promise<{ id: string }> };

const schema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  role: z.enum(["COMPANY_ADMIN", "LEADER", "EMPLOYEE"]).optional(),
  active: z.boolean().optional(),
  password: z
    .string()
    .min(10, "La contraseña debe tener al menos 10 caracteres.")
    .regex(/[A-Za-z]/, "Debe incluir letras.")
    .regex(/[0-9]/, "Debe incluir al menos un número.")
    .optional(),
});

export const PATCH = handler(async (request, ctx: Ctx) => {
  const actor = await apiUser(["SUPERADMIN", "COMPANY_ADMIN"]);
  const { id } = await ctx.params;
  const target = await prisma.user.findUnique({ where: { id } });
  if (!target) throw new HttpError(404, "El usuario no existe.");
  if (actor.role !== "SUPERADMIN" && target.companyId !== actor.companyId) {
    throw new HttpError(403, "No puedes gestionar usuarios de otra empresa.");
  }
  if (target.role === "SUPERADMIN" && actor.role !== "SUPERADMIN") {
    throw new HttpError(403, "No puedes modificar a un superadministrador.");
  }

  const body = await parseBody(request, schema);
  await prisma.user.update({
    where: { id },
    data: {
      ...(body.firstName !== undefined ? { firstName: body.firstName } : {}),
      ...(body.lastName !== undefined ? { lastName: body.lastName } : {}),
      ...(body.role !== undefined ? { role: body.role } : {}),
      ...(body.active !== undefined ? { active: body.active } : {}),
      ...(body.password ? { passwordHash: await hashPassword(body.password) } : {}),
    },
  });

  await audit({
    companyId: target.companyId, userId: actor.id,
    action: "user.update", entity: "User", entityId: id,
    metadata: { fields: Object.keys(body).filter((k) => k !== "password") },
  });
  return ok({ ok: true });
});
