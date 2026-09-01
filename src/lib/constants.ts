import type {
  Aspiration,
  CompetencyCategory,
  Difficulty,
  DevelopmentType,
  Horizon,
  Methodology,
  ObjectiveType,
  PlanStatus,
  RatingLevel,
  ResponsibleType,
} from "@prisma/client";

/** Textos de las tres etapas. Microcopy en lenguaje humano, no técnico de RR. HH. */
export const STAGES: Record<
  Methodology,
  {
    key: Methodology;
    pct: string;
    title: string;
    question: string;
    hint: string;
    color: string;
    customPlaceholder: string;
  }
> = {
  M10: {
    key: "M10",
    pct: "10%",
    title: "Aprendo",
    question: "¿Qué necesita aprender para desarrollar esta competencia?",
    hint: "Formación, lecturas, microcursos y contenidos que dan el marco conceptual.",
    color: "#2F6FED",
    customPlaceholder: "Ej.: Leer el informe de mercado del sector y resumir tres implicaciones.",
  },
  M20: {
    key: "M20",
    pct: "20%",
    title: "Me acompañan",
    question: "¿Quién puede acompañarlo, desafiarlo o ayudarlo a aprender?",
    hint: "Mentoría, coaching, feedback y conversaciones con personas que ya lo hacen bien.",
    color: "#B8712A",
    customPlaceholder: "Ej.: Sesión mensual de mentoring con el Director Comercial durante tres meses.",
  },
  M70: {
    key: "M70",
    pct: "70%",
    title: "Lo pongo en práctica",
    question: "¿Dónde podrá ponerlo en práctica?",
    hint: "Proyectos, retos y responsabilidades reales. Aquí ocurre el verdadero desarrollo.",
    color: "#1F5F5B",
    customPlaceholder: "Ej.: Liderar la presentación de una iniciativa transversal ante tres áreas.",
  },
};

/** Orden pedagógico de construcción: primero 10, luego 20, al final 70. */
export const STAGE_ORDER: Methodology[] = ["M10", "M20", "M70"];

export const METHODOLOGY_LABELS: Record<Methodology, string> = {
  M10: "10% · Aprendizaje formal",
  M20: "20% · Aprendizaje social",
  M70: "70% · Experiencia en el trabajo",
};

export const METHODOLOGY_SHORT: Record<Methodology, string> = {
  M10: "10%",
  M20: "20%",
  M70: "70%",
};

export const RATING_LABELS: Record<RatingLevel, string> = {
  LOW: "Bajo",
  MEDIUM: "Medio",
  HIGH: "Alto",
};

export const ASPIRATION_LABELS: Record<Aspiration, string> = {
  GROW_LEADERSHIP: "Asumir responsabilidades de liderazgo",
  GROW_SPECIALIST: "Profundizar como especialista o experto",
  LATERAL_MOVE: "Moverse a otra área o función",
  CONSOLIDATE: "Consolidarse en su rol actual",
  UNDEFINED: "Aún no la ha definido",
};

export const OBJECTIVE_LABELS: Record<ObjectiveType, string> = {
  CURRENT_ROLE: "Fortalecer el desempeño en su posición actual",
  FUTURE_ROLE: "Prepararse para una posición futura",
};

export const OBJECTIVE_DESCRIPTIONS: Record<ObjectiveType, string> = {
  CURRENT_ROLE:
    "Desarrollar competencias que permitan alcanzar un nivel superior de desempeño dentro del rol actual.",
  FUTURE_ROLE:
    "Desarrollar competencias necesarias para asumir mayores responsabilidades o una posición objetivo.",
};

export const HORIZON_LABELS: Record<Horizon, string> = {
  LT_12M: "Menos de 12 meses",
  M12_24: "Entre 12 y 24 meses",
  GT_24M: "Más de 24 meses",
};

export const STATUS_LABELS: Record<PlanStatus, string> = {
  DRAFT: "Borrador",
  FINALIZED: "Finalizado",
  DOWNLOADED: "Descargado",
  IN_PROGRESS: "En ejecución",
  COMPLETED: "Completado",
};

export const RESPONSIBLE_LABELS: Record<ResponsibleType, string> = {
  EMPLOYEE: "El colaborador",
  LEADER: "El líder / jefe directo",
  MENTOR: "Mentor o coach",
  HR: "Talento Humano",
  OTHER: "Otro",
};

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  BASIC: "Básico",
  INTERMEDIATE: "Intermedio",
  ADVANCED: "Avanzado",
};

export const DEVELOPMENT_TYPE_LABELS: Record<DevelopmentType, string> = {
  CURRENT: "Puesto actual",
  FUTURE: "Posición futura",
  BOTH: "Ambos",
};

export const CATEGORY_LABELS: Record<CompetencyCategory, string> = {
  LEADERSHIP: "Liderazgo",
  BUSINESS: "Negocio",
  INTERPERSONAL: "Interpersonales",
  STRATEGIC: "Estratégicas",
  EXECUTION: "Ejecución",
};

/** Pasos del asistente. El usuario siempre sabe dónde está y cuánto le falta. */
export const WIZARD_STEPS = [
  { step: 1, slug: "persona", label: "Persona" },
  { step: 2, slug: "diagnostico", label: "Diagnóstico" },
  { step: 3, slug: "objetivo", label: "Objetivo" },
  { step: 4, slug: "competencias", label: "Competencias" },
  { step: 5, slug: "aprender", label: "Aprender" },
  { step: 6, slug: "conectar", label: "Conectar" },
  { step: 7, slug: "experimentar", label: "Experimentar" },
  { step: 8, slug: "revisar", label: "Revisar" },
  { step: 9, slug: "generar", label: "Generar plan" },
] as const;

export type WizardSlug = (typeof WIZARD_STEPS)[number]["slug"];

export function stepBySlug(slug: string) {
  return WIZARD_STEPS.find((s) => s.slug === slug);
}

/** Casilla del 9 Box a partir de desempeño × potencial. */
export function nineBoxCell(performance: RatingLevel, potential: RatingLevel): number {
  const p = { LOW: 0, MEDIUM: 1, HIGH: 2 }[performance];
  const q = { LOW: 0, MEDIUM: 1, HIGH: 2 }[potential];
  return p * 3 + q + 1;
}

export const NINE_BOX_LABELS: Record<number, string> = {
  1: "En riesgo",
  2: "Desempeño insuficiente",
  3: "Enigma / potencial por encauzar",
  4: "Profesional en desarrollo",
  5: "Colaborador sólido",
  6: "Alto potencial emergente",
  7: "Especialista de alto desempeño",
  8: "Alto desempeño consolidado",
  9: "Talento estrella",
};

export const NINE_BOX_READINGS: Record<number, string> = {
  1: "Requiere primero consolidar los fundamentos del rol antes de asumir nuevos retos. El plan debe concentrarse en cerrar brechas de ejecución.",
  2: "Cuenta con capacidad, pero los resultados aún no acompañan. El desarrollo debe apoyarse en acompañamiento cercano y práctica guiada.",
  3: "Muestra potencial que todavía no se traduce en resultados. Conviene combinar formación con retos acotados y feedback frecuente.",
  4: "Avanza de forma constante. El plan debe reforzar la consistencia y ampliar progresivamente el alcance de sus responsabilidades.",
  5: "Es un aporte estable para el equipo. El desarrollo puede orientarse a profundizar su especialidad y ampliar su influencia.",
  6: "Tiene margen de crecimiento importante. Conviene exponerlo a proyectos transversales y a interlocutores de mayor nivel.",
  7: "Entrega resultados sobresalientes en su ámbito. El plan debe consolidar su rol de referente y su capacidad de transferir conocimiento.",
  8: "Desempeño alto y sostenido con potencial de crecimiento. Es candidato natural a asumir responsabilidades mayores.",
  9: "Combina resultados y potencial destacados. El plan debe priorizar experiencias de alta exposición y preparación para la sucesión.",
};
