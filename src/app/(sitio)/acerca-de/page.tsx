import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/icons";
import { CtaBand, PageHero, Section, SectionHeading } from "@/components/sitio/ui";
import { empresa, fundador, proceso, sectores, valores } from "@/lib/domina";

export const metadata: Metadata = {
  title: "Acerca de",
  description:
    "Domina es una consultora cuencana de estrategia y crecimiento empresarial fundada por Mateo Sebastián Rodas. Conoce su origen, su método y sus valores.",
};

export default function AcercaDePage() {
  return (
    <>
      <PageHero
        eyebrow="Acerca de"
        titulo="Una consultora cuencana para empresas que quieren crecer en serio"
        intro={`${empresa.nombreLargo} nació para acercar la consultoría rigurosa a la empresa mediana ecuatoriana: la misma disciplina de las grandes firmas, con el trato directo de un equipo pequeño.`}
      />

      <Section tone="paper">
        <div className="grid gap-14 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="dom-eyebrow">Nuestra historia</p>
            <h2 className="dom-display mt-3 text-3xl leading-tight text-dom-900 sm:text-[40px]">
              Nacimos de una frustración concreta
            </h2>
            <div className="mt-6 space-y-5 text-lg leading-relaxed text-dom-600">
              <p>
                Demasiadas empresas del Austro pagan por diagnósticos que terminan en
                una carpeta. El informe es correcto, las recomendaciones son sensatas y
                aun así nada cambia, porque nadie acompañó la parte difícil: convencer
                al equipo, rediseñar el proceso y sostener el cambio tres meses seguidos.
              </p>
              <p>
                Domina se fundó para hacer justamente esa parte. Entramos a la operación,
                trabajamos junto al equipo comercial y medimos el avance contra
                indicadores acordados desde el primer día. Cuando el proceso camina solo,
                nuestro trabajo terminó.
              </p>
              <p>
                Tenemos base en {empresa.ciudad} y atendemos a empresas de todo el país.
                Conocer el tejido empresarial local —sus tiempos, sus relaciones y sus
                reglas no escritas— es parte del servicio.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="dom-card">
              <p className="dom-eyebrow">Misión</p>
              <p className="mt-3 text-lg leading-relaxed text-dom-800">
                Transformar la manera en que las empresas enfrentan sus retos comerciales:
                ordenar sus procesos de venta, fortalecer su estructura y hacer rentable
                su crecimiento.
              </p>
            </div>
            <div className="dom-card">
              <p className="dom-eyebrow">Visión</p>
              <p className="mt-3 text-lg leading-relaxed text-dom-800">
                Ser la firma de referencia del Austro ecuatoriano en estrategia comercial
                y desarrollo de talento, reconocida por los resultados de sus clientes y
                no por el tamaño de sus informes.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* ── Fundador ─────────────────────────────────────────────────────── */}
      <Section tone="dark">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8">
            <span className="dom-display flex h-24 w-24 items-center justify-center rounded-2xl bg-[color:var(--color-copper-500)] text-3xl text-dom-950">
              MR
            </span>
            <p className="dom-display mt-6 text-2xl text-white">{fundador.nombre}</p>
            <p className="mt-1 text-sm text-[color:var(--color-copper-400)]">{fundador.cargo}</p>
            <p className="mt-5 text-sm leading-relaxed text-dom-300">
              Lidera la práctica de estrategia comercial y desarrollo de talento de la
              firma, y participa personalmente en cada diagnóstico.
            </p>
            {fundador.credenciales.length > 0 ? (
              <ul className="mt-6 space-y-2 border-t border-white/10 pt-5 text-sm text-dom-200">
                {fundador.credenciales.map((c) => (
                  <li key={c} className="flex gap-2">
                    <Icon.check className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--color-copper-400)]" />
                    {c}
                  </li>
                ))}
              </ul>
            ) : null}
            <a
              href={`mailto:${empresa.email}`}
              className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--color-copper-400)] underline-offset-4 hover:underline"
            >
              Escribir al fundador
              <Icon.arrowRight className="h-4 w-4" />
            </a>
          </div>

          <div>
            <p className="dom-eyebrow-light">Palabras del fundador</p>
            <div className="mt-6 space-y-6 text-lg leading-relaxed text-dom-200">
              {fundador.parrafos.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ── Valores ──────────────────────────────────────────────────────── */}
      <Section tone="white">
        <SectionHeading
          eyebrow="Valores"
          title="Cuatro compromisos que no negociamos"
          intro="No son un cuadro en la pared: son criterios que aplicamos al aceptar o rechazar un proyecto."
        />
        <div className="grid gap-6 sm:grid-cols-2">
          {valores.map((v, i) => (
            <div key={v.titulo} className="rounded-3xl border border-paper-300 bg-paper-100 p-8">
              <p className="dom-display text-xl text-[color:var(--color-copper-600)]">
                0{i + 1}
              </p>
              <h3 className="dom-display mt-3 text-xl text-dom-900">{v.titulo}</h3>
              <p className="mt-3 leading-relaxed text-dom-600">{v.detalle}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Método ───────────────────────────────────────────────────────── */}
      <Section tone="paper">
        <SectionHeading
          eyebrow="Cómo trabajamos"
          title="Un método repetible, adaptado a cada empresa"
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {proceso.map((paso) => (
            <div key={paso.n} className="dom-card">
              <p className="dom-display text-2xl text-[color:var(--color-copper-600)]">{paso.n}</p>
              <h3 className="mt-3 text-lg font-semibold text-dom-900">{paso.titulo}</h3>
              <p className="mt-2 text-sm leading-relaxed text-dom-600">{paso.detalle}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 rounded-3xl border border-paper-300 bg-white p-8 sm:p-10">
          <p className="dom-eyebrow">Sectores atendidos</p>
          <ul className="mt-5 flex flex-wrap gap-3">
            {sectores.map((s) => (
              <li
                key={s}
                className="rounded-full bg-paper-100 px-4 py-2 text-sm font-medium text-dom-700"
              >
                {s}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section tone="soft">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="max-w-2xl">
            <h2 className="dom-display text-2xl text-dom-900">
              ¿Quieres sumarte al equipo?
            </h2>
            <p className="mt-3 leading-relaxed text-dom-600">
              Buscamos consultores, formadores y especialistas comerciales que compartan
              la forma de trabajar de la firma.
            </p>
          </div>
          <Link href="/colabora-con-nosotros" className="dom-btn-primary shrink-0">
            Colabora con nosotros
            <Icon.arrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
