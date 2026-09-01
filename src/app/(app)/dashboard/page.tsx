import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { formatShortDate, fullName, initials } from "@/lib/format";
import { planVisibilityFilter } from "@/lib/plans";
import { prisma } from "@/lib/prisma";
import { can } from "@/lib/rbac";
import { Icon } from "@/components/icons";
import { EmptyState, ProgressBar, Stat, StatusBadge } from "@/components/ui";

export const metadata: Metadata = { title: "Inicio" };
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await requireUser();
  const where = planVisibilityFilter(user);

  const [plans, total, drafts, finalized, employeeCount] = await Promise.all([
    prisma.developmentPlan.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      take: 6,
      include: { employee: true, competencies: { select: { id: true } } },
    }),
    prisma.developmentPlan.count({ where }),
    prisma.developmentPlan.count({ where: { AND: [where, { status: "DRAFT" }] } }),
    prisma.developmentPlan.count({
      where: { AND: [where, { status: { in: ["FINALIZED", "DOWNLOADED"] } }] },
    }),
    user.companyId
      ? prisma.employee.count({ where: { companyId: user.companyId, active: true } })
      : prisma.employee.count(),
  ]);

  const canCreate = can(user.role, "plans.create");
  const firstName = user.name.split(" ")[0] ?? "";

  return (
    <>
      <section className="mb-10 overflow-hidden rounded-3xl bg-brand-800 px-7 py-10 text-white sm:px-10 sm:py-12">
        <p className="text-sm font-medium text-brand-200">Hola, {firstName}</p>
        <h1 className="mt-3 max-w-2xl text-3xl font-extrabold leading-tight sm:text-4xl">
          Construye rutas de desarrollo que conviertan potencial en acción.
        </h1>
        <p className="mt-4 max-w-2xl text-brand-100">
          Diseña planes personalizados mediante experiencias, acompañamiento y
          aprendizaje bajo metodología 70-20-10.
        </p>
        {canCreate && (
          <Link
            href="/planes/nuevo"
            className="btn btn-lg mt-8 bg-white text-brand-800 hover:bg-brand-50"
          >
            <Icon.plus className="h-5 w-5" />
            Crear nuevo plan de desarrollo
          </Link>
        )}
      </section>

      <section className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Planes" value={total} hint="Visibles para ti" />
        <Stat label="En borrador" value={drafts} hint="Puedes continuarlos" />
        <Stat label="Finalizados" value={finalized} hint="Listos para entregar" />
        <Stat label="Colaboradores" value={employeeCount} hint="Con ficha activa" />
      </section>

      <section className="mb-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="section-title">Planes recientes</h2>
          <Link href="/planes" className="text-sm font-medium text-brand-700 hover:underline">
            Ver todos
          </Link>
        </div>

        {plans.length === 0 ? (
          <EmptyState
            icon={<Icon.route className="h-10 w-10" />}
            title="Todavía no hay planes"
            description="Elige a una persona de tu equipo y el asistente te guiará paso a paso hasta el documento final."
            action={
              canCreate ? (
                <Link href="/planes/nuevo" className="btn-primary">
                  Crear el primero
                </Link>
              ) : undefined
            }
          />
        ) : (
          <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {plans.map((plan) => (
              <li key={plan.id}>
                <Link
                  href={plan.status === "DRAFT" ? `/planes/${plan.id}/wizard` : `/planes/${plan.id}`}
                  className="card-interactive block h-full px-5 py-5"
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
                        {initials(plan.employee)}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-ink-900">
                          {fullName(plan.employee)}
                        </p>
                        <p className="truncate text-xs text-ink-400">
                          {plan.employee.positionTitle ?? "Sin cargo registrado"}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={plan.status} />
                  </div>
                  <ProgressBar value={plan.completion} />
                  <p className="mt-2.5 flex items-center justify-between text-xs text-ink-400">
                    <span>{plan.completion}% completo</span>
                    <span>{formatShortDate(plan.updatedAt)}</span>
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <ShortcutCard href="/colaboradores" icon={<Icon.users className="h-5 w-5" />}
          title="Colaboradores" text="Consulta las fichas del equipo y sus planes." />
        <ShortcutCard href="/biblioteca" icon={<Icon.library className="h-5 w-5" />}
          title="Biblioteca" text="Explora competencias y actividades de desarrollo." />
        <ShortcutCard href="/ayuda" icon={<Icon.help className="h-5 w-5" />}
          title="Ayuda" text="Cómo funciona el método y cómo construir un buen plan." />
      </section>
    </>
  );
}

function ShortcutCard({
  href, icon, title, text,
}: {
  href: string; icon: React.ReactNode; title: string; text: string;
}) {
  return (
    <Link href={href} className="card-interactive flex items-start gap-4 px-5 py-5">
      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sand-100 text-brand-600">
        {icon}
      </span>
      <span>
        <span className="block font-semibold text-ink-900">{title}</span>
        <span className="mt-1 block text-sm text-ink-500">{text}</span>
      </span>
    </Link>
  );
}
