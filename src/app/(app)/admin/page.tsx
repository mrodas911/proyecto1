import type { Metadata } from "next";
import Link from "next/link";
import { CATEGORY_LABELS, METHODOLOGY_SHORT, STATUS_LABELS } from "@/lib/constants";
import { formatShortDate } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { Stat } from "@/components/ui";

export const metadata: Metadata = { title: "Administración" };
export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const [
    companies, activeCompanies, users, employees, plans, finalized,
    exports_, competencyCount, activityCount, byMethodology, byCategory,
    topActivities, recentAudit,
  ] = await Promise.all([
    prisma.company.count(),
    prisma.company.count({ where: { active: true } }),
    prisma.user.count(),
    prisma.employee.count(),
    prisma.developmentPlan.count(),
    prisma.developmentPlan.count({ where: { status: { in: ["FINALIZED", "DOWNLOADED"] } } }),
    prisma.pdfExport.count(),
    prisma.competency.count({ where: { active: true } }),
    prisma.activity.count({ where: { active: true } }),
    prisma.planActivity.groupBy({ by: ["methodology"], _count: { _all: true } }),
    prisma.planCompetency.groupBy({ by: ["competencyId"], _count: { _all: true } }),
    prisma.planActivity.groupBy({
      by: ["activityId"],
      _count: { _all: true },
      where: { activityId: { not: null } },
      orderBy: { _count: { activityId: "desc" } },
      take: 6,
    }),
    prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { user: { select: { firstName: true, lastName: true } }, company: { select: { name: true } } },
    }),
  ]);

  const competencyNames = await prisma.competency.findMany({
    where: { id: { in: byCategory.map((c) => c.competencyId) } },
    select: { id: true, name: true, category: true },
  });
  const nameById = new Map(competencyNames.map((c) => [c.id, c]));
  const topCompetencies = [...byCategory]
    .sort((a, b) => b._count._all - a._count._all)
    .slice(0, 6);

  const activityNames = await prisma.activity.findMany({
    where: { id: { in: topActivities.map((a) => a.activityId!).filter(Boolean) } },
    select: { id: true, title: true, methodology: true },
  });
  const activityById = new Map(activityNames.map((a) => [a.id, a]));

  const futurePlans = await prisma.developmentPlan.count({
    where: { objectiveType: "FUTURE_ROLE" },
  });

  return (
    <div className="space-y-8">
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Empresas" value={companies} hint={`${activeCompanies} activas`} />
        <Stat label="Usuarios" value={users} hint={`${employees} colaboradores`} />
        <Stat label="Planes generados" value={plans} hint={`${finalized} finalizados`} />
        <Stat label="Descargas de PDF" value={exports_} />
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Competencias activas" value={competencyCount} />
        <Stat label="Actividades activas" value={activityCount} />
        <Stat
          label="Orientados a sucesión"
          value={plans === 0 ? "0%" : `${Math.round((futurePlans / plans) * 100)}%`}
          hint={`${futurePlans} planes de posición futura`}
        />
        <Stat
          label="Acciones por etapa"
          value={byMethodology.reduce((sum, m) => sum + m._count._all, 0)}
          hint={byMethodology
            .map((m) => `${METHODOLOGY_SHORT[m.methodology]}: ${m._count._all}`)
            .join(" · ")}
        />
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="card px-6 py-6">
          <h2 className="section-title mb-4">Competencias más trabajadas</h2>
          {topCompetencies.length === 0 ? (
            <p className="muted">Todavía no hay datos suficientes.</p>
          ) : (
            <ul className="space-y-2.5">
              {topCompetencies.map((item) => {
                const competency = nameById.get(item.competencyId);
                return (
                  <li key={item.competencyId} className="flex items-center justify-between gap-3 text-sm">
                    <span className="min-w-0">
                      <span className="block truncate font-medium text-ink-900">
                        {competency?.name ?? "—"}
                      </span>
                      <span className="text-xs text-ink-400">
                        {competency ? CATEGORY_LABELS[competency.category] : ""}
                      </span>
                    </span>
                    <span className="chip-brand">{item._count._all}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className="card px-6 py-6">
          <h2 className="section-title mb-4">Actividades más utilizadas</h2>
          {topActivities.length === 0 ? (
            <p className="muted">Todavía no hay datos suficientes.</p>
          ) : (
            <ul className="space-y-2.5">
              {topActivities.map((item) => {
                const activity = item.activityId ? activityById.get(item.activityId) : null;
                return (
                  <li key={item.activityId} className="flex items-center justify-between gap-3 text-sm">
                    <span className="min-w-0">
                      <span className="block truncate font-medium text-ink-900">
                        {activity?.title ?? "—"}
                      </span>
                      <span className="text-xs text-ink-400">
                        {activity ? METHODOLOGY_SHORT[activity.methodology] : ""}
                      </span>
                    </span>
                    <span className="chip-brand">{item._count._all}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>

      <section className="card px-6 py-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="section-title">Actividad reciente</h2>
          <Link href="/admin/empresas" className="text-sm font-medium text-brand-700 hover:underline">
            Gestionar empresas
          </Link>
        </div>
        {recentAudit.length === 0 ? (
          <p className="muted">Sin registros todavía.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {recentAudit.map((log) => (
              <li key={log.id} className="flex items-center justify-between gap-3">
                <span className="min-w-0 truncate text-ink-700">
                  <code className="rounded bg-sand-100 px-1.5 py-0.5 text-xs">{log.action}</code>{" "}
                  {log.user ? `${log.user.firstName} ${log.user.lastName}` : "Sistema"}
                  {log.company ? ` · ${log.company.name}` : ""}
                </span>
                <span className="shrink-0 text-xs text-ink-400">
                  {formatShortDate(log.createdAt)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="card px-6 py-6">
        <h2 className="section-title mb-4">Planes por estado</h2>
        <PlansByStatus />
      </section>
    </div>
  );
}

async function PlansByStatus() {
  const grouped = await prisma.developmentPlan.groupBy({
    by: ["status"],
    _count: { _all: true },
  });
  const total = grouped.reduce((sum, g) => sum + g._count._all, 0);
  if (total === 0) return <p className="muted">Sin planes todavía.</p>;
  return (
    <ul className="space-y-3">
      {grouped.map((group) => (
        <li key={group.status}>
          <div className="mb-1 flex justify-between text-sm">
            <span className="text-ink-700">{STATUS_LABELS[group.status]}</span>
            <span className="text-ink-400">{group._count._all}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-sand-200">
            <div
              className="h-full rounded-full bg-brand-500"
              style={{ width: `${(group._count._all / total) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
