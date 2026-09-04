import type { Metadata } from "next";
import { SiteHeader } from "@/components/sitio/header";
import { SiteFooter } from "@/components/sitio/footer";
import { empresa } from "@/lib/domina";

export const metadata: Metadata = {
  title: {
    default: `${empresa.nombre} — ${empresa.claim} en ${empresa.ciudad}`,
    template: `%s · ${empresa.nombre}`,
  },
  description:
    "Consultora cuencana de estrategia y crecimiento empresarial: estrategia comercial, marketing digital, formación de equipos, selección de talento e inteligencia artificial aplicada.",
  keywords: [
    "consultora Cuenca",
    "consultoría empresarial Ecuador",
    "estrategia comercial",
    "capacitación de equipos",
    "reclutamiento y selección",
    "marketing digital Cuenca",
  ],
  openGraph: {
    type: "website",
    locale: "es_EC",
    siteName: empresa.nombreLargo,
    title: `${empresa.nombre} — ${empresa.claim}`,
    description:
      "Consultoría de estrategia, crecimiento comercial y desarrollo de talento desde Cuenca para las empresas del Ecuador.",
  },
};

/**
 * Envoltura del sitio público. La aplicación (planes de desarrollo) vive en
 * otro grupo de rutas y conserva su propio sistema visual.
 */
export default function SitioLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Fuente editorial solo para el sitio público; el resto usa Inter. */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&display=swap"
      />
      <div className="flex min-h-dvh flex-col bg-paper-100">
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-dom-900 focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-white"
        >
          Saltar al contenido
        </a>
        <SiteHeader />
        <main id="contenido" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </div>
    </>
  );
}
