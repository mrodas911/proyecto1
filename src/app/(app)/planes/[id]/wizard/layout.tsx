import { SaveStateProvider } from "@/components/wizard/save-state";

/**
 * El estado de guardado automático se comparte por todo el asistente, de modo
 * que cualquier paso pueda informar del guardado desde su propia cabecera.
 */
export default function WizardLayout({ children }: { children: React.ReactNode }) {
  return <SaveStateProvider>{children}</SaveStateProvider>;
}
