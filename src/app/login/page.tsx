import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AuthShell } from "@/components/auth-shell";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Entrar" };

export default function LoginPage() {
  return (
    <AuthShell
      title="Entra a tu espacio"
      subtitle="Accede con las credenciales que te entregó tu organización."
      footer={
        <Link href="/recuperar" className="font-medium text-brand-700 hover:underline">
          ¿Olvidaste tu contraseña?
        </Link>
      }
    >
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
