import { z } from "zod";
import { hashPassword } from "@/lib/auth";
import { audit } from "@/lib/audit";
import { apiUser, handler, ok, parseBody, scopeCompany, HttpError } from "@/lib/http";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  companyId: z.string().optional(),
  email: z.string().email("Correo no válido."),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  role: z.enum(["COMPANY_ADMIN", "LEADER", "EMPLOYEE"]),
  password: z
    .string()
    .min(10, "La contraseña debe tener al menos 10 caracteres.")
    .regex(/[A-Za-z]/, "Debe incluir letras.")
    .regex(/[0-9]/, "Debe incluir al menos un número."),
  /** Vincula la cuenta con una ficha de colaborador (rol EMPLOYEE). */
  employeeId: z.string().nullable().optional(),
});

export const GET = handler(async (request) => {
  const user = await apiUser(["SUPERADMIN", "COMPANY_ADMIN"]);
  const url = new URL(request.url);
  const companyId = scopeCompany(user, url.searchParams.get("companyId"));
  const users = await prisma.user.findMany({
    where: { companyId },
    orderBy: [{ role: "asc" }, { firstName: "asc" }],
    select: {
      id: true, email: true, firstName: true, lastName: true,
      role: true, active: true, lastLoginAt: true, employeeId: true,
    },
  });
  return ok({ users });
});

export const POST = handler(async (request) => {
  const user = await apiUser(["SUPERADMIN", "COMPANY_ADMIN"]);
  const body = await parseBody(request, schema);
  const companyId = scopeCompany(user, body.companyId);

  const company = await prisma.company.findUniqueOrThrow({
    where: { id: companyId },
    include: { _count: { select: { users: true } } },
  });
  // El número de usuarios permitidos es parte del plan comercial de la empresa.
  if (company._count.users >= company.maxUsers) {
    throw new HttpError(
      409,
      `Esta empresa tiene ${company.maxUsers} usuarios permitidos y ya los ha utilizado.`
    );
  }

  const existing = await prisma.user.findUnique({
    where: { email: body.email.toLowerCase() },
  });
  if (existing) throw new HttpError(409, "Ya existe un usuario con ese correo.");

  const created = await prisma.user.create({
    data: {
      companyId,
      email: body.email.toLowerCase(),
      firstName: body.firstName,
      lastName: body.lastName,
      role: body.role,
      passwordHash: await hashPassword(body.password),
      employeeId: body.employeeId || null,
    },
    select: { id: true, email: true, role: true },
  });

  await audit({
    companyId, userId: user.id,
    action: "user.create", entity: "User", entityId: created.id,
    metadata: { role: created.role },
  });
  return ok({ user: created }, 201);
});
