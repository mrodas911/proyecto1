import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/session";

/**
 * Guarda de rutas. Valida el JWT de sesión sin tocar la base de datos, de modo
 * que pueda ejecutarse en el runtime Edge antes de servir cualquier página.
 */

/** Rutas accesibles sin sesión: sitio público de Domina y flujo de acceso. */
const PUBLIC_PATHS = [
  "/",
  "/acerca-de",
  "/servicios",
  "/contacto",
  "/colabora-con-nosotros",
  "/ruta",
  "/login",
  "/recuperar",
  "/restablecer",
  "/sitemap.xml",
  "/robots.txt",
];

/** Prefijos públicos: fichas de servicio y formulario de contacto del sitio. */
const PUBLIC_PREFIXES = ["/servicios/", "/api/contacto"];

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await verifySession(request.cookies.get(SESSION_COOKIE)?.value);

  const isPublic =
    PUBLIC_PATHS.includes(pathname) ||
    PUBLIC_PREFIXES.some((prefijo) => pathname.startsWith(prefijo)) ||
    pathname.startsWith("/api/auth/") ||
    pathname.startsWith("/_next");

  if (!session && !isPublic) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Sesión no válida o expirada." }, { status: 401 });
    }
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (session && pathname === "/login") {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    url.search = "";
    return NextResponse.redirect(url);
  }

  // El área de administración de la plataforma es exclusiva del superadministrador.
  if (session && pathname.startsWith("/admin") && session.role !== "SUPERADMIN") {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  const response = NextResponse.next();
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp)$).*)"],
};
