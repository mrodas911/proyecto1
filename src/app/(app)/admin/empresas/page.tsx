import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { DEFAULT_RULES, getRules } from "@/lib/settings";
import { CompaniesManager } from "@/components/admin/companies-manager";

export const metadata: Metadata = { title: "Empresas" };
export const dynamic = "force-dynamic";

export default async function AdminCompaniesPage() {
  const companies = await prisma.company.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { users: true, employees: true, plans: true } },
      accessCodes: { orderBy: { createdAt: "desc" }, take: 5 },
    },
  });

  const withRules = await Promise.all(
    companies.map(async (company) => ({
      id: company.id,
      name: company.name,
      slug: company.slug,
      logoUrl: company.logoUrl ?? "",
      primaryColor: company.primaryColor ?? "#1F5F5B",
      pdfCoverNote: company.pdfCoverNote ?? "",
      maxUsers: company.maxUsers,
      commercialPlan: company.commercialPlan,
      active: company.active,
      counts: company._count,
      codes: company.accessCodes.map((code) => ({
        id: code.id,
        code: code.code,
        role: code.role,
        uses: code.uses,
        maxUses: code.maxUses,
        expiresAt: code.expiresAt?.toISOString() ?? null,
      })),
      rules: await getRules(company.id),
    }))
  );

  return <CompaniesManager companies={withRules} defaults={DEFAULT_RULES} />;
}
