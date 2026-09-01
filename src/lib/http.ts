/**
 * Helpers para los route handlers: respuestas uniformes y guardas de acceso
 * que garantizan el aislamiento entre empresas.
 */
import "server-only";
import { NextResponse } from "next/server";
import { ZodError, type ZodType } from "zod";
import type { Role } from "@prisma/client";
import { getSession } from "./auth";
import type { SessionPayload } from "./session";

export function ok<T>(data: T, init?: number) {
  return NextResponse.json(data, { status: init ?? 200 });
}

export function fail(message: string, status = 400, extra?: Record<string, unknown>) {
  return NextResponse.json({ error: message, ...extra }, { status });
}

export class HttpError extends Error {
  constructor(readonly status: number, message: string) {
    super(message);
  }
}

export type ApiUser = SessionPayload & { id: string };

/** Sesión obligatoria en un route handler. Lanza HttpError 401. */
export async function apiUser(roles?: Role[]): Promise<ApiUser> {
  const session = await getSession();
  if (!session) throw new HttpError(401, "Sesión no válida o expirada.");
  if (roles && !roles.includes(session.role)) {
    throw new HttpError(403, "No tienes permisos para realizar esta acción.");
  }
  return { ...session, id: session.sub };
}

/**
 * Empresa sobre la que actúa la petición. El superadministrador debe indicarla
 * explícitamente; el resto de roles quedan atados a la suya.
 */
export function scopeCompany(user: ApiUser, requested?: string | null): string {
  if (user.role === "SUPERADMIN") {
    const id = requested ?? user.companyId;
    if (!id) throw new HttpError(400, "Falta indicar la empresa.");
    return id;
  }
  if (!user.companyId) throw new HttpError(403, "El usuario no pertenece a ninguna empresa.");
  if (requested && requested !== user.companyId) {
    throw new HttpError(403, "No puedes acceder a datos de otra empresa.");
  }
  return user.companyId;
}

export async function parseBody<T>(request: Request, schema: ZodType<T>): Promise<T> {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    throw new HttpError(400, "El cuerpo de la petición no es JSON válido.");
  }
  const result = schema.safeParse(raw);
  if (!result.success) {
    throw new HttpError(422, formatZod(result.error));
  }
  return result.data;
}

function formatZod(error: ZodError): string {
  return error.issues
    .map((i) => `${i.path.join(".") || "campo"}: ${i.message}`)
    .join(" · ");
}

/** Envuelve un handler y traduce HttpError/ZodError a respuestas JSON. */
export function handler<A extends unknown[]>(
  fn: (request: Request, ...args: A) => Promise<Response>
) {
  return async (request: Request, ...args: A): Promise<Response> => {
    try {
      return await fn(request, ...args);
    } catch (error) {
      if (error instanceof HttpError) return fail(error.message, error.status);
      if (error instanceof ZodError) return fail(formatZod(error), 422);
      console.error("[api]", error);
      return fail("Ocurrió un error inesperado.", 500);
    }
  };
}

export function clientIp(request: Request): string | null {
  const fwd = request.headers.get("x-forwarded-for");
  return fwd ? fwd.split(",")[0]!.trim() : null;
}
