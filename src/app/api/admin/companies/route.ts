import { z } from "zod";
import { audit } from "@/lib/audit";
import { apiUser, handler, ok, parseBody } from "@/lib/http";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().min(2, "El nombre es demasiado corto."),
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9-]+$/, "Usa solo minúsculas, números y guiones."),
  logoUrl: z.string().url().nullable().optional().or(z.literal("")),
  primaryColor: z.string().max(20).optional(),
  pdfCoverNote: z.string().max(200).nullable().optional(),
  maxUsers: z.number().int().min(1).max(10_000).default(25),
  commercialPlan: z.string().max(40).default("STARTER"),
});

export const GET = handler(async () => {
  await apiUser(["SUPERADMIN"]);
  const companies = await prisma.company.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { users: true, employees: true, plans: true, accessCodes: true } },
    },
  });
  return ok({ companies });
});

export const POST = handler(async (request) => {
  const user = await apiUser(["SUPERADMIN"]);
  const body = await parseBody(request, schema);
  const company = await prisma.company.create({
    data: {
      name: body.name,
      slug: body.slug,
      logoUrl: body.logoUrl || null,
      primaryColor: body.primaryColor || "#1F5F5B",
      pdfCoverNote: body.pdfCoverNote || null,
      maxUsers: body.maxUsers,
      commercialPlan: body.commercialPlan,
    },
  });
  await audit({
    companyId: company.id, userId: user.id,
    action: "company.create", entity: "Company", entityId: company.id,
  });
  return ok({ company }, 201);
});
