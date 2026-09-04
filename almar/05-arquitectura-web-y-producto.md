# 05 · Arquitectura web y producto

> Responsable: diseñador UX/UI, con el CEO y el especialista en marketing.

---

## 1. Mapa del sitio

```
almar.ec
│
├── / ................................ Portada (conversión)
├── /empezar ......................... Test orientador → matching → agenda → pago
├── /psicologos ...................... Directorio con filtros
│   └── /psicologos/[slug] ........... Perfil individual
├── /especialidades
│   ├── /ansiedad
│   ├── /estres-laboral
│   ├── /depresion
│   ├── /duelo
│   ├── /relaciones-y-pareja
│   ├── /autoestima
│   └── /crianza
├── /como-funciona ................... Proceso en 4 pasos + video
├── /por-que-cuesta-menos ............ Transparencia del modelo 75/25
├── /precios ......................... Sesión suelta, bono, suscripción
├── /confidencialidad ................ Privacidad y seguridad en lenguaje llano
├── /preguntas-frecuentes
├── /blog ............................ Contenido y SEO
├── /para-empresas ................... B2B
├── /soy-psicologo ................... Reclutamiento de oferta
│   └── /soy-psicologo/aplicar
├── /ayuda-urgente ................... Líneas de crisis — sin barreras, sin registro
├── /contacto
├── /legal
│   ├── /terminos
│   ├── /privacidad
│   ├── /consentimiento-informado
│   └── /cookies
│
└── APLICACIÓN (autenticada)
    ├── /app ......................... Panel del paciente
    │   ├── /sesiones
    │   ├── /sala/[id] ............... Videollamada
    │   ├── /mi-psicologo
    │   ├── /pagos
    │   └── /cuenta
    └── /pro ......................... Panel del psicólogo
        ├── /agenda
        ├── /pacientes
        ├── /sala/[id]
        ├── /notas/[sesion]
        ├── /ingresos
        └── /perfil
```

Dos decisiones de arquitectura que valen dinero:

- **`/empezar` es una ruta aislada, sin menú de navegación.** Una vez dentro del
  embudo no hay salidas laterales. Solo «atrás» y «continuar».
- **`/ayuda-urgente` es accesible desde cualquier página, sin registro y sin
  paywall.** Es una obligación ética y, además, la página que más confianza
  genera en toda la web.

---

## 2. Portada, sección por sección

### Hero

Fondo crema, foto de una persona real latinoamericana en conversación
telefónica en un espacio cotidiano, luz natural.

> # Hablar ayuda.
> ### Terapia psicológica con profesionales titulados, desde donde estés.
> Tu primera sesión cuesta **$7,50**. Sin membresías ni compromisos.
>
> **[ Agenda tu primera sesión por $7,50 ]**
>
> *Responde 6 preguntas y te mostramos 3 psicólogos que encajan contigo.
> Toma menos de 3 minutos.*

Franja de confianza inmediatamente debajo, en texto pequeño con iconos:

`✓ 100+ psicólogos clínicos verificados`  ·  `✓ Registro MSP comprobado`  ·
`✓ 4,8/5 en 1.200 sesiones`  ·  `✓ Confidencial`

> **Regla de la primera pantalla:** qué es, cuánto cuesta, quién atiende y un
> solo botón. Nada más. En móvil, el botón debe verse sin desplazar en una
> pantalla de 5,5 pulgadas.

### Sección 2 · Cómo funciona

Cuatro pasos horizontales, iconos de línea, una frase cada uno.

| | |
|---|---|
| **1. Cuéntanos qué te pasa** | 6 preguntas rápidas. Sin registros ni formularios largos. |
| **2. Elige tu psicólogo** | Te mostramos 3 profesionales que encajan con lo que necesitas. |
| **3. Agenda y paga** | Escoge el horario que te sirva. Pagas $7,50 y listo. |
| **4. Habla** | 45 minutos por videollamada, desde tu celular o computadora. |

*[ Empezar ahora ]*

### Sección 3 · Por qué cuesta menos (y no es peor)

**La sección más importante de la página.** Responde la objeción que el usuario
no formula en voz alta.

> ### $7,50 no significa menos psicólogo. Significa menos intermediarios.
>
> Una consulta privada cuesta entre $30 y $60 porque paga un consultorio, una
> secretaria, tiempos muertos entre pacientes y traslados. Nosotros no tenemos
> nada de eso.
>
> **De cada sesión de $10, tu psicólogo recibe $7,50.** El resto sostiene la
> plataforma, la agenda y el soporte. Lo publicamos porque creemos que deberías
> saberlo.
>
> Nuestros psicólogos tienen título de tercer nivel en Psicología Clínica,
> registro en SENESCYT y MSP verificado uno por uno, y experiencia comprobada.
> Los mismos requisitos que cualquier consulta privada.
>
> *[ Ver cómo verificamos a nuestros psicólogos ]*

Gráfico de barras horizontal, sobrio:

```
Consulta privada tradicional  ████████████████████████  $30–60
Almar                          ████                      $10
```

### Sección 4 · Psicólogos disponibles

Carrusel de 6 a 8 tarjetas: foto, nombre, «Psicólogo/a clínico/a · Verificado»,
especialidades, calificación, próximo horario libre y botón «Ver perfil».

Cierra con: *[ Ver los 100+ psicólogos ]*

### Sección 5 · Especialidades

Cuadrícula de 8 tarjetas con icono, título y una línea. Cada una enlaza a su
página de aterrizaje, que es además el motor de SEO del proyecto.

| Ansiedad y ataques de pánico | Estrés laboral y agotamiento |
|---|---|
| **Depresión y tristeza persistente** | **Duelo y pérdidas** |
| **Relaciones y pareja** | **Autoestima e inseguridad** |
| **Crianza y familia** | **Cambios de vida y decisiones** |

### Sección 6 · Testimonios

Tres testimonios reales, con nombre de pila, edad, ciudad y foto o inicial. Se
publican solo con consentimiento escrito, específico y revocable.

> «Llevaba dos años diciendo que iba a ir al psicólogo. Lo que siempre me frenó
> fue el precio. Pagué $7,50, hablé 45 minutos y salí sintiendo que por fin
> alguien entendía. Voy por la sesión número nueve.»
> **Andrea, 29 años · Quito**

> «Trabajo de 8 a 18 y tengo dos hijos. Nunca iba a poder ir a un consultorio.
> Tengo mi sesión los martes a las 21 h, desde mi cuarto.»
> **Diego, 34 años · Guayaquil**

> «Pensé que por ser barato iba a ser cualquier cosa. Mi psicóloga estudió en la
> Católica y tiene 11 años de experiencia. Me sorprendió.»
> **Camila, 24 años · Ambato**

**Regla ética:** ningún testimonio se inventa, se paga sin declararlo ni se
edita cambiando su sentido. Hasta tener testimonios reales se usan datos de uso
(«1.200 sesiones realizadas»), no testimonios ficticios.

### Sección 7 · Confidencialidad

Fondo verde profundo, texto en crema, icono de candado.

> ### Lo que hablas ahí, se queda ahí.
>
> - **Las sesiones no se graban.** Nunca.
> - **Tu psicólogo es el único** que ve tus notas clínicas.
> - **Nadie de tu entorno se entera.** No enviamos nada que revele que usas
>   Almar.
> - **Tus datos están cifrados** y protegidos conforme a la Ley Orgánica de
>   Protección de Datos Personales del Ecuador.
> - **Puedes pedir tus datos o su eliminación** cuando quieras.
>
> Hay una sola excepción, y te la decimos de frente: si existe riesgo grave para
> tu vida o la de otra persona, tu psicólogo puede contactar a tu persona de
> confianza o a un servicio de emergencia. Es la ley y es lo correcto.
>
> *[ Leer nuestra política completa ]*

Esa última excepción, declarada con esta franqueza, **aumenta la confianza en
vez de reducirla**. Ocultarla es lo que la destruye.

### Sección 8 · Preguntas frecuentes

Acordeón de 10 preguntas. Las cuatro primeras son las que bloquean la
conversión:

1. **¿Los psicólogos son profesionales de verdad?** Sí. Todos tienen título de
   tercer nivel en Psicología Clínica, registro verificado en SENESCYT y MSP, y
   pasan una entrevista clínica con nuestro coordinador. Rechazamos a 7 de cada
   10 que aplican.
2. **¿Por qué es tan barato?** Porque no pagamos consultorio ni intermediarios.
   De cada sesión de $10, $7,50 son para tu psicólogo.
3. **¿Y si no me siento cómodo con el psicólogo que elegí?** Puedes cambiarlo
   sin costo hasta dos veces. Sin explicaciones.
4. **¿La terapia online realmente funciona?** La evidencia científica muestra
   resultados equivalentes a la presencial para ansiedad y depresión, que son
   los motivos de consulta más frecuentes.
5. ¿Cuántas sesiones voy a necesitar?
6. ¿Qué pasa si tengo que cancelar?
7. ¿Necesito instalar algo?
8. ¿Puedo pagar en efectivo?
9. ¿Atienden a menores de edad?
10. ¿Qué hago si estoy en crisis ahora mismo?

### Sección 9 · Cierre

> ## El primer paso cuesta $7,50.
> ### Y es el más difícil.
>
> **[ Agenda tu primera sesión ]**

### Pie

Cuatro columnas: Servicio · Psicólogos · Legal · Contacto.

**Bloque de emergencia siempre visible en el pie**, sobre fondo diferenciado:

> **¿Estás en crisis?** Si tú o alguien cercano está en peligro, llama al **911**
> ahora. [Ver otras líneas de ayuda]

---

## 3. Página `/soy-psicologo`

Página independiente con su propio embudo. La oferta es tan crítica como la
demanda.

> # Tú pones la clínica. Nosotros ponemos los pacientes.
> ### Llena tus horas libres con pacientes reales. Sin invertir en publicidad,
> ### sin perseguir cobros, sin coordinar por WhatsApp.
>
> **[ Aplicar ahora — toma 15 minutos ]**

Secciones:

1. **Cuánto puedes ganar.** Calculadora interactiva: el psicólogo mueve un
   deslizador de horas semanales y ve su ingreso mensual estimado.
   *Ejemplo: 10 h/semana ≈ 13 sesiones ≈ **$390/mes**; 20 h/semana ≈ **$780/mes**.*
2. **Cómo funciona el reparto.** El desglose 75/25 explicado sin letra chica.
3. **Qué ponemos nosotros.** Pacientes, agenda, cobro, videollamada, historia
   clínica, supervisión mensual, soporte.
4. **Qué pedimos.** Título de psicología clínica, registro MSP, 8 h semanales
   mínimo, puntualidad, notas al día.
5. **La objeción, de frente.** *«¿$7,50 por sesión? Yo cobro más.»* → No
   compites con tu tarifa: compites con tus horas vacías. Mantén tu consulta
   privada; esto llena lo que hoy está en blanco.
6. **Historias de psicólogos activos.**
7. **Preguntas frecuentes profesionales.**
8. **Formulario de aplicación.**

---

## 4. Página `/para-empresas`

> # Tu equipo también necesita hablar.
> ### Salud mental para toda tu gente, por menos de lo que cuesta un beneficio
> ### que nadie usa.

- El costo del malestar emocional: ausentismo, presentismo y rotación.
- Cómo funciona: la empresa cubre total o parcialmente las sesiones; el empleado
  agenda solo, y **la empresa nunca sabe quién usó el servicio**.
- Precios: desde **$2 por empleado al mes** por acceso, más sesiones subsidiadas
  a elección.
- Reporte trimestral agregado y anónimo, con mínimo de 50 personas por corte.
- Formulario de contacto comercial.

---

## 5. Arquitectura técnica

### Stack recomendado

| Capa | Elección | Motivo |
|---|---|---|
| Frontend + backend | **Next.js** (App Router) en TypeScript | Un solo repositorio, SSR para SEO, velocidad de desarrollo |
| Base de datos | **PostgreSQL** gestionado (Neon o Supabase) | Relacional, cifrado en reposo, respaldos automáticos |
| ORM | **Prisma** | Migraciones versionadas y trazabilidad del esquema |
| Autenticación | Sesión propia con JWT + OTP por WhatsApp | El correo tiene fricción alta en este público |
| **Videollamada** | **Daily.co** o **Whereby Embedded** | Cifrado, embebido en el navegador, sin instalación, ~$0,15/sesión |
| Pagos | **Kushki** o **Payphone** + DeUna | Métodos locales; tarjeta, transferencia y billetera |
| Mensajería | **WhatsApp Business API** (Twilio o proveedor local) | Canal donde el usuario realmente lee |
| Correo | Resend o Postmark | Transaccional |
| Analítica | **Plausible** o **Matomo** autoalojado | **Nunca Google Analytics con datos de salud** |
| Errores | Sentry, con depuración de datos personales | Observabilidad sin filtración |
| Alojamiento | Vercel + base gestionada en región cercana | Latencia y simplicidad |

### Decisiones de privacidad por diseño

Estas ocho decisiones deben tomarse antes de escribir la primera línea de
código, porque después son carísimas de retrofitear:

1. **Ningún píxel publicitario en rutas con contenido clínico.** El píxel de
   Meta vive únicamente en la portada y en las páginas de aterrizaje, jamás en
   `/empezar` después del test, en `/app` ni en la sala de sesión.
2. **Los eventos de conversión no llevan contenido.** Se envía «compra
   completada» con valor; nunca el motivo de consulta ni el resultado del test.
3. **Notas clínicas cifradas a nivel de campo**, con clave separada de la base
   de datos.
4. **Registro de auditoría** de todo acceso a datos clínicos: quién, cuándo, qué.
5. **Minimización.** No se pide cédula salvo para facturar; no se pide dirección;
   no se pide foto.
6. **Retención definida por tipo de dato** y purga automática al vencer.
7. **Las sesiones no se graban** y la plataforma no ofrece la función. Lo que no
   existe no se filtra.
8. **Cifrado en tránsito y en reposo**, con acceso a producción restringido y
   registrado.

### Roadmap de producto

| Fase | Semanas | Alcance |
|---|---|---|
| **MVP** | 1–8 | Landing, test, matching por reglas, agenda, pago, video, WhatsApp, panel de paciente, panel de psicólogo, notas |
| **v1.1** | 9–14 | Bonos, reseñas, PHQ-9/GAD-7, panel de ingresos, reprogramación autónoma |
| **v1.2** | 15–22 | Suscripción, referidos, app instalable (PWA), reactivación automatizada |
| **v2.0** | Mes 7–12 | Portal B2B con reportes agregados, matching con datos reales, panel clínico de riesgo |
| **v3.0** | Año 2 | Multipaís, multidivisa, apps nativas, integración con aseguradoras |

**Lo que NO se construye en el MVP** (y hay que resistirse activamente): chat
asincrónico con el psicólogo, contenido de autoayuda dentro de la app, diario
emocional, gamificación, foro comunitario, chatbot de IA. Todo eso suma
complejidad y riesgo clínico sin mover la conversión ni la retención.
