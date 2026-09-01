import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/auth";
import {
  ASPIRATION_LABELS,
  HORIZON_LABELS,
  METHODOLOGY_SHORT,
  NINE_BOX_LABELS,
  NINE_BOX_READINGS,
  OBJECTIVE_LABELS,
  RATING_LABELS,
  RESPONSIBLE_LABELS,
  STAGES,
  STAGE_ORDER,
} from "@/lib/constants";
import { formatDate, formatShortDate, fullName } from "@/lib/format";
import { canSeeDiagnostic, getPlanForPage } from "@/lib/plans";
import { prisma } from "@/lib/prisma";
import { can } from "@/lib/rbac";
import { Icon } from "@/components/icons";
import { Alert, PageHeader, ProgressBar, StatusBadge } from "@/components/ui";
import { PlanActions } from "@/components/plan-actions";

export const metadata: Metadata = { title: "Plan de desarrollo" };
export const dynamic = "force-dynamic";

export default async function PlanDetailPage({
  params, searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ generado?: string }>;
}) {
  const { id } = await params;
  const { generado } = await searchParams;
  const session = await requireUser();
  const user = { ...session, id: session.sub };
  const plan = await getPlanForPage(id, user);
  const showDiagnostic = canSeeDiagnostic(user.role);

  const versions = await prisma.developmentPlan.findMany({
    where: {
      OR: [
        { id: plan.parentPlanId ?? plan.id },
        { parentPlanId: plan.parentPlanId ?? plan.id },
      ],
    },
    orderBy: { version: "asc" },
    select: { id: true, version: true, status: true, finalizedAt: true, createdAt: true },
  });

  const allActions = plan.competencies.flatMap((c) =>
    c.activities.map((a) => ({ ...a, competencyName: c.competency.name }))
  );
  const scheduled = allActions
    .filter((a) => a.startDate)
    .sort((a, b) => (a.startDate!.getTime() ?? 0) - (b.startDate!.getTime() ?? 0));

  return (
    <>
      {generado && (
        <div className="mb-6">
          <Alert tone="success" title="¡Plan generado!">
            El plan quedó registrado en el histórico. Ya puedes descargar el documento y
            compartirlo con la persona.
          </Alert>
        </div>
      )}

      <PageHeader
        eyebrow={`Plan individual de desarrollo${plan.version > 1 ? ` · versión ${plan.version}` : ""}`}
        title={fullName(plan.employee)}
        subtitle={`${plan.employee.positionTitle ?? "Sin cargo"} · ${plan.employee.area ?? "Sin área"} · ${plan.company.name}`}
        actions={
          <PlanActions
            planId={plan.id}
            status={plan.status}
            canEdit={can(user.role, "plans.edit")}
          />
        }
      />

      <section className="mb-8 grid gap-4 lg:grid-cols-3">
        <div className="card px-5 py-5 lg:col-span-2">
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <StatusBadge status={plan.status} />
            <span className="text-xs text-ink-400">
              Fecha del plan: {formatDate(plan.planDate)}
            </span>
            {plan.finalizedAt && (
              <span className="text-xs text-ink-400">
                Generado: {formatDate(plan.finalizedAt)}
              </span>
            )}
          </div>
          <h2 className="section-title">
            {plan.objectiveType
              ? OBJECTIVE_LABELS[plan.objectiveType]
              : "Objetivo sin definir"}
          </h2>
          {plan.objectiveStatement && (
            <p className="mt-2 text-sm leading-relaxed text-ink-500">
              {plan.objectiveStatement}
            </p>
          )}
          {plan.objectiveType === "FUTURE_ROLE" && (
            <p className="mt-3 text-sm text-ink-700">
              Posición objetivo:{" "}
              <strong>{plan.targetPositionTitle ?? "por definir"}</strong>
              {plan.targetPositionArea ? ` · ${plan.targetPositionArea}` : ""}
              {plan.horizon ? ` · ${HORIZON_LABELS[plan.horizon]}` : ""}
            </p>
          )}
          <div className="mt-5">
            <ProgressBar value={plan.completion} />
            <p className="mt-2 text-xs text-ink-400">{plan.completion}% completo</p>
          </div>
        </div>

        <div className="card px-5 py-5">
          <h3 className="mb-3 text-sm font-semibold text-ink-900">Perfil</h3>
          <dl className="space-y-2 text-sm">
            <Row label="Líder" value={plan.employee.managerName ?? fullName(plan.author)} />
            <Row label="Ubicación" value={plan.employee.location ?? "—"} />
            <Row label="Unidad" value={plan.employee.businessUnit ?? "—"} />
            <Row label="Creado por" value={fullName(plan.author)} />
          </dl>
        </div>
      </section>

      {showDiagnostic && plan.diagnostic && (
        <section className="card mb-8 px-6 py-6">
          <h2 className="section-title mb-1">Diagnóstico</h2>
          <p className="muted mb-5">
            Información confidencial. Solo visible para los roles autorizados.
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            <Metric label="Desempeño" value={RATING_LABELS[plan.diagnostic.performance]} />
            <Metric label="Potencial" value={RATING_LABELS[plan.diagnostic.potential]} />
            <Metric label="Aspiración" value={ASPIRATION_LABELS[plan.diagnostic.aspiration]} />
          </div>
          {plan.diagnostic.nineBox && (
            <div className="mt-5 rounded-xl bg-brand-50 px-4 py-4">
              <p className="font-semibold text-brand-800">
                {NINE_BOX_LABELS[plan.diagnostic.nineBox]}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-brand-900/80">
                {NINE_BOX_READINGS[plan.diagnostic.nineBox]}
              </p>
            </div>
          )}
          {plan.diagnostic.notes && (
            <p className="mt-4 text-sm text-ink-500">{plan.diagnostic.notes}</p>
          )}
        </section>
      )}

      <section className="mb-8 space-y-6">
        <h2 className="section-title">La ruta de desarrollo</h2>
        {plan.competencies.map((competency) => (
          <article key={competency.id} className="card px-6 py-6">
            <header className="mb-5">
              <h3 className="text-lg font-bold uppercase tracking-wide text-ink-900">
                {competency.competency.name}
              </h3>
              <p className="muted mt-1">
                Nivel actual {competency.currentLevel} · Nivel requerido{" "}
                {competency.requiredLevel}
              </p>
              {competency.objective && (
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ink-700">
                  {competency.objective}
                </p>
              )}
            </header>

            <div className="space-y-5">
              {STAGE_ORDER.map((methodology) => {
                const actions = competency.activities.filter(
                  (a) => a.methodology === methodology
                );
                if (actions.length === 0) return null;
                const stage = STAGES[methodology];
                return (
                  <div key={methodology}>
                    <p
                      className="mb-2 text-xs font-bold uppercase tracking-widest"
                      style={{ color: stage.color }}
                    >
                      {METHODOLOGY_SHORT[methodology]} · {stage.title}
                    </p>
                    <ul className="space-y-2">
                      {actions.map((action) => (
                        <li
                          key={action.id}
                          className="rounded-xl border border-sand-200 px-4 py-3"
                        >
                          <p className="text-sm font-semibold text-ink-900">{action.title}</p>
                          {action.objective && (
                            <p className="mt-1 text-sm text-ink-500">{action.objective}</p>
                          )}
                          <dl className="mt-2.5 grid gap-x-6 gap-y-1 text-xs text-ink-500 sm:grid-cols-2">
                            <Inline
                              label="Responsable"
                              value={
                                action.responsibleName ??
                                RESPONSIBLE_LABELS[action.responsibleType]
                              }
                            />
                            <Inline
                              label="Plazo"
                              value={
                                action.startDate && action.targetDate
                                  ? `${formatShortDate(action.startDate)} → ${formatShortDate(action.targetDate)}`
                                  : "Sin fechas"
                              }
                            />
                            {action.frequency && (
                              <Inline label="Frecuencia" value={action.frequency} />
                            )}
                            {action.expectedEvidence && (
                              <Inline label="Evidencia" value={action.expectedEvidence} />
                            )}
                            {action.successIndicator && (
                              <div className="sm:col-span-2">
                                <Inline
                                  label="Indicador de éxito"
                                  value={action.successIndicator}
                                />
                              </div>
                            )}
                          </dl>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </article>
        ))}
      </section>

      {scheduled.length > 0 && (
        <section className="card mb-8 px-6 py-6">
          <h2 className="section-title mb-5">Cronograma</h2>
          <ol className="relative space-y-4 border-l border-sand-300 pl-6">
            {scheduled.map((action) => (
              <li key={action.id} className="relative">
                <span className="absolute -left-[27px] top-1.5 h-2.5 w-2.5 rounded-full bg-brand-500" />
                <p className="text-xs font-medium text-ink-400">
                  {formatShortDate(action.startDate)} → {formatShortDate(action.targetDate)}
                </p>
                <p className="text-sm font-semibold text-ink-900">{action.title}</p>
                <p className="text-xs text-ink-500">
                  {METHODOLOGY_SHORT[action.methodology]} · {action.competencyName}
                </p>
              </li>
            ))}
          </ol>
        </section>
      )}

      {versions.length > 1 && (
        <section className="card px-6 py-6">
          <h2 className="section-title mb-4">Versiones</h2>
          <ul className="space-y-2">
            {versions.map((version) => (
              <li key={version.id} className="flex items-center justify-between gap-3 text-sm">
                <span>
                  Versión {version.version}
                  {version.id === plan.id && (
                    <span className="ml-2 text-xs text-brand-700">(estás viendo esta)</span>
                  )}
                </span>
                <span className="flex items-center gap-3">
                  <span className="text-xs text-ink-400">
                    {formatShortDate(version.finalizedAt ?? version.createdAt)}
                  </span>
                  <StatusBadge status={version.status} />
                  {version.id !== plan.id && (
                    <Link
                      href={`/planes/${version.id}`}
                      className="text-xs font-medium text-brand-700 hover:underline"
                    >
                      Abrir
                    </Link>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-ink-400">{label}</dt>
      <dd className="truncate text-right font-medium text-ink-700">{value}</dd>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-sand-100 px-4 py-3">
      <p className="text-xs text-ink-400">{label}</p>
      <p className="mt-1 font-semibold text-ink-900">{value}</p>
    </div>
  );
}

function Inline({ label, value }: { label: string; value: string }) {
  return (
    <p>
      <span className="text-ink-400">{label}: </span>
      <span className="text-ink-700">{value}</span>
    </p>
  );
}
