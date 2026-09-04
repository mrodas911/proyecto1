import type { MetadataRoute } from "next";
import { servicios } from "@/lib/domina";

const base = process.env.APP_URL ?? "http://localhost:3000";

/** Mapa del sitio público. Las rutas de la aplicación quedan fuera a propósito. */
export default function sitemap(): MetadataRoute.Sitemap {
  const paginas = ["", "/servicios", "/acerca-de", "/colabora-con-nosotros", "/contacto"];
  const fichas = servicios.map((s) => `/servicios/${s.slug}`);

  return [...paginas, ...fichas].map((ruta) => ({
    url: `${base}${ruta}`,
    lastModified: new Date(),
    changeFrequency: ruta === "" ? "monthly" : "yearly",
    priority: ruta === "" ? 1 : 0.7,
  }));
}
