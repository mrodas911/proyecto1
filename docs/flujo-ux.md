# Flujo UX y wireframes

Documento de referencia del recorrido completo de la plataforma. Recoge las
pantallas exigidas en el punto 41 del encargo: Home, Login, Dashboard, Nuevo
plan, Persona, Objetivo, Diagnóstico, Competencias, 10 %, 20 %, 70 %, Resumen,
PDF, Histórico y Administrador.

Los wireframes son esquemáticos a propósito: describen la jerarquía de la
información y las decisiones que toma el usuario en cada pantalla, no el
acabado visual (que vive en el sistema de diseño, `src/app/globals.css`).

---

## 1. Arquitectura conceptual

```
DIAGNÓSTICO            Desempeño + Potencial + Aspiración
      │
OBJETIVO               Fortalecer posición actual  /  Prepararse para una futura
      │                       └── determina la cuota de herramientas (5 u 8)
BRECHAS                1 a 3 competencias, con nivel actual → nivel requerido
      │
10 % APRENDO           Formación y conocimiento
20 % ME ACOMPAÑAN      Mentoría, coaching, feedback, shadowing
70 % LO PONGO EN       Proyectos, exposición, retos y responsabilidades
     PRÁCTICA
      │
MI RUTA DE DESARROLLO  Revisión y personalización (el «carrito»)
      │
PLAN INDIVIDUAL        Validación automática + generación
      │
PDF PROFESIONAL        Documento ejecutivo de 8 a 12 páginas
```

Separación deliberada entre **competencia** (qué se desarrolla) y **actividad**
(qué se hace). Una misma actividad desarrolla varias competencias, y esa
relación muchos-a-muchos es lo que permite que la biblioteca crezca sin
duplicar contenido.

---

## 2. Mapa de navegación

```
PÚBLICO
  /                       Portada
  /login                  Entrar
  /recuperar              Recuperar contraseña
  /restablecer            Nueva contraseña

APLICACIÓN (requiere sesión)
  /dashboard              Inicio
  /planes                 Histórico
  /planes/nuevo           Elegir persona
  /planes/[id]            Ficha del plan
  /planes/[id]/wizard/…   Asistente (9 pasos)
  /documento/[id]         Documento imprimible
  /colaboradores          Fichas del equipo
  /biblioteca             Catálogo
  /equipo                 Usuarios (Talento Humano)
  /ayuda                  Cómo funciona
  /admin/…                Panel del consultor (superadministrador)
```

---

## 3. Home pública

```
┌──────────────────────────────────────────────────────────────┐
│  Ruta                                            [ Entrar ]  │
├──────────────────────────────────────────────────────────────┤
│  ‹Talent Development›                                        │
│                                                              │
│  Construye rutas de desarrollo que conviertan                │
│  POTENCIAL EN ACCIÓN.                                        │
│                                                              │
│  Diseña planes personalizados mediante experiencias,         │
│  acompañamiento y aprendizaje.                               │
│                                                              │
│  [ Crear nuevo plan de desarrollo ]  [ Cómo funciona ]       │
│  Un plan completo en 10-15 minutos. Sin capacitación previa. │
├──────────────────────────────────────────────────────────────┤
│  Diagnosticar → Priorizar → Diseñar → Ejecutar → Desarrollar │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐                 │
│  │01 Diag.│ │02 Brec.│ │03 Ruta │ │04 Plan │                 │
│  └────────┘ └────────┘ └────────┘ └────────┘                 │
├──────────────────────────────────────────────────────────────┤
│  ┌─ 10% Aprendo ─┐ ┌─ 20% Me acom.─┐ ┌─ 70% Práctica ─┐      │
│  └───────────────┘ └───────────────┘ └────────────────┘      │
└──────────────────────────────────────────────────────────────┘
```

No debe parecer un LMS. La promesa es crecimiento y construcción de futuro.

---

## 4. Login

```
┌───────────────────────────┬──────────────────────────────────┐
│  Ruta                     │                                  │
│                           │                                  │
│  Entra a tu espacio       │   «No tuve que inventarme un     │
│  Accede con las           │   plan de desarrollo.            │
│  credenciales que te      │   La plataforma me ayudó a       │
│  entregó tu organización. │   construirlo.»                  │
│                           │                                  │
│  Correo    [___________]  │   Diagnosticar · Priorizar ·     │
│  Contraseña[___________]  │   Diseñar · Ejecutar             │
│  [       Entrar        ]  │                                  │
│  ¿Olvidaste tu contraseña?│                                  │
└───────────────────────────┴──────────────────────────────────┘
```

---

## 5. Dashboard

```
┌────────────┬─────────────────────────────────────────────────┐
│ Ruta       │ ╔═════════════════════════════════════════════╗ │
│ Empresa X  │ ║ Hola, Andrés                                ║ │
│            │ ║ Construye rutas de desarrollo que           ║ │
│ ▸ Inicio   │ ║ conviertan potencial en acción.             ║ │
│ ▸ Mis      │ ║ [ + Crear nuevo plan de desarrollo ]        ║ │
│   planes   │ ╚═════════════════════════════════════════════╝ │
│ ▸ Colabo-  │ ┌────────┐┌────────┐┌────────┐┌────────┐        │
│   radores  │ │ Planes ││Borrador││Finaliz.││Colabor.│        │
│ ▸ Biblio-  │ └────────┘└────────┘└────────┘└────────┘        │
│   teca     │ Planes recientes                    Ver todos   │
│ ▸ Ayuda    │ ┌──────────────┐┌──────────────┐                │
│            │ │ JP Juan Pérez││ LG Laura G.  │                │
│ Andrés M.  │ │ ▓▓▓▓▓▓░ 100% ││ ▓▓▓░░░░  52% │                │
│ Cerrar ses.│ └──────────────┘└──────────────┘                │
└────────────┴─────────────────────────────────────────────────┘
```

---

## 6. Nuevo plan — elegir persona

```
¿Para quién vamos a construir el plan?

[ Alguien de mi equipo ]  [ + Registrar a una persona nueva ]

🔍 Buscar por nombre o cargo
┌───────────────┐ ┌───────────────┐ ┌───────────────┐
│ JP Juan Pérez │ │ LG Laura Gómez│ │ DC Diego C.   │
│ Jefe de Tienda│ │ Analista Op.  │ │ Coordinador   │
│ 1 plan previo │ │               │ │               │
└───────────────┘ └───────────────┘ └───────────────┘
```

Al elegir se crea el borrador y se entra directamente al paso 1.

---

## 7. El asistente

Barra de progreso permanente en los nueve pasos. Cada paso resuelve **una**
decisión; nunca se muestran veinte preguntas a la vez.

```
DC Diego Cardona                     ✓ Guardado automáticamente
Coordinador de Operaciones           Guardar y continuar después

Paso 4 de 9  Competencias                        38% del recorrido
▬▬▬▬ ▬▬▬▬ ▬▬▬▬ ▬▬▬▬ ──── ──── ──── ──── ────
✓Per ✓Diag ✓Obj  Comp  Apre  Cone  Expe  Revi  Gene
```

### Paso 1 · Persona

```
¿Para quién estamos construyendo este plan?

┌─ Datos de la persona ──────────────────────────────────┐
│ Nombre     [________]   Apellido   [________]          │
│ Empresa    [Empresa X]  Correo     [________]          │
│ Área       [________]   Cargo      [________]          │
│ Jefe       [________]   Ubicación  [________]          │
│ Fecha del plan [__/__/____]                            │
└────────────────────────────────────────────────────────┘
▸ Datos adicionales (antigüedad, nivel, unidad de negocio)
```

### Paso 2 · Diagnóstico

```
¿De dónde parte esta persona hoy?

ℹ Tu empresa ya tiene un diagnóstico cargado
  Desempeño 2025: Bajo   Potencial 2025: Medio
  [ Usar estos resultados ]

Desempeño   ┌ Bajo ┐┌ Medio ┐┌ Alto ┐
Potencial   ┌ Bajo ┐┌ Medio ┐┌ Alto ┐
Aspiración  ○ Liderazgo ○ Especialista ○ Movimiento lateral
            ○ Consolidarse ○ Sin definir

┌─ Lectura del diagnóstico ──────────────────────────────┐
│              Pot. bajo   Pot. medio   Pot. alto        │
│  Desemp.alto │        │ │        │ │        │          │
│  Desemp.medio│        │ │  ███   │ │        │          │
│  Desemp.bajo │        │ │        │ │        │          │
│  «Profesional en desarrollo» + interpretación          │
└────────────────────────────────────────────────────────┘
```

Tercer eje deliberado: la **aspiración**. Alguien de alto potencial no
necesariamente quiere dirigir, y eso cambia la ruta.

### Paso 3 · Objetivo

```
¿Cuál es el objetivo principal de este plan de desarrollo?

┌──────────────────────────┐ ┌──────────────────────────┐
│ ◎                        │ │ ⌁                        │
│ Fortalecer el desempeño  │ │ Prepararse para una      │
│ en su posición actual    │ │ posición futura          │
│ …                        │ │ …                        │
│ Podrás utilizar 5        │ │ Tendrás acceso a las 8   │
│ herramientas del catálogo│ │ herramientas completas   │
└──────────────────────────┘ └──────────────────────────┘

(si futura) Cargo objetivo [______]  Área [______]
            Horizonte  ○ <12m  ○ 12-24m  ○ >24m

En una frase, ¿qué queremos lograr con este plan? [__________]
```

Aquí se aplica la **regla 5 de 8 / 8 de 8**, configurable desde el panel.

### Paso 4 · Competencias

```
¿Qué competencias necesita desarrollar?   (máximo 3)

┌─ PENSAMIENTO ESTRATÉGICO ──────────────────── [🗑] ────┐
│ Nivel actual  1 2 [3] 4 5   Nivel requerido 1 2 3 [4] 5│
│ «Competente. Anticipa escenarios de su ámbito…»        │
│ Objetivo: Evolucionar Pensamiento estratégico de un    │
│ nivel 3 a un nivel 4, fortaleciendo su capacidad de…   │
└────────────────────────────────────────────────────────┘

Catálogo             [Todas][Liderazgo][Negocio][Interp.]…
┌────────────┐┌────────────┐┌────────────┐
│ LIDERAZGO  ││ INFLUENCIA ││ FEEDBACK   │
│ Capacidad… ││ Capacidad… ││ Capacidad… │
│[Desarrollar││[Desarrollar││[Desarrollar│
└────────────┘└────────────┘└────────────┘
```

Si se intenta pasar del máximo: *«Para lograr mayor impacto recomendamos
trabajar máximo tres competencias simultáneamente.»*

### Pasos 5, 6 y 7 · 10 % → 20 % → 70 %

Construcción pedagógica de menor a mayor exposición. Misma plantilla, distinto
microcopy:

| Paso | Pregunta                                                    |
|------|-------------------------------------------------------------|
| 10 % | ¿Qué necesita aprender para desarrollar esta competencia?    |
| 20 % | ¿Quién puede acompañarlo, desafiarlo o ayudarlo a aprender?  |
| 70 % | ¿Dónde podrá ponerlo en práctica?                           |

```
Has seleccionado 3 de 5 herramientas disponibles.   ▬▬ ▬▬ ▬▬ ░░ ░░

🔍 Buscar en el catálogo

PENSAMIENTO ESTRATÉGICO
  ✓ Curso de análisis estratégico y escenarios      [🗑]
  [ ✎ Escribir mi propia actividad ]

  Recomendado para Pensamiento Estratégico   ←── carrusel ──→
  ┌────────────────┐┌────────────────┐┌────────────────┐
  │ 10% ✨Recomend.││ 10%            ││ 10%            │
  │ Curso de anál… ││ Finanzas para… ││ Lectura guiada │
  │ Se añadirá a…  ││ Duración 6 sem ││ Dificultad …   │
  │ Para qué sirve ││ …              ││ …              │
  │[+ Agregar]     ││[+ Agregar]     ││[+ Agregar]     │
  └────────────────┘└────────────────┘└────────────────┘
  Otras opciones del catálogo   ←── carrusel ──→
```

### Paso 8 · Mi ruta de desarrollo (el «carrito»)

```
Así queda la ruta. ¿La ajustamos?

┌────────────────────────────────────────────────────────┐
│ Tu plan está 78% completo        2 competencias · 6 acc│
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░                                    │
│ ⚠ Todas las acciones tienen fecha — 3 sin fechas       │
│ ⚠ Tiene acciones de 70% — Falta en: Influencia  → Ir   │
└────────────────────────────────────────────────────────┘

PENSAMIENTO ESTRATÉGICO      Nivel 3 → 4
10% · APRENDO
  ┌──────────────────────────────────────────── ✎  🗑 ──┐
  │ Curso de análisis estratégico y escenarios          │
  │ Objetivo    [_______________________________]       │
  │ Responsable [Mentor ▾]  Nombre [____________]       │
  │ Inicio [__/__/__]  Objetivo [__/__/__]              │
  │ Frecuencia [_______]  Evidencia [___________]       │
  │ Indicador de éxito [______________________________] │
  │ Observaciones [__________________________________]  │
  └─────────────────────────────────────────────────────┘
20% · ME ACOMPAÑAN … 70% · LO PONGO EN PRÁCTICA …
```

### Paso 9 · Generar

```
Todo listo para generar el plan
Tu plan está 100% completo          Mínimo para generar: 80%
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
 ✓ Tiene diagnóstico de desempeño y potencial
 ✓ Tiene objetivo de desarrollo definido
 ✓ Tiene entre 1 y 3 competencias priorizadas
 ✓ Tiene acciones 10% / 20% / 70% en cada competencia
 ✓ Fechas, responsables e indicadores completos

┌────┐┌────┐┌────┐┌────┐┌────┐
│ 2  ││ 6  ││ 2  ││ 2  ││ 2  │  competencias / acciones / 10 / 20 / 70
└────┘└────┘└────┘└────┘└────┘

        [ GENERAR MI PLAN DE DESARROLLO ]
```

---

## 8. Ficha del plan y descarga

```
Plan individual de desarrollo · versión 1
Juan Pérez            [ ⬇ Descargar PDF ][ Ver documento ][ ✎ Nueva versión ]

┌ Objetivo ─────────────────────┐ ┌ Perfil ──────────┐
│ Prepararse para una posición  │ │ Líder     …      │
│ futura · Gerente Regional     │ │ Ubicación …      │
│ ▓▓▓▓▓▓▓▓▓▓ 100% completo      │ │ Creado por …     │
└───────────────────────────────┘ └──────────────────┘
┌ Diagnóstico (solo roles autorizados) ─────────────────┐
│ Desempeño Alto · Potencial Alto · Aspiración …        │
└───────────────────────────────────────────────────────┘
La ruta de desarrollo → por competencia, 10 / 20 / 70
Cronograma  → línea de tiempo
Versiones   → histórico
```

---

## 9. Estructura del PDF

Documento ejecutivo de 8 a 12 páginas según el número de competencias:

| Página          | Contenido                                                     |
|-----------------|---------------------------------------------------------------|
| Portada         | Logo de la plataforma + logo del cliente, nombre, cargo, fecha |
| 2 · Perfil      | Datos del colaborador, líder, posición objetivo                |
| 3 · Diagnóstico | Desempeño, potencial, aspiración e interpretación 9 Box        |
| 4 · Objetivo    | Objetivo del desarrollo y competencias prioritarias con brecha |
| 5 · Método      | Cómo funciona el 70-20-10 y cuántas acciones tiene el plan     |
| 6 … n           | Una página por competencia con sus acciones 10 / 20 / 70       |
| n+1 · Cronograma| Línea de tiempo de todas las acciones                          |
| n+2 · Indicad.  | Tabla de indicadores + compromisos y firmas                    |
| n+3 · Resumen   | Matriz competencia × etapa y mensaje de cierre                 |

La misma plantilla (`/documento/[id]`) sirve para la vista en pantalla, la
impresión desde el navegador y el render server-side del PDF, de modo que las
tres versiones no puedan desincronizarse.

---

## 10. Histórico

```
Mis planes                                      [ + Nuevo plan ]
🔍 Buscar por persona   [Todos][Borrador][Finalizado][Descargado]

┌──────────────────────────────────────────────────────────────┐
│ JP Juan Pérez      Prepararse para  ▓▓▓▓▓ 100%  01 sept  ✓  │
│    Jefe de Tienda  posición futura   6 acciones   Finalizado │
├──────────────────────────────────────────────────────────────┤
│ LG Laura Gómez     Fortalecer el    ▓▓░░░  52%   01 sept  ⋯  │
│    Analista Op.    desempeño actual  3 acciones   Borrador   │
└──────────────────────────────────────────────────────────────┘
```

Estados: Borrador → Finalizado → Descargado. Reservados para la fase 2:
En ejecución y Completado.

---

## 11. Biblioteca

```
Explora el catálogo de desarrollo
🔍 Buscar por actividad, competencia o palabra clave

Etapa        [Todas][10% Aprendo][20% Me acompañan][70% Práctica]
Orientada a  [Todo][Puesto actual][Posición futura]
Nivel        [Todos][Básico][Intermedio][Avanzado]
Herramienta  [Todas][Formación][Mentoría][Proyectos]…
Competencia  [Todas][Liderazgo][Comunicación]…

Competencias   ←── carrusel ──→
70% Lo pongo en práctica  · 24 actividades   ←── carrusel ──→
20% Me acompañan          · 18 actividades   ←── carrusel ──→
10% Aprendo               · 18 actividades   ←── carrusel ──→
```

---

## 12. Panel del consultor

```
Panel del consultor
[Resumen][Empresas][Competencias][Actividades][Herramientas][Reglas]

RESUMEN      Empresas · Usuarios · Planes generados · Descargas
             Competencias más trabajadas · Actividades más utilizadas
             % de planes orientados a sucesión · Actividad reciente

EMPRESAS     Alta, activación, logo, color, texto de portada del PDF,
             usuarios permitidos, plan comercial, códigos de acceso y
             reglas propias que sobrescriben las globales.

COMPETENCIAS Alta y edición, categoría, definición, comportamiento
             esperado y los cinco niveles de dominio.

ACTIVIDADES  Alta y edición: etapa, herramienta, duración, nivel, tipo de
             desarrollo, indicador y evidencia sugeridos, requisitos de
             desempeño/potencial y las competencias que desarrolla.
             Al guardar ya puede aparecer en las recomendaciones.

REGLAS       Herramientas por tipo de plan (5/8 y 8/8), máximo y mínimo de
             competencias, acciones mínimas por etapa y umbral de
             completitud. Ninguna está escrita en el código.
```

---

## 13. Principios de la interfaz

- **Una decisión por pantalla.** Nunca veinte preguntas a la vez.
- **El usuario siempre sabe dónde está**: paso actual, porcentaje del
  recorrido y qué le falta.
- **Autoguardado en cada decisión**, con aviso visible y la opción de
  «guardar y continuar después».
- **El sistema recomienda, el líder decide**: ninguna regla elimina opciones
  del catálogo; solo cambia el orden y la etiqueta.
- **Microcopy humano**: «¿Quién puede ayudarlo a aprender?» en lugar de
  «seleccione intervención 20 %».
- **Tarjetas y carruseles** para explorar; nunca tablas gigantes.
- **Criterio de éxito**: un líder sin capacitación previa construye un PDI
  completo en 10-15 minutos.
