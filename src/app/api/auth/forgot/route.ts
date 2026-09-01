import crypto from "node:crypto";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { findUserByEmail } from "@/lib/auth";
import { audit } from "@/lib/audit";
import { handler, ok, parseBody } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";

const schema = z.object({ email: z.string().email("Introduce un correo válido.") });

/**
 * Genera un enlace de recuperación. No hay servicio de correo configurado:
 * el enlace se registra en el log del servidor y, solo fuera de producción,
 * se devuelve en la respuesta para poder probar el flujo.
 */
export const POST = handler(async (request) => {
  const { email } = await parseBody(request, schema);
  rateLimit(`forgot:${email.toLowerCase()}`, 5, 15 * 60 * 1000);

  const user = await findUserByEmail(email);
  const generic = { ok: true, message: "Si el correo existe, enviaremos las instrucciones." };
  if (!user || !user.active) return ok(generic);

  const token = crypto.randomBytes(32).toString("hex");
  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetTokenHash: await bcrypt.hash(token, 10),
      resetTokenExp: new Date(Date.now() + 60 * 60 * 1000),
    },
  });
  await audit({
    companyId: user.companyId, userId: user.id,
    action: "password.reset_requested", entity: "User", entityId: user.id,
  });

  const link = `${process.env.APP_URL ?? ""}/restablecer?token=${token}&email=${encodeURIComponent(user.email)}`;
  console.info(`[recuperación] Enlace para ${user.email}: ${link}`);

  return ok(
    process.env.NODE_ENV === "production" ? generic : { ...generic, devLink: link }
  );
});
