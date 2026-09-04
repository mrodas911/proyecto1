# Almar — plataforma de terapia psicológica online para Latinoamérica

> **Hablar ayuda.**
> Terapia psicológica profesional, confidencial y accesible desde donde estés.

Diseño completo de una startup de salud mental digital: marketplace que conecta
pacientes con psicólogos clínicos titulados, con sesiones por videollamada,
pago previo en línea y agenda automatizada. Arranque en **Ecuador**, expansión a
**Colombia y Perú**.

---

## Índice del proyecto

| # | Documento | Contenido |
|---|-----------|-----------|
| 00 | **Este archivo** | Resumen ejecutivo, hallazgo crítico y decisiones de partida |
| 01 | [Marca y branding](01-marca-y-branding.md) | 20 nombres, evaluación, identidad verbal y visual, tono |
| 02 | [Análisis de mercado](02-analisis-de-mercado.md) | Problema, demanda, segmentos, barreras, competencia |
| 03 | [Modelo de negocio (Canvas)](03-modelo-de-negocio-canvas.md) | Los nueve bloques, con supuestos y riesgos |
| 04 | [Modelo operativo](04-modelo-operativo.md) | Flujo paciente, flujo psicólogo, protocolo clínico y de crisis |
| 05 | [Arquitectura web y producto](05-arquitectura-web-y-producto.md) | Mapa del sitio, copys de la landing, stack técnico |
| 06 | [Experiencia de usuario](06-experiencia-de-usuario.md) | Flujo de 3 minutos, pantallas, microcopy, mensajería |
| 07 | [Marketing digital](07-marketing-digital.md) | 4 campañas Meta, Google, TikTok, presupuesto y reglas de corte |
| 08 | [Contenido para redes](08-contenido-redes-sociales.md) | 30 publicaciones y calendario mensual |
| 09 | [Reclutamiento de psicólogos](09-reclutamiento-de-psicologos.md) | Perfil, convocatoria, filtros, contrato, evaluación |
| 10 | [Modelo financiero](10-modelo-financiero.md) | Año 1 mes a mes, unit economics, sensibilidad, 3 años |
| 11 | [KPIs](11-kpis.md) | Métricas de marketing, operación, clínica y negocio |
| 12 | [Marco legal](12-marco-legal.md) | LOPDP, telesalud, consentimiento, contratos, T&C |
| 13 | [Escalabilidad](13-escalabilidad.md) | Fases geográficas y nuevas líneas de ingreso |
| 14 | [Plan de lanzamiento 90 días](14-plan-de-lanzamiento-90-dias.md) | Construcción, piloto, escalamiento |
| 15 | [Presentación a inversores](15-presentacion-inversores.md) | 14 diapositivas listas para armar |

**Modelo financiero ejecutable:** [`financiero/modelo.py`](financiero/modelo.py)
→ `python3 financiero/modelo.py` regenera todas las cifras de este proyecto y los
CSV [`escenario-base.csv`](financiero/escenario-base.csv) y
[`escenario-sostenible.csv`](financiero/escenario-sostenible.csv).

**Prototipo de landing:** [`web/landing.html`](web/landing.html) — abrir en el navegador.

---

## Resumen ejecutivo

**El problema.** En Ecuador hay aproximadamente **3 psicólogos clínicos por cada
100.000 habitantes** en el sistema público y la consulta privada cuesta entre
**USD 25 y 60 por sesión**, cuando el salario básico unificado ronda los USD 470.
Una terapia de 12 sesiones equivale a entre el 60 % y el 150 % de un salario
mensual. El resultado es una brecha de tratamiento estimada por la OPS en más
del **75 %**: tres de cada cuatro personas con un trastorno mental diagnosticable
nunca reciben atención.

**La solución.** Un marketplace vertical que baja el precio de entrada a
**USD 7,50 la primera sesión** y **USD 10 las siguientes**, con psicólogos
clínicos verificados, videollamada integrada, pago previo y recordatorios
automáticos. El paciente pasa del anuncio a la sesión agendada en menos de tres
minutos.

**El modelo.** Comisión del 25 % sobre cada sesión; el 75 % va al psicólogo.
La plataforma aporta demanda, tecnología, cobranza, agenda y marca; el
profesional aporta el acto clínico.

**El resultado.** Con el precio del brief, el año 1 cierra con
**15.560 sesiones, USD 157.947 de GMV** y un **EBITDA de −USD 55.300**
(escenario sostenible). El punto de equilibrio operativo se alcanza en el
**año 3**, con USD 2,5 M de GMV y **+USD 101.000 de EBITDA**, tras un consumo
de caja acumulado cercano a **USD 95.000**.

**La inversión.** Ronda pre-semilla de **USD 180.000** para 24 meses de pista.

---

## Hallazgo crítico: la aritmética del ticket de USD 10

Antes de entrar en el detalle conviene poner sobre la mesa el número que
condiciona todo el proyecto, porque ningún plan de marketing lo puede compensar.

De cada sesión de USD 10, la plataforma no se queda con USD 2,50. Se queda con
esto:

| Concepto | Monto |
|---|---:|
| Precio pagado por el paciente | $10,00 |
| − Pago al psicólogo (75 %) | −$7,50 |
| = Comisión bruta | **$2,50** |
| − IVA sobre la comisión de intermediación (15 %) | −$0,33 |
| − Pasarela de pago (≈4,5 % + $0,15) | −$0,60 |
| − Video, notificaciones y almacenamiento | −$0,25 |
| **= Margen de contribución real** | **$1,32** |

**La plataforma se queda con el 13 % del ticket, no con el 25 %.**

Y en la primera sesión de USD 7,50 la contribución cae a **$0,89**.

Consecuencia directa: con una media de 2,3 sesiones por paciente —lo que la
literatura de terapia online de bajo costo sugiere como base realista— el
**LTV de contribución por paciente es de USD 2,63**. Cualquier CAC pagado en
Meta Ads en Ecuador para un servicio de salud se sitúa entre **USD 6 y 12**.

> **LTV/CAC = 0,26 a 0,44.** Se pierde dinero en cada paciente adquirido con
> publicidad, y se pierde más cuanto más se invierte.

La tabla de sensibilidad completa está en el [documento 10](10-modelo-financiero.md).
Su lectura resumida:

| Precio sesión | Sesiones/paciente | LTV contribución | LTV/CAC a $7 |
|---:|---:|---:|---:|
| $10 | 2,3 | $2,63 | 0,38 ❌ |
| $10 | 4,5 | $5,57 | 0,80 ❌ |
| $10 | 6,0 | $7,58 | 1,08 ⚠️ |
| $12 | 4,5 | $6,75 | 0,96 ⚠️ |
| $15 | 4,5 | $8,51 | **1,22** ⚠️ |
| $15 | 6,0 | $11,78 | **1,68** ✅ |

### Las cuatro correcciones que hacen viable el modelo

Ninguna exige abandonar la promesa de accesibilidad. Todas están incorporadas
al escenario sostenible y al resto del plan.

1. **Retención, no adquisición, es el motor.** Pasar de 2,3 a 5 sesiones por
   paciente multiplica el LTV por 2,5 sin gastar un dólar más en anuncios. Se
   consigue con plan terapéutico explícito de 6 sesiones, bonos prepagados,
   recordatorios y un coordinador clínico que persigue la deserción. Este es el
   KPI número uno de la compañía.

2. **Los USD 10 son una tarifa de lanzamiento, no la tarifa permanente.** Se
   sostiene durante los primeros 90 días y los primeros 1.000 pacientes como
   inversión en tracción. A partir del mes 7 la tarifa estándar sube a
   **USD 12** y en el año 2 a **USD 14–15**, manteniendo la primera sesión en
   USD 7,50. A USD 15 el servicio sigue siendo **50–70 % más barato que la
   consulta privada** en Ecuador: la promesa de accesibilidad se cumple igual.

3. **Bonos y suscripción en lugar de sesión suelta.** Un bono de 4 sesiones
   cobra una sola vez la tarifa fija de pasarela, asegura el ingreso por
   adelantado y sube la retención por compromiso. Objetivo: **65 % de las
   sesiones recurrentes vendidas en bono** hacia el mes 12.

4. **La publicidad no puede ser el canal principal.** Con este ticket, el
   negocio se sostiene sobre canales de CAC casi nulo: **convenios B2B**
   (empresas, universidades, aseguradoras, cooperativas), **referidos** y
   **contenido orgánico**. Meta Ads sirve para arrancar y para llenar huecos de
   agenda, con un techo de CAC duro de USD 5 y regla de corte automática.

Con estas cuatro correcciones el escenario sostenible reduce la pérdida del año 1
de **−USD 89.631 a −USD 55.300** y llega al mes 12 casi en equilibrio
(−USD 1.577 mensuales), frente a los −USD 8.864 mensuales del escenario base.

---

## Decisiones de partida asumidas

Estas decisiones se tomaron para poder cerrar el diseño; cada una es reversible
y está señalada donde corresponde.

| Decisión | Criterio |
|---|---|
| **Nombre: Almar** | *Alma* + *mar*. Corto, pronunciable en toda LatAm, evoca profundidad y calma sin sonar clínico ni barato. Requiere búsqueda de antecedentes en SENADI antes de registrarlo. Alternativas en el [documento 01](01-marca-y-branding.md). |
| **El 75/25 se aplica siempre**, también sobre la primera sesión | Una sola regla, fácil de comunicar y de defender ante el psicólogo: *«siempre recibes el 75 % de lo que paga el paciente»*. En la primera sesión el profesional cobra $5,63 y la plataforma $1,88. |
| **Sesión de 45 minutos** | A $7,50 netos por sesión, 50–60 minutos hacen inviable la economía del psicólogo. 45 minutos es un estándar clínico aceptado y permite 8 sesiones diarias con descanso. |
| **Solo psicólogos clínicos con registro MSP/SENESCYT** | Es la línea que separa un marketplace de salud de un directorio de coaches. No negociable: es el activo de confianza y la cobertura legal. |
| **Casos excluidos derivados, no atendidos** | Riesgo suicida inminente, psicosis activa, dependencia severa y violencia en curso salen del embudo hacia servicios presenciales y ECU 911. Ver [documento 04](04-modelo-operativo.md). |
| **IVA 15 % sobre la comisión** | El acto clínico del profesional de la salud está exento; la intermediación tecnológica no. Confirmar con asesor tributario antes de facturar. |

---

## Advertencia sobre los datos

Las cifras de mercado (brecha de tratamiento, densidad de profesionales, precios
de consulta privada, prevalencia) provienen de rangos publicados por OPS/OMS,
INEC y del conocimiento del sector, y se presentan como **órdenes de magnitud
para dimensionar decisiones, no como fuentes citables**. Antes de usarlas en un
memorándum de inversión deben verificarse contra las publicaciones vigentes de
la OPS, el INEC y el MSP. Lo mismo aplica a las referencias normativas del
[documento 12](12-marco-legal.md), que requieren validación de un abogado
ecuatoriano habilitado.

Los supuestos operativos y financieros son propios y están explicitados en cada
documento para que puedan discutirse uno por uno.
