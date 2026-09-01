"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { PlanStatus } from "@prisma/client";
import { api, ApiError } from "@/lib/client-api";
import { Icon } from "@/components/icons";

export function PlanActions({
  planId, status, canEdit,
}: {
  planId: string; status: PlanStatus; canEdit: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function newVersion() {
    setBusy("version");
    setError(null);
    try {
      const result = await api.post<{ planId: string }>(`/api/plans/${planId}/version`);
      router.push(`/planes/${result.planId}/wizard/revisar`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No pudimos crear la versión.");
      setBusy(null);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {error && (
        <span className="text-xs text-[color:var(--color-danger)]">{error}</span>
      )}

      {status === "DRAFT" ? (
        canEdit && (
          <Link href={`/planes/${planId}/wizard`} className="btn-primary">
            Continuar el plan
            <Icon.arrowRight className="h-4 w-4" />
          </Link>
        )
      ) : (
        <>
          <a href={`/api/plans/${planId}/pdf`} className="btn-primary" download>
            <Icon.download className="h-4 w-4" />
            Descargar PDF
          </a>
          <Link href={`/documento/${planId}`} className="btn-secondary" target="_blank">
            Ver documento
          </Link>
          {canEdit && (
            <button
              type="button"
              onClick={newVersion}
              disabled={busy === "version"}
              className="btn-secondary"
            >
              <Icon.edit className="h-4 w-4" />
              {busy === "version" ? "Creando…" : "Nueva versión"}
            </button>
          )}
        </>
      )}
    </div>
  );
}
