/**
 * Motor de recomendación basado en reglas.
 *
 *   Competencia + tipo de desarrollo + desempeño + potencial + aspiración + brecha
 *      → puntuación de cada actividad del catálogo
 *
 * Es determinista y explicable: cada actividad devuelve los motivos por los que
 * fue priorizada. La firma `recommendActivities` está pensada para que en una
 * fase posterior el cuerpo pueda delegar en un modelo generativo sin que las
 * pantallas que la consumen cambien.
 *
 * Principio de producto: el sistema RECOMIENDA, el líder DECIDE. Ninguna regla
 * elimina actividades del catálogo; solo altera el orden y la etiqueta.
 */
import type {
  Activity,
  ActivityCompetency,
  Aspiration,
  Difficulty,
  Methodology,
  ObjectiveType,
  RatingLevel,
} from "@prisma/client";

const RATING_VALUE: Record<RatingLevel, number> = { LOW: 0, MEDIUM: 1, HIGH: 2 };
const DIFFICULTY_VALUE: Record<Difficulty, number> = {
  BASIC: 0,
  INTERMEDIATE: 1,
  ADVANCED: 2,
};

export type RecommendationContext = {
  objectiveType: ObjectiveType | null;
  performance: RatingLevel | null;
  potential: RatingLevel | null;
  aspiration: Aspiration | null;
  /** Competencias del plan con su brecha (requerido - actual). */
  competencies: { competencyId: string; gap: number }[];
};

export type ScoredActivity<T extends Activity = Activity> = {
  activity: T;
  score: number;
  recommended: boolean;
  reasons: string[];
};

type ActivityWithLinks = Activity & { competencies: ActivityCompetency[] };

/**
 * Puntúa y ordena las actividades de una metodología para un contexto dado.
 * Devuelve TODAS las actividades recibidas; `recommended` marca las destacadas.
 */
export function recommendActivities<T extends ActivityWithLinks>(
  activities: T[],
  context: RecommendationContext,
  methodology?: Methodology
): ScoredActivity<T>[] {
  const competencyIds = new Set(context.competencies.map((c) => c.competencyId));
  const gapByCompetency = new Map(
    context.competencies.map((c) => [c.competencyId, c.gap])
  );
  const maxGap = Math.max(0, ...context.competencies.map((c) => c.gap));

  const scored = activities
    .filter((a) => (methodology ? a.methodology === methodology : true))
    .map((activity) => {
      const reasons: string[] = [];
      let score = 0;

      // 1. Afinidad con las competencias priorizadas del plan.
      const links = activity.competencies.filter((l) => competencyIds.has(l.competencyId));
      if (links.length > 0) {
        const bestWeight = Math.max(...links.map((l) => l.weight));
        score += 40 + bestWeight / 5;
        reasons.push(
          links.length > 1
            ? `Desarrolla ${links.length} de las competencias del plan`
            : "Alineada con la competencia seleccionada"
        );
        // Brecha amplia => más peso a lo que exige más.
        const gap = Math.max(...links.map((l) => gapByCompetency.get(l.competencyId) ?? 0));
        if (gap >= 2) {
          score += DIFFICULTY_VALUE[activity.difficulty] * 6;
          if (activity.difficulty !== "BASIC") reasons.push("Adecuada para una brecha amplia");
        } else if (gap <= 1 && activity.difficulty === "ADVANCED") {
          score -= 6;
        }
      }

      // 2. Coherencia con el objetivo del plan (puesto actual / posición futura).
      if (context.objectiveType === "FUTURE_ROLE") {
        if (activity.developmentType === "FUTURE") {
          score += 18;
          reasons.push("Pensada para preparar una posición futura");
        }
        if (activity.developmentType === "CURRENT") score -= 12;
      } else if (context.objectiveType === "CURRENT_ROLE") {
        if (activity.developmentType === "CURRENT") {
          score += 14;
          reasons.push("Refuerza el desempeño en el rol actual");
        }
        if (activity.developmentType === "FUTURE") score -= 14;
      }

      // 3. Diagnóstico: desempeño y potencial modulan el tipo de experiencia.
      const perf = context.performance ? RATING_VALUE[context.performance] : null;
      const pot = context.potential ? RATING_VALUE[context.potential] : null;

      if (perf !== null && pot !== null) {
        const highBoth = perf === 2 && pot === 2;
        if (highBoth && activity.methodology === "M70") {
          score += 16;
          reasons.push("Alto desempeño y alto potencial: prioriza experiencias de exposición");
        }
        if (highBoth && activity.difficulty === "ADVANCED") score += 8;

        if (perf === 0) {
          // Brecha de desempeño: primero consolidar el rol actual.
          if (activity.methodology === "M10" || activity.methodology === "M20") {
            score += 14;
            reasons.push("Consolida los fundamentos antes de asumir mayores retos");
          }
          if (activity.methodology === "M70" && activity.difficulty === "ADVANCED") score -= 16;
        }

        if (pot === 2 && activity.methodology === "M20") {
          score += 8;
          reasons.push("El acompañamiento acelera a las personas de alto potencial");
        }
        if (pot === 0 && activity.difficulty === "ADVANCED") score -= 8;
      }

      // 4. Requisitos declarados por la actividad. No bloquean: solo penalizan.
      if (activity.minPerformance && perf !== null) {
        if (perf < RATING_VALUE[activity.minPerformance]) score -= 14;
      }
      if (activity.minPotential && pot !== null) {
        if (pot < RATING_VALUE[activity.minPotential]) score -= 14;
      }

      // 5. Aspiración de carrera: una persona con alto potencial no siempre
      //    quiere dirigir. La aspiración corrige la recomendación.
      score += aspirationAdjustment(context.aspiration, activity, reasons);

      return { activity, score, recommended: false, reasons };
    })
    .sort((a, b) => b.score - a.score || a.activity.title.localeCompare(b.activity.title));

  // Se destacan las que superan el umbral y quedan en el tercio superior.
  const threshold = Math.max(45, (scored[0]?.score ?? 0) * 0.6);
  for (const item of scored) {
    item.recommended = item.score >= threshold && item.reasons.length > 0;
  }

  void maxGap;
  return scored;
}

function aspirationAdjustment(
  aspiration: Aspiration | null,
  activity: Activity,
  reasons: string[]
): number {
  switch (aspiration) {
    case "GROW_LEADERSHIP":
      if (activity.methodology === "M70" && activity.difficulty !== "BASIC") {
        reasons.push("Coherente con su aspiración de asumir liderazgo");
        return 10;
      }
      return 0;
    case "GROW_SPECIALIST":
      if (activity.methodology === "M10") {
        reasons.push("Profundiza el conocimiento técnico que busca");
        return 8;
      }
      if (activity.methodology === "M20") return 4;
      return 0;
    case "LATERAL_MOVE":
      if (activity.developmentType === "FUTURE") {
        reasons.push("Facilita la exposición a otras áreas");
        return 8;
      }
      return 0;
    case "CONSOLIDATE":
      if (activity.developmentType === "FUTURE") return -10;
      if (activity.developmentType === "CURRENT") {
        reasons.push("Alineada con su intención de consolidarse en el rol");
        return 8;
      }
      return 0;
    default:
      return 0;
  }
}

/** Redacta el objetivo de desarrollo de una competencia a partir de la brecha. */
export function draftCompetencyObjective(input: {
  competencyName: string;
  definition: string;
  currentLevel: number;
  requiredLevel: number;
}): string {
  const { competencyName, currentLevel, requiredLevel } = input;
  const focus = describeFocus(input.definition);
  if (requiredLevel <= currentLevel) {
    return `Sostener el nivel ${currentLevel} de ${competencyName}, manteniendo su capacidad de ${focus}.`;
  }
  return `Evolucionar ${competencyName} de un nivel ${currentLevel} a un nivel ${requiredLevel}, fortaleciendo su capacidad de ${focus}.`;
}

/**
 * Las definiciones del catálogo suelen empezar por «Capacidad de …»; se retira
 * ese arranque para no repetirlo dentro de la frase que lo envuelve.
 */
function describeFocus(definition: string): string {
  const clean = definition.trim().replace(/\.$/, "");
  const withoutPrefix = clean.replace(/^capacidad\s+(de|para)\s+/i, "");
  return withoutPrefix.charAt(0).toLowerCase() + withoutPrefix.slice(1);
}
