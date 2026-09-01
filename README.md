# Ruta — plataforma de Planes de Desarrollo Individual

Constructor guiado de Planes de Desarrollo Individual (PDI) bajo metodología
70-20-10, pensado como SaaS B2B multiempresa para Recursos Humanos y Desarrollo
de Talento.

No es una biblioteca de cursos: es un **constructor de rutas de desarrollo**.
Un líder sin conocimientos técnicos recorre un asistente de nueve pasos y
termina con un documento ejecutivo en PDF que explica qué debe hacer la persona,
con quién, cuándo y cómo se medirá el avance.

```
Diagnosticar → Priorizar → Diseñar → Ejecutar → Desarrollar
```

## Puesta en marcha

Requisitos: Node.js 20 o superior y PostgreSQL 14 o superior.

```bash
npm install
cp .env.example .env          # ajusta DATABASE_URL y AUTH_SECRET
npm run db:deploy             # aplica las migraciones
npm run db:seed               # catálogo inicial + empresa de demostración
npm run dev                   # http://localhost:3000
```

`AUTH_SECRET` debe tener al menos 32 caracteres. Genera uno con
`openssl rand -base64 48`.

### Accesos de demostración

Los crea `npm run db:seed` (las contraseñas se configuran en `.env`):

| Rol                       | Correo                         | Contraseña   |
|---------------------------|--------------------------------|--------------|
| Superadministrador        | `admin@plataforma.com`         | `Admin2026!` |
| Administrador de empresa  | `th@empresademo.com`           | `Demo2026!`  |
| Líder                     | `lider@empresademo.com`        | `Demo2026!`  |
| Colaborador (solo lectura)| `colaborador@empresademo.com`  | `Demo2026!`  |

La semilla carga 15 competencias con sus cinco niveles de dominio, 8
herramientas de desarrollo y 60 actividades relacionadas entre sí, más una
empresa de demostración con colaboradores, evaluaciones y un plan finalizado.

## Cómo funciona

### El asistente

Nueve pasos, una decisión por pantalla, autoguardado en cada cambio:

`Persona → Diagnóstico → Objetivo → Competencias → Aprender → Conectar →
Experimentar → Revisar → Generar plan`

Aunque la metodología se llame 70-20-10, la construcción es pedagógica y va de
menor a mayor exposición: primero **10 % Aprendo**, después **20 % Me
acompañan** y por último **70 % Lo pongo en práctica**.

### Diagnóstico de tres ejes

Desempeño + potencial + **aspiración de carrera**. El tercer eje es
deliberado: una persona de alto potencial no necesariamente quiere dirigir, y
eso cambia por completo la ruta. Desempeño y potencial se cruzan además en una
matriz 9 Box con su interpretación.

### Competencias frente a actividades

Son entidades distintas y esa separación es el motor del producto:

- **Competencia** = qué se desarrolla (*Pensamiento estratégico*), con cinco
  niveles de dominio y una brecha explícita (nivel actual → nivel requerido).
- **Actividad** = qué se hace (*participar en el comité comercial durante tres
  meses*), relacionada con **varias** competencias a la vez.

Gracias a esa relación muchos-a-muchos la biblioteca puede crecer hasta cientos
de actividades sin duplicar contenido.

### Reglas configurables, nunca en el código

La regla **5 de 8 / 8 de 8** (cuántas herramientas del catálogo principal puede
combinar un plan según su objetivo), el máximo de competencias por plan, las
acciones mínimas por etapa y el umbral de completitud viven en base de datos.
Se editan en `Administración → Reglas`, con valores globales y sobrescritura
por empresa.

### El recomendador

`Competencia + tipo de desarrollo + desempeño + potencial + aspiración + brecha
→ puntuación de cada actividad`

Es determinista y explicable: cada actividad recomendada muestra por qué lo es.
Nunca elimina opciones del catálogo, solo cambia el orden — *el sistema
recomienda, el líder decide*. La firma de `recommendActivities`
(`src/lib/recommender.ts`) está pensada para que en una fase posterior su
cuerpo delegue en un modelo generativo sin tocar las pantallas que la consumen.

### El documento

Una sola plantilla (`/documento/[id]`) sirve para la vista en pantalla, la
impresión desde el navegador y el render server-side del PDF, de modo que las
tres versiones no puedan desincronizarse. El resultado son 8-12 páginas según
el número de competencias: portada con el logo del cliente, perfil,
diagnóstico, objetivo, explicación del método, una página por competencia,
cronograma, indicadores, compromisos con firmas y resumen final.

## Stack

| Capa           | Tecnología                                              |
|----------------|---------------------------------------------------------|
| Framework      | Next.js 16 (App Router) · React 19 · TypeScript          |
| Estilos        | Tailwind CSS 4 con sistema de diseño propio              |
| Base de datos  | PostgreSQL + Prisma                                      |
| Autenticación  | Sesión JWT firmada (`jose`) en cookie httpOnly + bcrypt  |
| PDF            | Render server-side del HTML con Chromium (playwright-core)|

## Estructura

```
prisma/
  schema.prisma           18 entidades: empresas, catálogo, planes, auditoría
  seed.ts / seed-data.ts  catálogo inicial y empresa de demostración
src/
  app/
    (app)/                aplicación con sesión: dashboard, planes, admin…
    documento/[id]/       documento ejecutivo imprimible
    api/                  route handlers (planes, catálogo, administración)
  components/
    wizard/               los nueve pasos del asistente
    admin/                gestores de contenido y configuración
  lib/
    recommender.ts        motor de recomendación por reglas
    plan-validation.ts    completitud del plan y qué falta
    rules.ts / settings.ts reglas configurables (5/8, máximos, umbrales)
    plans.ts              visibilidad por rol y aislamiento entre empresas
    pdf.ts                render del documento
docs/
  flujo-ux.md             flujo completo y wireframes de todas las pantallas
```

## Modelo multiempresa

Cada empresa es un espacio independiente: los datos de una nunca son visibles
para otra. La frontera se aplica en el servidor, en cada consulta
(`planVisibilityFilter` y `scopeCompany`), no en la interfaz.

El contenido del catálogo admite `companyId = null` (global, administrado por
el consultor) o propio de una empresa, lo que permite personalizaciones sin
duplicar el catálogo base.

### Roles

| Rol                      | Puede                                                     |
|--------------------------|-----------------------------------------------------------|
| Superadministrador       | Empresas, códigos de acceso, catálogo, reglas, estadísticas|
| Administrador de empresa | Usuarios, colaboradores, todos los planes de su empresa    |
| Líder                    | Construir y descargar planes de su equipo                  |
| Colaborador              | Consultar y descargar su propio plan                       |

## Seguridad y privacidad

- Contraseñas con bcrypt (12 rondas); nunca en texto plano.
- Sesión en cookie `httpOnly`, `sameSite=lax`, `secure` en producción.
- Recuperación de contraseña con token de un solo uso, hasheado y con caducidad.
- Limitación de intentos de acceso por IP y correo.
- Todos los endpoints comprueban rol y empresa; el middleware protege las rutas.
- El **diagnóstico** (desempeño, potencial y aspiración) es información
  confidencial: se entrega únicamente a los roles con permiso `diagnostic.read`,
  y el documento oculta la valoración a quien no lo tenga.
- Registro de auditoría de accesos, generación de planes y cambios de contenido.

Antes de un despliegue real: servir siempre sobre HTTPS, sustituir el limitador
de intentos en memoria por un almacén compartido si hay varias instancias, y
conectar un servicio de correo para los enlaces de recuperación (ahora se
registran en el log del servidor).

## Generación de PDF

En local se usa el Chromium que resuelva `playwright-core`; puedes fijar el
binario con `CHROMIUM_EXECUTABLE_PATH`. Si en el entorno de despliegue no hay
navegador disponible, el endpoint responde 503 con un enlace a la vista
imprimible en lugar de fallar en silencio. Para funciones serverless, la vía
habitual es añadir `@sparticuz/chromium` y apuntar `CHROMIUM_EXECUTABLE_PATH` a
su binario.

## Comandos

| Comando              | Qué hace                                      |
|----------------------|-----------------------------------------------|
| `npm run dev`        | Servidor de desarrollo                         |
| `npm run build`      | Genera el cliente de Prisma y compila          |
| `npm run typecheck`  | Comprobación de tipos                          |
| `npm run db:migrate` | Crea y aplica una migración en desarrollo      |
| `npm run db:deploy`  | Aplica migraciones en producción               |
| `npm run db:seed`    | Carga el catálogo y la empresa de demostración |
| `npm run db:reset`   | Reinicia la base de datos y vuelve a sembrar   |

## Estado y siguientes fases

Implementado (MVP completo): acceso y roles, alta de empresas y códigos,
colaboradores, diagnóstico de tres ejes, objetivo puesto actual / posición
futura, regla 5/8 y 8/8, competencias con brecha por niveles, catálogo con
buscador y filtros, constructor 10-20-70, personalización de cada acción,
validación y porcentaje de completitud, generación del PDF, histórico con
versiones y panel de administración de contenido.

La arquitectura queda preparada para lo que viene después: los estados
`En ejecución` y `Completado` ya existen en el modelo para el seguimiento de la
fase 2; el recomendador está aislado tras una función para incorporar IA
generativa en la fase 3; y el registro de auditoría y las agrupaciones del panel
sostienen la analítica de Talento Humano.

---

Documentación previa de otro proyecto alojado en este repositorio:
[`docs/tres-horizontes.html`](docs/tres-horizontes.html).
