/**
 * Carga inicial de la plataforma:
 *   1. Reglas globales (regla 5/8, máximo de competencias…).
 *   2. Catálogo global: competencias, herramientas y actividades.
 *   3. Superadministrador.
 *   4. Empresa de demostración con usuarios, colaboradores y planes de ejemplo.
 *
 * Es idempotente: se puede ejecutar varias veces sin duplicar contenido.
 */
import { PrismaClient, type Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { ACTIVITIES, COMPETENCIES, TOOLS, levelName } from "./seed-data";

const prisma = new PrismaClient();

const SUPERADMIN_EMAIL = process.env.SEED_SUPERADMIN_EMAIL ?? "admin@plataforma.com";
const SUPERADMIN_PASSWORD = process.env.SEED_SUPERADMIN_PASSWORD ?? "Admin2026!";
const DEMO_PASSWORD = process.env.SEED_DEMO_PASSWORD ?? "Demo2026!";

async function main() {
  console.log("→ Reglas globales");
  const existingRules = await prisma.companySetting.findFirst({
    where: { key: "rules", companyId: null },
  });
  if (!existingRules) {
    await prisma.companySetting.create({
      data: {
        companyId: null,
        key: "rules",
        value: {
          toolsAllowedCurrentRole: 5,
          toolsAllowedFutureRole: 8,
          maxCompetencies: 3,
          minCompetencies: 1,
          minActionsPer10: 1,
          minActionsPer20: 1,
          minActionsPer70: 1,
          completionThreshold: 80,
        },
      },
    });
  }

  console.log("→ Competencias");
  const competencyIds = new Map<string, string>();
  for (const [index, seed] of COMPETENCIES.entries()) {
    let competency = await prisma.competency.findFirst({
      where: { companyId: null, name: seed.name },
    });
    if (!competency) {
      competency = await prisma.competency.create({
        data: {
          companyId: null,
          name: seed.name,
          definition: seed.definition,
          expectedBehavior: seed.expectedBehavior,
          category: seed.category,
          order: index,
          levels: {
            create: seed.levels.map((description, i) => ({
              level: i + 1,
              name: levelName(i + 1),
              description,
            })),
          },
        },
      });
    }
    competencyIds.set(seed.name, competency.id);
  }

  console.log("→ Herramientas de desarrollo");
  const toolIds = new Map<string, string>();
  for (const seed of TOOLS) {
    let tool = await prisma.developmentTool.findFirst({
      where: { companyId: null, slug: seed.slug },
    });
    if (!tool) {
      tool = await prisma.developmentTool.create({ data: { ...seed, companyId: null } });
    }
    toolIds.set(seed.slug, tool.id);
  }

  console.log("→ Actividades");
  let created = 0;
  for (const seed of ACTIVITIES) {
    const existing = await prisma.activity.findFirst({
      where: { companyId: null, title: seed.title },
    });
    if (existing) continue;
    const links = seed.competencies
      .map((name, i) => {
        const competencyId = competencyIds.get(name);
        if (!competencyId) {
          console.warn(`   ! competencia desconocida en "${seed.title}": ${name}`);
          return null;
        }
        // La primera competencia listada es la principal: mayor peso.
        return { competencyId, weight: Math.max(40, 100 - i * 15) };
      })
      .filter(Boolean) as { competencyId: string; weight: number }[];

    await prisma.activity.create({
      data: {
        companyId: null,
        title: seed.title,
        description: seed.description,
        benefit: seed.benefit,
        methodology: seed.methodology,
        toolId: toolIds.get(seed.tool) ?? null,
        difficulty: seed.difficulty,
        developmentType: seed.developmentType,
        duration: seed.duration,
        suggestedIndicator: seed.indicator,
        suggestedEvidence: seed.evidence,
        suggestedResponsible: seed.responsible,
        minPerformance: seed.minPerformance ?? null,
        minPotential: seed.minPotential ?? null,
        competencies: { create: links },
      },
    });
    created += 1;
  }
  console.log(`   ${created} actividades nuevas (catálogo total: ${ACTIVITIES.length})`);

  console.log("→ Superadministrador");
  await prisma.user.upsert({
    where: { email: SUPERADMIN_EMAIL },
    update: {},
    create: {
      email: SUPERADMIN_EMAIL,
      passwordHash: await bcrypt.hash(SUPERADMIN_PASSWORD, 12),
      firstName: "Consultor",
      lastName: "Plataforma",
      role: "SUPERADMIN",
    },
  });

  await seedDemoCompany();

  console.log("\nListo. Accesos de demostración:");
  console.log(`  Superadministrador   ${SUPERADMIN_EMAIL} / ${SUPERADMIN_PASSWORD}`);
  console.log(`  Talento Humano       th@empresademo.com / ${DEMO_PASSWORD}`);
  console.log(`  Líder                lider@empresademo.com / ${DEMO_PASSWORD}`);
  console.log(`  Colaborador          colaborador@empresademo.com / ${DEMO_PASSWORD}`);
}

async function seedDemoCompany() {
  console.log("→ Empresa de demostración");
  const hash = await bcrypt.hash(DEMO_PASSWORD, 12);

  const company = await prisma.company.upsert({
    where: { slug: "empresa-demo" },
    update: {},
    create: {
      name: "Empresa Demo",
      slug: "empresa-demo",
      primaryColor: "#1F5F5B",
      maxUsers: 25,
      commercialPlan: "PROFESIONAL",
      pdfCoverNote: "Programa de Desarrollo del Talento",
    },
  });

  const positionsData = [
    { title: "Jefe de Tienda", area: "Comercial", level: 3 },
    { title: "Gerente Regional", area: "Comercial", level: 5 },
    { title: "Analista de Operaciones", area: "Operaciones", level: 2 },
    { title: "Coordinador de Operaciones", area: "Operaciones", level: 3 },
    { title: "Directora Comercial", area: "Comercial", level: 6 },
  ];
  const positions = new Map<string, string>();
  for (const p of positionsData) {
    const position = await prisma.position.upsert({
      where: { companyId_title: { companyId: company.id, title: p.title } },
      update: {},
      create: { ...p, companyId: company.id },
    });
    positions.set(p.title, position.id);
  }

  const admin = await prisma.user.upsert({
    where: { email: "th@empresademo.com" },
    update: {},
    create: {
      email: "th@empresademo.com",
      passwordHash: hash,
      firstName: "Carolina",
      lastName: "Restrepo",
      role: "COMPANY_ADMIN",
      companyId: company.id,
    },
  });

  const leader = await prisma.user.upsert({
    where: { email: "lider@empresademo.com" },
    update: {},
    create: {
      email: "lider@empresademo.com",
      passwordHash: hash,
      firstName: "Andrés",
      lastName: "Molina",
      role: "LEADER",
      companyId: company.id,
    },
  });

  const employeesData = [
    {
      firstName: "Juan", lastName: "Pérez", email: "juan.perez@empresademo.com",
      area: "Comercial", positionTitle: "Jefe de Tienda", managerName: "Andrés Molina",
      location: "Bogotá", businessUnit: "Retail", hierarchyLevel: 3,
      performance: "HIGH" as const, potential: "HIGH" as const,
    },
    {
      firstName: "Laura", lastName: "Gómez", email: "laura.gomez@empresademo.com",
      area: "Operaciones", positionTitle: "Analista de Operaciones", managerName: "Andrés Molina",
      location: "Medellín", businessUnit: "Logística", hierarchyLevel: 2,
      performance: "MEDIUM" as const, potential: "HIGH" as const,
    },
    {
      firstName: "Sofía", lastName: "Ramírez", email: "colaborador@empresademo.com",
      area: "Comercial", positionTitle: "Jefe de Tienda", managerName: "Andrés Molina",
      location: "Cali", businessUnit: "Retail", hierarchyLevel: 3,
      performance: "MEDIUM" as const, potential: "MEDIUM" as const,
    },
    {
      firstName: "Diego", lastName: "Cardona", email: "diego.cardona@empresademo.com",
      area: "Operaciones", positionTitle: "Coordinador de Operaciones", managerName: "Carolina Restrepo",
      location: "Bogotá", businessUnit: "Logística", hierarchyLevel: 3,
      performance: "LOW" as const, potential: "MEDIUM" as const,
    },
  ];

  const employees = new Map<string, string>();
  for (const e of employeesData) {
    let employee = await prisma.employee.findFirst({
      where: { companyId: company.id, firstName: e.firstName, lastName: e.lastName },
    });
    if (!employee) {
      employee = await prisma.employee.create({
        data: {
          companyId: company.id,
          firstName: e.firstName,
          lastName: e.lastName,
          email: e.email,
          area: e.area,
          positionTitle: e.positionTitle,
          positionId: positions.get(e.positionTitle) ?? null,
          managerName: e.managerName,
          leaderUserId: leader.id,
          location: e.location,
          businessUnit: e.businessUnit,
          hierarchyLevel: e.hierarchyLevel,
          hiredAt: new Date(2021, 2, 15),
        },
      });
      await prisma.performanceEvaluation.create({
        data: {
          companyId: company.id, employeeId: employee.id,
          period: "2025", rating: e.performance,
          comment: "Evaluación anual de desempeño cargada por Talento Humano.",
        },
      });
      await prisma.potentialEvaluation.create({
        data: {
          companyId: company.id, employeeId: employee.id,
          period: "2025", rating: e.potential,
          comment: "Valoración de potencial del comité de talento.",
        },
      });
    }
    employees.set(`${e.firstName} ${e.lastName}`, employee.id);
  }

  // Cuenta de solo lectura para el colaborador Sofía Ramírez.
  const sofiaId = employees.get("Sofía Ramírez")!;
  await prisma.user.upsert({
    where: { email: "colaborador@empresademo.com" },
    update: {},
    create: {
      email: "colaborador@empresademo.com",
      passwordHash: hash,
      firstName: "Sofía",
      lastName: "Ramírez",
      role: "EMPLOYEE",
      companyId: company.id,
      employeeId: sofiaId,
    },
  });

  // Código de acceso de ejemplo para dar de alta usuarios de la empresa.
  await prisma.accessCode.upsert({
    where: { code: "DEMO-2026" },
    update: {},
    create: {
      companyId: company.id,
      code: "DEMO-2026",
      role: "LEADER",
      maxUses: 10,
      expiresAt: new Date(Date.now() + 365 * 24 * 3600 * 1000),
    },
  });

  await seedExamplePlan(company.id, leader.id, employees.get("Juan Pérez")!, positions);
  void admin;
}

/** Un plan finalizado de ejemplo, para que el histórico no aparezca vacío. */
async function seedExamplePlan(
  companyId: string,
  authorUserId: string,
  employeeId: string,
  positions: Map<string, string>
) {
  const existing = await prisma.developmentPlan.findFirst({ where: { employeeId } });
  if (existing) return;

  const strategic = await prisma.competency.findFirst({
    where: { companyId: null, name: "Pensamiento estratégico" },
  });
  const influence = await prisma.competency.findFirst({
    where: { companyId: null, name: "Influencia" },
  });
  if (!strategic || !influence) return;

  const start = new Date();
  const plus = (days: number) => new Date(start.getTime() + days * 86_400_000);

  const plan = await prisma.developmentPlan.create({
    data: {
      companyId,
      employeeId,
      authorUserId,
      status: "FINALIZED",
      objectiveType: "FUTURE_ROLE",
      objectiveStatement:
        "Preparar a Juan para asumir la Gerencia Regional, ampliando su mirada de negocio y su capacidad de movilizar a otras áreas.",
      targetPositionId: positions.get("Gerente Regional") ?? null,
      targetPositionTitle: "Gerente Regional",
      targetPositionArea: "Comercial",
      horizon: "M12_24",
      wizardStep: 9,
      completion: 100,
      finalizedAt: new Date(),
      diagnostic: {
        create: {
          companyId,
          employeeId,
          source: "EXISTING",
          performance: "HIGH",
          potential: "HIGH",
          aspiration: "GROW_LEADERSHIP",
          aspirationNote: "Manifiesta interés en asumir una gerencia regional.",
          nineBox: 9,
          notes: "Talento estrella del área comercial. Candidato de sucesión.",
        },
      },
    },
  });

  const competencyPlan: {
    competencyId: string;
    priority: number;
    currentLevel: number;
    requiredLevel: number;
    objective: string;
    activities: Omit<Prisma.PlanActivityCreateManyInput, "planId" | "planCompetencyId">[];
  }[] = [
    {
      competencyId: strategic.id,
      priority: 1,
      currentLevel: 2,
      requiredLevel: 4,
      objective:
        "Evolucionar Pensamiento estratégico de un nivel 2 a un nivel 4, fortaleciendo su capacidad de comprender el entorno, anticipar escenarios y conectar decisiones con los objetivos de negocio.",
      activities: [
        {
          methodology: "M10",
          title: "Curso de análisis estratégico y escenarios",
          objective: "Adquirir el marco de análisis del entorno y construcción de escenarios.",
          responsibleType: "EMPLOYEE", responsibleName: "Juan Pérez",
          startDate: plus(7), targetDate: plus(63), frequency: "4 horas semanales",
          successIndicator: "Curso aprobado y análisis de escenarios de su región elaborado",
          expectedEvidence: "Documento de análisis de escenarios", order: 0,
        },
        {
          methodology: "M20",
          title: "Mentoría mensual con la Directora Comercial",
          objective: "Contrastar su lectura del negocio con quien ya ejerce ese nivel.",
          responsibleType: "MENTOR", responsibleName: "Directora Comercial",
          startDate: plus(14), targetDate: plus(194), frequency: "Mensual, 90 minutos",
          successIndicator: "Seis sesiones realizadas con compromisos cumplidos entre sesiones",
          expectedEvidence: "Bitácora de sesiones con acuerdos", order: 0,
        },
        {
          methodology: "M70",
          title: "Liderar un proyecto de mejora comercial en tres tiendas",
          objective:
            "Poner a prueba su capacidad de traducir la estrategia en resultados concretos.",
          responsibleType: "EMPLOYEE", responsibleName: "Juan Pérez",
          startDate: plus(21), targetDate: plus(111), frequency: "Seguimiento quincenal",
          successIndicator: "Incremento de la venta promedio de las tres tiendas frente a la línea base",
          expectedEvidence: "Informe de cierre con resultados por tienda", order: 0,
        },
      ],
    },
    {
      competencyId: influence.id,
      priority: 2,
      currentLevel: 3,
      requiredLevel: 4,
      objective:
        "Evolucionar Influencia de un nivel 3 a un nivel 4, fortaleciendo su capacidad de lograr acuerdos y movilizar decisiones sin depender de la autoridad formal.",
      activities: [
        {
          methodology: "M10",
          title: "Microcurso de comunicación persuasiva",
          objective: "Estructurar mejor sus mensajes ante audiencias de mayor nivel.",
          responsibleType: "EMPLOYEE", responsibleName: "Juan Pérez",
          startDate: plus(7), targetDate: plus(28), frequency: "2 horas semanales",
          successIndicator: "Ruta completada y una presentación reestructurada con el modelo",
          expectedEvidence: "Presentación aplicando la estructura trabajada", order: 0,
        },
        {
          methodology: "M20",
          title: "Feedback estructurado mensual con el líder",
          objective: "Revisar cómo está siendo percibido en sus intervenciones.",
          responsibleType: "LEADER", responsibleName: "Andrés Molina",
          startDate: plus(14), targetDate: plus(194), frequency: "Mensual, 60 minutos",
          successIndicator: "Seis conversaciones realizadas con acuerdos documentados",
          expectedEvidence: "Acta breve de cada conversación", order: 0,
        },
        {
          methodology: "M70",
          title: "Presentar la iniciativa de expansión ante el comité ejecutivo",
          objective: "Conseguir la aprobación de un proyecto sin autoridad formal sobre el comité.",
          responsibleType: "EMPLOYEE", responsibleName: "Juan Pérez",
          startDate: plus(45), targetDate: plus(135), frequency: "Presentación trimestral",
          successIndicator: "Iniciativa aprobada por el comité con presupuesto asignado",
          expectedEvidence: "Acta del comité con la decisión", order: 0,
        },
      ],
    },
  ];

  for (const item of competencyPlan) {
    const planCompetency = await prisma.planCompetency.create({
      data: {
        planId: plan.id,
        competencyId: item.competencyId,
        priority: item.priority,
        currentLevel: item.currentLevel,
        requiredLevel: item.requiredLevel,
        objective: item.objective,
      },
    });
    for (const activity of item.activities) {
      const source = await prisma.activity.findFirst({
        where: { companyId: null, title: activity.title as string },
      });
      await prisma.planActivity.create({
        data: {
          ...activity,
          planId: plan.id,
          planCompetencyId: planCompetency.id,
          activityId: source?.id ?? null,
          toolId: source?.toolId ?? null,
        },
      });
    }
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
