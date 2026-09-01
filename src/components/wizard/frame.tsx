"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { WIZARD_STEPS } from "@/lib/constants";
import { Icon } from "@/components/icons";
import { WizardProgress } from "./progress";
import { SaveIndicator } from "./save-state";

export type WizardHeader = {
  planId: string;
  step: number;
  reachedStep: number;
  personName: string;
  personRole: string;
};

/**
 * Marco común de todos los pasos: identidad de la persona, progreso, título,
 * contenido y navegación. El proveedor de autoguardado vive en el layout del
 * asistente, por encima de este componente.
 */
export function WizardFrame({
  header, title, question, hint, children, nextDisabled, nextLabel, onBeforeNext,
}: {
  header: WizardHeader;
  title: string;
  question: string;
  hint?: string;
  children: React.ReactNode;
  nextDisabled?: boolean;
  nextLabel?: string;
  onBeforeNext?: () => Promise<boolean>;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const previous = WIZARD_STEPS[header.step - 2];
  const next = WIZARD_STEPS[header.step];

  async function goNext() {
    if (!next) return;
    setBusy(true);
    try {
      if (onBeforeNext) {
        const canContinue = await onBeforeNext();
        if (!canContinue) return;
      }
      router.push(`/planes/${header.planId}/wizard/${next.slug}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="animate-rise">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link
          href={`/planes/${header.planId}`}
          className="inline-flex items-center gap-2 text-sm text-ink-500 hover:text-brand-700"
        >
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
            {header.personName
              .split(" ")
              .map((p) => p[0])
              .slice(0, 2)
              .join("")}
          </span>
          <span>
            <span className="block font-semibold text-ink-900">{header.personName}</span>
            <span className="block text-xs text-ink-400">{header.personRole}</span>
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <SaveIndicator />
          <Link href="/planes" className="btn-ghost text-xs">
            Guardar y continuar después
          </Link>
        </div>
      </div>

      <WizardProgress planId={header.planId} current={header.step} reached={header.reachedStep} />

      <header className="mb-7">
        <p className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-brand-600">
          {title}
        </p>
        <h1 className="text-2xl font-bold text-ink-900 sm:text-3xl">{question}</h1>
        {hint && <p className="mt-2 max-w-2xl text-sm text-ink-500">{hint}</p>}
      </header>

      {children}

      <nav className="mt-10 flex items-center justify-between gap-3 border-t border-sand-200 pt-6">
        {previous ? (
          <Link
            href={`/planes/${header.planId}/wizard/${previous.slug}`}
            className="btn-secondary"
          >
            <Icon.arrowLeft className="h-4 w-4" />
            Atrás
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <button
            type="button"
            onClick={goNext}
            disabled={nextDisabled || busy}
            className="btn-primary btn-lg"
          >
            {nextLabel ?? "Continuar"}
            <Icon.arrowRight className="h-5 w-5" />
          </button>
        )}
      </nav>
    </div>
  );
}
