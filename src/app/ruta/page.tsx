import Link from "next/link";
import { Icon } from "@/components/icons";

/**
 * Portada pública. No debe parecer un LMS: la promesa es desarrollo de
 * personas, crecimiento y construcción de futuro.
 */
export default function LandingPage() {
  return (
    <main className="min-h-dvh bg-sand-100">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Logo />
        <Link href="/login" className="btn-secondary">
          Entrar
        </Link>
      </nav>

      <section className="mx-auto max-w-6xl px-6 pb-16 pt-10 sm:pt-20">
        <div className="max-w-3xl animate-rise">
          <span className="chip-brand mb-6">Talent Development</span>
          <h1 className="text-4xl font-extrabold leading-[1.1] text-ink-900 sm:text-6xl">
            Construye rutas de desarrollo que conviertan{" "}
            <span className="text-brand-600">potencial en acción</span>.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-500">
            Diseña planes personalizados mediante experiencias, acompañamiento y
            aprendizaje. Un asistente guiado lleva a cualquier líder desde el
            diagnóstico hasta un documento profesional listo para conversar con su
            equipo.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/login" className="btn-primary btn-lg">
              Crear nuevo plan de desarrollo
              <Icon.arrowRight className="h-5 w-5" />
            </Link>
            <Link href="#como-funciona" className="btn-secondary btn-lg">
              Cómo funciona
            </Link>
          </div>
          <p className="mt-5 text-sm text-ink-400">
            Un plan completo en 10 a 15 minutos. Sin capacitación previa.
          </p>
        </div>
      </section>

      <section id="como-funciona" className="border-y border-sand-200 bg-white py-16">
        <div className="mx-auto max-w-6xl px-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-brand-600">
            La lógica del producto
          </p>
          <h2 className="mb-10 text-2xl font-bold text-ink-900 sm:text-3xl">
            Diagnosticar → Priorizar → Diseñar → Ejecutar → Desarrollar
          </h2>
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                n: "01",
                t: "Diagnóstico",
                d: "Desempeño, potencial y aspiración de carrera. El punto de partida real de la persona.",
              },
              {
                n: "02",
                t: "Brechas",
                d: "De una a tres competencias prioritarias, con nivel actual y nivel requerido.",
              },
              {
                n: "03",
                t: "Ruta 10 · 20 · 70",
                d: "Qué aprende, quién lo acompaña y dónde lo pone en práctica.",
              },
              {
                n: "04",
                t: "Plan y documento",
                d: "Fechas, responsables e indicadores. Un PDF ejecutivo listo para entregar.",
              },
            ].map((s) => (
              <li key={s.n} className="card px-5 py-6">
                <span className="text-sm font-bold text-brand-400">{s.n}</span>
                <h3 className="mt-2 text-base font-semibold text-ink-900">{s.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-4 lg:grid-cols-3">
          {[
            {
              pct: "10%",
              title: "Aprendo",
              text: "Formación, lecturas y contenidos que dan el marco conceptual.",
              color: "var(--color-m10)",
              soft: "var(--color-m10-soft)",
            },
            {
              pct: "20%",
              title: "Me acompañan",
              text: "Mentoría, coaching y feedback de quienes ya lo hacen bien.",
              color: "var(--color-m20)",
              soft: "var(--color-m20-soft)",
            },
            {
              pct: "70%",
              title: "Lo pongo en práctica",
              text: "Proyectos, retos y responsabilidades reales. Aquí ocurre el desarrollo.",
              color: "var(--color-m70)",
              soft: "var(--color-m70-soft)",
            },
          ].map((s) => (
            <article key={s.pct} className="card px-6 py-7">
              <span
                className="inline-flex h-12 w-12 items-center justify-center rounded-xl text-lg font-bold"
                style={{ background: s.soft, color: s.color }}
              >
                {s.pct}
              </span>
              <h3 className="mt-4 text-lg font-semibold text-ink-900">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">{s.text}</p>
            </article>
          ))}
        </div>
        <blockquote className="mt-12 border-l-4 border-brand-300 pl-6 text-lg italic leading-relaxed text-ink-700 sm:text-xl">
          El desarrollo no ocurre en un evento. Ocurre mediante experiencias
          sostenidas, conversaciones y práctica deliberada.
        </blockquote>
      </section>

      <footer className="border-t border-sand-200 bg-white py-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 text-sm text-ink-400 sm:flex-row sm:items-center sm:justify-between">
          <Logo muted />
          <p>Plataforma de construcción de Planes de Desarrollo Individual.</p>
        </div>
      </footer>
    </main>
  );
}

function Logo({ muted }: { muted?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span
        className={`inline-flex h-9 w-9 items-center justify-center rounded-xl ${
          muted ? "bg-sand-200 text-ink-500" : "bg-brand-600 text-white"
        }`}
      >
        <Icon.route className="h-5 w-5" />
      </span>
      <span className={`text-lg font-bold ${muted ? "text-ink-500" : "text-ink-900"}`}>Ruta</span>
    </span>
  );
}
