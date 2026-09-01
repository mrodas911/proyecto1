import { z } from "zod";
import { createSessionCookie, findUserByEmail, verifyPassword } from "@/lib/auth";
import { audit } from "@/lib/audit";
import { clientIp, fail, handler, ok, parseBody } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { rateLimit, resetLimit } from "@/lib/rate-limit";

const schema = z.object({
  email: z.string().email("Introduce un correo válido."),
  password: z.string().min(1, "Escribe tu contraseña."),
});

export const POST = handler(async (request) => {
  const { email, password } = await parseBody(request, schema);
  const ip = clientIp(request) ?? "local";
  const key = `login:${ip}:${email.toLowerCase()}`;

  if (!rateLimit(key, 8, 10 * 60 * 1000)) {
    return fail("Demasiados intentos. Vuelve a intentarlo en unos minutos.", 429);
  }

  const user = await findUserByEmail(email);
  // Mensaje genérico: no revela si el correo existe.
  const invalid = fail("Correo o contraseña incorrectos.", 401);
  if (!user || !user.active) return invalid;
  if (user.company && !user.company.active) {
    return fail("El acceso de tu empresa está desactivado. Contacta al administrador.", 403);
  }
  if (!(await verifyPassword(password, user.passwordHash))) return invalid;

  resetLimit(key);
  await createSessionCookie(user);
  await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  await audit({
    companyId: user.companyId, userId: user.id,
    action: "login", entity: "User", entityId: user.id, ip,
  });

  return ok({ ok: true, role: user.role });
});
