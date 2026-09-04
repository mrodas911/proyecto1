import type { Metadata } from "next";
import { Icon } from "@/components/icons";
import { CtaBand, PageHero, Section, SectionHeading } from "@/components/sitio/ui";
import { empresa, valores } from "@/lib/domina";

export const metadata: Metadata = {
  title: "Colabora con nosotros",
  description:
    "Domina suma consultores, formadores y especialistas comerciales que quieran trabajar por proyecto con empresas ecuatorianas.",
};

const perfiles = [
  {
    titulo: "Consultores de estrategia comercial",
    detalle:
      "Con experiencia dirigiendo áreas de ventas y capacidad de leer los números de un negocio antes de opinar sobre él.",
  },
  {
    titulo: "Formadores y coaches",
    detalle:
      "Que diseñen y faciliten programas de ventas, liderazgo o servicio, y midan el efecto de lo que enseñan.",
  },
  {
    titulo: "Especialistas en marketing digital",
    detalle:
      "Posicionamiento, contenidos y pauta, con criterio de negocio y no solo de métricas de vanidad.",
  },
  {
    titulo: "Reclutadores y headhunters",
    detalle:
      "Con red propia en el Austro y método de evaluación por competencias.",
  },
  {
    titulo: "Perfiles de datos e inteligencia artificial",
    detalle:
      "Que traduzcan casos de uso comerciales en herramientas que el equipo del cliente use de verdad.",
  },
  {
    titulo: "Practicantes y talento junior",
    detalle:
      "Estudiantes de últimos semestres de administración, marketing o afines con ganas de aprender en campo.",
  },
];

export default function ColaboraPage() {
  return (
    <>
      <PageHero
        eyebrow="Colabora con nosotros"
        titulo="Construyamos juntos la red de consultores del Austro"
        intro={`${empresa.nombreLargo} trabaja con un equipo base y una red de especialistas que se suma según el proyecto. Si te dedicas a esto y compartes nuestra forma de trabajar, queremos conocerte.`}
      />

      <Section tone="paper">
        <SectionHeading
          eyebrow="Perfiles"
          title="A quién buscamos"
          intro="No abrimos vacantes fijas todo el año: mantenemos una base de especialistas a la que recurrimos cuando un proyecto lo exige."
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {perfiles.map((p) => (
            <div key={p.titulo} className="dom-card">
              <h3 className="text-lg font-semibold text-dom-900">{p.titulo}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-dom-600">{p.detalle}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="dark">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Cómo trabajamos"
              title="Qué esperar de la colaboración"
              tone="light"
            />
            <ul className="space-y-5 text-dom-200">
              {[
                "Colaboración por proyecto, con alcance, honorarios y plazos acordados por escrito antes de empezar.",
                "Trabajo directo con el cliente y con el equipo de Domina: nadie hace de intermediario invisible.",
                "Metodología común de diagnóstico, ejecución y medición, con espacio para tu propio criterio.",
                "Acuerdo de confidencialidad con cada cliente. Es innegociable.",
              ].map((t) => (
                <li key={t.slice(0, 20)} className="flex gap-3 leading-relaxed">
                  <Icon.check className="mt-1 h-5 w-5 shrink-0 text-[color:var(--color-copper-400)]" />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="dom-card-dark">
            <p className="dom-eyebrow-light">Cómo postular</p>
            <p className="mt-4 leading-relaxed text-dom-200">
              Escríbenos a{" "}
              <a
                href={`mailto:${empresa.email}?subject=${encodeURIComponent(
                  "Colaboración con Domina",
                )}`}
                className="font-semibold text-[color:var(--color-copper-400)] underline-offset-4 hover:underline"
              >
                {empresa.email}
              </a>{" "}
              con el asunto «Colaboración con Domina» e incluye:
            </p>
            <ol className="mt-6 space-y-4 text-[15px] leading-relaxed text-dom-200">
              <li className="flex gap-3">
                <span className="dom-display text-[color:var(--color-copper-400)]">1</span>
                Tu hoja de vida o tu perfil profesional en línea.
              </li>
              <li className="flex gap-3">
                <span className="dom-display text-[color:var(--color-copper-400)]">2</span>
                Dos proyectos de los que estés orgulloso y qué resultado tuvieron.
              </li>
              <li className="flex gap-3">
                <span className="dom-display text-[color:var(--color-copper-400)]">3</span>
                Tu disponibilidad y la modalidad que buscas.
              </li>
            </ol>
            <p className="mt-6 text-sm text-dom-400">
              Revisamos todas las postulaciones y respondemos, aunque no haya un proyecto
              abierto en ese momento.
            </p>
          </div>
        </div>
      </Section>

      <Section tone="white">
        <SectionHeading
          eyebrow="Cultura"
          title="Cómo es trabajar con nosotros"
          intro="Los mismos compromisos que ofrecemos a los clientes rigen hacia adentro."
        />
        <div className="grid gap-6 sm:grid-cols-2">
          {valores.map((v) => (
            <div key={v.titulo} className="rounded-3xl border border-paper-300 bg-paper-100 p-7">
              <h3 className="dom-display text-xl text-dom-900">{v.titulo}</h3>
              <p className="mt-3 leading-relaxed text-dom-600">{v.detalle}</p>
            </div>
          ))}
        </div>
      </Section>

      <CtaBand
        titulo="¿Prefieres que hablemos primero?"
        texto="Si tienes dudas sobre la modalidad de colaboración, escríbenos y coordinamos una llamada."
        etiqueta="Contáctanos"
      />
    </>
  );
}
