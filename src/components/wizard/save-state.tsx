"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { ApiError } from "@/lib/client-api";

type Status = "idle" | "saving" | "saved" | "error";

type SaveContext = {
  status: Status;
  message: string | null;
  /** Ejecuta una operación mostrando el estado de guardado automático. */
  run: <T>(operation: () => Promise<T>) => Promise<T | null>;
  /** Igual que `run`, pero propaga el error para tratarlo en la pantalla. */
  runOrThrow: <T>(operation: () => Promise<T>) => Promise<T>;
  setError: (message: string | null) => void;
};

const Ctx = createContext<SaveContext | null>(null);

export function SaveStateProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const run = useCallback(async <T,>(operation: () => Promise<T>): Promise<T | null> => {
    if (timer.current) clearTimeout(timer.current);
    setStatus("saving");
    setMessage(null);
    try {
      const result = await operation();
      setStatus("saved");
      timer.current = setTimeout(() => setStatus("idle"), 2500);
      return result;
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof ApiError ? error.message : "No pudimos guardar los cambios."
      );
      return null;
    }
  }, []);

  const runOrThrow = useCallback(async <T,>(operation: () => Promise<T>): Promise<T> => {
    if (timer.current) clearTimeout(timer.current);
    setStatus("saving");
    setMessage(null);
    try {
      const result = await operation();
      setStatus("saved");
      timer.current = setTimeout(() => setStatus("idle"), 2500);
      return result;
    } catch (error) {
      setStatus("idle");
      throw error;
    }
  }, []);

  const setError = useCallback((value: string | null) => {
    setMessage(value);
    setStatus(value ? "error" : "idle");
  }, []);

  const value = useMemo(
    () => ({ status, message, run, runOrThrow, setError }),
    [status, message, run, runOrThrow, setError]
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSaveState(): SaveContext {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useSaveState debe usarse dentro de SaveStateProvider");
  return ctx;
}

export function SaveIndicator() {
  const { status, message } = useSaveState();
  if (status === "idle") return null;
  if (status === "saving") {
    return (
      <span className="animate-pulse-soft text-xs font-medium text-ink-400">Guardando…</span>
    );
  }
  if (status === "saved") {
    return (
      <span className="text-xs font-medium text-[color:var(--color-positive)]">
        ✓ Guardado automáticamente
      </span>
    );
  }
  return (
    <span className="text-xs font-medium text-[color:var(--color-danger)]">
      {message ?? "No pudimos guardar"}
    </span>
  );
}
