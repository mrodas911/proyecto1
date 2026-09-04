/**
 * Contenido y configuración del sitio público de Domina.
 *
 * Todo el texto comercial vive aquí para que la marca se edite en un solo
 * archivo sin tocar componentes. Los campos marcados con `TODO` son datos
 * reales que la consultora debe completar antes de publicar.
 */

export type IconName =
  | "chart"
  | "compass"
  | "target"
  | "sparkles"
  | "users"
  | "presentation"
  | "layers"
  | "book"
  | "message"
  | "building"
  | "headphones"
  | "clock";

export const empresa = {
  nombre: "Domina",
  nombreLargo: "Domina Consultora",
  claim: "Estrategia y crecimiento empresarial",
  ciudad: "Cuenca",
  provincia: "Azuay",
  pais: "Ecuador",
  fundador: "Mateo Sebastián Rodas",
  // TODO: reemplazar por los datos reales de contacto de la consultora.
  email: "hola@domina.ec",
  telefono: "+593 99 000 0000",
  telefonoEnlace: "+593990000000",
  direccion: "Cuenca, Azuay — Ecuador",
  horario: "Lunes a viernes, 09:00 a 18:00 (GMT-5)",
  atencion: "Atención presencial en Cuenca con cita previa y remota en todo el país.",
} as const;

/** Redes sociales: se muestran solo las que tengan `href`. TODO: completar. */
export const redes: { nombre: string; href: string }[] = [
  { nombre: "LinkedIn", href: "" },
  { nombre: "Instagram", href: "" },
];

export const navegacion = [
  { label: "Inicio", href: "/" },
  { label: "Servicios", href: "/servicios" },
  { label: "Acerca de", href: "/acerca-de" },
  { label: "Colabora con nosotros", href: "/colabora-con-nosotros" },
  { label: "Contacto", href: "/contacto" },
] as const;

export type Servicio = {
  slug: string;
  nombre: string;
  linea: string;
  resumen: string;
  descripcion: string;
  icono: IconName;
  problema: string;
  incluye: { titulo: string; detalle: string }[];
  entregables: string[];
  paraQuien: string[];
};

export const servicios: Servicio[] = [
  {
    slug: "estrategia",
    nombre: "Domina Estrategia",
    linea: "Estrategia comercial",
    resumen:
      "Ordenamos el ciclo comercial completo —de la prospección al cierre— con una estrategia basada en datos y ejecutada con foco en resultados medibles.",
    descripcion:
      "Diagnosticamos el proceso de ventas y la estructura del área comercial, identificamos dónde se pierde el negocio y diseñamos un plan de acción con metas, responsables y tiempos. No entregamos un informe para archivar: acompañamos la ejecución hasta que los indicadores se mueven.",
    icono: "chart",
    problema:
      "Vendes, pero no sabes por qué unos meses sí y otros no. El equipo trabaja sin proceso y el crecimiento depende de un par de personas.",
    incluye: [
      {
        titulo: "Diagnóstico comercial",
        detalle:
          "Revisión del embudo, del proceso de venta, de la cartera de clientes y de la estructura del área.",
      },
      {
        titulo: "Estrategia y planeación",
        detalle:
          "Definición de propuesta de valor, segmentos prioritarios, metas por línea y política comercial.",
      },
      {
        titulo: "Rediseño del proceso",
        detalle:
          "Etapas de venta, criterios de avance, guiones, materiales de apoyo y ruta de seguimiento.",
      },
      {
        titulo: "Tablero de indicadores",
        detalle:
          "KPIs de actividad, conversión y rentabilidad con una rutina de revisión que el equipo sostiene.",
      },
    ],
    entregables: [
      "Informe de diagnóstico con oportunidades priorizadas",
      "Plan comercial con metas, responsables y calendario",
      "Manual del proceso de ventas",
      "Tablero de indicadores y rutina de seguimiento",
    ],
    paraQuien: [
      "Empresas con equipo comercial que crece sin método",
      "Negocios que dependen de pocos clientes o de un solo vendedor",
      "Direcciones que necesitan previsibilidad en el ingreso",
    ],
  },
  {
    slug: "digital",
    nombre: "Domina Digital",
    linea: "Presencia y marketing digital",
    resumen:
      "Consultoría digital para aumentar la visibilidad en línea con objetivos claros: posicionamiento, contenidos, campañas y remarketing.",
    descripcion:
      "Conectamos la presencia digital con el negocio. Antes de publicar definimos qué buscamos —contactos, reservas, cotizaciones— y construimos el sistema que lo produce: marca, canales, contenidos y campañas medidas contra ese objetivo.",
    icono: "sparkles",
    problema:
      "Publicas en redes sin saber si sirve para algo, y la web no genera contactos.",
    incluye: [
      {
        titulo: "Estrategia digital",
        detalle:
          "Objetivos, audiencias, mensajes y mezcla de canales alineados a la meta comercial.",
      },
      {
        titulo: "Marca y contenidos",
        detalle:
          "Identidad verbal y visual, línea gráfica y calendario editorial para redes y web.",
      },
      {
        titulo: "Posicionamiento web",
        detalle:
          "Estructura del sitio, SEO técnico y de contenidos, y fichas de negocio locales.",
      },
      {
        titulo: "Campañas y remarketing",
        detalle:
          "Pauta segmentada, recuperación de visitantes y medición del costo por contacto.",
      },
    ],
    entregables: [
      "Plan digital con objetivos e indicadores",
      "Manual de marca y línea de contenidos",
      "Calendario editorial mensual",
      "Reporte de campañas con costo por contacto y por venta",
    ],
    paraQuien: [
      "Marcas con presencia dispersa o inconsistente",
      "Negocios que dependen del boca a boca y quieren canal propio",
      "Equipos de marketing que necesitan enfoque y medición",
    ],
  },
  {
    slug: "academy",
    nombre: "Domina Academy",
    linea: "Formación y coaching",
    resumen:
      "Capacitación, talleres y coaching a medida para desarrollar habilidades comerciales, de liderazgo y de comunicación.",
    descripcion:
      "Diseñamos programas sobre el caso real de la empresa, no sobre teoría genérica. Cada sesión combina marco conceptual, práctica con situaciones propias del negocio y compromisos concretos que se revisan en el siguiente encuentro.",
    icono: "presentation",
    problema:
      "El equipo tiene buena actitud pero le faltan herramientas, y las capacitaciones que probaron no cambiaron nada.",
    incluye: [
      {
        titulo: "Detección de necesidades",
        detalle:
          "Entrevistas, observación en campo y evaluación de brechas por rol y por persona.",
      },
      {
        titulo: "Programas a medida",
        detalle:
          "Ventas consultivas, negociación, liderazgo de equipos, servicio al cliente y comunicación.",
      },
      {
        titulo: "Coaching individual",
        detalle:
          "Acompañamiento uno a uno para líderes y vendedores con metas de desempeño definidas.",
      },
      {
        titulo: "Medición del aprendizaje",
        detalle:
          "Evaluación antes y después, y seguimiento del indicador de negocio que el programa busca mover.",
      },
    ],
    entregables: [
      "Malla de formación por rol",
      "Materiales y manuales del participante",
      "Sesiones presenciales o virtuales con práctica guiada",
      "Informe de avance por persona y por equipo",
    ],
    paraQuien: [
      "Equipos comerciales que necesitan método de venta",
      "Mandos medios que pasaron de técnicos a líderes",
      "Empresas que quieren estandarizar la experiencia del cliente",
    ],
  },
  {
    slug: "talento",
    nombre: "Domina Talento",
    linea: "Selección y recursos humanos",
    resumen:
      "Reclutamiento, selección y headhunting. Analizamos la vacante y buscamos el perfil que encaja con tu equipo y con tu cultura.",
    descripcion:
      "Antes de publicar una vacante entendemos qué necesita realmente el puesto. Definimos el perfil con el área que contrata, hacemos búsqueda directa cuando el mercado es escaso y entregamos una terna sustentada con evidencia, no con impresiones.",
    icono: "users",
    problema:
      "Contratas rápido y te arrepientes despacio: la rotación te cuesta más que el sueldo del puesto.",
    incluye: [
      {
        titulo: "Análisis de la vacante",
        detalle:
          "Perfil de cargo, competencias críticas, banda salarial de mercado y encaje cultural.",
      },
      {
        titulo: "Búsqueda y headhunting",
        detalle:
          "Convocatoria abierta y búsqueda directa de perfiles pasivos en el mercado local y regional.",
      },
      {
        titulo: "Evaluación estructurada",
        detalle:
          "Entrevistas por competencias, pruebas técnicas y verificación de referencias.",
      },
      {
        titulo: "Acompañamiento a la incorporación",
        detalle:
          "Plan de los primeros 90 días y seguimiento durante el período de garantía.",
      },
    ],
    entregables: [
      "Descriptivo de cargo y perfil de competencias",
      "Terna final con informe individual de cada candidato",
      "Referencias laborales verificadas",
      "Plan de incorporación de 90 días",
    ],
    paraQuien: [
      "Empresas que abren posiciones clave o de confianza",
      "Áreas comerciales con alta rotación",
      "Negocios familiares que profesionalizan su estructura",
    ],
  },
  {
    slug: "fabrica-de-vendedores",
    nombre: "Fábrica de Vendedores",
    linea: "Fuerza comercial llave en mano",
    resumen:
      "Reclutamos, formamos y ponemos en marcha tu fuerza de ventas: de la selección al vendedor productivo, con un solo responsable.",
    descripcion:
      "Un programa que une selección y formación en un mismo proceso. Construimos el equipo comercial desde cero o reforzamos el existente, lo entrenamos con el método de venta de la empresa y lo acompañamos en campo hasta que alcanza su cuota.",
    icono: "target",
    problema:
      "Necesitas vender más ya, pero armar y entrenar un equipo comercial te toma meses que no tienes.",
    incluye: [
      {
        titulo: "Perfil del vendedor ideal",
        detalle:
          "Definido a partir de quienes ya venden bien en tu empresa y del ciclo real de tu producto.",
      },
      {
        titulo: "Reclutamiento por volumen",
        detalle:
          "Convocatoria, filtros y dinámicas grupales para cubrir varias posiciones a la vez.",
      },
      {
        titulo: "Escuela de inducción",
        detalle:
          "Producto, mercado, guion, objeciones y herramientas antes de la primera visita.",
      },
      {
        titulo: "Acompañamiento en campo",
        detalle:
          "Salidas conjuntas, retroalimentación semanal y curva de productividad monitoreada.",
      },
    ],
    entregables: [
      "Equipo comercial contratado e inducido",
      "Manual de argumentario y manejo de objeciones",
      "Rampa de productividad con metas por semana",
      "Informe de desempeño individual al cierre del programa",
    ],
    paraQuien: [
      "Empresas que abren mercado, ciudad o línea de producto",
      "Negocios que necesitan escalar la fuerza de ventas rápido",
      "Distribuidoras y comercializadoras con rotación alta",
    ],
  },
  {
    slug: "domina-ia",
    nombre: "Domina IA",
    linea: "Inteligencia artificial aplicada",
    resumen:
      "Inteligencia artificial puesta al servicio de la estrategia comercial y del marketing, con casos de uso concretos y datos propios.",
    descripcion:
      "Identificamos dónde la IA ahorra horas o mejora decisiones en tu operación —prospección, atención, contenidos, análisis de cartera— y la implementamos con herramientas del mercado, criterios de uso responsable y capacitación al equipo.",
    icono: "layers",
    problema:
      "Todos hablan de IA, pero nadie te explica qué haría exactamente en tu empresa ni cuánto te ahorra.",
    incluye: [
      {
        titulo: "Mapa de oportunidades",
        detalle:
          "Inventario de procesos y priorización por ahorro de tiempo, impacto y facilidad de implementación.",
      },
      {
        titulo: "Asistentes y automatizaciones",
        detalle:
          "Prospección asistida, respuestas a clientes, propuestas y reportes generados con tus datos.",
      },
      {
        titulo: "Análisis comercial",
        detalle:
          "Segmentación de cartera, alertas de fuga y priorización de oportunidades.",
      },
      {
        titulo: "Adopción y buenas prácticas",
        detalle:
          "Capacitación del equipo, política de uso y cuidado de la información confidencial.",
      },
    ],
    entregables: [
      "Mapa de casos de uso priorizados",
      "Prototipos funcionales de los dos primeros casos",
      "Política interna de uso de IA",
      "Capacitación al equipo y medición del tiempo ahorrado",
    ],
    paraQuien: [
      "Empresas con procesos comerciales repetitivos",
      "Equipos de marketing que producen mucho contenido",
      "Direcciones que quieren empezar por casos rentables, no por moda",
    ],
  },
];

export const proceso = [
  {
    n: "01",
    titulo: "Diagnóstico",
    detalle:
      "Entrevistas, datos y observación en terreno. Salimos con una foto honesta del punto de partida y de dónde está el dinero que hoy se pierde.",
  },
  {
    n: "02",
    titulo: "Estrategia",
    detalle:
      "Priorizamos las pocas decisiones que mueven el resultado y las convertimos en un plan con metas, responsables y fechas.",
  },
  {
    n: "03",
    titulo: "Ejecución",
    detalle:
      "Trabajamos junto al equipo: procesos, herramientas, formación y acompañamiento en campo hasta que el cambio se sostiene solo.",
  },
  {
    n: "04",
    titulo: "Medición",
    detalle:
      "Revisiones periódicas contra indicadores acordados. Lo que no se mide no se sostiene, y lo que no funciona se corrige a tiempo.",
  },
] as const;

export const diferenciales = [
  {
    icono: "target" as IconName,
    titulo: "Resultados medibles",
    detalle:
      "Cada proyecto arranca con indicadores acordados por escrito. Si no se pueden medir, no los proponemos.",
  },
  {
    icono: "users" as IconName,
    titulo: "Trabajamos con tu equipo",
    detalle:
      "No reemplazamos a tu gente: la entrenamos. El conocimiento se queda en la empresa cuando nos vamos.",
  },
  {
    icono: "compass" as IconName,
    titulo: "Hecho a medida",
    detalle:
      "Nada de plantillas. El plan se construye sobre tu mercado, tu tamaño y tu forma de operar.",
  },
  {
    icono: "building" as IconName,
    titulo: "Raíz cuencana",
    detalle:
      "Conocemos el tejido empresarial del Austro y sus reglas no escritas. Cerca, en persona, cuando hace falta.",
  },
  {
    icono: "chart" as IconName,
    titulo: "Decisiones con datos",
    detalle:
      "Diagnóstico cuantitativo antes de opinar. Las intuiciones se contrastan con números.",
  },
  {
    icono: "clock" as IconName,
    titulo: "Alcance acotado",
    detalle:
      "Proyectos con inicio y fin claros. Sabes qué recibes, cuándo y a qué costo desde el primer día.",
  },
];

export const valores = [
  {
    titulo: "Honestidad comercial",
    detalle:
      "Decimos que no cuando el proyecto no va a funcionar. Preferimos perder una venta a entregar un informe inútil.",
  },
  {
    titulo: "Confidencialidad",
    detalle:
      "Lo que ocurre dentro de la empresa del cliente se queda ahí. Sin excepciones ni casos de estudio sin permiso.",
  },
  {
    titulo: "Rigor",
    detalle: "Antes de recomendar, medimos. Antes de medir, entendemos el negocio.",
  },
  {
    titulo: "Cercanía",
    detalle:
      "Consultoría de trato directo: hablas con quien hace el trabajo, no con un ejecutivo de cuenta.",
  },
] as const;

export const sectores = [
  "Comercio y retail",
  "Manufactura",
  "Distribución y consumo masivo",
  "Servicios profesionales",
  "Salud",
  "Educación",
  "Turismo y hotelería",
  "Inmobiliario y construcción",
  "Tecnología",
] as const;

export const cifras = [
  { valor: "6", etiqueta: "líneas de servicio integradas" },
  { valor: "4", etiqueta: "fases: diagnóstico, estrategia, ejecución y medición" },
  { valor: "100%", etiqueta: "de los planes construidos a medida" },
  { valor: "Cuenca", etiqueta: "base de operación, alcance nacional" },
] as const;

export const fundador = {
  nombre: "Mateo Sebastián Rodas",
  cargo: "Fundador y Director",
  ciudad: "Cuenca, Ecuador",
  parrafos: [
    "Fundé Domina con una convicción simple: la mayoría de las empresas no necesita una idea nueva, necesita ejecutar bien la que ya tiene. En el camino vi demasiados diagnósticos brillantes terminar archivados porque nadie acompañó la parte difícil, que es hacerlos realidad con el equipo que uno tiene.",
    "Por eso trabajamos distinto. Entramos a la operación, nos sentamos con el equipo comercial, revisamos los números reales y nos quedamos hasta que el proceso funciona sin nosotros. Un proyecto termina bien cuando el cliente ya no nos necesita para sostenerlo.",
    "Domina nace en Cuenca y desde aquí acompaña a empresas del Austro y del resto del país. Creemos que la consultoría seria no es un privilegio de las grandes corporaciones: la empresa mediana ecuatoriana merece el mismo rigor.",
  ],
  // TODO: completar con la formación y trayectoria verificables del fundador.
  credenciales: [] as string[],
} as const;

export const preguntas = [
  {
    p: "¿Trabajan solo en Cuenca?",
    r: "Nuestra base está en Cuenca y atendemos presencialmente el Austro. Para el resto del Ecuador combinamos sesiones remotas con visitas programadas según lo que exija el proyecto.",
  },
  {
    p: "¿Cuánto dura un proyecto?",
    r: "Un diagnóstico toma entre dos y cuatro semanas. Un acompañamiento completo de estrategia y ejecución suele ir de tres a seis meses, con revisiones mensuales. Los programas de formación se ajustan al calendario del equipo.",
  },
  {
    p: "¿Atienden empresas pequeñas?",
    r: "Sí. Ajustamos el alcance al tamaño del negocio: para una empresa pequeña muchas veces basta con ordenar el proceso comercial y entrenar a dos o tres personas.",
  },
  {
    p: "¿Cómo se cobra?",
    r: "Por proyecto, con alcance y entregables definidos por escrito antes de empezar. También ofrecemos acompañamiento mensual para empresas que necesitan una dirección comercial externa.",
  },
  {
    p: "¿Qué pasa con la información de mi empresa?",
    r: "Se firma un acuerdo de confidencialidad antes de acceder a cualquier dato. No usamos información ni nombres de clientes en materiales de venta sin autorización expresa.",
  },
] as const;

/**
 * Testimonios reales de clientes.
 * La sección solo se renderiza cuando este arreglo tiene contenido: preferimos
 * un sitio sin testimonios a un sitio con testimonios inventados.
 * TODO: añadir citas reales con autorización del cliente.
 * Ejemplo de formato:
 *   { cita: "…", autor: "Nombre Apellido", cargo: "Gerente General, Empresa" }
 */
export const testimonios: { cita: string; autor: string; cargo: string }[] = [];
