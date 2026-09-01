import { notFound, redirect } from "next/navigation";
import type { Methodology } from "@prisma/client";
import { requireUser } from "@/lib/auth";
import { stepBySlug } from "@/lib/constants";
import { fullName, toDateInput } from "@/lib/format";
import { advanceWizard, getPlanForPage } from "@/lib/plans";
import { toolUsage } from "@/lib/plan-service";
import { validatePlan } from "@/lib/plan-validation";
import { prisma } from "@/lib/prisma";
import { getRules } from "@/lib/settings";
import type { WizardHeader } from "@/components/wizard/frame";
import { StepCompetencias } from "@/components/wizard/step-competencias";
import { StepDiagnostico } from "@/components/wizard/step-diagnostico";
import { StepEtapa } from "@/components/wizard/step-etapa";
import { StepGenerar } from "@/components/wizard/step-generar";
import { StepObjetivo } from "@/components/wizard/step-objetivo";
import { StepPersona } from "@/components/wizard/step-persona";
import { StepRevisar } from "@/components/wizard/step-revisar";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string; step: string }> };

export default async function WizardStepPage({ params }: Params) {
  const { id, step: slug } = await params;
  const step = stepBySlug(slug);
  if (!step) notFound();

  const session = await requireUser();
  const user = { ...session, id: session.sub };
  const plan = await getPlanForPage(id, user);
  if (plan.status !== "DRAFT") redirect(`/planes/${plan.id}`);

  await advanceWizard(plan.id, plan.wizardStep, step.step);
  const rules = await getRules(plan.companyId);

  const header: WizardHeader = {
    planId: plan.id,
    step: step.step,
    reachedStep: Math.max(plan.wizardStep, step.step),
    personName: fullName(plan.employee),
    personRole: plan.employee.positionTitle ?? "Sin cargo registrado",
  };

  switch (step.slug) {
    case "persona":
      return (
        <StepPersona
          header={header}
          data={{
            employeeId: plan.employee.id,
            firstName: plan.employee.firstName,
            lastName: plan.employee.lastName,
            email: plan.employee.email ?? "",
            companyName: plan.company.name,
            area: plan.employee.area ?? "",
            positionTitle: plan.employee.positionTitle ?? "",
            managerName: plan.employee.managerName ?? "",
            location: plan.employee.location ?? "",
            businessUnit: plan.employee.businessUnit ?? "",
            hierarchyLevel: plan.employee.hierarchyLevel,
            hiredAt: toDateInput(plan.employee.hiredAt),
            planDate: toDateInput(plan.planDate),
          }}
        />
      );

    case "diagnostico": {
      const [performanceEval, potentialEval] = await Promise.all([
        prisma.performanceEvaluation.findFirst({
          where: { employeeId: plan.employeeId },
          orderBy: { createdAt: "desc" },
        }),
        prisma.potentialEvaluation.findFirst({
          where: { employeeId: plan.employeeId },
          orderBy: { createdAt: "desc" },
        }),
      ]);
      return (
        <StepDiagnostico
          header={header}
          data={{
            source: plan.diagnostic?.source ?? "MANUAL",
            performance: plan.diagnostic?.performance ?? null,
            potential: plan.diagnostic?.potential ?? null,
            aspiration: plan.diagnostic?.aspiration ?? "UNDEFINED",
            aspirationNote: plan.diagnostic?.aspirationNote ?? "",
            notes: plan.diagnostic?.notes ?? "",
          }}
          performanceEval={
            performanceEval
              ? {
                  period: performanceEval.period,
                  rating: performanceEval.rating,
                  comment: performanceEval.comment,
                }
              : null
          }
          potentialEval={
            potentialEval
              ? {
                  period: potentialEval.period,
                  rating: potentialEval.rating,
                  comment: potentialEval.comment,
                }
              : null
          }
        />
      );
    }

    case "objetivo": {
      const usage = toolUsage(plan, rules);
      return (
        <StepObjetivo
          header={header}
          data={{
            objectiveType: plan.objectiveType,
            objectiveStatement: plan.objectiveStatement ?? "",
            targetPositionTitle: plan.targetPositionTitle ?? "",
            targetPositionArea: plan.targetPositionArea ?? "",
            horizon: plan.horizon,
            personName: plan.employee.firstName,
          }}
          quotaCurrent={rules.toolsAllowedCurrentRole}
          quotaFuture={rules.toolsAllowedFutureRole}
          usedTools={usage.used.length}
        />
      );
    }

    case "competencias": {
      const catalog = await prisma.competency.findMany({
        where: {
          active: true,
          OR: [{ companyId: null }, { companyId: plan.companyId }],
        },
        orderBy: [{ order: "asc" }, { name: "asc" }],
        include: { levels: { orderBy: { level: "asc" } } },
      });
      return (
        <StepCompetencias
          header={header}
          maxCompetencies={rules.maxCompetencies}
          catalog={catalog.map((c) => ({
            id: c.id,
            name: c.name,
            definition: c.definition,
            expectedBehavior: c.expectedBehavior,
            category: c.category,
            levels: c.levels.map((l) => ({
              level: l.level,
              name: l.name,
              description: l.description,
            })),
          }))}
          initialSelected={plan.competencies.map((c) => ({
            id: c.id,
            competencyId: c.competencyId,
            currentLevel: c.currentLevel,
            requiredLevel: c.requiredLevel,
            objective: c.objective ?? "",
          }))}
        />
      );
    }

    case "aprender":
    case "conectar":
    case "experimentar": {
      const methodology: Methodology =
        step.slug === "aprender" ? "M10" : step.slug === "conectar" ? "M20" : "M70";
      const usage = toolUsage(plan, rules);
      return (
        <StepEtapa
          header={header}
          stepNumber={step.step}
          methodology={methodology}
          usage={{ usedCount: usage.used.length, quota: usage.quota }}
          competencies={plan.competencies.map((c) => ({
            planCompetencyId: c.id,
            competencyId: c.competencyId,
            name: c.competency.name,
            objective: c.objective,
            actions: c.activities
              .filter((a) => a.methodology === methodology)
              .map((a) => ({
                id: a.id,
                title: a.title,
                activityId: a.activityId,
                toolName: a.tool?.name ?? null,
              })),
          }))}
        />
      );
    }

    case "revisar": {
      const report = validatePlan(plan, rules);
      return (
        <StepRevisar
          header={header}
          validation={{
            completion: report.completion,
            checks: report.checks.map((c) => ({
              id: c.id, label: c.label, ok: c.ok, detail: c.detail, step: c.step,
            })),
          }}
          suggestions={{
            employeeName: fullName(plan.employee),
            leaderName: plan.employee.managerName ?? fullName(plan.author),
          }}
          competencies={plan.competencies.map((c) => ({
            planCompetencyId: c.id,
            name: c.competency.name,
            objective: c.objective,
            currentLevel: c.currentLevel,
            requiredLevel: c.requiredLevel,
            actions: c.activities.map((a) => ({
              id: a.id,
              methodology: a.methodology,
              title: a.title,
              objective: a.objective ?? "",
              responsibleType: a.responsibleType,
              responsibleName: a.responsibleName ?? "",
              startDate: toDateInput(a.startDate),
              targetDate: toDateInput(a.targetDate),
              frequency: a.frequency ?? "",
              successIndicator: a.successIndicator ?? "",
              expectedEvidence: a.expectedEvidence ?? "",
              notes: a.notes ?? "",
              toolName: a.tool?.name ?? null,
            })),
          }))}
        />
      );
    }

    case "generar": {
      const report = validatePlan(plan, rules);
      const stages: Record<string, number> = {};
      for (const competency of plan.competencies) {
        for (const activity of competency.activities) {
          stages[activity.methodology] = (stages[activity.methodology] ?? 0) + 1;
        }
      }
      return (
        <StepGenerar
          header={header}
          threshold={rules.completionThreshold}
          validation={{
            completion: report.completion,
            checks: report.checks.map((c) => ({
              id: c.id, label: c.label, ok: c.ok, detail: c.detail, step: c.step,
            })),
          }}
          summary={{
            competencies: plan.competencies.length,
            actions: plan.competencies.reduce((sum, c) => sum + c.activities.length, 0),
            stages,
          }}
        />
      );
    }

    default:
      notFound();
  }
}
