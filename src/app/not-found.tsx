import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh items-center justify-center px-6">
      <div className="max-w-md text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-600">
          Error 404
        </p>
        <h1 className="mt-3 text-2xl font-bold text-ink-900">
          No encontramos esta página
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-500">
          Puede que el enlace haya cambiado o que no tengas acceso a este contenido.
        </p>
        <Link href="/dashboard" className="btn-primary mt-7">
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}
