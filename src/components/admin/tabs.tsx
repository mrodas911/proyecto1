"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/admin", label: "Resumen" },
  { href: "/admin/empresas", label: "Empresas" },
  { href: "/admin/competencias", label: "Competencias" },
  { href: "/admin/actividades", label: "Actividades" },
  { href: "/admin/herramientas", label: "Herramientas" },
  { href: "/admin/reglas", label: "Reglas" },
];

export function AdminTabs() {
  const pathname = usePathname();
  return (
    <nav className="mb-8 flex gap-1 overflow-x-auto border-b border-sand-200">
      {TABS.map((tab) => {
        const active = tab.href === "/admin" ? pathname === tab.href : pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`shrink-0 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
              active
                ? "border-brand-600 text-brand-700"
                : "border-transparent text-ink-500 hover:text-ink-900"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
