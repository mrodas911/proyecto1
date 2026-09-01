import type { ReactNode } from "react";

/** Hoja del documento. En pantalla se ve como un folio; al imprimir salta de página. */
export function Page({
  children, number, person, cover, last,
}: {
  children: ReactNode;
  number?: number;
  person?: string;
  cover?: boolean;
  last?: boolean;
}) {
  return (
    <section className={`page${cover ? " page-cover" : ""}${last ? " page-last" : ""}`}>
      {!cover && (
        <header className="page-head">
          <span>Plan Individual de Desarrollo</span>
          <span>{person}</span>
        </header>
      )}
      <div className="page-body">{children}</div>
      {!cover && (
        <footer className="page-foot">
          <span>Ruta · Metodología 70-20-10</span>
          {number && <span>{number}</span>}
        </footer>
      )}
    </section>
  );
}

export function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <header className="section-head">
      <p className="section-eyebrow">{eyebrow}</p>
      <h2 className="section-h2">{title}</h2>
    </header>
  );
}

/**
 * Estilos del documento, independientes del sistema de la aplicación:
 * la hoja debe verse igual en pantalla, al imprimir y en el PDF del servidor.
 */
export function DocumentStyles() {
  return <style dangerouslySetInnerHTML={{ __html: CSS }} />;
}

const CSS = `
:root {
  --doc-ink: #14201f;
  --doc-ink-soft: #55635f;
  --doc-line: #dfe3dd;
  --doc-brand: #1f5f5b;
  --doc-brand-soft: #e7f0ee;
}
.doc {
  background: #e8e6e0;
  padding: 28px 0;
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  color: var(--doc-ink);
  font-size: 11pt;
  line-height: 1.55;
}
.page {
  position: relative;
  width: 210mm;
  min-height: 297mm;
  margin: 0 auto 22px;
  padding: 18mm 20mm 16mm;
  background: #fff;
  box-shadow: 0 12px 32px -20px rgba(20, 32, 31, 0.5);
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}
.page-body { flex: 1; }
.page-head {
  display: flex;
  justify-content: space-between;
  font-size: 8pt;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #93a09c;
  border-bottom: 1px solid var(--doc-line);
  padding-bottom: 6px;
  margin-bottom: 16px;
}
.page-foot {
  display: flex;
  justify-content: space-between;
  font-size: 8pt;
  color: #93a09c;
  border-top: 1px solid var(--doc-line);
  padding-top: 6px;
  margin-top: 16px;
}

/* Portada */
.page-cover {
  background: var(--doc-brand);
  color: #fff;
  padding: 22mm 20mm;
}
/* La portada reparte sus tres bloques a lo alto de la hoja. */
.page-cover .page-body {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 253mm;
}
.cover-brands { display: flex; justify-content: space-between; align-items: center; }
.cover-logo { font-size: 15pt; font-weight: 800; letter-spacing: -0.02em; }
.cover-client { font-size: 10pt; opacity: 0.85; }
.cover-client-logo { max-height: 46px; max-width: 190px; object-fit: contain; }
.cover-main { margin-top: auto; margin-bottom: auto; }
.cover-note {
  font-size: 9pt; text-transform: uppercase; letter-spacing: 0.16em;
  opacity: 0.75; margin: 0 0 14px;
}
.cover-title {
  font-size: 34pt; font-weight: 800; line-height: 1.05;
  letter-spacing: -0.03em; margin: 0 0 32px; max-width: 15ch;
}
.cover-person { font-size: 19pt; font-weight: 700; margin: 0 0 8px; }
.cover-meta { font-size: 11pt; opacity: 0.85; margin: 0; line-height: 1.5; }
.cover-footer {
  display: flex; justify-content: space-between;
  font-size: 9pt; opacity: 0.8;
  border-top: 1px solid rgba(255,255,255,0.25); padding-top: 12px;
}

/* Tipografía de sección */
.section-head { margin-bottom: 18px; }
.section-eyebrow {
  font-size: 8pt; font-weight: 700; letter-spacing: 0.16em;
  text-transform: uppercase; color: var(--doc-brand); margin: 0 0 4px;
}
.section-h2 {
  font-size: 20pt; font-weight: 800; letter-spacing: -0.02em; margin: 0;
}
.subhead {
  font-size: 12pt; font-weight: 700; margin: 26px 0 12px;
}
.lead { font-size: 13pt; font-weight: 600; margin: 0 0 12px; }
.para { margin: 0 0 12px; }
.muted-para { color: var(--doc-ink-soft); font-size: 10pt; }

/* Tablas */
.data-table { width: 100%; border-collapse: collapse; font-size: 10pt; }
.data-table th, .data-table td {
  text-align: left; vertical-align: top;
  padding: 8px 10px; border-bottom: 1px solid var(--doc-line);
}
.data-table tbody th { width: 38%; color: var(--doc-ink-soft); font-weight: 500; }
.data-table thead th {
  background: var(--doc-brand-soft); color: var(--doc-brand);
  font-size: 8.5pt; text-transform: uppercase; letter-spacing: 0.06em;
}
.indicators td { font-size: 9.5pt; }

/* Métricas del diagnóstico */
.metrics { display: flex; gap: 10px; margin-bottom: 18px; }
.metric {
  flex: 1; background: #f5f3ee; border-radius: 10px; padding: 14px 16px;
}
.metric-label {
  display: block; font-size: 8.5pt; text-transform: uppercase;
  letter-spacing: 0.08em; color: #8b968f;
}
.metric-value { display: block; font-size: 15pt; font-weight: 700; margin-top: 4px; }
.metric-value.small { font-size: 10.5pt; line-height: 1.3; margin-top: 6px; }

.callout {
  background: var(--doc-brand-soft); border-radius: 10px;
  padding: 14px 16px; margin-bottom: 16px; font-size: 10pt;
}
.callout-title { font-weight: 700; color: var(--doc-brand); margin: 0 0 4px; }
.callout p { margin: 0; }

/* Competencias */
.competency-list { display: flex; flex-direction: column; gap: 12px; }
.competency-item {
  display: flex; gap: 14px; border: 1px solid var(--doc-line);
  border-radius: 10px; padding: 14px 16px;
}
.competency-index {
  flex: 0 0 26px; height: 26px; border-radius: 999px;
  background: var(--doc-brand); color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-size: 10pt; font-weight: 700;
}
.competency-name {
  margin: 0; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.04em; font-size: 11pt;
}
.competency-gap { margin: 2px 0 6px; font-size: 9pt; color: var(--doc-ink-soft); }
.competency-objective { margin: 0; font-size: 10pt; }

/* Explicación del método */
.stage-grid { display: flex; gap: 12px; margin: 20px 0; }
.stage-block {
  flex: 1; border: 1px solid var(--doc-line); border-radius: 10px; padding: 14px;
}
.stage-pct { font-size: 20pt; font-weight: 800; letter-spacing: -0.02em; }
.stage-title { margin: 4px 0 6px; font-weight: 700; font-size: 11pt; }
.stage-text { margin: 0; font-size: 9pt; color: var(--doc-ink-soft); }
.stage-count { margin: 8px 0 0; font-size: 8.5pt; font-weight: 600; color: var(--doc-brand); }

/* Acciones */
.stage-section { margin-top: 20px; }
.stage-heading {
  border-left: 3px solid; padding-left: 10px;
  font-weight: 700; font-size: 11pt; margin: 0 0 10px;
}
.action {
  border: 1px solid var(--doc-line); border-radius: 10px;
  padding: 12px 14px; margin-bottom: 10px;
  break-inside: avoid; page-break-inside: avoid;
}
.action-title { margin: 0; font-weight: 700; font-size: 10.5pt; }
.action-objective { margin: 4px 0 8px; font-size: 9.5pt; color: var(--doc-ink-soft); }
.action-table { width: 100%; border-collapse: collapse; font-size: 9pt; }
.action-table th {
  text-align: left; font-weight: 500; color: #8b968f;
  padding: 3px 8px 3px 0; width: 22%; vertical-align: top;
}
.action-table td { padding: 3px 12px 3px 0; vertical-align: top; }

/* Cronograma */
.timeline { border-left: 2px solid var(--doc-line); padding-left: 16px; }
.timeline-item {
  position: relative; margin-bottom: 14px;
  break-inside: avoid; page-break-inside: avoid;
}
.timeline-item::before {
  content: ""; position: absolute; left: -21px; top: 6px;
  width: 8px; height: 8px; border-radius: 999px; background: var(--doc-brand);
}
.timeline-dates {
  font-size: 8.5pt; color: var(--doc-ink-soft);
  display: flex; gap: 6px; align-items: center;
}
.timeline-arrow { color: #b6bfba; }
.timeline-title { margin: 2px 0 0; font-weight: 600; font-size: 10.5pt; }
.timeline-meta { margin: 1px 0 0; font-size: 9pt; color: var(--doc-ink-soft); }

/* Compromisos */
.commitments { display: flex; gap: 14px; margin-top: 12px; }
.commitment {
  flex: 1; border: 1px solid var(--doc-line); border-radius: 10px; padding: 16px;
}
.commitment-role {
  margin: 0 0 8px; font-weight: 700; color: var(--doc-brand); font-size: 10pt;
}
.commitment-text { margin: 0; font-size: 9.5pt; color: var(--doc-ink-soft); }
.signature { margin-top: 34px; }
.signature-line { display: block; border-top: 1px solid var(--doc-ink); }
.signature-name { display: block; margin-top: 5px; font-size: 9pt; }

/* Resumen final */
.summary td, .summary th { font-size: 9pt; }
.summary-competency { font-weight: 700; width: 22%; }
.summary-list { margin: 0; padding-left: 14px; }
.summary-list li { margin-bottom: 3px; }
.closing {
  margin: 34px 0 0; padding: 20px 22px;
  background: var(--doc-brand-soft); border-radius: 12px;
  font-size: 13pt; font-style: italic; font-weight: 600;
  color: var(--doc-brand); line-height: 1.45;
}

@media print {
  @page { size: A4; margin: 0; }
  body { background: #fff; }
  .doc { background: #fff; padding: 0; }
  .page {
    margin: 0;
    box-shadow: none;
    page-break-after: always;
    break-after: page;
  }
  .page-last { page-break-after: auto; break-after: auto; }
  .page-cover { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .data-table thead th, .callout, .closing, .competency-index {
    -webkit-print-color-adjust: exact; print-color-adjust: exact;
  }
}

@media screen and (max-width: 900px) {
  .page { width: 100%; min-height: auto; padding: 24px 20px; }
  .metrics, .stage-grid, .commitments { flex-direction: column; }
  .cover-title { font-size: 26pt; }
}
`;
