"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { api, ApiError } from "@/lib/client-api";
import { Alert, EmptyState, Field } from "@/components/ui";
import { Icon } from "@/components/icons";

type EmployeeOption = {
  id: string;
  firstName: string;
  lastName: string;
  area: string | null;
  positionTitle: string | null;
  _count: { plans: number };
};

export function NewPlanForm({ employees }: { employees: EmployeeOption[] }) {
  const router = useRouter();
  const [mode, setMode] = useState<"existing" | "new">(
    employees.length > 0 ? "existing" : "new"
  );
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", area: "",
    positionTitle: "", managerName: "", location: "",
  });

  async function create(payload: Record<string, unknown>) {
    setLoading(true);
    setError(null);
    try {
      const result = await api.post<{ plan: { id: string } }>("/api/plans", payload);
      router.push(`/planes/${result.plan.id}/wizard/persona`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No pudimos crear el plan.");
      setLoading(false);
    }
  }

  const visible = employees.filter((employee) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return `${employee.firstName} ${employee.lastName} ${employee.positionTitle ?? ""}`
      .toLowerCase()
      .includes(q);
  });

  return (
    <div className="space-y-6">
      {error && <Alert tone="danger">{error}</Alert>}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setMode("existing")}
          className={mode === "existing" ? "btn-primary" : "btn-secondary"}
          disabled={employees.length === 0}
        >
          Alguien de mi equipo
        </button>
        <button
          type="button"
          onClick={() => setMode("new")}
          className={mode === "new" ? "btn-primary" : "btn-secondary"}
        >
          <Icon.plus className="h-4 w-4" />
          Registrar a una persona nueva
        </button>
      </div>

      {mode === "existing" ? (
        employees.length === 0 ? (
          <EmptyState
            icon={<Icon.users className="h-10 w-10" />}
            title="Aún no hay colaboradores registrados"
            description="Registra a la primera persona para poder construir su plan de desarrollo."
            action={
              <button type="button" onClick={() => setMode("new")} className="btn-primary">
                Registrar persona
              </button>
            }
          />
        ) : (
          <>
            <div className="relative max-w-sm">
              <Icon.search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
              <input
                className="input pl-9"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por nombre o cargo"
              />
            </div>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((employee) => (
                <li key={employee.id}>
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => create({ employeeId: employee.id })}
                    className="card-interactive w-full px-5 py-5 text-left"
                  >
                    <span className="flex items-center gap-3">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
                        {employee.firstName[0]}
                        {employee.lastName[0]}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate font-semibold text-ink-900">
                          {employee.firstName} {employee.lastName}
                        </span>
                        <span className="block truncate text-xs text-ink-400">
                          {employee.positionTitle ?? "Sin cargo"} ·{" "}
                          {employee.area ?? "Sin área"}
                        </span>
                      </span>
                    </span>
                    {employee._count.plans > 0 && (
                      <span className="mt-3 block text-xs text-ink-400">
                        {employee._count.plans} plan
                        {employee._count.plans === 1 ? "" : "es"} previo
                        {employee._count.plans === 1 ? "" : "s"}
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
            {visible.length === 0 && (
              <p className="muted py-6 text-center">Nadie coincide con esa búsqueda.</p>
            )}
          </>
        )
      ) : (
        <form
          className="card px-6 py-6"
          onSubmit={(event) => {
            event.preventDefault();
            create({ employee: { ...form } });
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nombre" required>
              <input className="input" required value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
            </Field>
            <Field label="Apellido" required>
              <input className="input" required value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
            </Field>
            <Field label="Área">
              <input className="input" value={form.area}
                onChange={(e) => setForm({ ...form, area: e.target.value })} />
            </Field>
            <Field label="Cargo actual">
              <input className="input" value={form.positionTitle}
                onChange={(e) => setForm({ ...form, positionTitle: e.target.value })} />
            </Field>
            <Field label="Jefe directo">
              <input className="input" value={form.managerName}
                onChange={(e) => setForm({ ...form, managerName: e.target.value })} />
            </Field>
            <Field label="Ubicación">
              <input className="input" value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })} />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Correo" hint="Opcional. Útil si más adelante le das acceso de lectura.">
                <input type="email" className="input" value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </Field>
            </div>
          </div>
          <button type="submit" className="btn-primary mt-6" disabled={loading}>
            {loading ? "Creando…" : "Empezar el plan"}
            <Icon.arrowRight className="h-4 w-4" />
          </button>
        </form>
      )}
    </div>
  );
}
