import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Ruta — Planes de Desarrollo Individual",
    template: "%s · Ruta",
  },
  description:
    "Construye rutas de desarrollo que conviertan potencial en acción. Planes individuales personalizados mediante experiencias, acompañamiento y aprendizaje.",
};

export const viewport: Viewport = {
  themeColor: "#1F5F5B",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
