import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { OBJECTIVE_LABELS, STATUS_LABELS } from "@/lib/constants";
import { formatShortDate, fullName, initials } from "@/lib/format";
import { planVisibilityFilter } from "@/lib/plans";
import { prisma } from "@/lib/prisma";
import { can } from "@/lib/rbac";
import { Icon } from "@/components/icons";
import { EmptyState, PageHeader, ProgressBar, StatusBadge } from "@/components/ui";

export const metadata: Metadata = { title: "Mis planes" };
export const dynamic = "force-dynamic";

const FILTERS = [
  { value: "", label: "Todos" },
  { value: "DRAFT", label: STATUS_LABELS.DRAFT },
  { value: "FINALIZED", label: STATUS_LABELS.FINALIZED },
  { value: "DOWNLOADED", label: STATUS_LABELS.DOWNLOADED },
];

export default async function PlansPage({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string; q?: string }>;
}) {
  const { estado, q } = await searchParams;
  const session = await requireUser();
  const user = { ...session, id: session.sub };

  const plans = await prisma.developmentPlan.findMany({
    where: {
      AND: [
        planVisibilityFilter(user),
        estado ? { status: estado as never } : {},
        q
          ? {
              employee: {
                OR: [
                  { firstName: { contains: q, mode: "insensitive" } },
                  { lastName: { contains: q, mode: "insensitive" } },
                ],
              },
            }
          : {},
      ],
    },
    orderBy: { updatedAt: "desc" },
    include: {
      employee: true,
      _count: { select: { competencies: true, activities: true } },
    },
  });

  return (
    <>
      <PageHeader
        eyebrow="Histórico"
        title="Mis planes"
        subtitle="Todos los planes de desarrollo a los que tienes acceso, con su estado y su avance."
        actions={
          can(user.role, "plans.create") ? (
            <Link href="/planes/nuevo" className="btn-primary">
              <Icon.plus className="h-4 w-4" />
              Nuevo plan
            </Link>
          ) : undefined
        }
      />

      <form className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative">
          <Icon.search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            name="q"
            defaultValue={q ?? ""}
            className="input w-64 pl-9"
            placeholder="Buscar por persona"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map((filter) => {
            const active = (estado ?? "") === filter.value;
            const params = new URLSearchParams();
            if (filter.value) params.set("estado", filter.value);
            if (q) params.set("q", q);
            return (
              <Link
                key={filter.label}
                href={`/planes${params.toString() ? `?${params}` : ""}`}
                className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                  active ? "bg-brand-600 text-white" : "bg-white text-ink-500 hover:bg-sand-200"
                }`}
              >
                {filter.label}
              </Link>
            );
          })}
        </div>
        <button type="submit" className="btn-secondary">
          Buscar
        </button>
      </form>

      {plans.length === 0 ? (
        <EmptyState
          icon={<Icon.route className="h-10 w-10" />}
          title="No hay planes que mostrar"
          description="Cuando construyas un plan aparecerá aquí, con su estado y la posibilidad de descargarlo."
          action={
            can(user.role, "plans.create") ? (
              <Link href="/planes/nuevo" className="btn-primary">
                Crear un plan
              </Link>
            ) : undefined
          }
        />
      ) : (
        <ul className="space-y-3">
          {plans.map((plan) => (
            <li key={plan.id}>
              <Link
                href={plan.status === "DRAFT" ? `/planes/${plan.id}/wizard` : `/planes/${plan.id}`}
                className="card-interactive flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center"
              >
                <span className="flex min-w-0 flex-1 items-center gap-3">
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
                    {initials(plan.employee)}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate font-semibold text-ink-900">
                      {fullName(plan.employee)}
                      {plan.version > 1 && (
                        <span className="ml-2 text-xs font-normal text-ink-400">
                          v{plan.version}
                        </span>
                      )}
                    </span>
                    <span className="block truncate text-xs text-ink-400">
                      {plan.employee.positionTitle ?? "Sin cargo"} ·{" "}
                      {plan.employee.area ?? "Sin área"}
                    </span>
                  </span>
                </span>

                <span className="hidden min-w-0 flex-1 text-sm text-ink-500 lg:block">
                  {plan.objectiveType ? OBJECTIVE_LABELS[plan.objectiveType] : "Objetivo sin definir"}
                </span>

                <span className="w-full sm:w-36">
                  <ProgressBar value={plan.completion} />
                  <span className="mt-1.5 block text-xs text-ink-400">
                    {plan.completion}% · {plan._count.activities} acciones
                  </span>
                </span>

                <span className="flex items-center gap-4 sm:w-52 sm:justify-end">
                  <span className="text-xs text-ink-400">{formatShortDate(plan.planDate)}</span>
                  <StatusBadge status={plan.status} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
