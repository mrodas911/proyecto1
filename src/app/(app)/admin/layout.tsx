import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { AdminTabs } from "@/components/admin/tabs";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireRole("SUPERADMIN");
  return (
    <div>
      <div className="mb-6">
        <p className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-brand-600">
          Administración de la plataforma
        </p>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-bold text-ink-900">Panel del consultor</h1>
          <Link href="/dashboard" className="btn-ghost text-sm">
            Volver a la aplicación
          </Link>
        </div>
      </div>
      <AdminTabs />
      {children}
    </div>
  );
}
