import { NextResponse } from "next/server";
import { z } from "zod";
import { rateLimit } from "@/lib/rate-limit";
import { servicios } from "@/lib/domina";

/**
 * Recepción de solicitudes del sitio público.
 *
 * Deliberadamente no depende de la base de datos ni de la sesión de la
 * aplicación: el sitio de Domina puede desplegarse sin ellas. Hoy la solicitud
 * se registra en el log del servidor.
 *
 * TODO: conectar con el correo corporativo o el CRM de la consultora
 * (por ejemplo un proveedor SMTP o una API de correo transaccional) para que
 * cada envío llegue a la bandeja del equipo.
 */
const slugs = servicios.map((s) => s.slug);

const schema = z.object({
  nombre: z.string().trim().min(2, "Indica tu nombre.").max(120),
  empresa: z.string().trim().max(160).optional().or(z.literal("")),
  email: z.string().trim().email("Introduce un correo válido."),
  telefono: z.string().trim().max(40).optional().or(z.literal("")),
  interes: z
    .string()
    .refine((v) => v === "" || v === "otro" || slugs.includes(v), "Servicio no reconocido.")
    .optional()
    .or(z.literal("")),
  mensaje: z.string().trim().min(10, "Cuéntanos un poco más (mínimo 10 caracteres).").max(4000),
  // Campo trampa: los formularios legítimos lo dejan vacío.
  web: z.string().max(0).optional(),
});

export async function POST(request: Request) {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: "El cuerpo de la petición no es JSON válido." }, { status: 400 });
  }

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    const detalle = parsed.error.issues
      .map((i) => `${i.path.join(".") || "campo"}: ${i.message}`)
      .join(" · ");
    return NextResponse.json({ error: detalle }, { status: 422 });
  }

  const datos = parsed.data;

  // Solicitud automatizada: se responde con éxito para no dar pistas al bot.
  if (datos.web) return NextResponse.json({ ok: true });

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "desconocida";
  if (!rateLimit(`contacto:${ip}`, 5, 60 * 60 * 1000)) {
    return NextResponse.json(
      { error: "Has enviado varias solicitudes seguidas. Escríbenos por correo y te respondemos igual." },
      { status: 429 },
    );
  }

  console.info(
    "[contacto] Nueva solicitud",
    JSON.stringify({
      nombre: datos.nombre,
      empresa: datos.empresa || null,
      email: datos.email,
      telefono: datos.telefono || null,
      interes: datos.interes || null,
      mensaje: datos.mensaje,
      recibida: new Date().toISOString(),
    }),
  );

  return NextResponse.json({ ok: true });
}
