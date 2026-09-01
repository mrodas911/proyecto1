/**
 * Matriz de permisos. Centraliza qué puede hacer cada rol, de modo que las
 * políticas corporativas de privacidad se ajusten en un único lugar.
 */
import type { Role } from "@prisma/client";

export const PERMISSIONS = {
  "company.manage": ["SUPERADMIN"],
  "company.settings": ["SUPERADMIN", "COMPANY_ADMIN"],
  "catalog.manage": ["SUPERADMIN"],
  "catalog.manageCompany": ["SUPERADMIN", "COMPANY_ADMIN"],
  "users.manage": ["SUPERADMIN", "COMPANY_ADMIN"],
  "employees.manage": ["SUPERADMIN", "COMPANY_ADMIN", "LEADER"],
  "plans.create": ["SUPERADMIN", "COMPANY_ADMIN", "LEADER"],
  "plans.edit": ["SUPERADMIN", "COMPANY_ADMIN", "LEADER"],
  "plans.viewAll": ["SUPERADMIN", "COMPANY_ADMIN"],
  "plans.viewTeam": ["SUPERADMIN", "COMPANY_ADMIN", "LEADER"],
  "plans.viewOwn": ["SUPERADMIN", "COMPANY_ADMIN", "LEADER", "EMPLOYEE"],
  "plans.download": ["SUPERADMIN", "COMPANY_ADMIN", "LEADER", "EMPLOYEE"],
  /// Datos sensibles: desempeño, potencial y aspiración.
  "diagnostic.read": ["SUPERADMIN", "COMPANY_ADMIN", "LEADER"],
  "diagnostic.write": ["SUPERADMIN", "COMPANY_ADMIN", "LEADER"],
  "stats.read": ["SUPERADMIN", "COMPANY_ADMIN"],
} as const satisfies Record<string, readonly Role[]>;

export type Permission = keyof typeof PERMISSIONS;

export function can(role: Role, permission: Permission): boolean {
  return (PERMISSIONS[permission] as readonly Role[]).includes(role);
}

export const ROLE_LABELS: Record<Role, string> = {
  SUPERADMIN: "Superadministrador",
  COMPANY_ADMIN: "Administrador de empresa",
  LEADER: "Líder",
  EMPLOYEE: "Colaborador",
};
