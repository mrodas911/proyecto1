import type { Metadata } from "next";
import { CtaBand, PageHero, Section, SectionHeading, ServicioCard } from "@/components/sitio/ui";
import { proceso, servicios } from "@/lib/domina";

export const metadata: Metadata = {
  title: "Servicios",
  description:
    "Estrategia comercial, marketing digital, formación de equipos, selección de talento, fuerza de ventas llave en mano e inteligencia artificial aplicada.",
};

export default function ServiciosPage() {
  return (
    <>
      <PageHero
        eyebrow="Servicios"
        titulo="Seis líneas para un mismo objetivo: que la empresa crezca con orden"
        intro="Puedes contratar una línea puntual o un acompañamiento que las combine. En la primera conversación te decimos por dónde conviene empezar, aunque no sea por el servicio más grande."
      />

      <Section tone="paper">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {servicios.map((s) => (
            <ServicioCard key={s.slug} servicio={s} />
          ))}
        </div>
      </Section>

      <Section tone="white">
        <SectionHeading
          eyebrow="Igual en todos los proyectos"
          title="Lo que siempre está incluido"
          intro="Sea cual sea la línea contratada, el marco de trabajo no cambia."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {proceso.map((paso) => (
            <div key={paso.n} className="rounded-3xl border border-paper-300 bg-paper-100 p-7">
              <p className="dom-display text-2xl text-[color:var(--color-copper-600)]">{paso.n}</p>
              <h3 className="mt-3 text-lg font-semibold text-dom-900">{paso.titulo}</h3>
              <p className="mt-2 text-sm leading-relaxed text-dom-600">{paso.detalle}</p>
            </div>
          ))}
        </div>
      </Section>

      <CtaBand
        titulo="¿No sabes cuál necesitas?"
        texto="Cuéntanos qué está pasando en tu empresa y te decimos qué línea aplica —o si el problema se resuelve sin contratarnos."
        etiqueta="Escríbenos"
      />
    </>
  );
}
