import React, { useState, useMemo } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, FileText, CheckCircle, Clock, AlertTriangle, TrendingUp, Printer, X, ArrowUpRight, ArrowDownRight, Minus, ArrowLeft, Lock, ClipboardList, Award } from 'lucide-react';

// ============================================
// INFORME DE EQUIPO
// Curaduría Urbana N.° 2 de Pereira
// ============================================
// Lee los datos del Excel de proyectos que ya carga main.jsx.
// No guarda nada: todo se calcula en el momento.
//
// MAPA DEL ARCHIVO
// Parte 1: imports, acceso, fechas y cálculos
// Parte 2: STYLES_EQUIPO (estilos de la pantalla)
// Parte 3: STYLES_INFORME_EQ + componentes pequeños
// Parte 4: InformeGeneral (informe imprimible del equipo)
// Parte 5: InformeIndividual + FichaProfesional
// Parte 6: componente principal InformeEquipo (export default)
//
// Importante: los expedidos se cuentan por la FECHA DE EXPEDICIÓN
// (fechaLicencia), no por la fecha de radicación.

// ============================================
// ACCESO
// ============================================

export const USUARIOS_INFORME_EQUIPO = ['juanmontes', 'luisfernando'];

export const puedeVerInformeEquipo = (usuario) =>
  !!usuario && USUARIOS_INFORME_EQUIPO.includes(String(usuario.username || '').toLowerCase());

// ============================================
// CONSTANTES
// ============================================

const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const MESES_CORTOS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

const MESES_COMPARATIVO = 6;

const ANIO_ACTUAL = new Date().getFullYear();
const ANIOS = [];
for (let a = 2024; a <= ANIO_ACTUAL + 1; a++) ANIOS.push(a);

const COLORES = {
  rojo: '#c62828',
  verde: '#388e3c',
  azul: '#1976d2',
  naranja: '#f57c00',
  morado: '#7b1fa2',
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
// FECHAS
// ============================================
// Las fechas llegan como texto dd/mm/aaaa desde main.jsx.

const esDelMes = (fechaStr, clave) => {
  if (!fechaStr || typeof fechaStr !== 'string') return false;
  const { anio, mes } = partesMes(clave);
  const p = fechaStr.split('/');
  return p.length === 3 && parseInt(p[2], 10) === anio && parseInt(p[1], 10) === mes;
};

const textoFecha = (fechaStr) => {
  if (!fechaStr) return '—';
  const p = String(fechaStr).split('/');
  if (p.length !== 3) return fechaStr;
  return `${p[0]}/${p[1]}/${p[2]}`;
};

const formatoNumero = (n) => (Number(n) || 0).toLocaleString('es-CO');

const formatoPct = (n) =>
  (n === null || n === undefined || !isFinite(n)) ? '—' : `${n.toFixed(1).replace('.', ',')} %`;

const formatoFechaHora = (iso) => {
  const d = new Date(iso);
  if (isNaN(d)) return '';
  return `${d.getDate()} de ${MESES[d.getMonth()].toLowerCase()} de ${d.getFullYear()}, ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};

// ============================================
// EVENTOS DE REVISIÓN
// ============================================
// Cada evento es una revisión efectivamente realizada por un profesional.
// Se usa para contar la producción del mes.

const EVENTOS_ARQ = [
  { campo: 'fechaPrimeraRevArq', etiqueta: '1ra revisión arq.', vuelta: 1 },
  { campo: 'fechaSegundaRevArq', etiqueta: '2da revisión arq.', vuelta: 2 },
  { campo: 'fechaTerceraRevArq', etiqueta: '3ra revisión arq.', vuelta: 3 },
  { campo: 'fechaRevFinalArq',   etiqueta: 'Revisión final arq.', vuelta: 4 }
];

const EVENTOS_ESTR = [
  { campo: 'fechaPrimeraRevIng',   etiqueta: '1ra revisión estr.', vuelta: 1 },
  { campo: 'fechaSegundaRevEstr',  etiqueta: '2da revisión estr.', vuelta: 2 },
  { campo: 'fechaTerceraRevEstr',  etiqueta: '3ra revisión estr.', vuelta: 3 }
];

// Revisiones hechas por un profesional en un mes
const revisionesDelMes = (proyectos, nombre, clave) => {
  const lista = [];
  (proyectos || []).forEach(p => {
    if (p.nombreArquitecto === nombre) {
      EVENTOS_ARQ.forEach(ev => {
        if (esDelMes(p[ev.campo], clave)) {
          lista.push({ radicado: p.radicado, etiqueta: ev.etiqueta, vuelta: ev.vuelta, area: 'arq', fecha: p[ev.campo], estrategico: p.estrategico });
        }
      });
    }
    if (p.nombreIngeniero === nombre) {
      EVENTOS_ESTR.forEach(ev => {
        if (esDelMes(p[ev.campo], clave)) {
          lista.push({ radicado: p.radicado, etiqueta: ev.etiqueta, vuelta: ev.vuelta, area: 'estr', fecha: p[ev.campo], estrategico: p.estrategico });
        }
      });
    }
  });
  return lista.sort((a, b) => {
    const da = String(a.fecha).split('/').reverse().join('');
    const db = String(b.fecha).split('/').reverse().join('');
    return da.localeCompare(db);
  });
};

// ============================================
// INDICADORES DEL MES (equipo completo)
// ============================================

const indicadoresMes = (proyectos, clave, getEstadoFlujo, ESTADOS_REVISION) => {
  const lista = proyectos || [];
  const radicados = lista.filter(p => esDelMes(p.fechaRadicacion, clave));
  const expedidos = lista.filter(p => esDelMes(p.fechaLicencia, clave));
  const actas = lista.filter(p => esDelMes(p.actaObservaciones, clave));
  const desistidos = lista.filter(p => esDelMes(p.fechaFinalizacion, clave) && getEstadoFlujo(p) === 'DESISTIDO');

  // Revisiones realizadas por todo el equipo en el mes
  let revisiones = 0;
  lista.forEach(p => {
    EVENTOS_ARQ.forEach(ev => { if (p.nombreArquitecto && esDelMes(p[ev.campo], clave)) revisiones++; });
    EVENTOS_ESTR.forEach(ev => { if (p.nombreIngeniero && esDelMes(p[ev.campo], clave)) revisiones++; });
  });

  const tasa = radicados.length > 0 ? (expedidos.length / radicados.length) * 100 : null;

  return {
    radicados: radicados.length,
    expedidos: expedidos.length,
    actas: actas.length,
    desistidos: desistidos.length,
    revisiones,
    tasa,
    listaRadicados: radicados,
    listaExpedidos: expedidos
  };
};

// Serie para los gráficos comparativos
const serieMeses = (proyectos, clave, n, getEstadoFlujo, ESTADOS_REVISION) =>
  ultimosMeses(clave, n).map(k => {
    const ind = indicadoresMes(proyectos, k, getEstadoFlujo, ESTADOS_REVISION);
    return {
      clave: k,
      etiqueta: nombreMesCorto(k),
      radicados: ind.radicados,
      expedidos: ind.expedidos,
      actas: ind.actas,
      revisiones: ind.revisiones
    };
  });

// ============================================
// PRODUCTIVIDAD POR PROFESIONAL
// ============================================

const statsProfesional = (proyectos, tecnico, clave, getEstadoFlujo, getFechaLimiteEtapa, ESTADOS_REVISION, diasHabilesEntreFechas, excelDateToDate) => {
  const nombre = tecnico.nombre;
  const esArq = tecnico.tipo === 'arquitecto';
  const lista = proyectos || [];

  const mios = lista.filter(p =>
    (esArq && p.nombreArquitecto === nombre) || (!esArq && p.nombreIngeniero === nombre)
  );

  const revisiones = revisionesDelMes(lista, nombre, clave);

  // Proyectos actualmente en revisión a su cargo
  const activos = mios.filter(p => {
    const estado = getEstadoFlujo(p);
    if (!ESTADOS_REVISION.includes(estado)) return false;
    return esArq ? estado.startsWith('REV_ARQ') : estado.startsWith('REV_ESTR');
  });

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const vencidos = activos.filter(p => {
    const limite = getFechaLimiteEtapa(p);
    return limite && limite < hoy;
  });

  const sinFecha = activos.filter(p => !getFechaLimiteEtapa(p));

  // Licencias expedidas en el mes en las que participó
  const expedidos = mios.filter(p => esDelMes(p.fechaLicencia, clave));

  // Actas notificadas en el mes de sus proyectos
  const actas = mios.filter(p => esDelMes(p.actaObservaciones, clave));

  // Tiempo promedio de primera revisión (desde LDF hasta la revisión)
  const tiempos = [];
  mios.forEach(p => {
    const campoRev = esArq ? 'fechaPrimeraRevArq' : 'fechaPrimeraRevIng';
    const fIni = excelDateToDate(p.fechaLegal);
    const fRev = excelDateToDate(p[campoRev]);
    if (fIni && fRev) {
      const d = diasHabilesEntreFechas(fIni, fRev);
      if (d !== null) tiempos.push(d);
    }
  });
  const promedio = tiempos.length > 0 ? Math.round(tiempos.reduce((a, b) => a + b, 0) / tiempos.length) : null;

  return {
    tecnico,
    nombre,
    esArq,
    totalAsignados: mios.length,
    revisiones,
    totalRevisiones: revisiones.length,
    activos,
    vencidos,
    sinFecha,
    expedidos,
    actas,
    promedioPrimeraRevision: promedio,
    muestraTiempos: tiempos.length
  };
};

// Promedio del equipo, para comparar en la ficha individual
const promedioEquipo = (statsTodos) => {
  const valores = statsTodos.map(s => s.promedioPrimeraRevision).filter(v => v !== null);
  if (valores.length === 0) return null;
  return Math.round(valores.reduce((a, b) => a + b, 0) / valores.length);
};

// ============================================
// VARIACIONES
// ============================================

const variacionTexto = (actual, anterior) => {
  if (anterior === null || anterior === undefined) return { texto: 'Sin mes anterior', clase: 'igual', valorTexto: '—' };
  const d = (Number(actual) || 0) - (Number(anterior) || 0);
  const pct = anterior !== 0 ? (d / Math.abs(anterior)) * 100 : null;
  const texto = pct === null
    ? (d === 0 ? '0,0 %' : 'N/A')
    : `${pct > 0 ? '+' : ''}${pct.toFixed(1).replace('.', ',')} %`;
  const clase = d === 0 ? 'igual' : (d > 0 ? 'bien' : 'mal');
  return { texto, clase, valorTexto: `${d > 0 ? '+' : ''}${formatoNumero(d)}`, diferencia: d };
};

// Texto automático del resumen del informe general
const resumenEquipo = (clave, ind, indAnt, statsTodos) => {
  const frases = [];
  frases.push(
    `En ${nombreMes(clave)} se radicaron ${formatoNumero(ind.radicados)} solicitudes y se expidieron ${formatoNumero(ind.expedidos)} licencias. ` +
    `El equipo realizó ${formatoNumero(ind.revisiones)} revisiones y notificó ${formatoNumero(ind.actas)} actas de observaciones.`
  );
  if (indAnt) {
    const vr = variacionTexto(ind.radicados, indAnt.radicados);
    const ve = variacionTexto(ind.expedidos, indAnt.expedidos);
    frases.push(
      `Frente a ${nombreMes(mesAnterior(clave))}, los radicados ${vr.diferencia >= 0 ? 'aumentaron' : 'disminuyeron'} en ${Math.abs(vr.diferencia)} ` +
      `y las licencias expedidas ${ve.diferencia >= 0 ? 'aumentaron' : 'disminuyeron'} en ${Math.abs(ve.diferencia)}.`
    );
  }
  const totalVencidos = statsTodos.reduce((s, x) => s + x.vencidos.length, 0);
  const totalSinFecha = statsTodos.reduce((s, x) => s + x.sinFecha.length, 0);
  if (totalVencidos > 0) {
    frases.push(`Actualmente hay ${totalVencidos} ${totalVencidos === 1 ? 'proyecto vencido' : 'proyectos vencidos'} en revisión, que requieren atención prioritaria.`);
  } else {
    frases.push('Actualmente no hay proyectos vencidos en revisión.');
  }
  if (totalSinFecha > 0) {
    frases.push(`${totalSinFecha} ${totalSinFecha === 1 ? 'proyecto no tiene' : 'proyectos no tienen'} fecha de inicio de revisión registrada en el Excel, por lo que no es posible calcular su vencimiento.`);
  }
  return frases;
};
// ============================================
// ESTILOS DE LA PANTALLA (mismo diseño de la plataforma)
// ============================================

const STYLES_EQUIPO = `
.eq-wrap { display: flex; flex-direction: column; gap: 20px; }
.eq-encabezado { display: flex; justify-content: space-between; align-items: flex-start; gap: 15px; flex-wrap: wrap; }
.eq-titulo { font-size: 24px; font-weight: 700; color: #1a1a1a; display: flex; align-items: center; gap: 10px; }
.eq-subtitulo { color: #666; font-size: 14px; margin-top: 4px; }
.eq-badge-privado { display: inline-flex; align-items: center; gap: 6px; background: #1a1a1a; color: white; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; letter-spacing: 0.3px; }

.eq-barra { background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); padding: 15px 20px; display: flex; justify-content: space-between; align-items: center; gap: 15px; flex-wrap: wrap; }
.eq-selectores { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
.eq-select { padding: 10px 14px; border: 1px solid #e0e0e0; border-radius: 8px; font-size: 14px; background: white; cursor: pointer; font-family: inherit; }
.eq-select:focus { outline: none; border-color: #c62828; }
.eq-acciones { display: flex; gap: 10px; flex-wrap: wrap; }

.eq-btn { border: none; padding: 10px 18px; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 500; display: inline-flex; align-items: center; gap: 6px; transition: all 0.2s; font-family: inherit; }
.eq-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.eq-btn-primario { background: #c62828; color: white; }
.eq-btn-primario:hover:not(:disabled) { background: #b71c1c; }
.eq-btn-oscuro { background: #1a1a1a; color: white; }
.eq-btn-oscuro:hover:not(:disabled) { background: #333; }
.eq-btn-secundario { background: white; color: #333; border: 1px solid #e0e0e0; }
.eq-btn-secundario:hover:not(:disabled) { border-color: #c62828; color: #c62828; }

.eq-kpis { display: grid; grid-template-columns: repeat(5, 1fr); gap: 16px; }
.eq-kpi { background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); border-left: 4px solid #c62828; }
.eq-kpi-label { color: #666; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.4px; margin-bottom: 8px; display: flex; align-items: center; gap: 6px; }
.eq-kpi-valor { font-size: 30px; font-weight: 700; color: #1a1a1a; font-variant-numeric: tabular-nums; }
.eq-kpi-sub { margin-top: 8px; font-size: 12px; color: #888; display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.eq-kpi.azul { border-left-color: #1976d2; } .eq-kpi.azul .eq-kpi-valor { color: #1976d2; }
.eq-kpi.verde { border-left-color: #388e3c; } .eq-kpi.verde .eq-kpi-valor { color: #388e3c; }
.eq-kpi.naranja { border-left-color: #f57c00; } .eq-kpi.naranja .eq-kpi-valor { color: #f57c00; }
.eq-kpi.rojo { border-left-color: #c62828; } .eq-kpi.rojo .eq-kpi-valor { color: #c62828; }
.eq-kpi.morado { border-left-color: #7b1fa2; } .eq-kpi.morado .eq-kpi-valor { color: #7b1fa2; }
.eq-kpi.gris { border-left-color: #78909c; } .eq-kpi.gris .eq-kpi-valor { color: #546e7a; }

.eq-var { display: inline-flex; align-items: center; gap: 3px; padding: 3px 8px; border-radius: 10px; font-size: 12px; font-weight: 600; font-variant-numeric: tabular-nums; }
.eq-var.bien { background: #e8f5e9; color: #388e3c; }
.eq-var.mal { background: #ffebee; color: #c62828; }
.eq-var.igual { background: #eceff1; color: #546e7a; }

.eq-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.eq-card { background: white; padding: 22px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
.eq-card-titulo { font-size: 16px; font-weight: 600; color: #333; margin-bottom: 4px; display: flex; align-items: center; gap: 8px; }
.eq-card-sub { font-size: 13px; color: #888; margin-bottom: 16px; }

.eq-tabla { width: 100%; overflow-x: auto; -webkit-overflow-scrolling: touch; }
.eq-tabla table { width: 100%; border-collapse: collapse; min-width: 640px; }
.eq-tabla th { background: #f5f5f5; padding: 10px 12px; text-align: left; font-size: 12px; color: #666; font-weight: 600; text-transform: uppercase; letter-spacing: 0.3px; border-bottom: 2px solid #e0e0e0; }
.eq-tabla td { padding: 10px 12px; border-bottom: 1px solid #f0f0f0; font-size: 14px; }
.eq-tabla tr.total td { font-weight: 700; background: #fafafa; border-top: 2px solid #e0e0e0; }
.eq-tabla tr.actual td { background: #fff5f5; font-weight: 600; }
.eq-tabla tr.clicable { cursor: pointer; }
.eq-tabla tr.clicable:hover td { background: #fff5f5; }
.num { text-align: right !important; font-variant-numeric: tabular-nums; white-space: nowrap; }

.eq-persona { display: flex; align-items: center; gap: 10px; }
.eq-avatar { width: 34px; height: 34px; border-radius: 50%; background: #c62828; color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 12px; flex-shrink: 0; }
.eq-avatar.ing { background: #7b1fa2; }
.eq-persona-info { display: flex; flex-direction: column; line-height: 1.3; }
.eq-persona-nombre { font-weight: 600; color: #1a1a1a; }
.eq-persona-rol { font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 0.4px; }

.eq-chip { display: inline-block; padding: 3px 10px; border-radius: 12px; font-size: 12px; font-weight: 600; }
.eq-chip.verde { background: #e8f5e9; color: #388e3c; }
.eq-chip.rojo { background: #ffebee; color: #c62828; }
.eq-chip.naranja { background: #fff3e0; color: #f57c00; }
.eq-chip.azul { background: #e3f2fd; color: #1976d2; }
.eq-chip.gris { background: #eceff1; color: #546e7a; }
.eq-chip.morado { background: #f3e5f5; color: #7b1fa2; }

.eq-aviso { border-radius: 8px; padding: 12px 16px; font-size: 13px; display: flex; gap: 10px; align-items: flex-start; line-height: 1.5; }
.eq-aviso.info { background: #e3f2fd; border: 1px solid #90caf9; color: #1565c0; }
.eq-aviso.alerta { background: #fff8e1; border: 1px solid #ffe082; color: #8d6e00; }

.eq-vacio { background: white; border-radius: 12px; padding: 50px 20px; text-align: center; color: #888; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
.eq-vacio h3 { color: #333; font-size: 18px; margin: 12px 0 6px; }
.eq-vacio-lista { color: #999; font-size: 13px; padding: 12px 0; font-style: italic; }

/* ---- Ficha individual ---- */
.eq-ficha-cabecera { background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); padding: 22px; display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap; }
.eq-ficha-persona { display: flex; align-items: center; gap: 16px; }
.eq-ficha-avatar { width: 58px; height: 58px; border-radius: 50%; background: #c62828; color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 20px; flex-shrink: 0; }
.eq-ficha-avatar.ing { background: #7b1fa2; }
.eq-ficha-nombre { font-size: 22px; font-weight: 700; color: #1a1a1a; }
.eq-ficha-rol { font-size: 13px; color: #888; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 2px; }

.eq-lista-rev { display: flex; flex-direction: column; gap: 8px; max-height: 320px; overflow-y: auto; }
.eq-item-rev { display: flex; align-items: center; gap: 10px; padding: 9px 12px; border: 1px solid #f0f0f0; border-radius: 8px; font-size: 13px; }
.eq-item-rev strong { color: #c62828; }
.eq-item-rev .fecha { margin-left: auto; color: #999; font-size: 12px; white-space: nowrap; }

.eq-overlay { position: fixed; inset: 0; z-index: 2000; background: rgba(30,30,30,0.85); overflow-y: auto; padding: 20px; }
.eq-overlay-barra { max-width: 860px; margin: 0 auto 16px; display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; color: white; }
.eq-overlay-hoja { max-width: 860px; margin: 0 auto 40px; background: white; border-radius: 6px; box-shadow: 0 10px 40px rgba(0,0,0,0.4); padding: 48px 56px; }

.eq-toast { position: fixed; bottom: 24px; right: 24px; z-index: 3000; background: #c62828; color: white; padding: 14px 20px; border-radius: 10px; font-size: 14px; font-weight: 500; display: flex; align-items: center; gap: 8px; box-shadow: 0 8px 24px rgba(0,0,0,0.2); }

@media (max-width: 1024px) {
  .eq-kpis { grid-template-columns: repeat(3, 1fr); }
  .eq-grid-2 { grid-template-columns: 1fr; }
}

@media (max-width: 768px) {
  .eq-titulo { font-size: 20px; }
  .eq-barra { padding: 12px; }
  .eq-kpis { grid-template-columns: repeat(2, 1fr); gap: 10px; }
  .eq-kpi { padding: 14px; }
  .eq-kpi-valor { font-size: 22px; }
  .eq-card { padding: 16px; }
  .eq-ficha-cabecera { padding: 16px; }
  .eq-ficha-nombre { font-size: 18px; }
  .eq-overlay { padding: 10px; }
  .eq-overlay-hoja { padding: 24px 18px; }
  .eq-toast { left: 16px; right: 16px; bottom: 16px; }
}
`;
// ============================================
// ESTILOS DE LOS INFORMES IMPRIMIBLES
// ============================================

const STYLES_INFORME_EQ = `
@page { size: letter; margin: 14mm 14mm 16mm 14mm; }
.ieq-doc { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1a1a1a; font-size: 12px; line-height: 1.5; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.ieq-doc * { box-sizing: border-box; }
.ieq-cabecera { display: flex; justify-content: space-between; align-items: flex-start; gap: 20px; padding-bottom: 16px; border-bottom: 3px solid #c62828; margin-bottom: 20px; }
.ieq-marca { display: flex; align-items: center; gap: 12px; }
.ieq-institucion { font-size: 15px; font-weight: 800; letter-spacing: -0.2px; line-height: 1.2; }
.ieq-institucion-sub { font-size: 10px; letter-spacing: 3px; color: #666; font-weight: 500; margin-top: 3px; }
.ieq-cabecera-der { text-align: right; }
.ieq-titulo { font-size: 16px; font-weight: 700; color: #c62828; }
.ieq-periodo { font-size: 13px; font-weight: 600; margin-top: 2px; }
.ieq-meta { font-size: 10px; color: #777; margin-top: 4px; }

.ieq-seccion { margin-bottom: 22px; }
.ieq-h2 { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.6px; color: #1a1a1a; border-left: 4px solid #c62828; padding-left: 10px; margin-bottom: 10px; }
.ieq-h3 { font-size: 12px; font-weight: 700; color: #444; margin: 12px 0 6px; }
.ieq-parrafo { margin-bottom: 6px; text-align: justify; }
.ieq-nota { font-size: 10px; color: #777; margin-top: 6px; font-style: italic; }

.ieq-kpis { display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; }
.ieq-kpi { border: 1px solid #e0e0e0; border-top: 3px solid #c62828; border-radius: 4px; padding: 9px 10px; }
.ieq-kpi.azul { border-top-color: #1976d2; }
.ieq-kpi.verde { border-top-color: #388e3c; }
.ieq-kpi.naranja { border-top-color: #f57c00; }
.ieq-kpi.morado { border-top-color: #7b1fa2; }
.ieq-kpi-label { font-size: 8px; font-weight: 700; color: #666; text-transform: uppercase; letter-spacing: 0.4px; }
.ieq-kpi-valor { font-size: 19px; font-weight: 800; margin-top: 3px; font-variant-numeric: tabular-nums; }
.ieq-kpi-var { font-size: 9px; margin-top: 3px; font-weight: 600; }

.ieq-tabla { width: 100%; border-collapse: collapse; font-size: 11px; }
.ieq-tabla th { background: #f2f2f2; text-align: left; padding: 6px 8px; font-size: 9px; font-weight: 700; color: #555; text-transform: uppercase; letter-spacing: 0.4px; border-bottom: 1.5px solid #ccc; }
.ieq-tabla td { padding: 6px 8px; border-bottom: 1px solid #eee; }
.ieq-tabla tr.total td { font-weight: 800; background: #f7f7f7; border-top: 1.5px solid #ccc; }
.ieq-tabla tr.actual td { background: #fff5f5; font-weight: 700; }
.ieq-tabla .num { text-align: right; font-variant-numeric: tabular-nums; white-space: nowrap; }

.ieq-bien { color: #2e7d32; }
.ieq-mal { color: #c62828; }
.ieq-igual { color: #666; }

.ieq-grafico { border: 1px solid #eee; border-radius: 4px; padding: 10px 6px 4px; margin-top: 8px; }
.ieq-grafico-titulo { font-size: 10px; font-weight: 700; color: #555; text-transform: uppercase; letter-spacing: 0.4px; padding: 0 6px 6px; }

.ieq-persona-cab { display: flex; align-items: center; gap: 14px; padding: 12px 14px; border: 1px solid #e0e0e0; border-radius: 4px; margin-bottom: 14px; }
.ieq-persona-avatar { width: 46px; height: 46px; border-radius: 50%; background: #c62828; color: white; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 16px; }
.ieq-persona-avatar.ing { background: #7b1fa2; }
.ieq-persona-nombre { font-size: 16px; font-weight: 800; }
.ieq-persona-rol { font-size: 10px; color: #777; text-transform: uppercase; letter-spacing: 1px; margin-top: 2px; }

.ieq-pie { margin-top: 26px; padding-top: 10px; border-top: 1px solid #ddd; font-size: 9px; color: #888; display: flex; justify-content: space-between; gap: 10px; }
.ieq-salto { break-before: page; page-break-before: always; }
.ieq-sin-corte { break-inside: avoid; page-break-inside: avoid; }
`;

// ============================================
// IMPRESIÓN
// ============================================

const imprimirNodo = (idNodo, titulo) => {
  const nodo = document.getElementById(idNodo);
  if (!nodo) return false;
  const w = window.open('', '_blank');
  if (!w) return false;
  w.document.open();
  w.document.write(
    `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>${titulo}</title>` +
    `<style>body{margin:0;background:white;}${STYLES_INFORME_EQ}</style></head>` +
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

const iniciales = (nombre) => {
  if (!nombre) return '?';
  const p = String(nombre).trim().split(' ');
  if (p.length === 1) return p[0].slice(0, 2).toUpperCase();
  return (p[0].charAt(0) + p[p.length - 1].charAt(0)).toUpperCase();
};

// Etiqueta de variación para la pantalla
const BadgeVar = ({ actual, anterior, sinDatos = 'Sin mes anterior' }) => {
  if (anterior === null || anterior === undefined) {
    return <span className="eq-var igual">{sinDatos}</span>;
  }
  const v = variacionTexto(actual, anterior);
  const Icono = v.clase === 'igual' ? Minus : (v.diferencia > 0 ? ArrowUpRight : ArrowDownRight);
  return (
    <span className={`eq-var ${v.clase}`} title={v.valorTexto}>
      <Icono size={12} /> {v.valorTexto}
    </span>
  );
};

// Tarjeta de indicador
const TarjetaEq = ({ etiqueta, icono, valor, color = '', sub }) => (
  <div className={`eq-kpi ${color}`}>
    <div className="eq-kpi-label">{icono}{etiqueta}</div>
    <div className="eq-kpi-valor">{valor}</div>
    {sub && <div className="eq-kpi-sub">{sub}</div>}
  </div>
);

// Avatar de una persona
const Avatar = ({ nombre, esArq, grande = false }) => (
  <div className={`${grande ? 'eq-ficha-avatar' : 'eq-avatar'} ${esArq ? '' : 'ing'}`}>
    {iniciales(nombre)}
  </div>
);

// Fila de persona (nombre + rol)
const Persona = ({ stats }) => (
  <div className="eq-persona">
    <Avatar nombre={stats.nombre} esArq={stats.esArq} />
    <div className="eq-persona-info">
      <span className="eq-persona-nombre">{stats.nombre}</span>
      <span className="eq-persona-rol">{stats.tecnico.rol}</span>
    </div>
  </div>
);

// Logo institucional para los informes
const LogoInformeEq = () => (
  <svg width="40" height="40" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
    <polygon points="8,10 30,10 30,32 22,50 8,50" fill="#c62828" />
    <polygon points="30,10 52,10 52,50 38,50 30,32" fill="#1a1a1a" />
    <polygon points="30,10 52,10 30,32" fill="#c62828" />
  </svg>
);

// Cabecera común de los informes
const CabeceraInforme = ({ titulo, periodo }) => (
  <div className="ieq-cabecera">
    <div className="ieq-marca">
      <LogoInformeEq />
      <div>
        <div className="ieq-institucion">CURADURÍA URBANA N.° 2 DE PEREIRA</div>
        <div className="ieq-institucion-sub">PEREIRA · RISARALDA</div>
      </div>
    </div>
    <div className="ieq-cabecera-der">
      <div className="ieq-titulo">{titulo}</div>
      <div className="ieq-periodo">{periodo}</div>
      <div className="ieq-meta">Generado el {formatoFechaHora(new Date().toISOString())}</div>
    </div>
  </div>
);

// Indicador del informe impreso
const KpiInforme = ({ etiqueta, valor, color = '', actual, anterior }) => {
  const v = variacionTexto(actual, anterior);
  return (
    <div className={`ieq-kpi ${color}`}>
      <div className="ieq-kpi-label">{etiqueta}</div>
      <div className="ieq-kpi-valor">{valor}</div>
      <div className={`ieq-kpi-var ieq-${v.clase}`}>
        {anterior === null || anterior === undefined ? 'Sin mes anterior' : `${v.valorTexto} vs. mes anterior`}
      </div>
    </div>
  );
};
// ============================================
// INFORME GENERAL DEL EQUIPO (imprimible)
// ============================================

const InformeGeneral = ({ clave, ind, indAnt, serie, statsTodos, promEquipo }) => {
  const resumen = resumenEquipo(clave, ind, indAnt, statsTodos);
  const claveAnt = mesAnterior(clave);

  const filaComp = (etiqueta, actual, anterior) => {
    const v = variacionTexto(actual, anterior);
    return (
      <tr key={etiqueta}>
        <td>{etiqueta}</td>
        <td className="num">{formatoNumero(actual)}</td>
        <td className="num">{anterior === null || anterior === undefined ? '—' : formatoNumero(anterior)}</td>
        <td className={`num ieq-${v.clase}`}>{v.valorTexto}</td>
        <td className={`num ieq-${v.clase}`}>{v.texto}</td>
      </tr>
    );
  };

  const ordenados = [...statsTodos].sort((a, b) => b.totalRevisiones - a.totalRevisiones);
  const arquitectos = ordenados.filter(s => s.esArq);
  const ingenieros = ordenados.filter(s => !s.esArq);

  const tablaProfesionales = (lista, titulo) => (
    <>
      <div className="ieq-h3">{titulo}</div>
      <table className="ieq-tabla ieq-sin-corte">
        <thead>
          <tr>
            <th>Profesional</th>
            <th className="num">Revisiones del mes</th>
            <th className="num">Activos</th>
            <th className="num">Vencidos</th>
            <th className="num">Sin fecha</th>
            <th className="num">Expedidos</th>
            <th className="num">Actas</th>
            <th className="num">Prom. 1ra rev.</th>
          </tr>
        </thead>
        <tbody>
          {lista.map(s => (
            <tr key={s.nombre}>
              <td>{s.nombre}</td>
              <td className="num">{formatoNumero(s.totalRevisiones)}</td>
              <td className="num">{formatoNumero(s.activos.length)}</td>
              <td className={`num ${s.vencidos.length > 0 ? 'ieq-mal' : ''}`}>{formatoNumero(s.vencidos.length)}</td>
              <td className="num">{formatoNumero(s.sinFecha.length)}</td>
              <td className="num">{formatoNumero(s.expedidos.length)}</td>
              <td className="num">{formatoNumero(s.actas.length)}</td>
              <td className="num">{s.promedioPrimeraRevision === null ? '—' : `${s.promedioPrimeraRevision} d`}</td>
            </tr>
          ))}
          <tr className="total">
            <td>Total</td>
            <td className="num">{formatoNumero(lista.reduce((t, s) => t + s.totalRevisiones, 0))}</td>
            <td className="num">{formatoNumero(lista.reduce((t, s) => t + s.activos.length, 0))}</td>
            <td className="num">{formatoNumero(lista.reduce((t, s) => t + s.vencidos.length, 0))}</td>
            <td className="num">{formatoNumero(lista.reduce((t, s) => t + s.sinFecha.length, 0))}</td>
            <td className="num">{formatoNumero(lista.reduce((t, s) => t + s.expedidos.length, 0))}</td>
            <td className="num">{formatoNumero(lista.reduce((t, s) => t + s.actas.length, 0))}</td>
            <td className="num">—</td>
          </tr>
        </tbody>
      </table>
    </>
  );

  return (
    <div id="ieq-informe-general" className="ieq-doc">
      <CabeceraInforme titulo="Informe de Seguimiento del Equipo Técnico" periodo={nombreMes(clave)} />

      {/* ---------- 1. RESUMEN ---------- */}
      <div className="ieq-seccion ieq-sin-corte">
        <div className="ieq-h2">1. Resumen del período</div>
        {resumen.map((f, i) => <p key={i} className="ieq-parrafo">{f}</p>)}
      </div>

      {/* ---------- 2. INDICADORES ---------- */}
      <div className="ieq-seccion ieq-sin-corte">
        <div className="ieq-h2">2. Indicadores del mes</div>
        <div className="ieq-kpis">
          <KpiInforme etiqueta="Radicados" valor={formatoNumero(ind.radicados)} color="azul" actual={ind.radicados} anterior={indAnt ? indAnt.radicados : null} />
          <KpiInforme etiqueta="Expedidos" valor={formatoNumero(ind.expedidos)} color="verde" actual={ind.expedidos} anterior={indAnt ? indAnt.expedidos : null} />
          <KpiInforme etiqueta="Revisiones" valor={formatoNumero(ind.revisiones)} color="morado" actual={ind.revisiones} anterior={indAnt ? indAnt.revisiones : null} />
          <KpiInforme etiqueta="Actas notificadas" valor={formatoNumero(ind.actas)} color="naranja" actual={ind.actas} anterior={indAnt ? indAnt.actas : null} />
          <KpiInforme etiqueta="Desistidos" valor={formatoNumero(ind.desistidos)} color="" actual={ind.desistidos} anterior={indAnt ? indAnt.desistidos : null} />
        </div>
        <div className="ieq-nota">Las licencias expedidas se cuentan por su fecha de expedición, no por la fecha de radicación del proyecto.</div>
      </div>

      {/* ---------- 3. COMPARACIÓN ---------- */}
      <div className="ieq-seccion ieq-sin-corte">
        <div className="ieq-h2">3. Comparación con el mes anterior</div>
        {indAnt ? (
          <table className="ieq-tabla">
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
              {filaComp('Solicitudes radicadas', ind.radicados, indAnt.radicados)}
              {filaComp('Licencias expedidas', ind.expedidos, indAnt.expedidos)}
              {filaComp('Revisiones realizadas', ind.revisiones, indAnt.revisiones)}
              {filaComp('Actas de observaciones', ind.actas, indAnt.actas)}
              {filaComp('Desistidos', ind.desistidos, indAnt.desistidos)}
            </tbody>
          </table>
        ) : (
          <p className="ieq-parrafo">No hay datos de {nombreMes(claveAnt)} para comparar.</p>
        )}
      </div>

      {/* ---------- 4. EVOLUCIÓN ---------- */}
      <div className="ieq-seccion ieq-sin-corte">
        <div className="ieq-h2">4. Evolución de los últimos {serie.length} meses</div>
        <div className="ieq-grafico">
          <div className="ieq-grafico-titulo">Radicados vs. expedidos</div>
          <BarChart width={680} height={200} data={serie} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis dataKey="etiqueta" tick={{ fontSize: 10 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 10 }} width={34} />
            <Legend wrapperStyle={{ fontSize: 10 }} />
            <Bar dataKey="radicados" name="Radicados" fill={COLORES.azul} isAnimationActive={false} />
            <Bar dataKey="expedidos" name="Expedidos" fill={COLORES.verde} isAnimationActive={false} />
          </BarChart>
        </div>
        <div className="ieq-grafico">
          <div className="ieq-grafico-titulo">Revisiones realizadas por el equipo</div>
          <LineChart width={680} height={170} data={serie} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis dataKey="etiqueta" tick={{ fontSize: 10 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 10 }} width={34} />
            <Line type="monotone" dataKey="revisiones" name="Revisiones" stroke={COLORES.morado} strokeWidth={2.5} dot={{ r: 3 }} isAnimationActive={false} />
          </LineChart>
        </div>
        <table className="ieq-tabla" style={{ marginTop: 10 }}>
          <thead>
            <tr>
              <th>Mes</th>
              <th className="num">Radicados</th>
              <th className="num">Expedidos</th>
              <th className="num">Revisiones</th>
              <th className="num">Actas</th>
            </tr>
          </thead>
          <tbody>
            {serie.map(m => (
              <tr key={m.clave} className={m.clave === clave ? 'actual' : ''}>
                <td>{nombreMes(m.clave)}</td>
                <td className="num">{formatoNumero(m.radicados)}</td>
                <td className="num">{formatoNumero(m.expedidos)}</td>
                <td className="num">{formatoNumero(m.revisiones)}</td>
                <td className="num">{formatoNumero(m.actas)}</td>
              </tr>
            ))}
            <tr className="total">
              <td>Total período</td>
              <td className="num">{formatoNumero(serie.reduce((t, m) => t + m.radicados, 0))}</td>
              <td className="num">{formatoNumero(serie.reduce((t, m) => t + m.expedidos, 0))}</td>
              <td className="num">{formatoNumero(serie.reduce((t, m) => t + m.revisiones, 0))}</td>
              <td className="num">{formatoNumero(serie.reduce((t, m) => t + m.actas, 0))}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ---------- 5. PRODUCTIVIDAD ---------- */}
      <div className="ieq-seccion">
        <div className="ieq-h2">5. Productividad por profesional</div>
        {tablaProfesionales(arquitectos, '5.1 Arquitectos')}
        {tablaProfesionales(ingenieros, '5.2 Ingenieros')}
        <div className="ieq-nota">
          "Revisiones del mes" cuenta las revisiones efectivamente realizadas en {nombreMes(clave)}.
          "Activos", "Vencidos" y "Sin fecha" reflejan la situación actual, no la del mes.
          {promEquipo !== null && ` El promedio del equipo para la primera revisión es de ${promEquipo} días hábiles.`}
        </div>
      </div>

      <div className="ieq-pie">
        <span>Curaduría Urbana N.° 2 de Pereira · Informe de Seguimiento del Equipo · {nombreMes(clave)}</span>
        <span>Uso interno</span>
      </div>
    </div>
  );
};
// ============================================
// INFORME INDIVIDUAL (imprimible)
// ============================================

const InformeIndividual = ({ clave, stats, promEquipo, serieIndividual }) => {
  const comparado = (stats.promedioPrimeraRevision !== null && promEquipo !== null)
    ? stats.promedioPrimeraRevision - promEquipo
    : null;

  const porVuelta = {};
  stats.revisiones.forEach(r => {
    porVuelta[r.etiqueta] = (porVuelta[r.etiqueta] || 0) + 1;
  });

  return (
    <div id="ieq-informe-individual" className="ieq-doc">
      <CabeceraInforme titulo="Informe Individual de Productividad" periodo={nombreMes(clave)} />

      <div className="ieq-persona-cab">
        <div className={`ieq-persona-avatar ${stats.esArq ? '' : 'ing'}`}>{iniciales(stats.nombre)}</div>
        <div>
          <div className="ieq-persona-nombre">{stats.nombre}</div>
          <div className="ieq-persona-rol">{stats.tecnico.rol} · Curaduría Urbana N.° 2</div>
        </div>
      </div>

      {/* ---------- 1. RESUMEN ---------- */}
      <div className="ieq-seccion ieq-sin-corte">
        <div className="ieq-h2">1. Resumen del mes</div>
        <p className="ieq-parrafo">
          En {nombreMes(clave)}, {stats.nombre} realizó <strong>{formatoNumero(stats.totalRevisiones)}</strong>{' '}
          {stats.totalRevisiones === 1 ? 'revisión' : 'revisiones'} y participó en{' '}
          <strong>{formatoNumero(stats.expedidos.length)}</strong>{' '}
          {stats.expedidos.length === 1 ? 'licencia expedida' : 'licencias expedidas'}.
          {stats.actas.length > 0 && ` Se notificaron ${formatoNumero(stats.actas.length)} actas de observaciones en sus proyectos.`}
        </p>
        <p className="ieq-parrafo">
          Actualmente tiene <strong>{formatoNumero(stats.activos.length)}</strong>{' '}
          {stats.activos.length === 1 ? 'proyecto activo' : 'proyectos activos'} en revisión
          {stats.vencidos.length > 0
            ? <>, de los cuales <strong className="ieq-mal">{formatoNumero(stats.vencidos.length)}</strong> {stats.vencidos.length === 1 ? 'está vencido' : 'están vencidos'}.</>
            : ', ninguno vencido.'}
          {stats.sinFecha.length > 0 && ` ${formatoNumero(stats.sinFecha.length)} ${stats.sinFecha.length === 1 ? 'proyecto no tiene' : 'proyectos no tienen'} fecha de inicio registrada en el Excel.`}
        </p>
        {stats.promedioPrimeraRevision !== null && (
          <p className="ieq-parrafo">
            Su tiempo promedio para la primera revisión es de <strong>{stats.promedioPrimeraRevision} días hábiles</strong>
            {comparado !== null && comparado !== 0 && (
              <span className={comparado < 0 ? 'ieq-bien' : 'ieq-mal'}>
                {' '}({Math.abs(comparado)} {Math.abs(comparado) === 1 ? 'día' : 'días'} {comparado < 0 ? 'por debajo' : 'por encima'} del promedio del equipo, que es de {promEquipo})
              </span>
            )}
            {comparado === 0 && ', igual al promedio del equipo'}.
            <span className="ieq-nota"> Calculado sobre {stats.muestraTiempos} proyectos.</span>
          </p>
        )}
      </div>

      {/* ---------- 2. INDICADORES ---------- */}
      <div className="ieq-seccion ieq-sin-corte">
        <div className="ieq-h2">2. Indicadores</div>
        <table className="ieq-tabla">
          <tbody>
            <tr><td>Revisiones realizadas en el mes</td><td className="num">{formatoNumero(stats.totalRevisiones)}</td></tr>
            <tr><td>Licencias expedidas en el mes</td><td className="num">{formatoNumero(stats.expedidos.length)}</td></tr>
            <tr><td>Actas de observaciones notificadas</td><td className="num">{formatoNumero(stats.actas.length)}</td></tr>
            <tr><td>Proyectos activos en revisión (hoy)</td><td className="num">{formatoNumero(stats.activos.length)}</td></tr>
            <tr><td>Proyectos vencidos (hoy)</td><td className={`num ${stats.vencidos.length > 0 ? 'ieq-mal' : ''}`}>{formatoNumero(stats.vencidos.length)}</td></tr>
            <tr><td>Proyectos sin fecha de inicio (hoy)</td><td className="num">{formatoNumero(stats.sinFecha.length)}</td></tr>
            <tr><td>Total de proyectos asignados</td><td className="num">{formatoNumero(stats.totalAsignados)}</td></tr>
            <tr className="total"><td>Tiempo promedio 1ra revisión</td><td className="num">{stats.promedioPrimeraRevision === null ? '—' : `${stats.promedioPrimeraRevision} días hábiles`}</td></tr>
          </tbody>
        </table>
      </div>

      {/* ---------- 3. EVOLUCIÓN ---------- */}
      {serieIndividual && serieIndividual.length > 1 && (
        <div className="ieq-seccion ieq-sin-corte">
          <div className="ieq-h2">3. Evolución de revisiones</div>
          <div className="ieq-grafico">
            <div className="ieq-grafico-titulo">Revisiones realizadas por mes</div>
            <BarChart width={680} height={180} data={serieIndividual} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="etiqueta" tick={{ fontSize: 10 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 10 }} width={34} />
              <Bar dataKey="revisiones" name="Revisiones" fill={stats.esArq ? COLORES.rojo : COLORES.morado} isAnimationActive={false} />
            </BarChart>
          </div>
        </div>
      )}

      {/* ---------- 4. DETALLE ---------- */}
      <div className="ieq-seccion">
        <div className="ieq-h2">{serieIndividual && serieIndividual.length > 1 ? '4' : '3'}. Detalle de revisiones del mes</div>
        {stats.revisiones.length > 0 ? (
          <>
            <table className="ieq-tabla ieq-sin-corte">
              <thead><tr><th>Tipo de revisión</th><th className="num">Cantidad</th></tr></thead>
              <tbody>
                {Object.entries(porVuelta).map(([etq, n]) => (
                  <tr key={etq}><td>{etq}</td><td className="num">{formatoNumero(n)}</td></tr>
                ))}
                <tr className="total"><td>Total</td><td className="num">{formatoNumero(stats.totalRevisiones)}</td></tr>
              </tbody>
            </table>
            <div className="ieq-h3">Listado</div>
            <table className="ieq-tabla">
              <thead><tr><th>Radicado</th><th>Revisión</th><th className="num">Fecha</th></tr></thead>
              <tbody>
                {stats.revisiones.map((r, i) => (
                  <tr key={i}>
                    <td>{r.estrategico ? '★ ' : ''}{r.radicado}</td>
                    <td>{r.etiqueta}</td>
                    <td className="num">{textoFecha(r.fecha)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <p className="ieq-parrafo">No se registraron revisiones en {nombreMes(clave)}.</p>
        )}
      </div>

      {/* ---------- 5. VENCIDOS ---------- */}
      {stats.vencidos.length > 0 && (
        <div className="ieq-seccion ieq-sin-corte">
          <div className="ieq-h2">Proyectos vencidos a la fecha</div>
          <table className="ieq-tabla">
            <thead><tr><th>Radicado</th><th>Fecha radicación</th><th>Plazo legal</th></tr></thead>
            <tbody>
              {stats.vencidos.map(p => (
                <tr key={p.radicado}>
                  <td>{p.estrategico ? '★ ' : ''}{p.radicado}</td>
                  <td>{textoFecha(p.fechaRadicacion)}</td>
                  <td>{textoFecha(p.maximaLegal)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="ieq-pie">
        <span>Curaduría Urbana N.° 2 de Pereira · Informe Individual · {stats.nombre} · {nombreMes(clave)}</span>
        <span>Uso interno</span>
      </div>
    </div>
  );
};

// ============================================
// FICHA DEL PROFESIONAL (en pantalla)
// ============================================

const FichaProfesional = ({ clave, stats, promEquipo, serieIndividual, onVolver, onImprimir }) => {
  const comparado = (stats.promedioPrimeraRevision !== null && promEquipo !== null)
    ? stats.promedioPrimeraRevision - promEquipo
    : null;

  return (
    <div className="eq-wrap">
      <div className="eq-ficha-cabecera">
        <div className="eq-ficha-persona">
          <Avatar nombre={stats.nombre} esArq={stats.esArq} grande />
          <div>
            <div className="eq-ficha-nombre">{stats.nombre}</div>
            <div className="eq-ficha-rol">{stats.tecnico.rol} · {nombreMes(clave)}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button className="eq-btn eq-btn-secundario" onClick={onVolver}>
            <ArrowLeft size={16} /> Volver al equipo
          </button>
          <button className="eq-btn eq-btn-oscuro" onClick={onImprimir}>
            <Printer size={16} /> Generar informe individual
          </button>
        </div>
      </div>

      <div className="eq-kpis">
        <TarjetaEq etiqueta="Revisiones del mes" icono={<ClipboardList size={14} />} valor={formatoNumero(stats.totalRevisiones)} color="morado" />
        <TarjetaEq etiqueta="Expedidos" icono={<CheckCircle size={14} />} valor={formatoNumero(stats.expedidos.length)} color="verde" />
        <TarjetaEq etiqueta="Activos hoy" icono={<FileText size={14} />} valor={formatoNumero(stats.activos.length)} color="azul" />
        <TarjetaEq etiqueta="Vencidos hoy" icono={<AlertTriangle size={14} />} valor={formatoNumero(stats.vencidos.length)} color={stats.vencidos.length > 0 ? 'rojo' : 'gris'} />
        <TarjetaEq
          etiqueta="Prom. 1ra revisión"
          icono={<Clock size={14} />}
          valor={stats.promedioPrimeraRevision === null ? '—' : `${stats.promedioPrimeraRevision} d`}
          color="naranja"
          sub={comparado !== null && comparado !== 0 ? (
            <span className={`eq-var ${comparado < 0 ? 'bien' : 'mal'}`}>
              {comparado < 0 ? <ArrowDownRight size={12} /> : <ArrowUpRight size={12} />}
              {Math.abs(comparado)} d vs. equipo
            </span>
          ) : (promEquipo !== null ? <span className="eq-var igual">Igual al equipo</span> : null)}
        />
      </div>

      {stats.sinFecha.length > 0 && (
        <div className="eq-aviso alerta">
          <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
          <span>
            <strong>{stats.sinFecha.length} {stats.sinFecha.length === 1 ? 'proyecto activo no tiene' : 'proyectos activos no tienen'} fecha de inicio en el Excel.</strong>{' '}
            Sin esa fecha no se puede calcular el vencimiento, y la productividad puede aparecer más baja de lo real.
          </span>
        </div>
      )}

      {serieIndividual && serieIndividual.length > 1 && (
        <div className="eq-card">
          <div className="eq-card-titulo"><TrendingUp size={16} color={COLORES.rojo} /> Evolución de revisiones</div>
          <div className="eq-card-sub">Revisiones realizadas en los últimos {serieIndividual.length} meses</div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={serieIndividual} margin={{ top: 5, right: 5, left: 5, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="etiqueta" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} width={34} />
              <Tooltip />
              <Bar dataKey="revisiones" name="Revisiones" fill={stats.esArq ? COLORES.rojo : COLORES.morado} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="eq-grid-2">
        <div className="eq-card">
          <div className="eq-card-titulo"><ClipboardList size={16} color={COLORES.rojo} /> Revisiones de {nombreMes(clave)}</div>
          <div className="eq-card-sub">{stats.totalRevisiones} en total</div>
          {stats.revisiones.length === 0 && <div className="eq-vacio-lista">Sin revisiones registradas este mes.</div>}
          <div className="eq-lista-rev">
            {stats.revisiones.map((r, i) => (
              <div key={i} className="eq-item-rev">
                {r.estrategico && <span style={{ color: '#f9a825' }}>★</span>}
                <strong>{r.radicado}</strong>
                <span className={`eq-chip ${r.area === 'arq' ? 'azul' : 'morado'}`}>{r.etiqueta}</span>
                <span className="fecha">{textoFecha(r.fecha)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="eq-card">
          <div className="eq-card-titulo"><FileText size={16} color={COLORES.rojo} /> Proyectos activos hoy</div>
          <div className="eq-card-sub">{stats.activos.length} en revisión a su cargo</div>
          {stats.activos.length === 0 && <div className="eq-vacio-lista">Sin proyectos activos.</div>}
          <div className="eq-lista-rev">
            {stats.activos.map(p => {
              const vencido = stats.vencidos.some(v => v.radicado === p.radicado);
              const sinF = stats.sinFecha.some(v => v.radicado === p.radicado);
              return (
                <div key={p.radicado} className="eq-item-rev">
                  {p.estrategico && <span style={{ color: '#f9a825' }}>★</span>}
                  <strong>{p.radicado}</strong>
                  {vencido && <span className="eq-chip rojo">Vencido</span>}
                  {sinF && <span className="eq-chip gris">Sin fecha de inicio</span>}
                  {!vencido && !sinF && <span className="eq-chip verde">En término</span>}
                  <span className="fecha">Rad. {textoFecha(p.fechaRadicacion)}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {stats.expedidos.length > 0 && (
        <div className="eq-card">
          <div className="eq-card-titulo"><CheckCircle size={16} color={COLORES.verde} /> Licencias expedidas en {nombreMes(clave)}</div>
          <div className="eq-card-sub">{stats.expedidos.length} en las que participó</div>
          <div className="eq-tabla">
            <table style={{ minWidth: 0 }}>
              <thead><tr><th>Radicado</th><th>Radicación</th><th>Expedición</th></tr></thead>
              <tbody>
                {stats.expedidos.map(p => (
                  <tr key={p.radicado}>
                    <td>{p.estrategico && <span style={{ color: '#f9a825' }}>★ </span>}<strong>{p.radicado}</strong></td>
                    <td>{textoFecha(p.fechaRadicacion)}</td>
                    <td>{textoFecha(p.fechaLicencia)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
// ============================================
// COMPONENTE PRINCIPAL: INFORME DE EQUIPO
// ============================================
// Uso desde main.jsx:
//   import InformeEquipo, { puedeVerInformeEquipo } from './InformeEquipo.jsx';
//   <InformeEquipo
//     usuario={usuarioActual}
//     proyectos={proyectos}
//     tecnicos={TECNICOS}
//     getEstadoFlujo={getEstadoFlujo}
//     getFechaLimiteEtapa={getFechaLimiteEtapa}
//     estadosRevision={ESTADOS_REVISION}
//     diasHabilesEntreFechas={diasHabilesEntreFechas}
//     excelDateToDate={excelDateToDate}
//   />

export default function InformeEquipo({
  usuario,
  proyectos = [],
  tecnicos = [],
  getEstadoFlujo,
  getFechaLimiteEtapa,
  estadosRevision = [],
  diasHabilesEntreFechas,
  excelDateToDate
}) {
  const permitido = puedeVerInformeEquipo(usuario);

  const [clave, setClave] = useState(mesPorDefecto());
  const [seleccionado, setSeleccionado] = useState(null);
  const [mostrarGeneral, setMostrarGeneral] = useState(false);
  const [mostrarIndividual, setMostrarIndividual] = useState(false);
  const [toast, setToast] = useState(null);

  const { anio: anioSel, mes: mesSel } = partesMes(clave);

  // ---------- CÁLCULOS ----------
  const ind = useMemo(
    () => indicadoresMes(proyectos, clave, getEstadoFlujo, estadosRevision),
    [proyectos, clave, getEstadoFlujo, estadosRevision]
  );

  const indAnt = useMemo(
    () => indicadoresMes(proyectos, mesAnterior(clave), getEstadoFlujo, estadosRevision),
    [proyectos, clave, getEstadoFlujo, estadosRevision]
  );

  const serie = useMemo(
    () => serieMeses(proyectos, clave, MESES_COMPARATIVO, getEstadoFlujo, estadosRevision),
    [proyectos, clave, getEstadoFlujo, estadosRevision]
  );

  const statsTodos = useMemo(
    () => tecnicos.map(t =>
      statsProfesional(proyectos, t, clave, getEstadoFlujo, getFechaLimiteEtapa, estadosRevision, diasHabilesEntreFechas, excelDateToDate)
    ),
    [proyectos, tecnicos, clave, getEstadoFlujo, getFechaLimiteEtapa, estadosRevision, diasHabilesEntreFechas, excelDateToDate]
  );

  const promEquipo = useMemo(() => promedioEquipo(statsTodos), [statsTodos]);

  const statsSeleccionado = useMemo(
    () => (seleccionado ? statsTodos.find(s => s.nombre === seleccionado) : null),
    [seleccionado, statsTodos]
  );

  // Serie individual de revisiones por mes
  const serieIndividual = useMemo(() => {
    if (!seleccionado) return [];
    return ultimosMeses(clave, MESES_COMPARATIVO).map(k => ({
      clave: k,
      etiqueta: nombreMesCorto(k),
      revisiones: revisionesDelMes(proyectos, seleccionado, k).length
    }));
  }, [seleccionado, proyectos, clave]);

  // ---------- ACCIONES ----------
  const imprimir = (idNodo, titulo) => {
    const ok = imprimirNodo(idNodo, titulo);
    if (!ok) setToast('El navegador bloqueó la ventana. Permite ventanas emergentes para este sitio.');
    else setToast(null);
  };

  const abrirIndividual = () => setMostrarIndividual(true);

  // ---------- ACCESO RESTRINGIDO ----------
  if (!permitido) {
    return (
      <div className="eq-vacio">
        <style>{STYLES_EQUIPO}</style>
        <Lock size={40} color="#ccc" />
        <h3>Acceso restringido</h3>
        <p>Esta sección está disponible únicamente para la administración de la Curaduría.</p>
      </div>
    );
  }

  const arquitectos = statsTodos.filter(s => s.esArq).sort((a, b) => b.totalRevisiones - a.totalRevisiones);
  const ingenieros = statsTodos.filter(s => !s.esArq).sort((a, b) => b.totalRevisiones - a.totalRevisiones);

  const tablaEquipo = (lista, titulo, icono) => (
    <div className="eq-card">
      <div className="eq-card-titulo">{icono} {titulo}</div>
      <div className="eq-card-sub">Haz clic en una persona para ver su ficha individual</div>
      <div className="eq-tabla">
        <table>
          <thead>
            <tr>
              <th>Profesional</th>
              <th className="num">Revisiones</th>
              <th className="num">Activos</th>
              <th className="num">Vencidos</th>
              <th className="num">Sin fecha</th>
              <th className="num">Expedidos</th>
              <th className="num">Actas</th>
              <th className="num">Prom. 1ra rev.</th>
            </tr>
          </thead>
          <tbody>
            {lista.map(s => (
              <tr key={s.nombre} className="clicable" onClick={() => setSeleccionado(s.nombre)}>
                <td><Persona stats={s} /></td>
                <td className="num"><strong>{formatoNumero(s.totalRevisiones)}</strong></td>
                <td className="num">{formatoNumero(s.activos.length)}</td>
                <td className="num">
                  {s.vencidos.length > 0
                    ? <span className="eq-chip rojo">{formatoNumero(s.vencidos.length)}</span>
                    : <span style={{ color: '#bbb' }}>0</span>}
                </td>
                <td className="num">
                  {s.sinFecha.length > 0
                    ? <span className="eq-chip gris">{formatoNumero(s.sinFecha.length)}</span>
                    : <span style={{ color: '#bbb' }}>0</span>}
                </td>
                <td className="num">{formatoNumero(s.expedidos.length)}</td>
                <td className="num">{formatoNumero(s.actas.length)}</td>
                <td className="num">{s.promedioPrimeraRevision === null ? '—' : `${s.promedioPrimeraRevision} d`}</td>
              </tr>
            ))}
            <tr className="total">
              <td>Total</td>
              <td className="num">{formatoNumero(lista.reduce((t, s) => t + s.totalRevisiones, 0))}</td>
              <td className="num">{formatoNumero(lista.reduce((t, s) => t + s.activos.length, 0))}</td>
              <td className="num">{formatoNumero(lista.reduce((t, s) => t + s.vencidos.length, 0))}</td>
              <td className="num">{formatoNumero(lista.reduce((t, s) => t + s.sinFecha.length, 0))}</td>
              <td className="num">{formatoNumero(lista.reduce((t, s) => t + s.expedidos.length, 0))}</td>
              <td className="num">{formatoNumero(lista.reduce((t, s) => t + s.actas.length, 0))}</td>
              <td className="num">—</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  // ---------- PANTALLA ----------
  return (
    <div className="eq-wrap">
      <style>{STYLES_EQUIPO}</style>

      <div className="eq-encabezado">
        <div>
          <div className="eq-titulo"><Users size={24} color={COLORES.rojo} /> Informe de Equipo</div>
          <div className="eq-subtitulo">Seguimiento de radicados, expedidos y productividad · {nombreMes(clave)}</div>
        </div>
        <span className="eq-badge-privado"><Lock size={12} /> Solo administración</span>
      </div>

      <div className="eq-barra">
        <div className="eq-selectores">
          <select className="eq-select" value={mesSel} onChange={(e) => { setClave(claveMes(anioSel, Number(e.target.value))); setSeleccionado(null); }}>
            {MESES.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
          </select>
          <select className="eq-select" value={anioSel} onChange={(e) => { setClave(claveMes(Number(e.target.value), mesSel)); setSeleccionado(null); }}>
            {ANIOS.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>

        <div className="eq-acciones">
          <button className="eq-btn eq-btn-oscuro" onClick={() => setMostrarGeneral(true)}>
            <Printer size={16} /> Generar Informe de Reunión
          </button>
        </div>
      </div>

      {/* ---------- FICHA INDIVIDUAL ---------- */}
      {statsSeleccionado ? (
        <FichaProfesional
          clave={clave}
          stats={statsSeleccionado}
          promEquipo={promEquipo}
          serieIndividual={serieIndividual}
          onVolver={() => setSeleccionado(null)}
          onImprimir={abrirIndividual}
        />
      ) : (
        <>
          {/* ---------- INDICADORES ---------- */}
          <div className="eq-kpis">
            <TarjetaEq etiqueta="Radicados" icono={<FileText size={14} />} valor={formatoNumero(ind.radicados)} color="azul"
              sub={<><BadgeVar actual={ind.radicados} anterior={indAnt ? indAnt.radicados : null} /> vs. mes anterior</>} />
            <TarjetaEq etiqueta="Expedidos" icono={<CheckCircle size={14} />} valor={formatoNumero(ind.expedidos)} color="verde"
              sub={<><BadgeVar actual={ind.expedidos} anterior={indAnt ? indAnt.expedidos : null} /> vs. mes anterior</>} />
            <TarjetaEq etiqueta="Revisiones" icono={<ClipboardList size={14} />} valor={formatoNumero(ind.revisiones)} color="morado"
              sub={<><BadgeVar actual={ind.revisiones} anterior={indAnt ? indAnt.revisiones : null} /> vs. mes anterior</>} />
            <TarjetaEq etiqueta="Actas notificadas" icono={<AlertTriangle size={14} />} valor={formatoNumero(ind.actas)} color="naranja"
              sub={<><BadgeVar actual={ind.actas} anterior={indAnt ? indAnt.actas : null} /> vs. mes anterior</>} />
            <TarjetaEq etiqueta="Desistidos" icono={<X size={14} />} valor={formatoNumero(ind.desistidos)} color="gris"
              sub={<><BadgeVar actual={ind.desistidos} anterior={indAnt ? indAnt.desistidos : null} /> vs. mes anterior</>} />
          </div>

          <div className="eq-aviso info">
            <CheckCircle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
            <span>
              Las licencias expedidas se cuentan por su <strong>fecha de expedición</strong>, no por la fecha de radicación del proyecto.
              Los datos salen del Excel de seguimiento, así que dependen de que las fechas de revisión estén al día.
            </span>
          </div>

          {/* ---------- GRÁFICOS ---------- */}
          <div className="eq-grid-2">
            <div className="eq-card">
              <div className="eq-card-titulo">Radicados vs. expedidos</div>
              <div className="eq-card-sub">Últimos {MESES_COMPARATIVO} meses</div>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={serie} margin={{ top: 5, right: 5, left: 5, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="etiqueta" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} width={34} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="radicados" name="Radicados" fill={COLORES.azul} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expedidos" name="Expedidos" fill={COLORES.verde} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="eq-card">
              <div className="eq-card-titulo">Revisiones del equipo</div>
              <div className="eq-card-sub">Revisiones realizadas por mes</div>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={serie} margin={{ top: 10, right: 5, left: 5, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="etiqueta" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} width={34} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="revisiones" name="Revisiones" stroke={COLORES.morado} strokeWidth={3} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="actas" name="Actas" stroke={COLORES.naranja} strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ---------- TABLA COMPARATIVA ---------- */}
          <div className="eq-card">
            <div className="eq-card-titulo"><TrendingUp size={16} color={COLORES.rojo} /> Comparativo mensual</div>
            <div className="eq-card-sub">Últimos {MESES_COMPARATIVO} meses</div>
            <div className="eq-tabla">
              <table>
                <thead>
                  <tr>
                    <th>Mes</th>
                    <th className="num">Radicados</th>
                    <th className="num">Expedidos</th>
                    <th className="num">Revisiones</th>
                    <th className="num">Actas</th>
                  </tr>
                </thead>
                <tbody>
                  {serie.map(m => (
                    <tr key={m.clave} className={m.clave === clave ? 'actual' : ''}>
                      <td>{nombreMes(m.clave)}</td>
                      <td className="num">{formatoNumero(m.radicados)}</td>
                      <td className="num">{formatoNumero(m.expedidos)}</td>
                      <td className="num">{formatoNumero(m.revisiones)}</td>
                      <td className="num">{formatoNumero(m.actas)}</td>
                    </tr>
                  ))}
                  <tr className="total">
                    <td>Total período</td>
                    <td className="num">{formatoNumero(serie.reduce((t, m) => t + m.radicados, 0))}</td>
                    <td className="num">{formatoNumero(serie.reduce((t, m) => t + m.expedidos, 0))}</td>
                    <td className="num">{formatoNumero(serie.reduce((t, m) => t + m.revisiones, 0))}</td>
                    <td className="num">{formatoNumero(serie.reduce((t, m) => t + m.actas, 0))}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* ---------- EQUIPO ---------- */}
          {tablaEquipo(arquitectos, 'Arquitectos', <Users size={16} color={COLORES.rojo} />)}
          {tablaEquipo(ingenieros, 'Ingenieros', <Award size={16} color={COLORES.morado} />)}
        </>
      )}

      {/* ---------- INFORME GENERAL ---------- */}
      {mostrarGeneral && (
        <div className="eq-overlay" onClick={() => setMostrarGeneral(false)}>
          <div className="eq-overlay-barra" onClick={(e) => e.stopPropagation()}>
            <strong style={{ fontSize: 16 }}>Informe de Reunión · {nombreMes(clave)}</strong>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button className="eq-btn eq-btn-primario" onClick={() => imprimir('ieq-informe-general', `Informe Equipo - Curaduría 2 Pereira - ${nombreMes(clave)}`)}>
                <Printer size={16} /> Imprimir / Guardar PDF
              </button>
              <button className="eq-btn eq-btn-secundario" onClick={() => setMostrarGeneral(false)}>
                <X size={16} /> Cerrar
              </button>
            </div>
          </div>
          <div className="eq-overlay-hoja" onClick={(e) => e.stopPropagation()}>
            <style>{STYLES_INFORME_EQ}</style>
            <InformeGeneral clave={clave} ind={ind} indAnt={indAnt} serie={serie} statsTodos={statsTodos} promEquipo={promEquipo} />
          </div>
        </div>
      )}

      {/* ---------- INFORME INDIVIDUAL ---------- */}
      {mostrarIndividual && statsSeleccionado && (
        <div className="eq-overlay" onClick={() => setMostrarIndividual(false)}>
          <div className="eq-overlay-barra" onClick={(e) => e.stopPropagation()}>
            <strong style={{ fontSize: 16 }}>Informe individual · {statsSeleccionado.nombre}</strong>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button className="eq-btn eq-btn-primario" onClick={() => imprimir('ieq-informe-individual', `Informe ${statsSeleccionado.nombre} - ${nombreMes(clave)}`)}>
                <Printer size={16} /> Imprimir / Guardar PDF
              </button>
              <button className="eq-btn eq-btn-secundario" onClick={() => setMostrarIndividual(false)}>
                <X size={16} /> Cerrar
              </button>
            </div>
          </div>
          <div className="eq-overlay-hoja" onClick={(e) => e.stopPropagation()}>
            <style>{STYLES_INFORME_EQ}</style>
            <InformeIndividual clave={clave} stats={statsSeleccionado} promEquipo={promEquipo} serieIndividual={serieIndividual} />
          </div>
        </div>
      )}

      {toast && (
        <div className="eq-toast" onClick={() => setToast(null)}>
          <AlertTriangle size={16} /> {toast}
        </div>
      )}
    </div>
  );
}
