import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/icons";
import { CtaBand, Section, ServiceIcon } from "@/components/sitio/ui";
import { servicios } from "@/lib/domina";

type Params = { params: Promise<{ slug: string }> };

/** Las seis fichas son fijas: se generan en build. */
export function generateStaticParams() {
  return servicios.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const servicio = servicios.find((s) => s.slug === slug);
  if (!servicio) return {};
  return {
    title: servicio.nombre,
    description: servicio.resumen,
    openGraph: { title: servicio.nombre, description: servicio.resumen },
  };
}

export default async function ServicioPage({ params }: Params) {
  const { slug } = await params;
  const servicio = servicios.find((s) => s.slug === slug);
  if (!servicio) notFound();

  const otros = servicios.filter((s) => s.slug !== servicio.slug).slice(0, 3);

  return (
    <>
      <section className="bg-dom-900 dom-grid-bg pb-20 pt-12 sm:pb-24">
        <div className="dom-wrap">
          <Link
            href="/servicios"
            className="inline-flex items-center gap-2 text-sm text-dom-300 transition-colors hover:text-white"
          >
            <Icon.arrowLeft className="h-4 w-4" />
            Todos los servicios
          </Link>

          <div className="mt-10 grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
            <div>
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[color:var(--color-copper-500)] text-dom-950">
                <ServiceIcon name={servicio.icono} className="h-7 w-7" />
              </span>
              <p className="dom-eyebrow-light mt-6">{servicio.linea}</p>
              <h1 className="dom-display mt-3 text-4xl leading-[1.1] text-white sm:text-[52px]">
                {servicio.nombre}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-dom-200">
                {servicio.resumen}
              </p>
            </div>

            <div className="dom-card-dark">
              <p className="dom-eyebrow-light">El problema que resuelve</p>
              <p className="mt-4 text-lg leading-relaxed text-white">{servicio.problema}</p>
              <Link href="/contacto" className="dom-btn-light mt-7 w-full">
                Hablemos de este servicio
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Section tone="paper">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="dom-eyebrow">Enfoque</p>
            <p className="mt-4 text-xl leading-relaxed text-dom-800">{servicio.descripcion}</p>
          </div>
          <div>
            <h2 className="dom-display text-2xl text-dom-900 dom-rule">Qué incluye</h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {servicio.incluye.map((bloque) => (
                <div key={bloque.titulo} className="rounded-2xl border border-paper-300 bg-white p-6">
                  <h3 className="font-semibold text-dom-900">{bloque.titulo}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-dom-600">{bloque.detalle}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section tone="white">
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <h2 className="dom-display text-2xl text-dom-900 dom-rule">Qué recibes</h2>
            <ul className="mt-8 space-y-4">
              {servicio.entregables.map((e) => (
                <li key={e} className="flex gap-3">
                  <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[color:var(--color-copper-100)] text-[color:var(--color-copper-700)]">
                    <Icon.check className="h-3.5 w-3.5" />
                  </span>
                  <span className="leading-relaxed text-dom-700">{e}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="dom-display text-2xl text-dom-900 dom-rule">Para quién es</h2>
            <ul className="mt-8 space-y-4">
              {servicio.paraQuien.map((p) => (
                <li key={p} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--color-copper-500)]" />
                  <span className="leading-relaxed text-dom-700">{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section tone="soft">
        <h2 className="dom-display text-2xl text-dom-900">Otras líneas de servicio</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {otros.map((s) => (
            <Link
              key={s.slug}
              href={`/servicios/${s.slug}`}
              className="group rounded-2xl border border-paper-300 bg-white p-6 transition-all hover:border-[color:var(--color-copper-300)]"
            >
              <p className="dom-eyebrow">{s.linea}</p>
              <h3 className="dom-display mt-2 text-lg text-dom-900">{s.nombre}</h3>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-dom-700 group-hover:text-[color:var(--color-copper-700)]">
                Ver más
                <Icon.arrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
