import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { WIZARD_STEPS } from "@/lib/constants";
import { getPlanForPage } from "@/lib/plans";

export const dynamic = "force-dynamic";

/** Retoma el asistente en el último paso alcanzado. */
export default async function WizardEntry({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser();
  const plan = await getPlanForPage(id, { ...user, id: user.sub });
  if (plan.status !== "DRAFT") redirect(`/planes/${plan.id}`);

  const step = WIZARD_STEPS.find((s) => s.step === plan.wizardStep) ?? WIZARD_STEPS[0];
  redirect(`/planes/${plan.id}/wizard/${step.slug}`);
}
