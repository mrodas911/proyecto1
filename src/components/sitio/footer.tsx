import Link from "next/link";
import { Logo } from "@/components/sitio/logo";
import { empresa, redes, servicios } from "@/lib/domina";

export function SiteFooter() {
  const anio = new Date().getFullYear();
  const activas = redes.filter((r) => r.href);

  return (
    <footer className="bg-dom-950 text-dom-200">
      <div className="dom-wrap grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr] md:py-20">
        <div>
          <Logo tone="light" />
          <p className="mt-5 max-w-sm leading-relaxed text-dom-300">
            Consultoría de estrategia, crecimiento comercial y desarrollo de talento.
            Desde {empresa.ciudad} para las empresas del Ecuador.
          </p>
          <p className="mt-6 text-sm text-dom-400">
            Fundada por {empresa.fundador}.
          </p>
          {activas.length > 0 ? (
            <ul className="mt-6 flex gap-4">
              {activas.map((r) => (
                <li key={r.nombre}>
                  <a
                    href={r.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-dom-200 underline-offset-4 hover:text-[color:var(--color-copper-400)] hover:underline"
                  >
                    {r.nombre}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <nav aria-label="Servicios">
          <h2 className="dom-eyebrow-light">Servicios</h2>
          <ul className="mt-5 space-y-3">
            {servicios.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/servicios/${s.slug}`}
                  className="text-[15px] text-dom-200 transition-colors hover:text-[color:var(--color-copper-400)]"
                >
                  {s.nombre}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="dom-eyebrow-light">Contacto</h2>
          <ul className="mt-5 space-y-3 text-[15px]">
            <li>
              <a
                href={`mailto:${empresa.email}`}
                className="transition-colors hover:text-[color:var(--color-copper-400)]"
              >
                {empresa.email}
              </a>
            </li>
            <li>
              <a
                href={`tel:${empresa.telefonoEnlace}`}
                className="transition-colors hover:text-[color:var(--color-copper-400)]"
              >
                {empresa.telefono}
              </a>
            </li>
            <li className="text-dom-300">{empresa.direccion}</li>
            <li className="text-dom-400">{empresa.horario}</li>
          </ul>
          <ul className="mt-6 space-y-3 text-[15px]">
            <li>
              <Link href="/acerca-de" className="transition-colors hover:text-[color:var(--color-copper-400)]">
                Acerca de
              </Link>
            </li>
            <li>
              <Link
                href="/colabora-con-nosotros"
                className="transition-colors hover:text-[color:var(--color-copper-400)]"
              >
                Colabora con nosotros
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="dom-wrap flex flex-col gap-3 py-6 text-sm text-dom-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {anio} {empresa.nombreLargo}. {empresa.ciudad}, {empresa.pais}.
          </p>
          <Link href="/ruta" className="transition-colors hover:text-[color:var(--color-copper-400)]">
            Ruta — nuestra plataforma de desarrollo
          </Link>
        </div>
      </div>
    </footer>
  );
}
