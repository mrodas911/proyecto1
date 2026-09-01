import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth-shell";
import { ForgotForm } from "./forgot-form";

export const metadata: Metadata = { title: "Recuperar contraseña" };

export default function ForgotPage() {
  return (
    <AuthShell
      title="Recupera tu acceso"
      subtitle="Te enviaremos un enlace para crear una contraseña nueva."
      footer={
        <Link href="/login" className="font-medium text-brand-700 hover:underline">
          Volver a entrar
        </Link>
      }
    >
      <ForgotForm />
    </AuthShell>
  );
}
