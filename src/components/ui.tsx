import Link from "next/link";
import type { ReactNode } from "react";
import type { Methodology, PlanStatus } from "@prisma/client";
import { METHODOLOGY_SHORT, STAGES, STATUS_LABELS } from "@/lib/constants";

export function PageHeader({
  eyebrow, title, subtitle, actions,
}: {
  eyebrow?: string; title: string; subtitle?: string; actions?: ReactNode;
}) {
  return (
    <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && (
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-brand-600">
            {eyebrow}
          </p>
        )}
        <h1 className="text-2xl font-bold text-ink-900 sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-2 max-w-2xl text-sm text-ink-500">{subtitle}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
    </header>
  );
}

export function EmptyState({
  icon, title, description, action,
}: {
  icon?: ReactNode; title: string; description: string; action?: ReactNode;
}) {
  return (
    <div className="card flex flex-col items-center gap-3 px-6 py-14 text-center">
      {icon && <div className="text-brand-400">{icon}</div>}
      <h3 className="text-base font-semibold text-ink-900">{title}</h3>
      <p className="max-w-md text-sm text-ink-500">{description}</p>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

export function StageBadge({ methodology }: { methodology: Methodology }) {
  const cls =
    methodology === "M10" ? "chip-m10" : methodology === "M20" ? "chip-m20" : "chip-m70";
  return (
    <span className={cls}>
      {METHODOLOGY_SHORT[methodology]} · {STAGES[methodology].title}
    </span>
  );
}

const STATUS_STYLES: Record<PlanStatus, string> = {
  DRAFT: "bg-sand-200 text-ink-700",
  FINALIZED: "bg-brand-50 text-brand-700",
  DOWNLOADED: "bg-brand-100 text-brand-800",
  IN_PROGRESS: "bg-[color:var(--color-m20-soft)] text-[color:var(--color-m20)]",
  COMPLETED: "bg-emerald-100 text-emerald-800",
};

export function StatusBadge({ status }: { status: PlanStatus }) {
  return <span className={`chip ${STATUS_STYLES[status]}`}>{STATUS_LABELS[status]}</span>;
}

export function ProgressBar({
  value, tone = "brand", className = "",
}: {
  value: number; tone?: "brand" | "warning"; className?: string;
}) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className={`h-2 w-full overflow-hidden rounded-full bg-sand-200 ${className}`}>
      <div
        className={`h-full rounded-full transition-all duration-500 ${
          tone === "warning" ? "bg-[color:var(--color-warning)]" : "bg-brand-500"
        }`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export function Stat({
  label, value, hint,
}: {
  label: string; value: ReactNode; hint?: string;
}) {
  return (
    <div className="card px-5 py-4">
      <p className="text-xs font-medium uppercase tracking-wide text-ink-400">{label}</p>
      <p className="mt-1.5 text-2xl font-bold text-ink-900">{value}</p>
      {hint && <p className="mt-1 text-xs text-ink-400">{hint}</p>}
    </div>
  );
}

export function Field({
  label, hint, children, required,
}: {
  label: string; hint?: string; children: ReactNode; required?: boolean;
}) {
  return (
    <div>
      <label className="label">
        {label}
        {required && <span className="ml-1 text-[color:var(--color-danger)]">*</span>}
      </label>
      {children}
      {hint && <p className="hint">{hint}</p>}
    </div>
  );
}

export function Alert({
  tone = "info", title, children,
}: {
  tone?: "info" | "warning" | "danger" | "success"; title?: string; children: ReactNode;
}) {
  const styles = {
    info: "border-brand-200 bg-brand-50 text-brand-800",
    warning: "border-amber-200 bg-amber-50 text-amber-900",
    danger: "border-red-200 bg-red-50 text-red-900",
    success: "border-emerald-200 bg-emerald-50 text-emerald-900",
  }[tone];
  return (
    <div className={`rounded-xl border px-4 py-3 text-sm ${styles}`}>
      {title && <p className="mb-1 font-semibold">{title}</p>}
      {children}
    </div>
  );
}

export function BackLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-brand-700">
      <span aria-hidden>←</span> {children}
    </Link>
  );
}
