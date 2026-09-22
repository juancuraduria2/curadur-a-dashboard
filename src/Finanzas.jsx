import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Wallet, TrendingUp, TrendingDown, FileText, CheckCircle, Save, Plus, Trash2, Copy, Printer, ArrowUpRight, ArrowDownRight, Minus, Lock, AlertTriangle, Users, Truck, Gift, ClipboardList, X, RefreshCw } from 'lucide-react';

// ============================================
// MÓDULO INGRESOS Y FINANZAS
// Curaduría Urbana N.° 2 de Pereira
// ============================================
// Acceso exclusivo: juanmontes y luisfernando.
// El servidor (api/finanzas.js) también valida el acceso.
//
// MAPA DEL ARCHIVO
// Parte 1: imports, constantes, formatos y cálculos
// Parte 2: STYLES_FINANZAS (estilos de la pantalla)
// Parte 3: STYLES_INFORME + componentes pequeños (InputPesos, TarjetaKPI, BadgeVariacion)
// Parte 4: InformeJunta (informe imprimible para la Junta)
// Parte 5: FormularioMes (pestaña "Registrar mes")
// Parte 6: ResumenMes (pestaña "Resumen")
// Parte 7: componente principal Finanzas (export default)
//
// Estructura de un mes (igual a api/finanzas.js):
// { ingresos: { variable, fijo, unico }, ivaIncluido,
//   nomina: [{ nombre, valor }], prestaciones: [{ concepto, valor }],
//   proveedores: [{ nombre, concepto, valor }],
//   radicados, expedidos, notas, actualizado, actualizadoPor }

// ============================================
// ACCESO
// ============================================

export const USUARIOS_FINANZAS = ['juanmontes', 'luisfernando'];

export const puedeVerFinanzas = (usuario) =>
  !!usuario && USUARIOS_FINANZAS.includes(String(usuario.username || '').toLowerCase());

// ============================================
// CONSTANTES
// ============================================

const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const MESES_CORTOS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

const CONCEPTOS_PRESTACIONES = [
  'Prima de servicios',
  'Cesantías',
  'Intereses sobre cesantías',
  'Vacaciones',
  'Otro'
];

const ANIO_ACTUAL = new Date().getFullYear();
const ANIOS = [];
for (let a = 2024; a <= ANIO_ACTUAL + 1; a++) ANIOS.push(a);

const COLORES = {
  rojo: '#c62828',
  verde: '#388e3c',
  azul: '#1976d2',
  naranja: '#f57c00',
  gris: '#546e7a',
  oscuro: '#1a1a1a'
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

const ultimosMeses = (clave, n) => {
  const lista = [clave];
  let actual = clave;
  for (let i = 1; i < n; i++) {
    actual = mesAnterior(actual);
    lista.unshift(actual);
  }
  return lista;
};

const mesPorDefecto = () => {
  const hoy = new Date();
  return claveMes(hoy.getFullYear(), hoy.getMonth() + 1);
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
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d)) return '';
  return `${d.getDate()} de ${MESES[d.getMonth()].toLowerCase()} de ${d.getFullYear()}, ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};

// ============================================
// REGISTROS
// ============================================

const registroVacio = () => ({
  ingresos: { variable: 0, fijo: 0, unico: 0 },
  ivaIncluido: false,
  nomina: [],
  prestaciones: [],
  proveedores: [],
  radicados: 0,
  expedidos: 0,
  notas: ''
});

const clonar = (obj) => JSON.parse(JSON.stringify(obj));

const normalizarRegistro = (r) => {
  const base = registroVacio();
  if (!r) return base;
  const copia = clonar(r);
  return {
    ...base,
    ...copia,
    ingresos: { ...base.ingresos, ...(copia.ingresos || {}) },
    nomina: Array.isArray(copia.nomina) ? copia.nomina : [],
    prestaciones: Array.isArray(copia.prestaciones) ? copia.prestaciones : [],
    proveedores: Array.isArray(copia.proveedores) ? copia.proveedores : []
  };
};

// Último mes registrado antes de la clave dada (para precargar nómina y proveedores)
const registroAnteriorMasCercano = (meses, clave) => {
  const previas = Object.keys(meses || {}).filter(k => k < clave).sort();
  return previas.length > 0 ? previas[previas.length - 1] : null;
};

// ============================================
// CÁLCULOS
// ============================================

const sumaValores = (lista) =>
  (lista || []).reduce((s, x) => s + (Number(x && x.valor) || 0), 0);

const calcularMes = (r) => {
  if (!r) return null;
  const ing = r.ingresos || {};
  const variable = Number(ing.variable) || 0;
  const fijo = Number(ing.fijo) || 0;
  const unico = Number(ing.unico) || 0;
  const ingresos = variable + fijo + unico;
  const nomina = sumaValores(r.nomina);
  const prestaciones = sumaValores(r.prestaciones);
  const proveedores = sumaValores(r.proveedores);
  const gastos = nomina + prestaciones + proveedores;
  const utilidad = ingresos - gastos;
  const margen = ingresos > 0 ? (utilidad / ingresos) * 100 : null;
  return {
    variable, fijo, unico, ingresos,
    nomina, prestaciones, proveedores, gastos,
    utilidad, margen,
    radicados: Number(r.radicados) || 0,
    expedidos: Number(r.expedidos) || 0
  };
};

const variacion = (actual, anterior) => {
  if (anterior === null || anterior === undefined) return null;
  const valor = (Number(actual) || 0) - (Number(anterior) || 0);
  const pct = anterior !== 0 ? (valor / Math.abs(anterior)) * 100 : null;
  return { valor, pct };
};

const CAMPOS_SUMA = ['variable', 'fijo', 'unico', 'ingresos', 'nomina', 'prestaciones', 'proveedores', 'gastos', 'utilidad', 'radicados', 'expedidos'];

const acumuladoAnio = (meses, clave) => {
  const { anio, mes } = partesMes(clave);
  const total = {};
  CAMPOS_SUMA.forEach(k => { total[k] = 0; });
  const detalle = [];
  for (let m = 1; m <= mes; m++) {
    const k = claveMes(anio, m);
    if (meses && meses[k]) {
      const c = calcularMes(meses[k]);
      CAMPOS_SUMA.forEach(f => { total[f] += c[f]; });
      detalle.push({ clave: k, ...c });
    }
  }
  total.margen = total.ingresos > 0 ? (total.utilidad / total.ingresos) * 100 : null;
  total.mesesConDatos = detalle.length;
  return { total, detalle };
};

// Serie para gráficos: últimos n meses que tengan datos, terminando en la clave dada
const serieHistorica = (meses, clave, n = 12) =>
  ultimosMeses(clave, n)
    .filter(k => meses && meses[k])
    .map(k => {
      const c = calcularMes(meses[k]);
      return {
        clave: k,
        etiqueta: nombreMesCorto(k),
        ingresos: c.ingresos,
        gastos: c.gastos,
        utilidad: c.utilidad,
        margen: c.margen === null ? 0 : Number(c.margen.toFixed(1))
      };
    });

// Radicados y expedidos del mes según el Excel de proyectos (fechas dd/mm/aaaa)
const contarOperacionSistema = (proyectos, clave) => {
  const { anio, mes } = partesMes(clave);
  const coincide = (f) => {
    if (!f || typeof f !== 'string') return false;
    const p = f.split('/');
    return p.length === 3 && parseInt(p[2], 10) === anio && parseInt(p[1], 10) === mes;
  };
  let radicados = 0;
  let expedidos = 0;
  (proyectos || []).forEach(p => {
    if (coincide(p.fechaRadicacion)) radicados++;
    if (coincide(p.fechaLicencia)) expedidos++;
  });
  return { radicados, expedidos };
};

// Texto automático del resumen ejecutivo
const generarResumen = (clave, c, cAnt, acum) => {
  const frases = [];
  frases.push(
    `En ${nombreMes(clave)} la Curaduría registró ingresos por ${formatoPesos(c.ingresos)} y gastos por ${formatoPesos(c.gastos)}, ` +
    `con una ${c.utilidad >= 0 ? 'utilidad' : 'pérdida'} de ${formatoPesos(Math.abs(c.utilidad))}` +
    `${c.margen !== null ? ` y un margen de ${formatoPct(c.margen)}` : ''}.`
  );
  if (cAnt) {
    const vi = variacion(c.ingresos, cAnt.ingresos);
    if (vi && vi.pct !== null) {
      frases.push(
        `Frente a ${nombreMes(mesAnterior(clave))}, los ingresos ${vi.valor >= 0 ? 'aumentaron' : 'disminuyeron'} ${formatoPct(Math.abs(vi.pct))} ` +
        `y la utilidad pasó de ${formatoPesos(cAnt.utilidad)} a ${formatoPesos(c.utilidad)}.`
      );
    }
  } else {
    frases.push('No hay registro del mes anterior para comparar.');
  }
  frases.push(`En el mes se radicaron ${formatoNumero(c.radicados)} solicitudes y se expidieron ${formatoNumero(c.expedidos)} licencias.`);
  if (acum && acum.total.mesesConDatos > 1) {
    frases.push(
      `En lo corrido del año (${acum.total.mesesConDatos} meses registrados) el acumulado es de ${formatoPesos(acum.total.ingresos)} en ingresos ` +
      `y ${formatoPesos(acum.total.utilidad)} en utilidad.`
    );
  }
  return frases;
};
// ============================================
// ESTILOS DE LA PANTALLA (mismo diseño de la plataforma)
// ============================================

const STYLES_FINANZAS = `
.fin-wrap { display: flex; flex-direction: column; gap: 20px; }
.fin-encabezado { display: flex; justify-content: space-between; align-items: flex-start; gap: 15px; flex-wrap: wrap; }
.fin-titulo { font-size: 24px; font-weight: 700; color: #1a1a1a; display: flex; align-items: center; gap: 10px; }
.fin-subtitulo { color: #666; font-size: 14px; margin-top: 4px; }
.fin-badge-privado { display: inline-flex; align-items: center; gap: 6px; background: #1a1a1a; color: white; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; letter-spacing: 0.3px; }

.fin-barra { background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); padding: 15px 20px; display: flex; justify-content: space-between; align-items: center; gap: 15px; flex-wrap: wrap; }
.fin-selectores { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
.fin-select { padding: 10px 14px; border: 1px solid #e0e0e0; border-radius: 8px; font-size: 14px; background: white; cursor: pointer; font-family: inherit; }
.fin-select:focus { outline: none; border-color: #c62828; }
.fin-tabs { display: flex; gap: 6px; background: #f5f5f5; padding: 4px; border-radius: 10px; }
.fin-tab { background: none; border: none; padding: 9px 18px; border-radius: 8px; cursor: pointer; font-size: 14px; color: #666; font-weight: 500; display: flex; align-items: center; gap: 6px; font-family: inherit; }
.fin-tab.active { background: white; color: #c62828; font-weight: 600; box-shadow: 0 1px 4px rgba(0,0,0,0.08); }
.fin-acciones { display: flex; gap: 10px; flex-wrap: wrap; }

.fin-btn { border: none; padding: 10px 18px; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 500; display: inline-flex; align-items: center; gap: 6px; transition: all 0.2s; font-family: inherit; }
.fin-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.fin-btn-primario { background: #c62828; color: white; }
.fin-btn-primario:hover:not(:disabled) { background: #b71c1c; }
.fin-btn-oscuro { background: #1a1a1a; color: white; }
.fin-btn-oscuro:hover:not(:disabled) { background: #333; }
.fin-btn-secundario { background: white; color: #333; border: 1px solid #e0e0e0; }
.fin-btn-secundario:hover:not(:disabled) { border-color: #c62828; color: #c62828; }
.fin-btn-peligro { background: white; color: #c62828; border: 1px solid #ffcdd2; }
.fin-btn-peligro:hover:not(:disabled) { background: #fff5f5; }
.fin-btn-icono { background: none; border: none; color: #999; cursor: pointer; padding: 8px; border-radius: 6px; display: inline-flex; align-items: center; justify-content: center; }
.fin-btn-icono:hover { background: #ffebee; color: #c62828; }

.fin-kpis { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.fin-kpi { background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); border-left: 4px solid #c62828; }
.fin-kpi-label { color: #666; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.4px; margin-bottom: 8px; display: flex; align-items: center; gap: 6px; }
.fin-kpi-valor { font-size: 26px; font-weight: 700; color: #1a1a1a; font-variant-numeric: tabular-nums; }
.fin-kpi-sub { margin-top: 8px; font-size: 12px; color: #888; display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.fin-kpi.verde { border-left-color: #388e3c; } .fin-kpi.verde .fin-kpi-valor { color: #388e3c; }
.fin-kpi.rojo { border-left-color: #c62828; } .fin-kpi.rojo .fin-kpi-valor { color: #c62828; }
.fin-kpi.azul { border-left-color: #1976d2; } .fin-kpi.azul .fin-kpi-valor { color: #1976d2; }
.fin-kpi.naranja { border-left-color: #f57c00; } .fin-kpi.naranja .fin-kpi-valor { color: #f57c00; }
.fin-kpi.gris { border-left-color: #78909c; } .fin-kpi.gris .fin-kpi-valor { color: #546e7a; }
.fin-kpi.oscuro { border-left-color: #1a1a1a; }

.fin-var { display: inline-flex; align-items: center; gap: 3px; padding: 3px 8px; border-radius: 10px; font-size: 12px; font-weight: 600; font-variant-numeric: tabular-nums; }
.fin-var.bien { background: #e8f5e9; color: #388e3c; }
.fin-var.mal { background: #ffebee; color: #c62828; }
.fin-var.igual { background: #eceff1; color: #546e7a; }

.fin-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.fin-card { background: white; padding: 22px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
.fin-card-titulo { font-size: 16px; font-weight: 600; color: #333; margin-bottom: 4px; display: flex; align-items: center; gap: 8px; }
.fin-card-sub { font-size: 13px; color: #888; margin-bottom: 16px; }

.fin-desglose-fila { display: grid; grid-template-columns: 1fr auto; gap: 6px 12px; align-items: center; padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-size: 14px; }
.fin-desglose-fila .num { font-weight: 600; }
.fin-desglose-barra { grid-column: 1 / -1; height: 6px; background: #f5f5f5; border-radius: 3px; overflow: hidden; }
.fin-desglose-barra > div { height: 100%; border-radius: 3px; }
.fin-desglose-total { display: flex; justify-content: space-between; padding-top: 12px; font-size: 15px; font-weight: 700; color: #1a1a1a; }

.fin-tabla { width: 100%; overflow-x: auto; -webkit-overflow-scrolling: touch; }
.fin-tabla table { width: 100%; border-collapse: collapse; min-width: 520px; }
.fin-tabla th { background: #f5f5f5; padding: 10px 12px; text-align: left; font-size: 12px; color: #666; font-weight: 600; text-transform: uppercase; letter-spacing: 0.3px; border-bottom: 2px solid #e0e0e0; }
.fin-tabla td { padding: 10px 12px; border-bottom: 1px solid #f0f0f0; font-size: 14px; }
.fin-tabla tr.total td { font-weight: 700; background: #fafafa; border-top: 2px solid #e0e0e0; }
.fin-tabla tr.actual td { background: #fff5f5; font-weight: 600; }
.num { text-align: right !important; font-variant-numeric: tabular-nums; white-space: nowrap; }

.fin-vacio { background: white; border-radius: 12px; padding: 50px 20px; text-align: center; color: #888; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
.fin-vacio h3 { color: #333; font-size: 18px; margin: 12px 0 6px; }
.fin-vacio p { margin-bottom: 20px; font-size: 14px; }

.fin-aviso { border-radius: 8px; padding: 12px 16px; font-size: 13px; display: flex; gap: 10px; align-items: flex-start; line-height: 1.5; }
.fin-aviso.info { background: #e3f2fd; border: 1px solid #90caf9; color: #1565c0; }
.fin-aviso.alerta { background: #fff8e1; border: 1px solid #ffe082; color: #8d6e00; }
.fin-aviso.error { background: #ffebee; border: 1px solid #ffcdd2; color: #c62828; }

.fin-seccion { background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); padding: 22px; }
.fin-seccion-titulo { font-size: 16px; font-weight: 600; color: #333; display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
.fin-seccion-sub { font-size: 13px; color: #888; margin-bottom: 16px; }
.fin-seccion-cabecera { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; flex-wrap: wrap; margin-bottom: 12px; }
.fin-campos { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.fin-campo { display: flex; flex-direction: column; gap: 6px; }
.fin-label { font-size: 13px; font-weight: 600; color: #444; }
.fin-input { width: 100%; padding: 11px 14px; border: 1.5px solid #e0e0e0; border-radius: 8px; font-size: 14px; background: #fafafa; font-family: inherit; color: #1a1a1a; transition: all 0.2s; }
.fin-input:focus { outline: none; border-color: #c62828; background: white; box-shadow: 0 0 0 3px rgba(198,40,40,0.08); }
.fin-input-pesos { text-align: right; font-variant-numeric: tabular-nums; font-weight: 600; }
.fin-textarea { min-height: 90px; resize: vertical; line-height: 1.5; }
.fin-fila-item { display: grid; gap: 10px; align-items: center; margin-bottom: 10px; }
.fin-fila-item.nomina { grid-template-columns: 1fr 220px 40px; }
.fin-fila-item.prestacion { grid-template-columns: 1fr 220px 40px; }
.fin-fila-item.proveedor { grid-template-columns: 1fr 1fr 200px 40px; }
.fin-fila-encabezado { font-size: 11px; font-weight: 600; color: #888; text-transform: uppercase; letter-spacing: 0.4px; margin-bottom: 6px; }
.fin-total-linea { display: flex; justify-content: space-between; align-items: center; margin-top: 14px; padding-top: 14px; border-top: 2px solid #f0f0f0; font-size: 15px; font-weight: 700; color: #1a1a1a; }
.fin-check { display: flex; align-items: center; gap: 8px; font-size: 14px; color: #444; cursor: pointer; margin-top: 14px; user-select: none; }
.fin-check input { width: 18px; height: 18px; accent-color: #c62828; cursor: pointer; }
.fin-sugerencia { font-size: 12px; color: #1565c0; background: #e3f2fd; border-radius: 6px; padding: 6px 10px; display: flex; justify-content: space-between; align-items: center; gap: 8px; }
.fin-sugerencia button { background: none; border: none; color: #1565c0; font-weight: 600; cursor: pointer; text-decoration: underline; font-size: 12px; font-family: inherit; }
.fin-vacio-lista { color: #999; font-size: 13px; padding: 12px 0; font-style: italic; }

.fin-barra-guardar { position: sticky; bottom: 0; z-index: 50; background: #1a1a1a; color: white; border-radius: 12px; padding: 14px 20px; display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap; box-shadow: 0 -4px 20px rgba(0,0,0,0.15); }
.fin-barra-guardar-datos { display: flex; gap: 24px; flex-wrap: wrap; }
.fin-barra-guardar-dato { display: flex; flex-direction: column; }
.fin-barra-guardar-dato span { font-size: 11px; color: rgba(255,255,255,0.6); text-transform: uppercase; letter-spacing: 0.5px; }
.fin-barra-guardar-dato strong { font-size: 17px; font-variant-numeric: tabular-nums; }

.fin-toast { position: fixed; bottom: 24px; right: 24px; z-index: 3000; background: #388e3c; color: white; padding: 14px 20px; border-radius: 10px; font-size: 14px; font-weight: 500; display: flex; align-items: center; gap: 8px; box-shadow: 0 8px 24px rgba(0,0,0,0.2); }
.fin-toast.error { background: #c62828; }

.fin-overlay { position: fixed; inset: 0; z-index: 2000; background: rgba(30,30,30,0.85); overflow-y: auto; padding: 20px; }
.fin-overlay-barra { max-width: 860px; margin: 0 auto 16px; display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; color: white; }
.fin-overlay-barra .fin-check { color: white; margin-top: 0; }
.fin-overlay-hoja { max-width: 860px; margin: 0 auto 40px; background: white; border-radius: 6px; box-shadow: 0 10px 40px rgba(0,0,0,0.4); padding: 48px 56px; }

.fin-cargando { text-align: center; padding: 60px; color: #666; font-size: 15px; }

@media (max-width: 1024px) {
  .fin-kpis { grid-template-columns: repeat(2, 1fr); }
  .fin-grid-2 { grid-template-columns: 1fr; }
  .fin-campos { grid-template-columns: 1fr 1fr; }
}

@media (max-width: 768px) {
  .fin-titulo { font-size: 20px; }
  .fin-barra { padding: 12px; }
  .fin-tabs { width: 100%; }
  .fin-tab { flex: 1; justify-content: center; padding: 9px 10px; }
  .fin-kpis { gap: 10px; }
  .fin-kpi { padding: 14px; }
  .fin-kpi-valor { font-size: 19px; }
  .fin-card, .fin-seccion { padding: 16px; }
  .fin-campos { grid-template-columns: 1fr; }
  .fin-fila-item.nomina, .fin-fila-item.prestacion { grid-template-columns: 1fr 40px; }
  .fin-fila-item.nomina > :nth-child(2), .fin-fila-item.prestacion > :nth-child(2) { grid-column: 1 / 2; }
  .fin-fila-item.proveedor { grid-template-columns: 1fr 40px; }
  .fin-fila-item.proveedor > :nth-child(2), .fin-fila-item.proveedor > :nth-child(3) { grid-column: 1 / 2; }
  .fin-fila-item.proveedor > :nth-child(4) { grid-row: 1; grid-column: 2; }
  .fin-fila-encabezado { display: none !important; }
  .fin-barra-guardar { padding: 12px 14px; }
  .fin-barra-guardar-datos { gap: 14px; }
  .fin-barra-guardar-dato strong { font-size: 14px; }
  .fin-overlay { padding: 10px; }
  .fin-overlay-hoja { padding: 24px 18px; }
  .fin-toast { left: 16px; right: 16px; bottom: 16px; }
}
`;
// ============================================
// ESTILOS DEL INFORME PARA LA JUNTA
// (se usan en la vista previa y en la ventana de impresión)
// ============================================

const STYLES_INFORME = `
@page { size: letter; margin: 14mm 14mm 16mm 14mm; }
.inf-doc { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1a1a1a; font-size: 12px; line-height: 1.5; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.inf-doc * { box-sizing: border-box; }
.inf-cabecera { display: flex; justify-content: space-between; align-items: flex-start; gap: 20px; padding-bottom: 16px; border-bottom: 3px solid #c62828; margin-bottom: 20px; }
.inf-marca { display: flex; align-items: center; gap: 12px; }
.inf-institucion { font-size: 15px; font-weight: 800; letter-spacing: -0.2px; line-height: 1.2; }
.inf-institucion-sub { font-size: 10px; letter-spacing: 3px; color: #666; font-weight: 500; margin-top: 3px; }
.inf-cabecera-der { text-align: right; }
.inf-titulo { font-size: 16px; font-weight: 700; color: #c62828; }
.inf-periodo { font-size: 13px; font-weight: 600; margin-top: 2px; }
.inf-meta { font-size: 10px; color: #777; margin-top: 4px; }
.inf-confidencial { display: inline-block; margin-top: 6px; background: #1a1a1a; color: white; font-size: 9px; font-weight: 700; letter-spacing: 1px; padding: 3px 8px; border-radius: 3px; text-transform: uppercase; }

.inf-seccion { margin-bottom: 22px; }
.inf-h2 { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.6px; color: #1a1a1a; border-left: 4px solid #c62828; padding-left: 10px; margin-bottom: 10px; }
.inf-h3 { font-size: 12px; font-weight: 700; color: #444; margin: 12px 0 6px; }
.inf-parrafo { margin-bottom: 6px; text-align: justify; }
.inf-nota { font-size: 10px; color: #777; margin-top: 6px; font-style: italic; }
.inf-notas-junta { background: #fafafa; border: 1px solid #e0e0e0; border-radius: 4px; padding: 10px 12px; margin-top: 8px; white-space: pre-wrap; }

.inf-kpis { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.inf-kpi { border: 1px solid #e0e0e0; border-top: 3px solid #c62828; border-radius: 4px; padding: 10px 12px; }
.inf-kpi.verde { border-top-color: #388e3c; }
.inf-kpi.azul { border-top-color: #1976d2; }
.inf-kpi.oscuro { border-top-color: #1a1a1a; }
.inf-kpi.gris { border-top-color: #78909c; }
.inf-kpi-label { font-size: 9px; font-weight: 700; color: #666; text-transform: uppercase; letter-spacing: 0.5px; }
.inf-kpi-valor { font-size: 17px; font-weight: 800; margin-top: 3px; font-variant-numeric: tabular-nums; }
.inf-kpi-var { font-size: 10px; margin-top: 3px; font-weight: 600; }

.inf-tabla { width: 100%; border-collapse: collapse; font-size: 11px; }
.inf-tabla th { background: #f2f2f2; text-align: left; padding: 6px 8px; font-size: 9px; font-weight: 700; color: #555; text-transform: uppercase; letter-spacing: 0.4px; border-bottom: 1.5px solid #ccc; }
.inf-tabla td { padding: 6px 8px; border-bottom: 1px solid #eee; }
.inf-tabla tr.total td { font-weight: 800; background: #f7f7f7; border-top: 1.5px solid #ccc; }
.inf-tabla tr.actual td { background: #fff5f5; font-weight: 700; }
.inf-tabla .num { text-align: right; font-variant-numeric: tabular-nums; white-space: nowrap; }

.inf-bien { color: #2e7d32; }
.inf-mal { color: #c62828; }
.inf-igual { color: #666; }

.inf-dos-col { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.inf-grafico { border: 1px solid #eee; border-radius: 4px; padding: 10px 6px 4px; margin-top: 8px; }
.inf-grafico-titulo { font-size: 10px; font-weight: 700; color: #555; text-transform: uppercase; letter-spacing: 0.4px; padding: 0 6px 6px; }

.inf-pie { margin-top: 26px; padding-top: 10px; border-top: 1px solid #ddd; font-size: 9px; color: #888; display: flex; justify-content: space-between; gap: 10px; }
.inf-firma { margin-top: 36px; display: flex; gap: 60px; }
.inf-firma div { border-top: 1px solid #333; padding-top: 6px; min-width: 200px; font-size: 11px; }
.inf-firma span { display: block; font-size: 10px; color: #666; }

.inf-salto { break-before: page; page-break-before: always; }
.inf-sin-corte { break-inside: avoid; page-break-inside: avoid; }
`;

// ============================================
// VARIACIONES
// ============================================
// Devuelve el texto de la variación y si es buena, mala o igual.
// inverso = true para gastos (subir es malo).
// tipo: 'pesos' | 'numero' | 'pct' (para márgenes, en puntos porcentuales)

const textoVariacion = (actual, anterior, { inverso = false, tipo = 'pesos' } = {}) => {
  const vacio = { texto: '—', clase: 'igual', valorTexto: '—' };
  if (anterior === null || anterior === undefined) return vacio;

  if (tipo === 'pct') {
    if (actual === null || actual === undefined) return vacio;
    const d = actual - anterior;
    const texto = `${d > 0 ? '+' : ''}${d.toFixed(1).replace('.', ',')} pts`;
    const clase = Math.abs(d) < 0.05 ? 'igual' : ((d > 0) !== inverso ? 'bien' : 'mal');
    return { texto, clase, valorTexto: texto };
  }

  const v = variacion(actual, anterior);
  const signo = v.valor > 0 ? '+' : '';
  const valorTexto = tipo === 'numero' ? `${signo}${formatoNumero(v.valor)}` : `${signo}${formatoPesos(v.valor)}`;
  const texto = v.pct === null
    ? (v.valor === 0 ? '0,0 %' : 'N/A')
    : `${v.pct > 0 ? '+' : ''}${v.pct.toFixed(1).replace('.', ',')} %`;
  const clase = v.valor === 0 ? 'igual' : ((v.valor > 0) !== inverso ? 'bien' : 'mal');
  return { texto, clase, valorTexto };
};

// ============================================
// COMPONENTES PEQUEÑOS
// ============================================

// Campo de dinero con separador de miles ($ 12.500.000)
const InputPesos = ({ valor, onChange, placeholder = '0' }) => (
  <div style={{ position: 'relative' }}>
    <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#999', fontSize: 14, pointerEvents: 'none' }}>$</span>
    <input
      type="text"
      inputMode="numeric"
      className="fin-input fin-input-pesos"
      style={{ paddingLeft: 26 }}
      value={valor ? formatoNumero(valor) : ''}
      placeholder={placeholder}
      onChange={(e) => onChange(Number(String(e.target.value).replace(/[^\d]/g, '')) || 0)}
    />
  </div>
);

// Campo numérico simple (radicados, expedidos)
const InputNumero = ({ valor, onChange }) => (
  <input
    type="text"
    inputMode="numeric"
    className="fin-input fin-input-pesos"
    value={valor ? formatoNumero(valor) : ''}
    placeholder="0"
    onChange={(e) => onChange(Number(String(e.target.value).replace(/[^\d]/g, '')) || 0)}
  />
);

// Etiqueta de variación con flecha (para la pantalla)
const BadgeVariacion = ({ actual, anterior, inverso = false, tipo = 'pesos', sinDatos = 'Sin mes anterior' }) => {
  if (anterior === null || anterior === undefined) {
    return <span className="fin-var igual">{sinDatos}</span>;
  }
  const t = textoVariacion(actual, anterior, { inverso, tipo });
  const diferencia = (Number(actual) || 0) - (Number(anterior) || 0);
  const Icono = t.clase === 'igual' ? Minus : (diferencia > 0 ? ArrowUpRight : ArrowDownRight);
  return (
    <span className={`fin-var ${t.clase}`} title={t.valorTexto}>
      <Icono size={12} /> {t.texto}
    </span>
  );
};

// Tarjeta de indicador
const TarjetaKPI = ({ etiqueta, icono, valor, color = '', sub }) => (
  <div className={`fin-kpi ${color}`}>
    <div className="fin-kpi-label">{icono}{etiqueta}</div>
    <div className="fin-kpi-valor">{valor}</div>
    {sub && <div className="fin-kpi-sub">{sub}</div>}
  </div>
);

// Fila de desglose con barra de participación
const FilaDesglose = ({ etiqueta, valor, total, color }) => {
  const pct = total > 0 ? (valor / total) * 100 : 0;
  return (
    <div className="fin-desglose-fila">
      <span>
        {etiqueta}{' '}
        <span style={{ color: '#999', fontSize: 12 }}>({formatoPct(pct)})</span>
      </span>
      <span className="num">{formatoPesos(valor)}</span>
      <div className="fin-desglose-barra">
        <div style={{ width: `${Math.min(100, Math.max(0, pct))}%`, background: color }} />
      </div>
    </div>
  );
};

// Logo institucional para el informe
const LogoInforme = () => (
  <svg width="40" height="40" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
    <polygon points="8,10 30,10 30,32 22,50 8,50" fill="#c62828" />
    <polygon points="30,10 52,10 52,50 38,50 30,32" fill="#1a1a1a" />
    <polygon points="30,10 52,10 30,32" fill="#c62828" />
  </svg>
);
// ============================================
// INFORME PARA LA JUNTA
// ============================================
// Se muestra como vista previa y se imprime en una ventana aparte.
// Los gráficos usan tamaño fijo y sin animación para que salgan
// completos en el PDF.

const imprimirInforme = (titulo) => {
  const nodo = document.getElementById('fin-informe-contenido');
  if (!nodo) return false;
  const w = window.open('', '_blank');
  if (!w) return false;
  w.document.open();
  w.document.write(
    `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>${titulo}</title>` +
    `<style>body{margin:0;background:white;}${STYLES_INFORME}</style></head>` +
    `<body>${nodo.outerHTML}</body></html>`
  );
  w.document.close();
  w.focus();
  setTimeout(() => { w.print(); }, 500);
  return true;
};

const InformeJunta = ({ clave, meses, incluirNomina }) => {
  const registro = normalizarRegistro(meses[clave]);
  const c = calcularMes(registro);
  const claveAnt = mesAnterior(clave);
  const cAnt = meses[claveAnt] ? calcularMes(meses[claveAnt]) : null;
  const acum = acumuladoAnio(meses, clave);
  const serie = serieHistorica(meses, clave, 6);
  const resumen = generarResumen(clave, c, cAnt, acum);
  const { anio } = partesMes(clave);

  const ingresoPorExpedido = c.expedidos > 0 ? c.ingresos / c.expedidos : null;
  const gastoPorExpedido = c.expedidos > 0 ? c.gastos / c.expedidos : null;
  const nominaOrdenada = [...registro.nomina].sort((a, b) => (b.valor || 0) - (a.valor || 0));
  const proveedoresOrdenados = [...registro.proveedores].sort((a, b) => (b.valor || 0) - (a.valor || 0));
  const pctDe = (valor, total) => (total > 0 ? formatoPct((valor / total) * 100) : '—');

  const kpi = (etiqueta, valor, color, actual, anterior, opciones) => {
    const t = textoVariacion(actual, anterior, opciones);
    return (
      <div className={`inf-kpi ${color}`}>
        <div className="inf-kpi-label">{etiqueta}</div>
        <div className="inf-kpi-valor">{valor}</div>
        <div className={`inf-kpi-var inf-${t.clase}`}>
          {anterior === null || anterior === undefined ? 'Sin mes anterior' : `${t.texto} vs. mes anterior`}
        </div>
      </div>
    );
  };

  const filaComparacion = (etiqueta, actual, anterior, formato, opciones) => {
    const t = textoVariacion(actual, anterior, opciones);
    return (
      <tr key={etiqueta}>
        <td>{etiqueta}</td>
        <td className="num">{formato(actual)}</td>
        <td className="num">{anterior === null || anterior === undefined ? '—' : formato(anterior)}</td>
        <td className={`num inf-${t.clase}`}>{t.valorTexto}</td>
        <td className={`num inf-${t.clase}`}>{t.texto}</td>
      </tr>
    );
  };

  return (
    <div id="fin-informe-contenido" className="inf-doc">
      {/* ---------- CABECERA ---------- */}
      <div className="inf-cabecera">
        <div className="inf-marca">
          <LogoInforme />
          <div>
            <div className="inf-institucion">CURADURÍA URBANA N.° 2 DE PEREIRA</div>
            <div className="inf-institucion-sub">PEREIRA · RISARALDA</div>
          </div>
        </div>
        <div className="inf-cabecera-der">
          <div className="inf-titulo">Informe Financiero y Operativo Mensual</div>
          <div className="inf-periodo">{nombreMes(clave)}</div>
          <div className="inf-meta">Generado el {formatoFechaHora(new Date().toISOString())}</div>
          <div className="inf-confidencial">Confidencial · Uso exclusivo de la Junta</div>
        </div>
      </div>

      {/* ---------- 1. RESUMEN EJECUTIVO ---------- */}
      <div className="inf-seccion inf-sin-corte">
        <div className="inf-h2">1. Resumen ejecutivo</div>
        {resumen.map((f, i) => <p key={i} className="inf-parrafo">{f}</p>)}
        {registro.notas && (
          <>
            <div className="inf-h3">Observaciones de la administración</div>
            <div className="inf-notas-junta">{registro.notas}</div>
          </>
        )}
      </div>

      {/* ---------- 2. INDICADORES PRINCIPALES ---------- */}
      <div className="inf-seccion inf-sin-corte">
        <div className="inf-h2">2. Indicadores principales</div>
        <div className="inf-kpis">
          {kpi('Ingresos', formatoPesos(c.ingresos), 'oscuro', c.ingresos, cAnt ? cAnt.ingresos : null)}
          {kpi('Gastos', formatoPesos(c.gastos), '', c.gastos, cAnt ? cAnt.gastos : null, { inverso: true })}
          {kpi(c.utilidad >= 0 ? 'Utilidad' : 'Pérdida', formatoPesos(c.utilidad), c.utilidad >= 0 ? 'verde' : '', c.utilidad, cAnt ? cAnt.utilidad : null)}
          {kpi('Margen de utilidad', formatoPct(c.margen), 'verde', c.margen, cAnt ? cAnt.margen : null, { tipo: 'pct' })}
          {kpi('Radicados', formatoNumero(c.radicados), 'azul', c.radicados, cAnt ? cAnt.radicados : null, { tipo: 'numero' })}
          {kpi('Expedidos', formatoNumero(c.expedidos), 'gris', c.expedidos, cAnt ? cAnt.expedidos : null, { tipo: 'numero' })}
        </div>
      </div>

      {/* ---------- 3. INGRESOS ---------- */}
      <div className="inf-seccion inf-sin-corte">
        <div className="inf-h2">3. Ingresos</div>
        <table className="inf-tabla">
          <thead><tr><th>Concepto</th><th className="num">Valor</th><th className="num">Participación</th></tr></thead>
          <tbody>
            <tr><td>Cargo variable</td><td className="num">{formatoPesos(c.variable)}</td><td className="num">{pctDe(c.variable, c.ingresos)}</td></tr>
            <tr><td>Cargo fijo</td><td className="num">{formatoPesos(c.fijo)}</td><td className="num">{pctDe(c.fijo, c.ingresos)}</td></tr>
            <tr><td>Cargo único</td><td className="num">{formatoPesos(c.unico)}</td><td className="num">{pctDe(c.unico, c.ingresos)}</td></tr>
            <tr className="total"><td>Total ingresos</td><td className="num">{formatoPesos(c.ingresos)}</td><td className="num">100,0 %</td></tr>
          </tbody>
        </table>
        <div className="inf-nota">Valores {registro.ivaIncluido ? 'con IVA incluido' : 'sin IVA'}.</div>
      </div>

      {/* ---------- 4. GASTOS ---------- */}
      <div className="inf-seccion">
        <div className="inf-h2">4. Gastos</div>
        <table className="inf-tabla inf-sin-corte">
          <thead><tr><th>Concepto</th><th className="num">Valor</th><th className="num">Participación</th></tr></thead>
          <tbody>
            <tr><td>Nómina (valor neto)</td><td className="num">{formatoPesos(c.nomina)}</td><td className="num">{pctDe(c.nomina, c.gastos)}</td></tr>
            {c.prestaciones > 0 && (
              <tr><td>Primas, cesantías y prestaciones</td><td className="num">{formatoPesos(c.prestaciones)}</td><td className="num">{pctDe(c.prestaciones, c.gastos)}</td></tr>
            )}
            <tr><td>Proveedores</td><td className="num">{formatoPesos(c.proveedores)}</td><td className="num">{pctDe(c.proveedores, c.gastos)}</td></tr>
            <tr className="total"><td>Total gastos</td><td className="num">{formatoPesos(c.gastos)}</td><td className="num">100,0 %</td></tr>
          </tbody>
        </table>

        <div className="inf-h3">4.1 Nómina</div>
        {incluirNomina ? (
          <table className="inf-tabla">
            <thead><tr><th>Empleado</th><th className="num">Valor neto</th></tr></thead>
            <tbody>
              {nominaOrdenada.map((e, i) => (
                <tr key={i}><td>{e.nombre || '—'}</td><td className="num">{formatoPesos(e.valor)}</td></tr>
              ))}
              <tr className="total"><td>Total nómina ({nominaOrdenada.length} empleados)</td><td className="num">{formatoPesos(c.nomina)}</td></tr>
            </tbody>
          </table>
        ) : (
          <p className="inf-parrafo">
            {nominaOrdenada.length} empleados · Total nómina: <strong>{formatoPesos(c.nomina)}</strong>.
            <span className="inf-nota"> El detalle por empleado se omite por confidencialidad.</span>
          </p>
        )}

        {registro.prestaciones.length > 0 && (
          <>
            <div className="inf-h3">4.2 Primas, cesantías y prestaciones</div>
            <table className="inf-tabla inf-sin-corte">
              <thead><tr><th>Concepto</th><th className="num">Valor</th></tr></thead>
              <tbody>
                {registro.prestaciones.map((p, i) => (
                  <tr key={i}><td>{p.concepto || '—'}</td><td className="num">{formatoPesos(p.valor)}</td></tr>
                ))}
                <tr className="total"><td>Total</td><td className="num">{formatoPesos(c.prestaciones)}</td></tr>
              </tbody>
            </table>
          </>
        )}

        <div className="inf-h3">{registro.prestaciones.length > 0 ? '4.3' : '4.2'} Proveedores</div>
        {proveedoresOrdenados.length > 0 ? (
          <table className="inf-tabla">
            <thead><tr><th>Proveedor</th><th>Concepto</th><th className="num">Valor pagado</th></tr></thead>
            <tbody>
              {proveedoresOrdenados.map((p, i) => (
                <tr key={i}><td>{p.nombre || '—'}</td><td>{p.concepto || '—'}</td><td className="num">{formatoPesos(p.valor)}</td></tr>
              ))}
              <tr className="total"><td colSpan="2">Total proveedores</td><td className="num">{formatoPesos(c.proveedores)}</td></tr>
            </tbody>
          </table>
        ) : (
          <p className="inf-parrafo">No se registraron pagos a proveedores en el mes.</p>
        )}
      </div>

      {/* ---------- 5. RESULTADO ---------- */}
      <div className="inf-seccion inf-sin-corte">
        <div className="inf-h2">5. Resultado del mes</div>
        <table className="inf-tabla">
          <tbody>
            <tr><td>Total ingresos</td><td className="num">{formatoPesos(c.ingresos)}</td></tr>
            <tr><td>(−) Total gastos</td><td className="num">{formatoPesos(c.gastos)}</td></tr>
            <tr className="total">
              <td>{c.utilidad >= 0 ? '(=) Utilidad del mes' : '(=) Pérdida del mes'}</td>
              <td className={`num ${c.utilidad >= 0 ? 'inf-bien' : 'inf-mal'}`}>{formatoPesos(c.utilidad)}</td>
            </tr>
            <tr><td>Margen de utilidad</td><td className="num">{formatoPct(c.margen)}</td></tr>
          </tbody>
        </table>
      </div>

      {/* ---------- 6. OPERACIÓN ---------- */}
      <div className="inf-seccion inf-sin-corte">
        <div className="inf-h2">6. Información operativa</div>
        <table className="inf-tabla">
          <tbody>
            <tr><td>Solicitudes radicadas</td><td className="num">{formatoNumero(c.radicados)}</td></tr>
            <tr><td>Licencias expedidas</td><td className="num">{formatoNumero(c.expedidos)}</td></tr>
            <tr><td>Ingreso promedio por licencia expedida</td><td className="num">{ingresoPorExpedido === null ? '—' : formatoPesos(ingresoPorExpedido)}</td></tr>
            <tr><td>Gasto promedio por licencia expedida</td><td className="num">{gastoPorExpedido === null ? '—' : formatoPesos(gastoPorExpedido)}</td></tr>
          </tbody>
        </table>
      </div>

      {/* ---------- 7. COMPARACIÓN CON EL MES ANTERIOR ---------- */}
      <div className="inf-seccion inf-sin-corte">
        <div className="inf-h2">7. Comparación con el mes anterior</div>
        {cAnt ? (
          <table className="inf-tabla">
            <thead>
              <tr>
                <th>Concepto</th>
                <th className="num">{nombreMes(clave)}</th>
                <th className="num">{nombreMes(claveAnt)}</th>
                <th className="num">Variación</th>
                <th className="num">Var. %</th>
              </tr>
            </thead>
            <tbody>
              {filaComparacion('Ingresos', c.ingresos, cAnt.ingresos, formatoPesos)}
              {filaComparacion('Gastos', c.gastos, cAnt.gastos, formatoPesos, { inverso: true })}
              {filaComparacion('Utilidad', c.utilidad, cAnt.utilidad, formatoPesos)}
              {filaComparacion('Margen de utilidad', c.margen, cAnt.margen, formatoPct, { tipo: 'pct' })}
              {filaComparacion('Radicados', c.radicados, cAnt.radicados, formatoNumero, { tipo: 'numero' })}
              {filaComparacion('Expedidos', c.expedidos, cAnt.expedidos, formatoNumero, { tipo: 'numero' })}
            </tbody>
          </table>
        ) : (
          <p className="inf-parrafo">No hay registro de {nombreMes(claveAnt)} para comparar.</p>
        )}
      </div>

      {/* ---------- GRÁFICOS ---------- */}
      {serie.length > 1 && (
        <div className="inf-seccion inf-sin-corte">
          <div className="inf-h2">Evolución de los últimos meses</div>
          <div className="inf-grafico">
            <div className="inf-grafico-titulo">Ingresos vs. gastos</div>
            <BarChart width={680} height={210} data={serie} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="etiqueta" tick={{ fontSize: 10 }} />
              <YAxis tickFormatter={formatoPesosCorto} tick={{ fontSize: 10 }} width={70} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Bar dataKey="ingresos" name="Ingresos" fill={COLORES.oscuro} isAnimationActive={false} />
              <Bar dataKey="gastos" name="Gastos" fill={COLORES.rojo} isAnimationActive={false} />
            </BarChart>
          </div>
          <div className="inf-grafico">
            <div className="inf-grafico-titulo">Utilidad mensual</div>
            <LineChart width={680} height={180} data={serie} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="etiqueta" tick={{ fontSize: 10 }} />
              <YAxis tickFormatter={formatoPesosCorto} tick={{ fontSize: 10 }} width={70} />
              <ReferenceLine y={0} stroke="#999" />
              <Line type="monotone" dataKey="utilidad" name="Utilidad" stroke={COLORES.verde} strokeWidth={2.5} dot={{ r: 3 }} isAnimationActive={false} />
            </LineChart>
          </div>
        </div>
      )}

      {/* ---------- 8. ACUMULADO DEL AÑO ---------- */}
      <div className="inf-seccion inf-sin-corte">
        <div className="inf-h2">8. Acumulado del año {anio}</div>
        <table className="inf-tabla">
          <thead>
            <tr>
              <th>Mes</th>
              <th className="num">Ingresos</th>
              <th className="num">Gastos</th>
              <th className="num">Utilidad</th>
              <th className="num">Margen</th>
              <th className="num">Radic.</th>
              <th className="num">Exped.</th>
            </tr>
          </thead>
          <tbody>
            {acum.detalle.map(m => (
              <tr key={m.clave} className={m.clave === clave ? 'actual' : ''}>
                <td>{nombreMes(m.clave)}</td>
                <td className="num">{formatoPesos(m.ingresos)}</td>
                <td className="num">{formatoPesos(m.gastos)}</td>
                <td className={`num ${m.utilidad >= 0 ? '' : 'inf-mal'}`}>{formatoPesos(m.utilidad)}</td>
                <td className="num">{formatoPct(m.margen)}</td>
                <td className="num">{formatoNumero(m.radicados)}</td>
                <td className="num">{formatoNumero(m.expedidos)}</td>
              </tr>
            ))}
            <tr className="total">
              <td>Total año</td>
              <td className="num">{formatoPesos(acum.total.ingresos)}</td>
              <td className="num">{formatoPesos(acum.total.gastos)}</td>
              <td className="num">{formatoPesos(acum.total.utilidad)}</td>
              <td className="num">{formatoPct(acum.total.margen)}</td>
              <td className="num">{formatoNumero(acum.total.radicados)}</td>
              <td className="num">{formatoNumero(acum.total.expedidos)}</td>
            </tr>
          </tbody>
        </table>
        <div className="inf-nota">Incluye {acum.total.mesesConDatos} {acum.total.mesesConDatos === 1 ? 'mes registrado' : 'meses registrados'} entre enero y {nombreMes(clave).toLowerCase()}.</div>
      </div>

      {/* ---------- FIRMAS Y PIE ---------- */}
      <div className="inf-firma inf-sin-corte">
        <div>Luis Fernando Montes<span>Curador Urbano N.° 2 de Pereira</span></div>
        <div>Juan Montes<span>Dirección Administrativa</span></div>
      </div>

      <div className="inf-pie">
        <span>Curaduría Urbana N.° 2 de Pereira · Informe Financiero y Operativo · {nombreMes(clave)}</span>
        <span>Documento confidencial</span>
      </div>
    </div>
  );
};
// ============================================
// FORMULARIO: REGISTRAR MES
// ============================================
// El estado del borrador vive en el componente principal (Parte 7).
// Este formulario solo lo muestra y avisa los cambios con onCambiar.

const FormularioMes = ({ clave, borrador, onCambiar, meses, proyectos, onGuardar, onEliminar, guardando, existe, precargadoDe, modificado }) => {
  const c = calcularMes(borrador);
  const sistema = useMemo(() => contarOperacionSistema(proyectos, clave), [proyectos, clave]);
  const claveRef = registroAnteriorMasCercano(meses, clave);
  const registroRef = claveRef ? normalizarRegistro(meses[claveRef]) : null;

  // Nombres de proveedores usados antes (para autocompletar)
  const proveedoresConocidos = useMemo(() => {
    const nombres = new Set();
    Object.values(meses || {}).forEach(r => (r.proveedores || []).forEach(p => { if (p.nombre) nombres.add(p.nombre); }));
    return [...nombres].sort();
  }, [meses]);

  const actualizar = (cambios) => onCambiar({ ...borrador, ...cambios });
  const actualizarIngreso = (campo, valor) => actualizar({ ingresos: { ...borrador.ingresos, [campo]: valor } });
  const actualizarItem = (lista, i, campo, valor) =>
    actualizar({ [lista]: borrador[lista].map((x, j) => (j === i ? { ...x, [campo]: valor } : x)) });
  const agregarItem = (lista, item) => actualizar({ [lista]: [...borrador[lista], item] });
  const quitarItem = (lista, i) => actualizar({ [lista]: borrador[lista].filter((_, j) => j !== i) });

  const copiarDeAnterior = (lista, etiqueta) => {
    if (!registroRef) return;
    if (borrador[lista].length > 0 &&
        !window.confirm(`Esto reemplaza la lista actual de ${etiqueta} con la de ${nombreMes(claveRef)}. ¿Continuar?`)) return;
    actualizar({ [lista]: clonar(registroRef[lista]) });
  };

  return (
    <div className="fin-wrap">
      {precargadoDe && !existe && (
        <div className="fin-aviso info">
          <Copy size={16} style={{ flexShrink: 0, marginTop: 2 }} />
          <span>
            <strong>{nombreMes(clave)} aún no tiene registro.</strong> La nómina se precargó con los datos de{' '}
            <strong>{nombreMes(precargadoDe)}</strong>. Revisa y ajusta los valores antes de guardar.
          </span>
        </div>
      )}

      {existe && borrador.actualizado && (
        <div className="fin-aviso alerta">
          <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
          <span>
            Estás editando un mes ya registrado. Última actualización: {formatoFechaHora(borrador.actualizado)}
            {borrador.actualizadoPor ? ` por ${borrador.actualizadoPor}` : ''}.
          </span>
        </div>
      )}

      {/* ---------- INGRESOS ---------- */}
      <div className="fin-seccion">
        <div className="fin-seccion-titulo"><Wallet size={18} color={COLORES.rojo} /> 1. Ingresos del mes</div>
        <div className="fin-seccion-sub">Registra los valores recaudados en {nombreMes(clave)}.</div>
        <div className="fin-campos">
          <div className="fin-campo">
            <label className="fin-label">Cargo variable</label>
            <InputPesos valor={borrador.ingresos.variable} onChange={(v) => actualizarIngreso('variable', v)} />
          </div>
          <div className="fin-campo">
            <label className="fin-label">Cargo fijo</label>
            <InputPesos valor={borrador.ingresos.fijo} onChange={(v) => actualizarIngreso('fijo', v)} />
          </div>
          <div className="fin-campo">
            <label className="fin-label">Cargo único</label>
            <InputPesos valor={borrador.ingresos.unico} onChange={(v) => actualizarIngreso('unico', v)} />
          </div>
        </div>
        <label className="fin-check">
          <input type="checkbox" checked={!!borrador.ivaIncluido} onChange={(e) => actualizar({ ivaIncluido: e.target.checked })} />
          Estos valores incluyen IVA
        </label>
        <div className="fin-seccion-sub" style={{ marginTop: 6, marginBottom: 0 }}>
          Recomendación: registra siempre de la misma forma (idealmente sin IVA) para que las comparaciones entre meses sean correctas.
        </div>
        <div className="fin-total-linea"><span>Total ingresos</span><span className="num">{formatoPesos(c.ingresos)}</span></div>
      </div>

      {/* ---------- NÓMINA ---------- */}
      <div className="fin-seccion">
        <div className="fin-seccion-cabecera">
          <div>
            <div className="fin-seccion-titulo"><Users size={18} color={COLORES.rojo} /> 2. Nómina</div>
            <div className="fin-seccion-sub" style={{ marginBottom: 0 }}>Valor neto pagado a cada empleado.</div>
          </div>
          {registroRef && registroRef.nomina.length > 0 && (
            <button className="fin-btn fin-btn-secundario" onClick={() => copiarDeAnterior('nomina', 'nómina')}>
              <Copy size={14} /> Copiar de {nombreMes(claveRef)}
            </button>
          )}
        </div>
        {borrador.nomina.length > 0 && (
          <div className="fin-fila-item nomina fin-fila-encabezado" style={{ display: 'grid' }}>
            <span>Empleado</span><span>Valor neto</span><span></span>
          </div>
        )}
        {borrador.nomina.length === 0 && <div className="fin-vacio-lista">Aún no hay empleados en este mes.</div>}
        {borrador.nomina.map((e, i) => (
          <div key={i} className="fin-fila-item nomina">
            <input className="fin-input" placeholder="Nombre del empleado" value={e.nombre || ''} onChange={(ev) => actualizarItem('nomina', i, 'nombre', ev.target.value)} />
            <InputPesos valor={e.valor} onChange={(v) => actualizarItem('nomina', i, 'valor', v)} />
            <button className="fin-btn-icono" title="Quitar" onClick={() => quitarItem('nomina', i)}><Trash2 size={16} /></button>
          </div>
        ))}
        <button className="fin-btn fin-btn-secundario" onClick={() => agregarItem('nomina', { nombre: '', valor: 0 })}>
          <Plus size={14} /> Agregar empleado
        </button>
        <div className="fin-total-linea">
          <span>Total nómina ({borrador.nomina.length} {borrador.nomina.length === 1 ? 'empleado' : 'empleados'})</span>
          <span className="num">{formatoPesos(c.nomina)}</span>
        </div>
      </div>

      {/* ---------- PRIMAS Y CESANTÍAS ---------- */}
      <div className="fin-seccion">
        <div className="fin-seccion-titulo"><Gift size={18} color={COLORES.rojo} /> 3. Primas, cesantías y prestaciones <span style={{ fontSize: 12, color: '#999', fontWeight: 400 }}>(opcional)</span></div>
        <div className="fin-seccion-sub">Solo en los meses en que se pagan. Si no aplica, deja esta sección vacía.</div>
        <datalist id="fin-conceptos-prestaciones">
          {CONCEPTOS_PRESTACIONES.map(cp => <option key={cp} value={cp} />)}
        </datalist>
        {borrador.prestaciones.map((p, i) => (
          <div key={i} className="fin-fila-item prestacion">
            <input className="fin-input" list="fin-conceptos-prestaciones" placeholder="Ej.: Prima de servicios" value={p.concepto || ''} onChange={(ev) => actualizarItem('prestaciones', i, 'concepto', ev.target.value)} />
            <InputPesos valor={p.valor} onChange={(v) => actualizarItem('prestaciones', i, 'valor', v)} />
            <button className="fin-btn-icono" title="Quitar" onClick={() => quitarItem('prestaciones', i)}><Trash2 size={16} /></button>
          </div>
        ))}
        <button className="fin-btn fin-btn-secundario" onClick={() => agregarItem('prestaciones', { concepto: '', valor: 0 })}>
          <Plus size={14} /> Agregar prima o prestación
        </button>
        {borrador.prestaciones.length > 0 && (
          <div className="fin-total-linea"><span>Total primas y prestaciones</span><span className="num">{formatoPesos(c.prestaciones)}</span></div>
        )}
      </div>

      {/* ---------- PROVEEDORES ---------- */}
      <div className="fin-seccion">
        <div className="fin-seccion-cabecera">
          <div>
            <div className="fin-seccion-titulo"><Truck size={18} color={COLORES.rojo} /> 4. Proveedores</div>
            <div className="fin-seccion-sub" style={{ marginBottom: 0 }}>Pagos realizados en el mes.</div>
          </div>
          {registroRef && registroRef.proveedores.length > 0 && (
            <button className="fin-btn fin-btn-secundario" onClick={() => copiarDeAnterior('proveedores', 'proveedores')}>
              <Copy size={14} /> Copiar de {nombreMes(claveRef)}
            </button>
          )}
        </div>
        <datalist id="fin-proveedores-conocidos">
          {proveedoresConocidos.map(n => <option key={n} value={n} />)}
        </datalist>
        {borrador.proveedores.length > 0 && (
          <div className="fin-fila-item proveedor fin-fila-encabezado" style={{ display: 'grid' }}>
            <span>Proveedor</span><span>Concepto</span><span>Valor pagado</span><span></span>
          </div>
        )}
        {borrador.proveedores.length === 0 && <div className="fin-vacio-lista">Aún no hay proveedores en este mes.</div>}
        {borrador.proveedores.map((p, i) => (
          <div key={i} className="fin-fila-item proveedor">
            <input className="fin-input" list="fin-proveedores-conocidos" placeholder="Nombre del proveedor" value={p.nombre || ''} onChange={(ev) => actualizarItem('proveedores', i, 'nombre', ev.target.value)} />
            <input className="fin-input" placeholder="Concepto (ej.: arriendo)" value={p.concepto || ''} onChange={(ev) => actualizarItem('proveedores', i, 'concepto', ev.target.value)} />
            <InputPesos valor={p.valor} onChange={(v) => actualizarItem('proveedores', i, 'valor', v)} />
            <button className="fin-btn-icono" title="Quitar" onClick={() => quitarItem('proveedores', i)}><Trash2 size={16} /></button>
          </div>
        ))}
        <button className="fin-btn fin-btn-secundario" onClick={() => agregarItem('proveedores', { nombre: '', concepto: '', valor: 0 })}>
          <Plus size={14} /> Agregar proveedor
        </button>
        <div className="fin-total-linea"><span>Total proveedores</span><span className="num">{formatoPesos(c.proveedores)}</span></div>
      </div>

      {/* ---------- OPERACIÓN ---------- */}
      <div className="fin-seccion">
        <div className="fin-seccion-titulo"><ClipboardList size={18} color={COLORES.rojo} /> 5. Información operativa</div>
        <div className="fin-seccion-sub">Radicados y expedidos del mes.</div>
        <div className="fin-campos">
          <div className="fin-campo">
            <label className="fin-label">Total radicados</label>
            <InputNumero valor={borrador.radicados} onChange={(v) => actualizar({ radicados: v })} />
            {sistema.radicados > 0 && sistema.radicados !== borrador.radicados && (
              <div className="fin-sugerencia">
                <span>Según el Excel de proyectos: <strong>{sistema.radicados}</strong></span>
                <button onClick={() => actualizar({ radicados: sistema.radicados })}>Usar</button>
              </div>
            )}
          </div>
          <div className="fin-campo">
            <label className="fin-label">Total expedidos</label>
            <InputNumero valor={borrador.expedidos} onChange={(v) => actualizar({ expedidos: v })} />
            {sistema.expedidos > 0 && sistema.expedidos !== borrador.expedidos && (
              <div className="fin-sugerencia">
                <span>Según el Excel de proyectos: <strong>{sistema.expedidos}</strong></span>
                <button onClick={() => actualizar({ expedidos: sistema.expedidos })}>Usar</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ---------- NOTAS ---------- */}
      <div className="fin-seccion">
        <div className="fin-seccion-titulo"><FileText size={18} color={COLORES.rojo} /> 6. Observaciones para la Junta <span style={{ fontSize: 12, color: '#999', fontWeight: 400 }}>(opcional)</span></div>
        <div className="fin-seccion-sub">Aparecen en el resumen ejecutivo del informe. Ej.: hechos relevantes del mes, pagos extraordinarios.</div>
        <textarea className="fin-input fin-textarea" placeholder="Escribe aquí las observaciones del mes..." value={borrador.notas || ''} onChange={(e) => actualizar({ notas: e.target.value })} />
      </div>

      {existe && (
        <div style={{ textAlign: 'right' }}>
          <button className="fin-btn fin-btn-peligro" onClick={onEliminar} disabled={guardando}>
            <Trash2 size={14} /> Eliminar el registro de {nombreMes(clave)}
          </button>
        </div>
      )}

      {/* ---------- BARRA DE GUARDADO ---------- */}
      <div className="fin-barra-guardar">
        <div className="fin-barra-guardar-datos">
          <div className="fin-barra-guardar-dato"><span>Ingresos</span><strong>{formatoPesos(c.ingresos)}</strong></div>
          <div className="fin-barra-guardar-dato"><span>Gastos</span><strong>{formatoPesos(c.gastos)}</strong></div>
          <div className="fin-barra-guardar-dato">
            <span>{c.utilidad >= 0 ? 'Utilidad' : 'Pérdida'}</span>
            <strong style={{ color: c.utilidad >= 0 ? '#81c784' : '#ef9a9a' }}>{formatoPesos(c.utilidad)}</strong>
          </div>
          <div className="fin-barra-guardar-dato"><span>Margen</span><strong>{formatoPct(c.margen)}</strong></div>
        </div>
        <button className="fin-btn fin-btn-primario" onClick={onGuardar} disabled={guardando}>
          {guardando ? <RefreshCw size={16} /> : <Save size={16} />}
          {guardando ? 'Guardando...' : (modificado || !existe ? `Guardar ${nombreMes(clave)}` : 'Guardado')}
        </button>
      </div>
    </div>
  );
};
// ============================================
// RESUMEN DEL MES (dashboard)
// ============================================

const ResumenMes = ({ clave, meses, onIrARegistrar }) => {
  const registro = meses[clave] ? normalizarRegistro(meses[clave]) : null;

  if (!registro) {
    return (
      <div className="fin-vacio">
        <Wallet size={40} color="#ccc" />
        <h3>{nombreMes(clave)} no tiene información registrada</h3>
        <p>Registra los ingresos, la nómina y los proveedores del mes para ver el resumen.</p>
        <button className="fin-btn fin-btn-primario" onClick={onIrARegistrar}>
          <Plus size={16} /> Registrar {nombreMes(clave)}
        </button>
      </div>
    );
  }

  const c = calcularMes(registro);
  const claveAnt = mesAnterior(clave);
  const cAnt = meses[claveAnt] ? calcularMes(meses[claveAnt]) : null;
  const acum = acumuladoAnio(meses, clave);
  const serie = serieHistorica(meses, clave, 12);
  const { anio } = partesMes(clave);
  const tooltipPesos = (v) => formatoPesos(v);

  const filaComparacion = (etiqueta, actual, anterior, formato, opciones = {}) => (
    <tr key={etiqueta}>
      <td>{etiqueta}</td>
      <td className="num">{formato(actual)}</td>
      <td className="num">{anterior === null || anterior === undefined ? '—' : formato(anterior)}</td>
      <td className="num">{anterior === null || anterior === undefined ? '—' : textoVariacion(actual, anterior, opciones).valorTexto}</td>
      <td className="num"><BadgeVariacion actual={actual} anterior={anterior} {...opciones} sinDatos="—" /></td>
    </tr>
  );

  return (
    <div className="fin-wrap">
      {/* ---------- TARJETAS ---------- */}
      <div className="fin-kpis">
        <TarjetaKPI etiqueta="Ingresos" icono={<Wallet size={14} />} valor={formatoPesos(c.ingresos)} color="oscuro"
          sub={<><BadgeVariacion actual={c.ingresos} anterior={cAnt ? cAnt.ingresos : null} /> vs. mes anterior</>} />
        <TarjetaKPI etiqueta="Gastos" icono={<TrendingDown size={14} />} valor={formatoPesos(c.gastos)} color="rojo"
          sub={<><BadgeVariacion actual={c.gastos} anterior={cAnt ? cAnt.gastos : null} inverso /> vs. mes anterior</>} />
        <TarjetaKPI etiqueta={c.utilidad >= 0 ? 'Utilidad' : 'Pérdida'} icono={<TrendingUp size={14} />} valor={formatoPesos(c.utilidad)} color={c.utilidad >= 0 ? 'verde' : 'rojo'}
          sub={<><BadgeVariacion actual={c.utilidad} anterior={cAnt ? cAnt.utilidad : null} /> vs. mes anterior</>} />
        <TarjetaKPI etiqueta="Margen de utilidad" icono={<TrendingUp size={14} />} valor={formatoPct(c.margen)} color="naranja"
          sub={<><BadgeVariacion actual={c.margen} anterior={cAnt ? cAnt.margen : null} tipo="pct" /> vs. mes anterior</>} />
        <TarjetaKPI etiqueta="Radicados" icono={<FileText size={14} />} valor={formatoNumero(c.radicados)} color="azul"
          sub={<><BadgeVariacion actual={c.radicados} anterior={cAnt ? cAnt.radicados : null} tipo="numero" /> vs. mes anterior</>} />
        <TarjetaKPI etiqueta="Expedidos" icono={<CheckCircle size={14} />} valor={formatoNumero(c.expedidos)} color="gris"
          sub={<><BadgeVariacion actual={c.expedidos} anterior={cAnt ? cAnt.expedidos : null} tipo="numero" /> vs. mes anterior</>} />
      </div>

      {/* ---------- DESGLOSES ---------- */}
      <div className="fin-grid-2">
        <div className="fin-card">
          <div className="fin-card-titulo"><Wallet size={16} color={COLORES.rojo} /> Ingresos</div>
          <div className="fin-card-sub">Composición de los ingresos del mes {registro.ivaIncluido ? '(con IVA)' : '(sin IVA)'}</div>
          <FilaDesglose etiqueta="Cargo variable" valor={c.variable} total={c.ingresos} color={COLORES.oscuro} />
          <FilaDesglose etiqueta="Cargo fijo" valor={c.fijo} total={c.ingresos} color={COLORES.gris} />
          <FilaDesglose etiqueta="Cargo único" valor={c.unico} total={c.ingresos} color={COLORES.azul} />
          <div className="fin-desglose-total"><span>Total ingresos</span><span className="num">{formatoPesos(c.ingresos)}</span></div>
        </div>
        <div className="fin-card">
          <div className="fin-card-titulo"><TrendingDown size={16} color={COLORES.rojo} /> Gastos</div>
          <div className="fin-card-sub">Composición de los gastos del mes</div>
          <FilaDesglose etiqueta={`Nómina (${registro.nomina.length} empleados)`} valor={c.nomina} total={c.gastos} color={COLORES.rojo} />
          {c.prestaciones > 0 && (
            <FilaDesglose etiqueta="Primas y prestaciones" valor={c.prestaciones} total={c.gastos} color={COLORES.naranja} />
          )}
          <FilaDesglose etiqueta={`Proveedores (${registro.proveedores.length})`} valor={c.proveedores} total={c.gastos} color={COLORES.gris} />
          <div className="fin-desglose-total"><span>Total gastos</span><span className="num">{formatoPesos(c.gastos)}</span></div>
        </div>
      </div>

      {/* ---------- GRÁFICOS ---------- */}
      <div className="fin-grid-2">
        <div className="fin-card">
          <div className="fin-card-titulo">Ingresos vs. gastos</div>
          <div className="fin-card-sub">Últimos 12 meses registrados</div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={serie} margin={{ top: 5, right: 5, left: 5, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="etiqueta" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={formatoPesosCorto} tick={{ fontSize: 11 }} width={72} />
              <Tooltip formatter={tooltipPesos} />
              <Legend />
              <Bar dataKey="ingresos" name="Ingresos" fill={COLORES.oscuro} radius={[4, 4, 0, 0]} />
              <Bar dataKey="gastos" name="Gastos" fill={COLORES.rojo} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="fin-card">
          <div className="fin-card-titulo">Evolución de la utilidad</div>
          <div className="fin-card-sub">Últimos 12 meses registrados</div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={serie} margin={{ top: 10, right: 5, left: 5, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="etiqueta" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={formatoPesosCorto} tick={{ fontSize: 11 }} width={72} />
              <Tooltip formatter={tooltipPesos} />
              <Legend />
              <ReferenceLine y={0} stroke="#999" />
              <Line type="monotone" dataKey="utilidad" name="Utilidad" stroke={COLORES.verde} strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ---------- COMPARACIÓN ---------- */}
      <div className="fin-card">
        <div className="fin-card-titulo">Comparación con el mes anterior</div>
        <div className="fin-card-sub">{nombreMes(clave)} frente a {nombreMes(claveAnt)}</div>
        {cAnt ? (
          <div className="fin-tabla">
            <table>
              <thead>
                <tr>
                  <th>Concepto</th>
                  <th className="num">{nombreMes(clave)}</th>
                  <th className="num">{nombreMes(claveAnt)}</th>
                  <th className="num">Variación</th>
                  <th className="num">Var. %</th>
                </tr>
              </thead>
              <tbody>
                {filaComparacion('Ingresos', c.ingresos, cAnt.ingresos, formatoPesos)}
                {filaComparacion('Gastos', c.gastos, cAnt.gastos, formatoPesos, { inverso: true })}
                {filaComparacion('Utilidad', c.utilidad, cAnt.utilidad, formatoPesos)}
                {filaComparacion('Margen de utilidad', c.margen, cAnt.margen, formatoPct, { tipo: 'pct' })}
                {filaComparacion('Radicados', c.radicados, cAnt.radicados, formatoNumero, { tipo: 'numero' })}
                {filaComparacion('Expedidos', c.expedidos, cAnt.expedidos, formatoNumero, { tipo: 'numero' })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="fin-vacio-lista">No hay registro de {nombreMes(claveAnt)} para comparar.</div>
        )}
      </div>

      {/* ---------- ACUMULADO DEL AÑO ---------- */}
      <div className="fin-card">
        <div className="fin-card-titulo">Acumulado del año {anio}</div>
        <div className="fin-card-sub">
          Enero a {nombreMes(clave).split(' ')[0].toLowerCase()} · {acum.total.mesesConDatos} {acum.total.mesesConDatos === 1 ? 'mes registrado' : 'meses registrados'}
        </div>
        <div className="fin-tabla">
          <table>
            <thead>
              <tr>
                <th>Mes</th>
                <th className="num">Ingresos</th>
                <th className="num">Gastos</th>
                <th className="num">Utilidad</th>
                <th className="num">Margen</th>
                <th className="num">Radicados</th>
                <th className="num">Expedidos</th>
              </tr>
            </thead>
            <tbody>
              {acum.detalle.map(m => (
                <tr key={m.clave} className={m.clave === clave ? 'actual' : ''}>
                  <td>{nombreMes(m.clave)}</td>
                  <td className="num">{formatoPesos(m.ingresos)}</td>
                  <td className="num">{formatoPesos(m.gastos)}</td>
                  <td className="num" style={{ color: m.utilidad >= 0 ? COLORES.verde : COLORES.rojo }}>{formatoPesos(m.utilidad)}</td>
                  <td className="num">{formatoPct(m.margen)}</td>
                  <td className="num">{formatoNumero(m.radicados)}</td>
                  <td className="num">{formatoNumero(m.expedidos)}</td>
                </tr>
              ))}
              <tr className="total">
                <td>Total</td>
                <td className="num">{formatoPesos(acum.total.ingresos)}</td>
                <td className="num">{formatoPesos(acum.total.gastos)}</td>
                <td className="num">{formatoPesos(acum.total.utilidad)}</td>
                <td className="num">{formatoPct(acum.total.margen)}</td>
                <td className="num">{formatoNumero(acum.total.radicados)}</td>
                <td className="num">{formatoNumero(acum.total.expedidos)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ---------- DETALLE ---------- */}
      <div className="fin-grid-2">
        <div className="fin-card">
          <div className="fin-card-titulo"><Users size={16} color={COLORES.rojo} /> Detalle de nómina</div>
          <div className="fin-card-sub">{registro.nomina.length} empleados · valores netos</div>
          <div className="fin-tabla">
            <table style={{ minWidth: 0 }}>
              <thead><tr><th>Empleado</th><th className="num">Valor</th></tr></thead>
              <tbody>
                {registro.nomina.map((e, i) => (
                  <tr key={i}><td>{e.nombre || '—'}</td><td className="num">{formatoPesos(e.valor)}</td></tr>
                ))}
                {registro.prestaciones.map((p, i) => (
                  <tr key={`p${i}`}><td style={{ color: COLORES.naranja }}>{p.concepto || 'Prestación'}</td><td className="num">{formatoPesos(p.valor)}</td></tr>
                ))}
                <tr className="total"><td>Total</td><td className="num">{formatoPesos(c.nomina + c.prestaciones)}</td></tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="fin-card">
          <div className="fin-card-titulo"><Truck size={16} color={COLORES.rojo} /> Detalle de proveedores</div>
          <div className="fin-card-sub">{registro.proveedores.length} pagos registrados</div>
          <div className="fin-tabla">
            <table style={{ minWidth: 0 }}>
              <thead><tr><th>Proveedor</th><th>Concepto</th><th className="num">Valor</th></tr></thead>
              <tbody>
                {registro.proveedores.length === 0 && (
                  <tr><td colSpan="3" style={{ color: '#999', textAlign: 'center' }}>Sin pagos a proveedores</td></tr>
                )}
                {registro.proveedores.map((p, i) => (
                  <tr key={i}><td>{p.nombre || '—'}</td><td>{p.concepto || '—'}</td><td className="num">{formatoPesos(p.valor)}</td></tr>
                ))}
                <tr className="total"><td colSpan="2">Total proveedores</td><td className="num">{formatoPesos(c.proveedores)}</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
// ============================================
// COMPONENTE PRINCIPAL: INGRESOS Y FINANZAS
// ============================================
// Uso desde main.jsx:
//   import Finanzas, { puedeVerFinanzas } from './Finanzas.jsx';
//   <Finanzas token={token} usuario={usuarioActual} proyectos={proyectos} onSesionExpirada={cerrarSesion} />

export default function Finanzas({ token, usuario, proyectos = [], onSesionExpirada }) {
  const permitido = puedeVerFinanzas(usuario);

  const [meses, setMeses] = useState({});
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [inicializado, setInicializado] = useState(false);

  const [clave, setClave] = useState(mesPorDefecto());
  const [pestana, setPestana] = useState('resumen');

  const [borrador, setBorrador] = useState(null);
  const [modificado, setModificado] = useState(false);
  const [precargadoDe, setPrecargadoDe] = useState(null);
  const [guardando, setGuardando] = useState(false);

  const [mostrarInforme, setMostrarInforme] = useState(false);
  const [incluirNomina, setIncluirNomina] = useState(false);
  const [toast, setToast] = useState(null);

  // ---------- API ----------
  const llamarApi = async (metodo, { cuerpo, mes } = {}) => {
    const url = mes ? `/api/finanzas?mes=${encodeURIComponent(mes)}` : '/api/finanzas';
    const r = await fetch(url, {
      method: metodo,
      headers: {
        Authorization: `Bearer ${token}`,
        ...(cuerpo ? { 'Content-Type': 'application/json' } : {})
      },
      body: cuerpo ? JSON.stringify(cuerpo) : undefined
    });
    if (r.status === 401) {
      if (onSesionExpirada) onSesionExpirada();
      throw new Error('La sesión expiró. Vuelve a iniciar sesión.');
    }
    const data = await r.json().catch(() => ({}));
    if (r.status === 403) throw new Error('Acceso restringido');
    if (!r.ok || !data.success) throw new Error(data.error || 'Error del servidor');
    return data;
  };

  const cargar = async () => {
    setCargando(true);
    setError(null);
    try {
      const data = await llamarApi('GET');
      const datos = data.meses || {};
      setMeses(datos);
      if (!inicializado) {
        // Si el mes actual no tiene datos, abrir el último mes registrado
        const hoyK = mesPorDefecto();
        if (!datos[hoyK]) {
          const registrados = Object.keys(datos).filter(k => k <= hoyK).sort();
          if (registrados.length > 0) setClave(registrados[registrados.length - 1]);
        }
        setInicializado(true);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    if (permitido && token) cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permitido, token]);

  // ---------- BORRADOR DEL MES ----------
  useEffect(() => {
    if (meses[clave]) {
      setBorrador(normalizarRegistro(meses[clave]));
      setPrecargadoDe(null);
    } else {
      const ref = registroAnteriorMasCercano(meses, clave);
      const nuevo = registroVacio();
      if (ref) nuevo.nomina = clonar(normalizarRegistro(meses[ref]).nomina);
      setBorrador(nuevo);
      setPrecargadoDe(ref && nuevo.nomina.length > 0 ? ref : null);
    }
    setModificado(false);
  }, [clave, meses]);

  // Aviso al cerrar la pestaña con cambios sin guardar
  useEffect(() => {
    if (!modificado) return undefined;
    const aviso = (e) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', aviso);
    return () => window.removeEventListener('beforeunload', aviso);
  }, [modificado]);

  // Ocultar el aviso flotante después de unos segundos
  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  // ---------- ACCIONES ----------
  const confirmarDescartar = () =>
    !modificado || window.confirm('Tienes cambios sin guardar en este mes. ¿Deseas descartarlos?');

  const cambiarMes = (nuevaClave) => {
    if (nuevaClave === clave) return;
    if (!confirmarDescartar()) return;
    setClave(nuevaClave);
  };

  const actualizarDatos = () => {
    if (!confirmarDescartar()) return;
    cargar();
  };

  const cambiarBorrador = (nuevo) => {
    setBorrador(nuevo);
    setModificado(true);
  };

  const guardar = async () => {
    if (!borrador) return;
    const c = calcularMes(borrador);
    if (c.ingresos === 0 && !window.confirm('Los ingresos del mes están en $ 0. ¿Deseas guardar de todas formas?')) return;
    const sinNombre = borrador.nomina.some(e => !String(e.nombre || '').trim() && e.valor > 0) ||
                      borrador.proveedores.some(p => !String(p.nombre || '').trim() && p.valor > 0);
    if (sinNombre && !window.confirm('Hay filas con valor pero sin nombre. ¿Deseas guardar de todas formas?')) return;

    setGuardando(true);
    try {
      const data = await llamarApi('POST', { cuerpo: { mes: clave, datos: borrador } });
      setMeses(prev => ({ ...prev, [clave]: data.registro }));
      setModificado(false);
      setToast({ texto: `${nombreMes(clave)} guardado correctamente`, tipo: 'ok' });
    } catch (e) {
      setToast({ texto: `No se pudo guardar: ${e.message}`, tipo: 'error' });
    } finally {
      setGuardando(false);
    }
  };

  const eliminar = async () => {
    if (!window.confirm(`¿Eliminar todo el registro de ${nombreMes(clave)}? Esta acción no se puede deshacer.`)) return;
    if (!window.confirm('Confirma de nuevo: se borrarán ingresos, nómina y proveedores de este mes.')) return;
    setGuardando(true);
    try {
      await llamarApi('DELETE', { mes: clave });
      setMeses(prev => {
        const copia = { ...prev };
        delete copia[clave];
        return copia;
      });
      setToast({ texto: `Registro de ${nombreMes(clave)} eliminado`, tipo: 'ok' });
    } catch (e) {
      setToast({ texto: `No se pudo eliminar: ${e.message}`, tipo: 'error' });
    } finally {
      setGuardando(false);
    }
  };

  const abrirInforme = () => {
    if (!meses[clave]) return;
    if (modificado && !window.confirm('Tienes cambios sin guardar. El informe usará la última versión guardada. ¿Continuar?')) return;
    setMostrarInforme(true);
  };

  const imprimir = () => {
    const ok = imprimirInforme(`Informe Junta - Curaduría Urbana 2 Pereira - ${nombreMes(clave)}`);
    if (!ok) setToast({ texto: 'El navegador bloqueó la ventana. Permite ventanas emergentes para este sitio.', tipo: 'error' });
  };

  // ---------- ACCESO RESTRINGIDO ----------
  if (!permitido) {
    return (
      <div className="fin-vacio">
        <style>{STYLES_FINANZAS}</style>
        <Lock size={40} color="#ccc" />
        <h3>Acceso restringido</h3>
        <p>Esta sección está disponible únicamente para la administración de la Curaduría.</p>
      </div>
    );
  }

  const { anio: anioSel, mes: mesSel } = partesMes(clave);

  // ---------- PANTALLA ----------
  return (
    <div className="fin-wrap">
      <style>{STYLES_FINANZAS}</style>

      <div className="fin-encabezado">
        <div>
          <div className="fin-titulo"><Wallet size={24} color={COLORES.rojo} /> Ingresos y Finanzas</div>
          <div className="fin-subtitulo">Informe mensual de ingresos, gastos y utilidad · {nombreMes(clave)}</div>
        </div>
        <span className="fin-badge-privado"><Lock size={12} /> Solo administración</span>
      </div>

      <div className="fin-barra">
        <div className="fin-selectores">
          <select className="fin-select" value={mesSel} onChange={(e) => cambiarMes(claveMes(anioSel, Number(e.target.value)))}>
            {MESES.map((m, i) => (
              <option key={m} value={i + 1}>{m}{meses[claveMes(anioSel, i + 1)] ? '  ●' : ''}</option>
            ))}
          </select>
          <select className="fin-select" value={anioSel} onChange={(e) => cambiarMes(claveMes(Number(e.target.value), mesSel))}>
            {ANIOS.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
          <button className="fin-btn-icono" title="Actualizar datos" onClick={actualizarDatos}><RefreshCw size={16} /></button>
        </div>

        <div className="fin-tabs">
          <button className={`fin-tab ${pestana === 'resumen' ? 'active' : ''}`} onClick={() => setPestana('resumen')}>
            <TrendingUp size={15} /> Resumen
          </button>
          <button className={`fin-tab ${pestana === 'registrar' ? 'active' : ''}`} onClick={() => setPestana('registrar')}>
            <FileText size={15} /> Registrar mes{modificado ? ' •' : ''}
          </button>
        </div>

        <div className="fin-acciones">
          <button className="fin-btn fin-btn-oscuro" onClick={abrirInforme} disabled={!meses[clave]}
            title={meses[clave] ? '' : 'Primero registra y guarda este mes'}>
            <Printer size={16} /> Generar Informe para Junta
          </button>
        </div>
      </div>

      {error && (
        <div className="fin-aviso error">
          <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
          <span style={{ flex: 1 }}>No se pudo cargar la información: {error}</span>
          <button className="fin-btn fin-btn-secundario" onClick={cargar}>Reintentar</button>
        </div>
      )}

      {cargando && <div className="fin-cargando">Cargando información financiera...</div>}

      {!cargando && !error && pestana === 'resumen' && (
        <ResumenMes clave={clave} meses={meses} onIrARegistrar={() => setPestana('registrar')} />
      )}

      {!cargando && !error && pestana === 'registrar' && borrador && (
        <FormularioMes
          clave={clave}
          borrador={borrador}
          onCambiar={cambiarBorrador}
          meses={meses}
          proyectos={proyectos}
          onGuardar={guardar}
          onEliminar={eliminar}
          guardando={guardando}
          existe={!!meses[clave]}
          precargadoDe={precargadoDe}
          modificado={modificado}
        />
      )}

      {/* ---------- VISTA PREVIA DEL INFORME ---------- */}
      {mostrarInforme && meses[clave] && (
        <div className="fin-overlay" onClick={() => setMostrarInforme(false)}>
          <div className="fin-overlay-barra" onClick={(e) => e.stopPropagation()}>
            <strong style={{ fontSize: 16 }}>Informe para la Junta · {nombreMes(clave)}</strong>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
              <label className="fin-check">
                <input type="checkbox" checked={incluirNomina} onChange={(e) => setIncluirNomina(e.target.checked)} />
                Incluir detalle de nómina por empleado
              </label>
              <button className="fin-btn fin-btn-primario" onClick={imprimir}>
                <Printer size={16} /> Imprimir / Guardar PDF
              </button>
              <button className="fin-btn fin-btn-secundario" onClick={() => setMostrarInforme(false)}>
                <X size={16} /> Cerrar
              </button>
            </div>
          </div>
          <div className="fin-overlay-hoja" onClick={(e) => e.stopPropagation()}>
            <style>{STYLES_INFORME}</style>
            <InformeJunta clave={clave} meses={meses} incluirNomina={incluirNomina} />
          </div>
        </div>
      )}

      {toast && (
        <div className={`fin-toast ${toast.tipo === 'error' ? 'error' : ''}`}>
          {toast.tipo === 'error' ? <AlertTriangle size={16} /> : <CheckCircle size={16} />}
          {toast.texto}
        </div>
      )}
    </div>
  );
}
