/** Iconografía mínima en SVG inline: sin dependencias, hereda el color. */
type P = { className?: string };
const base = "h-5 w-5";

export const Icon = {
  home: (p: P) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={p.className ?? base}>
      <path d="M3 10.5 12 3l9 7.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5.5 9.5V20a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1V9.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  route: (p: P) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={p.className ?? base}>
      <circle cx="6" cy="18" r="2.5" /><circle cx="18" cy="6" r="2.5" />
      <path d="M8.5 18h5a4 4 0 0 0 0-8h-3a4 4 0 0 1 0-8" strokeLinecap="round" />
    </svg>
  ),
  users: (p: P) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={p.className ?? base}>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 20a5.5 5.5 0 0 1 11 0" strokeLinecap="round" />
      <path d="M16 5.5a3.2 3.2 0 0 1 0 5M17.5 20a5.5 5.5 0 0 0-2.2-4.4" strokeLinecap="round" />
    </svg>
  ),
  library: (p: P) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={p.className ?? base}>
      <rect x="3" y="4" width="5" height="16" rx="1.2" /><rect x="10" y="4" width="5" height="16" rx="1.2" />
      <path d="m17.2 5.6 3 15" strokeLinecap="round" />
    </svg>
  ),
  settings: (p: P) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={p.className ?? base}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2.5v2.2M12 19.3v2.2M21.5 12h-2.2M4.7 12H2.5M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6M18.7 18.7l-1.6-1.6M6.9 6.9 5.3 5.3" strokeLinecap="round" />
    </svg>
  ),
  help: (p: P) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={p.className ?? base}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.6 9.2a2.5 2.5 0 1 1 3.4 2.3c-.7.3-1 .9-1 1.6v.4" strokeLinecap="round" />
      <circle cx="12" cy="16.8" r=".9" fill="currentColor" stroke="none" />
    </svg>
  ),
  plus: (p: P) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={p.className ?? base}>
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </svg>
  ),
  check: (p: P) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className={p.className ?? base}>
      <path d="m5 12.5 4.5 4.5L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  arrowRight: (p: P) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={p.className ?? base}>
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  arrowLeft: (p: P) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={p.className ?? base}>
      <path d="M19 12H5M11 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  trash: (p: P) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={p.className ?? base}>
      <path d="M4 7h16M9.5 7V5.5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1V7M6.5 7l.8 12a1 1 0 0 0 1 .9h7.4a1 1 0 0 0 1-.9l.8-12" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  edit: (p: P) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={p.className ?? base}>
      <path d="M4 20h4l10-10a2.5 2.5 0 0 0-3.5-3.5L4.5 16.5 4 20Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  download: (p: P) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={p.className ?? base}>
      <path d="M12 3v12M7.5 10.5 12 15l4.5-4.5M4.5 20h15" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  search: (p: P) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={p.className ?? base}>
      <circle cx="11" cy="11" r="6.5" /><path d="m16 16 4.5 4.5" strokeLinecap="round" />
    </svg>
  ),
  sparkles: (p: P) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={p.className ?? base}>
      <path d="m12 3 1.8 4.9L18.7 9.7l-4.9 1.8L12 16.4l-1.8-4.9L5.3 9.7l4.9-1.8L12 3Z" strokeLinejoin="round" />
      <path d="M18.5 15.5 19.4 18l2.5.9-2.5.9-.9 2.5-.9-2.5-2.5-.9 2.5-.9.9-2.5Z" strokeLinejoin="round" />
    </svg>
  ),
  book: (p: P) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={p.className ?? base}>
      <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H19v14H5.5A1.5 1.5 0 0 0 4 19.5v-14Z" strokeLinejoin="round" />
      <path d="M4 19.5A1.5 1.5 0 0 1 5.5 18H19v2.5H5.5A1.5 1.5 0 0 1 4 19.5Z" strokeLinejoin="round" />
    </svg>
  ),
  compass: (p: P) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={p.className ?? base}>
      <circle cx="12" cy="12" r="9" />
      <path d="m15 9-1.8 4.2L9 15l1.8-4.2L15 9Z" strokeLinejoin="round" />
    </svg>
  ),
  target: (p: P) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={p.className ?? base}>
      <circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="4.5" /><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  presentation: (p: P) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={p.className ?? base}>
      <rect x="3" y="4" width="18" height="11" rx="1.5" />
      <path d="M12 15v3.5M8.5 21 12 18.5 15.5 21" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  layers: (p: P) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={p.className ?? base}>
      <path d="m12 3 9 4.8-9 4.8-9-4.8L12 3Z" strokeLinejoin="round" />
      <path d="m3.8 12 8.2 4.4 8.2-4.4M3.8 16.4 12 20.8l8.2-4.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  message: (p: P) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={p.className ?? base}>
      <path d="M20 5.5v9a1.5 1.5 0 0 1-1.5 1.5H9l-4 3.5V5.5A1.5 1.5 0 0 1 6.5 4h12A1.5 1.5 0 0 1 20 5.5Z" strokeLinejoin="round" />
    </svg>
  ),
  headphones: (p: P) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={p.className ?? base}>
      <path d="M4 15v-3a8 8 0 0 1 16 0v3" strokeLinecap="round" />
      <rect x="2.5" y="14" width="4" height="6" rx="1.6" /><rect x="17.5" y="14" width="4" height="6" rx="1.6" />
    </svg>
  ),
  building: (p: P) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={p.className ?? base}>
      <rect x="4" y="3" width="11" height="18" rx="1.4" />
      <path d="M15 9h4.5a.5.5 0 0 1 .5.5V21M7.5 7h4M7.5 11h4M7.5 15h4" strokeLinecap="round" />
    </svg>
  ),
  chart: (p: P) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={p.className ?? base}>
      <path d="M4 20V4M4 20h16" strokeLinecap="round" />
      <path d="M8 17v-5M12.5 17V7M17 17v-8" strokeLinecap="round" />
    </svg>
  ),
  logout: (p: P) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={p.className ?? base}>
      <path d="M14 4h4.5A1.5 1.5 0 0 1 20 5.5v13a1.5 1.5 0 0 1-1.5 1.5H14" strokeLinecap="round" />
      <path d="M10 8 6 12l4 4M6 12h9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  warning: (p: P) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={p.className ?? base}>
      <path d="M12 4.5 21 19.5H3L12 4.5Z" strokeLinejoin="round" />
      <path d="M12 10v3.6" strokeLinecap="round" /><circle cx="12" cy="16.6" r=".9" fill="currentColor" stroke="none" />
    </svg>
  ),
  clock: (p: P) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={p.className ?? base}>
      <circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
} as const;

export type IconName = keyof typeof Icon;

export function ToolIcon({ name, className }: { name: string; className?: string }) {
  const Cmp = (Icon as Record<string, (p: P) => React.JSX.Element>)[name] ?? Icon.sparkles;
  return <Cmp className={className} />;
}
