# 07 · Estrategia de marketing digital

> Responsable: experto en marketing digital y performance ads.

---

## Advertencia previa: el techo de CAC

Del [documento 10](10-modelo-financiero.md): la contribución por paciente en el
año 1 es de **USD 3 a 5**. Todo lo que sigue está subordinado a una única regla:

> **Techo duro de CAC: USD 5,00.** Si el CAC blended de un mes supera esa cifra,
> se recorta presupuesto de medios hasta volver por debajo. Sin excepciones,
> aunque el volumen caiga.

Y a una consecuencia estratégica:

> **La publicidad pagada no es el motor de crecimiento de Almar.** Es el
> encendido. El motor son la retención, los referidos y los convenios B2B, que
> tienen CAC casi cero. Las campañas de este documento sirven para arrancar,
> para probar mensajes y para llenar huecos de agenda; no para escalar
> indefinidamente.

---

## Cumplimiento publicitario: el error que cierra la cuenta

**Meta prohíbe los anuncios que dan a entender que conocen un atributo personal
del usuario**, incluida su condición de salud, física o mental. La política de
atributos personales no admite matices, y su incumplimiento cuesta rechazo de
anuncio y, con reincidencia, bloqueo de la cuenta publicitaria.

Esto invalida de entrada los tres encabezados más obvios para este negocio:

| ❌ Prohibido | Por qué | ✅ Alternativa conforme |
|---|---|---|
| «¿Sufres de ansiedad?» | Atribuye condición de salud | «Hablar de la ansiedad ayuda más de lo que crees» |
| «¿Te sientes deprimido?» | Atribuye estado emocional | «Cuando la tristeza dura demasiado, hay quien puede ayudar» |
| «Supera tu depresión» | Atribuye y promete resultado | «Terapia psicológica profesional desde $7,50» |
| «Tu ansiedad tiene solución» | Atribuye y promete | «La terapia funciona. Y ahora está a tu alcance» |
| «Deja de sufrir» | Atribuye sufrimiento | «Empieza por una conversación» |

**La regla operativa es simple:** hablar del **servicio** y del **tema en
tercera persona**, nunca del **estado del lector**. «La ansiedad se trata», no
«tu ansiedad».

Cuatro reglas adicionales de cumplimiento:

1. **No segmentar por intereses relacionados con salud mental** aunque la
   plataforma lo permita. Además del riesgo de política, es éticamente
   indefendible en este rubro. Se segmenta por comportamiento, contexto de vida
   y audiencias similares.
2. **No hacer retargeting a quien abandonó el embudo con mensajes que aludan a
   su malestar.** El retargeting se limita a recordatorios neutros de la oferta.
3. **No usar el píxel en rutas clínicas.** Solo en portada y landings; los
   eventos de conversión no llevan contenido (ver
   [documento 05](05-arquitectura-web-y-producto.md)).
4. **Verificar el dominio y configurar eventos agregados** desde el día 1, y
   activar la API de conversiones del lado del servidor, con datos mínimos.

---

## Estructura de cuenta

```
CAMPAÑA (objetivo: conversiones · evento: Compra)
├── Conjunto de anuncios = una audiencia
│   └── 3–4 anuncios = variaciones creativas
```

- **Un evento de conversión: `Compra`.** No se optimiza a lead ni a clic. Con
  presupuestos pequeños, optimizar a una métrica intermedia entrena mal el
  algoritmo y compra tráfico que no paga.
- **Presupuesto a nivel de campaña (Advantage+ CBO)** para dejar que la
  plataforma reasigne entre audiencias.
- **Ventana de atribución: 7 días clic, 1 día visualización.**
- Fase de aprendizaje: se necesitan ~50 conversiones por conjunto por semana.
  Con CPA de $7, eso son $350 semanales por conjunto: **no más de 2 conjuntos
  activos por campaña en el mes 1**. Fragmentar el presupuesto es el error más
  común y el más caro.

---

## Presupuesto de medios, año 1

Alineado con el escenario sostenible del [documento 10](10-modelo-financiero.md).

| Mes | Medios | No-medios | Total | Pacientes | CAC objetivo | Fase |
|---:|---:|---:|---:|---:|---:|---|
| 1 | $900 | $300 | $1.200 | 100 | $9,00 | Aprendizaje |
| 2 | $1.152 | $300 | $1.452 | 144 | $8,00 | Aprendizaje |
| 3 | $1.365 | $300 | $1.665 | 195 | $7,00 | Optimización |
| 4 | $1.500 | $300 | $1.800 | 250 | $6,00 | Optimización |
| 5 | $1.694 | $300 | $1.994 | 308 | $5,50 | Escalado |
| 6 | $1.900 | $300 | $2.200 | 380 | $5,00 | Escalado |
| 7 | $1.989 | $500 | $2.489 | 442 | $4,50 | Escalado |
| 8 | $2.083 | $500 | $2.583 | 496 | $4,20 | Diversificación |
| 9 | $2.264 | $500 | $2.764 | 566 | $4,00 | Diversificación |
| 10 | $2.360 | $500 | $2.860 | 621 | $3,80 | Diversificación |
| 11 | $2.480 | $500 | $2.980 | 689 | $3,60 | Eficiencia |
| 12 | $2.625 | $500 | $3.125 | 750 | $3,50 | Eficiencia |
| **Total** | **$22.312** | **$4.800** | **$27.112** | **4.941** | **$5,49** | |

«No-medios» cubre producción de contenido, diseño, edición de video, licencias
y herramientas.

La caída del CAC de $9 a $3,50 **no viene de mejores anuncios**: viene del
cambio de mezcla de canales. En el mes 12, solo el 45 % de los pacientes llega
por medios pagados.

### Mezcla de canales por mes

| Canal | Mes 1 | Mes 6 | Mes 12 |
|---|---:|---:|---:|
| Meta Ads | 80 % | 55 % | 40 % |
| Google Search | 20 % | 20 % | 15 % |
| Orgánico (TikTok, IG, SEO) | 0 % | 15 % | 20 % |
| Referidos | 0 % | 10 % | 15 % |
| Convenios B2B | 0 % | 0 % | 10 % |

---

## Las cuatro campañas de Meta

### Campaña 1 · «Ansiedad y estrés»

**Objetivo:** conversiones (Compra) · **Presupuesto inicial:** $20/día
· **Peso:** 35 % del gasto de medios

**Público:**
- Ecuador · Quito, Guayaquil, Cuenca, Ambato, Manta, Loja
- 24–42 años · todos los géneros, con conjunto separado para mujeres (que
  convierten mejor en este eje)
- Ubicaciones: Reels, Stories, Feed, Explorar
- **Segmentación:** sin intereses de salud. Advantage+ público con
  señal amplia; a partir del mes 2, **audiencias similares al 1 % de
  compradores**

| Conjunto | Definición | % presupuesto |
|---|---|---:|
| A · Amplio | 24–42, sin intereses | 50 % |
| B · Contexto laboral | intereses de productividad, trabajo remoto, desarrollo profesional | 25 % |
| C · Similar 1 % | a partir de 100 compradores | 25 % desde el mes 2 |

**Copy A — el que mejor funciona en pruebas de esta categoría:**

> Dormir mal. Despertarte con el pecho apretado. Sentir que todo te queda
> grande.
>
> No tiene que ser así siempre.
>
> Habla con un psicólogo clínico titulado por videollamada. Tu primera sesión
> cuesta $7,50.
>
> Sin consultorio, sin traslados, sin esperas de meses.
>
> 👉 almar.ec

**Copy B — corto, para Reels:**

> Terapia psicológica de verdad, desde $7,50.
> Psicólogos clínicos con título verificado.
> 45 minutos por videollamada, desde donde estés.

**Copy C — orientado a la objeción del precio:**

> ¿Por qué $7,50 y no $40?
>
> Porque no pagamos consultorio ni secretaria. De cada sesión, el 75 % es para
> tu psicólogo.
>
> Mismos profesionales. Mismo título. Distinta estructura.

**Creativos:**

| # | Formato | Descripción |
|---|---|---|
| 1 | Reel 9:16, 15 s | Persona real hablando a cámara: «Llevaba dos años diciendo que iba a ir al psicólogo. Lo que me frenaba era el precio.» Subtítulos grandes. |
| 2 | Reel 9:16, 20 s | Psicóloga de la plataforma presentándose: quién es, dónde estudió, cómo trabaja. **Prueba de credenciales en video.** |
| 3 | Imagen estática | Fondo crema, tipografía serif grande: «Hablar ayuda.» + «Primera sesión $7,50» |
| 4 | Carrusel 4 tarjetas | Cómo funciona, paso a paso |

**Regla creativa:** el 70 % del presupuesto va a **video vertical con personas
reales hablando a cámara**. En salud mental, la cara y la voz superan a
cualquier diseño gráfico. Nada de banco de imágenes.

**CTA:** «Más información» (rinde mejor que «Comprar» en salud) → landing
`/ansiedad`

**Métricas objetivo:** CTR ≥ 1,2 % · CPC ≤ $0,25 · CPA ≤ $7 · frecuencia ≤ 2,5

---

### Campaña 2 · «¿Necesitas hablar con alguien?»

**Enfoque emocional, parte alta del embudo.** Es la campaña que abre mercado
entre quienes aún no se identifican con «necesito terapia».

**Objetivo:** conversiones · **Presupuesto:** $12/día · **Peso:** 20 %

**Público:** 22–45 años, amplio, todo Ecuador urbano. Conjunto separado de
**retargeting**: visitantes de 30 días que no compraron, y quienes vieron el
75 % de un video.

**Copy A:**
> Hay cosas que no se le cuentan a la familia. Ni a los amigos. Ni a la pareja.
>
> Para eso existen los psicólogos.
>
> 45 minutos, por videollamada, con alguien preparado para escuchar. Tu primera
> sesión: $7,50.

**Copy B:**
> «No es para tanto.»
> «Ya se me va a pasar.»
> «Otros están peor.»
>
> Te lo dices hace meses.
>
> Hablar ayuda. Y ahora cuesta $7,50.

**Copy C — para retargeting:**
> Sigues aquí. Eso ya dice algo.
>
> Tu primera sesión cuesta $7,50 y dura 45 minutos. Puedes elegir el horario
> que quieras, incluso hoy.

**Creativos:** video 9:16 de 20–30 s en tono íntimo con texto en pantalla y
voz en off suave; imagen estática con la frase en serif sobre arena; carrusel de
frases que la gente se dice para no pedir ayuda.

**CTA:** «Más información» → `/empezar`

**Métricas:** CTR ≥ 1,5 % (más alto por ser emocional) · CPA ≤ $8 en frío,
≤ $4 en retargeting

---

### Campaña 3 · «Terapia psicológica accesible»

**Enfoque racional, orientado a la confianza.** Ataca directamente la sospecha
de que barato es malo.

**Objetivo:** conversiones · **Presupuesto:** $12/día · **Peso:** 20 %

**Público:** 28–50 años, segmentos de mayor poder adquisitivo, y conjunto de
padres y madres (comportamiento «padres con hijos de 3–12 años»).

**Copy A:**
> Psicólogos clínicos titulados. Registro profesional verificado uno por uno.
> Rechazamos a 7 de cada 10 que aplican.
>
> Sesiones de 45 minutos por videollamada.
> Primera sesión: $7,50. Siguientes: $10.
>
> Terapia profesional, a un precio que sí puedes sostener en el tiempo.

**Copy B — dirigido a padres:**
> Cuidas de todos. ¿Y de ti quién cuida?
>
> Habla con un psicólogo clínico 45 minutos, desde tu casa, cuando los niños ya
> estén dormidos. Tenemos horarios hasta las 22 h.
>
> Primera sesión: $7,50.

**Creativos:** video del coordinador clínico explicando el proceso de
verificación; carrusel con 4 perfiles reales de psicólogos y sus credenciales;
imagen con la comparación de precios; testimonio en video de un paciente real
con consentimiento firmado.

**CTA:** «Más información» → `/por-que-cuesta-menos`

**Métricas:** CTR ≥ 1,0 % · CPA ≤ $7 · **mejor retención esperada**: es el
público que llega convencido y se queda más sesiones

---

### Campaña 4 · «Primera sesión $7,50»

**Campaña de conversión pura, fondo del embudo.** El precio como titular.

**Objetivo:** conversiones · **Presupuesto:** $16/día · **Peso:** 25 %

**Público:** retargeting de 14 días (visitó `/empezar` y no pagó), abandono en
el paso de pago (ventana de 7 días), audiencias similares al 1 % de compradores,
y lista de correos de pacientes inactivos.

**Copy A — para abandono de pago:**
> Tu sesión quedó a medias.
>
> Todavía puedes agendarla. $7,50, 45 minutos, el horario que elijas.
>
> 👉 Terminar de agendar

**Copy B — precio directo:**
> Primera sesión con psicólogo clínico: **$7,50**
>
> ✓ 45 minutos por videollamada
> ✓ Profesionales con título verificado
> ✓ Eliges el horario, incluso hoy
> ✓ Cambias de psicólogo sin costo si no te sientes cómodo
>
> Sin membresías. Sin cobros automáticos.

**Copy C — reactivación:**
> Retomar también es avanzar.
>
> Tu psicólogo sigue disponible. Agenda cuando estés listo.

**Creativos:** imagen con el precio en tipografía grande y prueba social
(«1.200 sesiones realizadas · 4,8/5»); video de 10 s mostrando el flujo real de
la app; captura del calendario con horarios libres esta semana.

**CTA:** «Reservar» → `/empezar?paso=psicologos`

**Métricas:** CPA ≤ $4 (es retargeting) · frecuencia ≤ 4 · **retorno esperado
2–3× superior al de tráfico frío**

---

## Reglas de gestión de campañas

Escritas para que no dependan del criterio del día:

| Situación | Acción | Plazo |
|---|---|---|
| CPA de un conjunto > $12 con 3.000 impresiones | Pausar el conjunto | 48 h |
| CTR < 0,7 % con 5.000 impresiones | Pausar el anuncio | 72 h |
| Frecuencia > 3,5 en frío | Renovar creativo | Inmediato |
| CPA < $5 durante 5 días | Subir presupuesto 20 % | Cada 3 días, nunca más |
| CAC blended mensual > $5 | **Recortar medios 30 %** | Inmediato |
| Anuncio rechazado por política | Reescribir, no apelar | Mismo día |
| Nuevos creativos | 4 por campaña | Cada 2 semanas |

**Prueba creativa permanente:** el 20 % del presupuesto se reserva a probar
ángulos nuevos. En salud mental el desgaste creativo es rápido: un buen anuncio
dura de 3 a 5 semanas.

---

## Google Ads

**Presupuesto:** 15–20 % de los medios · **Objetivo:** capturar intención
existente.

### Campaña de búsqueda

| Grupo | Palabras clave | CPC estimado |
|---|---|---|
| Marca | almar, almar ec, almar psicologos | $0,05 |
| Genéricas | psicólogo online ecuador, terapia online ecuador, psicólogo por videollamada | $0,30–0,60 |
| Precio | psicólogo barato quito, terapia económica ecuador, psicólogo precio | $0,20–0,40 |
| Síntoma | terapia para la ansiedad, ayuda psicológica ansiedad, tratamiento ansiedad online | $0,35–0,70 |
| Local | psicólogo quito, psicólogo guayaquil, psicólogo cuenca | $0,40–0,80 |
| Duelo | terapia por duelo, ayuda psicológica pérdida | $0,25–0,50 |

**Negativas obligatorias:** gratis, gratuito, curso, carrera, universidad,
empleo, trabajo, becas, pdf, test gratis, ejercicios, IESS.

**Anuncio tipo:**
> **Psicólogos Clínicos Online | Primera Sesión $7,50 | Almar**
> Profesionales con título verificado. Sesiones de 45 min por videollamada.
> Agenda hoy mismo. Sin membresías. Cambia de psicólogo sin costo.

**Extensiones:** enlaces a especialidades, precios, «cómo funciona»,
«psicólogos verificados».

> **Google restringe la publicidad de servicios de salud.** Puede exigir
> verificación del anunciante. Hay que iniciar el proceso en el mes 1 para no
> quedar bloqueado en el mes 3.

### Campañas que NO se hacen en el año 1

Display, YouTube, Performance Max y Discovery: consumen presupuesto, no
convierten con este ticket y contaminan el aprendizaje. **Solo búsqueda.**

---

## TikTok

**Estrategia: orgánico primero, pagado después del mes 6.** El costo por
resultado en TikTok Ads para servicios de salud en Ecuador es competitivo, pero
el contenido orgánico rinde muchísimo más por dólar en este rubro.

**Orgánico (desde el mes 1, 4–5 publicaciones semanales):**

| Formato | Ejemplo | Objetivo |
|---|---|---|
| Psicólogo responde | «Esto es lo que pasa en tu cuerpo cuando tienes un ataque de pánico» | Autoridad |
| Mitos de la terapia | «No, el psicólogo no te va a decir qué hacer» | Educación |
| Detrás de escena | «Así verificamos el título de cada psicólogo» | Confianza |
| Micro-técnicas | «La técnica 5-4-3-2-1 para volver al presente» | Alcance |
| Precio, sin vergüenza | «Sí, cuesta $7,50. Te explico por qué» | Conversión |

**Regla de contenido:** **quien habla es un psicólogo real de la plataforma, con
su nombre y credencial en pantalla.** Es el diferenciador contra el océano de
contenido de autoayuda sin respaldo.

**TikTok Ads (desde el mes 7):** Spark Ads sobre las publicaciones orgánicas con
mejor desempeño. Presupuesto: 10 % de los medios. Nunca creativos hechos solo
para anuncio: en TikTok se nota y se castiga con el costo.

---

## Canales de CAC casi nulo

Estos son los que arreglan la economía unitaria. Su desarrollo es tan
prioritario como el de las campañas.

### Referidos (desde el mes 3)

- **Mecánica:** «Regala una primera sesión.» Quien refiere recibe $5 de crédito
  cuando su referido completa la primera sesión; el referido recibe su primera
  sesión a $5 en lugar de $7,50.
- **Costo real:** $7,50 en créditos por paciente adquirido, de los cuales solo
  se consume en promedio el 65 % → **CAC efectivo ≈ $4,90 y con mejor
  retención**, porque el referido llega con confianza previa.
- **Momento de pedirlo:** justo después de la sesión 3, cuando el paciente ya
  percibió valor. Nunca antes.

### Contenido orgánico y SEO

- 2 artículos semanales orientados a búsquedas de cola larga: «cómo saber si
  necesito terapia», «cuánto cuesta un psicólogo en Ecuador», «terapia online
  funciona», «qué pasa en la primera sesión de psicología».
- Páginas de especialidad optimizadas: son el activo de SEO de largo plazo.
- Madura entre los meses 8 y 12; hay que sembrarlo desde el mes 1.

### Alianzas de distribución

| Aliado | Mecánica | Volumen esperado |
|---|---|---|
| Universidades privadas | Convenio de bienestar estudiantil, tarifa preferente | 50–200 pacientes/mes |
| Cooperativas de ahorro y crédito | Beneficio para socios | 100–300 pacientes/mes |
| Empresas 50–500 empleados | Sesiones subsidiadas | 20–80 pacientes/mes |
| Gimnasios y centros de bienestar | Referencia cruzada | 10–30 pacientes/mes |
| Creadores de contenido de salud mental | Colaboración remunerada | 30–100 pacientes/mes |

---

## Embudo esperado y matemática de medios

Mes 6, con $1.900 de medios:

```
Impresiones           ~317.000
Clics                 ~3.800      CTR 1,2 %   CPC $0,50
Visitas a landing     ~3.420      10 % de pérdida técnica
Inician el test       ~1.200      35 %
Terminan el test      ~960        80 %
Eligen psicólogo      ~670        70 %
Llegan al pago        ~505        75 %
Pagan                 ~380        75 %        CAC $5,00
Asisten               ~323        85 %
Vuelven (2ª sesión)   ~145        45 %
```

**Los tres apalancamientos, en orden de impacto sobre el CAC:**

1. **Retención a la segunda sesión (45 % → 55 %):** no baja el CAC, pero sube el
   LTV un 22 %. **Es la palanca más rentable de todas.**
2. **Conversión de pago (75 % → 85 %):** baja el CAC un 12 % sin gastar más.
3. **CTR (1,2 % → 1,5 %):** baja el CAC un 20 %, pero se desgasta con el tiempo.

Mejorar el producto rinde más que mejorar el anuncio. Es contraintuitivo para un
equipo de performance y es la verdad de este negocio.

---

## Cuadro de mando semanal

Se revisa cada lunes, con estos siete números y nada más:

| Métrica | Objetivo mes 6 | Alarma |
|---|---:|---|
| CAC blended | $5,00 | > $6 → recortar medios |
| Conversión visita → pago | 11 % | < 8 % → revisar landing |
| Retención 2ª sesión | 45 % | < 38 % → revisar matching y coordinación |
| Sesiones por paciente | 3,2 | < 2,6 → revisar encuadre de 6 sesiones |
| Frecuencia de anuncios | < 2,5 | > 3,5 → renovar creativos |
| Costo por clic | $0,50 | > $0,70 → revisar segmentación |
| % pacientes de canales no pagados | 25 % | < 15 % → acelerar B2B y referidos |
