import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { can } from "@/lib/rbac";
import { PageHeader } from "@/components/ui";
import { NewPlanForm } from "./new-plan-form";

export const metadata: Metadata = { title: "Nuevo plan" };
export const dynamic = "force-dynamic";

export default async function NewPlanPage() {
  const user = await requireUser();
  if (!can(user.role, "plans.create")) redirect("/dashboard");

  const employees = user.companyId
    ? await prisma.employee.findMany({
        where: {
          companyId: user.companyId,
          active: true,
          ...(user.role === "LEADER"
            ? { OR: [{ leaderUserId: user.id }, { leaderUserId: null }] }
            : {}),
        },
        orderBy: [{ firstName: "asc" }],
        select: {
          id: true,
          firstName: true,
          lastName: true,
          area: true,
          positionTitle: true,
          _count: { select: { plans: true } },
        },
      })
    : [];

  return (
    <>
      <PageHeader
        eyebrow="Nuevo plan de desarrollo"
        title="¿Para quién vamos a construir el plan?"
        subtitle="Elige a una persona de tu equipo o registra una nueva. Después te guiaremos paso a paso."
      />
      <NewPlanForm employees={employees} />
    </>
  );
}
