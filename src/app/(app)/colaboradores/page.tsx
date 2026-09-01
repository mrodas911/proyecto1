import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { RATING_LABELS, STATUS_LABELS } from "@/lib/constants";
import { formatShortDate, fullName, initials } from "@/lib/format";
import { canSeeDiagnostic } from "@/lib/plans";
import { prisma } from "@/lib/prisma";
import { can } from "@/lib/rbac";
import { Icon } from "@/components/icons";
import { EmptyState, PageHeader } from "@/components/ui";

export const metadata: Metadata = { title: "Colaboradores" };
export const dynamic = "force-dynamic";

export default async function EmployeesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const user = await requireUser();
  const showDiagnostic = canSeeDiagnostic(user.role);

  const employees = user.companyId
    ? await prisma.employee.findMany({
        where: {
          companyId: user.companyId,
          active: true,
          ...(user.role === "LEADER"
            ? { OR: [{ leaderUserId: user.id }, { leaderUserId: null }] }
            : {}),
          ...(q
            ? {
                AND: [
                  {
                    OR: [
                      { firstName: { contains: q, mode: "insensitive" as const } },
                      { lastName: { contains: q, mode: "insensitive" as const } },
                      { positionTitle: { contains: q, mode: "insensitive" as const } },
                      { area: { contains: q, mode: "insensitive" as const } },
                    ],
                  },
                ],
              }
            : {}),
        },
        orderBy: [{ firstName: "asc" }],
        include: {
          plans: {
            orderBy: { updatedAt: "desc" },
            take: 1,
            select: { id: true, status: true, completion: true, updatedAt: true },
          },
          perfEvals: { orderBy: { createdAt: "desc" }, take: 1 },
          potEvals: { orderBy: { createdAt: "desc" }, take: 1 },
          _count: { select: { plans: true } },
        },
      })
    : [];

  return (
    <>
      <PageHeader
        eyebrow="Equipo"
        title="Colaboradores"
        subtitle="Las personas para las que puedes construir planes de desarrollo."
        actions={
          can(user.role, "plans.create") ? (
            <Link href="/planes/nuevo" className="btn-primary">
              <Icon.plus className="h-4 w-4" />
              Nuevo plan
            </Link>
          ) : undefined
        }
      />

      <form className="mb-6 flex gap-3">
        <div className="relative flex-1 sm:max-w-sm">
          <Icon.search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            name="q"
            defaultValue={q ?? ""}
            className="input pl-9"
            placeholder="Buscar por nombre, cargo o área"
          />
        </div>
        <button type="submit" className="btn-secondary">
          Buscar
        </button>
      </form>

      {employees.length === 0 ? (
        <EmptyState
          icon={<Icon.users className="h-10 w-10" />}
          title="Todavía no hay colaboradores"
          description="Registra a la primera persona al crear un plan de desarrollo."
          action={
            can(user.role, "plans.create") ? (
              <Link href="/planes/nuevo" className="btn-primary">
                Crear un plan
              </Link>
            ) : undefined
          }
        />
      ) : (
        <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {employees.map((employee) => {
            const latest = employee.plans[0];
            return (
              <li key={employee.id} className="card px-5 py-5">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
                    {initials(employee)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-ink-900">{fullName(employee)}</p>
                    <p className="truncate text-xs text-ink-400">
                      {employee.positionTitle ?? "Sin cargo"} · {employee.area ?? "Sin área"}
                    </p>
                  </div>
                </div>

                {showDiagnostic && (employee.perfEvals[0] || employee.potEvals[0]) && (
                  <div className="mt-4 flex gap-2">
                    {employee.perfEvals[0] && (
                      <span className="chip-neutral">
                        Desempeño {RATING_LABELS[employee.perfEvals[0].rating].toLowerCase()}
                      </span>
                    )}
                    {employee.potEvals[0] && (
                      <span className="chip-neutral">
                        Potencial {RATING_LABELS[employee.potEvals[0].rating].toLowerCase()}
                      </span>
                    )}
                  </div>
                )}

                <div className="mt-4 border-t border-sand-200 pt-4 text-sm">
                  {latest ? (
                    <Link
                      href={latest.status === "DRAFT" ? `/planes/${latest.id}/wizard` : `/planes/${latest.id}`}
                      className="flex items-center justify-between gap-2 text-ink-700 hover:text-brand-700"
                    >
                      <span>
                        {STATUS_LABELS[latest.status]} · {latest.completion}%
                        <span className="block text-xs text-ink-400">
                          Actualizado {formatShortDate(latest.updatedAt)}
                        </span>
                      </span>
                      <Icon.arrowRight className="h-4 w-4 shrink-0" />
                    </Link>
                  ) : (
                    <p className="text-ink-400">
                      Sin planes todavía.{" "}
                      {can(user.role, "plans.create") && (
                        <Link
                          href="/planes/nuevo"
                          className="font-medium text-brand-700 hover:underline"
                        >
                          Crear uno
                        </Link>
                      )}
                    </p>
                  )}
                  {employee._count.plans > 1 && (
                    <p className="mt-2 text-xs text-ink-400">
                      {employee._count.plans} planes en total
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
