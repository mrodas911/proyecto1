import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/icons";
import {
  Cifra,
  CtaBand,
  Faq,
  Section,
  SectionHeading,
  ServiceIcon,
  ServicioCard,
} from "@/components/sitio/ui";
import {
  cifras,
  diferenciales,
  empresa,
  fundador,
  preguntas,
  proceso,
  sectores,
  servicios,
  testimonios,
} from "@/lib/domina";

/** La portada lleva título propio: no debe heredar la plantilla «%s · Domina». */
export const metadata: Metadata = {
  title: { absolute: `${empresa.nombre} — ${empresa.claim} en ${empresa.ciudad}, ${empresa.pais}` },
};

export default function InicioPage() {
  return (
    <>
      {/* ── Portada ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-dom-900 dom-grid-bg">
        <div className="dom-wrap grid gap-14 pb-24 pt-16 sm:pb-28 sm:pt-24 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="animate-rise">
            <p className="dom-eyebrow-light">
              Consultora en {empresa.ciudad} · {empresa.pais}
            </p>
            <h1 className="dom-display mt-5 text-[40px] leading-[1.06] text-white sm:text-6xl">
              Estrategia que se ejecuta,{" "}
              <span className="text-[color:var(--color-copper-400)]">
                resultados que se miden
              </span>
              .
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-dom-200">
              Acompañamos a empresas ecuatorianas a ordenar su proceso comercial,
              fortalecer sus equipos y crecer con rentabilidad. Diagnosticamos con
              datos, diseñamos con foco y nos quedamos hasta que el plan funciona.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/contacto" className="dom-btn-light">
                Agenda una conversación
                <Icon.arrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/servicios"
                className="dom-btn inline-flex border border-white/25 text-white hover:border-white/60"
              >
                Ver servicios
              </Link>
            </div>
            <p className="mt-6 text-sm text-dom-300">
              Primera reunión de diagnóstico sin costo ni compromiso.
            </p>
          </div>

          {/* Tarjeta de resumen: qué recibe el cliente, en concreto. */}
          <div className="dom-card-dark backdrop-blur-sm">
            <p className="dom-eyebrow-light">Cómo trabajamos</p>
            <ul className="mt-6 space-y-5">
              {proceso.map((paso) => (
                <li key={paso.n} className="flex gap-4">
                  <span className="dom-display mt-0.5 text-lg text-[color:var(--color-copper-400)]">
                    {paso.n}
                  </span>
                  <span>
                    <span className="block font-semibold text-white">{paso.titulo}</span>
                    <span className="mt-1 block text-sm leading-relaxed text-dom-300">
                      {paso.detalle}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="dom-wrap grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
            {cifras.map((c) => (
              <Cifra key={c.etiqueta} valor={c.valor} etiqueta={c.etiqueta} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Servicios ────────────────────────────────────────────────────── */}
      <Section tone="paper" id="servicios">
        <SectionHeading
          eyebrow="Líneas de servicio"
          title="Seis frentes, una sola conversación"
          intro="Cada línea resuelve un problema distinto y todas se pueden combinar en un mismo proyecto. Empezamos por donde más duele y avanzamos según los resultados."
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {servicios.map((s) => (
            <ServicioCard key={s.slug} servicio={s} />
          ))}
        </div>
      </Section>

      {/* ── Método ───────────────────────────────────────────────────────── */}
      <Section tone="white">
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionHeading
            eyebrow="Nuestro método"
            title="Diagnóstico, estrategia, ejecución y medición"
            intro="El orden importa. Saltarse el diagnóstico produce planes bonitos que nadie aplica; saltarse la ejecución produce informes que nadie lee."
          />
          <ol className="space-y-8">
            {proceso.map((paso, i) => (
              <li key={paso.n} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <span className="dom-display flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[color:var(--color-copper-300)] bg-[color:var(--color-copper-50)] text-lg text-[color:var(--color-copper-700)]">
                    {paso.n}
                  </span>
                  {i < proceso.length - 1 ? (
                    <span className="mt-2 w-px flex-1 bg-paper-300" aria-hidden="true" />
                  ) : null}
                </div>
                <div className="pb-2">
                  <h3 className="dom-display text-xl text-dom-900">{paso.titulo}</h3>
                  <p className="mt-2 leading-relaxed text-dom-600">{paso.detalle}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      {/* ── Diferenciales ────────────────────────────────────────────────── */}
      <Section tone="dark">
        <SectionHeading
          eyebrow="Por qué Domina"
          title="Consultoría que se mide, no que se promete"
          tone="light"
          intro="Trabajamos con un principio incómodo para el gremio: si el indicador no se mueve, el proyecto no sirvió."
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {diferenciales.map((d) => (
            <div key={d.titulo} className="dom-card-dark">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[color:var(--color-copper-500)]/15 text-[color:var(--color-copper-400)]">
                <ServiceIcon name={d.icono} className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-white">{d.titulo}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-dom-300">{d.detalle}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Fundador ─────────────────────────────────────────────────────── */}
      <Section tone="paper">
        <div className="grid items-start gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="dom-eyebrow">Quién está detrás</p>
            <div className="mt-6 rounded-3xl border border-paper-300 bg-dom-900 p-8">
              <span className="dom-display flex h-20 w-20 items-center justify-center rounded-2xl bg-[color:var(--color-copper-500)] text-2xl text-dom-950">
                MR
              </span>
              <p className="dom-display mt-6 text-2xl text-white">{fundador.nombre}</p>
              <p className="mt-1 text-sm text-[color:var(--color-copper-400)]">
                {fundador.cargo}
              </p>
              <p className="mt-4 text-sm text-dom-300">{fundador.ciudad}</p>
            </div>
          </div>
          <div>
            <h2 className="dom-display text-3xl leading-tight text-dom-900 sm:text-[40px]">
              «Ninguna estrategia vale lo que no se ejecuta»
            </h2>
            <div className="mt-6 space-y-5 text-lg leading-relaxed text-dom-600">
              {fundador.parrafos.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
            <Link
              href="/acerca-de"
              className="mt-8 inline-flex items-center gap-2 font-semibold text-dom-900 underline-offset-4 hover:text-[color:var(--color-copper-700)] hover:underline"
            >
              Conoce a la firma
              <Icon.arrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </Section>

      {/* ── Sectores ─────────────────────────────────────────────────────── */}
      <Section tone="white">
        <SectionHeading
          eyebrow="Sectores"
          title="Dónde trabajamos"
          intro="El método es el mismo; el criterio cambia según el sector. Estas son las industrias en las que acompañamos a nuestros clientes."
          align="center"
        />
        <ul className="flex flex-wrap justify-center gap-3">
          {sectores.map((s) => (
            <li
              key={s}
              className="rounded-full border border-paper-300 bg-paper-100 px-5 py-2.5 text-sm font-medium text-dom-700"
            >
              {s}
            </li>
          ))}
        </ul>
      </Section>

      {/* ── Testimonios (solo si existen testimonios reales) ─────────────── */}
      {testimonios.length > 0 ? (
        <Section tone="soft">
          <SectionHeading eyebrow="Clientes" title="Lo que dicen de nosotros" align="center" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {testimonios.map((t) => (
              <figure key={t.autor} className="dom-card">
                <blockquote className="text-lg leading-relaxed text-dom-800">
                  «{t.cita}»
                </blockquote>
                <figcaption className="mt-5 text-sm">
                  <span className="block font-semibold text-dom-900">{t.autor}</span>
                  <span className="block text-dom-500">{t.cargo}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </Section>
      ) : null}

      {/* ── Preguntas frecuentes ─────────────────────────────────────────── */}
      <Section tone="paper">
        <SectionHeading eyebrow="Preguntas frecuentes" title="Antes de escribirnos" />
        <Faq items={preguntas} />
      </Section>

      <CtaBand />
    </>
  );
}
