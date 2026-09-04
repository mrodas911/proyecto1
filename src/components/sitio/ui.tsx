import Link from "next/link";
import type { ReactNode } from "react";
import { Icon } from "@/components/icons";
import type { IconName, Servicio } from "@/lib/domina";

/** Resuelve el nombre de icono declarado en los datos a su componente SVG. */
export function ServiceIcon({ name, className }: { name: IconName; className?: string }) {
  const Cmp = Icon[name];
  return <Cmp className={className} />;
}

export function Section({
  children,
  tone = "paper",
  id,
  className = "",
}: {
  children: ReactNode;
  tone?: "paper" | "white" | "dark" | "soft";
  id?: string;
  className?: string;
}) {
  const tones = {
    paper: "bg-paper-100 text-dom-900",
    white: "bg-white text-dom-900",
    soft: "bg-dom-50 text-dom-900",
    dark: "bg-dom-900 text-white dom-grid-bg",
  } as const;
  return (
    <section id={id} className={`${tones[tone]} py-20 sm:py-28 ${className}`}>
      <div className="dom-wrap">{children}</div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  tone = "dark",
  align = "left",
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  /** `dark` = texto oscuro sobre fondo claro. */
  tone?: "dark" | "light";
  align?: "left" | "center";
}) {
  const centrado = align === "center";
  return (
    <header className={`${centrado ? "mx-auto max-w-3xl text-center" : "max-w-3xl"} mb-12`}>
      {eyebrow ? (
        <p className={tone === "dark" ? "dom-eyebrow" : "dom-eyebrow-light"}>{eyebrow}</p>
      ) : null}
      <h2
        className={`dom-display mt-3 text-3xl leading-[1.15] sm:text-[42px] ${
          tone === "dark" ? "text-dom-900" : "text-white"
        }`}
      >
        {title}
      </h2>
      {intro ? (
        <p
          className={`mt-5 text-lg leading-relaxed ${
            tone === "dark" ? "text-dom-600" : "text-dom-200"
          }`}
        >
          {intro}
        </p>
      ) : null}
    </header>
  );
}

export function ServicioCard({ servicio }: { servicio: Servicio }) {
  return (
    <Link
      href={`/servicios/${servicio.slug}`}
      className="dom-card dom-card-hover group flex flex-col"
    >
      <span className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-dom-900 text-[color:var(--color-copper-400)]">
        <ServiceIcon name={servicio.icono} className="h-6 w-6" />
      </span>
      <p className="dom-eyebrow">{servicio.linea}</p>
      <h3 className="dom-display mt-2 text-xl text-dom-900">{servicio.nombre}</h3>
      <p className="mt-3 flex-1 text-[15px] leading-relaxed text-dom-600">{servicio.resumen}</p>
      <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-dom-800 transition-colors group-hover:text-[color:var(--color-copper-600)]">
        Ver el servicio
        <Icon.arrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
}

/** Banda de cierre con llamada a la acción. Se repite al final de cada página. */
export function CtaBand({
  titulo = "Conversemos sobre tu empresa",
  texto = "Una primera conversación de 30 minutos, sin costo, para entender tu situación y decirte con honestidad si podemos ayudarte.",
  etiqueta = "Agendar una conversación",
}: {
  titulo?: string;
  texto?: string;
  etiqueta?: string;
}) {
  return (
    <section className="bg-dom-950 dom-grid-bg py-20 sm:py-24">
      <div className="dom-wrap">
        <div className="flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <h2 className="dom-display text-3xl leading-tight text-white sm:text-4xl">{titulo}</h2>
            <p className="mt-4 text-lg leading-relaxed text-dom-200">{texto}</p>
          </div>
          <Link href="/contacto" className="dom-btn-light shrink-0">
            {etiqueta}
            <Icon.arrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/** Acordeón accesible sin JavaScript: `details` nativo. */
export function Faq({ items }: { items: readonly { p: string; r: string }[] }) {
  return (
    <div className="divide-y divide-paper-300 border-y border-paper-300">
      {items.map((item) => (
        <details key={item.p} className="group py-5">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-left">
            <span className="text-lg font-semibold text-dom-900">{item.p}</span>
            <span className="shrink-0 text-[color:var(--color-copper-600)] transition-transform group-open:rotate-45">
              <Icon.plus className="h-5 w-5" />
            </span>
          </summary>
          <p className="mt-3 max-w-3xl leading-relaxed text-dom-600">{item.r}</p>
        </details>
      ))}
    </div>
  );
}

export function Cifra({ valor, etiqueta }: { valor: string; etiqueta: string }) {
  return (
    <div className="border-l border-white/15 pl-5">
      <p className="dom-display text-3xl text-[color:var(--color-copper-400)] sm:text-4xl">
        {valor}
      </p>
      <p className="mt-2 text-sm leading-snug text-dom-200">{etiqueta}</p>
    </div>
  );
}

/** Encabezado estándar de las páginas interiores. */
export function PageHero({
  eyebrow,
  titulo,
  intro,
}: {
  eyebrow: string;
  titulo: ReactNode;
  intro?: ReactNode;
}) {
  return (
    <section className="bg-dom-900 dom-grid-bg pb-20 pt-16 sm:pb-24 sm:pt-20">
      <div className="dom-wrap">
        <p className="dom-eyebrow-light">{eyebrow}</p>
        <h1 className="dom-display mt-4 max-w-4xl text-4xl leading-[1.1] text-white sm:text-[56px]">
          {titulo}
        </h1>
        {intro ? (
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-dom-200">{intro}</p>
        ) : null}
      </div>
    </section>
  );
}
