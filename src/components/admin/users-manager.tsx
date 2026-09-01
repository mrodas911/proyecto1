"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Role } from "@prisma/client";
import { api, ApiError } from "@/lib/client-api";
import { formatShortDate } from "@/lib/format";
import { ROLE_LABELS } from "@/lib/rbac";
import { Alert, Field } from "@/components/ui";
import { Icon } from "@/components/icons";

type ManagedUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  active: boolean;
  lastLoginAt: string | null;
  employeeId: string | null;
};

const ASSIGNABLE: Role[] = ["COMPANY_ADMIN", "LEADER", "EMPLOYEE"];

const EMPTY = {
  firstName: "", lastName: "", email: "",
  role: "LEADER" as Role, password: "", employeeId: "",
};

export function UsersManager({
  users, employees, seatsLeft,
}: {
  users: ManagedUser[];
  employees: { id: string; firstName: string; lastName: string }[];
  seatsLeft: number;
}) {
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function create(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    try {
      await api.post("/api/admin/users", {
        ...form,
        employeeId: form.role === "EMPLOYEE" ? form.employeeId || null : null,
      });
      setForm(EMPTY);
      setCreating(false);
      setMessage("Usuario creado. Ya puede entrar con esa contraseña.");
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No pudimos crear el usuario.");
    }
  }

  async function toggle(user: ManagedUser) {
    await api.patch(`/api/admin/users/${user.id}`, { active: !user.active });
    router.refresh();
  }

  return (
    <div className="space-y-6">
      {error && <Alert tone="danger">{error}</Alert>}
      {message && <Alert tone="success">{message}</Alert>}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="muted">
          {seatsLeft > 0
            ? `Quedan ${seatsLeft} usuarios disponibles en tu plan.`
            : "Has alcanzado el número de usuarios permitidos de tu plan."}
        </p>
        <button
          type="button"
          onClick={() => setCreating((v) => !v)}
          className="btn-primary"
          disabled={seatsLeft <= 0}
        >
          <Icon.plus className="h-4 w-4" />
          Nuevo usuario
        </button>
      </div>

      {creating && (
        <form onSubmit={create} className="card grid gap-4 px-6 py-6 sm:grid-cols-2">
          <Field label="Nombre" required>
            <input className="input" required value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
          </Field>
          <Field label="Apellido" required>
            <input className="input" required value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
          </Field>
          <Field label="Correo" required>
            <input type="email" className="input" required value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </Field>
          <Field label="Rol">
            <select className="input" value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value as Role })}>
              {ASSIGNABLE.map((role) => (
                <option key={role} value={role}>{ROLE_LABELS[role]}</option>
              ))}
            </select>
          </Field>
          {form.role === "EMPLOYEE" && (
            <Field label="Ficha de colaborador" hint="Determina qué plan podrá consultar.">
              <select className="input" value={form.employeeId}
                onChange={(e) => setForm({ ...form, employeeId: e.target.value })}>
                <option value="">Sin vincular</option>
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.firstName} {employee.lastName}
                  </option>
                ))}
              </select>
            </Field>
          )}
          <Field label="Contraseña inicial" required hint="Mínimo 10 caracteres, con letras y números.">
            <input type="text" className="input" required minLength={10} value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </Field>
          <div className="sm:col-span-2">
            <button type="submit" className="btn-primary">Crear usuario</button>
          </div>
        </form>
      )}

      <ul className="space-y-2">
        {users.map((user) => (
          <li key={user.id} className="card flex flex-wrap items-center justify-between gap-3 px-5 py-4">
            <div className="min-w-0">
              <p className="font-semibold text-ink-900">
                {user.firstName} {user.lastName}
                {!user.active && (
                  <span className="ml-2 chip bg-sand-200 text-ink-500">Desactivado</span>
                )}
              </p>
              <p className="truncate text-xs text-ink-400">
                {user.email} · {ROLE_LABELS[user.role]}
                {user.lastLoginAt ? ` · último acceso ${formatShortDate(user.lastLoginAt)}` : " · sin accesos"}
              </p>
            </div>
            <button type="button" onClick={() => toggle(user)} className="btn-ghost text-sm">
              {user.active ? "Desactivar" : "Activar"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
