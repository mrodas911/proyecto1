import { z } from "zod";
import { audit } from "@/lib/audit";
import { apiUser, handler, ok, parseBody, scopeCompany } from "@/lib/http";
import { planVisibilityFilter } from "@/lib/plans";
import { prisma } from "@/lib/prisma";
import { can } from "@/lib/rbac";
import { HttpError } from "@/lib/http";

const createSchema = z.object({
  companyId: z.string().optional(),
  /** Colaborador ya existente… */
  employeeId: z.string().optional(),
  /** …o alta de uno nuevo desde el propio asistente. */
  employee: z
    .object({
      firstName: z.string().min(1, "Escribe el nombre."),
      lastName: z.string().min(1, "Escribe el apellido."),
      email: z.string().email().optional().or(z.literal("")),
      area: z.string().optional(),
      positionTitle: z.string().optional(),
      managerName: z.string().optional(),
      location: z.string().optional(),
      businessUnit: z.string().optional(),
      hierarchyLevel: z.number().int().min(1).max(9).optional(),
      hiredAt: z.string().optional(),
    })
    .optional(),
  planDate: z.string().optional(),
});

export const GET = handler(async (request) => {
  const user = await apiUser();
  const url = new URL(request.url);
  const status = url.searchParams.get("status");
  const query = url.searchParams.get("q")?.trim();

  const plans = await prisma.developmentPlan.findMany({
    where: {
      AND: [
        planVisibilityFilter(user),
        status ? { status: status as never } : {},
        query
          ? {
              employee: {
                OR: [
                  { firstName: { contains: query, mode: "insensitive" } },
                  { lastName: { contains: query, mode: "insensitive" } },
                ],
              },
            }
          : {},
      ],
    },
    orderBy: { updatedAt: "desc" },
    include: { employee: true },
  });

  return ok({ plans });
});

export const POST = handler(async (request) => {
  const user = await apiUser();
  if (!can(user.role, "plans.create")) {
    throw new HttpError(403, "No tienes permisos para crear planes.");
  }
  const body = await parseBody(request, createSchema);
  const companyId = scopeCompany(user, body.companyId);

  let employeeId = body.employeeId;
  if (employeeId) {
    const employee = await prisma.employee.findFirst({ where: { id: employeeId, companyId } });
    if (!employee) throw new HttpError(404, "El colaborador no existe en esta empresa.");
  } else if (body.employee) {
    const created = await prisma.employee.create({
      data: {
        companyId,
        firstName: body.employee.firstName,
        lastName: body.employee.lastName,
        email: body.employee.email || null,
        area: body.employee.area || null,
        positionTitle: body.employee.positionTitle || null,
        managerName: body.employee.managerName || null,
        location: body.employee.location || null,
        businessUnit: body.employee.businessUnit || null,
        hierarchyLevel: body.employee.hierarchyLevel ?? null,
        hiredAt: body.employee.hiredAt ? new Date(body.employee.hiredAt) : null,
        leaderUserId: user.role === "LEADER" ? user.id : null,
      },
    });
    employeeId = created.id;
  } else {
    throw new HttpError(422, "Indica un colaborador existente o los datos de uno nuevo.");
  }

  const plan = await prisma.developmentPlan.create({
    data: {
      companyId,
      employeeId,
      authorUserId: user.id,
      planDate: body.planDate ? new Date(body.planDate) : new Date(),
      wizardStep: 2,
    },
  });

  await audit({
    companyId, userId: user.id,
    action: "plan.create", entity: "DevelopmentPlan", entityId: plan.id,
  });

  return ok({ plan }, 201);
});
