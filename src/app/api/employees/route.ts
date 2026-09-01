import { z } from "zod";
import { apiUser, handler, ok, parseBody, scopeCompany, HttpError } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { can } from "@/lib/rbac";

const createSchema = z.object({
  companyId: z.string().optional(),
  firstName: z.string().min(1, "Escribe el nombre."),
  lastName: z.string().min(1, "Escribe el apellido."),
  email: z.string().email("Correo no válido.").optional().or(z.literal("")),
  area: z.string().optional(),
  positionTitle: z.string().optional(),
  managerName: z.string().optional(),
  location: z.string().optional(),
  businessUnit: z.string().optional(),
  hierarchyLevel: z.number().int().min(1).max(9).optional(),
  hiredAt: z.string().optional(),
});

export const GET = handler(async (request) => {
  const user = await apiUser();
  const url = new URL(request.url);
  const query = url.searchParams.get("q")?.trim();
  const companyId = scopeCompany(user, url.searchParams.get("companyId"));

  const employees = await prisma.employee.findMany({
    where: {
      companyId,
      active: true,
      ...(user.role === "LEADER" ? { OR: [{ leaderUserId: user.id }, { leaderUserId: null }] } : {}),
      ...(query
        ? {
            OR: [
              { firstName: { contains: query, mode: "insensitive" as const } },
              { lastName: { contains: query, mode: "insensitive" as const } },
              { positionTitle: { contains: query, mode: "insensitive" as const } },
            ],
          }
        : {}),
    },
    orderBy: [{ firstName: "asc" }],
    include: { _count: { select: { plans: true } } },
  });

  return ok({ employees });
});

export const POST = handler(async (request) => {
  const user = await apiUser();
  if (!can(user.role, "employees.manage")) {
    throw new HttpError(403, "No tienes permisos para crear colaboradores.");
  }
  const body = await parseBody(request, createSchema);
  const companyId = scopeCompany(user, body.companyId);

  const employee = await prisma.employee.create({
    data: {
      companyId,
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email || null,
      area: body.area || null,
      positionTitle: body.positionTitle || null,
      managerName: body.managerName || null,
      location: body.location || null,
      businessUnit: body.businessUnit || null,
      hierarchyLevel: body.hierarchyLevel ?? null,
      hiredAt: body.hiredAt ? new Date(body.hiredAt) : null,
      leaderUserId: user.role === "LEADER" ? user.id : null,
    },
  });

  return ok({ employee }, 201);
});
