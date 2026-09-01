/**
 * Render del PDF en el servidor a partir del HTML del documento.
 *
 * Una sola plantilla (`/documento/[id]`) alimenta la vista en pantalla, la
 * impresión desde el navegador y este render, de modo que las tres versiones
 * no pueden desincronizarse.
 *
 * En despliegues sin Chromium disponible (por ejemplo, funciones serverless sin
 * el paquete de navegador), `renderPdf` lanza `PdfUnavailableError` y la ruta
 * ofrece al usuario la vista imprimible como alternativa.
 */
import "server-only";

export class PdfUnavailableError extends Error {}

export async function renderPdf(input: {
  url: string;
  cookieName: string;
  cookieValue: string;
}): Promise<Uint8Array> {
  const { chromium } = await import("playwright-core");

  const executablePath = process.env.CHROMIUM_EXECUTABLE_PATH || undefined;
  let browser;
  try {
    browser = await chromium.launch({
      executablePath,
      args: ["--no-sandbox", "--disable-dev-shm-usage"],
    });
  } catch (error) {
    throw new PdfUnavailableError(
      `No hay un navegador disponible para generar el PDF: ${(error as Error).message}`
    );
  }

  try {
    const target = new URL(input.url);
    const context = await browser.newContext({ viewport: { width: 1240, height: 1754 } });
    await context.addCookies([
      {
        name: input.cookieName,
        value: input.cookieValue,
        domain: target.hostname,
        path: "/",
        httpOnly: true,
        secure: target.protocol === "https:",
        sameSite: "Lax",
      },
    ]);

    const page = await context.newPage();
    // `load` en lugar de `networkidle`: recursos externos lentos (tipografías
    // de un CDN) no deben bloquear la generación del documento.
    const response = await page.goto(input.url, { waitUntil: "load", timeout: 45_000 });
    if (!response || !response.ok()) {
      throw new Error(`El documento respondió ${response?.status() ?? "sin respuesta"}.`);
    }
    // Las fuentes web deben estar listas antes de medir los saltos de página.
    // `fonts.ready` se resuelve también cuando alguna fuente no llega a cargar.
    await page
      .evaluate(() => document.fonts?.ready)
      .catch(() => undefined);

    const buffer = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
    });
    return new Uint8Array(buffer);
  } finally {
    await browser.close().catch(() => undefined);
  }
}

/** Nombre de archivo legible y seguro para cualquier sistema de ficheros. */
export function pdfFileName(person: string, version: number): string {
  const slug = person
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
  return `pdi-${slug || "colaborador"}-v${version}.pdf`;
}
