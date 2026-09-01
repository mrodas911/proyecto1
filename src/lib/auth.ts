/**
 * Autenticación server-side: hash de contraseñas, alta/lectura de la cookie
 * de sesión y helpers de autorización usados por páginas y route handlers.
 */
import "server-only";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Role, User } from "@prisma/client";
import { prisma } from "./prisma";
import {
  SESSION_COOKIE,
  signSession,
  verifySession,
  sessionMaxAgeSeconds,
  type SessionPayload,
} from "./session";

const BCRYPT_ROUNDS = 12;

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, BCRYPT_ROUNDS);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export async function createSessionCookie(user: User): Promise<void> {
  const token = await signSession({
    sub: user.id,
    email: user.email,
    role: user.role,
    companyId: user.companyId,
    name: `${user.firstName} ${user.lastName}`.trim(),
  });
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: sessionMaxAgeSeconds(),
  });
}

export async function destroySessionCookie(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

/** Sesión actual (sin consultar la base de datos). */
export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  return verifySession(store.get(SESSION_COOKIE)?.value);
}

export type CurrentUser = SessionPayload & { id: string };

/** Exige sesión válida; si no la hay redirige al login. */
export async function requireUser(): Promise<CurrentUser> {
  const session = await getSession();
  if (!session) redirect("/login");
  return { ...session, id: session.sub };
}

/** Exige sesión con uno de los roles indicados. */
export async function requireRole(...roles: Role[]): Promise<CurrentUser> {
  const user = await requireUser();
  if (!roles.includes(user.role)) redirect("/dashboard");
  return user;
}

/**
 * Empresa sobre la que opera el usuario. El superadministrador puede
 * "entrar" a una empresa concreta mediante la cookie `pdi_company`.
 */
export async function activeCompanyId(user: CurrentUser): Promise<string | null> {
  if (user.role !== "SUPERADMIN") return user.companyId;
  const store = await cookies();
  return store.get("pdi_company")?.value ?? null;
}

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email: email.trim().toLowerCase() },
    include: { company: true },
  });
}
