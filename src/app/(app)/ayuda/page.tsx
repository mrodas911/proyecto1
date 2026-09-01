import type { Metadata } from "next";
import Link from "next/link";
import { STAGES, STAGE_ORDER, WIZARD_STEPS } from "@/lib/constants";
import { PageHeader } from "@/components/ui";

export const metadata: Metadata = { title: "Ayuda" };

const FAQ = [
  {
    q: "¿Cuánto tiempo toma construir un plan?",
    a: "Entre 10 y 15 minutos. El asistente guarda automáticamente cada decisión, así que puedes salir y retomarlo donde lo dejaste.",
  },
  {
    q: "¿Por qué solo puedo elegir unas pocas competencias?",
    a: "Un plan con diez competencias no se ejecuta. Trabajar entre una y tres a la vez concentra el esfuerzo donde de verdad se nota. Tu organización puede ajustar ese máximo.",
  },
  {
    q: "¿Qué significa que tengo 5 u 8 herramientas disponibles?",
    a: "Los planes orientados al puesto actual usan un subconjunto del catálogo; los que preparan una posición futura tienen acceso completo. Es una regla configurable por tu organización, no una limitación del producto.",
  },
  {
    q: "¿Puedo cambiar lo que me recomienda la plataforma?",
    a: "Siempre. Las recomendaciones se basan en el diagnóstico, el objetivo y la brecha, pero cada actividad, fecha, responsable e indicador es editable. El sistema recomienda; tú decides.",
  },
  {
    q: "¿Qué pasa si necesito modificar un plan ya generado?",
    a: "Puedes crear una versión nueva. La anterior se conserva íntegra en el histórico, de modo que quede trazabilidad de lo acordado en cada momento.",
  },
  {
    q: "¿Quién puede ver el diagnóstico de desempeño y potencial?",
    a: "Es información confidencial: solo la ven Talento Humano, el líder responsable y la administración de la plataforma. El colaborador accede a su plan, no a la valoración.",
  },
];

export default function HelpPage() {
  return (
    <>
      <PageHeader
        eyebrow="Ayuda"
        title="Cómo construir un buen plan"
        subtitle="El método en dos minutos y las respuestas a las dudas más habituales."
      />

      <section className="card mb-8 px-6 py-6">
        <h2 className="section-title mb-1">El recorrido</h2>
        <p className="muted mb-5">
          Nueve pasos. En cada uno decides una sola cosa.
        </p>
        <ol className="grid gap-3 sm:grid-cols-3">
          {WIZARD_STEPS.map((step) => (
            <li key={step.step} className="rounded-xl bg-sand-100 px-4 py-3">
              <span className="text-xs font-bold text-brand-500">
                {String(step.step).padStart(2, "0")}
              </span>
              <p className="font-semibold text-ink-900">{step.label}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mb-8 grid gap-4 lg:grid-cols-3">
        {STAGE_ORDER.map((methodology) => {
          const stage = STAGES[methodology];
          return (
            <article key={methodology} className="card px-6 py-6">
              <span className="text-2xl font-extrabold" style={{ color: stage.color }}>
                {stage.pct}
              </span>
              <h3 className="mt-2 text-lg font-semibold text-ink-900">{stage.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">{stage.hint}</p>
              <p className="mt-3 text-sm font-medium text-ink-700">{stage.question}</p>
            </article>
          );
        })}
      </section>

      <section className="card mb-8 px-6 py-6">
        <h2 className="section-title mb-5">Preguntas frecuentes</h2>
        <dl className="space-y-5">
          {FAQ.map((item) => (
            <div key={item.q}>
              <dt className="font-semibold text-ink-900">{item.q}</dt>
              <dd className="mt-1.5 text-sm leading-relaxed text-ink-500">{item.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="card px-6 py-8 text-center">
        <p className="mx-auto max-w-xl text-lg font-semibold leading-relaxed text-ink-700">
          El desarrollo no ocurre en un evento. Ocurre mediante experiencias sostenidas,
          conversaciones y práctica deliberada.
        </p>
        <Link href="/planes/nuevo" className="btn-primary mt-6">
          Construir un plan
        </Link>
      </section>
    </>
  );
}
