import type { Metadata } from "next";
import { Icon } from "@/components/icons";
import { ContactForm } from "@/components/sitio/contact-form";
import { Faq, PageHero, Section } from "@/components/sitio/ui";
import { empresa, preguntas, servicios } from "@/lib/domina";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Escríbenos para agendar una primera conversación sin costo sobre la situación comercial de tu empresa. Domina, consultora en Cuenca, Ecuador.",
};

export default async function ContactoPage({
  searchParams,
}: {
  searchParams: Promise<{ servicio?: string }>;
}) {
  const { servicio } = await searchParams;
  const inicial = servicios.some((s) => s.slug === servicio) ? servicio! : "";

  return (
    <>
      <PageHero
        eyebrow="Contacto"
        titulo="Cuéntanos qué está pasando en tu empresa"
        intro="La primera conversación dura media hora, no tiene costo y sirve para lo mismo siempre: entender tu situación y decirte con honestidad si podemos ayudarte."
      />

      <Section tone="paper">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <ContactForm interesInicial={inicial} />

          <div className="space-y-6">
            <div className="dom-card">
              <p className="dom-eyebrow">Datos directos</p>
              <ul className="mt-5 space-y-5 text-[15px]">
                <li className="flex gap-3">
                  <Icon.message className="mt-0.5 h-5 w-5 shrink-0 text-[color:var(--color-copper-600)]" />
                  <span>
                    <span className="block text-xs uppercase tracking-wide text-dom-400">
                      Correo
                    </span>
                    <a
                      href={`mailto:${empresa.email}`}
                      className="font-medium text-dom-900 underline-offset-4 hover:underline"
                    >
                      {empresa.email}
                    </a>
                  </span>
                </li>
                <li className="flex gap-3">
                  <Icon.headphones className="mt-0.5 h-5 w-5 shrink-0 text-[color:var(--color-copper-600)]" />
                  <span>
                    <span className="block text-xs uppercase tracking-wide text-dom-400">
                      Teléfono y WhatsApp
                    </span>
                    <a
                      href={`tel:${empresa.telefonoEnlace}`}
                      className="font-medium text-dom-900 underline-offset-4 hover:underline"
                    >
                      {empresa.telefono}
                    </a>
                  </span>
                </li>
                <li className="flex gap-3">
                  <Icon.building className="mt-0.5 h-5 w-5 shrink-0 text-[color:var(--color-copper-600)]" />
                  <span>
                    <span className="block text-xs uppercase tracking-wide text-dom-400">
                      Dónde estamos
                    </span>
                    <span className="font-medium text-dom-900">{empresa.direccion}</span>
                    <span className="mt-1 block text-sm text-dom-500">{empresa.atencion}</span>
                  </span>
                </li>
                <li className="flex gap-3">
                  <Icon.clock className="mt-0.5 h-5 w-5 shrink-0 text-[color:var(--color-copper-600)]" />
                  <span>
                    <span className="block text-xs uppercase tracking-wide text-dom-400">
                      Horario
                    </span>
                    <span className="font-medium text-dom-900">{empresa.horario}</span>
                  </span>
                </li>
              </ul>
            </div>

            <div className="rounded-3xl border border-paper-300 bg-dom-900 p-7 text-dom-200">
              <p className="dom-eyebrow-light">Qué pasa después</p>
              <ol className="mt-5 space-y-4 text-[15px] leading-relaxed">
                <li className="flex gap-3">
                  <span className="dom-display text-[color:var(--color-copper-400)]">1</span>
                  Te respondemos dentro de un día hábil para coordinar la reunión.
                </li>
                <li className="flex gap-3">
                  <span className="dom-display text-[color:var(--color-copper-400)]">2</span>
                  Conversamos 30 minutos sobre tu situación, presencial o por videollamada.
                </li>
                <li className="flex gap-3">
                  <span className="dom-display text-[color:var(--color-copper-400)]">3</span>
                  Si tiene sentido trabajar juntos, recibes una propuesta con alcance,
                  plazos y precio. Si no, te lo decimos y te orientamos igual.
                </li>
              </ol>
            </div>
          </div>
        </div>
      </Section>

      <Section tone="white">
        <h2 className="dom-display mb-10 text-3xl text-dom-900">Preguntas frecuentes</h2>
        <Faq items={preguntas} />
      </Section>
    </>
  );
}
