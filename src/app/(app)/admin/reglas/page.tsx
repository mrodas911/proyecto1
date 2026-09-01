import type { Metadata } from "next";
import { DEFAULT_RULES, getRules } from "@/lib/settings";
import { RulesForm } from "@/components/admin/rules-form";

export const metadata: Metadata = { title: "Reglas" };
export const dynamic = "force-dynamic";

export default async function AdminRulesPage() {
  const rules = await getRules(null);
  return <RulesForm initial={rules} defaults={DEFAULT_RULES} />;
}
