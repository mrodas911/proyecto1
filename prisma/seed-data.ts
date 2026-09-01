/**
 * Contenido inicial de la plataforma.
 *
 * Todo esto es CONTENIDO, no código: se carga en la base de datos y a partir
 * de ahí el administrador lo crea, edita, activa o desactiva desde el panel.
 * La semilla solo define el punto de partida.
 */
import type {
  CompetencyCategory,
  DevelopmentType,
  Difficulty,
  Methodology,
  RatingLevel,
  ResponsibleType,
} from "@prisma/client";

export type SeedCompetency = {
  name: string;
  definition: string;
  expectedBehavior: string;
  category: CompetencyCategory;
  /** Descriptores de los niveles 1 a 5. */
  levels: [string, string, string, string, string];
};

const LEVEL_NAMES = ["Inicial", "En desarrollo", "Competente", "Avanzado", "Referente"];

export function levelName(level: number): string {
  return LEVEL_NAMES[level - 1] ?? `Nivel ${level}`;
}

export const COMPETENCIES: SeedCompetency[] = [
  {
    name: "Liderazgo",
    definition:
      "Capacidad de movilizar a otras personas hacia un objetivo común, generando confianza, dirección y compromiso",
    expectedBehavior:
      "Fija una dirección clara, delega con criterio, sostiene conversaciones difíciles y hace que el equipo consiga resultados sin perder el vínculo.",
    category: "LEADERSHIP",
    levels: [
      "Ejecuta su trabajo individual y colabora cuando se lo solicitan.",
      "Coordina tareas puntuales de otros y da seguimiento a los compromisos acordados.",
      "Lidera a un equipo estable: fija prioridades, delega y sostiene el desempeño.",
      "Lidera equipos complejos o transversales y desarrolla a otros líderes.",
      "Es referente de liderazgo en la organización y forma a quienes conducen equipos.",
    ],
  },
  {
    name: "Comunicación",
    definition:
      "Capacidad de transmitir ideas con claridad, adaptando el mensaje al interlocutor y al contexto",
    expectedBehavior:
      "Estructura sus mensajes, escucha antes de responder y consigue que la audiencia entienda y actúe.",
    category: "INTERPERSONAL",
    levels: [
      "Comunica información operativa de forma correcta dentro de su equipo.",
      "Prepara sus mensajes y adapta el tono según el interlocutor.",
      "Presenta con claridad ante grupos y sostiene conversaciones de cierta dificultad.",
      "Comunica temas complejos ante audiencias diversas y de alto nivel.",
      "Es voz de referencia de la organización ante audiencias internas y externas.",
    ],
  },
  {
    name: "Influencia",
    definition:
      "Capacidad de lograr acuerdos y movilizar decisiones sin depender de la autoridad formal",
    expectedBehavior:
      "Identifica intereses de los demás, construye argumentos sólidos y consigue apoyo para sus iniciativas.",
    category: "INTERPERSONAL",
    levels: [
      "Expone su punto de vista dentro de su equipo cercano.",
      "Argumenta sus propuestas con datos y logra apoyo de sus pares.",
      "Consigue acuerdos con otras áreas para sacar adelante iniciativas.",
      "Moviliza decisiones en comités y niveles superiores de la organización.",
      "Marca la agenda de la organización e influye en decisiones estratégicas.",
    ],
  },
  {
    name: "Feedback",
    definition:
      "Capacidad de dar y recibir retroalimentación oportuna, concreta y orientada al desarrollo",
    expectedBehavior:
      "Aborda las conversaciones a tiempo, describe hechos en lugar de juicios y acuerda compromisos de mejora.",
    category: "LEADERSHIP",
    levels: [
      "Recibe retroalimentación sin ponerse a la defensiva.",
      "Da feedback positivo con naturalidad y pide feedback sobre su trabajo.",
      "Sostiene conversaciones de mejora concretas y acuerda compromisos.",
      "Maneja conversaciones difíciles de desempeño manteniendo la relación.",
      "Instala la práctica del feedback en su equipo y forma a otros para hacerlo.",
    ],
  },
  {
    name: "Toma de decisiones",
    definition:
      "Capacidad de elegir cursos de acción con la información disponible, asumiendo el riesgo y sus consecuencias",
    expectedBehavior:
      "Distingue lo relevante, decide en tiempo, explicita criterios y se hace responsable del resultado.",
    category: "EXECUTION",
    levels: [
      "Decide sobre asuntos rutinarios siguiendo procedimientos establecidos.",
      "Analiza alternativas sencillas y consulta cuando la decisión excede su alcance.",
      "Decide con información incompleta en su ámbito y explica sus criterios.",
      "Toma decisiones de impacto en varias áreas gestionando el riesgo asociado.",
      "Decide en escenarios de alta ambigüedad e impacto organizacional.",
    ],
  },
  {
    name: "Pensamiento estratégico",
    definition:
      "Capacidad de comprender el entorno, anticipar escenarios y conectar las decisiones con los objetivos de negocio",
    expectedBehavior:
      "Mira más allá del corto plazo, relaciona señales del mercado con su ámbito y prioriza lo que mueve la aguja.",
    category: "STRATEGIC",
    levels: [
      "Entiende los objetivos de su área y cómo su trabajo contribuye a ellos.",
      "Relaciona sus decisiones diarias con las prioridades del área.",
      "Anticipa escenarios de su ámbito y ajusta su plan en consecuencia.",
      "Traduce la estrategia de la compañía en iniciativas concretas para varias áreas.",
      "Contribuye a definir la estrategia y detecta oportunidades antes que el mercado.",
    ],
  },
  {
    name: "Orientación a resultados",
    definition:
      "Capacidad de mantener el foco en las metas comprometidas y superar los obstáculos hasta alcanzarlas",
    expectedBehavior:
      "Define metas medibles, sostiene el ritmo de ejecución y no abandona ante las dificultades.",
    category: "EXECUTION",
    levels: [
      "Cumple las tareas asignadas en los plazos acordados.",
      "Se fija metas propias y hace seguimiento a sus indicadores.",
      "Alcanza de forma consistente los resultados comprometidos de su ámbito.",
      "Sostiene resultados en contextos adversos y recupera desvíos con rapidez.",
      "Eleva el estándar de resultados de la organización y lo hace sostenible.",
    ],
  },
  {
    name: "Colaboración",
    definition:
      "Capacidad de trabajar con otras personas y áreas construyendo confianza y objetivos compartidos",
    expectedBehavior:
      "Comparte información, integra visiones distintas y antepone el resultado conjunto al beneficio de su área.",
    category: "INTERPERSONAL",
    levels: [
      "Colabora cuando se lo piden dentro de su equipo.",
      "Se apoya en otras personas y comparte información de forma proactiva.",
      "Construye acuerdos de trabajo estables con otras áreas.",
      "Lidera iniciativas transversales integrando intereses distintos.",
      "Genera cultura de colaboración más allá de su ámbito de responsabilidad.",
    ],
  },
  {
    name: "Gestión del cambio",
    definition:
      "Capacidad de impulsar y acompañar transformaciones, gestionando la resistencia y sosteniendo la adopción",
    expectedBehavior:
      "Explica el porqué del cambio, acompaña a las personas y sostiene el nuevo modo de trabajar hasta que se consolida.",
    category: "STRATEGIC",
    levels: [
      "Se adapta a los cambios que le afectan directamente.",
      "Apoya activamente los cambios impulsados por otros.",
      "Conduce cambios en su equipo gestionando dudas y resistencias.",
      "Lidera transformaciones que abarcan varias áreas.",
      "Diseña e impulsa la transformación cultural de la organización.",
    ],
  },
  {
    name: "Innovación",
    definition:
      "Capacidad de cuestionar lo establecido y convertir ideas nuevas en mejoras aplicadas",
    expectedBehavior:
      "Propone alternativas, experimenta con bajo costo y lleva las buenas ideas hasta su implementación.",
    category: "STRATEGIC",
    levels: [
      "Aporta ideas de mejora sobre su trabajo cotidiano.",
      "Propone mejoras y las prueba en pequeño dentro de su equipo.",
      "Implementa mejoras con impacto medible en su proceso.",
      "Impulsa innovaciones que cambian la forma de trabajar de varias áreas.",
      "Instala la práctica de la experimentación como capacidad organizacional.",
    ],
  },
  {
    name: "Negociación",
    definition:
      "Capacidad de alcanzar acuerdos que equilibren los intereses de las partes y preserven la relación",
    expectedBehavior:
      "Prepara sus negociaciones, identifica alternativas y cierra acuerdos sostenibles en el tiempo.",
    category: "BUSINESS",
    levels: [
      "Acuerda plazos y condiciones operativas sencillas.",
      "Prepara sus negociaciones internas identificando intereses.",
      "Cierra acuerdos con proveedores, clientes u otras áreas de forma autónoma.",
      "Conduce negociaciones complejas de alto impacto económico.",
      "Es referente de negociación y forma a otros en la organización.",
    ],
  },
  {
    name: "Desarrollo de equipos",
    definition:
      "Capacidad de hacer crecer a las personas del equipo, ampliando sus capacidades y su autonomía",
    expectedBehavior:
      "Conoce el potencial de cada persona, delega retos a medida y dedica tiempo real a acompañar su desarrollo.",
    category: "LEADERSHIP",
    levels: [
      "Ayuda a integrar a personas nuevas en tareas concretas.",
      "Acompaña a compañeros en su aprendizaje del día a día.",
      "Construye planes de desarrollo y da seguimiento a su equipo.",
      "Forma sucesores y prepara a personas para posiciones mayores.",
      "Es reconocido como formador de talento en toda la organización.",
    ],
  },
  {
    name: "Visión de negocio",
    definition:
      "Capacidad de comprender cómo gana dinero la organización y tomar decisiones coherentes con ello",
    expectedBehavior:
      "Entiende los números del negocio, evalúa el impacto económico de sus decisiones y prioriza en consecuencia.",
    category: "BUSINESS",
    levels: [
      "Conoce los indicadores básicos de su área.",
      "Relaciona su trabajo con los costos e ingresos que genera.",
      "Analiza el impacto económico de sus decisiones y las justifica con números.",
      "Construye casos de negocio y defiende inversiones ante la dirección.",
      "Aporta a la definición del modelo de negocio de la compañía.",
    ],
  },
  {
    name: "Inteligencia emocional",
    definition:
      "Capacidad de reconocer y gestionar las propias emociones y las de los demás en contextos exigentes",
    expectedBehavior:
      "Mantiene la calma bajo presión, lee el clima del equipo y ajusta su forma de relacionarse.",
    category: "INTERPERSONAL",
    levels: [
      "Reconoce su estado emocional en situaciones cotidianas.",
      "Regula sus reacciones ante situaciones de presión moderada.",
      "Gestiona conversaciones tensas manteniendo la relación y el foco.",
      "Sostiene al equipo emocionalmente en contextos de alta exigencia.",
      "Genera entornos de seguridad psicológica en toda la organización.",
    ],
  },
  {
    name: "Planificación",
    definition:
      "Capacidad de organizar recursos, plazos y prioridades para asegurar la ejecución de lo comprometido",
    expectedBehavior:
      "Descompone objetivos en pasos, anticipa riesgos y mantiene visibilidad del avance.",
    category: "EXECUTION",
    levels: [
      "Organiza su propia agenda y cumple los plazos que le asignan.",
      "Planifica sus entregables anticipando dependencias sencillas.",
      "Planifica proyectos de su ámbito gestionando recursos y riesgos.",
      "Planifica iniciativas multiárea con dependencias y presupuesto.",
      "Diseña el modelo de planificación que utiliza la organización.",
    ],
  },
];

export type SeedTool = {
  slug: string;
  name: string;
  description: string;
  methodology: Methodology;
  icon: string;
  isCore: boolean;
  developmentType: DevelopmentType;
  order: number;
};

/**
 * Catálogo principal de 8 herramientas sobre el que opera la regla 5/8 y 8/8.
 * La cantidad disponible NO está en el código: se configura en el panel.
 */
export const TOOLS: SeedTool[] = [
  {
    slug: "formacion-estructurada",
    name: "Formación estructurada",
    description:
      "Cursos, talleres, certificaciones y programas con un temario y un facilitador.",
    methodology: "M10",
    icon: "book",
    isCore: true,
    developmentType: "BOTH",
    order: 1,
  },
  {
    slug: "autoformacion",
    name: "Autoformación y contenidos",
    description:
      "Microlearning, lecturas, artículos, pódcast, vídeos y casos que la persona recorre a su ritmo.",
    methodology: "M10",
    icon: "headphones",
    isCore: true,
    developmentType: "BOTH",
    order: 2,
  },
  {
    slug: "mentoria",
    name: "Mentoría",
    description:
      "Acompañamiento periódico de alguien con más recorrido en el ámbito que la persona quiere desarrollar.",
    methodology: "M20",
    icon: "compass",
    isCore: true,
    developmentType: "BOTH",
    order: 3,
  },
  {
    slug: "coaching-feedback",
    name: "Coaching y feedback",
    description:
      "Conversaciones estructuradas de desarrollo, feedback 360 y sesiones de coaching.",
    methodology: "M20",
    icon: "message",
    isCore: true,
    developmentType: "BOTH",
    order: 4,
  },
  {
    slug: "aprendizaje-entre-pares",
    name: "Aprendizaje entre pares",
    description:
      "Shadowing, comunidades de práctica, reverse mentoring y networking interno.",
    methodology: "M20",
    icon: "users",
    isCore: true,
    developmentType: "BOTH",
    order: 5,
  },
  {
    slug: "proyectos-y-retos",
    name: "Proyectos y retos",
    description:
      "Liderar o participar en proyectos reales con alcance, plazo y resultado esperado.",
    methodology: "M70",
    icon: "target",
    isCore: true,
    developmentType: "BOTH",
    order: 6,
  },
  {
    slug: "exposicion",
    name: "Exposición y visibilidad",
    description:
      "Presentar ante comités, dirección o clientes, y representar al área en foros relevantes.",
    methodology: "M70",
    icon: "presentation",
    isCore: true,
    developmentType: "BOTH",
    order: 7,
  },
  {
    slug: "ampliacion-responsabilidades",
    name: "Ampliación de responsabilidades",
    description:
      "Suplencias, rotaciones, coordinación de equipos y asunción temporal de funciones superiores.",
    methodology: "M70",
    icon: "layers",
    isCore: true,
    developmentType: "BOTH",
    order: 8,
  },
];

export type SeedActivity = {
  title: string;
  description: string;
  benefit: string;
  methodology: Methodology;
  tool: string;
  difficulty: Difficulty;
  developmentType: DevelopmentType;
  duration: string;
  indicator: string;
  evidence: string;
  responsible: ResponsibleType;
  minPerformance?: RatingLevel;
  minPotential?: RatingLevel;
  competencies: string[];
};

/**
 * Biblioteca de actividades. Una misma actividad puede desarrollar varias
 * competencias: esa relación muchos-a-muchos es lo que permite crecer el
 * catálogo sin duplicar contenido.
 */
const LEARN_AND_CONNECT: SeedActivity[] = [
  // ─────────────────────────────── 10% · Aprendizaje formal ────────────────
  {
    title: "Programa de fundamentos de liderazgo",
    description:
      "Ruta formativa sobre estilos de liderazgo, delegación y conducción de equipos, con ejercicios aplicados al propio equipo.",
    benefit: "Da un marco común para dirigir personas y ordena la forma de delegar.",
    methodology: "M10", tool: "formacion-estructurada", difficulty: "BASIC",
    developmentType: "BOTH", duration: "6 semanas",
    indicator: "Programa completado y plan de delegación aplicado con su equipo",
    evidence: "Certificado del programa y plan de delegación documentado",
    responsible: "EMPLOYEE",
    competencies: ["Liderazgo", "Desarrollo de equipos", "Feedback"],
  },
  {
    title: "Taller de conversaciones de feedback",
    description:
      "Taller práctico con simulaciones de conversaciones difíciles: feedback de mejora, reconocimiento y conversaciones de desempeño.",
    benefit: "Reduce el costo emocional de las conversaciones difíciles y las vuelve frecuentes.",
    methodology: "M10", tool: "formacion-estructurada", difficulty: "BASIC",
    developmentType: "BOTH", duration: "16 horas",
    indicator: "Taller finalizado y al menos 3 conversaciones de feedback sostenidas",
    evidence: "Registro de conversaciones y autoevaluación posterior",
    responsible: "EMPLOYEE",
    competencies: ["Feedback", "Comunicación", "Inteligencia emocional"],
  },
  {
    title: "Microcurso de comunicación persuasiva",
    description:
      "Ruta breve de microlearning sobre estructura del mensaje, storytelling y manejo de objeciones.",
    benefit: "Mejora rápidamente la claridad y el impacto de sus presentaciones.",
    methodology: "M10", tool: "autoformacion", difficulty: "BASIC",
    developmentType: "BOTH", duration: "3 semanas",
    indicator: "Ruta completada y una presentación reestructurada con el modelo aprendido",
    evidence: "Presentación aplicando la estructura trabajada",
    responsible: "EMPLOYEE",
    competencies: ["Comunicación", "Influencia"],
  },
  {
    title: "Curso de análisis estratégico y escenarios",
    description:
      "Formación sobre análisis del entorno, construcción de escenarios y traducción de la estrategia en prioridades.",
    benefit: "Permite pasar de la ejecución diaria a la lectura del contexto de negocio.",
    methodology: "M10", tool: "formacion-estructurada", difficulty: "INTERMEDIATE",
    developmentType: "FUTURE", duration: "8 semanas",
    indicator: "Curso aprobado y análisis de escenarios de su área elaborado",
    evidence: "Documento de análisis de escenarios",
    responsible: "EMPLOYEE",
    minPotential: "MEDIUM",
    competencies: ["Pensamiento estratégico", "Visión de negocio", "Toma de decisiones"],
  },
  {
    title: "Finanzas para no financieros",
    description:
      "Programa sobre estados financieros, márgenes, costos y construcción de casos de negocio.",
    benefit: "Da lenguaje económico para justificar decisiones e inversiones.",
    methodology: "M10", tool: "formacion-estructurada", difficulty: "INTERMEDIATE",
    developmentType: "BOTH", duration: "6 semanas",
    indicator: "Programa completado y un caso de negocio elaborado con cifras reales",
    evidence: "Caso de negocio presentado a su líder",
    responsible: "EMPLOYEE",
    competencies: ["Visión de negocio", "Toma de decisiones", "Pensamiento estratégico"],
  },
  {
    title: "Certificación en gestión de proyectos",
    description:
      "Certificación sobre planificación, gestión de riesgos, dependencias y seguimiento de proyectos.",
    benefit: "Ordena la forma de planificar y hace predecible la ejecución.",
    methodology: "M10", tool: "formacion-estructurada", difficulty: "ADVANCED",
    developmentType: "BOTH", duration: "4 meses",
    indicator: "Certificación obtenida y metodología aplicada en un proyecto propio",
    evidence: "Certificado y plan de proyecto documentado",
    responsible: "EMPLOYEE",
    competencies: ["Planificación", "Orientación a resultados", "Toma de decisiones"],
  },
  {
    title: "Lectura guiada sobre pensamiento estratégico",
    description:
      "Lectura de un libro de referencia con fichas de trabajo y una conversación de cierre con su líder.",
    benefit: "Instala vocabulario y modelos mentales aplicables a su propio negocio.",
    methodology: "M10", tool: "autoformacion", difficulty: "BASIC",
    developmentType: "BOTH", duration: "8 semanas",
    indicator: "Libro finalizado y conversación de aplicación realizada",
    evidence: "Fichas de lectura con aplicaciones a su área",
    responsible: "EMPLOYEE",
    competencies: ["Pensamiento estratégico", "Visión de negocio"],
  },
  {
    title: "Ruta de microlearning en inteligencia emocional",
    description:
      "Cápsulas breves sobre autorregulación, empatía y manejo de conversaciones bajo presión.",
    benefit: "Aporta herramientas concretas para sostener la calma en momentos exigentes.",
    methodology: "M10", tool: "autoformacion", difficulty: "BASIC",
    developmentType: "CURRENT", duration: "4 semanas",
    indicator: "Ruta completada y bitácora de situaciones gestionadas",
    evidence: "Bitácora personal de situaciones y reacciones",
    responsible: "EMPLOYEE",
    competencies: ["Inteligencia emocional", "Feedback", "Colaboración"],
  },
  {
    title: "Taller de negociación colaborativa",
    description:
      "Taller con role-plays sobre preparación de la negociación, intereses, alternativas y cierre de acuerdos.",
    benefit: "Mejora los resultados de la negociación sin deteriorar la relación.",
    methodology: "M10", tool: "formacion-estructurada", difficulty: "INTERMEDIATE",
    developmentType: "BOTH", duration: "24 horas",
    indicator: "Taller completado y una negociación real preparada con el modelo",
    evidence: "Ficha de preparación de una negociación real",
    responsible: "EMPLOYEE",
    competencies: ["Negociación", "Influencia", "Comunicación"],
  },
  {
    title: "Programa de gestión del cambio",
    description:
      "Formación sobre modelos de cambio, mapeo de actores, gestión de la resistencia y planes de adopción.",
    benefit: "Da método para conducir cambios sin perder a las personas por el camino.",
    methodology: "M10", tool: "formacion-estructurada", difficulty: "INTERMEDIATE",
    developmentType: "FUTURE", duration: "6 semanas",
    indicator: "Programa completado y plan de adopción elaborado para un cambio real",
    evidence: "Plan de gestión del cambio documentado",
    responsible: "EMPLOYEE",
    competencies: ["Gestión del cambio", "Liderazgo", "Comunicación"],
  },
  {
    title: "Caso práctico de toma de decisiones bajo incertidumbre",
    description:
      "Resolución de un caso de negocio con información incompleta y defensa de la decisión ante un panel interno.",
    benefit: "Entrena la decisión en condiciones parecidas a las reales.",
    methodology: "M10", tool: "autoformacion", difficulty: "INTERMEDIATE",
    developmentType: "BOTH", duration: "3 semanas",
    indicator: "Caso resuelto y defendido ante el panel",
    evidence: "Documento de decisión con criterios y riesgos",
    responsible: "EMPLOYEE",
    competencies: ["Toma de decisiones", "Pensamiento estratégico", "Comunicación"],
  },
  {
    title: "Curso de metodologías de innovación",
    description:
      "Formación en design thinking y experimentación de bajo costo para validar ideas antes de invertir.",
    benefit: "Convierte las ideas sueltas en experimentos con criterio de decisión.",
    methodology: "M10", tool: "formacion-estructurada", difficulty: "INTERMEDIATE",
    developmentType: "BOTH", duration: "5 semanas",
    indicator: "Curso completado y un experimento diseñado para su área",
    evidence: "Ficha de experimento con hipótesis y métrica",
    responsible: "EMPLOYEE",
    competencies: ["Innovación", "Pensamiento estratégico", "Toma de decisiones"],
  },
  {
    title: "Pódcast y artículos sobre liderazgo de equipos",
    description:
      "Selección curada de episodios y artículos, con una síntesis mensual de aprendizajes aplicables.",
    benefit: "Mantiene el desarrollo activo con muy poca inversión de tiempo.",
    methodology: "M10", tool: "autoformacion", difficulty: "BASIC",
    developmentType: "CURRENT", duration: "3 meses",
    indicator: "Tres síntesis mensuales entregadas y comentadas con su líder",
    evidence: "Documento de síntesis mensual",
    responsible: "EMPLOYEE",
    competencies: ["Liderazgo", "Desarrollo de equipos"],
  },
  {
    title: "Taller de presentaciones ejecutivas",
    description:
      "Entrenamiento en síntesis, construcción de la recomendación y manejo de preguntas de un comité.",
    benefit: "Prepara para hablar ante dirección con seguridad y en poco tiempo.",
    methodology: "M10", tool: "formacion-estructurada", difficulty: "INTERMEDIATE",
    developmentType: "FUTURE", duration: "12 horas",
    indicator: "Taller completado y una presentación ejecutiva realizada",
    evidence: "Presentación ejecutiva de una página",
    responsible: "EMPLOYEE",
    competencies: ["Comunicación", "Influencia", "Visión de negocio"],
  },
  {
    title: "Curso de analítica para la gestión",
    description:
      "Formación en construcción de indicadores, tableros y lectura de datos para la toma de decisiones.",
    benefit: "Permite sustentar decisiones con datos en lugar de intuiciones.",
    methodology: "M10", tool: "formacion-estructurada", difficulty: "INTERMEDIATE",
    developmentType: "BOTH", duration: "6 semanas",
    indicator: "Curso aprobado y tablero de indicadores del área construido",
    evidence: "Tablero de indicadores en uso",
    responsible: "EMPLOYEE",
    competencies: ["Orientación a resultados", "Visión de negocio", "Planificación"],
  },
  {
    title: "Simulador de conducción de equipos",
    description:
      "Simulador donde la persona toma decisiones de equipo y observa sus consecuencias sobre clima y resultados.",
    benefit: "Permite equivocarse sin costo real antes de hacerlo con el equipo.",
    methodology: "M10", tool: "autoformacion", difficulty: "INTERMEDIATE",
    developmentType: "FUTURE", duration: "4 semanas",
    indicator: "Simulación completada y aprendizajes conversados con su líder",
    evidence: "Informe de resultados de la simulación",
    responsible: "EMPLOYEE",
    competencies: ["Liderazgo", "Toma de decisiones", "Desarrollo de equipos"],
  },
  {
    title: "Webinar de tendencias del sector",
    description:
      "Participación en un ciclo de webinars sobre la evolución del mercado y su impacto en el modelo de negocio.",
    benefit: "Amplía la mirada más allá de la operación diaria de la compañía.",
    methodology: "M10", tool: "autoformacion", difficulty: "BASIC",
    developmentType: "BOTH", duration: "2 meses",
    indicator: "Ciclo completado y tres implicaciones para su área identificadas",
    evidence: "Nota con implicaciones para el negocio",
    responsible: "EMPLOYEE",
    competencies: ["Visión de negocio", "Pensamiento estratégico", "Innovación"],
  },
  {
    title: "Ruta formativa de planificación y priorización",
    description:
      "Contenidos sobre descomposición de objetivos, gestión de dependencias y criterios de priorización.",
    benefit: "Ordena la carga de trabajo y hace visible el avance.",
    methodology: "M10", tool: "autoformacion", difficulty: "BASIC",
    developmentType: "CURRENT", duration: "4 semanas",
    indicator: "Ruta completada y plan trimestral del área construido",
    evidence: "Plan trimestral con hitos y responsables",
    responsible: "EMPLOYEE",
    competencies: ["Planificación", "Orientación a resultados"],
  },

  // ─────────────────────────────── 20% · Aprendizaje social ────────────────
  {
    title: "Mentoría mensual con un directivo de otra área",
    description:
      "Sesiones mensuales con un directivo que ya ejerce el nivel al que la persona aspira, con agenda acordada.",
    benefit: "Acorta la curva de aprendizaje al acceder al criterio de alguien que ya lo vive.",
    methodology: "M20", tool: "mentoria", difficulty: "INTERMEDIATE",
    developmentType: "FUTURE", duration: "6 meses",
    indicator: "Seis sesiones realizadas con compromisos cumplidos entre sesiones",
    evidence: "Bitácora de sesiones con acuerdos",
    responsible: "MENTOR",
    minPotential: "MEDIUM",
    competencies: ["Pensamiento estratégico", "Liderazgo", "Visión de negocio"],
  },
  {
    title: "Mentoría con un referente técnico de la organización",
    description:
      "Acompañamiento periódico de un experto reconocido en la disciplina que la persona quiere profundizar.",
    benefit: "Da acceso al criterio experto que no está escrito en ningún manual.",
    methodology: "M20", tool: "mentoria", difficulty: "BASIC",
    developmentType: "CURRENT", duration: "4 meses",
    indicator: "Cuatro sesiones realizadas y aplicación de al menos dos recomendaciones",
    evidence: "Registro de sesiones y mejoras aplicadas",
    responsible: "MENTOR",
    competencies: ["Toma de decisiones", "Planificación", "Innovación"],
  },
  {
    title: "Sesiones quincenales de coaching de desarrollo",
    description:
      "Proceso de coaching centrado en un objetivo de desarrollo concreto, con tareas entre sesiones.",
    benefit: "Sostiene el cambio de comportamiento más allá del entusiasmo inicial.",
    methodology: "M20", tool: "coaching-feedback", difficulty: "INTERMEDIATE",
    developmentType: "BOTH", duration: "3 meses",
    indicator: "Seis sesiones realizadas y objetivo de desarrollo alcanzado",
    evidence: "Informe de cierre del proceso de coaching",
    responsible: "MENTOR",
    competencies: ["Inteligencia emocional", "Liderazgo", "Feedback"],
  },
  {
    title: "Feedback estructurado mensual con el líder",
    description:
      "Conversación mensual de una hora centrada exclusivamente en desarrollo, no en seguimiento de tareas.",
    benefit: "Convierte el desarrollo en una conversación viva y no en un documento anual.",
    methodology: "M20", tool: "coaching-feedback", difficulty: "BASIC",
    developmentType: "BOTH", duration: "6 meses",
    indicator: "Seis conversaciones realizadas con acuerdos documentados",
    evidence: "Acta breve de cada conversación",
    responsible: "LEADER",
    competencies: ["Feedback", "Comunicación", "Orientación a resultados"],
  },
  {
    title: "Proceso de feedback 360 con plan de acción",
    description:
      "Levantamiento de percepciones de líder, pares y colaboradores, con devolución y plan de acción posterior.",
    benefit: "Muestra los puntos ciegos que nadie se atreve a decir directamente.",
    methodology: "M20", tool: "coaching-feedback", difficulty: "INTERMEDIATE",
    developmentType: "BOTH", duration: "8 semanas",
    indicator: "Informe 360 recibido y plan de acción de tres focos en ejecución",
    evidence: "Informe 360 y plan de acción",
    responsible: "HR",
    competencies: ["Feedback", "Inteligencia emocional", "Liderazgo"],
  },
  {
    title: "Shadowing a un líder en comités de decisión",
    description:
      "Acompañar como observador a un líder durante sus comités y reuniones de decisión, con debrief posterior.",
    benefit: "Muestra cómo se decide realmente en los niveles superiores.",
    methodology: "M20", tool: "aprendizaje-entre-pares", difficulty: "INTERMEDIATE",
    developmentType: "FUTURE", duration: "6 semanas",
    indicator: "Cuatro comités observados con debrief realizado tras cada uno",
    evidence: "Notas de observación y conclusiones",
    responsible: "LEADER",
    competencies: ["Toma de decisiones", "Pensamiento estratégico", "Influencia"],
  },
  {
    title: "Reverse mentoring con un perfil joven del equipo",
    description:
      "Sesiones donde una persona con menos antigüedad enseña sobre herramientas digitales o nuevas formas de trabajo.",
    benefit: "Actualiza la mirada y entrena la escucha desde una posición de aprendiz.",
    methodology: "M20", tool: "aprendizaje-entre-pares", difficulty: "BASIC",
    developmentType: "CURRENT", duration: "3 meses",
    indicator: "Seis sesiones realizadas y dos prácticas nuevas incorporadas",
    evidence: "Registro de prácticas incorporadas",
    responsible: "EMPLOYEE",
    competencies: ["Innovación", "Inteligencia emocional", "Colaboración"],
  },
  {
    title: "Participación activa en una comunidad de práctica",
    description:
      "Integrarse a un grupo interno que comparte y resuelve problemas comunes de una disciplina.",
    benefit: "Multiplica el aprendizaje sin depender de una única fuente.",
    methodology: "M20", tool: "aprendizaje-entre-pares", difficulty: "BASIC",
    developmentType: "BOTH", duration: "6 meses",
    indicator: "Participación en todas las sesiones y una contribución propia presentada",
    evidence: "Material de la contribución presentada",
    responsible: "EMPLOYEE",
    competencies: ["Colaboración", "Innovación", "Comunicación"],
  },
  {
    title: "Pareja de aprendizaje con un par de otra área",
    description:
      "Acuerdo entre dos personas de áreas distintas para revisar mutuamente sus retos cada quince días.",
    benefit: "Da una mirada externa constante sin costo ni agenda compleja.",
    methodology: "M20", tool: "aprendizaje-entre-pares", difficulty: "BASIC",
    developmentType: "BOTH", duration: "4 meses",
    indicator: "Ocho sesiones realizadas y tres mejoras aplicadas a partir de ellas",
    evidence: "Bitácora compartida de la pareja de aprendizaje",
    responsible: "EMPLOYEE",
    competencies: ["Colaboración", "Feedback", "Comunicación"],
  },
  {
    title: "Reuniones con expertos del negocio",
    description:
      "Agenda de conversaciones con referentes internos de finanzas, operaciones y comercial para entender el modelo completo.",
    benefit: "Construye la visión de negocio conversando con quienes la sostienen.",
    methodology: "M20", tool: "aprendizaje-entre-pares", difficulty: "INTERMEDIATE",
    developmentType: "FUTURE", duration: "2 meses",
    indicator: "Cinco conversaciones realizadas y mapa del modelo de negocio elaborado",
    evidence: "Mapa del modelo de negocio del área",
    responsible: "EMPLOYEE",
    competencies: ["Visión de negocio", "Pensamiento estratégico", "Colaboración"],
  },
  {
    title: "Uno a uno semanal con foco en desarrollo",
    description:
      "Reservar quince minutos del uno a uno semanal exclusivamente para el avance del plan de desarrollo.",
    benefit: "Evita que el desarrollo quede siempre desplazado por lo urgente.",
    methodology: "M20", tool: "coaching-feedback", difficulty: "BASIC",
    developmentType: "CURRENT", duration: "6 meses",
    indicator: "Al menos veinte conversaciones realizadas con avance registrado",
    evidence: "Registro de seguimiento del plan",
    responsible: "LEADER",
    competencies: ["Feedback", "Orientación a resultados", "Desarrollo de equipos"],
  },
  {
    title: "Networking interno estructurado",
    description:
      "Plan de contactos con personas clave de otras áreas para ampliar la red interna de la persona.",
    benefit: "Facilita mover iniciativas transversales cuando llegue el momento.",
    methodology: "M20", tool: "aprendizaje-entre-pares", difficulty: "BASIC",
    developmentType: "FUTURE", duration: "3 meses",
    indicator: "Doce conversaciones realizadas y red de contactos mapeada",
    evidence: "Mapa de red interna",
    responsible: "EMPLOYEE",
    competencies: ["Influencia", "Colaboración", "Comunicación"],
  },
  {
    title: "Mentoría inversa sobre gestión de equipos",
    description:
      "Acompañamiento de un líder con más recorrido específicamente sobre situaciones difíciles de equipo.",
    benefit: "Da respaldo en el momento exacto en que aparece el problema real.",
    methodology: "M20", tool: "mentoria", difficulty: "INTERMEDIATE",
    developmentType: "BOTH", duration: "4 meses",
    indicator: "Cuatro situaciones reales trabajadas y resueltas con acompañamiento",
    evidence: "Registro de casos trabajados",
    responsible: "MENTOR",
    competencies: ["Desarrollo de equipos", "Liderazgo", "Inteligencia emocional"],
  },
  {
    title: "Sesión de calibración con pares líderes",
    description:
      "Participar en sesiones donde varios líderes calibran criterios de desempeño y desarrollo de sus equipos.",
    benefit: "Alinea el criterio propio con el estándar de la organización.",
    methodology: "M20", tool: "aprendizaje-entre-pares", difficulty: "ADVANCED",
    developmentType: "FUTURE", duration: "3 meses",
    indicator: "Participación en dos calibraciones con aportes documentados",
    evidence: "Notas de calibración",
    responsible: "HR",
    minPerformance: "MEDIUM",
    competencies: ["Feedback", "Toma de decisiones", "Desarrollo de equipos"],
  },
  {
    title: "Acompañamiento de un mentor en negociaciones reales",
    description:
      "Preparar y revisar negociaciones reales junto a alguien con experiencia, antes y después de cada una.",
    benefit: "Convierte cada negociación en una oportunidad de aprendizaje deliberado.",
    methodology: "M20", tool: "mentoria", difficulty: "INTERMEDIATE",
    developmentType: "BOTH", duration: "4 meses",
    indicator: "Tres negociaciones preparadas y revisadas con el mentor",
    evidence: "Fichas de preparación y cierre",
    responsible: "MENTOR",
    competencies: ["Negociación", "Influencia", "Comunicación"],
  },
  {
    title: "Círculo de feedback con el propio equipo",
    description:
      "Sesión estructurada donde el equipo entrega retroalimentación sobre el estilo de conducción de la persona.",
    benefit: "Da información directa de quienes viven a diario su forma de liderar.",
    methodology: "M20", tool: "coaching-feedback", difficulty: "ADVANCED",
    developmentType: "CURRENT", duration: "1 mes",
    indicator: "Sesión realizada y tres compromisos de cambio comunicados al equipo",
    evidence: "Compromisos publicados al equipo",
    responsible: "LEADER",
    competencies: ["Feedback", "Liderazgo", "Inteligencia emocional"],
  },
  {
    title: "Acompañamiento en la gestión de un conflicto real",
    description:
      "Trabajar un conflicto vigente del equipo con apoyo de Talento Humano, desde el diagnóstico hasta el acuerdo.",
    benefit: "Enseña a abordar el conflicto en lugar de administrarlo indefinidamente.",
    methodology: "M20", tool: "coaching-feedback", difficulty: "ADVANCED",
    developmentType: "CURRENT", duration: "2 meses",
    indicator: "Conflicto abordado y acuerdo sostenido durante al menos un mes",
    evidence: "Acta de acuerdos entre las partes",
    responsible: "HR",
    competencies: ["Inteligencia emocional", "Negociación", "Liderazgo"],
  },
  {
    title: "Mentoría cruzada con un líder de otra unidad de negocio",
    description:
      "Intercambio periódico con un par de otra unidad para contrastar prácticas de gestión y decisiones.",
    benefit: "Rompe la endogamia del área y trae prácticas que ya funcionan en otro lugar.",
    methodology: "M20", tool: "mentoria", difficulty: "INTERMEDIATE",
    developmentType: "FUTURE", duration: "5 meses",
    indicator: "Cinco encuentros realizados y dos prácticas adoptadas",
    evidence: "Registro de prácticas adoptadas",
    responsible: "MENTOR",
    competencies: ["Visión de negocio", "Colaboración", "Gestión del cambio"],
  },
];

/**
 * 70% · Experiencias en el trabajo. Es la sección más importante del método:
 * cada actividad busca combinar experiencia + exposición + responsabilidad.
 */
const EXPERIENCE: SeedActivity[] = [
  {
    title: "Liderar una iniciativa transversal ante tres áreas",
    description:
      "Conducir de principio a fin una iniciativa que involucre al menos a tres áreas, incluyendo la presentación de resultados.",
    benefit: "Obliga a conseguir apoyos sin autoridad formal sobre los participantes.",
    methodology: "M70", tool: "proyectos-y-retos", difficulty: "ADVANCED",
    developmentType: "FUTURE", duration: "90 días",
    indicator: "Iniciativa implementada con las tres áreas y resultados presentados",
    evidence: "Informe de cierre con resultados e impacto",
    responsible: "EMPLOYEE",
    minPerformance: "MEDIUM",
    competencies: ["Influencia", "Colaboración", "Liderazgo", "Comunicación"],
  },
  {
    title: "Presentar mensualmente los resultados ante el comité",
    description:
      "Asumir la presentación de los resultados del área ante el comité directivo con una periodicidad fija.",
    benefit: "Entrena la síntesis ejecutiva y da visibilidad ante la dirección.",
    methodology: "M70", tool: "exposicion", difficulty: "INTERMEDIATE",
    developmentType: "BOTH", duration: "6 meses",
    indicator: "Seis presentaciones realizadas con feedback positivo del comité",
    evidence: "Presentaciones y actas del comité",
    responsible: "EMPLOYEE",
    competencies: ["Comunicación", "Influencia", "Visión de negocio"],
  },
  {
    title: "Asumir temporalmente las funciones de su líder",
    description:
      "Cubrir la posición del líder durante un período acordado, con autonomía real de decisión.",
    benefit: "Es la prueba más honesta de si la persona está lista para el siguiente nivel.",
    methodology: "M70", tool: "ampliacion-responsabilidades", difficulty: "ADVANCED",
    developmentType: "FUTURE", duration: "4 semanas",
    indicator: "Período cubierto sin escalamientos críticos y con continuidad de resultados",
    evidence: "Informe de gestión del período y evaluación del líder",
    responsible: "LEADER",
    minPerformance: "HIGH", minPotential: "MEDIUM",
    competencies: ["Liderazgo", "Toma de decisiones", "Planificación", "Orientación a resultados"],
  },
  {
    title: "Liderar un proyecto de mejora con impacto medible",
    description:
      "Identificar un problema real del área, liderar su solución y medir el impacto en un indicador concreto.",
    benefit: "Cierra el ciclo completo: diagnosticar, decidir, ejecutar y demostrar el resultado.",
    methodology: "M70", tool: "proyectos-y-retos", difficulty: "INTERMEDIATE",
    developmentType: "CURRENT", duration: "4 meses",
    indicator: "Mejora implementada con impacto demostrado en el indicador definido",
    evidence: "Antes y después del indicador intervenido",
    responsible: "EMPLOYEE",
    competencies: ["Orientación a resultados", "Innovación", "Planificación"],
  },
  {
    title: "Coordinar un equipo de proyecto multidisciplinar",
    description:
      "Coordinar a un grupo de personas de distintas especialidades sin dependencia jerárquica directa.",
    benefit: "Desarrolla la conducción de personas sin apoyarse en el cargo.",
    methodology: "M70", tool: "ampliacion-responsabilidades", difficulty: "ADVANCED",
    developmentType: "FUTURE", duration: "5 meses",
    indicator: "Proyecto entregado en plazo con el equipo funcionando de forma autónoma",
    evidence: "Cierre del proyecto y feedback del equipo",
    responsible: "EMPLOYEE",
    minPotential: "MEDIUM",
    competencies: ["Liderazgo", "Colaboración", "Desarrollo de equipos", "Planificación"],
  },
  {
    title: "Liderar la negociación con un proveedor o cliente clave",
    description:
      "Hacerse cargo de una negociación relevante de principio a fin, desde la preparación hasta el cierre.",
    benefit: "Pone en juego el resultado real del negocio, no un ejercicio simulado.",
    methodology: "M70", tool: "proyectos-y-retos", difficulty: "ADVANCED",
    developmentType: "BOTH", duration: "3 meses",
    indicator: "Acuerdo cerrado dentro de los parámetros definidos con la contraparte",
    evidence: "Acuerdo firmado y ficha de cierre de la negociación",
    responsible: "EMPLOYEE",
    minPerformance: "MEDIUM",
    competencies: ["Negociación", "Influencia", "Visión de negocio"],
  },
  {
    title: "Participar como miembro pleno de un comité",
    description:
      "Integrarse con voz y responsabilidad a un comité de la organización, preparando los temas de su ámbito.",
    benefit: "Expone a la lógica de decisión del nivel superior de forma sostenida.",
    methodology: "M70", tool: "exposicion", difficulty: "ADVANCED",
    developmentType: "FUTURE", duration: "6 meses",
    indicator: "Participación en todas las sesiones con al menos tres temas propios llevados",
    evidence: "Actas del comité con sus intervenciones",
    responsible: "LEADER",
    minPotential: "HIGH",
    competencies: ["Pensamiento estratégico", "Influencia", "Toma de decisiones"],
  },
  {
    title: "Conducir las reuniones semanales del equipo",
    description:
      "Asumir la preparación y conducción de las reuniones del equipo, incluyendo el seguimiento de acuerdos.",
    benefit: "Es una práctica de liderazgo de bajo riesgo y alta frecuencia.",
    methodology: "M70", tool: "ampliacion-responsabilidades", difficulty: "BASIC",
    developmentType: "CURRENT", duration: "3 meses",
    indicator: "Doce reuniones conducidas con acuerdos cumplidos por encima del 80%",
    evidence: "Actas de reunión y seguimiento de acuerdos",
    responsible: "EMPLOYEE",
    competencies: ["Liderazgo", "Comunicación", "Planificación"],
  },
  {
    title: "Rotación temporal en otra área del negocio",
    description:
      "Trabajar durante un período definido en un área distinta, asumiendo entregables propios de esa área.",
    benefit: "Construye visión de negocio real, imposible de adquirir desde la propia silla.",
    methodology: "M70", tool: "ampliacion-responsabilidades", difficulty: "ADVANCED",
    developmentType: "FUTURE", duration: "3 meses",
    indicator: "Rotación completada con entregables aceptados por el área receptora",
    evidence: "Informe de la rotación y valoración del área receptora",
    responsible: "HR",
    minPotential: "HIGH",
    competencies: ["Visión de negocio", "Colaboración", "Gestión del cambio"],
  },
  {
    title: "Resolver un problema real y crítico del área",
    description:
      "Tomar un problema que lleva tiempo sin resolverse y hacerse responsable de cerrarlo definitivamente.",
    benefit: "Desarrolla la capacidad de decidir y sostener la decisión bajo presión.",
    methodology: "M70", tool: "proyectos-y-retos", difficulty: "INTERMEDIATE",
    developmentType: "CURRENT", duration: "2 meses",
    indicator: "Problema cerrado sin reincidencia durante los dos meses siguientes",
    evidence: "Análisis de causa raíz y plan de solución aplicado",
    responsible: "EMPLOYEE",
    competencies: ["Toma de decisiones", "Orientación a resultados", "Innovación"],
  },
  {
    title: "Presentar una recomendación de inversión ante gerencia",
    description:
      "Construir un caso de negocio con cifras y defender la recomendación ante la gerencia.",
    benefit: "Obliga a pensar en términos económicos y a sostener la propuesta ante preguntas duras.",
    methodology: "M70", tool: "exposicion", difficulty: "ADVANCED",
    developmentType: "FUTURE", duration: "2 meses",
    indicator: "Caso presentado y decisión tomada por la gerencia sobre la recomendación",
    evidence: "Caso de negocio y acta de la decisión",
    responsible: "EMPLOYEE",
    minPerformance: "MEDIUM",
    competencies: ["Visión de negocio", "Comunicación", "Influencia", "Pensamiento estratégico"],
  },
  {
    title: "Liderar la adopción de un nuevo proceso o herramienta",
    description:
      "Hacerse responsable de que un cambio se adopte realmente, gestionando la resistencia del equipo.",
    benefit: "Enseña que un cambio no termina cuando se anuncia, sino cuando se usa.",
    methodology: "M70", tool: "proyectos-y-retos", difficulty: "INTERMEDIATE",
    developmentType: "BOTH", duration: "4 meses",
    indicator: "Adopción superior al 80% del equipo tres meses después del lanzamiento",
    evidence: "Métrica de adopción y plan de acompañamiento",
    responsible: "EMPLOYEE",
    competencies: ["Gestión del cambio", "Liderazgo", "Comunicación"],
  },
  {
    title: "Acompañar a un colaborador en su plan de desarrollo",
    description:
      "Asumir el rol de mentor de una persona del equipo, construyendo y siguiendo su plan de desarrollo.",
    benefit: "Desarrollar a otro es la forma más exigente de consolidar la propia capacidad.",
    methodology: "M70", tool: "ampliacion-responsabilidades", difficulty: "INTERMEDIATE",
    developmentType: "CURRENT", duration: "6 meses",
    indicator: "Plan de la persona acompañada con avance superior al 70%",
    evidence: "Plan de desarrollo del colaborador y registro de sesiones",
    responsible: "EMPLOYEE",
    competencies: ["Desarrollo de equipos", "Feedback", "Liderazgo"],
  },
  {
    title: "Exposición directa a clientes estratégicos",
    description:
      "Asumir la relación con clientes clave, incluyendo visitas, seguimiento y resolución de incidencias.",
    benefit: "Conecta el trabajo interno con la realidad de quien paga por él.",
    methodology: "M70", tool: "exposicion", difficulty: "INTERMEDIATE",
    developmentType: "BOTH", duration: "5 meses",
    indicator: "Cartera atendida con satisfacción del cliente sostenida o mejorada",
    evidence: "Registro de visitas y medición de satisfacción",
    responsible: "EMPLOYEE",
    competencies: ["Visión de negocio", "Comunicación", "Negociación"],
  },
  {
    title: "Diseñar y ejecutar un experimento de innovación",
    description:
      "Formular una hipótesis de mejora, probarla en pequeño con una métrica clara y decidir si escalarla.",
    benefit: "Enseña a innovar con bajo riesgo y con criterio de decisión explícito.",
    methodology: "M70", tool: "proyectos-y-retos", difficulty: "INTERMEDIATE",
    developmentType: "BOTH", duration: "3 meses",
    indicator: "Experimento ejecutado y decisión de escalar o descartar documentada",
    evidence: "Ficha del experimento con resultados",
    responsible: "EMPLOYEE",
    competencies: ["Innovación", "Toma de decisiones", "Pensamiento estratégico"],
  },
  {
    title: "Construir el plan anual del área",
    description:
      "Elaborar el plan del área con objetivos, hitos, recursos y riesgos, y defenderlo ante su líder.",
    benefit: "Obliga a pasar del corto plazo a una mirada de doce meses.",
    methodology: "M70", tool: "proyectos-y-retos", difficulty: "ADVANCED",
    developmentType: "FUTURE", duration: "2 meses",
    indicator: "Plan aprobado y desplegado en objetivos individuales del equipo",
    evidence: "Plan anual aprobado",
    responsible: "EMPLOYEE",
    competencies: ["Planificación", "Pensamiento estratégico", "Visión de negocio"],
  },
  {
    title: "Representar al área en un foro interno o externo",
    description:
      "Hablar en nombre del área en un evento, congreso o foro interno de la organización.",
    benefit: "Consolida la voz propia y la visibilidad más allá del equipo cercano.",
    methodology: "M70", tool: "exposicion", difficulty: "INTERMEDIATE",
    developmentType: "FUTURE", duration: "2 meses",
    indicator: "Participación realizada con valoración positiva de la audiencia",
    evidence: "Material presentado y valoración recibida",
    responsible: "EMPLOYEE",
    competencies: ["Comunicación", "Influencia", "Visión de negocio"],
  },
  {
    title: "Hacerse cargo de un indicador crítico del negocio",
    description:
      "Asumir la responsabilidad completa sobre un indicador relevante: diagnóstico, plan, ejecución y resultado.",
    benefit: "Convierte la orientación a resultados en algo medible y personal.",
    methodology: "M70", tool: "ampliacion-responsabilidades", difficulty: "ADVANCED",
    developmentType: "BOTH", duration: "6 meses",
    indicator: "Indicador mejorado respecto a la línea base acordada",
    evidence: "Serie del indicador y plan de acción aplicado",
    responsible: "EMPLOYEE",
    minPerformance: "MEDIUM",
    competencies: ["Orientación a resultados", "Toma de decisiones", "Planificación"],
  },
  {
    title: "Liderar una mejora del proceso de otra área",
    description:
      "Intervenir un proceso que no depende de la persona, consiguiendo el acuerdo del área responsable.",
    benefit: "Es influencia pura: no hay autoridad, solo argumentos y relación.",
    methodology: "M70", tool: "proyectos-y-retos", difficulty: "ADVANCED",
    developmentType: "FUTURE", duration: "4 meses",
    indicator: "Mejora implementada con el acuerdo formal del área responsable",
    evidence: "Acta de acuerdo y medición de la mejora",
    responsible: "EMPLOYEE",
    competencies: ["Influencia", "Colaboración", "Gestión del cambio", "Negociación"],
  },
  {
    title: "Sostener conversaciones de desempeño con el equipo",
    description:
      "Conducir personalmente el ciclo de conversaciones de desempeño con cada integrante del equipo.",
    benefit: "Es la práctica que más rápidamente desarrolla la capacidad de dar feedback.",
    methodology: "M70", tool: "ampliacion-responsabilidades", difficulty: "INTERMEDIATE",
    developmentType: "CURRENT", duration: "3 meses",
    indicator: "Ciclo completo realizado con acuerdos documentados por persona",
    evidence: "Actas de las conversaciones de desempeño",
    responsible: "EMPLOYEE",
    competencies: ["Feedback", "Desarrollo de equipos", "Inteligencia emocional"],
  },
  {
    title: "Integrar un equipo de trabajo interárea",
    description:
      "Participar como miembro de un equipo que reúne a varias áreas para resolver un problema común.",
    benefit: "Entrena la colaboración cuando los intereses de cada área no coinciden.",
    methodology: "M70", tool: "proyectos-y-retos", difficulty: "BASIC",
    developmentType: "BOTH", duration: "3 meses",
    indicator: "Participación sostenida y entregable conjunto completado",
    evidence: "Entregable del equipo interárea",
    responsible: "EMPLOYEE",
    competencies: ["Colaboración", "Comunicación", "Planificación"],
  },
  {
    title: "Gestionar una situación de crisis del área",
    description:
      "Asumir la conducción durante una contingencia real: decisiones, comunicación y cierre posterior.",
    benefit: "Ninguna formación reemplaza haber decidido con el reloj en contra.",
    methodology: "M70", tool: "ampliacion-responsabilidades", difficulty: "ADVANCED",
    developmentType: "FUTURE", duration: "Según ocurrencia",
    indicator: "Situación resuelta y aprendizajes incorporados al protocolo del área",
    evidence: "Informe posterior a la crisis",
    responsible: "LEADER",
    minPerformance: "HIGH",
    competencies: ["Toma de decisiones", "Inteligencia emocional", "Liderazgo", "Comunicación"],
  },
  {
    title: "Diseñar y facilitar una sesión de trabajo para el equipo",
    description:
      "Preparar y conducir una jornada de trabajo del equipo con objetivos, dinámica y conclusiones propias.",
    benefit: "Obliga a estructurar el pensamiento y a sostener a un grupo durante horas.",
    methodology: "M70", tool: "exposicion", difficulty: "INTERMEDIATE",
    developmentType: "CURRENT", duration: "6 semanas",
    indicator: "Sesión realizada con objetivos cumplidos y plan de acción resultante",
    evidence: "Diseño de la sesión y plan de acción resultante",
    responsible: "EMPLOYEE",
    competencies: ["Comunicación", "Planificación", "Liderazgo"],
  },
  {
    title: "Incorporar y formar a una persona nueva en el equipo",
    description:
      "Hacerse responsable de la incorporación completa de un nuevo integrante hasta su autonomía.",
    benefit: "Desarrolla la capacidad de transferir conocimiento y acompañar el aprendizaje.",
    methodology: "M70", tool: "ampliacion-responsabilidades", difficulty: "BASIC",
    developmentType: "CURRENT", duration: "3 meses",
    indicator: "Persona autónoma en sus funciones al finalizar el período acordado",
    evidence: "Plan de incorporación y evaluación de autonomía",
    responsible: "EMPLOYEE",
    competencies: ["Desarrollo de equipos", "Comunicación", "Feedback"],
  },
];

export const ACTIVITIES: SeedActivity[] = [...LEARN_AND_CONNECT, ...EXPERIENCE];
