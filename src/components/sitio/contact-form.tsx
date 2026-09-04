"use client";

import { useState } from "react";
import { Icon } from "@/components/icons";
import { empresa, servicios } from "@/lib/domina";

type Estado = "inactivo" | "enviando" | "enviado" | "error";

/**
 * Formulario de contacto del sitio público. Valida en el cliente lo básico y
 * delega la validación real en `/api/contacto`.
 */
export function ContactForm({ interesInicial = "" }: { interesInicial?: string }) {
  const [estado, setEstado] = useState<Estado>("inactivo");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const datos = Object.fromEntries(new FormData(form).entries());

    setEstado("enviando");
    setError(null);
    try {
      const res = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      });
      const cuerpo = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok) {
        setError(cuerpo.error ?? "No pudimos enviar tu mensaje. Inténtalo de nuevo.");
        setEstado("error");
        return;
      }
      form.reset();
      setEstado("enviado");
    } catch {
      setError(
        `No pudimos enviar tu mensaje. Escríbenos directamente a ${empresa.email}.`,
      );
      setEstado("error");
    }
  }

  if (estado === "enviado") {
    return (
      <div className="dom-card text-center">
        <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-[color:var(--color-copper-100)] text-[color:var(--color-copper-700)]">
          <Icon.check className="h-7 w-7" />
        </span>
        <h3 className="dom-display mt-5 text-2xl text-dom-900">Mensaje recibido</h3>
        <p className="mt-3 leading-relaxed text-dom-600">
          Gracias por escribirnos. Te respondemos dentro de un día hábil al correo que
          nos dejaste.
        </p>
        <button
          type="button"
          onClick={() => setEstado("inactivo")}
          className="dom-btn-outline mt-6"
        >
          Enviar otro mensaje
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="dom-card" noValidate={false}>
      {/* Campo trampa contra bots: oculto y sin foco para personas. */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="web">No completar</label>
        <input id="web" name="web" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-1">
          <label className="dom-label" htmlFor="nombre">
            Nombre y apellido *
          </label>
          <input id="nombre" name="nombre" required minLength={2} className="dom-input" />
        </div>
        <div className="sm:col-span-1">
          <label className="dom-label" htmlFor="empresa">
            Empresa
          </label>
          <input id="empresa" name="empresa" className="dom-input" />
        </div>
        <div className="sm:col-span-1">
          <label className="dom-label" htmlFor="email">
            Correo electrónico *
          </label>
          <input id="email" name="email" type="email" required className="dom-input" />
        </div>
        <div className="sm:col-span-1">
          <label className="dom-label" htmlFor="telefono">
            Teléfono o WhatsApp
          </label>
          <input id="telefono" name="telefono" type="tel" className="dom-input" />
        </div>
        <div className="sm:col-span-2">
          <label className="dom-label" htmlFor="interes">
            ¿Sobre qué quieres hablar?
          </label>
          <select
            id="interes"
            name="interes"
            defaultValue={interesInicial}
            className="dom-input"
          >
            <option value="">Aún no lo tengo claro</option>
            {servicios.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.nombre} — {s.linea}
              </option>
            ))}
            <option value="otro">Otro tema</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="dom-label" htmlFor="mensaje">
            Cuéntanos tu situación *
          </label>
          <textarea
            id="mensaje"
            name="mensaje"
            required
            minLength={10}
            rows={5}
            className="dom-input resize-y"
            placeholder="Qué está pasando en tu empresa, desde cuándo y qué te gustaría que cambie."
          />
        </div>
      </div>

      {error ? (
        <p role="alert" className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      ) : null}

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button type="submit" className="dom-btn-primary" disabled={estado === "enviando"}>
          {estado === "enviando" ? "Enviando…" : "Enviar mensaje"}
          {estado === "enviando" ? null : <Icon.arrowRight className="h-4 w-4" />}
        </button>
        <p className="text-xs text-dom-500">
          Tus datos se usan solo para responderte. No los compartimos con terceros.
        </p>
      </div>
    </form>
  );
}
