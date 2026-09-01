import type { Metadata } from "next";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/ui";
import { UsersManager } from "@/components/admin/users-manager";

export const metadata: Metadata = { title: "Usuarios" };
export const dynamic = "force-dynamic";

/** Gestión de usuarios de la propia empresa (Talento Humano). */
export default async function CompanyUsersPage() {
  const user = await requireRole("COMPANY_ADMIN");
  const companyId = user.companyId!;

  const [company, users, employees] = await Promise.all([
    prisma.company.findUniqueOrThrow({
      where: { id: companyId },
      select: { name: true, maxUsers: true, _count: { select: { users: true } } },
    }),
    prisma.user.findMany({
      where: { companyId },
      orderBy: [{ role: "asc" }, { firstName: "asc" }],
      select: {
        id: true, email: true, firstName: true, lastName: true,
        role: true, active: true, lastLoginAt: true, employeeId: true,
      },
    }),
    prisma.employee.findMany({
      where: { companyId, active: true },
      orderBy: { firstName: "asc" },
      select: { id: true, firstName: true, lastName: true },
    }),
  ]);

  return (
    <>
      <PageHeader
        eyebrow={company.name}
        title="Usuarios de la organización"
        subtitle={`${company._count.users} de ${company.maxUsers} usuarios permitidos. Los líderes construyen planes; los colaboradores solo consultan el suyo.`}
      />
      <UsersManager
        users={users.map((u) => ({ ...u, lastLoginAt: u.lastLoginAt?.toISOString() ?? null }))}
        employees={employees}
        seatsLeft={company.maxUsers - company._count.users}
      />
    </>
  );
}
