import { z } from "zod";
import bcrypt from "bcryptjs";
import { hashPassword } from "@/lib/auth";
import { audit } from "@/lib/audit";
import { fail, handler, ok, parseBody } from "@/lib/http";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  email: z.string().email(),
  token: z.string().min(10),
  password: z
    .string()
    .min(10, "La contraseña debe tener al menos 10 caracteres.")
    .regex(/[A-Za-z]/, "Debe incluir letras.")
    .regex(/[0-9]/, "Debe incluir al menos un número."),
});

export const POST = handler(async (request) => {
  const { email, token, password } = await parseBody(request, schema);
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  const invalid = fail("El enlace de recuperación no es válido o ya expiró.", 400);

  if (!user?.resetTokenHash || !user.resetTokenExp) return invalid;
  if (user.resetTokenExp.getTime() < Date.now()) return invalid;
  if (!(await bcrypt.compare(token, user.resetTokenHash))) return invalid;

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash: await hashPassword(password),
      resetTokenHash: null,
      resetTokenExp: null,
    },
  });
  await audit({
    companyId: user.companyId, userId: user.id,
    action: "password.reset", entity: "User", entityId: user.id,
  });

  return ok({ ok: true });
});
