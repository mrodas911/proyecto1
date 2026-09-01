import type { Metadata } from "next";
import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { requireUser } from "@/lib/auth";
import {
  CATEGORY_LABELS,
  DEVELOPMENT_TYPE_LABELS,
  DIFFICULTY_LABELS,
  METHODOLOGY_SHORT,
  STAGES,
  STAGE_ORDER,
} from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { Icon } from "@/components/icons";
import { EmptyState, PageHeader } from "@/components/ui";

export const metadata: Metadata = { title: "Biblioteca" };
export const dynamic = "force-dynamic";

type Search = {
  q?: string;
  etapa?: string;
  competencia?: string;
  nivel?: string;
  tipo?: string;
  herramienta?: string;
};

export default async function LibraryPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const filters = await searchParams;
  const user = await requireUser();
  const scope = [{ companyId: null }, { companyId: user.companyId ?? "__none__" }];

  const where: Prisma.ActivityWhereInput = {
    active: true,
    OR: scope,
    ...(filters.etapa ? { methodology: filters.etapa as never } : {}),
    ...(filters.nivel ? { difficulty: filters.nivel as never } : {}),
    ...(filters.herramienta ? { toolId: filters.herramienta } : {}),
    ...(filters.tipo
      ? { developmentType: { in: [filters.tipo as never, "BOTH" as never] } }
      : {}),
    ...(filters.competencia
      ? { competencies: { some: { competencyId: filters.competencia } } }
      : {}),
    ...(filters.q
      ? {
          AND: [
            {
              OR: [
                { title: { contains: filters.q, mode: "insensitive" as const } },
                { description: { contains: filters.q, mode: "insensitive" as const } },
                { benefit: { contains: filters.q, mode: "insensitive" as const } },
              ],
            },
          ],
        }
      : {}),
  };

  const [activities, competencies, tools] = await Promise.all([
    prisma.activity.findMany({
      where,
      orderBy: [{ title: "asc" }],
      include: {
        tool: true,
        competencies: { include: { competency: { select: { id: true, name: true } } } },
      },
      take: 300,
    }),
    prisma.competency.findMany({
      where: { active: true, OR: scope },
      orderBy: [{ order: "asc" }],
      select: { id: true, name: true, definition: true, category: true },
    }),
    prisma.developmentTool.findMany({
      where: { active: true, OR: scope },
      orderBy: { order: "asc" },
    }),
  ]);

  const hasFilters = Boolean(
    filters.q || filters.etapa || filters.competencia || filters.nivel || filters.tipo || filters.herramienta
  );

  function link(patch: Partial<Search>) {
    const params = new URLSearchParams();
    const merged = { ...filters, ...patch };
    for (const [key, value] of Object.entries(merged)) {
      if (value) params.set(key, String(value));
    }
    const qs = params.toString();
    return `/biblioteca${qs ? `?${qs}` : ""}`;
  }

  return (
    <>
      <PageHeader
        eyebrow="Biblioteca"
        title="Explora el catálogo de desarrollo"
        subtitle="Competencias y actividades disponibles. Todo lo que ves aquí puede formar parte de un plan."
      />

      <form className="mb-5 flex flex-wrap items-center gap-3">
        {Object.entries(filters).map(([key, value]) =>
          key === "q" || !value ? null : (
            <input key={key} type="hidden" name={key} value={String(value)} />
          )
        )}
        <div className="relative flex-1 sm:max-w-sm">
          <Icon.search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            name="q"
            defaultValue={filters.q ?? ""}
            className="input pl-9"
            placeholder="Buscar por actividad, competencia o palabra clave"
          />
        </div>
        <button type="submit" className="btn-secondary">
          Buscar
        </button>
        {hasFilters && (
          <Link href="/biblioteca" className="btn-ghost text-sm">
            Limpiar filtros
          </Link>
        )}
      </form>

      <div className="mb-8 space-y-3">
        <FilterRow label="Etapa">
          <Chip href={link({ etapa: undefined })} active={!filters.etapa}>
            Todas
          </Chip>
          {STAGE_ORDER.map((methodology) => (
            <Chip
              key={methodology}
              href={link({ etapa: methodology })}
              active={filters.etapa === methodology}
            >
              {METHODOLOGY_SHORT[methodology]} {STAGES[methodology].title}
            </Chip>
          ))}
        </FilterRow>

        <FilterRow label="Orientada a">
          <Chip href={link({ tipo: undefined })} active={!filters.tipo}>
            Todo
          </Chip>
          <Chip href={link({ tipo: "CURRENT" })} active={filters.tipo === "CURRENT"}>
            Puesto actual
          </Chip>
          <Chip href={link({ tipo: "FUTURE" })} active={filters.tipo === "FUTURE"}>
            Posición futura
          </Chip>
        </FilterRow>

        <FilterRow label="Nivel">
          <Chip href={link({ nivel: undefined })} active={!filters.nivel}>
            Todos
          </Chip>
          {(["BASIC", "INTERMEDIATE", "ADVANCED"] as const).map((level) => (
            <Chip key={level} href={link({ nivel: level })} active={filters.nivel === level}>
              {DIFFICULTY_LABELS[level]}
            </Chip>
          ))}
        </FilterRow>

        <FilterRow label="Herramienta">
          <Chip href={link({ herramienta: undefined })} active={!filters.herramienta}>
            Todas
          </Chip>
          {tools.map((tool) => (
            <Chip
              key={tool.id}
              href={link({ herramienta: tool.id })}
              active={filters.herramienta === tool.id}
            >
              {tool.name}
            </Chip>
          ))}
        </FilterRow>

        <FilterRow label="Competencia">
          <Chip href={link({ competencia: undefined })} active={!filters.competencia}>
            Todas
          </Chip>
          {competencies.map((competency) => (
            <Chip
              key={competency.id}
              href={link({ competencia: competency.id })}
              active={filters.competencia === competency.id}
            >
              {competency.name}
            </Chip>
          ))}
        </FilterRow>
      </div>

      {!hasFilters && (
        <section className="mb-10">
          <h2 className="section-title mb-4">Competencias</h2>
          <div className="rail">
            {competencies.map((competency) => (
              <Link
                key={competency.id}
                href={link({ competencia: competency.id })}
                className="card-interactive flex w-[260px] shrink-0 flex-col px-5 py-5"
              >
                <span className="chip-neutral mb-3 self-start">
                  {CATEGORY_LABELS[competency.category]}
                </span>
                <span className="text-sm font-bold uppercase tracking-wide text-ink-900">
                  {competency.name}
                </span>
                <span className="mt-2 line-clamp-4 text-xs leading-relaxed text-ink-500">
                  {competency.definition}.
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {activities.length === 0 ? (
        <EmptyState
          icon={<Icon.library className="h-10 w-10" />}
          title="Sin resultados"
          description="Prueba con otra palabra o quita alguno de los filtros aplicados."
          action={
            <Link href="/biblioteca" className="btn-secondary">
              Limpiar filtros
            </Link>
          }
        />
      ) : (
        STAGE_ORDER.map((methodology) => {
          const stageActivities = activities.filter((a) => a.methodology === methodology);
          if (stageActivities.length === 0) return null;
          const stage = STAGES[methodology];
          return (
            <section key={methodology} className="mb-10">
              <div className="mb-4 flex items-baseline gap-3">
                <h2 className="section-title" style={{ color: stage.color }}>
                  {stage.pct} {stage.title}
                </h2>
                <span className="muted">
                  {stageActivities.length} actividad
                  {stageActivities.length === 1 ? "" : "es"}
                </span>
              </div>
              <div className="rail">
                {stageActivities.map((activity) => (
                  <article
                    key={activity.id}
                    className="card flex w-[290px] shrink-0 flex-col px-5 py-5"
                  >
                    <span
                      className={
                        methodology === "M10"
                          ? "chip-m10 self-start"
                          : methodology === "M20"
                            ? "chip-m20 self-start"
                            : "chip-m70 self-start"
                      }
                    >
                      {METHODOLOGY_SHORT[methodology]}
                    </span>
                    <h3 className="mt-3 text-sm font-bold leading-snug text-ink-900">
                      {activity.title}
                    </h3>
                    <p className="mt-2 line-clamp-3 flex-1 text-xs leading-relaxed text-ink-500">
                      {activity.description}
                    </p>
                    <p className="mt-3 rounded-lg bg-sand-100 px-3 py-2 text-xs leading-relaxed text-ink-600">
                      {activity.benefit}
                    </p>
                    <dl className="mt-3 space-y-1 text-xs text-ink-500">
                      <div className="flex justify-between gap-2">
                        <dt className="text-ink-400">Duración</dt>
                        <dd className="font-medium text-ink-700">{activity.duration}</dd>
                      </div>
                      <div className="flex justify-between gap-2">
                        <dt className="text-ink-400">Nivel</dt>
                        <dd className="font-medium text-ink-700">
                          {DIFFICULTY_LABELS[activity.difficulty]}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-2">
                        <dt className="text-ink-400">Orientada a</dt>
                        <dd className="font-medium text-ink-700">
                          {DEVELOPMENT_TYPE_LABELS[activity.developmentType]}
                        </dd>
                      </div>
                    </dl>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {activity.competencies.slice(0, 3).map((link) => (
                        <span key={link.competencyId} className="chip-neutral">
                          {link.competency.name}
                        </span>
                      ))}
                      {activity.competencies.length > 3 && (
                        <span className="chip-neutral">
                          +{activity.competencies.length - 3}
                        </span>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          );
        })
      )}
    </>
  );
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="w-24 shrink-0 text-xs font-semibold uppercase tracking-wide text-ink-400">
        {label}
      </span>
      {children}
    </div>
  );
}

function Chip({
  href, active, children,
}: {
  href: string; active: boolean; children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
        active ? "bg-brand-600 text-white" : "bg-white text-ink-500 hover:bg-sand-200"
      }`}
    >
      {children}
    </Link>
  );
}
