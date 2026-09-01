"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { api, ApiError } from "@/lib/client-api";
import { ROLE_LABELS } from "@/lib/rbac";
import { RULE_LABELS, type PlatformRules } from "@/lib/rules";
import { Alert, Field } from "@/components/ui";
import { Icon } from "@/components/icons";

type Company = {
  id: string;
  name: string;
  slug: string;
  logoUrl: string;
  primaryColor: string;
  pdfCoverNote: string;
  maxUsers: number;
  commercialPlan: string;
  active: boolean;
  counts: { users: number; employees: number; plans: number };
  codes: {
    id: string; code: string; role: string;
    uses: number; maxUses: number; expiresAt: string | null;
  }[];
  rules: PlatformRules;
};

export function CompaniesManager({
  companies, defaults,
}: {
  companies: Company[]; defaults: PlatformRules;
}) {
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", slug: "", maxUsers: 25, commercialPlan: "STARTER" });

  async function createCompany(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    try {
      await api.post("/api/admin/companies", form);
      setForm({ name: "", slug: "", maxUsers: 25, commercialPlan: "STARTER" });
      setCreating(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No pudimos crear la empresa.");
    }
  }

  return (
    <div className="space-y-6">
      {error && <Alert tone="danger">{error}</Alert>}

      <div className="flex items-center justify-between">
        <h2 className="section-title">
          {companies.length} empresa{companies.length === 1 ? "" : "s"}
        </h2>
        <button type="button" onClick={() => setCreating((v) => !v)} className="btn-primary">
          <Icon.plus className="h-4 w-4" />
          Nueva empresa
        </button>
      </div>

      {creating && (
        <form onSubmit={createCompany} className="card grid gap-4 px-6 py-6 sm:grid-cols-2">
          <Field label="Nombre" required>
            <input
              className="input" required value={form.name}
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
              }
            />
          </Field>
          <Field label="Identificador" hint="Se usa en las direcciones y en los códigos de acceso.">
            <input
              className="input" required value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
            />
          </Field>
          <Field label="Usuarios permitidos">
            <input
              type="number" min={1} className="input" value={form.maxUsers}
              onChange={(e) => setForm({ ...form, maxUsers: Number(e.target.value) })}
            />
          </Field>
          <Field label="Plan comercial">
            <select
              className="input" value={form.commercialPlan}
              onChange={(e) => setForm({ ...form, commercialPlan: e.target.value })}
            >
              <option value="STARTER">Starter</option>
              <option value="PROFESIONAL">Profesional</option>
              <option value="CORPORATIVO">Corporativo</option>
            </select>
          </Field>
          <div className="sm:col-span-2">
            <button type="submit" className="btn-primary">Crear empresa</button>
          </div>
        </form>
      )}

      <ul className="space-y-3">
        {companies.map((company) => (
          <li key={company.id} className="card px-6 py-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-ink-900">
                  {company.name}
                  {!company.active && (
                    <span className="ml-2 chip bg-red-100 text-red-800">Desactivada</span>
                  )}
                </p>
                <p className="text-xs text-ink-400">
                  {company.slug} · {company.commercialPlan} · {company.counts.users}/
                  {company.maxUsers} usuarios · {company.counts.employees} colaboradores ·{" "}
                  {company.counts.plans} planes
                </p>
              </div>
              <button
                type="button"
                onClick={() => setExpanded(expanded === company.id ? null : company.id)}
                className="btn-secondary"
              >
                {expanded === company.id ? "Cerrar" : "Configurar"}
              </button>
            </div>

            {expanded === company.id && (
              <CompanyEditor company={company} defaults={defaults} onSaved={() => router.refresh()} />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function CompanyEditor({
  company, defaults, onSaved,
}: {
  company: Company; defaults: PlatformRules; onSaved: () => void;
}) {
  const [state, setState] = useState({
    name: company.name,
    logoUrl: company.logoUrl,
    primaryColor: company.primaryColor,
    pdfCoverNote: company.pdfCoverNote,
    maxUsers: company.maxUsers,
    commercialPlan: company.commercialPlan,
    active: company.active,
  });
  const [rules, setRules] = useState<PlatformRules>(company.rules);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [newCode, setNewCode] = useState<string | null>(null);

  async function save() {
    setError(null);
    setMessage(null);
    try {
      await api.patch(`/api/admin/companies/${company.id}`, { ...state, rules });
      setMessage("Cambios guardados.");
      onSaved();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No pudimos guardar los cambios.");
    }
  }

  async function createCode() {
    setError(null);
    try {
      const result = await api.post<{ code: { code: string } }>("/api/admin/access-codes", {
        companyId: company.id,
        role: "LEADER",
        maxUses: 10,
        expiresInDays: 365,
      });
      setNewCode(result.code.code);
      onSaved();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No pudimos generar el código.");
    }
  }

  return (
    <div className="mt-5 space-y-6 border-t border-sand-200 pt-5">
      {message && <Alert tone="success">{message}</Alert>}
      {error && <Alert tone="danger">{error}</Alert>}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nombre">
          <input className="input" value={state.name}
            onChange={(e) => setState({ ...state, name: e.target.value })} />
        </Field>
        <Field label="Logo del cliente (URL)" hint="Aparece en la portada del PDF.">
          <input className="input" value={state.logoUrl}
            onChange={(e) => setState({ ...state, logoUrl: e.target.value })}
            placeholder="https://…/logo.png" />
        </Field>
        <Field label="Texto de portada del PDF">
          <input className="input" value={state.pdfCoverNote}
            onChange={(e) => setState({ ...state, pdfCoverNote: e.target.value })}
            placeholder="Programa de Desarrollo del Talento" />
        </Field>
        <Field label="Color corporativo">
          <input type="color" className="input h-11 py-1" value={state.primaryColor}
            onChange={(e) => setState({ ...state, primaryColor: e.target.value })} />
        </Field>
        <Field label="Usuarios permitidos">
          <input type="number" min={1} className="input" value={state.maxUsers}
            onChange={(e) => setState({ ...state, maxUsers: Number(e.target.value) })} />
        </Field>
        <Field label="Plan comercial">
          <select className="input" value={state.commercialPlan}
            onChange={(e) => setState({ ...state, commercialPlan: e.target.value })}>
            <option value="STARTER">Starter</option>
            <option value="PROFESIONAL">Profesional</option>
            <option value="CORPORATIVO">Corporativo</option>
          </select>
        </Field>
        <label className="flex items-center gap-2 text-sm text-ink-700">
          <input type="checkbox" checked={state.active}
            onChange={(e) => setState({ ...state, active: e.target.checked })} />
          Empresa activa (si se desactiva, sus usuarios no pueden entrar)
        </label>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-ink-900">
          Reglas de esta empresa
          <span className="ml-2 font-normal text-ink-400">
            Sobrescriben las globales
          </span>
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {(Object.keys(defaults) as (keyof PlatformRules)[]).map((key) => (
            <Field key={key} label={RULE_LABELS[key]}>
              <input
                type="number" className="input" value={rules[key]}
                onChange={(e) => setRules({ ...rules, [key]: Number(e.target.value) })}
              />
            </Field>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-ink-900">Códigos de acceso</h3>
        {company.codes.length > 0 && (
          <ul className="mb-3 space-y-1.5 text-sm">
            {company.codes.map((code) => (
              <li key={code.id} className="flex items-center justify-between gap-3">
                <code className="rounded bg-sand-100 px-2 py-1 font-mono text-xs">
                  {code.code}
                </code>
                <span className="text-xs text-ink-400">
                  {ROLE_LABELS[code.role as keyof typeof ROLE_LABELS]} · {code.uses}/{code.maxUses} usos
                </span>
              </li>
            ))}
          </ul>
        )}
        {newCode && (
          <Alert tone="success" title="Código generado">
            <code className="font-mono">{newCode}</code>
          </Alert>
        )}
        <button type="button" onClick={createCode} className="btn-secondary mt-2">
          Generar código de acceso
        </button>
      </div>

      <button type="button" onClick={save} className="btn-primary">
        Guardar cambios
      </button>
    </div>
  );
}
