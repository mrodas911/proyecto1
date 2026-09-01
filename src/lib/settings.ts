/**
 * Lectura y escritura de las reglas de negocio configurables.
 *
 * NADA de esto vive en el código de las pantallas: el administrador las edita
 * y el sistema las lee en caliente.
 *
 * Resolución: valor de la empresa → valor global → valor por defecto.
 */
import "server-only";
import { prisma } from "./prisma";
import { DEFAULT_RULES, type PlatformRules } from "./rules";

export { DEFAULT_RULES, RULE_LABELS, toolQuota } from "./rules";
export type { PlatformRules } from "./rules";

const RULES_KEY = "rules";

export async function getRules(companyId?: string | null): Promise<PlatformRules> {
  const rows = await prisma.companySetting.findMany({
    where: {
      key: RULES_KEY,
      OR: companyId ? [{ companyId: null }, { companyId }] : [{ companyId: null }],
    },
  });
  const global = rows.find((r) => r.companyId === null)?.value ?? {};
  const scoped = rows.find((r) => r.companyId === companyId)?.value ?? {};
  return {
    ...DEFAULT_RULES,
    ...(global as Partial<PlatformRules>),
    ...(scoped as Partial<PlatformRules>),
  };
}

export async function saveRules(
  companyId: string | null,
  patch: Partial<PlatformRules>
): Promise<PlatformRules> {
  const current = await getRules(companyId);
  const next: PlatformRules = { ...current, ...patch };
  // Postgres permite duplicados sobre índices únicos con NULL, por lo que el
  // registro global (companyId = null) se resuelve a mano en lugar de upsert.
  const existing = await prisma.companySetting.findFirst({
    where: { key: RULES_KEY, companyId },
  });
  if (existing) {
    await prisma.companySetting.update({ where: { id: existing.id }, data: { value: next } });
  } else {
    await prisma.companySetting.create({ data: { companyId, key: RULES_KEY, value: next } });
  }
  return next;
}
