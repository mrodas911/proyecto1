"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Icon } from "@/components/icons";

export function UserMenu({ compact }: { compact?: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function logout() {
    setLoading(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={logout}
      disabled={loading}
      className={compact ? "btn-ghost px-2 py-1.5" : "btn-ghost mt-3 w-full justify-start px-2"}
    >
      <Icon.logout className="h-4 w-4" />
      {compact ? <span className="sr-only">Salir</span> : "Cerrar sesión"}
    </button>
  );
}
