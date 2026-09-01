import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthShell } from "@/components/auth-shell";
import { ResetForm } from "./reset-form";

export const metadata: Metadata = { title: "Nueva contraseña" };

export default function ResetPage() {
  return (
    <AuthShell
      title="Crea tu nueva contraseña"
      subtitle="Debe tener al menos 10 caracteres, con letras y números."
    >
      <Suspense fallback={null}>
        <ResetForm />
      </Suspense>
    </AuthShell>
  );
}
