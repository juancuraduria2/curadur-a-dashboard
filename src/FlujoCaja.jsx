import React, { useState, useMemo } from 'react';
import { BarChart, Bar, LineChart, Line, ComposedChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Wallet, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Calendar, Landmark, PiggyBank, Printer, X, Settings, Info, ArrowUpRight, ArrowDownRight, Minus, Clock, ShieldCheck } from 'lucide-react';

// ============================================
// FLUJO DE CAJA
// Curaduría Urbana N.° 2 de Pereira
// ============================================
// Lee los meses ya registrados en Ingresos y Finanzas.
// No pide reingresar nada: todo se calcula a partir de esos datos.
//
// MAPA DEL ARCHIVO
// Parte 1: imports, constantes, formatos y cálculos
// Parte 2: proyección y alertas
// Parte 3: STYLES_FLUJO (estilos de la pantalla)
// Parte 4: componentes pequeños
// Parte 5: panel de configuración + tabla de flujo
// Parte 6: provisiones y calendario de impuestos
// Parte 7: componente principal FlujoCaja (export default)
//
// CONCEPTOS CLAVE
// - Caja total: todo el dinero en el banco (ingresos con IVA incluido).
// - Provisiones: plata que está en el banco pero no es de la Curaduría
//   (IVA cobrado a clientes, ICA e impuesto de renta acumulados).
// - Caja disponible = Caja total − Provisiones. Es lo que se puede comprometer.
//
// Al pagar un impuesto baja la caja total y baja la provisión en el mismo
// monto, así que la caja disponible no se mueve. Por eso los pagos de
// impuestos no "asustan" al flujo cuando están bien provisionados.

// ============================================
// CONSTANTES
// ============================================

const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const MESES_CORTOS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

const MESES_PROYECCION = 12;

// IVA cuatrimestral: se paga en enero, mayo y septiembre
// (cada pago corresponde al cuatrimestre inmediatamente anterior)
const MESES_PAGO_IVA = [1, 5, 9];

// ICA bimestral: se paga en enero, marzo, mayo, julio, septiembre y noviembre
const MESES_PAGO_ICA = [1, 3, 5, 7, 9, 11];

const COLORES = {
  rojo: '#c62828',
  verde: '#388e3c',
  azul: '#1976d2',
  naranja: '#f57c00',
  morado: '#7b1fa2',
  gris: '#546e7a',
  oscuro: '#1a1a1a',
  verdeClaro: '#a5d6a7'
};

// ============================================
// MESES (clave 'AAAA-MM')
// ============================================

const claveMes = (anio, mes) => `${anio}-${String(mes).padStart(2, '0')}`;

const partesMes = (clave) => {
  const [a, m] = String(clave).split('-').map(Number);
  return { anio: a, mes: m };
};

const nombreMes = (clave) => {
  const { anio, mes } = partesMes(clave);
  return `${MESES[mes - 1]} ${anio}`;
};

const nombreMesCorto = (clave) => {
  const { anio, mes } = partesMes(clave);
  return `${MESES_CORTOS[mes - 1]} ${String(anio).slice(2)}`;
};

const mesAnterior = (clave) => {
  const { anio, mes } = partesMes(clave);
  return mes === 1 ? claveMes(anio - 1, 12) : claveMes(anio, mes - 1);
};

const mesSiguiente = (clave) => {
  const { anio, mes } = partesMes(clave);
  return mes === 12 ? claveMes(anio + 1, 1) : claveMes(anio, mes + 1);
};

const mesActual = () => {
  const hoy = new Date();
  return claveMes(hoy.getFullYear(), hoy.getMonth() + 1);
};

// Distancia en meses entre dos claves (b − a)
const distanciaMeses = (a, b) => {
  const pa = partesMes(a);
  const pb = partesMes(b);
  return (pb.anio - pa.anio) * 12 + (pb.mes - pa.mes);
};

// Rango de meses entre dos claves, inclusive
const rangoMeses = (desde, hasta) => {
  const lista = [];
  let actual = desde;
  let tope = 0;
  while (distanciaMeses(actual, hasta) >= 0 && tope < 400) {
    lista.push(actual);
    actual = mesSiguiente(actual);
    tope++;
  }
  return lista;
};

// ============================================
// FORMATOS
// ============================================

const formatoPesos = (n) => {
  const v = Math.round(Number(n) || 0);
  return `${v < 0 ? '-' : ''}$ ${Math.abs(v).toLocaleString('es-CO')}`;
};

const formatoPesosCorto = (n) => {
  const v = Number(n) || 0;
  const a = Math.abs(v);
  const signo = v < 0 ? '-' : '';
  if (a >= 1000000) return `${signo}$${(a / 1000000).toFixed(1).replace('.', ',')} M`;
  if (a >= 1000) return `${signo}$${Math.round(a / 1000)} mil`;
  return formatoPesos(v);
};

const formatoPct = (n) =>
  (n === null || n === undefined || !isFinite(n)) ? '—' : `${n.toFixed(1).replace('.', ',')} %`;

const formatoNumero = (n) => (Number(n) || 0).toLocaleString('es-CO');

const formatoFechaHora = (iso) => {
  const d = new Date(iso);
  if (isNaN(d)) return '';
  return `${d.getDate()} de ${MESES[d.getMonth()].toLowerCase()} de ${d.getFullYear()}, ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};

// ============================================
// LECTURA DE UN MES REGISTRADO
// ============================================

const sumaValores = (lista) =>
  (lista || []).reduce((s, x) => s + (Number(x && x.valor) || 0), 0);

// Convierte un registro mensual en cifras de caja e impuestos.
//
// Si el mes está marcado "ivaIncluido", los ingresos ya traen el IVA:
//   base = ingreso / 1.19   ·   iva = ingreso − base
// Si no, el ingreso ES la base y el IVA se suma para obtener la caja real.
const analizarMes = (registro, tarifaIva = 0.19) => {
  if (!registro) return null;
  const ing = registro.ingresos || {};
  const variable = Number(ing.variable) || 0;
  const fijo = Number(ing.fijo) || 0;
  const unico = Number(ing.unico) || 0;
  const registrado = variable + fijo + unico;

  const factor = 1 + tarifaIva;
  const conIva = registro.ivaIncluido !== false;

  // Base gravable (sin IVA) y dinero que realmente entró al banco
  const baseGravable = conIva ? (registrado / factor) : registrado;
  const cajaIngresos = conIva ? registrado : (registrado * factor);
  const ivaGenerado = cajaIngresos - baseGravable;

  const nomina = sumaValores(registro.nomina);
  const prestaciones = sumaValores(registro.prestaciones);
  const proveedores = sumaValores(registro.proveedores);
  const gastosOperativos = nomina + prestaciones + proveedores;

  // IVA descontable: solo de los proveedores marcados "genera IVA".
  // El valor registrado se asume con IVA incluido.
  const ivaDescontable = (registro.proveedores || []).reduce((s, p) => {
    if (!p || !p.generaIva) return s;
    const v = Number(p.valor) || 0;
    return s + (v - v / factor);
  }, 0);

  // Impuestos efectivamente pagados en el mes, clasificados por tipo
  let pagoIva = 0;
  let pagoIca = 0;
  let pagoRenta = 0;
  let pagoOtros = 0;
  (registro.impuestos || []).forEach(i => {
    const v = Number(i.valor) || 0;
    const c = String(i.concepto || '').toLowerCase();
    if (/\biva\b/.test(c)) pagoIva += v;
    else if (/industria|comercio|\bica\b|aviso/.test(c)) pagoIca += v;
    else if (/renta/.test(c)) pagoRenta += v;
    else pagoOtros += v;
  });
  const impuestosPagados = pagoIva + pagoIca + pagoRenta + pagoOtros;

  return {
    registrado,
    conIva,
    baseGravable,
    cajaIngresos,
    ivaGenerado,
    ivaDescontable,
    ivaNeto: Math.max(0, ivaGenerado - ivaDescontable),
    variable, fijo, unico,
    nomina, prestaciones, proveedores,
    gastosOperativos,
    impuestosPagados,
    pagoIva, pagoIca, pagoRenta, pagoOtros,
    // Utilidad operativa antes de impuestos, sobre base sin IVA
    utilidadOperativa: baseGravable - gastosOperativos,
    saldoBanco: Number(registro.saldoBanco) || 0,
    radicados: Number(registro.radicados) || 0,
    expedidos: Number(registro.expedidos) || 0
  };
};

// ============================================
// IMPUESTOS: PERÍODOS Y VENCIMIENTOS
// ============================================

// Cuatrimestre de IVA al que pertenece un mes (1, 2 o 3)
const cuatrimestreDe = (mes) => Math.ceil(mes / 4);

// Mes en que se paga el IVA causado en un mes dado.
// Cuatrimestre 1 (ene-abr) → se paga en mayo
// Cuatrimestre 2 (may-ago) → se paga en septiembre
// Cuatrimestre 3 (sep-dic) → se paga en enero del año siguiente
const mesPagoIvaDe = (clave) => {
  const { anio, mes } = partesMes(clave);
  const c = cuatrimestreDe(mes);
  if (c === 1) return claveMes(anio, 5);
  if (c === 2) return claveMes(anio, 9);
  return claveMes(anio + 1, 1);
};

// Bimestre de ICA al que pertenece un mes (1 a 6)
const bimestreDe = (mes) => Math.ceil(mes / 2);

// Mes en que se paga el ICA causado en un mes dado:
// el bimestre se paga en el mes siguiente al cierre del bimestre.
// Bimestre 1 (ene-feb) → marzo · Bimestre 6 (nov-dic) → enero siguiente
const mesPagoIcaDe = (clave) => {
  const { anio, mes } = partesMes(clave);
  const b = bimestreDe(mes);
  if (b === 6) return claveMes(anio + 1, 1);
  return claveMes(anio, b * 2 + 1);
};

// Etiqueta legible del período
const etiquetaPeriodoIva = (clave) => {
  const { anio, mes } = partesMes(clave);
  const c = cuatrimestreDe(mes);
  const rangos = ['Ene–Abr', 'May–Ago', 'Sep–Dic'];
  return `${rangos[c - 1]} ${anio}`;
};

const etiquetaPeriodoIca = (clave) => {
  const { anio, mes } = partesMes(clave);
  const b = bimestreDe(mes);
  const rangos = ['Ene–Feb', 'Mar–Abr', 'May–Jun', 'Jul–Ago', 'Sep–Oct', 'Nov–Dic'];
  return `${rangos[b - 1]} ${anio}`;
};

// ============================================
// ACUMULACIÓN DE PROVISIONES
// ============================================
// Recorre los meses y arma, por cada período tributario, cuánto se causó
// y cuánto se ha pagado. Lo que falta por pagar es la provisión viva.

const construirPeriodos = (datosMeses, config) => {
  const tarifaIva = config.tarifaIva;
  const tarifaIca = config.tarifaIca;
  const inicio = config.anioInicioProvisiones;

  const iva = {};   // clave: mes de pago
  const ica = {};

  Object.keys(datosMeses).sort().forEach(k => {
    const { anio } = partesMes(k);
    const a = datosMeses[k];
    if (!a || anio < inicio) return;

    // --- IVA causado ---
    const kPagoIva = mesPagoIvaDe(k);
    if (!iva[kPagoIva]) {
      iva[kPagoIva] = { tipo: 'IVA', mesPago: kPagoIva, periodo: etiquetaPeriodoIva(k), causado: 0, descontable: 0, meses: [] };
    }
    iva[kPagoIva].causado += a.ivaGenerado;
    iva[kPagoIva].descontable += a.ivaDescontable;
    iva[kPagoIva].meses.push(k);

    // --- ICA causado (sobre base gravable) ---
    const kPagoIca = mesPagoIcaDe(k);
    if (!ica[kPagoIca]) {
      ica[kPagoIca] = { tipo: 'ICA', mesPago: kPagoIca, periodo: etiquetaPeriodoIca(k), causado: 0, descontable: 0, meses: [] };
    }
    ica[kPagoIca].causado += a.baseGravable * tarifaIca;
    ica[kPagoIca].meses.push(k);
  });

  // Neto a pagar por período
  Object.values(iva).forEach(p => { p.aPagar = Math.max(0, p.causado - p.descontable); });
  Object.values(ica).forEach(p => { p.aPagar = p.causado; });

  // Pagos registrados, aplicados al período más antiguo pendiente
  const aplicarPagos = (mapa, campoPago) => {
    const periodos = Object.values(mapa).sort((a, b) => a.mesPago.localeCompare(b.mesPago));
    periodos.forEach(p => { p.pagado = 0; });
    let pendientes = [...periodos];
    Object.keys(datosMeses).sort().forEach(k => {
      const { anio } = partesMes(k);
      if (anio < inicio) return;
      let disponible = datosMeses[k][campoPago] || 0;
      while (disponible > 0 && pendientes.length > 0) {
        const p = pendientes[0];
        const falta = Math.max(0, p.aPagar - p.pagado);
        if (falta <= 0) { pendientes.shift(); continue; }
        const aplica = Math.min(falta, disponible);
        p.pagado += aplica;
        disponible -= aplica;
        if (p.pagado >= p.aPagar - 1) pendientes.shift();
      }
    });
    periodos.forEach(p => { p.saldo = Math.max(0, p.aPagar - p.pagado); });
    return periodos;
  };

  return {
    iva: aplicarPagos(iva, 'pagoIva'),
    ica: aplicarPagos(ica, 'pagoIca')
  };
};

// Provisión de renta acumulada hasta un mes dado
const provisionRenta = (datosMeses, config, hastaClave) => {
  const inicio = config.anioInicioProvisiones;
  const { anio: anioHasta } = partesMes(hastaClave);
  const porAnio = {};

  Object.keys(datosMeses).sort().forEach(k => {
    const { anio } = partesMes(k);
    if (anio < inicio || distanciaMeses(k, hastaClave) < 0) return;
    if (!porAnio[anio]) porAnio[anio] = { anio, utilidad: 0, pagado: 0, meses: 0 };
    porAnio[anio].utilidad += datosMeses[k].utilidadOperativa;
    porAnio[anio].pagado += datosMeses[k].pagoRenta;
    porAnio[anio].meses++;
  });

  Object.values(porAnio).forEach(a => {
    a.estimado = Math.max(0, a.utilidad * config.tarifaRenta);
    a.saldo = Math.max(0, a.estimado - a.pagado);
    // La renta de un año se paga en el año siguiente
    a.mesPago = claveMes(a.anio + 1, config.mesPagoRenta);
  });

  return Object.values(porAnio).sort((a, b) => a.anio - b.anio);
};
// ============================================
// PROYECCIÓN DE INGRESOS Y GASTOS FUTUROS
// ============================================

// Promedio de caja de los últimos n meses registrados
const promedioIngresos = (datosMeses, n) => {
  const claves = Object.keys(datosMeses).sort();
  const ultimos = claves.slice(-Math.max(1, n));
  if (ultimos.length === 0) return 0;
  const suma = ultimos.reduce((s, k) => s + datosMeses[k].cajaIngresos, 0);
  return suma / ultimos.length;
};

// Gastos recurrentes tomados del último mes registrado:
// nómina completa + proveedores marcados como recurrentes.
// Las prestaciones no se proyectan como recurrentes (son estacionales).
const gastosRecurrentes = (meses, datosMeses) => {
  const claves = Object.keys(meses).sort();
  if (claves.length === 0) return { nomina: 0, proveedores: 0, total: 0, mesBase: null, empleados: 0 };
  const ultima = claves[claves.length - 1];
  const r = meses[ultima] || {};
  const nomina = sumaValores(r.nomina);
  const proveedores = (r.proveedores || [])
    .filter(p => p && p.recurrente !== false)
    .reduce((s, p) => s + (Number(p.valor) || 0), 0);
  return {
    nomina,
    proveedores,
    total: nomina + proveedores,
    mesBase: ultima,
    empleados: (r.nomina || []).length
  };
};

// Prestaciones históricas por mes del año (prima en junio y diciembre,
// cesantías en febrero, etc.). Se usa el promedio de lo que se pagó
// ese mismo mes en años anteriores.
const prestacionesPorMesDelAnio = (datosMeses, meses) => {
  const acumulado = {};
  Object.keys(meses).forEach(k => {
    const { mes } = partesMes(k);
    const v = sumaValores((meses[k] || {}).prestaciones);
    if (!acumulado[mes]) acumulado[mes] = { suma: 0, cuenta: 0 };
    acumulado[mes].suma += v;
    acumulado[mes].cuenta++;
  });
  const promedio = {};
  Object.entries(acumulado).forEach(([mes, d]) => {
    promedio[Number(mes)] = d.cuenta > 0 ? d.suma / d.cuenta : 0;
  });
  return promedio;
};

// ============================================
// CONSTRUCCIÓN DEL FLUJO COMPLETO
// ============================================
// Devuelve una fila por mes, desde el inicio configurado hasta
// 12 meses hacia adelante, con caja total, provisiones y disponible.

const construirFlujo = (meses, config) => {
  const tarifaIva = config.tarifaIva;

  // 1. Analizar los meses registrados
  const datosMeses = {};
  Object.keys(meses).forEach(k => {
    const a = analizarMes(meses[k], tarifaIva);
    if (a) datosMeses[k] = a;
  });

  const clavesReales = Object.keys(datosMeses).sort();
  if (clavesReales.length === 0) return null;

  // 2. Rango: desde el mes del saldo inicial hasta 12 meses después del último real o del mes actual
  const hoy = mesActual();
  const ultimoReal = clavesReales[clavesReales.length - 1];
  const inicio = config.mesSaldoInicial;
  let fin = distanciaMeses(ultimoReal, hoy) > 0 ? hoy : ultimoReal;
  for (let i = 0; i < MESES_PROYECCION; i++) fin = mesSiguiente(fin);

  const claves = rangoMeses(inicio, fin);

  // 3. Bases de proyección
  const promedio = promedioIngresos(datosMeses, config.mesesPromedio);
  const ingresoProyectado = promedio * (1 + config.ajusteIngresos);
  const recurrentes = gastosRecurrentes(meses, datosMeses);
  const prestacionesProm = prestacionesPorMesDelAnio(datosMeses, meses);

  // 4. Períodos de impuestos (causación y pagos ya hechos)
  const periodos = construirPeriodos(datosMeses, config);

  // Indexar pagos proyectados por mes
  const pagosProyectados = {};
  const agregarPago = (clave, tipo, monto, periodo) => {
    if (monto <= 0) return;
    if (!pagosProyectados[clave]) pagosProyectados[clave] = [];
    pagosProyectados[clave].push({ tipo, monto, periodo });
  };

  periodos.iva.forEach(p => { if (p.saldo > 0) agregarPago(p.mesPago, 'IVA', p.saldo, p.periodo); });
  periodos.ica.forEach(p => { if (p.saldo > 0) agregarPago(p.mesPago, 'ICA', p.saldo, p.periodo); });

  const rentas = provisionRenta(datosMeses, config, fin);
  rentas.forEach(r => { if (r.saldo > 0) agregarPago(r.mesPago, 'Renta', r.saldo, `Año ${r.anio}`); });

  // 5. Recorrer mes a mes
  const filas = [];
  let caja = config.saldoInicial;
  let provIva = 0;
  let provIca = 0;
  let provRenta = 0;

  claves.forEach(k => {
    const real = datosMeses[k];
    const esReal = !!real;
    const esFuturo = distanciaMeses(k, hoy) < 0;
    const { mes: numMes } = partesMes(k);

    const saldoInicialMes = caja;
    const dispInicial = caja - (provIva + provIca + provRenta);

    let entradas, salidas, nomina, proveedoresMes, prestacionesMes;
    let ivaGen = 0, ivaDesc = 0, baseGrav = 0, utilidad = 0;
    let pagosMes = [];
    let totalPagos = 0;

    if (esReal) {
      entradas = real.cajaIngresos;
      nomina = real.nomina;
      proveedoresMes = real.proveedores;
      prestacionesMes = real.prestaciones;
      salidas = real.gastosOperativos;
      ivaGen = real.ivaGenerado;
      ivaDesc = real.ivaDescontable;
      baseGrav = real.baseGravable;
      utilidad = real.utilidadOperativa;
      totalPagos = real.impuestosPagados;
      if (real.pagoIva > 0) pagosMes.push({ tipo: 'IVA', monto: real.pagoIva, pagado: true });
      if (real.pagoIca > 0) pagosMes.push({ tipo: 'ICA', monto: real.pagoIca, pagado: true });
      if (real.pagoRenta > 0) pagosMes.push({ tipo: 'Renta', monto: real.pagoRenta, pagado: true });
      if (real.pagoOtros > 0) pagosMes.push({ tipo: 'Otros', monto: real.pagoOtros, pagado: true });
    } else {
      entradas = ingresoProyectado;
      nomina = recurrentes.nomina;
      proveedoresMes = recurrentes.proveedores;
      prestacionesMes = prestacionesProm[numMes] || 0;
      salidas = nomina + proveedoresMes + prestacionesMes;
      baseGrav = entradas / (1 + tarifaIva);
      ivaGen = entradas - baseGrav;
      // IVA descontable proyectado con la misma proporción del último mes real
      const ultimo = datosMeses[clavesReales[clavesReales.length - 1]];
      const proporcion = ultimo && ultimo.proveedores > 0 ? (ultimo.ivaDescontable / ultimo.proveedores) : 0;
      ivaDesc = proveedoresMes * proporcion;
      utilidad = baseGrav - salidas;
      pagosMes = (pagosProyectados[k] || []).map(p => ({ ...p, pagado: false }));
      totalPagos = pagosMes.reduce((s, p) => s + p.monto, 0);
    }

    // Causación de provisiones del mes
    const causaIva = Math.max(0, ivaGen - ivaDesc);
    const causaIca = baseGrav * config.tarifaIca;
    const causaRenta = Math.max(0, utilidad * config.tarifaRenta);

    provIva += causaIva;
    provIca += causaIca;
    provRenta += causaRenta;

    // Descontar pagos de las provisiones
    pagosMes.forEach(p => {
      if (p.tipo === 'IVA') provIva = Math.max(0, provIva - p.monto);
      else if (p.tipo === 'ICA') provIca = Math.max(0, provIca - p.monto);
      else if (p.tipo === 'Renta') provRenta = Math.max(0, provRenta - p.monto);
    });

    caja = caja + entradas - salidas - totalPagos;
    const provisionTotal = provIva + provIca + provRenta;
    const disponible = caja - provisionTotal;

    filas.push({
      clave: k,
      etiqueta: nombreMesCorto(k),
      nombre: nombreMes(k),
      esReal,
      esFuturo,
      esMesActual: k === hoy,
      saldoInicial: saldoInicialMes,
      dispInicial,
      entradas,
      nomina,
      proveedores: proveedoresMes,
      prestaciones: prestacionesMes,
      salidas,
      pagosMes,
      totalPagos,
      baseGravable: baseGrav,
      ivaGenerado: ivaGen,
      ivaDescontable: ivaDesc,
      causaIva,
      causaIca,
      causaRenta,
      provIva,
      provIca,
      provRenta,
      provisionTotal,
      caja,
      disponible,
      utilidad,
      flujoNeto: entradas - salidas - totalPagos
    });
  });

  return {
    filas,
    periodos,
    rentas,
    recurrentes,
    ingresoProyectado,
    promedio,
    ultimoReal,
    primerReal: clavesReales[0],
    mesesRegistrados: clavesReales.length,
    datosMeses
  };
};

// ============================================
// ALERTAS
// ============================================
// Tres niveles:
//   critico  → caja disponible negativa, o caja total insuficiente para un pago
//   atencion → pago grande próximo, o provisión incompleta
//   info     → recordatorios de vencimientos cercanos

const generarAlertas = (flujo, config) => {
  if (!flujo) return [];
  const alertas = [];
  const hoy = mesActual();
  const filas = flujo.filas;

  // 1. Caja disponible negativa en el futuro
  const primeraNegativa = filas.find(f => !f.esReal && f.disponible < 0);
  if (primeraNegativa) {
    alertas.push({
      nivel: 'critico',
      titulo: 'Caja disponible negativa proyectada',
      texto: `En ${primeraNegativa.nombre} la caja disponible llegaría a ${formatoPesos(primeraNegativa.disponible)}. ` +
             `Esto significa que los compromisos superarían el dinero libre de provisiones.`,
      mes: primeraNegativa.clave
    });
  }

  // 2. Caja total insuficiente para cubrir los pagos del mes
  filas.filter(f => !f.esReal && f.totalPagos > 0).forEach(f => {
    if (f.caja < 0) {
      alertas.push({
        nivel: 'critico',
        titulo: `Caja insuficiente en ${f.nombre}`,
        texto: `Los pagos de impuestos de ese mes suman ${formatoPesos(f.totalPagos)} y dejarían la caja en ${formatoPesos(f.caja)}.`,
        mes: f.clave
      });
    }
  });

  // 3. Próximos pagos de impuestos (siguientes 3 meses)
  filas
    .filter(f => !f.esReal && f.totalPagos > 0 && distanciaMeses(hoy, f.clave) >= 0 && distanciaMeses(hoy, f.clave) <= 3)
    .forEach(f => {
      const detalle = f.pagosMes.map(p => `${p.tipo} ${formatoPesos(p.monto)}`).join(' · ');
      const meses = distanciaMeses(hoy, f.clave);
      alertas.push({
        nivel: meses <= 1 ? 'atencion' : 'info',
        titulo: `Pago de impuestos en ${f.nombre}`,
        texto: `${detalle}. Total ${formatoPesos(f.totalPagos)}. ` +
               (f.caja >= f.totalPagos ? 'La caja proyectada alcanza a cubrirlo.' : 'Revisa la disponibilidad de caja.'),
        mes: f.clave
      });
    });

  // 4. Períodos vencidos sin pagar
  const vencidosIva = flujo.periodos.iva.filter(p => p.saldo > 0 && distanciaMeses(p.mesPago, hoy) > 0);
  const vencidosIca = flujo.periodos.ica.filter(p => p.saldo > 0 && distanciaMeses(p.mesPago, hoy) > 0);
  [...vencidosIva, ...vencidosIca].forEach(p => {
    alertas.push({
      nivel: 'atencion',
      titulo: `${p.tipo} del período ${p.periodo} sin registrar como pagado`,
      texto: `Quedan ${formatoPesos(p.saldo)} sin registrar. Si ya lo pagaste, agrégalo en la sección de impuestos de ${nombreMes(p.mesPago)}.`,
      mes: p.mesPago
    });
  });

  // 5. Meses registrados sin IVA incluido
  Object.entries(flujo.datosMeses).forEach(([k, d]) => {
    if (!d.conIva) {
      alertas.push({
        nivel: 'atencion',
        titulo: `${nombreMes(k)} está registrado sin IVA`,
        texto: 'Los demás meses incluyen IVA. Para que el flujo y las provisiones cuadren, revisa ese mes y marca la casilla si corresponde.',
        mes: k
      });
    }
  });

  // 6. Ningún proveedor marcado como generador de IVA
  const algunoConIva = Object.values(flujo.datosMeses).some(d => d.ivaDescontable > 0);
  if (!algunoConIva) {
    alertas.push({
      nivel: 'info',
      titulo: 'No hay proveedores marcados con IVA',
      texto: 'El IVA a pagar se está estimando sin descontar el IVA de proveedores, así que sale más alto que el real. ' +
             'En "Registrar mes" puedes marcar cuáles proveedores facturan con IVA.',
      mes: null
    });
  }

  const orden = { critico: 0, atencion: 1, info: 2 };
  return alertas.sort((a, b) => orden[a.nivel] - orden[b.nivel]);
};
// ============================================
// ESTILOS DE LA PANTALLA
// ============================================

const STYLES_FLUJO = `
.fc-wrap { display: flex; flex-direction: column; gap: 20px; }

.fc-barra { background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); padding: 15px 20px; display: flex; justify-content: space-between; align-items: center; gap: 15px; flex-wrap: wrap; }
.fc-tabs { display: flex; gap: 6px; background: #f5f5f5; padding: 4px; border-radius: 10px; flex-wrap: wrap; }
.fc-tab { background: none; border: none; padding: 9px 16px; border-radius: 8px; cursor: pointer; font-size: 14px; color: #666; font-weight: 500; display: flex; align-items: center; gap: 6px; font-family: inherit; }
.fc-tab.active { background: white; color: #c62828; font-weight: 600; box-shadow: 0 1px 4px rgba(0,0,0,0.08); }

.fc-btn { border: none; padding: 10px 18px; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 500; display: inline-flex; align-items: center; gap: 6px; transition: all 0.2s; font-family: inherit; }
.fc-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.fc-btn-primario { background: #c62828; color: white; }
.fc-btn-primario:hover:not(:disabled) { background: #b71c1c; }
.fc-btn-oscuro { background: #1a1a1a; color: white; }
.fc-btn-oscuro:hover:not(:disabled) { background: #333; }
.fc-btn-secundario { background: white; color: #333; border: 1px solid #e0e0e0; }
.fc-btn-secundario:hover:not(:disabled) { border-color: #c62828; color: #c62828; }
.fc-btn-icono { background: none; border: none; color: #999; cursor: pointer; padding: 8px; border-radius: 6px; display: inline-flex; align-items: center; justify-content: center; }
.fc-btn-icono:hover { background: #ffebee; color: #c62828; }

.fc-kpis { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.fc-kpi { background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); border-left: 4px solid #c62828; }
.fc-kpi-label { color: #666; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.4px; margin-bottom: 8px; display: flex; align-items: center; gap: 6px; }
.fc-kpi-valor { font-size: 25px; font-weight: 700; color: #1a1a1a; font-variant-numeric: tabular-nums; }
.fc-kpi-sub { margin-top: 8px; font-size: 12px; color: #888; line-height: 1.4; }
.fc-kpi.verde { border-left-color: #388e3c; } .fc-kpi.verde .fc-kpi-valor { color: #388e3c; }
.fc-kpi.rojo { border-left-color: #c62828; } .fc-kpi.rojo .fc-kpi-valor { color: #c62828; }
.fc-kpi.azul { border-left-color: #1976d2; } .fc-kpi.azul .fc-kpi-valor { color: #1976d2; }
.fc-kpi.naranja { border-left-color: #f57c00; } .fc-kpi.naranja .fc-kpi-valor { color: #f57c00; }
.fc-kpi.morado { border-left-color: #7b1fa2; } .fc-kpi.morado .fc-kpi-valor { color: #7b1fa2; }
.fc-kpi.oscuro { border-left-color: #1a1a1a; }

.fc-card { background: white; padding: 22px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
.fc-card-titulo { font-size: 16px; font-weight: 600; color: #333; margin-bottom: 4px; display: flex; align-items: center; gap: 8px; }
.fc-card-sub { font-size: 13px; color: #888; margin-bottom: 16px; line-height: 1.5; }
.fc-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }

.fc-tabla { width: 100%; overflow-x: auto; -webkit-overflow-scrolling: touch; }
.fc-tabla table { width: 100%; border-collapse: collapse; min-width: 900px; }
.fc-tabla th { background: #f5f5f5; padding: 10px 12px; text-align: left; font-size: 11px; color: #666; font-weight: 600; text-transform: uppercase; letter-spacing: 0.3px; border-bottom: 2px solid #e0e0e0; position: sticky; top: 0; }
.fc-tabla td { padding: 9px 12px; border-bottom: 1px solid #f0f0f0; font-size: 13px; }
.fc-tabla tr.futuro td { background: #fcfcfc; color: #666; font-style: italic; }
.fc-tabla tr.actual td { background: #fff5f5; font-weight: 600; font-style: normal; }
.fc-tabla tr.alerta td { background: #ffebee; }
.fc-tabla tr.total td { font-weight: 700; background: #fafafa; border-top: 2px solid #e0e0e0; }
.fc-tabla tr:hover td { background: #f9f9f9; }
.num { text-align: right !important; font-variant-numeric: tabular-nums; white-space: nowrap; }

.fc-chip { display: inline-block; padding: 3px 9px; border-radius: 12px; font-size: 11px; font-weight: 600; white-space: nowrap; }
.fc-chip.verde { background: #e8f5e9; color: #388e3c; }
.fc-chip.rojo { background: #ffebee; color: #c62828; }
.fc-chip.naranja { background: #fff3e0; color: #f57c00; }
.fc-chip.azul { background: #e3f2fd; color: #1976d2; }
.fc-chip.gris { background: #eceff1; color: #546e7a; }
.fc-chip.morado { background: #f3e5f5; color: #7b1fa2; }

.fc-alerta { border-radius: 10px; padding: 14px 18px; display: flex; gap: 12px; align-items: flex-start; line-height: 1.5; }
.fc-alerta-icono { flex-shrink: 0; margin-top: 2px; }
.fc-alerta-cuerpo { flex: 1; }
.fc-alerta-titulo { font-weight: 700; font-size: 14px; margin-bottom: 3px; }
.fc-alerta-texto { font-size: 13px; }
.fc-alerta.critico { background: #ffebee; border: 1px solid #ef9a9a; color: #b71c1c; }
.fc-alerta.atencion { background: #fff8e1; border: 1px solid #ffe082; color: #8d6e00; }
.fc-alerta.info { background: #e3f2fd; border: 1px solid #90caf9; color: #1565c0; }
.fc-alerta.ok { background: #e8f5e9; border: 1px solid #a5d6a7; color: #2e7d32; }

.fc-explicacion { background: #fafafa; border: 1px solid #eee; border-radius: 10px; padding: 16px 20px; font-size: 13px; color: #555; line-height: 1.7; }
.fc-explicacion strong { color: #1a1a1a; }
.fc-explicacion .formula { display: inline-block; background: white; border: 1px solid #e0e0e0; border-radius: 6px; padding: 2px 8px; font-variant-numeric: tabular-nums; margin: 2px 0; }

.fc-config { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.fc-campo { display: flex; flex-direction: column; gap: 6px; }
.fc-label { font-size: 13px; font-weight: 600; color: #444; }
.fc-ayuda { font-size: 11px; color: #999; line-height: 1.4; }
.fc-input { width: 100%; padding: 11px 14px; border: 1.5px solid #e0e0e0; border-radius: 8px; font-size: 14px; background: #fafafa; font-family: inherit; color: #1a1a1a; transition: all 0.2s; }
.fc-input:focus { outline: none; border-color: #c62828; background: white; box-shadow: 0 0 0 3px rgba(198,40,40,0.08); }
.fc-input-num { text-align: right; font-variant-numeric: tabular-nums; font-weight: 600; }
.fc-select { padding: 11px 14px; border: 1.5px solid #e0e0e0; border-radius: 8px; font-size: 14px; background: white; cursor: pointer; font-family: inherit; width: 100%; }

.fc-periodo { border: 1px solid #e8e8e8; border-radius: 10px; padding: 14px 16px; margin-bottom: 10px; }
.fc-periodo.pagado { background: #f8fdf8; border-color: #c8e6c9; }
.fc-periodo.pendiente { background: #fffdf5; border-color: #ffe082; }
.fc-periodo.vencido { background: #fff5f5; border-color: #ef9a9a; }
.fc-periodo-cab { display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; margin-bottom: 8px; }
.fc-periodo-titulo { font-weight: 700; font-size: 14px; color: #1a1a1a; display: flex; align-items: center; gap: 8px; }
.fc-periodo-monto { font-size: 17px; font-weight: 700; font-variant-numeric: tabular-nums; }
.fc-periodo-detalle { font-size: 12px; color: #777; display: flex; gap: 16px; flex-wrap: wrap; }
.fc-barra-progreso { height: 6px; background: #eee; border-radius: 3px; overflow: hidden; margin-top: 8px; }
.fc-barra-progreso > div { height: 100%; background: #388e3c; border-radius: 3px; }

.fc-vacio { background: white; border-radius: 12px; padding: 50px 20px; text-align: center; color: #888; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
.fc-vacio h3 { color: #333; font-size: 18px; margin: 12px 0 6px; }
.fc-vacio p { margin-bottom: 20px; font-size: 14px; }
.fc-vacio-lista { color: #999; font-size: 13px; padding: 12px 0; font-style: italic; }

.fc-leyenda { display: flex; gap: 18px; flex-wrap: wrap; font-size: 12px; color: #777; margin-top: 10px; }
.fc-leyenda-item { display: flex; align-items: center; gap: 6px; }
.fc-leyenda-caja { width: 14px; height: 14px; border-radius: 3px; border: 1px solid #ddd; }

.fc-overlay { position: fixed; inset: 0; z-index: 2000; background: rgba(30,30,30,0.85); overflow-y: auto; padding: 20px; }
.fc-overlay-barra { max-width: 860px; margin: 0 auto 16px; display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; color: white; }
.fc-overlay-hoja { max-width: 860px; margin: 0 auto 40px; background: white; border-radius: 6px; box-shadow: 0 10px 40px rgba(0,0,0,0.4); padding: 48px 56px; }

.fc-toast { position: fixed; bottom: 24px; right: 24px; z-index: 3000; background: #388e3c; color: white; padding: 14px 20px; border-radius: 10px; font-size: 14px; font-weight: 500; display: flex; align-items: center; gap: 8px; box-shadow: 0 8px 24px rgba(0,0,0,0.2); }
.fc-toast.error { background: #c62828; }

@media (max-width: 1024px) {
  .fc-kpis { grid-template-columns: repeat(2, 1fr); }
  .fc-grid-2 { grid-template-columns: 1fr; }
  .fc-config { grid-template-columns: 1fr 1fr; }
}

@media (max-width: 768px) {
  .fc-barra { padding: 12px; }
  .fc-tabs { width: 100%; }
  .fc-tab { flex: 1; justify-content: center; padding: 9px 8px; font-size: 13px; }
  .fc-kpis { gap: 10px; }
  .fc-kpi { padding: 14px; }
  .fc-kpi-valor { font-size: 18px; }
  .fc-card { padding: 16px; }
  .fc-config { grid-template-columns: 1fr; }
  .fc-overlay { padding: 10px; }
  .fc-overlay-hoja { padding: 24px 18px; }
  .fc-toast { left: 16px; right: 16px; bottom: 16px; }
}
`;

// ============================================
// ESTILOS DEL INFORME IMPRIMIBLE
// ============================================

const STYLES_INFORME_FC = `
@page { size: letter landscape; margin: 12mm; }
.ifc-doc { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1a1a1a; font-size: 11px; line-height: 1.45; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.ifc-doc * { box-sizing: border-box; }
.ifc-cabecera { display: flex; justify-content: space-between; align-items: flex-start; gap: 20px; padding-bottom: 14px; border-bottom: 3px solid #c62828; margin-bottom: 18px; }
.ifc-marca { display: flex; align-items: center; gap: 12px; }
.ifc-institucion { font-size: 14px; font-weight: 800; line-height: 1.2; }
.ifc-institucion-sub { font-size: 9px; letter-spacing: 3px; color: #666; font-weight: 500; margin-top: 3px; }
.ifc-cabecera-der { text-align: right; }
.ifc-titulo { font-size: 15px; font-weight: 700; color: #c62828; }
.ifc-periodo { font-size: 12px; font-weight: 600; margin-top: 2px; }
.ifc-meta { font-size: 9px; color: #777; margin-top: 4px; }
.ifc-confidencial { display: inline-block; margin-top: 5px; background: #1a1a1a; color: white; font-size: 8px; font-weight: 700; letter-spacing: 1px; padding: 3px 8px; border-radius: 3px; text-transform: uppercase; }

.ifc-seccion { margin-bottom: 18px; }
.ifc-h2 { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #1a1a1a; border-left: 4px solid #c62828; padding-left: 9px; margin-bottom: 9px; }
.ifc-parrafo { margin-bottom: 5px; text-align: justify; }
.ifc-nota { font-size: 9px; color: #777; margin-top: 5px; font-style: italic; }

.ifc-kpis { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
.ifc-kpi { border: 1px solid #e0e0e0; border-top: 3px solid #c62828; border-radius: 4px; padding: 8px 10px; }
.ifc-kpi.verde { border-top-color: #388e3c; }
.ifc-kpi.azul { border-top-color: #1976d2; }
.ifc-kpi.morado { border-top-color: #7b1fa2; }
.ifc-kpi-label { font-size: 8px; font-weight: 700; color: #666; text-transform: uppercase; letter-spacing: 0.4px; }
.ifc-kpi-valor { font-size: 16px; font-weight: 800; margin-top: 3px; font-variant-numeric: tabular-nums; }
.ifc-kpi-sub { font-size: 8px; color: #888; margin-top: 2px; }

.ifc-tabla { width: 100%; border-collapse: collapse; font-size: 10px; }
.ifc-tabla th { background: #f2f2f2; text-align: left; padding: 5px 6px; font-size: 8px; font-weight: 700; color: #555; text-transform: uppercase; letter-spacing: 0.3px; border-bottom: 1.5px solid #ccc; }
.ifc-tabla td { padding: 5px 6px; border-bottom: 1px solid #eee; }
.ifc-tabla tr.futuro td { background: #fbfbfb; font-style: italic; color: #555; }
.ifc-tabla tr.actual td { background: #fff5f5; font-weight: 700; font-style: normal; }
.ifc-tabla tr.total td { font-weight: 800; background: #f7f7f7; border-top: 1.5px solid #ccc; }
.ifc-tabla .num { text-align: right; font-variant-numeric: tabular-nums; white-space: nowrap; }

.ifc-bien { color: #2e7d32; }
.ifc-mal { color: #c62828; }

.ifc-alerta { border-radius: 4px; padding: 8px 10px; margin-bottom: 6px; font-size: 10px; }
.ifc-alerta.critico { background: #ffebee; border: 1px solid #ef9a9a; color: #b71c1c; }
.ifc-alerta.atencion { background: #fff8e1; border: 1px solid #ffe082; color: #8d6e00; }
.ifc-alerta.info { background: #e3f2fd; border: 1px solid #90caf9; color: #1565c0; }
.ifc-alerta strong { display: block; margin-bottom: 2px; }

.ifc-grafico { border: 1px solid #eee; border-radius: 4px; padding: 8px 6px 4px; margin-top: 8px; }
.ifc-grafico-titulo { font-size: 9px; font-weight: 700; color: #555; text-transform: uppercase; letter-spacing: 0.4px; padding: 0 6px 5px; }

.ifc-pie { margin-top: 20px; padding-top: 9px; border-top: 1px solid #ddd; font-size: 8px; color: #888; display: flex; justify-content: space-between; gap: 10px; }
.ifc-sin-corte { break-inside: avoid; page-break-inside: avoid; }
`;
// ============================================
// IMPRESIÓN
// ============================================

const imprimirFlujo = (titulo) => {
  const nodo = document.getElementById('fc-informe-contenido');
  if (!nodo) return false;
  const w = window.open('', '_blank');
  if (!w) return false;
  w.document.open();
  w.document.write(
    `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>${titulo}</title>` +
    `<style>body{margin:0;background:white;}${STYLES_INFORME_FC}</style></head>` +
    `<body>${nodo.outerHTML}</body></html>`
  );
  w.document.close();
  w.focus();
  setTimeout(() => { w.print(); }, 500);
  return true;
};

// ============================================
// COMPONENTES PEQUEÑOS
// ============================================

// Tarjeta de indicador
const TarjetaFC = ({ etiqueta, icono, valor, color = '', sub }) => (
  <div className={`fc-kpi ${color}`}>
    <div className="fc-kpi-label">{icono}{etiqueta}</div>
    <div className="fc-kpi-valor">{valor}</div>
    {sub && <div className="fc-kpi-sub">{sub}</div>}
  </div>
);

// Aviso con nivel
const Alerta = ({ nivel, titulo, texto }) => {
  const Icono = nivel === 'critico' ? AlertTriangle
    : nivel === 'atencion' ? Clock
    : nivel === 'ok' ? CheckCircle
    : Info;
  return (
    <div className={`fc-alerta ${nivel}`}>
      <Icono size={18} className="fc-alerta-icono" />
      <div className="fc-alerta-cuerpo">
        <div className="fc-alerta-titulo">{titulo}</div>
        <div className="fc-alerta-texto">{texto}</div>
      </div>
    </div>
  );
};

// Campo de dinero con separador de miles
const InputPesosFC = ({ valor, onChange, placeholder = '0' }) => (
  <div style={{ position: 'relative' }}>
    <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#999', fontSize: 14, pointerEvents: 'none' }}>$</span>
    <input
      type="text"
      inputMode="numeric"
      className="fc-input fc-input-num"
      style={{ paddingLeft: 26 }}
      value={valor ? formatoNumero(valor) : ''}
      placeholder={placeholder}
      onChange={(e) => onChange(Number(String(e.target.value).replace(/[^\d]/g, '')) || 0)}
    />
  </div>
);

// Campo de porcentaje (se guarda como decimal: 19 % → 0.19)
const InputPorcentaje = ({ valor, onChange, permitirNegativo = false }) => {
  const mostrado = valor === null || valor === undefined ? '' : (valor * 100).toFixed(1).replace('.', ',');
  return (
    <div style={{ position: 'relative' }}>
      <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#999', fontSize: 14, pointerEvents: 'none' }}>%</span>
      <input
        type="text"
        inputMode="decimal"
        className="fc-input fc-input-num"
        style={{ paddingRight: 28 }}
        value={mostrado}
        onChange={(e) => {
          let t = String(e.target.value).replace(',', '.');
          t = permitirNegativo ? t.replace(/[^\d.-]/g, '') : t.replace(/[^\d.]/g, '');
          const n = parseFloat(t);
          onChange(isNaN(n) ? 0 : n / 100);
        }}
      />
    </div>
  );
};

// Logo institucional para el informe
const LogoInformeFC = () => (
  <svg width="38" height="38" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
    <polygon points="8,10 30,10 30,32 22,50 8,50" fill="#c62828" />
    <polygon points="30,10 52,10 52,50 38,50 30,32" fill="#1a1a1a" />
    <polygon points="30,10 52,10 30,32" fill="#c62828" />
  </svg>
);

// Tarjeta de un período de impuesto
const TarjetaPeriodo = ({ periodo, hoy }) => {
  const vencido = periodo.saldo > 0 && distanciaMeses(periodo.mesPago, hoy) > 0;
  const completo = periodo.saldo <= 1;
  const estado = completo ? 'pagado' : (vencido ? 'vencido' : 'pendiente');
  const pct = periodo.aPagar > 0 ? Math.min(100, (periodo.pagado / periodo.aPagar) * 100) : 100;
  const meses = distanciaMeses(hoy, periodo.mesPago);

  return (
    <div className={`fc-periodo ${estado}`}>
      <div className="fc-periodo-cab">
        <div className="fc-periodo-titulo">
          <Landmark size={16} color={periodo.tipo === 'IVA' ? COLORES.morado : COLORES.azul} />
          {periodo.tipo} · {periodo.periodo}
          {completo && <span className="fc-chip verde">Pagado</span>}
          {vencido && <span className="fc-chip rojo">Sin registrar</span>}
          {!completo && !vencido && meses === 0 && <span className="fc-chip naranja">Vence este mes</span>}
          {!completo && !vencido && meses > 0 && <span className="fc-chip gris">En {meses} {meses === 1 ? 'mes' : 'meses'}</span>}
        </div>
        <div className="fc-periodo-monto" style={{ color: completo ? COLORES.verde : (vencido ? COLORES.rojo : COLORES.oscuro) }}>
          {formatoPesos(completo ? periodo.aPagar : periodo.saldo)}
        </div>
      </div>
      <div className="fc-periodo-detalle">
        <span>Se paga en <strong>{nombreMes(periodo.mesPago)}</strong></span>
        <span>Causado: {formatoPesos(periodo.causado)}</span>
        {periodo.descontable > 0 && <span>Descontable: {formatoPesos(periodo.descontable)}</span>}
        <span>Pagado: {formatoPesos(periodo.pagado)}</span>
      </div>
      <div className="fc-barra-progreso">
        <div style={{ width: `${pct}%`, background: completo ? COLORES.verde : (vencido ? COLORES.rojo : COLORES.naranja) }} />
      </div>
    </div>
  );
};

// Explicación de cómo funciona el flujo (se muestra en la pestaña de ayuda)
const ExplicacionFlujo = ({ config }) => (
  <div className="fc-explicacion">
    <p style={{ marginBottom: 10 }}>
      <strong>Los tres saldos.</strong> El flujo distingue entre la plata que hay en el banco y la que realmente
      puedes comprometer:
    </p>
    <p style={{ marginBottom: 6 }}>
      · <strong>Caja total:</strong> todo el dinero disponible en el banco, con el IVA cobrado a los clientes incluido.
    </p>
    <p style={{ marginBottom: 6 }}>
      · <strong>Provisiones:</strong> plata que está en la cuenta pero no es de la Curaduría. Son el IVA que le
      cobraste a los clientes, el ICA causado y la provisión del impuesto de renta.
    </p>
    <p style={{ marginBottom: 10 }}>
      · <strong>Caja disponible:</strong> <span className="formula">Caja total − Provisiones</span>. Este es el número
      que importa para decidir.
    </p>
    <p style={{ marginBottom: 10 }}>
      <strong>Por qué los pagos de impuestos no deberían asustar.</strong> Cuando llega el pago del IVA, baja la caja
      total, pero también baja la provisión en el mismo monto. La caja disponible no se mueve. Si está bien
      provisionado, pagar impuestos no debilita la operación.
    </p>
    <p style={{ marginBottom: 6 }}>
      <strong>Cómo se calcula el IVA.</strong> Como los ingresos se registran con IVA incluido, la base gravable es
      <span className="formula">ingreso ÷ {(1 + config.tarifaIva).toFixed(2).replace('.', ',')}</span> y el IVA generado
      es la diferencia. Al IVA generado se le resta el IVA de los proveedores marcados como "genera IVA".
    </p>
    <p style={{ marginBottom: 10 }}>
      El IVA se paga por cuatrimestres: enero a abril se paga en mayo, mayo a agosto en septiembre, y septiembre a
      diciembre en enero del año siguiente.
    </p>
    <p style={{ marginBottom: 10 }}>
      <strong>ICA.</strong> Se causa sobre la base gravable con la tarifa configurada y se paga por bimestres, en el
      mes siguiente al cierre de cada uno.
    </p>
    <p style={{ marginBottom: 10 }}>
      <strong>Renta.</strong> Se estima como el {formatoPct(config.tarifaRenta * 100)} de la utilidad operativa
      acumulada del año y se proyecta para {MESES[config.mesPagoRenta - 1].toLowerCase()} del año siguiente. Es un
      estimado de caja para planear, no un cálculo tributario: la cifra real depende de deducciones, anticipos y
      retenciones. Conviene contrastarla con el contador.
    </p>
    <p>
      <strong>Meses futuros.</strong> Los ingresos se proyectan con el promedio de los últimos {config.mesesPromedio}{' '}
      meses registrados, ajustado en {formatoPct(config.ajusteIngresos * 100)}. Los gastos usan la nómina y los
      proveedores recurrentes del último mes cargado. Cada vez que registres un mes nuevo, la proyección se recalcula sola.
    </p>
  </div>
);
// ============================================
// PANEL DE CONFIGURACIÓN
// ============================================

const PanelConfig = ({ config, onCambiar, onGuardar, guardando, modificado, flujo }) => {
  const set = (campo, valor) => onCambiar({ ...config, [campo]: valor });
  const anios = [];
  for (let a = 2024; a <= new Date().getFullYear() + 1; a++) anios.push(a);

  return (
    <div className="fc-card">
      <div className="fc-card-titulo"><Settings size={16} color={COLORES.rojo} /> Configuración del flujo</div>
      <div className="fc-card-sub">
        Estos valores alimentan las proyecciones y las provisiones. Ajústalos una vez y el sistema los usa en adelante.
      </div>

      <div className="fc-config">
        <div className="fc-campo">
          <label className="fc-label">Saldo inicial de caja</label>
          <InputPesosFC valor={config.saldoInicial} onChange={(v) => set('saldoInicial', v)} />
          <span className="fc-ayuda">Dinero en el banco al comenzar el mes de arranque.</span>
        </div>

        <div className="fc-campo">
          <label className="fc-label">Mes de arranque</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <select
              className="fc-select"
              value={partesMes(config.mesSaldoInicial).mes}
              onChange={(e) => set('mesSaldoInicial', claveMes(partesMes(config.mesSaldoInicial).anio, Number(e.target.value)))}
            >
              {MESES.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
            </select>
            <select
              className="fc-select"
              value={partesMes(config.mesSaldoInicial).anio}
              onChange={(e) => set('mesSaldoInicial', claveMes(Number(e.target.value), partesMes(config.mesSaldoInicial).mes))}
            >
              {anios.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <span className="fc-ayuda">Desde este mes se construye el flujo.</span>
        </div>

        <div className="fc-campo">
          <label className="fc-label">Año de inicio de provisiones</label>
          <select className="fc-select" value={config.anioInicioProvisiones} onChange={(e) => set('anioInicioProvisiones', Number(e.target.value))}>
            {anios.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
          <span className="fc-ayuda">Los años anteriores se usan solo para el historial, no generan provisiones pendientes.</span>
        </div>

        <div className="fc-campo">
          <label className="fc-label">Tarifa de IVA</label>
          <InputPorcentaje valor={config.tarifaIva} onChange={(v) => set('tarifaIva', v)} />
          <span className="fc-ayuda">Normalmente 19 %.</span>
        </div>

        <div className="fc-campo">
          <label className="fc-label">Tarifa de ICA</label>
          <InputPorcentaje valor={config.tarifaIca} onChange={(v) => set('tarifaIca', v)} />
          <span className="fc-ayuda">Tarifa de Industria y Comercio sobre los ingresos. Confírmala con el contador.</span>
        </div>

        <div className="fc-campo">
          <label className="fc-label">Tarifa de renta</label>
          <InputPorcentaje valor={config.tarifaRenta} onChange={(v) => set('tarifaRenta', v)} />
          <span className="fc-ayuda">Se aplica sobre la utilidad del año. Estimado para planear la caja.</span>
        </div>

        <div className="fc-campo">
          <label className="fc-label">Meses para promediar ingresos</label>
          <select className="fc-select" value={config.mesesPromedio} onChange={(e) => set('mesesPromedio', Number(e.target.value))}>
            {[1, 2, 3, 4, 6, 12].map(n => <option key={n} value={n}>Últimos {n} {n === 1 ? 'mes' : 'meses'}</option>)}
          </select>
          <span className="fc-ayuda">
            {flujo ? `Promedio actual: ${formatoPesos(flujo.promedio)}` : 'Base para proyectar los meses futuros.'}
          </span>
        </div>

        <div className="fc-campo">
          <label className="fc-label">Ajuste a los ingresos proyectados</label>
          <InputPorcentaje valor={config.ajusteIngresos} onChange={(v) => set('ajusteIngresos', v)} permitirNegativo />
          <span className="fc-ayuda">
            Sube o baja la proyección. Usa negativo para escenarios conservadores.
            {flujo ? ` Proyección: ${formatoPesos(flujo.ingresoProyectado)} por mes.` : ''}
          </span>
        </div>

        <div className="fc-campo">
          <label className="fc-label">Mes de pago de la renta</label>
          <select className="fc-select" value={config.mesPagoRenta} onChange={(e) => set('mesPagoRenta', Number(e.target.value))}>
            {MESES.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
          </select>
          <span className="fc-ayuda">La renta de un año se paga en este mes del año siguiente.</span>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 18, gap: 10 }}>
        <button className="fc-btn fc-btn-primario" onClick={onGuardar} disabled={guardando || !modificado}>
          <CheckCircle size={16} /> {guardando ? 'Guardando...' : (modificado ? 'Guardar configuración' : 'Guardado')}
        </button>
      </div>
    </div>
  );
};

// ============================================
// TABLA DEL FLUJO DE CAJA
// ============================================

const TablaFlujo = ({ filas, hoy, compacta = false }) => (
  <div className="fc-tabla">
    <table>
      <thead>
        <tr>
          <th>Mes</th>
          <th className="num">Saldo inicial</th>
          <th className="num">Entradas</th>
          <th className="num">Nómina</th>
          <th className="num">Proveedores</th>
          {!compacta && <th className="num">Primas</th>}
          <th className="num">Impuestos</th>
          <th className="num">Flujo neto</th>
          <th className="num">Caja total</th>
          <th className="num">Provisiones</th>
          <th className="num">Caja disponible</th>
        </tr>
      </thead>
      <tbody>
        {filas.map(f => {
          const clase = f.esMesActual ? 'actual' : (f.disponible < 0 ? 'alerta' : (f.esReal ? '' : 'futuro'));
          return (
            <tr key={f.clave} className={clase}>
              <td>
                <strong>{f.nombre}</strong>
                {!f.esReal && <span className="fc-chip gris" style={{ marginLeft: 6 }}>Proyectado</span>}
                {f.esMesActual && <span className="fc-chip naranja" style={{ marginLeft: 6 }}>Mes actual</span>}
              </td>
              <td className="num">{formatoPesos(f.saldoInicial)}</td>
              <td className="num" style={{ color: COLORES.verde }}>{formatoPesos(f.entradas)}</td>
              <td className="num">{formatoPesos(f.nomina)}</td>
              <td className="num">{formatoPesos(f.proveedores)}</td>
              {!compacta && <td className="num">{f.prestaciones > 0 ? formatoPesos(f.prestaciones) : '—'}</td>}
              <td className="num" style={{ color: f.totalPagos > 0 ? COLORES.morado : '#bbb' }}>
                {f.totalPagos > 0 ? formatoPesos(f.totalPagos) : '—'}
              </td>
              <td className="num" style={{ color: f.flujoNeto >= 0 ? COLORES.verde : COLORES.rojo }}>
                {formatoPesos(f.flujoNeto)}
              </td>
              <td className="num"><strong>{formatoPesos(f.caja)}</strong></td>
              <td className="num" style={{ color: COLORES.naranja }}>{formatoPesos(f.provisionTotal)}</td>
              <td className="num">
                <strong style={{ color: f.disponible >= 0 ? COLORES.verde : COLORES.rojo }}>
                  {formatoPesos(f.disponible)}
                </strong>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

// Leyenda de la tabla
const LeyendaTabla = () => (
  <div className="fc-leyenda">
    <span className="fc-leyenda-item"><span className="fc-leyenda-caja" style={{ background: 'white' }} /> Mes registrado</span>
    <span className="fc-leyenda-item"><span className="fc-leyenda-caja" style={{ background: '#fcfcfc' }} /> Proyectado</span>
    <span className="fc-leyenda-item"><span className="fc-leyenda-caja" style={{ background: '#fff5f5' }} /> Mes actual</span>
    <span className="fc-leyenda-item"><span className="fc-leyenda-caja" style={{ background: '#ffebee' }} /> Caja disponible negativa</span>
  </div>
);
// ============================================
// PANEL DE PROVISIONES
// ============================================

const PanelProvisiones = ({ flujo, config, hoy }) => {
  const actual = flujo.filas.find(f => f.clave === hoy) || flujo.filas[flujo.filas.length - 1];
  const pendientesIva = flujo.periodos.iva.filter(p => p.saldo > 0 || distanciaMeses(hoy, p.mesPago) >= -2);
  const pendientesIca = flujo.periodos.ica.filter(p => p.saldo > 0 || distanciaMeses(hoy, p.mesPago) >= -2);
  const rentasVivas = flujo.rentas.filter(r => r.saldo > 0);

  return (
    <div className="fc-wrap">
      <div className="fc-kpis">
        <TarjetaFC
          etiqueta="Provisión de IVA"
          icono={<Landmark size={14} />}
          valor={formatoPesos(actual.provIva)}
          color="morado"
          sub="IVA cobrado a clientes, pendiente de pagar a la DIAN"
        />
        <TarjetaFC
          etiqueta="Provisión de ICA"
          icono={<Landmark size={14} />}
          valor={formatoPesos(actual.provIca)}
          color="azul"
          sub="Industria y Comercio causado sin pagar"
        />
        <TarjetaFC
          etiqueta="Provisión de renta"
          icono={<PiggyBank size={14} />}
          valor={formatoPesos(actual.provRenta)}
          color="naranja"
          sub={`Estimado al ${formatoPct(config.tarifaRenta * 100)} de la utilidad del año`}
        />
        <TarjetaFC
          etiqueta="Total provisionado"
          icono={<ShieldCheck size={14} />}
          valor={formatoPesos(actual.provisionTotal)}
          color="oscuro"
          sub="Plata en el banco que no es de la Curaduría"
        />
      </div>

      <div className="fc-grid-2">
        <div className="fc-card">
          <div className="fc-card-titulo"><Landmark size={16} color={COLORES.morado} /> IVA por cuatrimestre</div>
          <div className="fc-card-sub">Se paga en enero, mayo y septiembre, por el cuatrimestre anterior</div>
          {pendientesIva.length === 0 && <div className="fc-vacio-lista">Sin períodos de IVA en el rango.</div>}
          {pendientesIva.map(p => <TarjetaPeriodo key={p.mesPago + p.periodo} periodo={p} hoy={hoy} />)}
        </div>

        <div className="fc-card">
          <div className="fc-card-titulo"><Landmark size={16} color={COLORES.azul} /> ICA por bimestre</div>
          <div className="fc-card-sub">Se paga en el mes siguiente al cierre de cada bimestre</div>
          {pendientesIca.length === 0 && <div className="fc-vacio-lista">Sin períodos de ICA en el rango.</div>}
          {pendientesIca.map(p => <TarjetaPeriodo key={p.mesPago + p.periodo} periodo={p} hoy={hoy} />)}
        </div>
      </div>

      <div className="fc-card">
        <div className="fc-card-titulo"><PiggyBank size={16} color={COLORES.naranja} /> Impuesto de renta</div>
        <div className="fc-card-sub">
          Estimado sobre la utilidad operativa del año. Es una proyección de caja, no un cálculo tributario:
          el valor real depende de deducciones, anticipos y retenciones. Contrástalo con el contador.
        </div>
        <div className="fc-tabla">
          <table style={{ minWidth: 0 }}>
            <thead>
              <tr>
                <th>Año</th>
                <th className="num">Utilidad acumulada</th>
                <th className="num">Renta estimada</th>
                <th className="num">Pagado</th>
                <th className="num">Saldo</th>
                <th>Se paga en</th>
              </tr>
            </thead>
            <tbody>
              {flujo.rentas.length === 0 && (
                <tr><td colSpan="6" style={{ textAlign: 'center', color: '#999', padding: 30 }}>Sin datos suficientes</td></tr>
              )}
              {flujo.rentas.map(r => (
                <tr key={r.anio}>
                  <td><strong>{r.anio}</strong> <span style={{ color: '#999', fontSize: 12 }}>({r.meses} meses)</span></td>
                  <td className="num">{formatoPesos(r.utilidad)}</td>
                  <td className="num">{formatoPesos(r.estimado)}</td>
                  <td className="num">{formatoPesos(r.pagado)}</td>
                  <td className="num"><strong style={{ color: r.saldo > 0 ? COLORES.naranja : COLORES.verde }}>{formatoPesos(r.saldo)}</strong></td>
                  <td>{nombreMes(r.mesPago)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="fc-card">
        <div className="fc-card-titulo">Evolución de las provisiones</div>
        <div className="fc-card-sub">Cómo se acumulan y se descargan al pagar</div>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={flujo.filas} margin={{ top: 10, right: 5, left: 5, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis dataKey="etiqueta" tick={{ fontSize: 11 }} />
            <YAxis tickFormatter={formatoPesosCorto} tick={{ fontSize: 11 }} width={78} />
            <Tooltip formatter={(v) => formatoPesos(v)} />
            <Legend />
            <Area type="monotone" dataKey="provIva" name="IVA" stackId="1" stroke={COLORES.morado} fill={COLORES.morado} fillOpacity={0.5} />
            <Area type="monotone" dataKey="provIca" name="ICA" stackId="1" stroke={COLORES.azul} fill={COLORES.azul} fillOpacity={0.5} />
            <Area type="monotone" dataKey="provRenta" name="Renta" stackId="1" stroke={COLORES.naranja} fill={COLORES.naranja} fillOpacity={0.5} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// ============================================
// CALENDARIO DE PAGOS
// ============================================

const CalendarioPagos = ({ flujo, hoy }) => {
  const conPagos = flujo.filas.filter(f => f.totalPagos > 0);
  const futuros = conPagos.filter(f => distanciaMeses(hoy, f.clave) >= 0);
  const pasados = conPagos.filter(f => distanciaMeses(hoy, f.clave) < 0).slice(-6);

  const fila = (f) => {
    const cubre = f.caja >= 0;
    return (
      <tr key={f.clave} className={f.esReal ? '' : 'futuro'}>
        <td><strong>{f.nombre}</strong></td>
        <td>
          {f.pagosMes.map((p, i) => (
            <span key={i} className={`fc-chip ${p.tipo === 'IVA' ? 'morado' : p.tipo === 'ICA' ? 'azul' : p.tipo === 'Renta' ? 'naranja' : 'gris'}`} style={{ marginRight: 6 }}>
              {p.tipo} {formatoPesos(p.monto)}
            </span>
          ))}
        </td>
        <td className="num"><strong>{formatoPesos(f.totalPagos)}</strong></td>
        <td className="num">{formatoPesos(f.caja)}</td>
        <td>
          {f.esReal
            ? <span className="fc-chip verde">Pagado</span>
            : (cubre ? <span className="fc-chip verde">Caja alcanza</span> : <span className="fc-chip rojo">Caja insuficiente</span>)}
        </td>
      </tr>
    );
  };

  return (
    <div className="fc-wrap">
      <div className="fc-card">
        <div className="fc-card-titulo"><Calendar size={16} color={COLORES.rojo} /> Próximos pagos de impuestos</div>
        <div className="fc-card-sub">
          Calculados con lo que ya tienes registrado. El valor es el saldo pendiente de cada período.
        </div>
        <div className="fc-tabla">
          <table style={{ minWidth: 0 }}>
            <thead>
              <tr><th>Mes</th><th>Detalle</th><th className="num">Total</th><th className="num">Caja proyectada</th><th>Estado</th></tr>
            </thead>
            <tbody>
              {futuros.length === 0 && (
                <tr><td colSpan="5" style={{ textAlign: 'center', color: '#999', padding: 30 }}>No hay pagos pendientes proyectados</td></tr>
              )}
              {futuros.map(fila)}
            </tbody>
          </table>
        </div>
      </div>

      {pasados.length > 0 && (
        <div className="fc-card">
          <div className="fc-card-titulo">Pagos registrados recientemente</div>
          <div className="fc-card-sub">Últimos meses con impuestos pagados</div>
          <div className="fc-tabla">
            <table style={{ minWidth: 0 }}>
              <thead>
                <tr><th>Mes</th><th>Detalle</th><th className="num">Total</th><th className="num">Caja</th><th>Estado</th></tr>
              </thead>
              <tbody>{pasados.map(fila)}</tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================
// INFORME IMPRIMIBLE
// ============================================

const InformeFlujo = ({ flujo, config, alertas, hoy }) => {
  const actual = flujo.filas.find(f => f.clave === hoy) || flujo.filas[flujo.filas.length - 1];
  const futuras = flujo.filas.filter(f => distanciaMeses(hoy, f.clave) >= 0).slice(0, 13);
  const proximoPago = futuras.find(f => f.totalPagos > 0);
  const minima = futuras.reduce((m, f) => (f.disponible < m.disponible ? f : m), futuras[0]);

  return (
    <div id="fc-informe-contenido" className="ifc-doc">
      <div className="ifc-cabecera">
        <div className="ifc-marca">
          <LogoInformeFC />
          <div>
            <div className="ifc-institucion">CURADURÍA URBANA N.° 2 DE PEREIRA</div>
            <div className="ifc-institucion-sub">PEREIRA · RISARALDA</div>
          </div>
        </div>
        <div className="ifc-cabecera-der">
          <div className="ifc-titulo">Flujo de Caja y Proyección</div>
          <div className="ifc-periodo">{nombreMes(hoy)}</div>
          <div className="ifc-meta">Generado el {formatoFechaHora(new Date().toISOString())}</div>
          <div className="ifc-confidencial">Confidencial · Uso exclusivo de la Junta</div>
        </div>
      </div>

      <div className="ifc-seccion ifc-sin-corte">
        <div className="ifc-h2">1. Situación de caja</div>
        <div className="ifc-kpis">
          <div className="ifc-kpi">
            <div className="ifc-kpi-label">Caja total</div>
            <div className="ifc-kpi-valor">{formatoPesos(actual.caja)}</div>
            <div className="ifc-kpi-sub">Dinero en banco</div>
          </div>
          <div className="ifc-kpi morado">
            <div className="ifc-kpi-label">Provisiones</div>
            <div className="ifc-kpi-valor">{formatoPesos(actual.provisionTotal)}</div>
            <div className="ifc-kpi-sub">IVA, ICA y renta por pagar</div>
          </div>
          <div className="ifc-kpi verde">
            <div className="ifc-kpi-label">Caja disponible</div>
            <div className="ifc-kpi-valor">{formatoPesos(actual.disponible)}</div>
            <div className="ifc-kpi-sub">Libre de compromisos tributarios</div>
          </div>
          <div className="ifc-kpi azul">
            <div className="ifc-kpi-label">Próximo pago</div>
            <div className="ifc-kpi-valor">{proximoPago ? formatoPesos(proximoPago.totalPagos) : '—'}</div>
            <div className="ifc-kpi-sub">{proximoPago ? nombreMes(proximoPago.clave) : 'Sin pagos próximos'}</div>
          </div>
        </div>
        <p className="ifc-parrafo" style={{ marginTop: 10 }}>
          La caja disponible corresponde al dinero en banco menos las provisiones de impuestos ya causados.
          Es el saldo que la Curaduría puede comprometer sin afectar el cumplimiento tributario.
          {minima && minima.disponible < actual.disponible && (
            <> En los próximos doce meses, el punto más bajo proyectado se daría en {minima.nombre},
            con {formatoPesos(minima.disponible)}.</>
          )}
        </p>
      </div>

      {alertas.length > 0 && (
        <div className="ifc-seccion ifc-sin-corte">
          <div className="ifc-h2">2. Alertas</div>
          {alertas.slice(0, 6).map((a, i) => (
            <div key={i} className={`ifc-alerta ${a.nivel}`}>
              <strong>{a.titulo}</strong>
              {a.texto}
            </div>
          ))}
        </div>
      )}

      <div className="ifc-seccion">
        <div className="ifc-h2">{alertas.length > 0 ? '3' : '2'}. Proyección a doce meses</div>
        <table className="ifc-tabla">
          <thead>
            <tr>
              <th>Mes</th>
              <th className="num">Entradas</th>
              <th className="num">Gastos</th>
              <th className="num">Impuestos</th>
              <th className="num">Flujo neto</th>
              <th className="num">Caja total</th>
              <th className="num">Provisiones</th>
              <th className="num">Disponible</th>
            </tr>
          </thead>
          <tbody>
            {futuras.map(f => (
              <tr key={f.clave} className={f.esMesActual ? 'actual' : (f.esReal ? '' : 'futuro')}>
                <td>{f.nombre}{!f.esReal && ' (proy.)'}</td>
                <td className="num">{formatoPesos(f.entradas)}</td>
                <td className="num">{formatoPesos(f.salidas)}</td>
                <td className="num">{f.totalPagos > 0 ? formatoPesos(f.totalPagos) : '—'}</td>
                <td className={`num ${f.flujoNeto >= 0 ? 'ifc-bien' : 'ifc-mal'}`}>{formatoPesos(f.flujoNeto)}</td>
                <td className="num">{formatoPesos(f.caja)}</td>
                <td className="num">{formatoPesos(f.provisionTotal)}</td>
                <td className={`num ${f.disponible >= 0 ? 'ifc-bien' : 'ifc-mal'}`}><strong>{formatoPesos(f.disponible)}</strong></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="ifc-nota">
          Los meses marcados como proyección usan el promedio de ingresos de los últimos {config.mesesPromedio} meses
          {config.ajusteIngresos !== 0 ? `, ajustado en ${formatoPct(config.ajusteIngresos * 100)}` : ''}, y los gastos
          recurrentes del último mes registrado.
        </div>
      </div>

      <div className="ifc-seccion ifc-sin-corte">
        <div className="ifc-h2">{alertas.length > 0 ? '4' : '3'}. Calendario tributario</div>
        <table className="ifc-tabla">
          <thead>
            <tr><th>Impuesto</th><th>Período</th><th>Se paga en</th><th className="num">Saldo</th></tr>
          </thead>
          <tbody>
            {[...flujo.periodos.iva, ...flujo.periodos.ica]
              .filter(p => p.saldo > 0)
              .sort((a, b) => a.mesPago.localeCompare(b.mesPago))
              .slice(0, 10)
              .map(p => (
                <tr key={p.tipo + p.periodo}>
                  <td>{p.tipo}</td>
                  <td>{p.periodo}</td>
                  <td>{nombreMes(p.mesPago)}</td>
                  <td className="num">{formatoPesos(p.saldo)}</td>
                </tr>
              ))}
            {flujo.rentas.filter(r => r.saldo > 0).map(r => (
              <tr key={`renta${r.anio}`}>
                <td>Renta</td>
                <td>Año {r.anio}</td>
                <td>{nombreMes(r.mesPago)}</td>
                <td className="num">{formatoPesos(r.saldo)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="ifc-nota">
          El impuesto de renta es un estimado de caja calculado sobre la utilidad operativa; el valor definitivo
          lo determina la declaración tributaria.
        </div>
      </div>

      <div className="ifc-pie">
        <span>Curaduría Urbana N.° 2 de Pereira · Flujo de Caja · {nombreMes(hoy)}</span>
        <span>Documento confidencial</span>
      </div>
    </div>
  );
};
// ============================================
// COMPONENTE PRINCIPAL: FLUJO DE CAJA
// ============================================
// Uso desde Finanzas.jsx:
//   import FlujoCaja from './FlujoCaja.jsx';
//   <FlujoCaja meses={meses} config={config} onGuardarConfig={fn} />

export const CONFIG_FLUJO_POR_DEFECTO = {
  saldoInicial: 0,
  mesSaldoInicial: '2026-01',
  tarifaIva: 0.19,
  tarifaIca: 0.0069,
  tarifaRenta: 0.35,
  ajusteIngresos: 0,
  mesesPromedio: 3,
  mesPagoRenta: 9,
  anioInicioProvisiones: 2026,
  ingresosManuales: {}
};

export default function FlujoCaja({ meses = {}, config: configGuardada, onGuardarConfig }) {
  const hoy = mesActual();

  const [config, setConfig] = useState({ ...CONFIG_FLUJO_POR_DEFECTO, ...(configGuardada || {}) });
  const [modificado, setModificado] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [pestana, setPestana] = useState('resumen');
  const [mostrarInforme, setMostrarInforme] = useState(false);
  const [toast, setToast] = useState(null);

  const flujo = useMemo(() => construirFlujo(meses, config), [meses, config]);
  const alertas = useMemo(() => generarAlertas(flujo, config), [flujo, config]);

  const cambiarConfig = (nueva) => {
    setConfig(nueva);
    setModificado(true);
  };

  const guardarConfig = async () => {
    if (!onGuardarConfig) return;
    setGuardando(true);
    try {
      await onGuardarConfig(config);
      setModificado(false);
      setToast({ texto: 'Configuración guardada', tipo: 'ok' });
    } catch (e) {
      setToast({ texto: `No se pudo guardar: ${e.message}`, tipo: 'error' });
    } finally {
      setGuardando(false);
    }
  };

  const imprimir = () => {
    const ok = imprimirFlujo(`Flujo de Caja - Curaduría Urbana 2 Pereira - ${nombreMes(hoy)}`);
    if (!ok) setToast({ texto: 'El navegador bloqueó la ventana. Permite ventanas emergentes para este sitio.', tipo: 'error' });
  };

  // ---------- SIN DATOS ----------
  if (!flujo) {
    return (
      <div className="fc-vacio">
        <style>{STYLES_FLUJO}</style>
        <Wallet size={40} color="#ccc" />
        <h3>Aún no hay meses registrados</h3>
        <p>El flujo de caja se construye con la información que registras en "Registrar mes". Carga al menos un mes para empezar.</p>
      </div>
    );
  }

  const actual = flujo.filas.find(f => f.clave === hoy) || flujo.filas[flujo.filas.length - 1];
  const futuras = flujo.filas.filter(f => distanciaMeses(hoy, f.clave) >= 0);
  const proximoPago = futuras.find(f => f.totalPagos > 0);
  const minima = futuras.length > 0 ? futuras.reduce((m, f) => (f.disponible < m.disponible ? f : m), futuras[0]) : null;
  const criticas = alertas.filter(a => a.nivel === 'critico').length;

  // ---------- PANTALLA ----------
  return (
    <div className="fc-wrap">
      <style>{STYLES_FLUJO}</style>

      <div className="fc-barra">
        <div className="fc-tabs">
          <button className={`fc-tab ${pestana === 'resumen' ? 'active' : ''}`} onClick={() => setPestana('resumen')}>
            <Wallet size={15} /> Resumen
          </button>
          <button className={`fc-tab ${pestana === 'proyeccion' ? 'active' : ''}`} onClick={() => setPestana('proyeccion')}>
            <TrendingUp size={15} /> Proyección
          </button>
          <button className={`fc-tab ${pestana === 'provisiones' ? 'active' : ''}`} onClick={() => setPestana('provisiones')}>
            <PiggyBank size={15} /> Provisiones
          </button>
          <button className={`fc-tab ${pestana === 'calendario' ? 'active' : ''}`} onClick={() => setPestana('calendario')}>
            <Calendar size={15} /> Calendario
          </button>
          <button className={`fc-tab ${pestana === 'config' ? 'active' : ''}`} onClick={() => setPestana('config')}>
            <Settings size={15} /> Ajustes{modificado ? ' •' : ''}
          </button>
        </div>

        <button className="fc-btn fc-btn-oscuro" onClick={() => setMostrarInforme(true)}>
          <Printer size={16} /> Generar informe de flujo
        </button>
      </div>

      {/* ---------- RESUMEN ---------- */}
      {pestana === 'resumen' && (
        <>
          <div className="fc-kpis">
            <TarjetaFC
              etiqueta="Caja total"
              icono={<Wallet size={14} />}
              valor={formatoPesos(actual.caja)}
              color="oscuro"
              sub={`Dinero en banco al cierre de ${actual.nombre}`}
            />
            <TarjetaFC
              etiqueta="Provisiones"
              icono={<ShieldCheck size={14} />}
              valor={formatoPesos(actual.provisionTotal)}
              color="morado"
              sub="IVA, ICA y renta causados sin pagar"
            />
            <TarjetaFC
              etiqueta="Caja disponible"
              icono={<CheckCircle size={14} />}
              valor={formatoPesos(actual.disponible)}
              color={actual.disponible >= 0 ? 'verde' : 'rojo'}
              sub="Lo que realmente puedes comprometer"
            />
            <TarjetaFC
              etiqueta="Próximo pago de impuestos"
              icono={<Calendar size={14} />}
              valor={proximoPago ? formatoPesos(proximoPago.totalPagos) : '—'}
              color="azul"
              sub={proximoPago ? `${proximoPago.nombre} · ${proximoPago.pagosMes.map(p => p.tipo).join(', ')}` : 'Sin pagos pendientes'}
            />
          </div>

          {alertas.length === 0 ? (
            <Alerta nivel="ok" titulo="Todo en orden" texto="No hay alertas de caja ni vencimientos próximos sin cubrir." />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {alertas.slice(0, 5).map((a, i) => (
                <Alerta key={i} nivel={a.nivel} titulo={a.titulo} texto={a.texto} />
              ))}
              {alertas.length > 5 && (
                <div className="fc-card-sub" style={{ margin: 0 }}>
                  Y {alertas.length - 5} {alertas.length - 5 === 1 ? 'alerta más' : 'alertas más'}.
                </div>
              )}
            </div>
          )}

          <div className="fc-card">
            <div className="fc-card-titulo">Caja total vs. caja disponible</div>
            <div className="fc-card-sub">
              La distancia entre las dos líneas es lo que está provisionado para impuestos.
              Las barras moradas son los pagos de impuestos.
            </div>
            <ResponsiveContainer width="100%" height={330}>
              <ComposedChart data={flujo.filas} margin={{ top: 10, right: 5, left: 5, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="etiqueta" tick={{ fontSize: 11 }} />
                <YAxis tickFormatter={formatoPesosCorto} tick={{ fontSize: 11 }} width={78} />
                <Tooltip formatter={(v) => formatoPesos(v)} />
                <Legend />
                <ReferenceLine y={0} stroke="#999" />
                <Bar dataKey="totalPagos" name="Pagos de impuestos" fill={COLORES.morado} radius={[4, 4, 0, 0]} />
                <Line type="monotone" dataKey="caja" name="Caja total" stroke={COLORES.oscuro} strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="disponible" name="Caja disponible" stroke={COLORES.verde} strokeWidth={3} dot={{ r: 4 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="fc-card">
            <div className="fc-card-titulo">Entradas y salidas por mes</div>
            <div className="fc-card-sub">Los meses futuros son proyecciones</div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={flujo.filas} margin={{ top: 5, right: 5, left: 5, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="etiqueta" tick={{ fontSize: 11 }} />
                <YAxis tickFormatter={formatoPesosCorto} tick={{ fontSize: 11 }} width={78} />
                <Tooltip formatter={(v) => formatoPesos(v)} />
                <Legend />
                <Bar dataKey="entradas" name="Entradas" fill={COLORES.verde} radius={[4, 4, 0, 0]} />
                <Bar dataKey="salidas" name="Gastos operativos" fill={COLORES.rojo} radius={[4, 4, 0, 0]} />
                <Bar dataKey="totalPagos" name="Impuestos" fill={COLORES.morado} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {/* ---------- PROYECCIÓN ---------- */}
      {pestana === 'proyeccion' && (
        <>
          <div className="fc-card">
            <div className="fc-card-titulo"><TrendingUp size={16} color={COLORES.rojo} /> Flujo mes a mes</div>
            <div className="fc-card-sub">
              Desde {nombreMes(config.mesSaldoInicial)} hasta {nombreMes(flujo.filas[flujo.filas.length - 1].clave)}.
              Los meses registrados usan datos reales; los demás, proyecciones.
              {minima && <> El punto más bajo de caja disponible se daría en <strong>{minima.nombre}</strong> con {formatoPesos(minima.disponible)}.</>}
            </div>
            <TablaFlujo filas={flujo.filas} hoy={hoy} />
            <LeyendaTabla />
          </div>

          <div className="fc-card">
            <div className="fc-card-titulo">Bases de la proyección</div>
            <div className="fc-card-sub">De dónde salen las cifras de los meses futuros</div>
            <div className="fc-tabla">
              <table style={{ minWidth: 0 }}>
                <tbody>
                  <tr>
                    <td>Meses registrados</td>
                    <td className="num"><strong>{flujo.mesesRegistrados}</strong> ({nombreMes(flujo.primerReal)} a {nombreMes(flujo.ultimoReal)})</td>
                  </tr>
                  <tr>
                    <td>Promedio de ingresos (últimos {config.mesesPromedio} meses)</td>
                    <td className="num">{formatoPesos(flujo.promedio)}</td>
                  </tr>
                  <tr>
                    <td>Ajuste aplicado</td>
                    <td className="num">{formatoPct(config.ajusteIngresos * 100)}</td>
                  </tr>
                  <tr className="total">
                    <td>Ingreso proyectado por mes</td>
                    <td className="num">{formatoPesos(flujo.ingresoProyectado)}</td>
                  </tr>
                  <tr>
                    <td>Nómina recurrente ({flujo.recurrentes.empleados} empleados)</td>
                    <td className="num">{formatoPesos(flujo.recurrentes.nomina)}</td>
                  </tr>
                  <tr>
                    <td>Proveedores recurrentes</td>
                    <td className="num">{formatoPesos(flujo.recurrentes.proveedores)}</td>
                  </tr>
                  <tr className="total">
                    <td>Gasto recurrente por mes</td>
                    <td className="num">{formatoPesos(flujo.recurrentes.total)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="fc-card-sub" style={{ marginTop: 12, marginBottom: 0 }}>
              Los gastos recurrentes se toman de {flujo.recurrentes.mesBase ? nombreMes(flujo.recurrentes.mesBase) : 'el último mes registrado'}.
              Las primas y cesantías se proyectan según lo pagado en ese mismo mes en años anteriores.
            </div>
          </div>
        </>
      )}

      {/* ---------- PROVISIONES ---------- */}
      {pestana === 'provisiones' && <PanelProvisiones flujo={flujo} config={config} hoy={hoy} />}

      {/* ---------- CALENDARIO ---------- */}
      {pestana === 'calendario' && <CalendarioPagos flujo={flujo} hoy={hoy} />}

      {/* ---------- AJUSTES ---------- */}
      {pestana === 'config' && (
        <>
          <PanelConfig
            config={config}
            onCambiar={cambiarConfig}
            onGuardar={guardarConfig}
            guardando={guardando}
            modificado={modificado}
            flujo={flujo}
          />
          <div className="fc-card">
            <div className="fc-card-titulo"><Info size={16} color={COLORES.azul} /> Cómo funciona el flujo</div>
            <div className="fc-card-sub">Para que los números no sorprendan a nadie en la Junta</div>
            <ExplicacionFlujo config={config} />
          </div>
          {alertas.length > 0 && (
            <div className="fc-card">
              <div className="fc-card-titulo">Todas las alertas ({alertas.length})</div>
              <div className="fc-card-sub">{criticas > 0 ? `${criticas} ${criticas === 1 ? 'crítica' : 'críticas'}` : 'Ninguna crítica'}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {alertas.map((a, i) => <Alerta key={i} nivel={a.nivel} titulo={a.titulo} texto={a.texto} />)}
              </div>
            </div>
          )}
        </>
      )}

      {/* ---------- INFORME ---------- */}
      {mostrarInforme && (
        <div className="fc-overlay" onClick={() => setMostrarInforme(false)}>
          <div className="fc-overlay-barra" onClick={(e) => e.stopPropagation()}>
            <strong style={{ fontSize: 16 }}>Informe de Flujo de Caja · {nombreMes(hoy)}</strong>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button className="fc-btn fc-btn-primario" onClick={imprimir}>
                <Printer size={16} /> Imprimir / Guardar PDF
              </button>
              <button className="fc-btn fc-btn-secundario" onClick={() => setMostrarInforme(false)}>
                <X size={16} /> Cerrar
              </button>
            </div>
          </div>
          <div className="fc-overlay-hoja" onClick={(e) => e.stopPropagation()}>
            <style>{STYLES_INFORME_FC}</style>
            <InformeFlujo flujo={flujo} config={config} alertas={alertas} hoy={hoy} />
          </div>
        </div>
      )}

      {toast && (
        <div className={`fc-toast ${toast.tipo === 'error' ? 'error' : ''}`} onClick={() => setToast(null)}>
          {toast.tipo === 'error' ? <AlertTriangle size={16} /> : <CheckCircle size={16} />}
          {toast.texto}
        </div>
      )}
    </div>
  );
}
