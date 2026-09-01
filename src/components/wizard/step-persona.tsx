"use client";

import { useState } from "react";
import { api } from "@/lib/client-api";
import { toDateInput } from "@/lib/format";
import { Field } from "@/components/ui";
import { WizardFrame, type WizardHeader } from "./frame";
import { useSaveState } from "./save-state";

export type PersonaData = {
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  companyName: string;
  area: string;
  positionTitle: string;
  managerName: string;
  location: string;
  businessUnit: string;
  hierarchyLevel: number | null;
  hiredAt: string | null;
  planDate: string;
};

export function StepPersona({ header, data }: { header: WizardHeader; data: PersonaData }) {
  return (
    <WizardFrame
      header={header}
      title="Paso 1 · La persona"
      question="¿Para quién estamos construyendo este plan?"
      hint="Estos datos aparecerán en la portada y en el perfil del documento final."
    >
      <PersonaForm planId={header.planId} data={data} />
    </WizardFrame>
  );
}

function PersonaForm({ planId, data }: { planId: string; data: PersonaData }) {
  const { run } = useSaveState();
  const [form, setForm] = useState({
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    area: data.area,
    positionTitle: data.positionTitle,
    managerName: data.managerName,
    location: data.location,
    businessUnit: data.businessUnit,
    hierarchyLevel: data.hierarchyLevel?.toString() ?? "",
    hiredAt: toDateInput(data.hiredAt),
  });
  const [planDate, setPlanDate] = useState(toDateInput(data.planDate));

  function update(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  /** Autoguardado: cada campo se persiste al salir de él. */
  function saveField(key: keyof typeof form) {
    return () =>
      run(() =>
        api.patch(`/api/employees/${data.employeeId}`, {
          [key]:
            key === "hierarchyLevel"
              ? form.hierarchyLevel
                ? Number(form.hierarchyLevel)
                : null
              : form[key] || null,
        })
      );
  }

  function savePlanDate(value: string) {
    setPlanDate(value);
    if (value) run(() => api.patch(`/api/plans/${planId}`, { planDate: value }));
  }

  return (
    <div className="space-y-6">
      <section className="card px-6 py-6">
        <h2 className="section-title mb-5">Datos de la persona</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nombre" required>
            <input className="input" value={form.firstName}
              onChange={(e) => update("firstName", e.target.value)}
              onBlur={saveField("firstName")} />
          </Field>
          <Field label="Apellido" required>
            <input className="input" value={form.lastName}
              onChange={(e) => update("lastName", e.target.value)}
              onBlur={saveField("lastName")} />
          </Field>
          <Field label="Empresa">
            <input className="input bg-sand-100" value={data.companyName} readOnly />
          </Field>
          <Field label="Correo">
            <input type="email" className="input" value={form.email}
              onChange={(e) => update("email", e.target.value)}
              onBlur={saveField("email")} placeholder="nombre@empresa.com" />
          </Field>
          <Field label="Área">
            <input className="input" value={form.area}
              onChange={(e) => update("area", e.target.value)}
              onBlur={saveField("area")} placeholder="Comercial, Operaciones…" />
          </Field>
          <Field label="Cargo actual">
            <input className="input" value={form.positionTitle}
              onChange={(e) => update("positionTitle", e.target.value)}
              onBlur={saveField("positionTitle")} placeholder="Jefe de tienda" />
          </Field>
          <Field label="Jefe directo">
            <input className="input" value={form.managerName}
              onChange={(e) => update("managerName", e.target.value)}
              onBlur={saveField("managerName")} />
          </Field>
          <Field label="Ubicación">
            <input className="input" value={form.location}
              onChange={(e) => update("location", e.target.value)}
              onBlur={saveField("location")} placeholder="Ciudad o sede" />
          </Field>
          <Field label="Fecha del plan">
            <input type="date" className="input" value={planDate}
              onChange={(e) => savePlanDate(e.target.value)} />
          </Field>
        </div>
      </section>

      <details className="card px-6 py-5">
        <summary className="cursor-pointer text-sm font-semibold text-ink-700">
          Datos adicionales (opcional)
        </summary>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <Field label="Antigüedad (fecha de ingreso)">
            <input type="date" className="input" value={form.hiredAt}
              onChange={(e) => update("hiredAt", e.target.value)}
              onBlur={saveField("hiredAt")} />
          </Field>
          <Field label="Nivel jerárquico" hint="1 operativo · 6 dirección">
            <input type="number" min={1} max={9} className="input" value={form.hierarchyLevel}
              onChange={(e) => update("hierarchyLevel", e.target.value)}
              onBlur={saveField("hierarchyLevel")} />
          </Field>
          <Field label="Unidad de negocio">
            <input className="input" value={form.businessUnit}
              onChange={(e) => update("businessUnit", e.target.value)}
              onBlur={saveField("businessUnit")} />
          </Field>
        </div>
      </details>
    </div>
  );
}
