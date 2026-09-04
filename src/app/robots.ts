import type { MetadataRoute } from "next";

const base = process.env.APP_URL ?? "http://localhost:3000";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // La aplicación de planes es privada: no debe indexarse.
      { userAgent: "*", allow: "/", disallow: ["/api/", "/dashboard", "/planes", "/admin", "/login"] },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
