"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Icon } from "@/components/icons";
import { Logo } from "@/components/sitio/logo";
import { navegacion, servicios } from "@/lib/domina";

/**
 * Cabecera del sitio público: fija, con menú desplegable de servicios en
 * escritorio y panel completo en móvil.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const [abierto, setAbierto] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // El menú móvil se cierra al navegar para no tapar la página de destino.
  useEffect(() => {
    setAbierto(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Con el panel móvil abierto se bloquea el desplazamiento del documento.
  useEffect(() => {
    document.body.style.overflow = abierto ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [abierto]);

  const activo = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-200 ${
        scrolled
          ? "border-b border-paper-300 bg-paper-100/90 backdrop-blur-md"
          : "border-b border-transparent bg-paper-100"
      }`}
    >
      <div className="dom-wrap flex h-20 items-center justify-between gap-6">
        <Link href="/" aria-label="Domina — inicio">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Principal">
          {navegacion.map((item) =>
            item.href === "/servicios" ? (
              <div key={item.href} className="group relative">
                <Link
                  href={item.href}
                  className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    activo(item.href)
                      ? "text-[color:var(--color-copper-700)]"
                      : "text-dom-700 hover:text-dom-900"
                  }`}
                >
                  {item.label}
                  <svg
                    viewBox="0 0 24 24"
                    className="h-3.5 w-3.5 transition-transform group-hover:rotate-180"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
                <div className="invisible absolute left-1/2 top-full w-[26rem] -translate-x-1/2 pt-3 opacity-0 transition-all duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  <div className="rounded-3xl border border-paper-300 bg-white p-3 shadow-[var(--shadow-dom-lift)]">
                    {servicios.map((s) => (
                      <Link
                        key={s.slug}
                        href={`/servicios/${s.slug}`}
                        className="flex items-start gap-3 rounded-2xl p-3 transition-colors hover:bg-paper-100"
                      >
                        <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-dom-900 text-[color:var(--color-copper-400)]">
                          {(() => {
                            const Cmp = Icon[s.icono];
                            return <Cmp className="h-4.5 w-4.5" />;
                          })()}
                        </span>
                        <span>
                          <span className="block text-sm font-semibold text-dom-900">
                            {s.nombre}
                          </span>
                          <span className="mt-0.5 block text-xs leading-snug text-dom-500">
                            {s.linea}
                          </span>
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  activo(item.href)
                    ? "text-[color:var(--color-copper-700)]"
                    : "text-dom-700 hover:text-dom-900"
                }`}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/contacto" className="dom-btn-primary hidden sm:inline-flex">
            Agenda una reunión
          </Link>
          <button
            type="button"
            onClick={() => setAbierto((v) => !v)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-paper-300 text-dom-800 lg:hidden"
            aria-expanded={abierto}
            aria-controls="menu-movil"
            aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
              {abierto ? (
                <path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {abierto ? (
        <div
          id="menu-movil"
          className="fixed inset-x-0 bottom-0 top-20 z-40 overflow-y-auto border-t border-paper-300 bg-paper-100 lg:hidden"
        >
          <nav className="dom-wrap flex flex-col gap-1 py-6" aria-label="Principal móvil">
            {navegacion.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-2xl px-4 py-3.5 text-lg font-medium text-dom-900 hover:bg-white"
              >
                {item.label}
              </Link>
            ))}
            <p className="mt-4 px-4 dom-eyebrow">Líneas de servicio</p>
            {servicios.map((s) => (
              <Link
                key={s.slug}
                href={`/servicios/${s.slug}`}
                className="rounded-2xl px-4 py-3 text-[15px] text-dom-600 hover:bg-white"
              >
                {s.nombre}
              </Link>
            ))}
            <Link href="/contacto" className="dom-btn-primary mt-6">
              Agenda una reunión
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
