"use client";

import Link from "next/link";
import { WIZARD_STEPS } from "@/lib/constants";
import { Icon } from "@/components/icons";

/**
 * Barra superior de progreso. El usuario siempre debe saber dónde está,
 * cuánto le falta y a qué puede volver.
 */
export function WizardProgress({
  planId, current, reached,
}: {
  planId: string; current: number; reached: number;
}) {
  const pct = Math.round(((current - 1) / (WIZARD_STEPS.length - 1)) * 100);

  return (
    <div className="mb-8">
      <div className="mb-3 flex items-baseline justify-between">
        <p className="text-sm font-semibold text-ink-900">
          Paso {current} de {WIZARD_STEPS.length}
          <span className="ml-2 font-normal text-ink-400">
            {WIZARD_STEPS[current - 1]?.label}
          </span>
        </p>
        <p className="text-xs text-ink-400">{pct}% del recorrido</p>
      </div>

      <ol className="hidden gap-1 md:flex">
        {WIZARD_STEPS.map((step) => {
          const done = step.step < current;
          const isCurrent = step.step === current;
          const reachable = step.step <= Math.max(reached, current);
          const content = (
            <span
              className={`flex flex-col gap-1.5 rounded-lg px-2 py-1.5 transition-colors ${
                reachable ? "cursor-pointer hover:bg-sand-200" : "cursor-default"
              }`}
            >
              <span
                className={`h-1.5 rounded-full ${
                  done ? "bg-brand-500" : isCurrent ? "bg-brand-400" : "bg-sand-300"
                }`}
              />
              <span
                className={`flex items-center gap-1 text-[11px] font-medium ${
                  isCurrent ? "text-brand-700" : done ? "text-ink-500" : "text-ink-400"
                }`}
              >
                {done && <Icon.check className="h-3 w-3" />}
                {step.label}
              </span>
            </span>
          );
          return (
            <li key={step.step} className="flex-1">
              {reachable && !isCurrent ? (
                <Link href={`/planes/${planId}/wizard/${step.slug}`}>{content}</Link>
              ) : (
                content
              )}
            </li>
          );
        })}
      </ol>

      <div className="h-1.5 overflow-hidden rounded-full bg-sand-300 md:hidden">
        <div
          className="h-full rounded-full bg-brand-500 transition-all duration-500"
          style={{ width: `${Math.max(pct, 4)}%` }}
        />
      </div>
    </div>
  );
}
