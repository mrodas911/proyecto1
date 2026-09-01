import Link from "next/link";
import type { ReactNode } from "react";
import { Icon } from "@/components/icons";

export function AuthShell({
  title, subtitle, children, footer,
}: {
  title: string; subtitle: string; children: ReactNode; footer?: ReactNode;
}) {
  return (
    <main className="grid min-h-dvh lg:grid-cols-[1.1fr_1fr]">
      <section className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm animate-rise">
          <Link href="/" className="mb-10 inline-flex items-center gap-2.5">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">
              <Icon.route className="h-5 w-5" />
            </span>
            <span className="text-lg font-bold text-ink-900">Ruta</span>
          </Link>
          <h1 className="text-2xl font-bold text-ink-900">{title}</h1>
          <p className="mb-8 mt-2 text-sm text-ink-500">{subtitle}</p>
          {children}
          {footer && <div className="mt-6 text-sm text-ink-500">{footer}</div>}
        </div>
      </section>

      <aside className="relative hidden overflow-hidden bg-brand-800 lg:block">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, #4f958a 0, transparent 45%), radial-gradient(circle at 80% 70%, #2f7a70 0, transparent 45%)",
          }}
        />
        <div className="relative flex h-full flex-col justify-end p-14 text-white">
          <blockquote className="max-w-md text-2xl font-semibold leading-snug">
            No tuve que inventarme un plan de desarrollo. La plataforma me ayudó a
            construirlo.
          </blockquote>
          <p className="mt-5 text-sm text-brand-100">
            Diagnosticar · Priorizar · Diseñar · Ejecutar · Desarrollar
          </p>
        </div>
      </aside>
    </main>
  );
}
