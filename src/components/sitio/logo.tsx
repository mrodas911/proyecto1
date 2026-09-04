/**
 * Marca de Domina. `tone` adapta el color al fondo sobre el que se pinta.
 */
export function Logo({
  tone = "dark",
  className = "",
}: {
  tone?: "dark" | "light";
  className?: string;
}) {
  const texto = tone === "dark" ? "text-dom-900" : "text-white";
  const marca = tone === "dark" ? "var(--color-dom-900)" : "#FFFFFF";

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg viewBox="0 0 32 32" className="h-8 w-8 shrink-0" aria-hidden="true">
        <rect x="0.75" y="0.75" width="30.5" height="30.5" rx="8.5" fill={marca} />
        <path
          d="M11 9.5h5.2c4 0 6.6 2.6 6.6 6.5s-2.6 6.5-6.6 6.5H11z"
          fill="none"
          stroke="var(--color-copper-500)"
          strokeWidth="2.4"
          strokeLinejoin="round"
        />
      </svg>
      <span className={`dom-display text-[22px] leading-none tracking-tight ${texto}`}>
        Domina
      </span>
    </span>
  );
}
