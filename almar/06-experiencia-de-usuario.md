# 06 · Experiencia digital del cliente (UX)

> Responsables: diseñador UX/UI y especialista en experiencia del cliente.

---

## Principio rector

**El usuario que llega a Almar está en su peor momento del mes.** Está ansioso,
cansado o triste, y probablemente lo hace a las 23 h desde el celular, en la
cama, con poca batería. Cada campo de formulario, cada decisión y cada segundo
de espera es una oportunidad para que cierre la pestaña y no vuelva.

De ahí las seis reglas del diseño:

1. **Una decisión por pantalla.** Nunca dos.
2. **Nada se pide antes de tiempo.** El correo se pide en el paso 6, no en el 1.
3. **El precio se ve siempre**, desde el primer segundo hasta el pago.
4. **Progreso visible** en todo momento: «paso 3 de 6».
5. **Se puede volver atrás** sin perder nada de lo escrito.
6. **Móvil primero, de verdad.** El 85 % del tráfico será móvil y se diseña a
   375 px de ancho.

---

## Presupuesto de tiempo: 190 segundos

| Paso | Segundos | Acumulado | Abandono aceptable |
|---|---:|---:|---:|
| Landing: leer y decidir | 40 | 0:40 | 45 % |
| Test de 6 preguntas | 50 | 1:30 | 20 % |
| Elegir psicólogo | 35 | 2:05 | 25 % |
| Elegir horario | 20 | 2:25 | 10 % |
| Pago | 45 | 3:10 | 25 % |
| **Total** | **190 s** | | **conversión global ≈ 17 %** |

Conversión esperada de visita a pago: **12–18 %** en tráfico frío de Meta. Es
alto para un servicio de salud, y solo se sostiene con este nivel de fricción
cero.

---

## Recorrido pantalla por pantalla

### P1 · Landing (`/`)

Ya descrita en el [documento 05](05-arquitectura-web-y-producto.md). Un solo
botón primario. El botón secundario «Ver psicólogos» existe pero es visualmente
menor: la ruta de mínima fricción es siempre la principal.

---

### P2 · Test orientador (`/empezar`)

Seis pantallas. **Sin barra de navegación, sin pie, sin salidas.** Solo la barra
de progreso, la pregunta y el botón de volver.

#### P2.1 — Motivo

> **¿Qué te trae por aquí hoy?**
> *No hay respuestas correctas. Elige lo que más se parezca.*

Tarjetas grandes, táctiles, con icono:

`Ansiedad o preocupación constante` · `Tristeza o desánimo` ·
`Estrés del trabajo` · `Problemas de pareja` · `Duelo o una pérdida` ·
`Problemas en la familia` · `Autoestima y confianza` · `Quiero conocerme mejor` ·
`Otra cosa`

Selección múltiple, hasta dos. Avanza al tocar, sin botón «siguiente».

#### P2.2 — Tiempo

> **¿Hace cuánto te sientes así?**
> `Hace poco, semanas` · `Unos meses` · `Más de un año` · `Desde que recuerdo`

#### P2.3 — Impacto

> **¿Cuánto está afectando tu día a día?**
> Escala visual de 1 a 5, con etiquetas en los extremos: *«Puedo con casi todo»*
> ↔ *«Me cuesta funcionar»*.

Si el usuario marca 5, se dispara la verificación de riesgo antes de continuar.

#### P2.4 — Experiencia previa

> **¿Has ido antes a terapia?**
> `Nunca` · `Sí, hace tiempo` · `Sí, actualmente` · `Empecé pero lo dejé`

Si responde «Empecé pero lo dejé», la pantalla siguiente añade un microcopy
específico: *«Muchas personas lo dejan cuando no encajan con el profesional.
Aquí puedes cambiar de psicólogo sin costo.»*

#### P2.5 — Preferencia

> **¿Con quién te sentirías más cómodo?**
> `Psicóloga` · `Psicólogo` · `Me da igual`

#### P2.6 — Horarios

> **¿Cuándo te queda mejor?** *(elige todos los que te sirvan)*
> `Mañanas` · `Mediodía` · `Tardes` · `Noches (después de 19 h)` · `Fines de semana`

**Nada de esto pide un dato personal.** El usuario ha invertido 50 segundos y
todavía no ha entregado nada: eso es exactamente lo que hace que llegue al final.

#### Pantalla de transición (2,5 segundos)

> **Buscando psicólogos que encajen contigo…**
> *Revisando disponibilidad · Verificando especialidades · Casi listo*

Una micro-espera con propósito aumenta el valor percibido del resultado. Más de
3 segundos, lo destruye.

---

### P3 · Recomendación de psicólogos

> **Encontramos 3 psicólogos para ti**
> *Elegidos por su especialidad en **ansiedad** y por tener horarios en la
> **noche**, como pediste.*

Tres tarjetas verticales. Cada una:

```
┌──────────────────────────────────────────────┐
│  [foto]   María Fernanda Ríos                │
│           Psicóloga clínica · ✓ Verificada   │
│           ★ 4,9 (87 sesiones)                │
│                                              │
│  Ansiedad · Estrés · Autoestima              │
│  9 años de experiencia · U. Católica         │
│                                              │
│  «Trabajo con herramientas prácticas para    │
│   que empieces a notar cambios pronto.»      │
│                                              │
│  ▶ Ver presentación (30 s)                   │
│                                              │
│  Próximo horario: hoy 20:00                  │
│  ┌────────────────────────────────────────┐  │
│  │      Agendar con María Fernanda        │  │
│  └────────────────────────────────────────┘  │
└──────────────────────────────────────────────┘
```

Debajo, discreto: *«Ninguno me convence — ver más opciones»*.

Detalles que mueven la conversión de este paso:

- El **video de 30 segundos** es el elemento de mayor impacto. Reproduce en
  silencio con subtítulos, sonido al tocar.
- «✓ Verificada» abre una capa explicando qué se verificó y cuándo.
- «Próximo horario: **hoy 20:00**» produce urgencia legítima, no fabricada.
- La frase en primera persona del profesional humaniza más que cualquier
  descripción de enfoque teórico.

---

### P4 · Elegir horario

> **¿Cuándo quieres tu sesión con María Fernanda?**

Siete días en tiras horizontales; franjas de 45 min como pastillas táctiles. El
primer horario disponible aparece destacado con la etiqueta *«El más pronto»*.
Zona horaria detectada y mostrada en pequeño.

Debajo del calendario, tres líneas de refuerzo:

> `⏱ 45 minutos`   `💻 Por videollamada, sin instalar nada`   `↺ Puedes reprogramar hasta 12 h antes`

---

### P5 · Pago

> **Tu sesión con María Fernanda**
> **Martes 12 de marzo, 20:00** · 45 minutos · videollamada
>
> ### Total: $7,50
> *Precio de tu primera sesión. Las siguientes cuestan $10. Sin membresías, sin
> cobros automáticos.*

Campos, en este orden y ninguno más:

1. Nombre y apellido
2. Celular *(te enviamos el enlace por WhatsApp)*
3. Correo electrónico
4. Medio de pago

Bajo el botón:

> 🔒 Pago seguro · No guardamos tu tarjeta · Al continuar aceptas los
> **Términos y condiciones** y el **Consentimiento informado** (enlazados a
> `/legal/terminos` y `/legal/consentimiento-informado`)

**Contador de reserva visible:** *«Tu horario está reservado 14:32»*. Reduce el
abandono en el paso más caro del embudo.

**Recuperación de fallos:** si la pasarela rechaza el pago, no se pierde nada —
se ofrece otro método y el horario sigue bloqueado. El mensaje es explicativo,
nunca acusatorio: *«El banco no autorizó el cobro. Puedes intentar con otra
tarjeta o pagar con DeUna. Tu horario sigue reservado.»*

---

### P6 · Confirmación

> ## Listo, Andrea. Tu sesión está agendada.
>
> **Martes 12 de marzo · 20:00**
> Con María Fernanda Ríos
>
> Te enviamos el enlace por WhatsApp y correo. Te recordamos 24 horas antes y
> 10 minutos antes.
>
> **[ Agregar a mi calendario ]**
>
> ### Para que aproveches mejor tu sesión
> - Busca un lugar donde puedas hablar tranquilo 45 minutos.
> - Usa auriculares si puedes: ayuda a la privacidad y al sonido.
> - No tienes que preparar nada. Solo llega.
> - Si te pones nervioso, dilo. Es normal y tu psicóloga lo sabe manejar.

Aquí, y solo aquí, aparece la invitación a crear contraseña para acceder al
panel. Nunca antes.

---

### P7 · Antes de la sesión

| Momento | Canal | Mensaje |
|---|---|---|
| Inmediato | WhatsApp | Confirmación con fecha, hora, psicóloga y enlace |
| 24 h antes | WhatsApp | «Mañana a las 20:00 es tu sesión con María Fernanda. ¿Todo bien para esa hora?» + reprogramar |
| 2 h antes | WhatsApp | «Tu sesión es hoy a las 20:00. Prueba tu cámara y micrófono aquí.» |
| 10 min antes | WhatsApp + push | «Tu sala ya está abierta. [Entrar]» |
| Al no entrar, +3 min | WhatsApp | «Te estamos esperando. [Entrar ahora]» |

El botón «¿Todo bien para esa hora?» del recordatorio de 24 h es
deliberadamente una invitación a reprogramar. **Una reprogramación vale mucho
más que una inasistencia:** conserva al paciente y libera el cupo del psicólogo.

---

### P8 · La sala

Antes de entrar, verificación de cámara, micrófono y conexión con vista previa.

Dentro: video del psicólogo grande, el propio pequeño; controles mínimos
(micrófono, cámara, salir); indicador discreto de tiempo restante; leyenda
permanente **«Esta sesión no se graba»**; y un botón de ayuda que conecta con
soporte sin salir de la sala.

Si la conexión se degrada: aviso automático y propuesta de pasar a solo audio en
un toque.

---

### P9 · Después de la sesión

Pantalla inmediata, sin pasos intermedios:

> **¿Cómo estuvo tu sesión?**
> ★ ★ ★ ★ ★
>
> **¿Quieres continuar con María Fernanda?**
> [ Sí, agendar la siguiente ]   [ Ahora no ]

Si toca «Sí»: calendario con el **mismo horario de la semana siguiente ya
preseleccionado**. Un toque para confirmar.

Y a continuación, la oferta de continuidad:

> **Bono de 4 sesiones — $38** *(ahorras $2)*
> Pagas una vez y agendas cuando quieras, sin volver a poner la tarjeta.
> [ Quiero el bono ]  ·  [ Prefiero sesión por sesión ]

**Este es el momento decisivo del negocio entero.** El paciente acaba de tener
una experiencia positiva; su disposición a comprometerse no volverá a ser tan
alta. Cada punto de conversión aquí vale más que cualquier optimización de
anuncio.

Si toca «Ahora no»:

| Momento | Acción |
|---|---|
| +48 h | WhatsApp automático: «¿Te gustaría agendar tu siguiente sesión con María Fernanda? Tiene espacio el martes a las 20:00.» |
| +72 h | Mensaje **humano** del coordinador clínico, personalizado |
| +15 días | Contenido útil relacionado con su motivo de consulta, sin venta |
| +30 días | Reactivación: «Tu espacio sigue disponible cuando quieras retomarlo» |

Si la calificación es ≤ 3: contacto humano en menos de 24 h y oferta proactiva
de cambio de psicólogo sin costo.

---

## Panel del paciente (`/app`)

Deliberadamente austero. No es una red social ni un diario emocional.

| Sección | Contenido |
|---|---|
| **Inicio** | Próxima sesión con cuenta regresiva y botón de entrada |
| **Mis sesiones** | Historial, reprogramación, cancelación |
| **Mi psicólogo** | Perfil, mensaje breve (no chat clínico), cambiar de profesional |
| **Mi progreso** | Evolución de PHQ-9/GAD-7 en gráfico simple, solo si hay ≥ 2 mediciones |
| **Pagos** | Historial, bonos disponibles, facturas |
| **Mi cuenta** | Datos, privacidad, descargar mis datos, eliminar cuenta |
| **Ayuda** | Soporte y líneas de emergencia |

«Mi progreso» solo aparece con dos mediciones o más: mostrar un gráfico vacío en
un producto de salud mental es desmotivador y clínicamente contraproducente.

---

## Panel del psicólogo (`/pro`)

Diseñado para un profesional que atiende entre sesiones y con poco tiempo.

| Sección | Contenido |
|---|---|
| **Hoy** | Sesiones del día, botón de entrada, alertas |
| **Agenda** | Semana, bloqueo de horarios, sincronización con Google Calendar |
| **Pacientes** | Lista, historia, notas, resultados de instrumentos |
| **Notas pendientes** | Recordatorio visible de notas sin registrar |
| **Mis ingresos** | Sesiones del período, monto, próxima liquidación, acumulado del año |
| **Mi perfil** | Datos públicos, video, especialidades, nivel en la escalera de tarifas |
| **Formación** | Módulos, supervisión, protocolos |

La pantalla de nota clínica debe rellenarse en **menos de 3 minutos**: campos
estructurados con opciones frecuentes y un solo campo libre. Si registrar la
nota es lento, no se registra, y sin notas no hay continuidad clínica ni defensa
legal.

---

## Sistema de mensajería

| Momento | Canal | Automático |
|---|---|---|
| Confirmación de compra | WhatsApp + correo | Sí |
| Recordatorios (24 h / 2 h / 10 min) | WhatsApp | Sí |
| Encuesta post-sesión | En la app + WhatsApp | Sí |
| Recordatorio de reserva de siguiente sesión | WhatsApp | Sí |
| Contacto por no continuidad | WhatsApp, **humano** | No |
| Calificación baja | WhatsApp o llamada, **humano** | No |
| Reactivación a 30 días | WhatsApp + correo | Sí |
| Recordatorio de bono por vencer | WhatsApp | Sí |
| Alerta de riesgo | Llamada, **humano, inmediato** | No |

**Reglas de mensajería no negociables:**

- Ningún mensaje revela contenido clínico. Nunca «tu sesión sobre ansiedad».
- Ningún mensaje delata el servicio si alguien ve la pantalla: el remitente es
  «Almar», sin descriptor.
- Máximo 2 mensajes no transaccionales por semana.
- Baja en un toque, respetada de inmediato.
- Nada de mensajes entre las 22 h y las 8 h, salvo recordatorio de sesión.

---

## Encuesta de satisfacción

**Post-sesión (2 preguntas, en la app):** calificación 1–5 y «¿quieres
continuar?».

**Post-sesión 4 (3 preguntas, por WhatsApp):**
1. ¿Sientes que estás avanzando? (1–5)
2. ¿Recomendarías Almar a alguien cercano? (0–10 → NPS)
3. ¿Qué cambiarías? (texto libre, opcional)

**Al abandonar (a los 30 días sin sesión, una sola vez):**
> «Nos ayudaría mucho saber por qué. ¿Fue el precio, el horario, el psicólogo,
> ya te sentías mejor, u otra cosa?»

Esta última encuesta es la fuente de información más valiosa del negocio: dice
exactamente dónde se pierde el LTV. Se revisa en el comité semanal.

---

## Accesibilidad

Piso obligatorio, no opcional en un servicio de salud:

- **WCAG 2.1 nivel AA**: contraste ≥ 4.5:1, foco visible, navegación por teclado.
- Objetivos táctiles ≥ 44 px.
- Compatible con lector de pantalla; imágenes con texto alternativo.
- Funciona con texto ampliado al 200 % sin romper el diseño.
- Videos con subtítulos.
- Sin animaciones que puedan disparar malestar; respeta
  `prefers-reduced-motion`.
- Funciona en 3G y en gama baja: la landing debe pesar menos de 500 KB.
- Opción de sesión **solo audio** para quien no tenga privacidad visual o
  ancho de banda.
