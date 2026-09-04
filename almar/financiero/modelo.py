#!/usr/bin/env python3
"""
Modelo financiero Almar - Año 1.

Dos escenarios sobre el mismo volumen de sesiones (100 / 1.000 / 3.000 en los
meses 1, 6 y 12) para aislar el efecto de precio, retención y CAC.

  base        : exactamente lo definido en el brief (sesión suelta, 7,50 / 10,00
                dolares, reparto 75/25 siempre, adquisicion 100% paid ads).
  sostenible  : mismas metas de volumen, con bonos de sesiones, precio estandar
                de 12 dolares desde el mes 7, mezcla de canales (organico,
                referidos, convenios) y convenios B2B.

Ejecutar:  python3 modelo.py            -> imprime tablas y escribe los CSV
"""

import csv
import os

MESES = list(range(1, 13))

# --- Supuestos comunes -------------------------------------------------------
SESIONES = [100, 180, 300, 480, 700, 1000, 1300, 1600, 1950, 2300, 2650, 3000]

PRECIO_PRIMERA = 7.50          # precio de la primera sesion (gancho)
COMISION = 0.25                # take rate de la plataforma
IVA = 0.15                     # IVA Ecuador sobre la comision de intermediacion
PASARELA_PCT = 0.045           # comision de pasarela de pago (blended)
PASARELA_FIJO = 0.15           # costo fijo por transaccion
TECH_VARIABLE = 0.25           # video + notificaciones + almacenamiento por sesion

# --- Estructura de costos fijos ---------------------------------------------
def costos_fijos():
    """Devuelve una lista de dicts con el detalle de costo fijo mes a mes."""
    filas = []
    for m in MESES:
        ceo = 800
        clinico = 0 if m == 1 else (600 if m < 7 else 1200)
        contenido = 0 if m == 1 else (500 if m < 7 else 700)
        soporte = 0 if m < 4 else (470 if m < 9 else 940)
        personal = ceo + clinico + contenido + soporte

        producto = {1: 3000, 2: 2000, 3: 1000}.get(m, 500)
        infra = 150 if m < 7 else 300
        saas = 200 if m < 7 else 300
        legal = 1200 if m == 1 else 400          # incluye constitucion y contratos
        seguros = 0 if m < 3 else 100
        admin = 150

        filas.append({
            "personal": personal,
            "producto": producto,
            "infra": infra,
            "saas": saas,
            "legal": legal,
            "seguros": seguros,
            "admin": admin,
            "total": personal + producto + infra + saas + legal + seguros + admin,
        })
    return filas


def corrida(nombre, share_primera, cpa, precio_recurrente, mkt_fijo,
            pct_bono=None, desc_bono=0.0, b2b_neto=None):
    """
    share_primera     : % de sesiones del mes que son primera sesion
    cpa               : costo de adquisicion por paciente nuevo (blended)
    precio_recurrente : precio de la sesion de seguimiento, por mes
    mkt_fijo          : gasto de marketing no-media (contenido, diseno, tools)
    pct_bono          : % de sesiones recurrentes vendidas en bono de 4
    desc_bono         : descuento del bono sobre el precio de lista
    b2b_neto          : margen neto adicional por convenios B2B
    """
    fijos = costos_fijos()
    filas, acum = [], 0.0

    for i, m in enumerate(MESES):
        ses = SESIONES[i]
        primeras = round(ses * share_primera[i])
        recurrentes = ses - primeras
        precio_rec = precio_recurrente[i]

        # --- mezcla de sesiones recurrentes: sueltas vs bono de 4 sesiones
        p_bono = (pct_bono[i] if pct_bono else 0.0)
        rec_bono = round(recurrentes * p_bono)
        rec_suelta = recurrentes - rec_bono
        precio_bono_ses = precio_rec * (1 - desc_bono)

        # --- ingreso bruto cobrado al paciente (GMV)
        gmv = (primeras * PRECIO_PRIMERA
               + rec_suelta * precio_rec
               + rec_bono * precio_bono_ses)

        # --- reparto
        pago_psicologos = gmv * (1 - COMISION)
        comision_bruta = gmv * COMISION
        iva_comision = comision_bruta - comision_bruta / (1 + IVA)
        comision_neta = comision_bruta - iva_comision

        # --- costos variables
        # una transaccion por primera sesion, una por sesion suelta,
        # una cada 4 sesiones de bono
        transacciones = primeras + rec_suelta + rec_bono / 4
        monto_medio = gmv / transacciones if transacciones else 0
        pasarela = gmv * PASARELA_PCT + transacciones * PASARELA_FIJO
        tech = ses * TECH_VARIABLE

        margen_contribucion = comision_neta - pasarela - tech

        # --- adquisicion
        media = primeras * cpa[i]
        marketing = media + mkt_fijo[i]

        b2b = (b2b_neto[i] if b2b_neto else 0.0)

        fijo = fijos[i]["total"]
        ebitda = margen_contribucion + b2b - marketing - fijo
        acum += ebitda

        filas.append({
            "mes": m,
            "sesiones": ses,
            "primeras": primeras,
            "recurrentes": recurrentes,
            "pacientes_nuevos": primeras,
            "precio_recurrente": precio_rec,
            "gmv": gmv,
            "pago_psicologos": pago_psicologos,
            "comision_bruta": comision_bruta,
            "iva": iva_comision,
            "comision_neta": comision_neta,
            "pasarela": pasarela,
            "tech_variable": tech,
            "margen_contribucion": margen_contribucion,
            "b2b_neto": b2b,
            "marketing": marketing,
            "costos_fijos": fijo,
            "ebitda": ebitda,
            "ebitda_acumulado": acum,
            "contrib_por_sesion": margen_contribucion / ses,
            "monto_medio_transaccion": monto_medio,
        })
    return {"nombre": nombre, "filas": filas, "fijos": fijos}


# --- Escenario BASE ----------------------------------------------------------
base = corrida(
    "base",
    share_primera=[1.00, .85, .72, .62, .55, .50, .46, .43, .41, .39, .37, .36],
    cpa=[9.0, 9.0, 8.5, 8.0, 7.5, 7.0, 7.0, 6.8, 6.5, 6.5, 6.2, 6.0],
    precio_recurrente=[10.0] * 12,
    mkt_fijo=[300] * 6 + [500] * 6,
)

# --- Escenario SOSTENIBLE ----------------------------------------------------
sost = corrida(
    "sostenible",
    share_primera=[1.00, .80, .65, .52, .44, .38, .34, .31, .29, .27, .26, .25],
    cpa=[9.0, 8.0, 7.0, 6.0, 5.5, 5.0, 4.5, 4.2, 4.0, 3.8, 3.6, 3.5],
    precio_recurrente=[10.0] * 6 + [12.0] * 6,
    mkt_fijo=[300] * 6 + [500] * 6,
    pct_bono=[0, .10, .20, .30, .40, .50, .55, .60, .62, .65, .65, .65],
    desc_bono=0.05,
    b2b_neto=[0, 0, 0, 0, 0, 0, 0, 600, 900, 1400, 1900, 2500],
)


def resumen(esc):
    f = esc["filas"]
    tot = lambda k: sum(r[k] for r in f)
    print(f"\n{'='*100}\nESCENARIO: {esc['nombre'].upper()}\n{'='*100}")
    cab = ("Mes", "Ses.", "1as", "Pac.nuevos", "GMV", "A psic.", "Com.neta",
           "Contrib.", "Mkt", "Fijos", "EBITDA", "Acum.")
    print("{:>4} {:>6} {:>6} {:>11} {:>10} {:>10} {:>10} {:>10} {:>9} {:>8} {:>10} {:>11}".format(*cab))
    for r in f:
        print("{:>4} {:>6} {:>6} {:>11} {:>10.0f} {:>10.0f} {:>10.0f} {:>10.0f} {:>9.0f} {:>8.0f} {:>10.0f} {:>11.0f}".format(
            r["mes"], r["sesiones"], r["primeras"], r["pacientes_nuevos"], r["gmv"],
            r["pago_psicologos"], r["comision_neta"], r["margen_contribucion"],
            r["marketing"], r["costos_fijos"], r["ebitda"], r["ebitda_acumulado"]))
    print("-" * 100)
    print(f"  Sesiones ano 1 .................. {tot('sesiones'):>12,.0f}")
    print(f"  Pacientes nuevos ano 1 ......... {tot('pacientes_nuevos'):>12,.0f}")
    print(f"  Sesiones por paciente .......... {tot('sesiones')/tot('pacientes_nuevos'):>12,.2f}")
    print(f"  GMV ano 1 ...................... {tot('gmv'):>12,.0f}")
    print(f"  Pagado a psicologos ............ {tot('pago_psicologos'):>12,.0f}")
    print(f"  Comision bruta (25%) ........... {tot('comision_bruta'):>12,.0f}")
    print(f"  IVA sobre comision ............. {tot('iva'):>12,.0f}")
    print(f"  Ingreso neto plataforma ........ {tot('comision_neta'):>12,.0f}")
    print(f"  Pasarela de pago ............... {tot('pasarela'):>12,.0f}")
    print(f"  Tech variable .................. {tot('tech_variable'):>12,.0f}")
    print(f"  Margen de contribucion ......... {tot('margen_contribucion'):>12,.0f}")
    print(f"  Convenios B2B (neto) ........... {tot('b2b_neto'):>12,.0f}")
    print(f"  Marketing ...................... {tot('marketing'):>12,.0f}")
    print(f"  Costos fijos ................... {tot('costos_fijos'):>12,.0f}")
    print(f"  EBITDA ano 1 ................... {tot('ebitda'):>12,.0f}")
    caja = min(r["ebitda_acumulado"] for r in f)
    print(f"  Caja minima acumulada .......... {caja:>12,.0f}")
    print(f"  Contribucion / sesion (M12) .... {f[-1]['contrib_por_sesion']:>12,.2f}")
    print(f"  EBITDA M12 ..................... {f[-1]['ebitda']:>12,.0f}")
    return f


def unit_economics(precio, sesiones_por_paciente, cac, pct_bono=0.0, desc=0.05):
    """LTV de contribucion por paciente y ratio LTV/CAC."""
    # primera sesion
    c1 = (PRECIO_PRIMERA * COMISION) / (1 + IVA) \
         - (PRECIO_PRIMERA * PASARELA_PCT + PASARELA_FIJO) - TECH_VARIABLE
    # sesion recurrente (mezcla suelta / bono de 4)
    p_bono = precio * (1 - desc)
    c_suelta = (precio * COMISION) / (1 + IVA) \
               - (precio * PASARELA_PCT + PASARELA_FIJO) - TECH_VARIABLE
    c_bono = (p_bono * COMISION) / (1 + IVA) \
             - (p_bono * PASARELA_PCT + PASARELA_FIJO / 4) - TECH_VARIABLE
    cn = c_suelta * (1 - pct_bono) + c_bono * pct_bono
    n_rec = max(sesiones_por_paciente - 1, 0)
    ltv = c1 + n_rec * cn
    return c1, cn, ltv, (ltv / cac if cac else 0)


def tabla_sensibilidad():
    print(f"\n{'='*100}\nSENSIBILIDAD: LTV de contribucion por paciente / CAC\n{'='*100}")
    print(f"{'Precio':>7} {'Ses/pac':>8} {'Contrib.1a':>11} {'Contrib.rec':>12} {'LTV':>8} "
          f"{'LTV/CAC 4':>10} {'LTV/CAC 7':>10} {'LTV/CAC 10':>11}")
    for precio in (10.0, 12.0, 15.0):
        for spp in (2.3, 4.5, 6.0):
            c1, cn, ltv, _ = unit_economics(precio, spp, 1, pct_bono=0.5)
            print(f"{precio:>7.2f} {spp:>8.1f} {c1:>11.2f} {cn:>12.2f} {ltv:>8.2f} "
                  f"{ltv/4:>10.2f} {ltv/7:>10.2f} {ltv/10:>11.2f}")


def punto_equilibrio():
    print(f"\n{'='*100}\nPUNTO DE EQUILIBRIO OPERATIVO (sesiones/mes)\n{'='*100}")
    fijo_m12 = costos_fijos()[-1]["total"]
    print(f"Costo fijo mensual en regimen (mes 12): ${fijo_m12:,.0f}")
    print(f"{'Precio':>7} {'Ses/pac':>8} {'CAC':>7} {'Contrib.neta/sesion':>21} {'Sesiones/mes':>14}")
    for precio in (10.0, 12.0, 15.0):
        for spp in (2.3, 4.5, 6.0):
            for cac in (4.0, 7.0):
                c1, cn, ltv, _ = unit_economics(precio, spp, cac, pct_bono=0.5)
                neta = (ltv - cac) / spp      # contribucion por sesion ya neta de CAC
                be = fijo_m12 / neta if neta > 0 else float("inf")
                be_txt = f"{be:,.0f}" if be != float("inf") else "nunca"
                print(f"{precio:>7.2f} {spp:>8.1f} {cac:>7.2f} {neta:>21.2f} {be_txt:>14}")


def exportar(esc, ruta):
    campos = list(esc["filas"][0].keys())
    with open(ruta, "w", newline="", encoding="utf-8") as fh:
        w = csv.DictWriter(fh, fieldnames=campos)
        w.writeheader()
        for r in esc["filas"]:
            w.writerow({k: (round(v, 2) if isinstance(v, float) else v) for k, v in r.items()})
    print(f"  -> {ruta}")





# =============================================================================
# Proyeccion multianual - escenario objetivo (anos 2 y 3)
# =============================================================================
def proyeccion_anual(nombre, sesiones, precio_rec, ses_por_paciente, cac,
                     pct_bono, fijos_mes, b2b_neto, desc=0.05):
    """Proyeccion anualizada simplificada para los anos 2 y 3."""
    c1, cn, ltv, _ = unit_economics(precio_rec, ses_por_paciente, cac or 1, pct_bono, desc)
    pacientes = sesiones / ses_por_paciente
    primeras = pacientes
    recurrentes = sesiones - primeras
    contribucion = primeras * c1 + recurrentes * cn
    marketing = pacientes * cac
    fijos = fijos_mes * 12
    ebitda = contribucion + b2b_neto - marketing - fijos
    gmv = primeras * PRECIO_PRIMERA + recurrentes * precio_rec * (1 - pct_bono * desc)
    return {
        "nombre": nombre, "sesiones": sesiones, "gmv": gmv, "pacientes": pacientes,
        "contribucion": contribucion, "b2b": b2b_neto, "marketing": marketing,
        "fijos": fijos, "ebitda": ebitda, "contrib_sesion": contribucion / sesiones,
        "ltv": ltv, "cac": cac, "ltv_cac": ltv / cac,
    }


def multianual():
    print(f"\n{'='*100}\nPROYECCION 3 ANOS - ESCENARIO OBJETIVO\n{'='*100}")
    a1 = sum(r["sesiones"] for r in sost["filas"])
    filas = [
        {"nombre": "Ano 1 (Ecuador)", "sesiones": a1,
         "gmv": sum(r["gmv"] for r in sost["filas"]),
         "pacientes": sum(r["pacientes_nuevos"] for r in sost["filas"]),
         "contribucion": sum(r["margen_contribucion"] for r in sost["filas"]),
         "b2b": sum(r["b2b_neto"] for r in sost["filas"]),
         "marketing": sum(r["marketing"] for r in sost["filas"]),
         "fijos": sum(r["costos_fijos"] for r in sost["filas"]),
         "ebitda": sum(r["ebitda"] for r in sost["filas"]),
         "contrib_sesion": sum(r["margen_contribucion"] for r in sost["filas"]) / a1,
         "ltv": 0, "cac": 0, "ltv_cac": 0},
        proyeccion_anual("Ano 2 (EC + CO)", sesiones=72000, precio_rec=14.0,
                         ses_por_paciente=5.0, cac=3.80, pct_bono=0.60,
                         fijos_mes=13500, b2b_neto=48000),
        proyeccion_anual("Ano 3 (EC+CO+PE)", sesiones=190000, precio_rec=15.0,
                         ses_por_paciente=5.5, cac=3.50, pct_bono=0.65,
                         fijos_mes=26000, b2b_neto=165000),
    ]
    print("{:>18} {:>9} {:>11} {:>10} {:>12} {:>10} {:>11} {:>11} {:>12}".format(
        "", "Sesiones", "GMV", "Pacientes", "Contribucion", "B2B", "Marketing",
        "Fijos", "EBITDA"))
    for f in filas:
        print("{:>18} {:>9,.0f} {:>11,.0f} {:>10,.0f} {:>12,.0f} {:>10,.0f} {:>11,.0f} {:>11,.0f} {:>12,.0f}".format(
            f["nombre"], f["sesiones"], f["gmv"], f["pacientes"], f["contribucion"],
            f["b2b"], f["marketing"], f["fijos"], f["ebitda"]))
    print("-" * 100)
    for f in filas[1:]:
        print(f"  {f['nombre']}: contribucion/sesion ${f['contrib_sesion']:.2f} | "
              f"LTV ${f['ltv']:.2f} | CAC ${f['cac']:.2f} | LTV/CAC {f['ltv_cac']:.2f}")
    return filas


if __name__ == "__main__":
    resumen(base)
    resumen(sost)
    tabla_sensibilidad()
    punto_equilibrio()
    multianual()
    aqui = os.path.dirname(os.path.abspath(__file__))
    print("\nCSV generados:")
    exportar(base, os.path.join(aqui, "escenario-base.csv"))
    exportar(sost, os.path.join(aqui, "escenario-sostenible.csv"))
