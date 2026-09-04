# 12 · Marco legal y cumplimiento

> Responsable: abogado experto en regulación de servicios de salud digital.
>
> ⚠️ **Advertencia necesaria.** Este documento es un mapa de riesgos y un plan de
> trabajo, **no es asesoría legal**. Las referencias normativas deben ser
> verificadas y validadas por un abogado ecuatoriano habilitado antes de operar.
> Se señalan expresamente los puntos que requieren opinión legal formal.

---

## 1. Los tres riesgos que pueden cerrar la empresa

Antes del detalle, las tres cosas que hay que resolver antes de la primera
sesión real:

| Riesgo | Consecuencia | Cuándo resolverlo |
|---|---|---|
| **Tratar datos de salud sin cumplir la LOPDP** | Sanción económica significativa y daño reputacional irreparable | **Antes del piloto** |
| **Que el MSP considere a la plataforma un establecimiento de salud** | Clausura hasta obtener permiso de funcionamiento | **Antes del lanzamiento público** |
| **Un incidente clínico grave sin protocolo ni seguro** | Responsabilidad civil y penal; fin del proyecto | **Antes de la primera sesión** |

Ninguno se resuelve con un texto en la web. Los tres exigen decisiones de
arquitectura, de proceso y de contrato.

---

## 2. Protección de datos personales

### Marco aplicable

La **Ley Orgánica de Protección de Datos Personales (LOPDP)** del Ecuador,
publicada en 2021 y con régimen sancionatorio plenamente exigible desde 2023,
bajo supervisión de la Superintendencia de Protección de Datos Personales.

Los datos de salud, incluida la salud mental, son **datos sensibles** y
soportan el estándar de protección más alto de la ley.

### Obligaciones concretas

| Obligación | Cómo se cumple en Almar |
|---|---|
| **Consentimiento explícito, informado, específico y separado** | Casilla independiente para el tratamiento de datos de salud, distinta de la aceptación de términos. Nunca premarcada, nunca agrupada |
| **Finalidad determinada** | Los datos clínicos se usan solo para prestar atención. Jamás para publicidad, ni siquiera agregados |
| **Minimización** | No se pide cédula salvo para facturar, ni dirección, ni foto, ni datos que no se usen |
| **Derechos ARCO+** | Acceso, rectificación, eliminación, oposición, portabilidad y suspensión, en menos de 15 días, desde el panel del paciente |
| **Seguridad** | Cifrado en tránsito y en reposo; notas clínicas con cifrado a nivel de campo; acceso por rol; registro de auditoría |
| **Registro de actividades de tratamiento** | Documento vivo con finalidad, base legal, categorías, plazos y destinatarios |
| **Evaluación de impacto (EIPD)** | **Obligatoria**: tratamiento a gran escala de datos sensibles. Debe existir antes del lanzamiento |
| **Delegado de Protección de Datos (DPO)** | **Obligatorio** por tratamiento de datos sensibles a gran escala. Puede ser externo en el año 1 |
| **Notificación de brechas** | Procedimiento escrito para notificar a la autoridad y a los afectados en el plazo legal |
| **Transferencias internacionales** | Los proveedores fuera de Ecuador (video, alojamiento, mensajería) exigen garantías contractuales y cláusulas de transferencia |
| **Encargados del tratamiento** | Contrato de encargo con cada proveedor: alojamiento, video, pasarela, mensajería |

### Decisiones de arquitectura que son cumplimiento, no diseño

1. **Las sesiones no se graban y la función no existe.** Elimina de raíz la
   categoría de riesgo más grave.
2. **Sin píxeles publicitarios en rutas clínicas.** Enviar a Meta el evento de
   que alguien seleccionó «depresión» es una cesión de datos sensibles a un
   tercero sin base legal.
3. **Los eventos de conversión no llevan contenido.** «Compra completada» con
   valor; nunca el motivo de consulta.
4. **Analítica sin datos de salud.** Plausible o Matomo autoalojado, jamás
   Google Analytics en rutas clínicas.
5. **Notas clínicas separadas de los datos de facturación**, con claves y
   permisos distintos.
6. **Registro de auditoría de todo acceso a datos clínicos**: quién, cuándo,
   qué registro.
7. **Plazos de conservación definidos por tipo de dato**, con purga automática.

### Relación entre responsable y encargado

Es un punto que suele resolverse mal y tiene consecuencias directas.

- **El psicólogo es responsable del tratamiento de los datos clínicos**: decide
  qué registra y con qué finalidad clínica.
- **La plataforma es responsable de los datos de cuenta, agenda y pago**, y
  **encargada** respecto de los datos clínicos que aloja por cuenta del
  profesional.
- Ambos roles deben constar en el contrato con el profesional, con un anexo de
  tratamiento de datos, y explicarse al paciente en lenguaje llano.

> ⚠️ **Requiere opinión legal formal.** Esta distribución es la más defendible,
> pero la calificación exacta bajo la LOPDP debe confirmarse. De ella dependen
> las obligaciones de notificación y la responsabilidad ante una brecha.

### Derecho de eliminación y la historia clínica

La historia clínica tiene régimen sanitario propio y plazos de conservación
obligatorios. **Una solicitud de eliminación no puede borrarla automáticamente.**
El procedimiento: se eliminan los datos de cuenta, marketing y contacto; la
historia clínica se conserva bajo el plazo legal, con acceso bloqueado, y se le
explica al paciente por qué. Cualquier otra conducta expone a la empresa por dos
lados a la vez.

---

## 3. Regulación sanitaria y telesalud

### Situación normativa

Ecuador cuenta con normativa de telemedicina emitida por el Ministerio de Salud
Pública, desarrollada especialmente a partir de 2020. Regula la atención a
distancia, el consentimiento, el registro de la atención y los requisitos de los
profesionales.

> ⚠️ **Verificar la normativa vigente y sus reformas con un abogado sanitario
> antes de operar.** Es el punto de mayor incertidumbre regulatoria del proyecto.

### Habilitación profesional

**No negociable:** todo psicólogo debe tener título de tercer nivel en
**Psicología Clínica**, registro en **SENESCYT** y registro vigente como
profesional de la salud en el **MSP**.

- El psicólogo general, educativo, organizacional o industrial **no es
  profesional de la salud** y no puede prestar atención clínica.
- La verificación se documenta con fecha, fuente y responsable, y se revalida
  anualmente.
- Un profesional sin registro vigente se suspende de inmediato.

Este es el requisito que más presión recibirá cuando falten psicólogos para
cubrir la agenda. **No admite excepción**: sostiene simultáneamente la
legalidad, el seguro y la confianza de marca.

### Naturaleza jurídica de la plataforma

La posición que se adopta:

> Almar es una **plataforma tecnológica de intermediación y gestión de pagos**
> que conecta pacientes con profesionales de la salud independientes. No presta
> servicios de salud, no emplea a los profesionales y no interviene en el
> criterio clínico.

Consecuencias que deben ser coherentes en toda la operación:

- El **profesional** emite la factura del acto clínico al paciente; la
  plataforma cobra por cuenta de él como recaudador.
- La **plataforma** factura al profesional su comisión de intermediación.
- El consentimiento informado se establece **entre paciente y profesional**; la
  plataforma lo facilita y lo custodia.
- La responsabilidad clínica es del profesional, y así consta en los términos y
  en el contrato.

> ⚠️ **Riesgo relevante:** el MSP podría considerar que la plataforma opera como
> establecimiento de salud y exigir permiso de funcionamiento. La mitigación es
> obtener una **opinión legal formal antes del lanzamiento público** y, si el
> riesgo es material, iniciar el trámite de forma preventiva. Descubrirlo por una
> notificación de la autoridad es el peor escenario posible.

---

## 4. Consentimiento informado

Documento propio, aceptado antes de la primera sesión, **separado de los
términos y condiciones**, escrito en lenguaje llano.

### Contenido mínimo

1. **Quién presta el servicio:** el psicólogo, con nombre, credencial y número de
   registro. Almar es la plataforma.
2. **En qué consiste:** psicoterapia por videollamada, 45 minutos, modelo breve
   orientado a objetivos.
3. **Qué no es:** no es atención de emergencia, no incluye prescripción de
   medicamentos, no emite peritajes ni certificados judiciales.
4. **Beneficios esperados y sus límites:** la terapia tiene evidencia de eficacia;
   **no se garantiza resultado**.
5. **Riesgos:** malestar emocional al abordar temas difíciles; posibles fallos
   técnicos; limitaciones del formato a distancia.
6. **Confidencialidad y sus excepciones**, enunciadas de forma explícita:
   - Riesgo grave e inminente para la vida propia o de terceros.
   - Sospecha de maltrato a niñas, niños, adolescentes o personas vulnerables.
   - Requerimiento de autoridad judicial competente.
7. **Manejo de datos:** qué se registra, quién accede, cuánto se conserva, cómo
   ejercer los derechos.
8. **No grabación:** las sesiones no se graban por ninguna de las partes. Que el
   paciente grabe sin autorización también es una vulneración y así se advierte.
9. **Contacto de emergencia:** obligatorio, con explicación de que solo se usará
   ante riesgo vital.
10. **Cancelación, reembolso y cambio de profesional.**
11. **Qué hacer en una crisis:** ECU 911 y líneas de ayuda, con instrucción
    expresa de no usar la plataforma como vía de emergencia.
12. **Derecho a interrumpir el proceso en cualquier momento.**

### Requisitos de forma

- Aceptación explícita registrada con fecha, hora y versión del documento.
- Copia disponible siempre en el panel del paciente.
- Si el documento cambia, se solicita **nueva aceptación**; no se aplica
  retroactivamente.
- **Menores de edad:** fuera del alcance de la fase 1. Su incorporación exige
  consentimiento del representante legal, asentimiento del menor, protocolo
  específico y revisión bajo el Código de la Niñez y Adolescencia.

---

## 5. Confidencialidad y secreto profesional

El secreto profesional del psicólogo está protegido por la normativa sanitaria y
por los códigos deontológicos de la profesión. La plataforma debe reforzarlo,
nunca debilitarlo.

| Medida | Implementación |
|---|---|
| Acceso mínimo necesario | Solo el psicólogo tratante ve las notas de sus pacientes |
| Acceso de coordinación clínica | Únicamente ante incidente documentado, con registro de auditoría y notificación al profesional |
| Acuerdos de confidencialidad | Firmados por todo el equipo, incluidos proveedores externos |
| Sin grabación | La función no existe en el producto |
| Sin acceso del personal técnico | Los desarrolladores no acceden a datos clínicos de producción; los entornos de prueba usan datos sintéticos |
| Comunicaciones neutras | Ningún mensaje revela contenido clínico ni el motivo de consulta |
| Reporte a instituciones B2B | Solo agregado, anónimo y con un mínimo de 50 personas por corte |

> **La regla del mínimo de 50 personas** es lo que impide que una empresa
> pequeña deduzca quién usó el servicio. Sin ella, un reporte «agregado» de una
> empresa de 12 empleados es una identificación encubierta.

---

## 6. Responsabilidad profesional

| Aspecto | Titularidad |
|---|---|
| Criterio y acto clínico | **Del profesional** |
| Diagnóstico y plan terapéutico | **Del profesional** |
| Cumplimiento del protocolo de riesgo | **Del profesional**, con supervisión de la plataforma |
| Verificación de credenciales | **De la plataforma** |
| Seguridad e integridad de los datos | **De la plataforma** |
| Disponibilidad del servicio técnico | **De la plataforma** |
| Cobro y liquidación | **De la plataforma** |

**Cobertura:**

- Recomendación de seguro de responsabilidad civil profesional a cada psicólogo,
  y **póliza colectiva contratada por la plataforma desde el mes 6**.
- Seguro de responsabilidad civil general y de ciberseguridad para la compañía.
- Reserva de contingencia legal en el presupuesto.

**Gestión de incidentes:**

1. Registro inmediato de todo evento adverso.
2. Comité clínico en menos de 24 horas.
3. Suspensión preventiva del profesional mientras se investiga, si corresponde.
4. Comunicación con el paciente o su familia, coordinada con asesoría legal.
5. Reporte a la autoridad y al colegio profesional cuando la norma lo exija.
6. Revisión del protocolo y ajuste documentado.

---

## 7. Contratos y documentos necesarios

| Documento | Función | Prioridad |
|---|---|---|
| **Contrato de prestación de servicios profesionales** (psicólogo) | Relación con la oferta; ver [documento 09](09-reclutamiento-de-psicologos.md) | Crítica |
| **Anexo de tratamiento de datos** (psicólogo) | Roles bajo la LOPDP | Crítica |
| **Términos y condiciones** (paciente) | Reglas del servicio | Crítica |
| **Política de privacidad** | Cumplimiento LOPDP | Crítica |
| **Consentimiento informado** | Requisito sanitario y ético | Crítica |
| **Política de cookies** | Cumplimiento | Alta |
| **Registro de actividades de tratamiento** | Exigible por la autoridad | Alta |
| **Evaluación de impacto (EIPD)** | Obligatoria por datos sensibles | Alta |
| Contratos de encargo con proveedores | Alojamiento, video, pasarela, mensajería | Alta |
| **Protocolo de riesgo suicida** | Seguridad clínica | Crítica |
| **Protocolo de brechas de seguridad** | Cumplimiento y respuesta | Alta |
| Convenio marco B2B | Clientes institucionales | Media (mes 7) |
| Acuerdos de confidencialidad | Equipo y proveedores | Alta |
| Consentimiento para testimonios | Uso de imagen y relato | Media |

---

## 8. Términos y condiciones: contenido esencial

1. **Naturaleza del servicio:** plataforma de intermediación; el acto clínico es
   del profesional.
2. **Requisitos:** mayoría de edad; residencia en país cubierto.
3. **Precio y pago:** valores, pago previo, sin renovación automática silenciosa.
4. **Cancelación y reembolso:** política del [documento 04](04-modelo-operativo.md).
5. **Cambio de profesional:** sin costo, hasta dos veces.
6. **Uso adecuado:** prohibición de grabar, hostigar o suplantar identidad.
7. **Exclusiones:** no es servicio de emergencia; casos que no se atienden y a
   dónde se deriva.
8. **Limitación de responsabilidad:** de la plataforma respecto del acto clínico,
   sin excluir la responsabilidad que la ley no permite excluir.
9. **Propiedad intelectual.**
10. **Modificaciones:** notificación previa y aceptación de cambios sustanciales.
11. **Ley aplicable y jurisdicción:** Ecuador.
12. **Resolución de conflictos:** canal interno de reclamos antes de la vía
    judicial.

> **Ley Orgánica de Defensa del Consumidor:** exige información clara, veraz y
> completa antes de la contratación, y prohíbe cláusulas abusivas. En la
> práctica: el precio total visible antes del pago, sin cargos ocultos, sin
> renovación automática no consentida, y una política de reembolso comprensible.

---

## 9. Aspectos tributarios y societarios

| Tema | Tratamiento propuesto | Verificar |
|---|---|---|
| Forma societaria | **SAS** (Sociedad por Acciones Simplificada): rápida, económica y flexible para entrada de inversionistas | — |
| Facturación del acto clínico | La emite el **profesional** al paciente; servicios de salud con tratamiento preferente en IVA | ⚠️ **Confirmar el tratamiento exacto en IVA** |
| Facturación de la comisión | La plataforma factura al profesional; **intermediación gravada con IVA 15 %** | ⚠️ **Confirmar** |
| Régimen del profesional | RIMPE Emprendedor o régimen general, según sus ingresos | Informar, no asesorar |
| Retenciones | Aplicables según el régimen de cada profesional | ⚠️ Confirmar |
| Facturación electrónica | Obligatoria; integrar desde el inicio | — |
| Impuesto a la renta | Régimen general; posibles incentivos para nuevas sociedades | ⚠️ Verificar |

> ⚠️ **Este es el punto de mayor impacto financiero no resuelto.** Si la
> autoridad tributaria considerase que la plataforma debe facturar el servicio
> completo al paciente en lugar de solo la comisión, el tratamiento del IVA
> cambia por completo y el modelo financiero se altera de forma sustancial. **Hay
> que resolverlo con un asesor tributario antes de emitir la primera factura**,
> no después.

---

## 10. Publicidad y comunicación

| Norma | Implicación |
|---|---|
| Ley de Defensa del Consumidor | Prohibida la publicidad engañosa: nada de «curamos», «garantizado», «resultados en X sesiones» |
| Normativa sanitaria de publicidad | Restricciones a la promoción de servicios de salud; no simular respaldo oficial |
| Políticas de Meta y Google | No atribuir condiciones de salud al lector; no segmentar por condición inferida |
| Uso de testimonios | Consentimiento escrito, específico y revocable; sin edición que altere el sentido |
| Comunicación sobre suicidio | Guías de la OMS: sin describir métodos, incluyendo siempre líneas de ayuda |

**Reglas propias más estrictas que la norma:** no se usa escasez artificial, no
se hace retargeting aludiendo al malestar de la persona, y no se convierte
ninguna efeméride de salud mental en promoción de precio.

---

## 11. Plan de cumplimiento

| Fase | Acciones | Responsable | Plazo |
|---|---|---|---|
| **Previa al piloto** | Constitución de la SAS · opinión legal sobre naturaleza jurídica y tributaria · T&C, privacidad y consentimiento · contrato con psicólogos · protocolo de riesgo · designación de DPO | Abogado + CEO | Días 1–30 |
| **Previa al lanzamiento** | EIPD · registro de actividades de tratamiento · contratos de encargo · protocolo de brechas · seguros | DPO + CEO | Días 31–60 |
| **Operación** | Verificación de credenciales · auditorías trimestrales · registro de incidentes · atención de derechos ARCO+ | Coordinación clínica + DPO | Continuo |
| **Trimestral** | Revisión normativa · actualización de documentos · formación del equipo | Abogado externo | Cada 3 meses |
| **Previa a la expansión** | Análisis regulatorio de Colombia y Perú · homologación de credenciales · adaptación contractual | Abogado local | 6 meses antes |

**Presupuesto legal del año 1: USD 5.600**, con USD 1.200 concentrados en el mes
1 (constitución y documentación fundacional).

---

## 12. Expansión regional: lo que cambia

| País | Regulación de datos | Habilitación profesional | Complejidad |
|---|---|---|---|
| **Ecuador** | LOPDP | SENESCYT + MSP | Base |
| **Colombia** | Ley 1581 de 2012, con registro de bases de datos ante la SIC | Tarjeta profesional (Colegio Colombiano de Psicólogos) + ReTHUS. Ley 1090 de 2006 de ejercicio profesional | **Media-alta** |
| **Perú** | Ley 29733 de Protección de Datos Personales | Colegio de Psicólogos del Perú + RNP | Media |

**Tres cosas no son portables entre países** y hay que rehacerlas en cada uno:
la habilitación profesional, la relación con el regulador sanitario y la
pasarela de pago. La marca, el producto y el modelo sí lo son.

> **Regla de expansión:** no se abre un país sin opinión legal local previa y sin
> un responsable de cumplimiento en ese país. Un incidente regulatorio en un
> mercado nuevo contamina la operación entera.
