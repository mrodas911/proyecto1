"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Role } from "@prisma/client";
import { Icon, type IconName } from "@/components/icons";

type Item = { href: string; label: string; icon: IconName; roles: Role[] };

const ITEMS: Item[] = [
  { href: "/dashboard", label: "Inicio", icon: "home", roles: ["SUPERADMIN", "COMPANY_ADMIN", "LEADER", "EMPLOYEE"] },
  { href: "/planes", label: "Mis planes", icon: "route", roles: ["SUPERADMIN", "COMPANY_ADMIN", "LEADER", "EMPLOYEE"] },
  { href: "/colaboradores", label: "Colaboradores", icon: "users", roles: ["SUPERADMIN", "COMPANY_ADMIN", "LEADER"] },
  { href: "/biblioteca", label: "Biblioteca", icon: "library", roles: ["SUPERADMIN", "COMPANY_ADMIN", "LEADER"] },
  { href: "/equipo", label: "Usuarios", icon: "building", roles: ["COMPANY_ADMIN"] },
  { href: "/admin", label: "Administración", icon: "settings", roles: ["SUPERADMIN"] },
  { href: "/ayuda", label: "Ayuda", icon: "help", roles: ["SUPERADMIN", "COMPANY_ADMIN", "LEADER", "EMPLOYEE"] },
];

export function AppNav({
  role, className = "", variant = "sidebar",
}: {
  role: Role; className?: string; variant?: "sidebar" | "mobile";
}) {
  const pathname = usePathname();
  const items = ITEMS.filter((item) => item.roles.includes(role));

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  if (variant === "mobile") {
    return (
      <nav className={`flex gap-1 overflow-x-auto border-b border-sand-200 bg-white px-3 py-2 ${className}`}>
        {items.map((item) => {
          const Cmp = Icon[item.icon];
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive(item.href)
                  ? "bg-brand-50 text-brand-700"
                  : "text-ink-500 hover:bg-sand-100"
              }`}
            >
              <Cmp className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <nav className={`space-y-1 ${className}`}>
      {items.map((item) => {
        const Cmp = Icon[item.icon];
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive(item.href) ? "page" : undefined}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive(item.href)
                ? "bg-brand-50 text-brand-700"
                : "text-ink-500 hover:bg-sand-100 hover:text-ink-900"
            }`}
          >
            <Cmp className="h-5 w-5" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
