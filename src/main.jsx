import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Home, Star, Clock, FileText, Users, User, History, TrendingUp, Search, Calendar, AlertTriangle, CheckCircle, Tv, LogIn, LogOut, RefreshCw, ArrowLeft, StickyNote, Trophy, ClipboardList, Inbox, Flame, Send, Eye, EyeOff, Lock, X, Building2, Shield } from 'lucide-react';
import Finanzas, { puedeVerFinanzas } from './Finanzas.jsx';

// ============================================
// CONFIGURACIÓN
// ============================================

const MAPEO_ARQUITECTOS = {
  'LAA': 'Laura Arandia',
  'AMMF': 'Adriana Marulanda',
  'MCMF': 'Camila Marulanda',
  'DMUM': 'Diana Uribe',
  'MPMP': 'Maria Paula Montes'
};

const MAPEO_INGENIEROS = {
  'JOGL': 'Jorge Obed',
  'ACU': 'Alejandra Calderon',
  'CERA': 'Camilo Rodriguez'
};

const TECNICOS = [
  { nombre: 'Diana Uribe', inicial: 'DU', rol: 'Arquitecta', tipo: 'arquitecto' },
  { nombre: 'Adriana Marulanda', inicial: 'AM', rol: 'Arquitecta', tipo: 'arquitecto' },
  { nombre: 'Laura Arandia', inicial: 'LA', rol: 'Arquitecta', tipo: 'arquitecto' },
  { nombre: 'Camila Marulanda', inicial: 'CM', rol: 'Arquitecta', tipo: 'arquitecto' },
  { nombre: 'Maria Paula Montes', inicial: 'MP', rol: 'Arquitecta', tipo: 'arquitecto' },
  { nombre: 'Alejandra Calderon', inicial: 'AC', rol: 'Ingeniera', tipo: 'ingeniero' },
  { nombre: 'Camilo Rodriguez', inicial: 'CR', rol: 'Ingeniero', tipo: 'ingeniero' },
  { nombre: 'Jorge Obed', inicial: 'JO', rol: 'Ingeniero', tipo: 'ingeniero' }
];

const ESTADOS_FLUJO = {
  'PENDIENTE_LDF': { label: 'Pendiente LDF', color: '#f57c00', bg: '#fff3e0', icon: '🟠' },
  'REV_ARQ_1': { label: 'Rev. Arquitectónica', color: '#1976d2', bg: '#e3f2fd', icon: '🔵' },
  'REV_ESTR_1': { label: 'Rev. Estructural', color: '#7b1fa2', bg: '#f3e5f5', icon: '🟣' },
  'ACTA_OBS': { label: 'Acta Observaciones', color: '#f9a825', bg: '#fffde7', icon: '🟡' },
  'REV_ARQ_2': { label: 'Rev. Arq. 2da vuelta', color: '#1976d2', bg: '#e3f2fd', icon: '🔄' },
  'REV_ESTR_2': { label: 'Rev. Estr. 2da vuelta', color: '#7b1fa2', bg: '#f3e5f5', icon: '🔄' },
  'REV_ARQ_3': { label: 'Rev. Arq. 3ra vuelta', color: '#1976d2', bg: '#e3f2fd', icon: '🔁' },
  'REV_ESTR_3': { label: 'Rev. Estr. 3ra vuelta', color: '#7b1fa2', bg: '#f3e5f5', icon: '🔁' },
  'REV_ARQ_4': { label: 'Rev. Arq. 4ta vuelta', color: '#1976d2', bg: '#e3f2fd', icon: '🔂' },
  'REV_ESTR_4': { label: 'Rev. Estr. 4ta vuelta', color: '#7b1fa2', bg: '#f3e5f5', icon: '🔂' },
  'PAGOS': { label: 'Pagos', color: '#00838f', bg: '#e0f7fa', icon: '💰' },
  'EXPEDIDO': { label: 'Expedido', color: '#388e3c', bg: '#e8f5e9', icon: '✅' },
  'PENDIENTE': { label: 'Pendiente', color: '#616161', bg: '#f5f5f5', icon: '⏸️' },
  'NEGADO': { label: 'Negado', color: '#c62828', bg: '#ffebee', icon: '🚫' },
  'DESISTIDO': { label: 'Desistido', color: '#c62828', bg: '#ffebee', icon: '❌' }
};

// Todos los estados que cuentan como "en revisión" (se usa en todo el código)
const ESTADOS_REVISION = [
  'REV_ARQ_1', 'REV_ESTR_1',
  'REV_ARQ_2', 'REV_ESTR_2',
  'REV_ARQ_3', 'REV_ESTR_3',
  'REV_ARQ_4', 'REV_ESTR_4'
];

const ESTADOS_REVISION_ARQ = ['REV_ARQ_1', 'REV_ARQ_2', 'REV_ARQ_3', 'REV_ARQ_4'];
const ESTADOS_REVISION_ESTR = ['REV_ESTR_1', 'REV_ESTR_2', 'REV_ESTR_3', 'REV_ESTR_4'];
const ESTADOS_VUELTA_POSTERIOR = ['REV_ARQ_2', 'REV_ESTR_2', 'REV_ARQ_3', 'REV_ESTR_3', 'REV_ARQ_4', 'REV_ESTR_4'];

// ============================================
// VUELTAS DE REVISIÓN
// ============================================
// Cada estado de revisión define:
//  - campoInicio: columna del Excel desde donde se cuentan los días hábiles
//  - dias: días hábiles que tiene el profesional para esa revisión
//  - campoEntrega: fecha en que el cliente entregó la información para esa vuelta
//
// 1ra vuelta: arquitectura 9 días desde LDF; estructural 18 días desde LDF (9 arq + 9 estr)
// 2da vuelta: cliente responde el acta (AV) → arq inicia AA / estr inicia AJ
// 3ra vuelta: cliente entrega persistentes (AW) → arq inicia AB / estr inicia AK
// 4ta vuelta: cliente entrega persistentes (AX) → arq inicia AC / estr inicia AL

const VUELTAS = {
  'REV_ARQ_1':  { vuelta: 1, area: 'arq',  campoInicio: 'fechaLegal',          dias: 9,  etiquetaInicio: 'Fecha LDF',                campoEntrega: null },
  'REV_ESTR_1': { vuelta: 1, area: 'estr', campoInicio: 'fechaLegal',          dias: 18, etiquetaInicio: 'Fecha LDF',                campoEntrega: null },
  'REV_ARQ_2':  { vuelta: 2, area: 'arq',  campoInicio: 'fechaAsigArqActa',    dias: 9,  etiquetaInicio: 'Inicio 2da revisión',      campoEntrega: 'fechaRespuestaActa', etiquetaEntrega: 'Respuesta al acta' },
  'REV_ESTR_2': { vuelta: 2, area: 'estr', campoInicio: 'fechaAsigEstrActa',   dias: 9,  etiquetaInicio: 'Inicio 2da revisión',      campoEntrega: 'fechaRespuestaActa', etiquetaEntrega: 'Respuesta al acta' },
  'REV_ARQ_3':  { vuelta: 3, area: 'arq',  campoInicio: 'fechaSegundaRevArq',  dias: 9,  etiquetaInicio: 'Inicio 3ra revisión',      campoEntrega: 'fechaPersistentes3', etiquetaEntrega: 'Entrega persistentes' },
  'REV_ESTR_3': { vuelta: 3, area: 'estr', campoInicio: 'fechaSegundaRevEstr', dias: 9,  etiquetaInicio: 'Inicio 3ra revisión',      campoEntrega: 'fechaPersistentes3', etiquetaEntrega: 'Entrega persistentes' },
  'REV_ARQ_4':  { vuelta: 4, area: 'arq',  campoInicio: 'fechaTerceraRevArq',  dias: 9,  etiquetaInicio: 'Inicio 4ta revisión',      campoEntrega: 'fechaPersistentes4', etiquetaEntrega: 'Entrega persistentes' },
  'REV_ESTR_4': { vuelta: 4, area: 'estr', campoInicio: 'fechaTerceraRevEstr', dias: 9,  etiquetaInicio: 'Inicio 4ta revisión',      campoEntrega: 'fechaPersistentes4', etiquetaEntrega: 'Entrega persistentes' }
};

// Campos de fecha que llegan del Excel y hay que convertir de número serial a dd/mm/aaaa
const CAMPOS_FECHA = [
  'fechaRadicacion', 'maximaLegal', 'fechaLegal',
  'fechaAsignacionArq', 'fechaPrimeraRevArq', 'fechaAsigArqActa', 'fechaSegundaRevArq', 'fechaTerceraRevArq', 'fechaRevFinalArq',
  'fechaIngresoIng', 'fechaPrimeraRevIng', 'fechaAsigEstrActa', 'fechaSegundaRevEstr', 'fechaTerceraRevEstr',
  'actaObservaciones', 'actaFechaLimite', 'actaSolicitudAmpliacion', 'actaFechaAmpliacion', 'fechaRespuestaActa',
  'fechaPersistentes3', 'fechaPersistentes4',
  'suspensionSolicitud', 'suspensionLimite',
  'fechaFinalizacion', 'fechaLimitePago', 'fechaAportePagos', 'fechaLicencia'
];

const FESTIVOS_2026 = [
  '2026-01-01', '2026-01-12', '2026-03-23', '2026-04-02', '2026-04-03',
  '2026-05-01', '2026-05-18', '2026-06-08', '2026-06-15', '2026-06-29',
  '2026-07-20', '2026-08-07', '2026-08-17', '2026-10-12', '2026-11-02',
  '2026-11-16', '2026-12-08', '2026-12-25'
];

// ============================================
// ROLES Y PERMISOS
// ============================================

const VISTAS_RESTRINGIDAS = ['estadisticas', 'estadisticasEstrategicas', 'pagos'];

const puedeVer = (rol, vista) => {
  if (rol === 'admin') return true;
  return !VISTAS_RESTRINGIDAS.includes(vista);
};

const puedeVerOtrosTecnicos = (rol) => {
  return rol === 'admin' || rol === 'control';
};

// ============================================
// HELPERS DE FECHAS
// ============================================

const excelDateToJSDate = (serial) => {
  if (!serial || serial === '') return '';
  if (typeof serial === 'string' && serial.includes('/')) return serial;
  const num = Number(serial);
  // Valores menores a 367 son fórmulas vacías del Excel (ej. 06/01/1900), no fechas reales
  if (isNaN(num) || num < 367) return '';
  const utcDays = num - 25569;
  const date = new Date(utcDays * 86400 * 1000);
  return `${String(date.getUTCDate()).padStart(2,'0')}/${String(date.getUTCMonth()+1).padStart(2,'0')}/${date.getUTCFullYear()}`;
};

const excelDateToDate = (serial) => {
  if (!serial) return null;
  if (typeof serial === 'string' && serial.includes('/')) {
    const p = serial.split('/');
    if (p.length !== 3) return null;
    return new Date(parseInt(p[2]), parseInt(p[1])-1, parseInt(p[0]));
  }
  const num = Number(serial);
  if (isNaN(num) || num < 367) return null;
  return new Date((num - 25569) * 86400 * 1000);
};

const mapearArquitecto = (i) => MAPEO_ARQUITECTOS[i] || i || '';
const mapearIngeniero = (i) => MAPEO_INGENIEROS[i] || i || '';

const esFestivo = (fecha) => {
  const str = fecha.toISOString().split('T')[0];
  return FESTIVOS_2026.includes(str);
};

const esDiaHabil = (fecha) => {
  const dia = fecha.getDay();
  if (dia === 0 || dia === 6) return false;
  return !esFestivo(fecha);
};

const sumarDiasHabiles = (fechaInicio, dias) => {
  if (!fechaInicio) return null;
  const fecha = new Date(fechaInicio);
  let contados = 0;
  while (contados < dias) {
    fecha.setDate(fecha.getDate() + 1);
    if (esDiaHabil(fecha)) contados++;
  }
  return fecha;
};

const contarDiasHabiles = (fechaInicio, fechaFin) => {
  if (!fechaInicio || !fechaFin) return 0;
  const inicio = new Date(fechaInicio);
  const fin = new Date(fechaFin);
  let dias = 0;
  const actual = new Date(inicio);
  while (actual <= fin) {
    if (esDiaHabil(actual)) dias++;
    actual.setDate(actual.getDate() + 1);
  }
  return dias;
};

const formatoFechaLarga = (fechaStr) => {
  if (!fechaStr) return '';
  const p = fechaStr.split('/');
  if (p.length !== 3) return fechaStr;
  const meses = ['ene.','feb.','mar.','abr.','may.','jun.','jul.','ago.','sep.','oct.','nov.','dic.'];
  return `${parseInt(p[0])} de ${meses[parseInt(p[1])-1]} de ${p[2]}`;
};

const formatoFechaCorta = (fecha) => {
  if (!fecha) return '';
  return `${String(fecha.getDate()).padStart(2,'0')}/${String(fecha.getMonth()+1).padStart(2,'0')}/${fecha.getFullYear()}`;
};

const diasEntreFechas = (fecha) => {
  if (!fecha) return null;
  const hoy = new Date();
  hoy.setHours(0,0,0,0);
  const f = new Date(fecha);
  f.setHours(0,0,0,0);
  return Math.floor((f - hoy) / (1000*60*60*24));
};

const diasHabilesRestantes = (fechaLimite) => {
  if (!fechaLimite) return null;
  const hoy = new Date();
  hoy.setHours(0,0,0,0);
  if (fechaLimite < hoy) return -contarDiasHabiles(fechaLimite, hoy);
  return contarDiasHabiles(hoy, fechaLimite);
};

const diasHabilesEntreFechas = (fechaInicio, fechaFin) => {
  if (!fechaInicio || !fechaFin) return null;
  if (fechaFin < fechaInicio) return null;
  return contarDiasHabiles(fechaInicio, fechaFin);
};
// ============================================
// ESTILOS
// ============================================

const STYLES = `
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5; color: #333; -webkit-tap-highlight-color: transparent; }
.app { min-height: 100vh; }
.header { background: #c62828; color: white; padding: 15px 30px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1); position: sticky; top: 0; z-index: 100; }
.header h1 { font-size: 22px; font-weight: 600; }
.header-buttons { display: flex; gap: 10px; align-items: center; }
.header-btn { background: rgba(255,255,255,0.2); color: white; border: 1px solid rgba(255,255,255,0.3); padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 14px; display: flex; align-items: center; gap: 6px; transition: all 0.2s; }
.header-btn:hover { background: rgba(255,255,255,0.3); }
.header-user { display: flex; align-items: center; gap: 10px; padding: 6px 12px; background: rgba(255,255,255,0.1); border-radius: 8px; font-size: 13px; }
.header-user-avatar { width: 32px; height: 32px; border-radius: 50%; background: white; color: #c62828; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 13px; }
.header-user-info { display: flex; flex-direction: column; line-height: 1.2; }
.header-user-name { font-weight: 600; }
.header-user-role { font-size: 11px; opacity: 0.85; text-transform: uppercase; letter-spacing: 0.5px; }
.menu-toggle { display: none; background: rgba(255,255,255,0.2); border: none; color: white; padding: 10px; border-radius: 6px; cursor: pointer; }
.menu-mobile { display: none; }
.nav { background: white; padding: 0 30px; display: flex; gap: 5px; border-bottom: 1px solid #e0e0e0; overflow-x: auto; -webkit-overflow-scrolling: touch; }
.nav::-webkit-scrollbar { height: 3px; }
.nav::-webkit-scrollbar-thumb { background: #c62828; }
.nav-btn { background: none; border: none; padding: 15px 20px; cursor: pointer; font-size: 14px; color: #666; border-bottom: 3px solid transparent; transition: all 0.2s; display: flex; align-items: center; gap: 6px; white-space: nowrap; }
.nav-btn:hover { color: #c62828; }
.nav-btn.active { color: #c62828; border-bottom-color: #c62828; font-weight: 600; }
.content { padding: 30px; max-width: 1400px; margin: 0 auto; }
.stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
.stat-card { background: white; padding: 25px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); border-left: 4px solid #c62828; }
.stat-card h3 { color: #666; font-size: 13px; font-weight: 500; text-transform: uppercase; margin-bottom: 10px; }
.stat-card .value { font-size: 36px; font-weight: 700; color: #c62828; }
.stat-card.warning { border-left-color: #f57c00; }
.stat-card.warning .value { color: #f57c00; }
.stat-card.success { border-left-color: #388e3c; }
.stat-card.success .value { color: #388e3c; }
.stat-card.info { border-left-color: #1976d2; }
.stat-card.info .value { color: #1976d2; }
.stat-card.gold { border-left-color: #f9a825; }
.stat-card.gold .value { color: #f9a825; }
.stat-card.gray { border-left-color: #78909c; }
.stat-card.gray .value { color: #546e7a; }
.charts-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
.chart-card { background: white; padding: 25px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
.chart-card h3 { margin-bottom: 20px; color: #333; font-size: 16px; }
.loading { text-align: center; padding: 60px; font-size: 18px; color: #666; }
.error-msg { background: #ffebee; color: #c62828; padding: 20px; border-radius: 8px; margin: 20px 0; }
.table { width: 100%; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05); overflow-x: auto; -webkit-overflow-scrolling: touch; }
.table table { width: 100%; border-collapse: collapse; min-width: 600px; }
.table th { background: #f5f5f5; padding: 12px; text-align: left; font-size: 13px; color: #666; font-weight: 600; border-bottom: 2px solid #e0e0e0; }
.table td { padding: 12px; border-bottom: 1px solid #f0f0f0; font-size: 14px; }
.table tr:hover { background: #fafafa; }
.badge { display: inline-block; padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: 500; }
.badge.green { background: #e8f5e9; color: #388e3c; }
.badge.red { background: #ffebee; color: #c62828; }
.badge.orange { background: #fff3e0; color: #f57c00; }
.badge.blue { background: #e3f2fd; color: #1976d2; }
.badge.purple { background: #f3e5f5; color: #7b1fa2; }
.badge.gray { background: #eceff1; color: #546e7a; }
.badge.yellow { background: #fffde7; color: #f9a825; }
.search-box { display: flex; gap: 10px; margin-bottom: 20px; }
.search-input { flex: 1; padding: 12px 16px; border: 1px solid #e0e0e0; border-radius: 8px; font-size: 14px; }
.search-input:focus { outline: none; border-color: #c62828; }
.btn-primary { background: #c62828; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-size: 14px; }
.btn-primary:hover { background: #b71c1c; }
.btn-star { background: none; border: none; cursor: pointer; padding: 4px; }
.filter-btn { display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; border: 2px solid #f9a825; background: white; color: #f9a825; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 600; transition: all 0.2s; margin-bottom: 20px; }
.filter-btn:hover { background: #fffde7; }
.filter-btn.active { background: #f9a825; color: white; }
.tecnico-selector { min-height: 100vh; background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%); color: white; padding: 40px; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.tecnico-selector h1 { font-size: 48px; font-weight: 700; margin-bottom: 10px; text-align: center; }
.tecnico-selector .subtitle { color: #ffc107; font-size: 20px; margin-bottom: 40px; text-align: center; }
.tecnico-selector .hint { color: #999; margin-bottom: 40px; text-align: center; }
.tecnico-list { display: flex; flex-direction: column; gap: 15px; max-width: 600px; width: 100%; }
.tecnico-card { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 20px; display: flex; align-items: center; gap: 20px; cursor: pointer; transition: all 0.2s; }
.tecnico-card:hover { background: rgba(255,255,255,0.1); transform: translateX(5px); }
.tecnico-avatar { width: 60px; height: 60px; border-radius: 50%; background: #c62828; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 700; flex-shrink: 0; }
.tecnico-info { flex: 1; }
.tecnico-info .nombre { font-size: 20px; font-weight: 600; }
.tecnico-info .rol { color: #999; font-size: 14px; }
.tecnico-arrow { color: #999; }
.back-btn-tecnico { background: #c62828; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-size: 14px; display: flex; align-items: center; gap: 6px; }
.vista-tecnico { padding: 30px; max-width: 1400px; margin: 0 auto; }
.vista-tecnico-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid #e0e0e0; flex-wrap: wrap; gap: 15px; }
.vista-tecnico-title h2 { font-size: 24px; color: #333; }
.vista-tecnico-title p { color: #666; margin-top: 5px; }
.tecnico-stats { display: grid; grid-template-columns: repeat(6, 1fr); gap: 15px; margin-bottom: 30px; }
.tecnico-stat { background: white; border: 1px solid #e0e0e0; border-radius: 12px; padding: 20px; text-align: center; }
.tecnico-stat .num { font-size: 32px; font-weight: 700; margin-bottom: 5px; }
.tecnico-stat .label { color: #666; font-size: 12px; }
.tecnico-stat.red .num { color: #c62828; }
.tecnico-stat.gold .num { color: #f9a825; }
.tecnico-stat.green .num { color: #388e3c; }
.tecnico-stat.blue .num { color: #1976d2; }
.tecnico-stat.orange .num { color: #f57c00; }
.tecnico-stat.purple .num { color: #7b1fa2; }
.tabs-tecnico { display: flex; gap: 10px; margin-bottom: 20px; border-bottom: 2px solid #e0e0e0; overflow-x: auto; -webkit-overflow-scrolling: touch; }
.tab-tecnico { background: none; border: none; padding: 12px 24px; cursor: pointer; font-size: 14px; color: #666; border-bottom: 3px solid transparent; margin-bottom: -2px; display: flex; align-items: center; gap: 8px; font-weight: 500; white-space: nowrap; }
.tab-tecnico.active { color: #c62828; border-bottom-color: #c62828; font-weight: 600; }
.tab-tecnico .count { background: #f5f5f5; padding: 2px 8px; border-radius: 10px; font-size: 12px; }
.tab-tecnico.active .count { background: #c62828; color: white; }
.proyecto-tecnico { background: white; border: 1px solid #e0e0e0; border-radius: 12px; padding: 20px; margin-bottom: 15px; display: flex; justify-content: space-between; gap: 20px; }
.proyecto-tecnico.urgente { border-left: 4px solid #c62828; }
.proyecto-tecnico.pronto { border-left: 4px solid #f57c00; }
.proyecto-tecnico.ok { border-left: 4px solid #388e3c; }
.proyecto-tecnico.sinfecha { border-left: 4px solid #90a4ae; }
.proyecto-tecnico-info { flex: 1; }
.proyecto-tecnico-header { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; flex-wrap: wrap; }
.proyecto-tecnico-radicado { font-size: 18px; font-weight: 700; color: #f9a825; }
.estado-badge { padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; display: inline-flex; align-items: center; gap: 6px; }
.proyecto-info-row { display: flex; gap: 20px; margin-top: 10px; flex-wrap: wrap; }
.info-item { font-size: 13px; color: #666; }
.info-item strong { color: #333; }
.proyecto-tecnico-actions { display: flex; flex-direction: column; gap: 8px; align-items: flex-end; min-width: 200px; }
.estado-selector { padding: 8px 12px; border: 1px solid #e0e0e0; border-radius: 6px; font-size: 13px; width: 100%; cursor: pointer; background: white; }
.btn-nota { background: transparent; border: 1px solid #e0e0e0; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 13px; color: #666; width: 100%; }
.nota-personal { background: #fff8e1; border: 1px solid #ffe082; padding: 10px; border-radius: 6px; margin-top: 10px; font-size: 13px; color: #6d4c00; }
.semaforo-mini { display: inline-flex; align-items: center; gap: 4px; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600; }
.semaforo-mini.verde { background: #e8f5e9; color: #388e3c; }
.semaforo-mini.amarillo { background: #fff3e0; color: #f57c00; }
.semaforo-mini.rojo { background: #ffebee; color: #c62828; }
.semaforo-mini.gris { background: #eceff1; color: #546e7a; }
.vuelta-info { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; background: #f5f7fa; border: 1px solid #e3e8ef; border-radius: 8px; padding: 10px 14px; margin-top: 12px; font-size: 13px; color: #455a64; }
.vuelta-info strong { color: #263238; }
.vuelta-chip { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 12px; background: #263238; color: white; font-size: 11px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; }
.info-panel { background: #fffde7; border: 1px solid #fdd835; border-radius: 8px; padding: 15px 20px; margin-bottom: 20px; color: #f57f17; }

@media (max-width: 768px) {
  .header { padding: 12px 15px; flex-wrap: wrap; }
  .header h1 { font-size: 16px; flex: 1; }
  .header-buttons { display: none; }
  .menu-toggle { display: flex; align-items: center; justify-content: center; }
  .menu-mobile { display: none; background: #b71c1c; padding: 15px; flex-direction: column; gap: 10px; width: 100%; }
  .menu-mobile.open { display: flex; }
  .menu-mobile .header-btn { justify-content: center; width: 100%; padding: 12px; font-size: 15px; }
  .menu-mobile .header-user { justify-content: center; width: 100%; }
  .nav { padding: 0 10px; }
  .nav-btn { padding: 12px 14px; font-size: 13px; }
  .content { padding: 15px; }
  .stats-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 20px; }
  .stat-card { padding: 15px; }
  .stat-card h3 { font-size: 11px; }
  .stat-card .value { font-size: 24px; }
  .charts-grid { grid-template-columns: 1fr; gap: 15px; }
  .chart-card { padding: 15px; }
  .tecnico-selector { padding: 20px; }
  .tecnico-selector h1 { font-size: 32px; }
  .tecnico-selector .subtitle { font-size: 16px; }
  .tecnico-card { padding: 15px; }
  .tecnico-avatar { width: 50px; height: 50px; font-size: 18px; }
  .tecnico-info .nombre { font-size: 17px; }
  .vista-tecnico { padding: 15px; }
  .vista-tecnico-header { flex-direction: column; align-items: flex-start; }
  .vista-tecnico-title h2 { font-size: 20px; }
  .tecnico-stats { grid-template-columns: repeat(3, 1fr); gap: 8px; }
  .tecnico-stat { padding: 12px 8px; }
  .tecnico-stat .num { font-size: 22px; }
  .tecnico-stat .label { font-size: 10px; }
  .proyecto-tecnico { flex-direction: column; padding: 15px; }
  .proyecto-tecnico-actions { min-width: 100%; align-items: stretch; }
  .proyecto-info-row { flex-direction: column; gap: 8px; }
  .proyecto-tecnico-radicado { font-size: 20px; }
  .vuelta-info { flex-direction: column; align-items: flex-start; gap: 6px; }
  .table { border-radius: 8px; }
  .table td, .table th { padding: 8px; font-size: 12px; }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .stats-grid { grid-template-columns: repeat(3, 1fr); }
  .tecnico-stats { grid-template-columns: repeat(3, 1fr); }
  .charts-grid { grid-template-columns: 1fr; }
}
`;
const STYLES_TV = `
.tv-mode { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: #0a0a0f; color: white; z-index: 1000; overflow-y: auto; padding: 30px; }
.tv-header { display: flex; justify-content: space-between; align-items: center; padding-bottom: 20px; margin-bottom: 30px; border-bottom: 2px solid #ff5252; }
.tv-header-left { display: flex; align-items: center; gap: 20px; }
.tv-close { background: transparent; border: none; color: white; cursor: pointer; font-size: 24px; }
.tv-title-main { font-size: 32px; font-weight: 700; color: #f9a825; letter-spacing: 2px; }
.tv-subtitle { color: #888; font-size: 12px; letter-spacing: 3px; text-transform: uppercase; margin-top: 4px; }
.tv-header-right { text-align: right; display: flex; align-items: center; gap: 20px; }
.tv-date { color: #999; font-size: 14px; margin-bottom: 5px; }
.tv-clock { font-size: 48px; font-weight: 300; color: white; letter-spacing: 4px; font-variant-numeric: tabular-nums; }
.tv-back-btn { background: rgba(255,255,255,0.1); color: white; border: 1px solid rgba(255,255,255,0.2); padding: 10px 20px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 8px; }
.tv-stats-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 15px; margin-bottom: 30px; }
.tv-stat-box { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 25px; text-align: center; }
.tv-stat-box .num { font-size: 56px; font-weight: 700; margin-bottom: 8px; letter-spacing: -1px; }
.tv-stat-box .label { color: #888; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; }
.tv-stat-box.total .num { color: white; }
.tv-stat-box.strat .num { color: #f9a825; }
.tv-stat-box.aprob .num { color: #4caf50; }
.tv-stat-box.rev .num { color: #2196f3; }
.tv-stat-box.tasa .num { color: #ab47bc; }
.tv-stat-box.urg .num { color: #ff5252; }
.tv-grid-main { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-bottom: 30px; }
.tv-panel { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 25px; }
.tv-panel-title { display: flex; align-items: center; gap: 10px; color: #888; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 20px; }
.tv-productividad-item { display: flex; align-items: center; gap: 15px; margin-bottom: 15px; }
.tv-productividad-nombre { min-width: 140px; font-size: 14px; color: white; }
.tv-productividad-bar { flex: 1; height: 20px; background: rgba(255,255,255,0.05); border-radius: 4px; overflow: hidden; display: flex; }
.tv-productividad-bar > div { transition: width 0.3s; }
.tv-productividad-numeros { color: #999; font-size: 12px; letter-spacing: 1px; min-width: 100px; text-align: right; }
.tv-productividad-leyenda { display: flex; gap: 20px; margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.05); }
.tv-leyenda-item { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #999; }
.tv-leyenda-dot { width: 10px; height: 10px; border-radius: 50%; }
.tv-semaforo-item { background: rgba(255,255,255,0.02); border-left: 3px solid #ff5252; border-radius: 6px; padding: 15px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: flex-start; }
.tv-semaforo-info { flex: 1; }
.tv-semaforo-radicado { color: #f9a825; font-weight: 600; margin-bottom: 4px; display: flex; align-items: center; gap: 6px; }
.tv-semaforo-tipo { color: white; font-size: 13px; font-weight: 600; margin-bottom: 8px; }
.tv-semaforo-detalles { color: #999; font-size: 12px; line-height: 1.6; }
.tv-semaforo-vencido { background: #c62828; color: white; padding: 8px 14px; border-radius: 6px; text-align: center; min-width: 70px; }
.tv-semaforo-vencido .num { font-size: 24px; font-weight: 700; line-height: 1; }
.tv-semaforo-vencido .label { font-size: 9px; letter-spacing: 1px; text-transform: uppercase; margin-top: 4px; }
.tv-badge-mini { display: inline-block; padding: 3px 10px; border-radius: 4px; font-size: 10px; letter-spacing: 1px; text-transform: uppercase; font-weight: 600; margin-top: 6px; }
.tv-badge-mini.estudio { background: #4caf50; color: white; }
.tv-badge-mini.obs { background: #388e3c; color: white; }
.tv-badge-mini.rev { background: #2196f3; color: white; }
.tv-movimientos-item { display: flex; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.05); font-size: 13px; }
.tv-mov-dot { width: 8px; height: 8px; border-radius: 50%; background: #4caf50; flex-shrink: 0; }
.tv-mov-star { color: #f9a825; }
.tv-mov-radicado { color: #f9a825; font-weight: 600; }
.tv-mov-estado { color: #999; }
.tv-mov-tecnico { color: white; flex: 1; }
.tv-mov-fecha { color: #666; font-size: 11px; }
`;

// ============================================
// ESTILOS DEL LOGIN PREMIUM
// ============================================

const STYLES_LOGIN = `
.login-page { min-height: 100vh; display: flex; background: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }

.login-visual { flex: 1.2; background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%); position: relative; overflow: hidden; display: flex; flex-direction: column; justify-content: space-between; padding: 60px; color: white; }
.login-visual-svg { position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0.15; }
.login-visual-svg path, .login-visual-svg line, .login-visual-svg rect, .login-visual-svg circle { stroke: #c62828; fill: none; stroke-width: 1.5; }
.login-visual-svg .line-thin { stroke-width: 0.8; opacity: 0.6; }
.login-visual-svg .line-dashed { stroke-dasharray: 4 4; opacity: 0.5; }
.login-visual-svg .anim-draw { stroke-dasharray: 2000; stroke-dashoffset: 2000; animation: drawLine 4s ease-out forwards; }
.login-visual-svg .anim-draw-slow { stroke-dasharray: 2000; stroke-dashoffset: 2000; animation: drawLine 6s ease-out forwards; }
@keyframes drawLine { to { stroke-dashoffset: 0; } }

.login-visual-accent { position: absolute; top: -100px; right: -100px; width: 500px; height: 500px; background: radial-gradient(circle, rgba(198,40,40,0.25) 0%, transparent 70%); pointer-events: none; }
.login-visual-accent-2 { position: absolute; bottom: -150px; left: -150px; width: 600px; height: 600px; background: radial-gradient(circle, rgba(198,40,40,0.15) 0%, transparent 70%); pointer-events: none; }

.login-visual-top { position: relative; z-index: 2; display: flex; align-items: center; gap: 16px; }
.login-visual-top-badge { background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); backdrop-filter: blur(10px); padding: 10px 18px; border-radius: 30px; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; font-weight: 500; display: flex; align-items: center; gap: 8px; }

.login-visual-center { position: relative; z-index: 2; }
.login-visual-title { font-size: 68px; font-weight: 800; line-height: 1.05; letter-spacing: -2px; margin-bottom: 20px; }
.login-visual-title .highlight { color: #ff5252; }
.login-visual-subtitle { font-size: 20px; color: rgba(255,255,255,0.7); font-weight: 300; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 40px; }
.login-visual-desc { font-size: 15px; color: rgba(255,255,255,0.6); max-width: 480px; line-height: 1.7; font-weight: 300; }

.login-visual-bottom { position: relative; z-index: 2; display: flex; gap: 40px; padding-top: 30px; border-top: 1px solid rgba(255,255,255,0.1); }
.login-visual-feature { display: flex; flex-direction: column; gap: 6px; }
.login-visual-feature-num { font-size: 28px; font-weight: 700; color: #ff5252; }
.login-visual-feature-label { font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: rgba(255,255,255,0.5); }

.login-form-area { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px; background: #ffffff; position: relative; }

.login-form-container { width: 100%; max-width: 440px; }
.login-form-logo { display: flex; align-items: center; gap: 14px; margin-bottom: 48px; justify-content: center; }
.login-form-logo-mark { display: flex; align-items: center; }
.login-form-logo-text { display: flex; flex-direction: column; line-height: 1; }
.login-form-logo-text-main { font-size: 24px; font-weight: 800; color: #1a1a1a; letter-spacing: -0.5px; }
.login-form-logo-text-sub { font-size: 11px; font-weight: 500; letter-spacing: 4px; color: #666; margin-top: 4px; }

.login-form-title { font-size: 32px; font-weight: 700; color: #1a1a1a; margin-bottom: 8px; letter-spacing: -0.5px; }
.login-form-subtitle { font-size: 15px; color: #666; margin-bottom: 36px; }

.login-field { margin-bottom: 20px; }
.login-field-label { display: block; font-size: 13px; font-weight: 600; color: #333; margin-bottom: 8px; letter-spacing: 0.3px; }
.login-field-wrapper { position: relative; }
.login-field-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: #999; pointer-events: none; }
.login-field-input { width: 100%; padding: 14px 16px 14px 46px; border: 1.5px solid #e0e0e0; border-radius: 10px; font-size: 15px; color: #1a1a1a; background: #fafafa; transition: all 0.2s; font-family: inherit; }
.login-field-input:hover { border-color: #ccc; background: #fff; }
.login-field-input:focus { outline: none; border-color: #c62828; background: #fff; box-shadow: 0 0 0 4px rgba(198,40,40,0.08); }
.login-field-input.error { border-color: #c62828; background: #fff5f5; }
.login-field-input.error:focus { box-shadow: 0 0 0 4px rgba(198,40,40,0.12); }

.login-field-toggle { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); background: none; border: none; color: #999; cursor: pointer; padding: 4px; display: flex; align-items: center; justify-content: center; border-radius: 4px; transition: color 0.2s; }
.login-field-toggle:hover { color: #c62828; }

.login-options { display: flex; justify-content: space-between; align-items: center; margin-bottom: 28px; margin-top: 4px; }
.login-checkbox { display: flex; align-items: center; gap: 8px; cursor: pointer; user-select: none; }
.login-checkbox input { width: 18px; height: 18px; accent-color: #c62828; cursor: pointer; }
.login-checkbox-label { font-size: 14px; color: #555; }
.login-forgot { background: none; border: none; color: #c62828; font-size: 14px; font-weight: 500; cursor: pointer; padding: 0; text-decoration: none; transition: color 0.2s; font-family: inherit; }
.login-forgot:hover { color: #b71c1c; text-decoration: underline; }

.login-submit { width: 100%; padding: 15px; background: #c62828; color: white; border: none; border-radius: 10px; font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 10px; letter-spacing: 0.3px; font-family: inherit; }
.login-submit:hover:not(:disabled) { background: #b71c1c; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(198,40,40,0.3); }
.login-submit:active:not(:disabled) { transform: translateY(0); }
.login-submit:disabled { opacity: 0.7; cursor: not-allowed; }
.login-submit-spinner { display: inline-block; width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spinLogin 0.7s linear infinite; }
@keyframes spinLogin { to { transform: rotate(360deg); } }

.login-error { background: #fff5f5; border: 1px solid #ffcdd2; color: #c62828; padding: 12px 16px; border-radius: 8px; margin-bottom: 20px; font-size: 14px; display: flex; align-items: center; gap: 10px; animation: shakeLogin 0.4s; }
@keyframes shakeLogin { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-6px); } 75% { transform: translateX(6px); } }

.login-footer { position: absolute; bottom: 30px; left: 60px; right: 60px; text-align: center; font-size: 12px; color: #999; }
.login-footer-line { display: block; margin-bottom: 4px; }

.login-modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 2000; display: flex; align-items: center; justify-content: center; padding: 20px; animation: fadeInLogin 0.2s; }
@keyframes fadeInLogin { from { opacity: 0; } to { opacity: 1; } }
.login-modal { background: white; border-radius: 16px; padding: 32px; max-width: 480px; width: 100%; position: relative; box-shadow: 0 20px 60px rgba(0,0,0,0.3); animation: slideUpLogin 0.3s; }
@keyframes slideUpLogin { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
.login-modal-close { position: absolute; top: 20px; right: 20px; background: #f5f5f5; border: none; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #666; transition: all 0.2s; }
.login-modal-close:hover { background: #e0e0e0; color: #333; }
.login-modal-icon { width: 60px; height: 60px; background: #fff5f5; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; color: #c62828; }
.login-modal-title { font-size: 22px; font-weight: 700; color: #1a1a1a; margin-bottom: 12px; }
.login-modal-text { font-size: 15px; color: #666; line-height: 1.6; margin-bottom: 20px; }
.login-modal-contact { background: #fafafa; border: 1px solid #e0e0e0; border-radius: 10px; padding: 16px; font-size: 14px; color: #333; }
.login-modal-contact strong { color: #c62828; }

@media (max-width: 900px) {
  .login-page { flex-direction: column; }
  .login-visual { flex: none; min-height: auto; padding: 32px 28px 28px; }
  .login-visual-top { margin-bottom: 20px; }
  .login-visual-center { margin-bottom: 20px; }
  .login-visual-title { font-size: 38px; line-height: 1.05; margin-bottom: 12px; }
  .login-visual-subtitle { font-size: 12px; letter-spacing: 2px; margin-bottom: 14px; }
  .login-visual-desc { font-size: 13px; line-height: 1.5; max-width: 100%; }
  .login-visual-bottom { gap: 20px; padding-top: 18px; }
  .login-visual-feature-num { font-size: 20px; }
  .login-visual-feature-label { font-size: 10px; letter-spacing: 1.5px; }
  .login-form-area { padding: 28px 24px 24px; }
  .login-form-logo { margin-bottom: 24px; }
  .login-form-title { font-size: 24px; }
  .login-form-subtitle { font-size: 14px; margin-bottom: 24px; }
  .login-footer { position: static; margin-top: 24px; left: auto; right: auto; padding-bottom: 8px; }
}

@media (max-width: 600px) {
  .login-visual { padding: 24px 20px 20px; }
  .login-visual-svg { opacity: 0.1; }
  .login-visual-title { font-size: 32px; letter-spacing: -1px; }
  .login-visual-top-badge { font-size: 9px; padding: 6px 12px; letter-spacing: 1.5px; }
  .login-visual-desc { font-size: 12px; }
  .login-visual-bottom { gap: 16px; }
  .login-visual-feature-num { font-size: 18px; }
  .login-visual-accent { width: 300px; height: 300px; top: -50px; right: -50px; }
  .login-visual-accent-2 { width: 350px; height: 350px; bottom: -100px; left: -100px; }
  .login-form-area { padding: 24px 20px 20px; }
  .login-form-logo-text-main { font-size: 18px; }
  .login-form-logo-text-sub { font-size: 9px; letter-spacing: 3px; }
  .login-form-title { font-size: 22px; }
  .login-form-subtitle { font-size: 13px; margin-bottom: 20px; }
  .login-field { margin-bottom: 16px; }
  .login-field-label { font-size: 12px; margin-bottom: 6px; }
  .login-field-input { padding: 12px 14px 12px 42px; font-size: 14px; }
  .login-field-icon { left: 14px; }
  .login-options { margin-bottom: 22px; }
  .login-checkbox-label { font-size: 13px; }
  .login-forgot { font-size: 13px; }
  .login-submit { padding: 13px; font-size: 14px; }
  .login-footer { font-size: 11px; margin-top: 20px; }
}

@media (max-width: 380px) {
  .login-visual-title { font-size: 28px; }
  .login-visual-desc { display: none; }
  .login-visual-bottom { gap: 12px; padding-top: 14px; }
  .login-visual-feature-num { font-size: 16px; }
  .login-visual-feature-label { font-size: 9px; letter-spacing: 1px; }
  .login-form-area { padding: 20px 16px 16px; }
  .login-field-input { padding: 11px 12px 11px 40px; font-size: 14px; }
}
`;
// ============================================
// COMPONENTE: LOGO INSTITUCIONAL SVG
// ============================================

const LogoInstitucional = ({ size = 'md', variant = 'dark' }) => {
  const sizes = {
    sm: { mark: 32, text: 16, sub: 8 },
    md: { mark: 44, text: 22, sub: 10 },
    lg: { mark: 60, text: 30, sub: 12 }
  };
  const s = sizes[size] || sizes.md;
  const textColor = variant === 'light' ? '#ffffff' : '#1a1a1a';
  const subColor = variant === 'light' ? 'rgba(255,255,255,0.7)' : '#666';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <svg width={s.mark} height={s.mark} viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
        <polygon points="8,10 30,10 30,32 22,50 8,50" fill="#c62828" />
        <polygon points="30,10 52,10 52,50 38,50 30,32" fill="#1a1a1a" />
        <polygon points="30,10 52,10 30,32" fill="#c62828" />
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
        <div style={{ fontSize: s.text, fontWeight: 800, color: textColor, letterSpacing: '-0.5px' }}>
          CURADURÍA 2
        </div>
        <div style={{ fontSize: s.sub, fontWeight: 500, letterSpacing: '4px', color: subColor, marginTop: 4 }}>
          PEREIRA
        </div>
      </div>
    </div>
  );
};

// ============================================
// COMPONENTE: PANTALLA DE LOGIN
// ============================================

function LoginPage({ onLoginSuccess }) {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [recordarme, setRecordarme] = useState(true);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [modalOlvido, setModalOlvido] = useState(false);

  const manejarSubmit = async (e) => {
    if (e) e.preventDefault();
    setError('');
    if (!usuario.trim() || !password) {
      setError('Por favor ingresa usuario y contraseña');
      return;
    }
    setCargando(true);
    try {
      const response = await fetch('/api/auth-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuario: usuario.trim(),
          password,
          recordarme
        })
      });
      const data = await response.json();
      if (data.success) {
        if (recordarme) {
          localStorage.setItem('authToken', data.token);
          localStorage.setItem('authUser', JSON.stringify(data.usuario));
          sessionStorage.removeItem('authToken');
          sessionStorage.removeItem('authUser');
        } else {
          sessionStorage.setItem('authToken', data.token);
          sessionStorage.setItem('authUser', JSON.stringify(data.usuario));
          localStorage.removeItem('authToken');
          localStorage.removeItem('authUser');
        }
        onLoginSuccess(data.usuario, data.token);
      } else {
        setError(data.error || 'Error al iniciar sesión');
        setCargando(false);
      }
    } catch (err) {
      setError('Error de conexión. Verifica tu internet e intenta de nuevo.');
      setCargando(false);
    }
  };

  return (
    <div className="login-page">
      <style>{STYLES_LOGIN}</style>

      {/* ==================== ÁREA VISUAL IZQUIERDA ==================== */}
      <div className="login-visual">
        <svg className="login-visual-svg" viewBox="0 0 800 900" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
          <g className="line-thin">
            {Array.from({length: 20}).map((_, i) => (
              <line key={`h${i}`} x1="0" y1={i * 45} x2="800" y2={i * 45} />
            ))}
            {Array.from({length: 20}).map((_, i) => (
              <line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2="900" />
            ))}
          </g>

          <g className="anim-draw">
            <rect x="120" y="300" width="120" height="380" />
            <line x1="120" y1="340" x2="240" y2="340" />
            <line x1="120" y1="380" x2="240" y2="380" />
            <line x1="120" y1="420" x2="240" y2="420" />
            <line x1="120" y1="460" x2="240" y2="460" />
            <line x1="120" y1="500" x2="240" y2="500" />
            <line x1="120" y1="540" x2="240" y2="540" />
            <line x1="120" y1="580" x2="240" y2="580" />
            <line x1="120" y1="620" x2="240" y2="620" />
            <line x1="160" y1="300" x2="160" y2="680" />
            <line x1="200" y1="300" x2="200" y2="680" />

            <rect x="280" y="400" width="140" height="280" />
            <line x1="280" y1="440" x2="420" y2="440" />
            <line x1="280" y1="480" x2="420" y2="480" />
            <line x1="280" y1="520" x2="420" y2="520" />
            <line x1="280" y1="560" x2="420" y2="560" />
            <line x1="280" y1="600" x2="420" y2="600" />
            <line x1="320" y1="400" x2="320" y2="680" />
            <line x1="360" y1="400" x2="360" y2="680" />
            <line x1="400" y1="400" x2="400" y2="680" />

            <rect x="460" y="250" width="120" height="430" />
            <line x1="460" y1="290" x2="580" y2="290" />
            <line x1="460" y1="330" x2="580" y2="330" />
            <line x1="460" y1="370" x2="580" y2="370" />
            <line x1="460" y1="410" x2="580" y2="410" />
            <line x1="460" y1="450" x2="580" y2="450" />
            <line x1="460" y1="490" x2="580" y2="490" />
            <line x1="460" y1="530" x2="580" y2="530" />
            <line x1="460" y1="570" x2="580" y2="570" />
            <line x1="460" y1="610" x2="580" y2="610" />
            <line x1="500" y1="250" x2="500" y2="680" />
            <line x1="540" y1="250" x2="540" y2="680" />

            <rect x="620" y="480" width="100" height="200" />
            <line x1="620" y1="520" x2="720" y2="520" />
            <line x1="620" y1="560" x2="720" y2="560" />
            <line x1="620" y1="600" x2="720" y2="600" />
            <line x1="660" y1="480" x2="660" y2="680" />
            <line x1="700" y1="480" x2="700" y2="680" />

            <line x1="60" y1="680" x2="760" y2="680" strokeWidth="2" />
          </g>

          <g className="anim-draw-slow line-dashed">
            <line x1="60" y1="750" x2="760" y2="750" />
            <line x1="60" y1="780" x2="760" y2="780" />
            <line x1="120" y1="740" x2="120" y2="760" />
            <line x1="240" y1="740" x2="240" y2="760" />
            <line x1="360" y1="740" x2="360" y2="760" />
            <line x1="480" y1="740" x2="480" y2="760" />
            <line x1="600" y1="740" x2="600" y2="760" />
            <line x1="720" y1="740" x2="720" y2="760" />
          </g>

          <g className="anim-draw">
            <circle cx="150" cy="180" r="40" />
            <circle cx="150" cy="180" r="25" />
            <circle cx="150" cy="180" r="8" />
            <line x1="90" y1="180" x2="210" y2="180" className="line-thin" />
            <line x1="150" y1="120" x2="150" y2="240" className="line-thin" />
          </g>

          <g className="anim-draw-slow line-thin">
            <line x1="0" y1="850" x2="800" y2="50" strokeDasharray="8 6" />
            <line x1="0" y1="50" x2="800" y2="850" strokeDasharray="8 6" />
          </g>
        </svg>

        <div className="login-visual-accent"></div>
        <div className="login-visual-accent-2"></div>

        <div className="login-visual-top">
          <div className="login-visual-top-badge">
            <Shield size={14} />
            SISTEMA INSTITUCIONAL
          </div>
        </div>

        <div className="login-visual-center">
          <div className="login-visual-title">
            CURADURÍA<br/>URBANA <span className="highlight">N.° 2</span>
          </div>
          <div className="login-visual-subtitle">PEREIRA · RISARALDA</div>
          <div className="login-visual-desc">
            Plataforma de gestión y seguimiento de proyectos urbanísticos, licencias de construcción y control de términos legales para el equipo técnico de la curaduría.
          </div>
        </div>

        <div className="login-visual-bottom">
          <div className="login-visual-feature">
            <div className="login-visual-feature-num">100%</div>
            <div className="login-visual-feature-label">Digital</div>
          </div>
          <div className="login-visual-feature">
            <div className="login-visual-feature-num">24/7</div>
            <div className="login-visual-feature-label">Disponible</div>
          </div>
          <div className="login-visual-feature">
            <div className="login-visual-feature-num">2026</div>
            <div className="login-visual-feature-label">Versión</div>
          </div>
        </div>
      </div>

      {/* ==================== ÁREA DEL FORMULARIO DERECHA ==================== */}
      <div className="login-form-area">
        <div className="login-form-container">
          <div className="login-form-logo">
            <LogoInstitucional size="md" variant="dark" />
          </div>

          <h1 className="login-form-title">Bienvenido</h1>
          <p className="login-form-subtitle">Ingresa a tu cuenta para continuar</p>

          {error && (
            <div className="login-error">
              <AlertTriangle size={18} />
              <span>{error}</span>
            </div>
          )}

          <div>
            <div className="login-field">
              <label className="login-field-label">Usuario</label>
              <div className="login-field-wrapper">
                <div className="login-field-icon">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  className={`login-field-input ${error ? 'error' : ''}`}
                  placeholder="Ingresa tu usuario"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && manejarSubmit(e)}
                  autoComplete="username"
                  autoFocus
                  disabled={cargando}
                />
              </div>
            </div>

            <div className="login-field">
              <label className="login-field-label">Contraseña</label>
              <div className="login-field-wrapper">
                <div className="login-field-icon">
                  <Lock size={18} />
                </div>
                <input
                  type={mostrarPassword ? 'text' : 'password'}
                  className={`login-field-input ${error ? 'error' : ''}`}
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && manejarSubmit(e)}
                  autoComplete="current-password"
                  disabled={cargando}
                />
                <button
                  type="button"
                  className="login-field-toggle"
                  onClick={() => setMostrarPassword(!mostrarPassword)}
                  tabIndex={-1}
                  aria-label={mostrarPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {mostrarPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="login-options">
              <label className="login-checkbox">
                <input
                  type="checkbox"
                  checked={recordarme}
                  onChange={(e) => setRecordarme(e.target.checked)}
                  disabled={cargando}
                />
                <span className="login-checkbox-label">Recordarme</span>
              </label>
              <button
                type="button"
                className="login-forgot"
                onClick={() => setModalOlvido(true)}
                disabled={cargando}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            <button
              type="button"
              className="login-submit"
              onClick={manejarSubmit}
              disabled={cargando}
            >
              {cargando ? (
                <>
                  <span className="login-submit-spinner"></span>
                  Iniciando sesión...
                </>
              ) : (
                <>
                  <LogIn size={18} />
                  Iniciar sesión
                </>
              )}
            </button>
          </div>
        </div>

        <div className="login-footer">
          <span className="login-footer-line">© 2026 Curaduría Urbana N.° 2 de Pereira</span>
          <span className="login-footer-line">Todos los derechos reservados · Uso institucional</span>
        </div>
      </div>

      {modalOlvido && (
        <div className="login-modal-overlay" onClick={() => setModalOlvido(false)}>
          <div className="login-modal" onClick={(e) => e.stopPropagation()}>
            <button className="login-modal-close" onClick={() => setModalOlvido(false)} aria-label="Cerrar">
              <X size={16} />
            </button>
            <div className="login-modal-icon">
              <Lock size={28} />
            </div>
            <h3 className="login-modal-title">Recuperación de contraseña</h3>
            <p className="login-modal-text">
              Por seguridad, la recuperación de contraseñas se gestiona directamente con el administrador del sistema. 
              Comunícate para restablecer tu acceso.
            </p>
            <div className="login-modal-contact">
              📧 <strong>director@curaduria2pereira.com.co</strong><br/>
              <span style={{fontSize:'13px', color:'#666', marginTop:'6px', display:'block'}}>
                Menciona tu nombre de usuario y el motivo de la solicitud.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
// ============================================
// COMPONENTE APP PRINCIPAL
// ============================================

function App() {
  // ==============================
  // AUTENTICACIÓN
  // ==============================
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [token, setToken] = useState(null);
  const [verificandoSesion, setVerificandoSesion] = useState(true);

  useEffect(() => {
    const verificarSesion = async () => {
      const tokenGuardado = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      const usuarioGuardado = localStorage.getItem('authUser') || sessionStorage.getItem('authUser');

      if (!tokenGuardado || !usuarioGuardado) {
        setVerificandoSesion(false);
        return;
      }

      try {
        const response = await fetch('/api/auth-me', {
          headers: { 'Authorization': `Bearer ${tokenGuardado}` }
        });
        const data = await response.json();
        if (data.success) {
          setUsuarioActual(data.usuario);
          setToken(tokenGuardado);
        } else {
          localStorage.removeItem('authToken');
          localStorage.removeItem('authUser');
          sessionStorage.removeItem('authToken');
          sessionStorage.removeItem('authUser');
        }
      } catch (err) {
        try {
          const userParsed = JSON.parse(usuarioGuardado);
          setUsuarioActual(userParsed);
          setToken(tokenGuardado);
        } catch (e) {
          // ignorar
        }
      } finally {
        setVerificandoSesion(false);
      }
    };
    verificarSesion();
  }, []);

  const manejarLoginExitoso = (usuario, tokenNuevo) => {
    setUsuarioActual(usuario);
    setToken(tokenNuevo);
  };

  const cerrarSesion = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('authUser');
    setUsuarioActual(null);
    setToken(null);
    setVista('dashboard');
    setTecnicoActivo(null);
    setModoTV(false);
    setMenuAbierto(false);
  };

  // ==============================
  // ESTADOS GENERALES
  // ==============================
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [vista, setVista] = useState('dashboard');
  const [busqueda, setBusqueda] = useState('');
  const [modoTV, setModoTV] = useState(false);
  const [horaTV, setHoraTV] = useState(new Date());
  const [tecnicoActivo, setTecnicoActivo] = useState(null);
  const [tabTecnico, setTabTecnico] = useState('activos');
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [filtroEstrategicosTecnicos, setFiltroEstrategicosTecnicos] = useState(false);

  const [estrategicos, setEstrategicos] = useState(() => {
    const saved = localStorage.getItem('estrategicos');
    return saved ? JSON.parse(saved) : [];
  });

  const [notasPersonales, setNotasPersonales] = useState(() => {
    const saved = localStorage.getItem('notasPersonales');
    return saved ? JSON.parse(saved) : {};
  });

  const [estadosFlujo, setEstadosFlujo] = useState(() => {
    const saved = localStorage.getItem('estadosFlujo');
    return saved ? JSON.parse(saved) : {};
  });

  // ==============================
  // CARGA DE DATOS DEL EXCEL
  // ==============================
  const cargarDatos = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/excel-data', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.status === 401) {
        cerrarSesion();
        return;
      }
      const data = await response.json();
      if (data.success) {
        const proyectosProcesados = data.proyectos.map(p => {
          const convertido = { ...p };

          // Convertir todas las columnas de fecha (incluidas las nuevas)
          CAMPOS_FECHA.forEach(campo => {
            let valor = excelDateToJSDate(p[campo]);
            // Fechas de fórmulas vacías del Excel (año 1900) se tratan como vacías
            if (typeof valor === 'string' && valor.endsWith('/1900')) valor = '';
            convertido[campo] = valor;
          });

          convertido.nombreArquitecto = mapearArquitecto(String(p.nombreArquitecto || '').trim());
          convertido.nombreIngeniero = mapearIngeniero(String(p.nombreIngeniero || '').trim());
          convertido.estrategico =
            String(p.estrategicoExcel || '').toUpperCase().trim() === 'SI' ||
            estrategicos.includes(String(p.radicado));

          return convertido;
        });
        setProyectos(proyectosProcesados);
      } else {
        setError(data.error || 'Error al cargar datos');
      }
    } catch (err) {
      setError('Error de conexión: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (usuarioActual && token) {
      cargarDatos();
    }
  }, [usuarioActual, token]);

  // Nota: TODOS los usuarios (admins, control y técnicos) entran al Dashboard general.
  // Los técnicos navegan por el menú restringido y al entrar a "Mi Panel"
  // van directo a su vista personal (sin poder elegir otros técnicos).

  // Reloj del modo TV
  useEffect(() => {
    if (modoTV) {
      const timer = setInterval(() => setHoraTV(new Date()), 1000);
      return () => clearInterval(timer);
    }
  }, [modoTV]);

  // ==============================
  // HELPERS DE INTERACCIÓN
  // ==============================
  const toggleEstrategico = (radicado) => {
    const radStr = String(radicado);
    const nuevos = estrategicos.includes(radStr) ? estrategicos.filter(r => r !== radStr) : [...estrategicos, radStr];
    setEstrategicos(nuevos);
    localStorage.setItem('estrategicos', JSON.stringify(nuevos));
    setProyectos(proyectos.map(p => String(p.radicado) === radStr ? { ...p, estrategico: !p.estrategico } : p));
  };

  const cambiarEstadoFlujo = (radicado, nuevoEstado) => {
    const nuevos = { ...estadosFlujo };
    if (nuevoEstado === 'AUTO') {
      delete nuevos[radicado];
    } else {
      nuevos[radicado] = { estado: nuevoEstado, fecha: new Date().toISOString() };
    }
    setEstadosFlujo(nuevos);
    localStorage.setItem('estadosFlujo', JSON.stringify(nuevos));
  };

  const guardarNota = (radicado, tecnico, nota) => {
    const key = `${tecnico}_${radicado}`;
    const nuevas = { ...notasPersonales, [key]: nota };
    if (!nota || nota.trim() === '') delete nuevas[key];
    setNotasPersonales(nuevas);
    localStorage.setItem('notasPersonales', JSON.stringify(nuevas));
  };

  const getEstadoFlujo = (p) => {
    const local = estadosFlujo[p.radicado];
    if (local) return local.estado;
    const estado = String(p.estadoActual || '').toUpperCase().trim();
    if (estado === 'EXPEDIDO' || estado === 'EN EXPEDICION') return 'EXPEDIDO';
    if (estado === 'DESISTIDO') return 'DESISTIDO';
    if (estado === 'NEGADO') return 'NEGADO';
    if (estado === 'NO L.D.F' || !p.fechaLegal) return 'PENDIENTE_LDF';
    if (estado === 'ACTA DE OBSERVACIONES') return 'ACTA_OBS';
    if (estado === 'SUSPENSIÓN DE TÉRMINOS') return 'ACTA_OBS';
    if (estado === 'PAGOS') return 'PAGOS';
    if (estado === 'PENDIENTES' || estado === 'PENDIENTE') return 'PENDIENTE';
    if (estado === 'REVISION ARQ 1' || estado === 'REVISIÓN ARQ 1') return 'REV_ARQ_1';
    if (estado === 'REVISION ESTRUC 1' || estado === 'REVISIÓN ESTRUC 1') return 'REV_ESTR_1';
    if (estado === 'REVISION ARQ 2' || estado === 'REVISIÓN ARQ 2') return 'REV_ARQ_2';
    if (estado === 'REVISION ESTRUC 2' || estado === 'REVISIÓN ESTRUC 2') return 'REV_ESTR_2';
    if (estado === 'REVISION ARQ 3' || estado === 'REVISIÓN ARQ 3') return 'REV_ARQ_3';
    if (estado === 'REVISION ESTRUC 3' || estado === 'REVISIÓN ESTRUC 3') return 'REV_ESTR_3';
    if (estado === 'REVISION ARQ 4' || estado === 'REVISIÓN ARQ 4') return 'REV_ARQ_4';
    if (estado === 'REVISION ESTRUC 4' || estado === 'REVISIÓN ESTRUC 4') return 'REV_ESTR_4';
    if (estado === 'REVISIÓN' || estado === 'REVISION') {
      if (p.fechaPrimeraRevIng) return 'REV_ESTR_1';
      if (p.fechaPrimeraRevArq) return 'REV_ARQ_1';
      return 'REV_ARQ_1';
    }
    if (p.actaObservaciones) return 'ACTA_OBS';
    if (p.fechaPrimeraRevIng) return 'REV_ESTR_1';
    if (p.fechaPrimeraRevArq) return 'REV_ARQ_1';
    if (p.fechaLegal) return 'REV_ARQ_1';
    return 'PENDIENTE_LDF';
  };

  // ============================================
  // LÓGICA DE VENCIMIENTO POR VUELTA
  // ============================================
  // Usa la tabla VUELTAS (parte 1): cada revisión cuenta sus días hábiles
  // desde su propia fecha de inicio. Si esa fecha está vacía, devuelve null
  // y el proyecto NO se marca como vencido (se muestra "Sin fecha de inicio").

  const getFechaLimiteEtapa = (p) => {
    const info = VUELTAS[getEstadoFlujo(p)];
    if (!info) return null;
    const fechaInicio = excelDateToDate(p[info.campoInicio]);
    if (!fechaInicio) return null;
    return sumarDiasHabiles(fechaInicio, info.dias);
  };

  // Información completa de la vuelta actual para mostrar en pantalla
  const getInfoVuelta = (p) => {
    const estado = getEstadoFlujo(p);
    const info = VUELTAS[estado];
    if (!info) return null;
    const fechaLimite = getFechaLimiteEtapa(p);
    return {
      ...info,
      fechaInicio: p[info.campoInicio] || '',
      fechaEntrega: info.campoEntrega ? (p[info.campoEntrega] || '') : '',
      fechaLimite,
      diasRestantes: fechaLimite ? diasHabilesRestantes(fechaLimite) : null,
      sinFechaInicio: !p[info.campoInicio]
    };
  };

  // ==============================
  // GATE DE AUTENTICACIÓN
  // ==============================
  if (verificandoSesion) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f5f5f5',
        fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 40,
            height: 40,
            border: '4px solid #e0e0e0',
            borderTopColor: '#c62828',
            borderRadius: '50%',
            animation: 'spinInit 0.7s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <div style={{ color: '#666', fontSize: 14 }}>Verificando sesión...</div>
          <style>{`@keyframes spinInit { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  if (!usuarioActual || !token) {
    return <LoginPage onLoginSuccess={manejarLoginExitoso} />;
  }

  const inicialesUsuario = (nombre) => {
    if (!nombre) return 'U';
    const partes = nombre.trim().split(' ');
    if (partes.length === 1) return partes[0].charAt(0).toUpperCase();
    return (partes[0].charAt(0) + partes[partes.length - 1].charAt(0)).toUpperCase();
  };

  const labelRol = (rol) => {
    if (rol === 'admin') return 'Administrador';
    if (rol === 'control') return 'Control de términos';
    if (rol === 'tecnico') return 'Técnico';
    return 'Usuario';
  };

  // ==============================
  // CÁLCULOS GENERALES
  // ==============================
  const totalProyectos = proyectos.length;
  const proyectosEstrategicos = proyectos.filter(p => p.estrategico).length;
  const enEstudio = proyectos.filter(p => ESTADOS_REVISION.includes(getEstadoFlujo(p))).length;
  const aprobados = proyectos.filter(p => getEstadoFlujo(p) === 'EXPEDIDO').length;
  const observaciones = proyectos.filter(p => getEstadoFlujo(p) === 'ACTA_OBS').length;
  const sinLDF = proyectos.filter(p => getEstadoFlujo(p) === 'PENDIENTE_LDF').length;
  const desistidos = proyectos.filter(p => getEstadoFlujo(p) === 'DESISTIDO').length;
  const negados = proyectos.filter(p => getEstadoFlujo(p) === 'NEGADO').length;
  const pendientes = proyectos.filter(p => getEstadoFlujo(p) === 'PENDIENTE').length;
  const enPagos = proyectos.filter(p => getEstadoFlujo(p) === 'PAGOS').length;
  const tasaAprobacion = totalProyectos > 0 ? Math.round((aprobados / totalProyectos) * 100) : 0;

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  // Vencidos: en revisión, con fecha de inicio registrada y fecha límite ya pasada
  const vencidos = proyectos.filter(p => {
    if (!ESTADOS_REVISION.includes(getEstadoFlujo(p))) return false;
    const fechaLimite = getFechaLimiteEtapa(p);
    if (!fechaLimite) return false;
    return fechaLimite < hoy;
  });

  // En revisión pero sin fecha de inicio registrada en el Excel
  const sinFechaInicio = proyectos.filter(p => {
    if (!ESTADOS_REVISION.includes(getEstadoFlujo(p))) return false;
    return !getFechaLimiteEtapa(p);
  });

  const ORDINAL_VUELTA = { 1: '1ra', 2: '2da', 3: '3ra', 4: '4ta' };

  const ultimosMovimientos = () => {
    const movs = [];
    proyectos.forEach(p => {
      const arq = p.nombreArquitecto;
      const ing = p.nombreIngeniero;
      const cualquiera = arq || ing;
      const eventos = [
        { fecha: p.fechaPrimeraRevArq, tipo: 'REV ARQ', tecnico: arq },
        { fecha: p.fechaPrimeraRevIng, tipo: 'REV ESTRUC', tecnico: ing },
        { fecha: p.actaObservaciones, tipo: 'ACTA OBS', tecnico: cualquiera },
        { fecha: p.fechaAsigArqActa, tipo: 'REV ARQ 2', tecnico: arq },
        { fecha: p.fechaAsigEstrActa, tipo: 'REV ESTRUC 2', tecnico: ing },
        { fecha: p.fechaSegundaRevArq, tipo: 'REV ARQ 3', tecnico: arq },
        { fecha: p.fechaSegundaRevEstr, tipo: 'REV ESTRUC 3', tecnico: ing },
        { fecha: p.fechaTerceraRevArq, tipo: 'REV ARQ 4', tecnico: arq },
        { fecha: p.fechaTerceraRevEstr, tipo: 'REV ESTRUC 4', tecnico: ing },
        { fecha: p.fechaFinalizacion, tipo: 'FINALIZADO', tecnico: cualquiera },
        { fecha: p.fechaLicencia, tipo: 'EXPEDIDO', tecnico: cualquiera }
      ];
      eventos.forEach(e => {
        if (e.fecha && e.tecnico) {
          const fechaObj = excelDateToDate(e.fecha);
          // Solo movimientos reales (no fechas futuras)
          if (fechaObj && fechaObj <= new Date()) {
            movs.push({
              radicado: p.radicado, tipo: e.tipo, tecnico: e.tecnico,
              fecha: fechaObj, fechaStr: formatoFechaLarga(e.fecha), estrategico: p.estrategico
            });
          }
        }
      });
    });
    return movs.sort((a, b) => b.fecha - a.fecha).slice(0, 15);
  };

  const productividadEquipo = (soloEstrategicos = false) => {
    const stats = {};
    TECNICOS.forEach(t => { stats[t.nombre] = { aprobados: 0, revision: 0, acta: 0, desistidos: 0, vencidos: 0, total: 0 }; });
    const proyectosBase = soloEstrategicos ? proyectos.filter(p => p.estrategico) : proyectos;
    proyectosBase.forEach(p => {
      const estado = getEstadoFlujo(p);
      const nombres = [p.nombreArquitecto, p.nombreIngeniero].filter(Boolean);
      const esVencido = vencidos.some(v => v.radicado === p.radicado);
      nombres.forEach(n => {
        if (stats[n]) {
          stats[n].total++;
          if (estado === 'EXPEDIDO') stats[n].aprobados++;
          else if (ESTADOS_REVISION.includes(estado)) stats[n].revision++;
          if (estado === 'ACTA_OBS') stats[n].acta++;
          if (estado === 'DESISTIDO') stats[n].desistidos++;
          if (esVencido) stats[n].vencidos++;
        }
      });
    });
    return stats;
  };

  const calcularEficiencia = (nombreTecnico, soloEstrategicos = false) => {
    const proyectosBase = soloEstrategicos ? proyectos.filter(p => p.estrategico) : proyectos;
    const misProyectos = proyectosBase.filter(p =>
      p.nombreArquitecto === nombreTecnico || p.nombreIngeniero === nombreTecnico
    );

    let tiemposExpedicion = [];
    let tiemposActa = [];
    let tiemposRespuesta = [];

    misProyectos.forEach(p => {
      const fRad = excelDateToDate(p.fechaRadicacion);
      const fExp = excelDateToDate(p.fechaLicencia);
      const fActa = excelDateToDate(p.actaObservaciones);
      const fFin = excelDateToDate(p.fechaFinalizacion);

      if (fRad && fExp) {
        const dias = diasHabilesEntreFechas(fRad, fExp);
        if (dias !== null) tiemposExpedicion.push(dias);
      }
      if (fRad && fActa) {
        const dias = diasHabilesEntreFechas(fRad, fActa);
        if (dias !== null) tiemposActa.push(dias);
      }
      if (fActa && fFin) {
        const dias = diasHabilesEntreFechas(fActa, fFin);
        if (dias !== null) tiemposRespuesta.push(dias);
      }
    });

    const promedio = (arr) => arr.length > 0 ? Math.round(arr.reduce((a,b) => a+b, 0) / arr.length) : null;

    return {
      expedicion: promedio(tiemposExpedicion),
      acta: promedio(tiemposActa),
      respuesta: promedio(tiemposRespuesta),
      totalExpediciones: tiemposExpedicion.length,
      totalActas: tiemposActa.length
    };
  };
    // ==============================
  // MODO TV
  // ==============================
  if (modoTV) {
    const movs = ultimosMovimientos();
    const prod = productividadEquipo();
    const meses = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
    const diasSem = ['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];
    const fechaHoy = `${diasSem[horaTV.getDay()]}, ${horaTV.getDate()} de ${meses[horaTV.getMonth()]}`;

    return (
      <div className="tv-mode">
        <style>{STYLES + STYLES_TV}</style>
        <div className="tv-header">
          <div className="tv-header-left">
            <button className="tv-close" onClick={() => setModoTV(false)}>×</button>
            <div>
              <div className="tv-title-main">CURADURÍA 2 PEREIRA</div>
              <div className="tv-subtitle">CENTRO DE CONTROL · PROYECTOS ESTRATÉGICOS</div>
            </div>
          </div>
          <div className="tv-header-right">
            <div>
              <div className="tv-date">{fechaHoy.charAt(0).toUpperCase() + fechaHoy.slice(1)}</div>
              <div className="tv-clock">{String(horaTV.getHours()).padStart(2,'0')}:{String(horaTV.getMinutes()).padStart(2,'0')}:{String(horaTV.getSeconds()).padStart(2,'0')}</div>
            </div>
            <button className="tv-back-btn" onClick={() => setModoTV(false)}>
              <ArrowLeft size={16} /> Volver
            </button>
          </div>
        </div>

        <div className="tv-stats-grid">
          <div className="tv-stat-box total"><div className="num">{totalProyectos}</div><div className="label">Total</div></div>
          <div className="tv-stat-box strat"><div className="num">{proyectosEstrategicos}</div><div className="label">⭐ Estratégicos</div></div>
          <div className="tv-stat-box aprob"><div className="num">{aprobados}</div><div className="label">Aprobados</div></div>
          <div className="tv-stat-box rev"><div className="num">{enEstudio}</div><div className="label">En Revisión</div></div>
          <div className="tv-stat-box tasa"><div className="num">{tasaAprobacion}%</div><div className="label">Tasa Aprob.</div></div>
          <div className="tv-stat-box urg"><div className="num">{vencidos.length}</div><div className="label">Urgentes</div></div>
        </div>

        <div className="tv-grid-main">
          <div className="tv-panel">
            <div className="tv-panel-title"><Trophy size={14} /> PRODUCTIVIDAD DEL EQUIPO</div>
            {TECNICOS.map(t => {
              const s = prod[t.nombre] || { aprobados: 0, revision: 0, acta: 0, total: 0 };
              const maxVal = Math.max(1, s.aprobados + s.revision + s.acta);
              return (
                <div key={t.nombre} className="tv-productividad-item">
                  <div className="tv-productividad-nombre">{t.nombre}</div>
                  <div className="tv-productividad-bar">
                    <div style={{width: `${(s.aprobados/maxVal)*100}%`, background: '#4caf50'}}></div>
                    <div style={{width: `${(s.revision/maxVal)*100}%`, background: '#2196f3'}}></div>
                    <div style={{width: `${(s.acta/maxVal)*100}%`, background: '#ff9800'}}></div>
                  </div>
                  <div className="tv-productividad-numeros">{s.aprobados}A · {s.revision}R · {s.acta}Ac · {s.total}T</div>
                </div>
              );
            })}
            <div className="tv-productividad-leyenda">
              <div className="tv-leyenda-item"><div className="tv-leyenda-dot" style={{background:'#4caf50'}}></div>Aprobados</div>
              <div className="tv-leyenda-item"><div className="tv-leyenda-dot" style={{background:'#2196f3'}}></div>En Revisión</div>
              <div className="tv-leyenda-item"><div className="tv-leyenda-dot" style={{background:'#ff9800'}}></div>En Acta</div>
            </div>
          </div>

          <div className="tv-panel">
            <div className="tv-panel-title">📊 ESTADO GENERAL</div>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={[
                  {name:'Aprobados',value:aprobados,color:'#4caf50'},
                  {name:'En Revisión',value:enEstudio,color:'#2196f3'},
                  {name:'Observaciones',value:observaciones,color:'#ff9800'},
                  {name:'Vencidos',value:vencidos.length,color:'#f44336'}
                ].filter(d=>d.value>0)} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value">
                  {[{color:'#4caf50'},{color:'#2196f3'},{color:'#ff9800'},{color:'#f44336'}].map((e,i)=><Cell key={i} fill={e.color}/>)}
                </Pie>
                <Tooltip contentStyle={{background:'#1a1a2e',border:'1px solid #333'}} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="tv-panel">
            <div className="tv-panel-title">🚦 SEMÁFORO DE TÉRMINOS</div>
            {vencidos.slice(0, 5).map(p => {
              const infoV = getInfoVuelta(p);
              const diasVenc = infoV && infoV.diasRestantes !== null ? Math.abs(infoV.diasRestantes) : 0;
              return (
                <div key={p.radicado} className="tv-semaforo-item">
                  <div className="tv-semaforo-info">
                    <div className="tv-semaforo-radicado">
                      {p.estrategico && <Star size={14} fill="#f9a825" color="#f9a825" />}
                      {p.radicado}
                    </div>
                    <div className="tv-semaforo-tipo">{ESTADOS_FLUJO[getEstadoFlujo(p)]?.label || 'SIN ESTADO'}</div>
                    <div className="tv-semaforo-detalles">
                      Arquitecto: {p.nombreArquitecto || '-'}<br/>
                      Ingeniero: {p.nombreIngeniero || '-'}
                      {infoV && <><br/>Inició: {formatoFechaLarga(infoV.fechaInicio)}</>}
                    </div>
                  </div>
                  <div className="tv-semaforo-vencido">
                    <div className="num">{diasVenc}</div>
                    <div className="label">Vencido</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="tv-panel">
          <div className="tv-panel-title"><ClipboardList size={14} /> ÚLTIMOS MOVIMIENTOS</div>
          {movs.map((m, i) => (
            <div key={i} className="tv-movimientos-item">
              <div className="tv-mov-dot"></div>
              {m.estrategico && <Star size={12} className="tv-mov-star" fill="#f9a825" color="#f9a825" />}
              <span className="tv-mov-radicado">Radicado {m.radicado}</span>
              <span className="tv-mov-estado">· {m.tipo} ·</span>
              <span className="tv-mov-tecnico">{m.tecnico}</span>
              <span className="tv-mov-fecha">{m.fechaStr}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ==============================
  // SELECTOR DE TÉCNICO
  // ==============================
  // Técnico común: al hacer click en "Mi Panel" va directo a su vista personal.
  if (vista === 'ingreso' && !tecnicoActivo && usuarioActual.rol === 'tecnico' && usuarioActual.tecnicoNombre) {
    const miPerfil = TECNICOS.find(t => t.nombre === usuarioActual.tecnicoNombre);
    if (miPerfil) {
      setTimeout(() => {
        setTecnicoActivo(miPerfil);
        setTabTecnico('activos');
      }, 0);
      return null;
    }
  }

  // Solo admins y control (Valentina) ven el selector de técnicos
  if (vista === 'ingreso' && !tecnicoActivo && puedeVerOtrosTecnicos(usuarioActual.rol)) {
    return (
      <div className="tecnico-selector">
        <style>{STYLES}</style>
        <h1>Curaduría 2 Pereira</h1>
        <div className="subtitle">Proyectos Estratégicos 2026</div>
        <div className="hint">Selecciona un técnico para ver su panorama de proyectos</div>
        <div className="tecnico-list">
          {TECNICOS.map(t => (
            <div key={t.nombre} className="tecnico-card" onClick={() => { setTecnicoActivo(t); setTabTecnico('activos'); }}>
              <div className="tecnico-avatar">{t.inicial}</div>
              <div className="tecnico-info">
                <div className="nombre">{t.nombre}</div>
                <div className="rol">{t.rol}</div>
              </div>
              <div className="tecnico-arrow">›</div>
            </div>
          ))}
        </div>
        <div style={{marginTop: '40px'}}>
          <button className="back-btn-tecnico" onClick={() => setVista('dashboard')}>
            <ArrowLeft size={16} /> Volver al Dashboard
          </button>
        </div>
      </div>
    );
  }

  // ==============================
  // VISTA PERSONAL DEL TÉCNICO
  // ==============================
  if (tecnicoActivo) {
    // Seguridad: un técnico solo puede ver su propia vista
    const esAdminOControl = puedeVerOtrosTecnicos(usuarioActual.rol);
    const puedeVerEsteTecnico = esAdminOControl || tecnicoActivo.nombre === usuarioActual.tecnicoNombre;
    if (!puedeVerEsteTecnico) {
      const miPerfil = TECNICOS.find(t => t.nombre === usuarioActual.tecnicoNombre);
      if (miPerfil) {
        setTimeout(() => setTecnicoActivo(miPerfil), 0);
      } else {
        setTimeout(() => setTecnicoActivo(null), 0);
      }
      return null;
    }

    const misProyectos = proyectos.filter(p =>
      p.nombreArquitecto === tecnicoActivo.nombre || p.nombreIngeniero === tecnicoActivo.nombre
    );

    const clasificarProyecto = (p) => {
      const estado = getEstadoFlujo(p);
      const esArq = p.nombreArquitecto === tecnicoActivo.nombre;
      const esIng = p.nombreIngeniero === tecnicoActivo.nombre;

      if (['EXPEDIDO', 'DESISTIDO', 'PENDIENTE', 'NEGADO', 'PAGOS'].includes(estado)) return 'entregados';

      if (esArq) {
        if (ESTADOS_REVISION_ARQ.includes(estado)) return 'activos';
        if (ESTADOS_REVISION_ESTR.includes(estado) || estado === 'ACTA_OBS') return 'entregados';
        if (estado === 'PENDIENTE_LDF') return 'vienen';
      }

      if (esIng) {
        if (ESTADOS_REVISION_ESTR.includes(estado)) return 'activos';
        if (ESTADOS_REVISION_ARQ.includes(estado) || estado === 'PENDIENTE_LDF') return 'vienen';
        if (estado === 'ACTA_OBS') return 'entregados';
      }

      return 'vienen';
    };

    const proyectosVienen = misProyectos.filter(p => clasificarProyecto(p) === 'vienen');
    const proyectosActivos = misProyectos.filter(p => clasificarProyecto(p) === 'activos');
    const proyectosEntregados = misProyectos.filter(p => clasificarProyecto(p) === 'entregados');

    const misEstrategicos = misProyectos.filter(p => p.estrategico);
    const misAprobados = misProyectos.filter(p => getEstadoFlujo(p) === 'EXPEDIDO').length;
    const miTasa = misProyectos.length > 0 ? Math.round((misAprobados / misProyectos.length) * 100) : 0;
    const misSinFecha = proyectosActivos.filter(p => !getFechaLimiteEtapa(p)).length;

    const proyectosMostrar = tabTecnico === 'vienen' ? proyectosVienen :
                            tabTecnico === 'activos' ? proyectosActivos : proyectosEntregados;

    const proyectosOrdenados = [...proyectosMostrar].sort((a, b) => {
      if (a.estrategico !== b.estrategico) return b.estrategico ? 1 : -1;
      const fechaA = getFechaLimiteEtapa(a) || excelDateToDate(a.maximaLegal);
      const fechaB = getFechaLimiteEtapa(b) || excelDateToDate(b.maximaLegal);
      if (!fechaA) return 1;
      if (!fechaB) return -1;
      return fechaA - fechaB;
    });

    return (
      <div className="vista-tecnico">
        <style>{STYLES}</style>
        <div className="vista-tecnico-header">
          <div className="vista-tecnico-title">
            <h2>🏛 Curaduría Urbana N.° 2</h2>
            <p>Pereira · Vista Técnico</p>
          </div>
          <div style={{display:'flex', gap:'10px', alignItems:'center', flexWrap:'wrap'}}>
            {esAdminOControl && (
              <button className="btn-primary" onClick={() => setTecnicoActivo(null)}>
                ← Cambiar técnico
              </button>
            )}
            {!esAdminOControl && (
              <button className="btn-primary" style={{background:'#616161'}} onClick={() => { setTecnicoActivo(null); setVista('dashboard'); }}>
                <Home size={14} style={{display:'inline', marginRight:'4px'}} /> Ir al Dashboard
              </button>
            )}
            <button className="btn-primary" style={{background:'#616161'}} onClick={cerrarSesion}>
              <LogOut size={14} style={{display:'inline', marginRight:'4px'}} /> Cerrar sesión
            </button>
          </div>
        </div>

        <h2 style={{fontSize:'26px', marginBottom:'5px'}}>Mis Proyectos — {tecnicoActivo.nombre}</h2>
        <p style={{color:'#666', marginBottom:'25px'}}>{tecnicoActivo.rol}</p>

        <div className="tecnico-stats">
          <div className="tecnico-stat red"><div className="num">{misProyectos.length}</div><div className="label">Total</div></div>
          <div className="tecnico-stat gold"><div className="num">{misEstrategicos.length}</div><div className="label">⭐ Estratégicos</div></div>
          <div className="tecnico-stat blue"><div className="num">{proyectosVienen.length}</div><div className="label">📥 Vienen</div></div>
          <div className="tecnico-stat orange"><div className="num">{proyectosActivos.length}</div><div className="label">🔥 Activos</div></div>
          <div className="tecnico-stat green"><div className="num">{proyectosEntregados.length}</div><div className="label">✅ Entregados</div></div>
          <div className="tecnico-stat purple"><div className="num">{miTasa}%</div><div className="label">% Aprobación</div></div>
        </div>

        <div className="tabs-tecnico">
          <button className={`tab-tecnico ${tabTecnico === 'vienen' ? 'active' : ''}`} onClick={() => setTabTecnico('vienen')}>
            <Inbox size={16} /> Vienen para mí <span className="count">{proyectosVienen.length}</span>
          </button>
          <button className={`tab-tecnico ${tabTecnico === 'activos' ? 'active' : ''}`} onClick={() => setTabTecnico('activos')}>
            <Flame size={16} /> Activos conmigo <span className="count">{proyectosActivos.length}</span>
          </button>
          <button className={`tab-tecnico ${tabTecnico === 'entregados' ? 'active' : ''}`} onClick={() => setTabTecnico('entregados')}>
            <Send size={16} /> Entregados <span className="count">{proyectosEntregados.length}</span>
          </button>
        </div>

        {tabTecnico === 'vienen' && proyectosVienen.length > 0 && (
          <div style={{background: '#e3f2fd', border: '1px solid #90caf9', borderRadius: '8px', padding: '15px 20px', marginBottom: '20px', color: '#1565c0'}}>
            📥 <strong>{proyectosVienen.length} proyectos vienen para ti</strong><br/>
            <span style={{fontSize:'13px'}}>Estos proyectos están en manos de otro técnico y llegarán pronto a tu revisión.</span>
          </div>
        )}

        {tabTecnico === 'activos' && misSinFecha > 0 && (
          <div style={{background: '#eceff1', border: '1px solid #b0bec5', borderRadius: '8px', padding: '15px 20px', marginBottom: '20px', color: '#37474f'}}>
            🗓 <strong>{misSinFecha} {misSinFecha === 1 ? 'proyecto activo no tiene' : 'proyectos activos no tienen'} fecha de inicio de revisión en el Excel</strong><br/>
            <span style={{fontSize:'13px'}}>Sin esa fecha no se puede calcular el vencimiento. Diligénciala en el Excel para que el semáforo funcione.</span>
          </div>
        )}

        {tabTecnico === 'activos' && misEstrategicos.filter(p => clasificarProyecto(p) === 'activos').length > 0 && (
          <div className="info-panel">
            ⭐ <strong>Tienes {misEstrategicos.filter(p => clasificarProyecto(p) === 'activos').length} proyectos estratégicos activos</strong><br/>
            <span style={{fontSize:'13px'}}>Estos aparecen primero. Tienen prioridad de revisión.</span>
          </div>
        )}

        {proyectosOrdenados.length === 0 && (
          <div style={{textAlign:'center', padding:'60px', color:'#999', background:'white', borderRadius:'12px'}}>
            No hay proyectos en esta sección
          </div>
        )}

        {proyectosOrdenados.map(p => {
          const key = `${tecnicoActivo.nombre}_${p.radicado}`;
          const nota = notasPersonales[key] || '';
          const estadoActual = getEstadoFlujo(p);
          const estadoInfo = ESTADOS_FLUJO[estadoActual];
          const estaEnRevision = ESTADOS_REVISION.includes(estadoActual);

          const infoV = getInfoVuelta(p);
          const diasEtapa = infoV ? infoV.diasRestantes : null;
          const fechaMaxLegal = excelDateToDate(p.maximaLegal);
          const diasLegal = diasEntreFechas(fechaMaxLegal);

          let semaforoEtapa = 'verde';
          if (diasEtapa !== null && estaEnRevision) {
            if (diasEtapa < 0) semaforoEtapa = 'rojo';
            else if (diasEtapa <= 2) semaforoEtapa = 'amarillo';
          }

          let urgencia = 'ok';
          if (estaEnRevision && infoV && infoV.sinFechaInicio) urgencia = 'sinfecha';
          else if (estaEnRevision && diasEtapa !== null && diasEtapa < 0) urgencia = 'urgente';
          else if (estaEnRevision && diasEtapa !== null && diasEtapa <= 2) urgencia = 'pronto';

          const limiteRespuestaActa = p.actaFechaAmpliacion || p.actaFechaLimite;

          return (
            <div key={p.radicado} className={`proyecto-tecnico ${urgencia}`}>
              <div className="proyecto-tecnico-info">
                <div className="proyecto-tecnico-header">
                  {p.estrategico && <Star size={20} fill="#f9a825" color="#f9a825" />}
                  <div className="proyecto-tecnico-radicado">{p.radicado}</div>
                  <span className="estado-badge" style={{background: estadoInfo?.bg, color: estadoInfo?.color}}>
                    {estadoInfo?.icon} {estadoInfo?.label}
                  </span>
                  {estaEnRevision && infoV && infoV.sinFechaInicio && (
                    <span className="semaforo-mini gris">
                      <Clock size={12} /> Sin fecha de inicio
                    </span>
                  )}
                  {estaEnRevision && diasEtapa !== null && (
                    <span className={`semaforo-mini ${semaforoEtapa}`}>
                      <Clock size={12} />
                      {diasEtapa < 0 ? `${Math.abs(diasEtapa)}d vencido` : `${diasEtapa}d restantes`}
                    </span>
                  )}
                </div>

                <div className="proyecto-info-row">
                  <div className="info-item"><strong>Arquitecto:</strong> {p.nombreArquitecto || '-'}</div>
                  <div className="info-item"><strong>Ingeniero:</strong> {p.nombreIngeniero || '-'}</div>
                </div>

                <div className="proyecto-info-row">
                  <div className="info-item"><strong>Fecha LDF:</strong> {formatoFechaLarga(p.fechaLegal) || 'Sin fecha'}</div>
                  <div className="info-item"><strong>Plazo Legal:</strong> {p.maximaLegal || 'Sin fecha'}
                    {diasLegal !== null && !ESTADOS_REVISION.includes(estadoActual) && !['ACTA_OBS','EXPEDIDO','DESISTIDO','PENDIENTE','NEGADO','PAGOS'].includes(estadoActual) && (
                      diasLegal < 0
                        ? <span style={{color:'#c62828'}}> (Vencido {Math.abs(diasLegal)}d)</span>
                        : <span style={{color:'#388e3c'}}> ({diasLegal}d restantes)</span>
                    )}
                    {diasLegal !== null && estaEnRevision && (
                      <span style={{color:'#388e3c'}}> ✓ En revisión</span>
                    )}
                    {estadoActual === 'ACTA_OBS' && (
                      <span style={{color:'#f57c00'}}> ⏸ Términos suspendidos</span>
                    )}
                  </div>
                </div>

                {estadoActual === 'ACTA_OBS' && (p.actaObservaciones || limiteRespuestaActa) && (
                  <div className="proyecto-info-row">
                    {p.actaObservaciones && (
                      <div className="info-item"><strong>Acta notificada:</strong> {formatoFechaLarga(p.actaObservaciones)}</div>
                    )}
                    {limiteRespuestaActa && (
                      <div className="info-item">
                        <strong>Límite respuesta cliente:</strong> {formatoFechaLarga(limiteRespuestaActa)}
                        {p.actaFechaAmpliacion && <span style={{color:'#7b1fa2'}}> (con ampliación)</span>}
                      </div>
                    )}
                  </div>
                )}

                {estaEnRevision && infoV && (
                  <div className="vuelta-info">
                    <span className="vuelta-chip">{ORDINAL_VUELTA[infoV.vuelta]} vuelta</span>
                    <span>
                      <strong>{infoV.etiquetaInicio}:</strong>{' '}
                      {infoV.fechaInicio ? formatoFechaLarga(infoV.fechaInicio) : <span style={{color:'#c62828'}}>Sin registrar en el Excel</span>}
                    </span>
                    {infoV.fechaLimite && (
                      <span><strong>Vence:</strong> {formatoFechaLarga(formatoFechaCorta(infoV.fechaLimite))}</span>
                    )}
                    {infoV.campoEntrega && (
                      <span>
                        <strong>{infoV.etiquetaEntrega}:</strong>{' '}
                        {infoV.fechaEntrega ? formatoFechaLarga(infoV.fechaEntrega) : 'Sin fecha'}
                      </span>
                    )}
                  </div>
                )}

                {nota && (
                  <div className="nota-personal">
                    <strong>📝 Mi nota:</strong> {nota}
                  </div>
                )}
              </div>

              <div className="proyecto-tecnico-actions">
                <label style={{fontSize:'12px', color:'#666', marginBottom:'2px'}}>Cambiar estado:</label>
                <select
                  className="estado-selector"
                  value={estadoActual}
                  onChange={(e) => cambiarEstadoFlujo(p.radicado, e.target.value)}
                >
                  {Object.entries(ESTADOS_FLUJO).map(([k, info]) => (
                    <option key={k} value={k}>{info.icon} {info.label}</option>
                  ))}
                  <option value="AUTO">🔄 Restaurar automático</option>
                </select>

                <button
                  className="btn-nota"
                  onClick={() => {
                    const nueva = prompt('Escribe tu nota personal:', nota);
                    if (nueva !== null) guardarNota(p.radicado, tecnicoActivo.nombre, nueva);
                  }}
                >
                  <StickyNote size={14} style={{display:'inline', marginRight:'4px'}} />
                  {nota ? 'Editar nota' : 'Agregar nota'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
    // ==============================
  // DASHBOARD PRINCIPAL
  // ==============================
  const proyectosFiltrados = proyectos.filter(p => {
    if (!busqueda) return true;
    const b = busqueda.toLowerCase();
    return String(p.radicado).toLowerCase().includes(b) ||
           (p.nombreArquitecto || '').toLowerCase().includes(b) ||
           (p.nombreIngeniero || '').toLowerCase().includes(b) ||
           (ESTADOS_FLUJO[getEstadoFlujo(p)]?.label || '').toLowerCase().includes(b);
  });

  // Si la vista actual está restringida para el rol, forzar dashboard
  const vistaEfectiva = puedeVer(usuarioActual.rol, vista) ? vista : 'dashboard';

  return (
    <div className="app">
      <style>{STYLES + STYLES_TV}</style>
      <div className="header">
        <h1>Dashboard Curaduría 2 Pereira</h1>
        <div className="header-buttons">
          <div className="header-user">
            <div className="header-user-avatar">{inicialesUsuario(usuarioActual.nombre)}</div>
            <div className="header-user-info">
              <div className="header-user-name">{usuarioActual.nombre}</div>
              <div className="header-user-role">{labelRol(usuarioActual.rol)}</div>
            </div>
          </div>
          <button className="header-btn" onClick={cargarDatos}>
            <RefreshCw size={16} /> Actualizar
          </button>
          <button className="header-btn" onClick={() => setVista('ingreso')}>
            <LogIn size={16} /> {usuarioActual.rol === 'tecnico' ? 'Mi Panel' : 'Ingreso de Técnico'}
          </button>
          <button className="header-btn" onClick={() => setModoTV(true)}>
            <Tv size={16} /> Modo TV
          </button>
          <button className="header-btn" onClick={cerrarSesion} style={{background:'rgba(255,255,255,0.15)'}}>
            <LogOut size={16} /> Salir
          </button>
        </div>
        <button className="menu-toggle" onClick={() => setMenuAbierto(!menuAbierto)}>
          ☰
        </button>
      </div>
      <div className={`menu-mobile ${menuAbierto ? 'open' : ''}`}>
        <div className="header-user">
          <div className="header-user-avatar">{inicialesUsuario(usuarioActual.nombre)}</div>
          <div className="header-user-info">
            <div className="header-user-name">{usuarioActual.nombre}</div>
            <div className="header-user-role">{labelRol(usuarioActual.rol)}</div>
          </div>
        </div>
        <button className="header-btn" onClick={() => { cargarDatos(); setMenuAbierto(false); }}>
          <RefreshCw size={16} /> Actualizar
        </button>
        <button className="header-btn" onClick={() => { setVista('ingreso'); setMenuAbierto(false); }}>
          <LogIn size={16} /> {usuarioActual.rol === 'tecnico' ? 'Mi Panel' : 'Ingreso de Técnico'}
        </button>
        <button className="header-btn" onClick={() => { setModoTV(true); setMenuAbierto(false); }}>
          <Tv size={16} /> Modo TV
        </button>
        <button className="header-btn" onClick={() => { cerrarSesion(); setMenuAbierto(false); }}>
          <LogOut size={16} /> Cerrar sesión
        </button>
      </div>

      <div className="nav">
        <button className={`nav-btn ${vistaEfectiva === 'dashboard' ? 'active' : ''}`} onClick={() => setVista('dashboard')}>
          <Home size={16} /> Dashboard
        </button>
        <button className={`nav-btn ${vistaEfectiva === 'estrategicos' ? 'active' : ''}`} onClick={() => setVista('estrategicos')}>
          <Star size={16} /> Estratégicos
        </button>
        <button className={`nav-btn ${vistaEfectiva === 'terminos' ? 'active' : ''}`} onClick={() => setVista('terminos')}>
          <Clock size={16} /> Términos
        </button>
        <button className={`nav-btn ${vistaEfectiva === 'proyectos' ? 'active' : ''}`} onClick={() => setVista('proyectos')}>
          <FileText size={16} /> Proyectos
        </button>
        <button className={`nav-btn ${vistaEfectiva === 'tecnicos' ? 'active' : ''}`} onClick={() => setVista('tecnicos')}>
          <Users size={16} /> Técnicos
        </button>
        <button className={`nav-btn ${vistaEfectiva === 'historial' ? 'active' : ''}`} onClick={() => setVista('historial')}>
          <History size={16} /> Historial
        </button>
        {puedeVer(usuarioActual.rol, 'estadisticas') && (
          <button className={`nav-btn ${vistaEfectiva === 'estadisticas' ? 'active' : ''}`} onClick={() => setVista('estadisticas')}>
            <TrendingUp size={16} /> Estadísticas
          </button>
        )}
        {puedeVer(usuarioActual.rol, 'estadisticasEstrategicas') && (
          <button className={`nav-btn ${vistaEfectiva === 'estadisticasEstrategicas' ? 'active' : ''}`} onClick={() => setVista('estadisticasEstrategicas')}>
            <Star size={16} /> Estadísticas Estratégicas
          </button>
        )}
        <button className={`nav-btn ${vistaEfectiva === 'pendientes' ? 'active' : ''}`} onClick={() => setVista('pendientes')}>
          <StickyNote size={16} /> Pendientes
        </button>
        {puedeVer(usuarioActual.rol, 'pagos') && (
          <button className={`nav-btn ${vistaEfectiva === 'pagos' ? 'active' : ''}`} onClick={() => setVista('pagos')}>
            <FileText size={16} /> Pagos
          </button>
        )}
        {puedeVerFinanzas(usuarioActual) && (
          <button className={`nav-btn ${vistaEfectiva === 'finanzas' ? 'active' : ''}`} onClick={() => setVista('finanzas')}>
            <Lock size={16} /> Ingresos y Finanzas
          </button>
        )}
      </div>

      <div className="content">
        {loading && vistaEfectiva !== 'finanzas' && <div className="loading">Cargando datos del Excel...</div>}
        {error && vistaEfectiva !== 'finanzas' && <div className="error-msg">Error: {error}</div>}

        {!loading && !error && vistaEfectiva === 'dashboard' && (
          <>
            <div className="stats-grid">
              <div className="stat-card"><h3>Total Radicados 2026</h3><div className="value">{totalProyectos}</div></div>
              <div className="stat-card info"><h3>⭐ Estratégicos</h3><div className="value">{proyectosEstrategicos}</div></div>
              <div className="stat-card info"><h3>En Revisión</h3><div className="value">{enEstudio}</div></div>
              <div className="stat-card success"><h3>Expedidos</h3><div className="value">{aprobados}</div></div>
              <div className="stat-card warning"><h3>Observaciones</h3><div className="value">{observaciones}</div></div>
              <div className="stat-card warning"><h3>Sin L.D.F</h3><div className="value">{sinLDF}</div></div>
              <div className="stat-card warning"><h3>⚠ Vencidos</h3><div className="value">{vencidos.length}</div></div>
              <div className="stat-card gray"><h3>🗓 Sin fecha de inicio</h3><div className="value">{sinFechaInicio.length}</div></div>
              <div className="stat-card success"><h3>% Aprobación</h3><div className="value">{tasaAprobacion}%</div></div>
              <div className="stat-card"><h3>⏸️ Pendientes</h3><div className="value">{pendientes}</div></div>
              {puedeVer(usuarioActual.rol, 'pagos') && (
                <div className="stat-card info"><h3>💰 En Pagos</h3><div className="value">{enPagos}</div></div>
              )}
              <div className="stat-card warning"><h3>🚫 Negados</h3><div className="value">{negados}</div></div>
              <div className="stat-card"><h3>❌ Desistidos</h3><div className="value">{desistidos}</div></div>
            </div>
            <div className="charts-grid">
              <div className="chart-card">
                <h3>Distribución por Estado</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={[
                      {name:'Expedido',value:aprobados,color:'#388e3c'},
                      {name:'En Revisión',value:enEstudio,color:'#1976d2'},
                      {name:'Observaciones',value:observaciones,color:'#f57c00'},
                      {name:'Sin L.D.F',value:sinLDF,color:'#f9a825'},
                      {name:'Pendientes',value:pendientes,color:'#616161'},
                      {name:'Pagos',value:enPagos,color:'#00838f'},
                      {name:'Negados',value:negados,color:'#c62828'},
                      {name:'Desistidos',value:desistidos,color:'#757575'}
                    ].filter(d=>d.value>0)} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={(e)=>`${e.name}: ${e.value}`}>
                      {[
                        {name:'Expedido',value:aprobados,color:'#388e3c'},
                        {name:'En Revisión',value:enEstudio,color:'#1976d2'},
                        {name:'Observaciones',value:observaciones,color:'#f57c00'},
                        {name:'Sin L.D.F',value:sinLDF,color:'#f9a825'},
                        {name:'Pendientes',value:pendientes,color:'#616161'},
                        {name:'Pagos',value:enPagos,color:'#00838f'},
                        {name:'Negados',value:negados,color:'#c62828'},
                        {name:'Desistidos',value:desistidos,color:'#757575'}
                      ].filter(d=>d.value>0).map((e,i)=><Cell key={i} fill={e.color} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="chart-card">
                <h3>Últimos Movimientos</h3>
                <div style={{maxHeight:'300px', overflowY:'auto'}}>
                  {ultimosMovimientos().map((m,i)=>(
                    <div key={i} style={{padding:'10px 0', borderBottom:'1px solid #f0f0f0', display:'flex', gap:'10px', alignItems:'center', fontSize:'13px'}}>
                      {m.estrategico && <Star size={14} fill="#f9a825" color="#f9a825" />}
                      <strong style={{color:'#c62828'}}>{m.radicado}</strong>
                      <span className="badge blue">{m.tipo}</span>
                      <span style={{flex:1}}>{m.tecnico}</span>
                      <span style={{color:'#999', fontSize:'11px'}}>{m.fechaStr}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {!loading && !error && vistaEfectiva === 'estrategicos' && (
          <>
            <h2 style={{marginBottom:'20px'}}>⭐ Proyectos Estratégicos ({proyectosEstrategicos})</h2>
            <div className="table">
              <table>
                <thead><tr><th>Radicado</th><th>Fecha Rad.</th><th>Estado</th><th>Arquitecto</th><th>Ingeniero</th><th>Máx. Legal</th></tr></thead>
                <tbody>
                  {proyectos.filter(p=>p.estrategico).map(p=>{
                    const estado = getEstadoFlujo(p);
                    const info = ESTADOS_FLUJO[estado];
                    return (
                      <tr key={p.radicado}>
                        <td><strong>{p.radicado}</strong></td>
                        <td>{p.fechaRadicacion}</td>
                        <td><span className="estado-badge" style={{background: info?.bg, color: info?.color}}>{info?.icon} {info?.label}</span></td>
                        <td>{p.nombreArquitecto||'-'}</td>
                        <td>{p.nombreIngeniero||'-'}</td>
                        <td>{p.maximaLegal}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
                {!loading && !error && vistaEfectiva === 'terminos' && (() => {
          // Proyectos en revisión, ordenados: vencidos primero, luego por fecha límite, y sin fecha al final
          const enRevision = proyectos
            .filter(p => ESTADOS_REVISION.includes(getEstadoFlujo(p)))
            .map(p => ({ p, infoV: getInfoVuelta(p) }))
            .sort((a, b) => {
              const fa = a.infoV?.fechaLimite;
              const fb = b.infoV?.fechaLimite;
              if (!fa && !fb) return 0;
              if (!fa) return 1;
              if (!fb) return -1;
              return fa - fb;
            });

          return (
            <>
              <h2 style={{marginBottom:'20px'}}>⏰ Términos por Vuelta de Revisión</h2>
              <div className="info-panel" style={{marginBottom:'20px'}}>
                ⏰ <strong>Cálculo de vencimiento</strong><br/>
                <span style={{fontSize:'13px'}}>
                  <strong>1ra vuelta:</strong> arquitectura 9 días hábiles desde LDF · estructural 18 días hábiles desde LDF.<br/>
                  <strong>2da, 3ra y 4ta vuelta:</strong> 9 días hábiles desde la fecha en que el profesional inicia esa revisión
                  (arquitectura: columnas AA / AB / AC · estructural: columnas AJ / AK / AL).<br/>
                  Si la fecha de inicio no está registrada en el Excel, el proyecto aparece como <strong>"Sin fecha de inicio"</strong> y no se cuenta como vencido.
                </span>
              </div>
              <div className="stats-grid" style={{marginBottom:'20px'}}>
                <div className="stat-card info"><h3>En revisión</h3><div className="value">{enRevision.length}</div></div>
                <div className="stat-card warning"><h3>⚠ Vencidos</h3><div className="value">{vencidos.length}</div></div>
                <div className="stat-card gray"><h3>🗓 Sin fecha de inicio</h3><div className="value">{sinFechaInicio.length}</div></div>
              </div>
              <div className="table">
                <table>
                  <thead>
                    <tr>
                      <th>Radicado</th>
                      <th>Estado</th>
                      <th>Vuelta</th>
                      <th>Inicio revisión</th>
                      <th>Fecha límite</th>
                      <th>Días hábiles</th>
                      <th>Profesional</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enRevision.length === 0 && (
                      <tr><td colSpan="7" style={{textAlign:'center', padding:'40px', color:'#999'}}>No hay proyectos en revisión</td></tr>
                    )}
                    {enRevision.map(({ p, infoV }) => {
                      const estado = getEstadoFlujo(p);
                      const info = ESTADOS_FLUJO[estado];
                      const profesional = infoV?.area === 'estr' ? p.nombreIngeniero : p.nombreArquitecto;
                      let badge = 'gray';
                      let texto = 'Sin fecha de inicio';
                      if (infoV && infoV.fechaLimite) {
                        const dias = infoV.diasRestantes;
                        texto = `${dias} días`;
                        badge = 'green';
                        if (dias < 0) { badge = 'red'; texto = `Vencido ${Math.abs(dias)}d`; }
                        else if (dias <= 2) badge = 'red';
                        else if (dias <= 5) badge = 'orange';
                      }
                      return (
                        <tr key={p.radicado}>
                          <td>
                            {p.estrategico && <Star size={14} fill="#f9a825" color="#f9a825" style={{marginRight:'4px', verticalAlign:'middle'}} />}
                            <strong>{p.radicado}</strong>
                          </td>
                          <td><span className="estado-badge" style={{background: info?.bg, color: info?.color}}>{info?.icon} {info?.label}</span></td>
                          <td>{infoV ? `${ORDINAL_VUELTA[infoV.vuelta]}` : '-'}</td>
                          <td>{infoV && infoV.fechaInicio ? infoV.fechaInicio : <span style={{color:'#c62828'}}>—</span>}</td>
                          <td>{infoV && infoV.fechaLimite ? formatoFechaCorta(infoV.fechaLimite) : '—'}</td>
                          <td><span className={`badge ${badge}`}>{texto}</span></td>
                          <td>{profesional || '-'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          );
        })()}

        {!loading && !error && vistaEfectiva === 'proyectos' && (
          <>
            <div className="search-box">
              <input type="text" className="search-input" placeholder="Buscar por radicado, técnico, estado..." value={busqueda} onChange={(e)=>setBusqueda(e.target.value)} />
            </div>
            <div className="table">
              <table>
                <thead><tr><th>⭐</th><th>Radicado</th><th>Fecha</th><th>Estado</th><th>Arquitecto</th><th>Ingeniero</th><th>Máx. Legal</th></tr></thead>
                <tbody>
                  {proyectosFiltrados.map(p=>{
                    const estado = getEstadoFlujo(p);
                    const info = ESTADOS_FLUJO[estado];
                    return (
                      <tr key={p.radicado}>
                        <td><button className="btn-star" onClick={()=>toggleEstrategico(p.radicado)}><Star size={20} fill={p.estrategico?'#ffc107':'none'} color={p.estrategico?'#ffc107':'#ccc'} /></button></td>
                        <td><strong>{p.radicado}</strong></td>
                        <td>{p.fechaRadicacion}</td>
                        <td><span className="estado-badge" style={{background: info?.bg, color: info?.color}}>{info?.icon} {info?.label}</span></td>
                        <td>{p.nombreArquitecto||'-'}</td>
                        <td>{p.nombreIngeniero||'-'}</td>
                        <td>{p.maximaLegal}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {!loading && !error && vistaEfectiva === 'tecnicos' && (
          <>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px', flexWrap:'wrap', gap:'15px'}}>
              <h2>Productividad del Equipo {filtroEstrategicosTecnicos && '⭐ (Solo Estratégicos)'}</h2>
              <button
                className={`filter-btn ${filtroEstrategicosTecnicos ? 'active' : ''}`}
                onClick={() => setFiltroEstrategicosTecnicos(!filtroEstrategicosTecnicos)}
              >
                <Star size={16} fill={filtroEstrategicosTecnicos ? 'white' : '#f9a825'} />
                {filtroEstrategicosTecnicos ? 'Ver Todos' : 'Solo Estratégicos'}
              </button>
            </div>

            {filtroEstrategicosTecnicos && (
              <div className="info-panel">
                ⭐ <strong>Mostrando solo proyectos estratégicos</strong><br/>
                <span style={{fontSize:'13px'}}>Las estadísticas de cada técnico reflejan únicamente sus proyectos marcados como estratégicos.</span>
              </div>
            )}

            <div className="stats-grid">
              {(() => {
                const prodTec = productividadEquipo(filtroEstrategicosTecnicos);
                return TECNICOS.map(t=>{
                  const s = prodTec[t.nombre]||{aprobados:0,revision:0,acta:0,desistidos:0,vencidos:0,total:0};
                  return (
                    <div key={t.nombre} className="stat-card">
                      <h3>{t.nombre}</h3>
                      <div style={{marginTop:'10px', fontSize:'14px', color:'#666'}}>
                        <div>✓ Aprobados: <strong style={{color:'#388e3c'}}>{s.aprobados}</strong></div>
                        <div>🔵 En Revisión: <strong style={{color:'#1976d2'}}>{s.revision}</strong></div>
                        <div>📝 En Acta: <strong style={{color:'#f57c00'}}>{s.acta}</strong></div>
                        <div>❌ Desistidos: <strong style={{color:'#c62828'}}>{s.desistidos}</strong></div>
                        <div>⚠ Vencidos: <strong style={{color:'#c62828'}}>{s.vencidos}</strong></div>
                        <div style={{marginTop:'8px', paddingTop:'8px', borderTop:'1px solid #f0f0f0'}}>Total: <strong>{s.total}</strong></div>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </>
        )}

        {!loading && !error && vistaEfectiva === 'historial' && (
          <>
            <h2 style={{marginBottom:'20px'}}>📜 Historial Completo de Movimientos</h2>
            <div className="table">
              <table>
                <thead><tr><th></th><th>Radicado</th><th>Movimiento</th><th>Técnico</th><th>Fecha</th></tr></thead>
                <tbody>
                  {ultimosMovimientos().map((m,i)=>(
                    <tr key={i}>
                      <td>{m.estrategico && <Star size={16} fill="#f9a825" color="#f9a825" />}</td>
                      <td><strong>{m.radicado}</strong></td>
                      <td><span className="badge blue">{m.tipo}</span></td>
                      <td>{m.tecnico}</td>
                      <td>{m.fechaStr}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {!loading && !error && vistaEfectiva === 'estadisticas' && puedeVer(usuarioActual.rol, 'estadisticas') && (
          <>
            <h2 style={{marginBottom:'20px'}}>📊 Estadísticas Mensuales 2026</h2>

            <div className="chart-card" style={{marginBottom:'20px'}}>
              <h3>Radicados vs Expedidos por Mes</h3>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={(() => {
                  const mesesCortos = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
                  const data = mesesCortos.map(m => ({ mes: m, radicados: 0, expedidos: 0 }));
                  proyectos.forEach(p => {
                    if (p.fechaRadicacion) {
                      const partes = p.fechaRadicacion.split('/');
                      if (partes.length === 3 && partes[2] === '2026') {
                        const mesIdx = parseInt(partes[1]) - 1;
                        if (mesIdx >= 0 && mesIdx < 12) data[mesIdx].radicados++;
                      }
                    }
                    if (getEstadoFlujo(p) === 'EXPEDIDO' && p.fechaRadicacion) {
                      const partes = p.fechaRadicacion.split('/');
                      if (partes.length === 3 && partes[2] === '2026') {
                        const mesIdx = parseInt(partes[1]) - 1;
                        if (mesIdx >= 0 && mesIdx < 12) data[mesIdx].expedidos++;
                      }
                    }
                  });
                  return data;
                })()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="radicados" fill="#c62828" name="Radicados" />
                  <Bar dataKey="expedidos" fill="#388e3c" name="Expedidos" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card" style={{marginBottom:'20px'}}>
              <h3>Resumen Detallado por Mes</h3>
              <div className="table" style={{boxShadow:'none'}}>
                <table>
                  <thead>
                    <tr>
                      <th>Mes</th>
                      <th>Radicados</th>
                      <th>Expedidos</th>
                      <th>Desistidos</th>
                      <th>En Observaciones</th>
                      <th>% Aprobación Mes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      const mesesLargos = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
                      return mesesLargos.map((nombreMes, idx) => {
                        const radicadosMes = proyectos.filter(p => {
                          if (!p.fechaRadicacion) return false;
                          const partes = p.fechaRadicacion.split('/');
                          return partes.length === 3 && partes[2] === '2026' && parseInt(partes[1]) - 1 === idx;
                        });
                        const expedidosMes = radicadosMes.filter(p => getEstadoFlujo(p) === 'EXPEDIDO').length;
                        const desistidosMes = radicadosMes.filter(p => getEstadoFlujo(p) === 'DESISTIDO').length;
                        const obsMes = radicadosMes.filter(p => getEstadoFlujo(p) === 'ACTA_OBS').length;
                        const tasaMes = radicadosMes.length > 0 ? Math.round((expedidosMes / radicadosMes.length) * 100) : 0;
                        if (radicadosMes.length === 0 && expedidosMes === 0) return null;
                        return (
                          <tr key={nombreMes}>
                            <td><strong>{nombreMes}</strong></td>
                            <td><span className="badge blue">{radicadosMes.length}</span></td>
                            <td><span className="badge green">{expedidosMes}</span></td>
                            <td><span className="badge gray">{desistidosMes}</span></td>
                            <td><span className="badge orange">{obsMes}</span></td>
                            <td><strong style={{color: tasaMes >= 50 ? '#388e3c' : tasaMes >= 30 ? '#f57c00' : '#c62828'}}>{tasaMes}%</strong></td>
                          </tr>
                        );
                      });
                    })()}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <h3>Promedio Radicados/Mes</h3>
                <div className="value">{(() => {
                  const mesesActivos = new Set();
                  proyectos.forEach(p => {
                    if (p.fechaRadicacion) {
                      const partes = p.fechaRadicacion.split('/');
                      if (partes.length === 3 && partes[2] === '2026') mesesActivos.add(partes[1]);
                    }
                  });
                  return mesesActivos.size > 0 ? Math.round(totalProyectos / mesesActivos.size) : 0;
                })()}</div>
              </div>
              <div className="stat-card success">
                <h3>Promedio Expedidos/Mes</h3>
                <div className="value">{(() => {
                  const mesesActivos = new Set();
                  proyectos.forEach(p => {
                    if (getEstadoFlujo(p) === 'EXPEDIDO' && p.fechaRadicacion) {
                      const partes = p.fechaRadicacion.split('/');
                      if (partes.length === 3 && partes[2] === '2026') mesesActivos.add(partes[1]);
                    }
                  });
                  return mesesActivos.size > 0 ? Math.round(aprobados / mesesActivos.size) : 0;
                })()}</div>
              </div>
              <div className="stat-card info">
                <h3>Mes con Más Radicados</h3>
                <div className="value" style={{fontSize:'22px'}}>{(() => {
                  const mesesCortos = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
                  const conteos = new Array(12).fill(0);
                  proyectos.forEach(p => {
                    if (p.fechaRadicacion) {
                      const partes = p.fechaRadicacion.split('/');
                      if (partes.length === 3 && partes[2] === '2026') {
                        const idx = parseInt(partes[1]) - 1;
                        if (idx >= 0 && idx < 12) conteos[idx]++;
                      }
                    }
                  });
                  const max = Math.max(...conteos);
                  const idx = conteos.indexOf(max);
                  return max > 0 ? `${mesesCortos[idx]} (${max})` : '-';
                })()}</div>
              </div>
              <div className="stat-card success">
                <h3>Tasa Aprobación Anual</h3>
                <div className="value">{tasaAprobacion}%</div>
              </div>
            </div>
          </>
        )}
                {!loading && !error && vistaEfectiva === 'estadisticasEstrategicas' && puedeVer(usuarioActual.rol, 'estadisticasEstrategicas') && (() => {
          const proyEstrat = proyectos.filter(p => p.estrategico);
          const totalEstrat = proyEstrat.length;
          const expedEstrat = proyEstrat.filter(p => getEstadoFlujo(p) === 'EXPEDIDO').length;
          const revEstrat = proyEstrat.filter(p => ESTADOS_REVISION.includes(getEstadoFlujo(p))).length;
          const actaEstrat = proyEstrat.filter(p => getEstadoFlujo(p) === 'ACTA_OBS').length;
          const desistEstrat = proyEstrat.filter(p => getEstadoFlujo(p) === 'DESISTIDO').length;
          const vencEstrat = vencidos.filter(p => p.estrategico).length;
          const sinFechaEstrat = sinFechaInicio.filter(p => p.estrategico).length;
          const tasaEstrat = totalEstrat > 0 ? Math.round((expedEstrat / totalEstrat) * 100) : 0;
          const prodEstrategica = productividadEquipo(true);
          return (
            <>
              <h2 style={{marginBottom:'20px'}}>⭐ Estadísticas de Proyectos Estratégicos</h2>
              <div className="info-panel" style={{marginBottom:'25px'}}>
                ⭐ <strong>Análisis exclusivo de {totalEstrat} proyectos estratégicos</strong><br/>
                <span style={{fontSize:'13px'}}>Todos los indicadores mostrados reflejan únicamente los proyectos marcados como estratégicos.</span>
              </div>
              <h3 style={{marginBottom:'15px', color:'#333'}}>📊 Resumen General</h3>
              <div className="stats-grid">
                <div className="stat-card gold"><h3>Total Estratégicos</h3><div className="value">{totalEstrat}</div></div>
                <div className="stat-card success"><h3>Expedidos</h3><div className="value">{expedEstrat}</div></div>
                <div className="stat-card info"><h3>En Revisión</h3><div className="value">{revEstrat}</div></div>
                <div className="stat-card warning"><h3>En Observaciones</h3><div className="value">{actaEstrat}</div></div>
                <div className="stat-card"><h3>Desistidos</h3><div className="value">{desistEstrat}</div></div>
                <div className="stat-card warning"><h3>⚠ Vencidos</h3><div className="value">{vencEstrat}</div></div>
                <div className="stat-card gray"><h3>🗓 Sin fecha de inicio</h3><div className="value">{sinFechaEstrat}</div></div>
                <div className="stat-card success"><h3>% Aprobación</h3><div className="value">{tasaEstrat}%</div></div>
              </div>
              <h3 style={{marginBottom:'15px', color:'#333', marginTop:'30px'}}>🏆 Productividad por Técnico</h3>
              <div className="stats-grid">
                {TECNICOS.map(t => {
                  const s = prodEstrategica[t.nombre] || {aprobados:0, revision:0, acta:0, desistidos:0, vencidos:0, total:0};
                  const tasaTec = s.total > 0 ? Math.round((s.aprobados / s.total) * 100) : 0;
                  return (
                    <div key={t.nombre} className="stat-card">
                      <h3>{t.nombre}</h3>
                      <div style={{marginTop:'10px', fontSize:'14px', color:'#666'}}>
                        <div>⭐ Total Estratégicos: <strong style={{color:'#f9a825'}}>{s.total}</strong></div>
                        <div>✓ Expedidos: <strong style={{color:'#388e3c'}}>{s.aprobados}</strong></div>
                        <div>🔵 En Revisión: <strong style={{color:'#1976d2'}}>{s.revision}</strong></div>
                        <div>📝 En Acta: <strong style={{color:'#f57c00'}}>{s.acta}</strong></div>
                        <div>❌ Desistidos: <strong style={{color:'#c62828'}}>{s.desistidos}</strong></div>
                        <div>⚠ Vencidos: <strong style={{color:'#c62828'}}>{s.vencidos}</strong></div>
                        <div style={{marginTop:'8px', paddingTop:'8px', borderTop:'1px solid #f0f0f0'}}>
                          % Aprobación: <strong style={{color: tasaTec >= 50 ? '#388e3c' : tasaTec >= 30 ? '#f57c00' : '#c62828'}}>{tasaTec}%</strong>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <h3 style={{marginBottom:'15px', color:'#333', marginTop:'30px'}}>⏱ Eficiencia por Técnico (Estratégicos vs General)</h3>
              <div className="table">
                <table>
                  <thead>
                    <tr>
                      <th>Técnico</th>
                      <th>Tiempo prom. Radicación → Expedición</th>
                      <th>Tiempo prom. hasta 1ra Acta</th>
                      <th>Tiempo prom. respuesta a Acta</th>
                    </tr>
                  </thead>
                  <tbody>
                    {TECNICOS.map(t => {
                      const efE = calcularEficiencia(t.nombre, true);
                      const efG = calcularEficiencia(t.nombre, false);
                      const compExp = efE.expedicion !== null && efG.expedicion !== null
                        ? (efE.expedicion - efG.expedicion) : null;
                      return (
                        <tr key={t.nombre}>
                          <td><strong>{t.nombre}</strong></td>
                          <td>
                            {efE.expedicion !== null ? (
                              <>
                                <strong>{efE.expedicion}d</strong> hábiles
                                <span style={{color:'#999', fontSize:'11px', marginLeft:'6px'}}>({efE.totalExpediciones} exped.)</span>
                                {compExp !== null && compExp !== 0 && (
                                  <div style={{fontSize:'11px', marginTop:'4px', color: compExp < 0 ? '#388e3c' : '#c62828'}}>
                                    {compExp < 0 ? '↓' : '↑'} {Math.abs(compExp)}d vs general ({efG.expedicion}d)
                                  </div>
                                )}
                              </>
                            ) : <span style={{color:'#999'}}>Sin datos</span>}
                          </td>
                          <td>
                            {efE.acta !== null ? (
                              <>
                                <strong>{efE.acta}d</strong> hábiles
                                <span style={{color:'#999', fontSize:'11px', marginLeft:'6px'}}>({efE.totalActas} actas)</span>
                              </>
                            ) : <span style={{color:'#999'}}>Sin datos</span>}
                          </td>
                          <td>
                            {efE.respuesta !== null ? (
                              <><strong>{efE.respuesta}d</strong> hábiles</>
                            ) : <span style={{color:'#999'}}>Sin datos</span>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <h3 style={{marginBottom:'15px', color:'#333', marginTop:'30px'}}>📈 Radicados vs Expedidos Estratégicos por Mes</h3>
              <div className="chart-card">
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={(() => {
                    const mesesCortos = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
                    const data = mesesCortos.map(m => ({ mes: m, radicados: 0, expedidos: 0 }));
                    proyEstrat.forEach(p => {
                      if (p.fechaRadicacion) {
                        const partes = p.fechaRadicacion.split('/');
                        if (partes.length === 3 && partes[2] === '2026') {
                          const mesIdx = parseInt(partes[1]) - 1;
                          if (mesIdx >= 0 && mesIdx < 12) data[mesIdx].radicados++;
                        }
                      }
                      if (getEstadoFlujo(p) === 'EXPEDIDO' && p.fechaRadicacion) {
                        const partes = p.fechaRadicacion.split('/');
                        if (partes.length === 3 && partes[2] === '2026') {
                          const mesIdx = parseInt(partes[1]) - 1;
                          if (mesIdx >= 0 && mesIdx < 12) data[mesIdx].expedidos++;
                        }
                      }
                    });
                    return data;
                  })()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="radicados" fill="#f9a825" name="Radicados Estratégicos" />
                    <Bar dataKey="expedidos" fill="#388e3c" name="Expedidos Estratégicos" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          );
        })()}

        {!loading && !error && vistaEfectiva === 'pendientes' && (() => {
          const proyectosPendientes = proyectos.filter(p => getEstadoFlujo(p) === 'PENDIENTE');
          const pendientesEstrat = proyectosPendientes.filter(p => p.estrategico).length;
          return (
            <>
              <h2 style={{marginBottom:'20px'}}>⏸️ Proyectos Pendientes ({proyectosPendientes.length})</h2>
              <div className="info-panel" style={{marginBottom:'20px', background:'#f5f5f5', border:'1px solid #bdbdbd', color:'#424242'}}>
                ⏸️ <strong>Proyectos en estado de pendiente</strong><br/>
                <span style={{fontSize:'13px'}}>Estos proyectos están pausados a la espera de acciones adicionales. {pendientesEstrat > 0 && `(${pendientesEstrat} son estratégicos ⭐)`}</span>
              </div>
              <div className="stats-grid" style={{marginBottom:'20px'}}>
                <div className="stat-card"><h3>Total Pendientes</h3><div className="value">{proyectosPendientes.length}</div></div>
                <div className="stat-card gold"><h3>⭐ Estratégicos</h3><div className="value">{pendientesEstrat}</div></div>
              </div>
              <div className="table">
                <table>
                  <thead>
                    <tr>
                      <th>⭐</th><th>Radicado</th><th>Fecha Rad.</th><th>Arquitecto</th><th>Ingeniero</th><th>Máx. Legal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {proyectosPendientes.length === 0 && (
                      <tr><td colSpan="6" style={{textAlign:'center', padding:'40px', color:'#999'}}>No hay proyectos pendientes actualmente</td></tr>
                    )}
                    {proyectosPendientes.map(p => (
                      <tr key={p.radicado}>
                        <td>{p.estrategico && <Star size={16} fill="#f9a825" color="#f9a825" />}</td>
                        <td><strong>{p.radicado}</strong></td>
                        <td>{p.fechaRadicacion}</td>
                        <td>{p.nombreArquitecto || '-'}</td>
                        <td>{p.nombreIngeniero || '-'}</td>
                        <td>{p.maximaLegal || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          );
        })()}

        {!loading && !error && vistaEfectiva === 'pagos' && puedeVer(usuarioActual.rol, 'pagos') && (() => {
          const proyectosPagos = proyectos.filter(p => getEstadoFlujo(p) === 'PAGOS');
          const pagosEstrat = proyectosPagos.filter(p => p.estrategico).length;
          const pagosVencidos = proyectosPagos.filter(p => {
            if (p.fechaAportePagos) return false;
            const limite = excelDateToDate(p.fechaLimitePago);
            return limite && limite < hoy;
          }).length;
          const pagosAportados = proyectosPagos.filter(p => p.fechaAportePagos).length;
          return (
            <>
              <h2 style={{marginBottom:'20px'}}>💰 Proyectos en Pagos ({proyectosPagos.length})</h2>
              <div className="info-panel" style={{marginBottom:'20px', background:'#e0f7fa', border:'1px solid #4dd0e1', color:'#00838f'}}>
                💰 <strong>Proyectos en fase de pagos</strong><br/>
                <span style={{fontSize:'13px'}}>Estos proyectos están pendientes del pago de derechos de expedición. {pagosEstrat > 0 && `(${pagosEstrat} son estratégicos ⭐)`}</span>
              </div>
              <div className="stats-grid" style={{marginBottom:'20px'}}>
                <div className="stat-card info"><h3>Total en Pagos</h3><div className="value">{proyectosPagos.length}</div></div>
                <div className="stat-card gold"><h3>⭐ Estratégicos</h3><div className="value">{pagosEstrat}</div></div>
                <div className="stat-card success"><h3>✓ Pago aportado</h3><div className="value">{pagosAportados}</div></div>
                <div className="stat-card warning"><h3>⚠ Plazo de pago vencido</h3><div className="value">{pagosVencidos}</div></div>
              </div>
              <div className="table">
                <table>
                  <thead>
                    <tr>
                      <th>⭐</th><th>Radicado</th><th>Fecha Rad.</th><th>Arquitecto</th><th>Ingeniero</th><th>Límite de pago</th><th>Aporte de pago</th>
                    </tr>
                  </thead>
                  <tbody>
                    {proyectosPagos.length === 0 && (
                      <tr><td colSpan="7" style={{textAlign:'center', padding:'40px', color:'#999'}}>No hay proyectos en pagos actualmente</td></tr>
                    )}
                    {proyectosPagos.map(p => {
                      const limite = excelDateToDate(p.fechaLimitePago);
                      const diasLimite = limite ? diasEntreFechas(limite) : null;
                      let badgeLimite = null;
                      if (!p.fechaAportePagos && diasLimite !== null) {
                        if (diasLimite < 0) badgeLimite = <span className="badge red" style={{marginLeft:'6px'}}>Vencido {Math.abs(diasLimite)}d</span>;
                        else if (diasLimite <= 5) badgeLimite = <span className="badge orange" style={{marginLeft:'6px'}}>{diasLimite}d</span>;
                      }
                      return (
                        <tr key={p.radicado}>
                          <td>{p.estrategico && <Star size={16} fill="#f9a825" color="#f9a825" />}</td>
                          <td><strong>{p.radicado}</strong></td>
                          <td>{p.fechaRadicacion}</td>
                          <td>{p.nombreArquitecto || '-'}</td>
                          <td>{p.nombreIngeniero || '-'}</td>
                          <td>{p.fechaLimitePago || '-'}{badgeLimite}</td>
                          <td>{p.fechaAportePagos ? <span className="badge green">{p.fechaAportePagos}</span> : '-'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          );
        })()}

        {vistaEfectiva === 'finanzas' && puedeVerFinanzas(usuarioActual) && (
          <Finanzas
            token={token}
            usuario={usuarioActual}
            proyectos={proyectos}
            onSesionExpirada={cerrarSesion}
          />
        )}
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
