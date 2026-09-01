"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { DevelopmentType, Methodology } from "@prisma/client";
import { api, ApiError } from "@/lib/client-api";
import { DEVELOPMENT_TYPE_LABELS, METHODOLOGY_LABELS, STAGE_ORDER } from "@/lib/constants";
import { Alert, Field } from "@/components/ui";
import { Icon, ToolIcon } from "@/components/icons";

type Tool = {
  id: string;
  name: string;
  slug: string;
  description: string;
  methodology: Methodology;
  icon: string;
  isCore: boolean;
  developmentType: DevelopmentType;
  active: boolean;
  order: number;
  counts: { activities: number; planActivities: number };
};

const EMPTY = {
  name: "", slug: "", description: "",
  methodology: "M70" as Methodology, icon: "sparkles",
  isCore: true, developmentType: "BOTH" as DevelopmentType, order: 99,
};

export function ToolsManager({
  tools, quotaCurrent, quotaFuture,
}: {
  tools: Tool[]; quotaCurrent: number; quotaFuture: number;
}) {
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const core = tools.filter((tool) => tool.isCore && tool.active);

  async function create(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    try {
      await api.post("/api/admin/tools", form);
      setForm(EMPTY);
      setCreating(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No pudimos crear la herramienta.");
    }
  }

  async function toggle(tool: Tool) {
    await api.patch(`/api/admin/tools/${tool.id}`, { active: !tool.active });
    router.refresh();
  }

  return (
    <div className="space-y-6">
      {error && <Alert tone="danger">{error}</Alert>}

      <Alert tone="info" title="Catálogo principal">
        Hay {core.length} herramientas activas en el catálogo principal. Los planes de puesto
        actual pueden combinar {quotaCurrent} y los de posición futura, {quotaFuture}. Esos
        números se editan en la pestaña <strong>Reglas</strong>.
      </Alert>

      <div className="flex items-center justify-between">
        <h2 className="section-title">
          {tools.length} herramienta{tools.length === 1 ? "" : "s"}
        </h2>
        <button type="button" onClick={() => setCreating((v) => !v)} className="btn-primary">
          <Icon.plus className="h-4 w-4" />
          Nueva herramienta
        </button>
      </div>

      {creating && (
        <form onSubmit={create} className="card grid gap-4 px-6 py-6 sm:grid-cols-2">
          <Field label="Nombre" required>
            <input className="input" required value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                  slug: e.target.value
                    .toLowerCase()
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/^-|-$/g, ""),
                })
              } />
          </Field>
          <Field label="Identificador">
            <input className="input" required value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Descripción" required>
              <textarea className="input min-h-20" required value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </Field>
          </div>
          <Field label="Etapa">
            <select className="input" value={form.methodology}
              onChange={(e) => setForm({ ...form, methodology: e.target.value as Methodology })}>
              {STAGE_ORDER.map((m) => (
                <option key={m} value={m}>{METHODOLOGY_LABELS[m]}</option>
              ))}
            </select>
          </Field>
          <Field label="Tipo de desarrollo">
            <select className="input" value={form.developmentType}
              onChange={(e) =>
                setForm({ ...form, developmentType: e.target.value as DevelopmentType })
              }>
              {(["BOTH", "CURRENT", "FUTURE"] as DevelopmentType[]).map((t) => (
                <option key={t} value={t}>{DEVELOPMENT_TYPE_LABELS[t]}</option>
              ))}
            </select>
          </Field>
          <label className="flex items-center gap-2 text-sm text-ink-700 sm:col-span-2">
            <input type="checkbox" checked={form.isCore}
              onChange={(e) => setForm({ ...form, isCore: e.target.checked })} />
            Pertenece al catálogo principal (cuenta para la cuota de herramientas del plan)
          </label>
          <div className="sm:col-span-2">
            <button type="submit" className="btn-primary">Crear herramienta</button>
          </div>
        </form>
      )}

      <ul className="grid gap-3 md:grid-cols-2">
        {tools.map((tool) => (
          <li key={tool.id} className="card px-5 py-5">
            <div className="flex items-start gap-3">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sand-100 text-brand-600">
                <ToolIcon name={tool.icon} className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-ink-900">
                  {tool.name}
                  {!tool.active && (
                    <span className="ml-2 chip bg-sand-200 text-ink-500">Inactiva</span>
                  )}
                  {!tool.isCore && (
                    <span className="ml-2 chip-neutral">Fuera del catálogo principal</span>
                  )}
                </p>
                <p className="mt-1 text-xs text-ink-400">
                  {METHODOLOGY_LABELS[tool.methodology]} ·{" "}
                  {DEVELOPMENT_TYPE_LABELS[tool.developmentType]} · {tool.counts.activities}{" "}
                  actividades · usada en {tool.counts.planActivities} acciones de planes
                </p>
                <p className="mt-2 text-sm text-ink-500">{tool.description}</p>
                <button type="button" onClick={() => toggle(tool)} className="btn-ghost mt-3 px-2 text-xs">
                  {tool.active ? "Desactivar" : "Activar"}
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
