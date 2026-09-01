/**
 * Sesión basada en JWT firmado (HS256) guardado en una cookie httpOnly.
 * `jose` funciona tanto en Node como en el runtime Edge, de modo que el
 * middleware puede validar la sesión sin tocar la base de datos.
 */
import { SignJWT, jwtVerify } from "jose";
import type { Role } from "@prisma/client";

export const SESSION_COOKIE = "pdi_session";

export type SessionPayload = {
  sub: string; // userId
  email: string;
  role: Role;
  companyId: string | null;
  name: string;
};

function secret(): Uint8Array {
  const value = process.env.AUTH_SECRET;
  if (!value || value.length < 32) {
    throw new Error(
      "AUTH_SECRET no está configurado o es demasiado corto (mínimo 32 caracteres)."
    );
  }
  return new TextEncoder().encode(value);
}

export function sessionMaxAgeSeconds(): number {
  const hours = Number(process.env.SESSION_HOURS ?? 12);
  return (Number.isFinite(hours) && hours > 0 ? hours : 12) * 3600;
}

export async function signSession(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${sessionMaxAgeSeconds()}s`)
    .sign(secret());
}

export async function verifySession(
  token: string | undefined | null
): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret(), { algorithms: ["HS256"] });
    if (!payload.sub || !payload.role) return null;
    return {
      sub: String(payload.sub),
      email: String(payload.email ?? ""),
      role: payload.role as Role,
      companyId: (payload.companyId as string | null) ?? null,
      name: String(payload.name ?? ""),
    };
  } catch {
    return null;
  }
}
