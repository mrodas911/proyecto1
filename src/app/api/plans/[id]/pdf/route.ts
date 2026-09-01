import { cookies } from "next/headers";
import { audit } from "@/lib/audit";
import { apiUser, fail, handler } from "@/lib/http";
import { getPlanForUser } from "@/lib/plans";
import { pdfFileName, renderPdf, PdfUnavailableError } from "@/lib/pdf";
import { prisma } from "@/lib/prisma";
import { SESSION_COOKIE } from "@/lib/session";
import { fullName } from "@/lib/format";

export const runtime = "nodejs";
export const maxDuration = 60;

type Ctx = { params: Promise<{ id: string }> };

export const GET = handler(async (request, ctx: Ctx) => {
  const user = await apiUser();
  const { id } = await ctx.params;
  const plan = await getPlanForUser(id, user);

  if (plan.status === "DRAFT") {
    return fail("Genera el plan antes de descargar el documento.", 409);
  }

  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return fail("Sesión no válida.", 401);

  const base = process.env.APP_URL?.replace(/\/$/, "") ?? new URL(request.url).origin;
  const fileName = pdfFileName(fullName(plan.employee), plan.version);

  let pdf: Uint8Array;
  try {
    pdf = await renderPdf({
      url: `${base}/documento/${plan.id}`,
      cookieName: SESSION_COOKIE,
      cookieValue: token,
    });
  } catch (error) {
    if (error instanceof PdfUnavailableError) {
      return fail(
        "El generador de PDF no está disponible en este entorno. Abre la vista del documento y usa la impresión del navegador.",
        503,
        { fallbackUrl: `/documento/${plan.id}` }
      );
    }
    console.error("[pdf]", error);
    return fail("No pudimos generar el documento. Inténtalo de nuevo.", 500);
  }

  await prisma.pdfExport.create({
    data: {
      companyId: plan.companyId,
      planId: plan.id,
      userId: user.id,
      fileName,
      version: plan.version,
    },
  });
  if (plan.status === "FINALIZED") {
    await prisma.developmentPlan.update({
      where: { id: plan.id },
      data: { status: "DOWNLOADED" },
    });
  }
  await audit({
    companyId: plan.companyId, userId: user.id,
    action: "plan.pdf", entity: "DevelopmentPlan", entityId: plan.id,
    metadata: { fileName },
  });

  return new Response(pdf as unknown as BodyInit, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Cache-Control": "private, no-store",
    },
  });
});
