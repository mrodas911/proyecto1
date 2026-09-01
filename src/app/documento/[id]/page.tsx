import type { Metadata } from "next";
import { requireUser } from "@/lib/auth";
import {
  ASPIRATION_LABELS,
  HORIZON_LABELS,
  METHODOLOGY_SHORT,
  NINE_BOX_LABELS,
  NINE_BOX_READINGS,
  OBJECTIVE_LABELS,
  RATING_LABELS,
  RESPONSIBLE_LABELS,
  STAGES,
  STAGE_ORDER,
} from "@/lib/constants";
import { formatDate, formatShortDate, fullName } from "@/lib/format";
import { canSeeDiagnostic, getPlanForPage } from "@/lib/plans";
import { DocumentStyles, Page, SectionTitle } from "./document-parts";

export const metadata: Metadata = { title: "Plan Individual de Desarrollo" };
export const dynamic = "force-dynamic";

/**
 * Documento ejecutivo del plan. Es a la vez la vista imprimible que ve el
 * usuario y la fuente que el motor de PDF renderiza en el servidor: una sola
 * plantilla, sin riesgo de que ambas versiones se desincronicen.
 */
export default async function PlanDocumentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await requireUser();
  const user = { ...session, id: session.sub };
  const plan = await getPlanForPage(id, user);
  const showDiagnostic = canSeeDiagnostic(user.role) && Boolean(plan.diagnostic);

  const person = fullName(plan.employee);
  const allActions = plan.competencies.flatMap((competency) =>
    competency.activities.map((activity) => ({
      ...activity,
      competencyName: competency.competency.name,
    }))
  );
  const scheduled = [...allActions]
    .filter((action) => action.startDate)
    .sort((a, b) => a.startDate!.getTime() - b.startDate!.getTime());
  const indicators = allActions.filter((action) => action.successIndicator);

  return (
    <>
      <DocumentStyles />
      <div className="doc">
        {/* ── Portada ─────────────────────────────────────────────────── */}
        <Page cover>
          <div className="cover-brands">
            <span className="cover-logo">Ruta</span>
            {plan.company.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={plan.company.logoUrl} alt={plan.company.name} className="cover-client-logo" />
            ) : (
              <span className="cover-client">{plan.company.name}</span>
            )}
          </div>

          <div className="cover-main">
            {plan.company.pdfCoverNote && (
              <p className="cover-note">{plan.company.pdfCoverNote}</p>
            )}
            <h1 className="cover-title">Plan Individual de Desarrollo</h1>
            <p className="cover-person">{person}</p>
            <p className="cover-meta">
              {plan.employee.positionTitle ?? "Sin cargo registrado"}
              <br />
              {plan.company.name}
            </p>
          </div>

          <div className="cover-footer">
            <span>{formatDate(plan.planDate)}</span>
            <span>
              {plan.version > 1 ? `Versión ${plan.version}` : "Versión 1"} · Metodología 70-20-10
            </span>
          </div>
        </Page>

        {/* ── Perfil ──────────────────────────────────────────────────── */}
        <Page number={2} person={person}>
          <SectionTitle eyebrow="01" title="Perfil de la persona" />
          <table className="data-table">
            <tbody>
              <tr><th>Nombre</th><td>{person}</td></tr>
              <tr><th>Cargo actual</th><td>{plan.employee.positionTitle ?? "—"}</td></tr>
              <tr><th>Área</th><td>{plan.employee.area ?? "—"}</td></tr>
              <tr><th>Unidad de negocio</th><td>{plan.employee.businessUnit ?? "—"}</td></tr>
              <tr><th>Ubicación</th><td>{plan.employee.location ?? "—"}</td></tr>
              <tr>
                <th>Líder</th>
                <td>{plan.employee.managerName ?? fullName(plan.author)}</td>
              </tr>
              <tr><th>Empresa</th><td>{plan.company.name}</td></tr>
              {plan.employee.hiredAt && (
                <tr><th>En la organización desde</th><td>{formatDate(plan.employee.hiredAt)}</td></tr>
              )}
              {plan.objectiveType === "FUTURE_ROLE" && (
                <>
                  <tr>
                    <th>Posición objetivo</th>
                    <td>{plan.targetPositionTitle ?? "Por definir"}</td>
                  </tr>
                  <tr>
                    <th>Área de destino</th>
                    <td>{plan.targetPositionArea ?? "—"}</td>
                  </tr>
                  <tr>
                    <th>Horizonte</th>
                    <td>{plan.horizon ? HORIZON_LABELS[plan.horizon] : "—"}</td>
                  </tr>
                </>
              )}
              <tr><th>Fecha del plan</th><td>{formatDate(plan.planDate)}</td></tr>
              <tr><th>Elaborado por</th><td>{fullName(plan.author)}</td></tr>
            </tbody>
          </table>
        </Page>

        {/* ── Diagnóstico ─────────────────────────────────────────────── */}
        <Page number={3} person={person}>
          <SectionTitle eyebrow="02" title="Punto de partida" />
          {showDiagnostic && plan.diagnostic ? (
            <>
              <div className="metrics">
                <div className="metric">
                  <span className="metric-label">Desempeño</span>
                  <span className="metric-value">
                    {RATING_LABELS[plan.diagnostic.performance]}
                  </span>
                </div>
                <div className="metric">
                  <span className="metric-label">Potencial</span>
                  <span className="metric-value">
                    {RATING_LABELS[plan.diagnostic.potential]}
                  </span>
                </div>
                <div className="metric">
                  <span className="metric-label">Aspiración</span>
                  <span className="metric-value small">
                    {ASPIRATION_LABELS[plan.diagnostic.aspiration]}
                  </span>
                </div>
              </div>

              {plan.diagnostic.nineBox && (
                <div className="callout">
                  <p className="callout-title">
                    {NINE_BOX_LABELS[plan.diagnostic.nineBox]}
                  </p>
                  <p>{NINE_BOX_READINGS[plan.diagnostic.nineBox]}</p>
                </div>
              )}

              {plan.diagnostic.aspirationNote && (
                <p className="para">
                  <strong>Sobre su proyección:</strong> {plan.diagnostic.aspirationNote}
                </p>
              )}
              {plan.diagnostic.notes && <p className="para">{plan.diagnostic.notes}</p>}
            </>
          ) : (
            <p className="para">
              Este plan parte de una lectura previa del desempeño, el potencial y la
              aspiración de {plan.employee.firstName}. El detalle de esa valoración es
              información confidencial y se conserva bajo la custodia de Talento Humano.
            </p>
          )}

          <p className="para muted-para">
            El diagnóstico orienta el tipo de experiencias propuestas, pero no sustituye el
            criterio del líder: la plataforma recomienda y la conversación decide.
          </p>
        </Page>

        {/* ── Objetivo y competencias ─────────────────────────────────── */}
        <Page number={4} person={person}>
          <SectionTitle eyebrow="03" title="Objetivo del desarrollo" />
          <p className="lead">
            {plan.objectiveType
              ? OBJECTIVE_LABELS[plan.objectiveType]
              : "Objetivo por definir"}
          </p>
          {plan.objectiveStatement && <p className="para">{plan.objectiveStatement}</p>}

          <h3 className="subhead">Competencias prioritarias</h3>
          <div className="competency-list">
            {plan.competencies.map((competency, index) => (
              <div key={competency.id} className="competency-item">
                <span className="competency-index">{index + 1}</span>
                <div>
                  <p className="competency-name">{competency.competency.name}</p>
                  <p className="competency-gap">
                    Nivel actual {competency.currentLevel} → nivel requerido{" "}
                    {competency.requiredLevel}
                  </p>
                  <p className="competency-objective">
                    {competency.objective ?? competency.competency.definition + "."}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Page>

        {/* ── Cómo funciona el método ─────────────────────────────────── */}
        <Page number={5} person={person}>
          <SectionTitle eyebrow="04" title="¿Cómo funciona el 70-20-10?" />
          <p className="para">
            Las personas no se desarrollan principalmente en un aula. Aprenden en el trabajo,
            de otras personas y, en menor medida, en la formación estructurada. Este plan
            combina los tres espacios de forma deliberada.
          </p>

          <div className="stage-grid">
            {STAGE_ORDER.map((methodology) => {
              const stage = STAGES[methodology];
              const count = allActions.filter((a) => a.methodology === methodology).length;
              return (
                <div key={methodology} className="stage-block">
                  <span className="stage-pct" style={{ color: stage.color }}>
                    {stage.pct}
                  </span>
                  <p className="stage-title">{stage.title}</p>
                  <p className="stage-text">{stage.hint}</p>
                  <p className="stage-count">
                    {count} acción{count === 1 ? "" : "es"} en este plan
                  </p>
                </div>
              );
            })}
          </div>

          <p className="para muted-para">
            El plan se construye de menor a mayor exposición: primero se adquiere el marco
            (10%), después se busca el acompañamiento adecuado (20%) y finalmente se asume
            la experiencia real donde la competencia se pone a prueba (70%).
          </p>
        </Page>

        {/* ── Ruta por competencia ────────────────────────────────────── */}
        {plan.competencies.map((competency, index) => (
          <Page key={competency.id} number={6 + index} person={person}>
            <SectionTitle
              eyebrow={`Competencia ${index + 1} de ${plan.competencies.length}`}
              title={competency.competency.name}
            />
            <p className="lead">
              {competency.objective ?? competency.competency.definition + "."}
            </p>
            <p className="para muted-para">
              <strong>Comportamiento esperado. </strong>
              {competency.competency.expectedBehavior}
            </p>

            {STAGE_ORDER.map((methodology) => {
              const actions = competency.activities.filter(
                (a) => a.methodology === methodology
              );
              if (actions.length === 0) return null;
              const stage = STAGES[methodology];
              return (
                <div key={methodology} className="stage-section">
                  <p className="stage-heading" style={{ borderColor: stage.color }}>
                    <span style={{ color: stage.color }}>
                      {METHODOLOGY_SHORT[methodology]}
                    </span>{" "}
                    {stage.title}
                  </p>
                  {actions.map((action) => (
                    <div key={action.id} className="action">
                      <p className="action-title">{action.title}</p>
                      {action.objective && <p className="action-objective">{action.objective}</p>}
                      <table className="action-table">
                        <tbody>
                          <tr>
                            <th>Responsable</th>
                            <td>
                              {action.responsibleName ??
                                RESPONSIBLE_LABELS[action.responsibleType]}
                            </td>
                            <th>Frecuencia</th>
                            <td>{action.frequency ?? "—"}</td>
                          </tr>
                          <tr>
                            <th>Inicio</th>
                            <td>{formatShortDate(action.startDate)}</td>
                            <th>Fecha objetivo</th>
                            <td>{formatShortDate(action.targetDate)}</td>
                          </tr>
                          <tr>
                            <th>Indicador de éxito</th>
                            <td colSpan={3}>{action.successIndicator ?? "—"}</td>
                          </tr>
                          <tr>
                            <th>Evidencia esperada</th>
                            <td colSpan={3}>{action.expectedEvidence ?? "—"}</td>
                          </tr>
                          {action.notes && (
                            <tr>
                              <th>Observaciones</th>
                              <td colSpan={3}>{action.notes}</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  ))}
                </div>
              );
            })}
          </Page>
        ))}

        {/* ── Cronograma ──────────────────────────────────────────────── */}
        <Page number={6 + plan.competencies.length} person={person}>
          <SectionTitle eyebrow="05" title="Cronograma" />
          <p className="para">
            Distribución de las acciones en el tiempo. Sirve para acordar los momentos de
            revisión entre {plan.employee.firstName} y su líder.
          </p>
          {scheduled.length === 0 ? (
            <p className="para muted-para">Las acciones aún no tienen fechas asignadas.</p>
          ) : (
            <div className="timeline">
              {scheduled.map((action) => (
                <div key={action.id} className="timeline-item">
                  <div className="timeline-dates">
                    <span>{formatShortDate(action.startDate)}</span>
                    <span className="timeline-arrow">→</span>
                    <span>{formatShortDate(action.targetDate)}</span>
                  </div>
                  <div className="timeline-body">
                    <p className="timeline-title">{action.title}</p>
                    <p className="timeline-meta">
                      {METHODOLOGY_SHORT[action.methodology]} · {action.competencyName} ·{" "}
                      {action.responsibleName ?? RESPONSIBLE_LABELS[action.responsibleType]}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Page>

        {/* ── Indicadores y compromisos ───────────────────────────────── */}
        <Page number={7 + plan.competencies.length} person={person}>
          <SectionTitle eyebrow="06" title="¿Cómo sabremos que hubo desarrollo?" />
          {indicators.length === 0 ? (
            <p className="para muted-para">Aún no se han definido indicadores de éxito.</p>
          ) : (
            <table className="data-table indicators">
              <thead>
                <tr>
                  <th>Competencia</th>
                  <th>Acción</th>
                  <th>Indicador de éxito</th>
                </tr>
              </thead>
              <tbody>
                {indicators.map((action) => (
                  <tr key={action.id}>
                    <td>{action.competencyName}</td>
                    <td>{action.title}</td>
                    <td>{action.successIndicator}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <h3 className="subhead">Compromisos</h3>
          <div className="commitments">
            <div className="commitment">
              <p className="commitment-role">Compromiso del colaborador</p>
              <p className="commitment-text">
                Ejecutar las acciones acordadas, preparar cada conversación de seguimiento y
                aportar las evidencias comprometidas dentro de los plazos definidos.
              </p>
              <div className="signature">
                <span className="signature-line" />
                <span className="signature-name">{person}</span>
              </div>
            </div>
            <div className="commitment">
              <p className="commitment-role">Compromiso del líder</p>
              <p className="commitment-text">
                Facilitar las experiencias y el tiempo necesarios, sostener las conversaciones
                de seguimiento acordadas y dar retroalimentación oportuna sobre el avance.
              </p>
              <div className="signature">
                <span className="signature-line" />
                <span className="signature-name">
                  {plan.employee.managerName ?? fullName(plan.author)}
                </span>
              </div>
            </div>
          </div>
        </Page>

        {/* ── Resumen y cierre ────────────────────────────────────────── */}
        <Page number={8 + plan.competencies.length} person={person} last>
          <SectionTitle eyebrow="07" title="Resumen de la ruta" />
          <table className="data-table summary">
            <thead>
              <tr>
                <th>Competencia</th>
                <th>10% Aprendo</th>
                <th>20% Me acompañan</th>
                <th>70% Lo pongo en práctica</th>
              </tr>
            </thead>
            <tbody>
              {plan.competencies.map((competency) => (
                <tr key={competency.id}>
                  <td className="summary-competency">{competency.competency.name}</td>
                  {STAGE_ORDER.map((methodology) => (
                    <td key={methodology}>
                      <ul className="summary-list">
                        {competency.activities
                          .filter((a) => a.methodology === methodology)
                          .map((a) => (
                            <li key={a.id}>{a.title}</li>
                          ))}
                      </ul>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <blockquote className="closing">
            El desarrollo no ocurre en un evento. Ocurre mediante experiencias sostenidas,
            conversaciones y práctica deliberada.
          </blockquote>
        </Page>
      </div>
    </>
  );
}
