import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ROLE_LABELS } from "@/lib/rbac";
import { AppNav } from "@/components/app-nav";
import { Icon } from "@/components/icons";
import { UserMenu } from "@/components/user-menu";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const company = user.companyId
    ? await prisma.company.findUnique({
        where: { id: user.companyId },
        select: { name: true, logoUrl: true },
      })
    : null;

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[248px_1fr]">
      <aside className="hidden border-r border-sand-200 bg-white lg:flex lg:flex-col">
        <Link href="/dashboard" className="flex items-center gap-2.5 px-6 py-6">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">
            <Icon.route className="h-5 w-5" />
          </span>
          <span className="text-lg font-bold text-ink-900">Ruta</span>
        </Link>

        {company && (
          <div className="mx-4 mb-4 rounded-xl bg-sand-100 px-3.5 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">
              Empresa
            </p>
            <p className="truncate text-sm font-semibold text-ink-900">{company.name}</p>
          </div>
        )}

        <AppNav role={user.role} className="flex-1 px-3" />

        <div className="border-t border-sand-200 px-4 py-4">
          <p className="truncate text-sm font-semibold text-ink-900">{user.name}</p>
          <p className="truncate text-xs text-ink-400">{ROLE_LABELS[user.role]}</p>
          <UserMenu />
        </div>
      </aside>

      <div className="flex min-h-dvh flex-col">
        <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-sand-200 bg-sand-100/90 px-5 py-3 backdrop-blur lg:hidden">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
              <Icon.route className="h-4 w-4" />
            </span>
            <span className="font-bold text-ink-900">Ruta</span>
          </Link>
          <UserMenu compact />
        </header>

        <AppNav role={user.role} variant="mobile" className="lg:hidden" />

        <main className="flex-1 px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
