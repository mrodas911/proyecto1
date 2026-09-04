# 10 · Modelo financiero

> Responsable: experto financiero en modelos de monetización por comisión.
>
> Todas las cifras de este documento se generan con
> [`financiero/modelo.py`](financiero/modelo.py). Ejecutar `python3 modelo.py`
> las reproduce y exporta los CSV. Cambiar un supuesto y volver a correr el
> modelo actualiza todo el documento; los números no están escritos a mano.

---

## 1. Economía unitaria: lo que realmente queda

El punto de partida de todo análisis honesto de este negocio.

### Sesión de seguimiento ($10)

| Concepto | Monto | % del ticket |
|---|---:|---:|
| Precio al paciente | $10,00 | 100 % |
| Pago al psicólogo (75 %) | −$7,50 | 75,0 % |
| **Comisión bruta** | **$2,50** | **25,0 %** |
| IVA sobre la comisión (15 %) | −$0,33 | 3,3 % |
| Pasarela de pago (4,5 % + $0,15) | −$0,60 | 6,0 % |
| Video, mensajería y almacenamiento | −$0,25 | 2,5 % |
| **Margen de contribución** | **$1,32** | **13,2 %** |

### Primera sesión ($7,50)

| Concepto | Monto |
|---|---:|
| Precio al paciente | $7,50 |
| Pago al psicólogo (75 %) | −$5,63 |
| Comisión bruta | $1,88 |
| IVA, pasarela y tecnología | −$0,99 |
| **Margen de contribución** | **$0,89** |

> **La plataforma retiene el 13 % del ticket, no el 25 %.** El 47 % de la
> comisión bruta se evapora en impuestos, pasarela e infraestructura antes de
> llegar al margen. Cualquier plan que razone sobre «$2,50 por sesión» está
> sobrestimando los ingresos en un 89 %.

### Valor de vida del paciente

| Sesiones/paciente | LTV de contribución | CAC $4 | CAC $7 | CAC $10 |
|---:|---:|---:|---:|---:|
| 2,3 (sin gestión de retención) | $2,63 | 0,66 ❌ | 0,38 ❌ | 0,26 ❌ |
| 4,5 (con bonos y plan de 6 sesiones) | $5,57 | 1,39 ⚠️ | 0,80 ❌ | 0,56 ❌ |
| 6,0 (retención madura) | $7,58 | 1,89 ⚠️ | 1,08 ⚠️ | 0,76 ❌ |

*A precio de $10 y 50 % de sesiones en bono. Un negocio sano exige LTV/CAC ≥ 3.*

**Conclusión: a $10 por sesión no existe combinación de retención y CAC pagado
que produzca un LTV/CAC de 3.** El precio tiene que subir, el CAC tiene que
tender a cero, o ambos.

### Sensibilidad al precio

| Precio | Ses./paciente | Contrib. 1ª | Contrib. recurrente | LTV | LTV/CAC $4 | LTV/CAC $7 |
|---:|---:|---:|---:|---:|---:|---:|
| $10 | 2,3 | $0,89 | $1,34 | $2,63 | 0,66 | 0,38 |
| $10 | 4,5 | $0,89 | $1,34 | $5,57 | 1,39 | 0,80 |
| $10 | 6,0 | $0,89 | $1,34 | $7,58 | 1,89 | 1,08 |
| $12 | 4,5 | $0,89 | $1,67 | $6,75 | 1,69 | 0,96 |
| $12 | 6,0 | $0,89 | $1,67 | $9,26 | 2,31 | 1,32 |
| **$15** | **4,5** | $0,89 | $2,18 | **$8,51** | **2,13** | 1,22 |
| **$15** | **6,0** | $0,89 | $2,18 | **$11,78** | **2,95** | 1,68 |

**El precio es la palanca más potente del modelo.** Pasar de $10 a $15 sube el
LTV un 55 %; pasar de 2,3 a 6 sesiones por paciente lo sube un 188 %. Las dos
juntas lo multiplican por 4,5.

Y a $15 el servicio sigue siendo **50–75 % más barato que la consulta privada**
en Ecuador. La promesa de accesibilidad no se rompe.

### Punto de equilibrio operativo

Con costos fijos en régimen de **$5.390 mensuales** (mes 12):

| Precio | Ses./paciente | CAC | Contribución neta/sesión | Sesiones/mes para equilibrio |
|---:|---:|---:|---:|---:|
| $10 | 2,3 | $4 | −$0,60 | **nunca** |
| $10 | 2,3 | $7 | −$1,90 | **nunca** |
| $10 | 4,5 | $4 | $0,35 | 15.423 |
| $10 | 4,5 | $7 | −$0,32 | **nunca** |
| $10 | 6,0 | $4 | $0,60 | 9.038 |
| $12 | 4,5 | $4 | $0,61 | 8.822 |
| $12 | 6,0 | $4 | $0,88 | 6.149 |
| **$15** | **4,5** | **$4** | **$1,00** | **5.373** |
| **$15** | **6,0** | **$4** | **$1,30** | **4.157** |

Las tres filas marcadas «nunca» significan literalmente eso: **con esa
combinación de precio, retención y CAC, cada sesión adicional aumenta la
pérdida.** Crecer empeora el resultado.

---

## 2. Escenario base — el brief tal cual

Precios de $7,50 y $10, sesión suelta, reparto 75/25, adquisición 100 % pagada.

| Mes | Sesiones | 1as | Recur. | GMV | A psicólogos | Comisión neta | Contribución | Marketing | Fijos | EBITDA | Acumulado |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 1 | 100 | 100 | 0 | $750 | $563 | $163 | $89 | $1.200 | $5.500 | −$6.611 | −$6.611 |
| 2 | 180 | 153 | 27 | $1.418 | $1.063 | $308 | $172 | $1.677 | $4.800 | −$6.305 | −$12.915 |
| 3 | 300 | 216 | 84 | $2.460 | $1.845 | $535 | $304 | $2.136 | $3.900 | −$5.732 | −$18.647 |
| 4 | 480 | 298 | 182 | $4.055 | $3.041 | $882 | $507 | $2.684 | $3.870 | −$6.047 | −$24.694 |
| 5 | 700 | 385 | 315 | $6.038 | $4.528 | $1.313 | $761 | $3.188 | $3.870 | −$6.297 | −$30.991 |
| 6 | 1.000 | 500 | 500 | $8.750 | $6.563 | $1.902 | $1.108 | $3.800 | $3.870 | −$6.562 | −$37.552 |
| 7 | 1.300 | 598 | 702 | $11.505 | $8.629 | $2.501 | $1.463 | $4.686 | $4.920 | −$8.143 | −$45.695 |
| 8 | 1.600 | 688 | 912 | $14.280 | $10.710 | $3.104 | $1.822 | $5.178 | $4.920 | −$8.277 | −$53.972 |
| 9 | 1.950 | 800 | 1.150 | $17.500 | $13.125 | $3.804 | $2.237 | $5.700 | $5.390 | −$8.853 | −$62.825 |
| 10 | 2.300 | 897 | 1.403 | $20.758 | $15.568 | $4.513 | $2.658 | $6.331 | $5.390 | −$9.062 | −$71.887 |
| 11 | 2.650 | 980 | 1.670 | $24.050 | $18.038 | $5.228 | $3.086 | $6.576 | $5.390 | −$8.880 | −$80.767 |
| 12 | 3.000 | 1.080 | 1.920 | $27.300 | $20.475 | $5.935 | $3.506 | $6.980 | $5.390 | −$8.864 | −$89.631 |
| **Año 1** | **15.560** | **6.695** | **8.865** | **$138.862** | **$104.147** | **$30.188** | **$17.715** | **$50.135** | **$57.210** | **−$89.631** | |

**Diagnóstico del escenario base:**

- **Sesiones por paciente: 2,32.** Sin gestión de retención, cada paciente vale
  $2,63 de contribución y cuesta entre $6 y $9 adquirirlo.
- **El marketing ($50.135) supera en 2,8 veces al margen de contribución
  ($17.715).** Se gastan $2,83 en publicidad por cada $1 de margen generado.
- **La pérdida mensual crece con el volumen.** El mes 12 pierde más que el mes 1.
  Este es el rasgo definitorio de un modelo estructuralmente inviable: escalar
  destruye valor.
- **Requiere USD 89.631 de caja solo en el año 1**, sin ninguna perspectiva de
  equilibrio.

---

## 3. Escenario sostenible — con las cuatro correcciones

Mismas metas de volumen. Cambian cuatro cosas:

1. **Retención gestionada** — plan de 6 sesiones, coordinación clínica y
   recuperación activa. Sesiones por paciente: 2,32 → **3,15** en el año 1.
2. **Bonos de 4 sesiones** con 5 % de descuento, del 10 % de las sesiones
   recurrentes en el mes 2 al 65 % en el mes 12.
3. **Precio estándar a $12 desde el mes 7.** La primera sesión sigue en $7,50.
4. **Mezcla de canales.** CAC blended de $9 a $3,50 gracias a orgánico,
   referidos y convenios. **Convenios B2B desde el mes 8.**

| Mes | Sesiones | 1as | Recur. | GMV | A psicólogos | Comisión neta | Contribución | B2B | Marketing | Fijos | EBITDA | Acumulado |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 1 | 100 | 100 | 0 | $750 | $563 | $163 | $89 | — | $1.200 | $5.500 | −$6.611 | −$6.611 |
| 2 | 180 | 144 | 36 | $1.438 | $1.079 | $313 | $176 | — | $1.452 | $4.800 | −$6.076 | −$12.686 |
| 3 | 300 | 195 | 105 | $2.502 | $1.877 | $544 | $314 | — | $1.665 | $3.900 | −$5.251 | −$17.938 |
| 4 | 480 | 250 | 230 | $4.141 | $3.105 | $900 | $530 | — | $1.800 | $3.870 | −$5.140 | −$23.078 |
| 5 | 700 | 308 | 392 | $6.152 | $4.614 | $1.337 | $798 | — | $1.994 | $3.870 | −$5.066 | −$28.144 |
| 6 | 1.000 | 380 | 620 | $8.895 | $6.671 | $1.934 | $1.168 | — | $2.200 | $3.870 | −$4.902 | −$33.046 |
| 7 | 1.300 | 442 | 858 | $13.328 | $9.996 | $2.897 | $1.831 | — | $2.489 | $4.920 | −$5.578 | −$38.624 |
| 8 | 1.600 | 496 | 1.104 | $16.571 | $12.428 | $3.602 | $2.291 | $600 | $2.583 | $4.920 | −$4.612 | −$43.236 |
| 9 | 1.950 | 566 | 1.384 | $20.338 | $15.254 | $4.421 | $2.823 | $900 | $2.764 | $5.390 | −$4.431 | −$47.667 |
| 10 | 2.300 | 621 | 1.679 | $24.151 | $18.113 | $5.250 | $3.366 | $1.400 | $2.860 | $5.390 | −$3.484 | −$51.151 |
| 11 | 2.650 | 689 | 1.961 | $27.935 | $20.951 | $6.073 | $3.899 | $1.900 | $2.980 | $5.390 | −$2.571 | −$53.722 |
| 12 | 3.000 | 750 | 2.250 | $31.748 | $23.811 | $6.902 | $4.438 | $2.500 | $3.125 | $5.390 | **−$1.577** | **−$55.300** |
| **Año 1** | **15.560** | **4.941** | **10.619** | **$157.947** | **$118.460** | **$34.336** | **$21.723** | **$7.300** | **$27.112** | **$57.210** | **−$55.300** | |

### Comparación

| | Base | Sostenible | Diferencia |
|---|---:|---:|---:|
| Sesiones año 1 | 15.560 | 15.560 | — |
| Pacientes nuevos | 6.695 | 4.941 | −26 % |
| **Sesiones por paciente** | **2,32** | **3,15** | **+36 %** |
| GMV | $138.862 | $157.947 | +14 % |
| Margen de contribución | $17.715 | $21.723 | +23 % |
| Ingreso B2B | $0 | $7.300 | — |
| **Marketing** | **$50.135** | **$27.112** | **−46 %** |
| **EBITDA año 1** | **−$89.631** | **−$55.300** | **+$34.331** |
| EBITDA del mes 12 | −$8.864 | **−$1.577** | +82 % |
| Contribución por sesión (mes 12) | $1,17 | $1,48 | +26 % |

**El escenario sostenible atiende exactamente a las mismas personas, con las
mismas 15.560 sesiones, y ahorra USD 34.331.** La diferencia no viene de gastar
menos en marketing por austeridad: viene de **necesitar 1.754 pacientes nuevos
menos** para producir el mismo volumen de sesiones, porque cada paciente se
queda más tiempo.

> Cada décima de sesión por paciente vale más que cualquier optimización de
> campaña. Ese es el hallazgo central del modelo financiero y debe gobernar la
> asignación de esfuerzo del equipo.

---

## 4. Estructura de costos

### Costos fijos mensuales

| Concepto | Mes 1 | Mes 6 | Mes 12 |
|---|---:|---:|---:|
| CEO / fundador | $800 | $800 | $800 |
| Coordinador clínico | — | $600 | $1.200 |
| Contenido y comunidad | — | $500 | $700 |
| Experiencia del cliente | — | $470 | $940 |
| **Subtotal personal** | **$800** | **$2.370** | **$3.640** |
| Producto y desarrollo | $3.000 | $500 | $500 |
| Infraestructura | $150 | $150 | $300 |
| Herramientas SaaS | $200 | $200 | $300 |
| Legal y contable | $1.200 | $400 | $400 |
| Seguros y contingencia | — | $100 | $100 |
| Administración | $150 | $150 | $150 |
| **Total** | **$5.500** | **$3.870** | **$5.390** |

**Total de costos fijos del año 1: $57.210.**

El equipo se mantiene deliberadamente mínimo. Cuatro personas y desarrollo
externo sostienen 3.000 sesiones mensuales. Cualquier contratación adicional
antes del punto de equilibrio hay que justificarla contra el modelo.

### Distribución del gasto del año 1 (escenario sostenible)

| Categoría | Monto | % del gasto |
|---|---:|---:|
| Equipo | $32.610 | 31,9 % |
| Marketing y adquisición | $27.112 | 26,6 % |
| Producto y desarrollo | $10.500 | 10,3 % |
| Pasarela de pago | $8.724 | 8,5 % |
| Infraestructura, SaaS y administración | $7.500 | 7,3 % |
| Legal, contable y cumplimiento | $5.600 | 5,5 % |
| IVA sobre comisión | $5.150 | 5,0 % |
| Infraestructura variable (video, mensajería) | $3.890 | 3,8 % |
| Seguros y contingencia | $1.000 | 1,0 % |
| **Gasto total de la compañía** | **$102.086** | **100 %** |

*(Los $118.460 pagados a psicólogos no son costo de la plataforma: son GMV que
se transfiere y nunca entra al estado de resultados de la compañía.)*

---

## 5. Proyección a tres años

| | Año 1 (Ecuador) | Año 2 (+ Colombia) | Año 3 (+ Perú) |
|---|---:|---:|---:|
| Sesiones | 15.560 | 72.000 | 190.000 |
| Pacientes nuevos | 4.941 | 14.400 | 34.545 |
| Sesiones por paciente | 3,15 | 5,0 | 5,5 |
| Precio de seguimiento | $10 → $12 | $14 | $15 |
| **GMV** | **$157.947** | **$890.208** | **$2.515.125** |
| Margen de contribución | $21.723 | $128.552 | $368.953 |
| Ingreso B2B | $7.300 | $48.000 | $165.000 |
| Marketing | $27.112 | $54.720 | $120.909 |
| Costos fijos | $57.210 | $162.000 | $312.000 |
| **EBITDA** | **−$55.300** | **−$40.168** | **+$101.044** |
| Contribución por sesión | $1,40 | $1,79 | $1,94 |
| CAC blended | $5,49 | $3,80 | $3,50 |
| LTV de contribución | ~$4,40 | $8,93 | $10,68 |
| **LTV/CAC** | **0,80** | **2,35** | **3,05** |

**Consumo de caja acumulado hasta el equilibrio: aproximadamente USD 95.500**
(−$55.300 en el año 1 y −$40.168 en el año 2). El EBITDA mensual cruza a
positivo alrededor del **mes 21**.

### Supuestos de los años 2 y 3

| Supuesto | Año 2 | Año 3 | Riesgo |
|---|---|---|---|
| Precio de seguimiento | $14 | $15 | **Medio-alto** — hay que probarlo desde el mes 7 del año 1 |
| Sesiones por paciente | 5,0 | 5,5 | **Alto** — es el supuesto más frágil de todo el modelo |
| CAC blended | $3,80 | $3,50 | Medio — depende de que B2B y referidos maduren |
| Expansión a Colombia | Mes 15 | — | Medio — nueva regulación, nueva pasarela, nueva oferta |
| Ingreso B2B | $48.000 | $165.000 | Medio — ciclo de venta de 3–6 meses |
| Costos fijos | $13.500/mes | $26.000/mes | Bajo — controlable |

**El supuesto crítico es 5 sesiones por paciente.** Si el año 2 cierra en 3,5,
el EBITDA de ese año cae aproximadamente a −$85.000 y la necesidad de capital
sube un 45 %. Por eso la retención debe ser el KPI que se revisa primero cada
semana, antes que el CAC y antes que el volumen.

---

## 6. Necesidad de inversión

| Destino | Monto | % |
|---|---:|---:|
| Marketing y adquisición (24 meses) | $82.000 | 45,6 % |
| Equipo (24 meses) | $54.000 | 30,0 % |
| Producto y tecnología | $22.000 | 12,2 % |
| Legal, cumplimiento y constitución | $9.000 | 5,0 % |
| Reserva de contingencia (6 meses de estructura) | $13.000 | 7,2 % |
| **Total de la ronda** | **$180.000** | **100 %** |

**Estructura sugerida:** pre-semilla mediante nota convertible o SAFE, con
descuento del 20 % y tope de valoración de USD 1,2 M, o ronda de equity por el
15–18 % de la compañía.

**Pista financiera:** 24 meses hasta EBITDA positivo, con reserva para 4 meses
adicionales.

### Hitos que desbloquean la siguiente ronda

| Hito | Plazo | Por qué importa |
|---|---|---|
| 100 psicólogos activos verificados | Mes 12 | Prueba de que la oferta es construible |
| **Sesiones por paciente ≥ 4,5** | Mes 12 | **Prueba de que la economía unitaria funciona** |
| CAC blended ≤ $4 | Mes 12 | Prueba de que la adquisición es sostenible |
| 5 convenios B2B firmados | Mes 12 | Prueba del canal de CAC casi nulo |
| Precio de $12 validado sin caída de conversión | Mes 9 | Prueba del poder de fijación de precios |
| Datos de resultado clínico (PHQ-9 / GAD-7) | Mes 12 | Prueba de eficacia; habilita aseguradoras |
| Cero incidentes clínicos graves | Continuo | Licencia para operar |

---

## 7. Análisis de escenarios

| | Pesimista | Base sostenible | Optimista |
|---|---:|---:|---:|
| Sesiones año 1 | 9.000 | 15.560 | 22.000 |
| Sesiones por paciente | 2,5 | 3,15 | 4,0 |
| CAC blended | $7,00 | $5,49 | $4,20 |
| Precio de seguimiento (mes 12) | $10 | $12 | $12 |
| Convenios B2B | 0 | $7.300 | $18.000 |
| **EBITDA año 1** | **−$72.000** | **−$55.300** | **−$41.000** |
| Necesidad de capital | $240.000 | $180.000 | $150.000 |
| Mes de equilibrio | 30+ | 21 | 17 |

**En el escenario pesimista, el modelo no es financiable a este precio.** La
respuesta no es pedir más capital: es cambiar el precio a $15 y concentrar todo
el esfuerzo comercial en el canal B2B, donde el CAC es marginal. Esa decisión
debe estar tomada, con criterios definidos de antemano, antes del mes 9.

---

## 8. Riesgos financieros

| Riesgo | Impacto | Mitigación |
|---|---|---|
| **La retención se queda en 2,3 sesiones** | Fatal | Plan de 6 sesiones desde la sesión 1; bonos; coordinación de continuidad. Revisión semanal |
| **El precio de $12 hace caer la conversión** | Alto | Probar en el mes 7 con el 20 % del tráfico antes de generalizarlo |
| **Los psicólogos rotan más del 40 % anual** | Alto | Escalera de tarifas; pago puntual; supervisión; priorizar ciudades intermedias |
| La pasarela cobra más de lo modelado | Medio | Negociar por volumen; empujar bonos que agrupan transacciones |
| El IVA aplica sobre el GMV y no sobre la comisión | **Alto** | **Confirmar con asesor tributario antes de facturar la primera sesión** |
| Meta encarece el CPM en salud | Medio | Diversificar a Google, TikTok, orgánico y B2B |
| Un incidente clínico genera responsabilidad | Muy alto | Protocolos, seguro de responsabilidad, cobertura legal |
| La caja se agota antes del mes 21 | Fatal | Revisión mensual de pista; regla de recorte automático de medios si el CAC supera $5 |

### Regla de disciplina de caja

Se define ahora, para no tener que decidirla bajo presión:

> **Si la pista disponible baja de 6 meses, se recorta el 50 % del gasto en
> medios y se congela toda contratación en el mismo mes.**
>
> El volumen caerá. La empresa sobrevive. Un marketplace de salud que cierra
> abruptamente deja procesos terapéuticos abiertos, y eso es un daño que no se
> repara con una disculpa.
