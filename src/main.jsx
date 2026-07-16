import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Home, Star, Clock, FileText, Users, User, History, Search, Calendar, AlertTriangle, CheckCircle, Tv, LogIn, RefreshCw, ArrowLeft, StickyNote, Trophy, ClipboardList, Inbox, Flame, Send } from 'lucide-react';

// ============================================
// CONFIGURACIÓN
// ============================================

const MAPEO_ARQUITECTOS = {
  'LAA': 'Laura Arandia',
  'AMMF': 'Adriana Marulanda',
  'MCMF': 'Camila Marulanda',
  'DMUM': 'Diana Uribe'
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
  { nombre: 'Alejandra Calderon', inicial: 'AC', rol: 'Ingeniera', tipo: 'ingeniero' },
  { nombre: 'Camilo Rodriguez', inicial: 'CR', rol: 'Ingeniero', tipo: 'ingeniero' },
  { nombre: 'Jorge Obed', inicial: 'JO', rol: 'Ingeniero', tipo: 'ingeniero' }
];

// Estados del proyecto (locales, no afectan Excel)
const ESTADOS_FLUJO = {
  'PENDIENTE_LDF': { label: 'Pendiente LDF', color: '#f57c00', bg: '#fff3e0', icon: '🟠' },
  'REV_ARQ_1': { label: 'Rev. Arquitectónica', color: '#1976d2', bg: '#e3f2fd', icon: '🔵' },
  'REV_ESTR_1': { label: 'Rev. Estructural', color: '#7b1fa2', bg: '#f3e5f5', icon: '🟣' },
  'ACTA_OBS': { label: 'Acta Observaciones', color: '#f9a825', bg: '#fffde7', icon: '🟡' },
  'REV_ARQ_2': { label: 'Rev. Arq. 2da vuelta', color: '#1976d2', bg: '#e3f2fd', icon: '🔄' },
  'REV_ESTR_2': { label: 'Rev. Estr. 2da vuelta', color: '#7b1fa2', bg: '#f3e5f5', icon: '🔄' },
  'EXPEDIDO': { label: 'Expedido', color: '#388e3c', bg: '#e8f5e9', icon: '✅' },
  'PENDIENTE': { label: 'Pendiente', color: '#616161', bg: '#f5f5f5', icon: '⏸️' },
  'DESISTIDO': { label: 'Desistido', color: '#c62828', bg: '#ffebee', icon: '❌' }
};

// Días hábiles por etapa
const DIAS_ETAPA = {
  REV_ARQ: 9,
  REV_ESTR: 9,
  ACTA_OBS: 30
};

// Festivos Colombia 2026
const FESTIVOS_2026 = [
  '2026-01-01', '2026-01-12', '2026-03-23', '2026-04-02', '2026-04-03',
  '2026-05-01', '2026-05-18', '2026-06-08', '2026-06-15', '2026-06-29',
  '2026-07-20', '2026-08-07', '2026-08-17', '2026-10-12', '2026-11-02',
  '2026-11-16', '2026-12-08', '2026-12-25'
];

// ============================================
// HELPERS DE FECHAS
// ============================================

const excelDateToJSDate = (serial) => {
  if (!serial || serial === '') return '';
  if (typeof serial === 'string' && serial.includes('/')) return serial;
  const num = Number(serial);
  if (isNaN(num) || num < 1) return String(serial);
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
  if (isNaN(num) || num < 1) return null;
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
// ============================================
// ESTILOS
// ============================================

const STYLES = `
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5; color: #333; }
.app { min-height: 100vh; }
.header { background: #c62828; color: white; padding: 15px 30px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
.header h1 { font-size: 22px; font-weight: 600; }
.header-buttons { display: flex; gap: 10px; }
.header-btn { background: rgba(255,255,255,0.2); color: white; border: 1px solid rgba(255,255,255,0.3); padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 14px; display: flex; align-items: center; gap: 6px; transition: all 0.2s; }
.header-btn:hover { background: rgba(255,255,255,0.3); }
.nav { background: white; padding: 0 30px; display: flex; gap: 5px; border-bottom: 1px solid #e0e0e0; overflow-x: auto; }
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
.charts-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
.chart-card { background: white; padding: 25px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
.chart-card h3 { margin-bottom: 20px; color: #333; font-size: 16px; }
.loading { text-align: center; padding: 60px; font-size: 18px; color: #666; }
.error-msg { background: #ffebee; color: #c62828; padding: 20px; border-radius: 8px; margin: 20px 0; }
.table { width: 100%; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
.table table { width: 100%; border-collapse: collapse; }
.table th { background: #f5f5f5; padding: 12px; text-align: left; font-size: 13px; color: #666; font-weight: 600; border-bottom: 2px solid #e0e0e0; }
.table td { padding: 12px; border-bottom: 1px solid #f0f0f0; font-size: 14px; }
.table tr:hover { background: #fafafa; }
.badge { display: inline-block; padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: 500; }
.badge.green { background: #e8f5e9; color: #388e3c; }
.badge.red { background: #ffebee; color: #c62828; }
.badge.orange { background: #fff3e0; color: #f57c00; }
.badge.blue { background: #e3f2fd; color: #1976d2; }
.badge.purple { background: #f3e5f5; color: #7b1fa2; }
.badge.gray { background: #f5f5f5; color: #666; }
.badge.yellow { background: #fffde7; color: #f9a825; }
.search-box { display: flex; gap: 10px; margin-bottom: 20px; }
.search-input { flex: 1; padding: 12px 16px; border: 1px solid #e0e0e0; border-radius: 8px; font-size: 14px; }
.search-input:focus { outline: none; border-color: #c62828; }
.btn-primary { background: #c62828; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-size: 14px; }
.btn-primary:hover { background: #b71c1c; }
.btn-star { background: none; border: none; cursor: pointer; padding: 4px; }

/* Selector de Técnico */
.tecnico-selector { min-height: 100vh; background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%); color: white; padding: 40px; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.tecnico-selector h1 { font-size: 48px; font-weight: 700; margin-bottom: 10px; text-align: center; }
.tecnico-selector .subtitle { color: #ffc107; font-size: 20px; margin-bottom: 40px; text-align: center; }
.tecnico-selector .hint { color: #999; margin-bottom: 40px; text-align: center; }
.tecnico-list { display: flex; flex-direction: column; gap: 15px; max-width: 600px; width: 100%; }
.tecnico-card { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 20px; display: flex; align-items: center; gap: 20px; cursor: pointer; transition: all 0.2s; }
.tecnico-card:hover { background: rgba(255,255,255,0.1); transform: translateX(5px); }
.tecnico-avatar { width: 60px; height: 60px; border-radius: 50%; background: #c62828; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 700; }
.tecnico-info { flex: 1; }
.tecnico-info .nombre { font-size: 20px; font-weight: 600; }
.tecnico-info .rol { color: #999; font-size: 14px; }
.tecnico-arrow { color: #999; }
.back-btn-tecnico { background: #c62828; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-size: 14px; display: flex; align-items: center; gap: 6px; }

/* Vista Técnico */
.vista-tecnico { padding: 30px; max-width: 1400px; margin: 0 auto; }
.vista-tecnico-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid #e0e0e0; }
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

.tabs-tecnico { display: flex; gap: 10px; margin-bottom: 20px; border-bottom: 2px solid #e0e0e0; }
.tab-tecnico { background: none; border: none; padding: 12px 24px; cursor: pointer; font-size: 14px; color: #666; border-bottom: 3px solid transparent; margin-bottom: -2px; display: flex; align-items: center; gap: 8px; font-weight: 500; }
.tab-tecnico.active { color: #c62828; border-bottom-color: #c62828; font-weight: 600; }
.tab-tecnico .count { background: #f5f5f5; padding: 2px 8px; border-radius: 10px; font-size: 12px; }
.tab-tecnico.active .count { background: #c62828; color: white; }

.proyecto-tecnico { background: white; border: 1px solid #e0e0e0; border-radius: 12px; padding: 20px; margin-bottom: 15px; display: flex; justify-content: space-between; gap: 20px; }
.proyecto-tecnico.urgente { border-left: 4px solid #c62828; }
.proyecto-tecnico.pronto { border-left: 4px solid #f57c00; }
.proyecto-tecnico.ok { border-left: 4px solid #388e3c; }
.proyecto-tecnico-info { flex: 1; }
.proyecto-tecnico-header { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
.proyecto-tecnico-radicado { font-size: 18px; font-weight: 700; color: #f9a825; }
.estado-badge { padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; display: inline-flex; align-items: center; gap: 6px; }
.proyecto-info-row { display: flex; gap: 20px; margin-top: 10px; flex-wrap: wrap; }
.info-item { font-size: 13px; color: #666; }
.info-item strong { color: #333; }
.proyecto-tecnico-actions { display: flex; flex-direction: column; gap: 8px; align-items: flex-end; min-width: 200px; }
.estado-selector { padding: 8px 12px; border: 1px solid #e0e0e0; border-radius: 6px; font-size: 13px; width: 100%; cursor: pointer; }
.btn-nota { background: transparent; border: 1px solid #e0e0e0; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 13px; color: #666; width: 100%; }
.nota-personal { background: #fff8e1; border: 1px solid #ffe082; padding: 10px; border-radius: 6px; margin-top: 10px; font-size: 13px; color: #6d4c00; }
.semaforo-mini { display: inline-flex; align-items: center; gap: 4px; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600; }
.semaforo-mini.verde { background: #e8f5e9; color: #388e3c; }
.semaforo-mini.amarillo { background: #fff3e0; color: #f57c00; }
.semaforo-mini.rojo { background: #ffebee; color: #c62828; }
`;
// Añadir estilos del Modo TV al STYLES
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
// COMPONENTE APP
// ============================================

function App() {
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [vista, setVista] = useState('dashboard');
  const [busqueda, setBusqueda] = useState('');
  const [modoTV, setModoTV] = useState(false);
  const [horaTV, setHoraTV] = useState(new Date());
  const [tecnicoActivo, setTecnicoActivo] = useState(null);
  const [tabTecnico, setTabTecnico] = useState('activos');
  
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

  const cargarDatos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/excel-data');
      const data = await response.json();
      if (data.success) {
        const proyectosProcesados = data.proyectos.map(p => ({
          ...p,
          fechaRadicacion: excelDateToJSDate(p.fechaRadicacion),
          maximaLegal: excelDateToJSDate(p.maximaLegal),
          fechaLegal: excelDateToJSDate(p.fechaLegal),
          fechaAsignacionArq: excelDateToJSDate(p.fechaAsignacionArq),
          fechaPrimeraRevArq: excelDateToJSDate(p.fechaPrimeraRevArq),
          fechaPrimeraRevIng: excelDateToJSDate(p.fechaPrimeraRevIng),
          actaObservaciones: excelDateToJSDate(p.actaObservaciones),
          fechaFinalizacion: excelDateToJSDate(p.fechaFinalizacion),
          fechaLicencia: excelDateToJSDate(p.fechaLicencia),
          nombreArquitecto: mapearArquitecto(p.nombreArquitecto),
          nombreIngeniero: mapearIngeniero(p.nombreIngeniero),
         estrategico: String(p.estrategicoExcel || '').toUpperCase().trim() === 'SI' || estrategicos.includes(String(p.radicado))
        }));
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

  useEffect(() => { cargarDatos(); }, []);
  useEffect(() => {
    if (modoTV) {
      const timer = setInterval(() => setHoraTV(new Date()), 1000);
      return () => clearInterval(timer);
    }
  }, [modoTV]);

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

  // Obtener estado flujo del proyecto (local o del Excel)
  const getEstadoFlujo = (p) => {
    const local = estadosFlujo[p.radicado];
    if (local) return local.estado;
    // Inferir del Excel
    if (p.estadoActual === 'EXPEDIDO') return 'EXPEDIDO';
    if (p.estadoActual === 'DESISTIDO') return 'DESISTIDO';
    if (p.estadoActual === 'NO L.D.F' || !p.fechaLegal) return 'PENDIENTE_LDF';
    if (p.actaObservaciones) return 'ACTA_OBS';
    if (p.fechaPrimeraRevIng) return 'REV_ESTR_1';
    if (p.fechaPrimeraRevArq) return 'REV_ARQ_1';
    if (p.fechaLegal) return 'REV_ARQ_1';
    return 'PENDIENTE_LDF';
  };
  // Cálculos generales
  const totalProyectos = proyectos.length;
  const proyectosEstrategicos = proyectos.filter(p => p.estrategico).length;
  const enEstudio = proyectos.filter(p => {
    const e = getEstadoFlujo(p);
    return ['REV_ARQ_1', 'REV_ESTR_1', 'REV_ARQ_2', 'REV_ESTR_2'].includes(e);
  }).length;
  const aprobados = proyectos.filter(p => getEstadoFlujo(p) === 'EXPEDIDO').length;
  const observaciones = proyectos.filter(p => getEstadoFlujo(p) === 'ACTA_OBS').length;
  const sinLDF = proyectos.filter(p => getEstadoFlujo(p) === 'PENDIENTE_LDF').length;
  const desistidos = proyectos.filter(p => getEstadoFlujo(p) === 'DESISTIDO').length;
  const tasaAprobacion = totalProyectos > 0 ? Math.round((aprobados / totalProyectos) * 100) : 0;

  // Vencidos INTELIGENTES - solo los que NO están en revisión/acta/expedido/desistido y pasaron plazo legal
  const hoy = new Date();
  const vencidos = proyectos.filter(p => {
    const estado = getEstadoFlujo(p);
    // No están vencidos si están en revisión activa, acta, expedido o desistido
    if (['ACTA_OBS', 'EXPEDIDO', 'DESISTIDO', 'PENDIENTE'].includes(estado)) return false;
    const fecha = excelDateToDate(p.maximaLegal);
    if (!fecha) return false;
    return fecha < hoy;
  });

  // Calcular fecha límite de etapa interna (9 días hábiles)
  const getFechaLimiteEtapa = (p) => {
    const estado = getEstadoFlujo(p);
    if (estado === 'REV_ARQ_1' || estado === 'REV_ARQ_2') {
      const fechaInicio = excelDateToDate(p.fechaLegal) || excelDateToDate(p.fechaAsignacionArq);
      if (!fechaInicio) return null;
      return sumarDiasHabiles(fechaInicio, DIAS_ETAPA.REV_ARQ);
    }
    if (estado === 'REV_ESTR_1' || estado === 'REV_ESTR_2') {
      const fechaInicio = excelDateToDate(p.fechaPrimeraRevArq);
      if (!fechaInicio) return null;
      return sumarDiasHabiles(fechaInicio, DIAS_ETAPA.REV_ESTR);
    }
    return null;
  };

  // Últimos movimientos
  const ultimosMovimientos = () => {
    const movs = [];
    proyectos.forEach(p => {
      const eventos = [
        { fecha: p.fechaPrimeraRevArq, tipo: 'REV ARQ', tecnico: p.nombreArquitecto },
        { fecha: p.fechaPrimeraRevIng, tipo: 'REV ESTRUC', tecnico: p.nombreIngeniero },
        { fecha: p.actaObservaciones, tipo: 'ACTA OBS', tecnico: p.nombreArquitecto || p.nombreIngeniero },
        { fecha: p.fechaFinalizacion, tipo: 'FINALIZADO', tecnico: p.nombreArquitecto || p.nombreIngeniero },
        { fecha: p.fechaLicencia, tipo: 'EXPEDIDO', tecnico: p.nombreArquitecto || p.nombreIngeniero }
      ];
      eventos.forEach(e => {
        if (e.fecha && e.tecnico) {
          const fechaObj = excelDateToDate(e.fecha);
          if (fechaObj) {
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

  const productividadEquipo = () => {
    const stats = {};
    TECNICOS.forEach(t => { stats[t.nombre] = { aprobados: 0, revision: 0, acta: 0, total: 0 }; });
    proyectos.forEach(p => {
      const estado = getEstadoFlujo(p);
      const nombres = [p.nombreArquitecto, p.nombreIngeniero].filter(Boolean);
      nombres.forEach(n => {
        if (stats[n]) {
          stats[n].total++;
          if (estado === 'EXPEDIDO') stats[n].aprobados++;
          else if (['REV_ARQ_1','REV_ESTR_1','REV_ARQ_2','REV_ESTR_2'].includes(estado)) stats[n].revision++;
          if (estado === 'ACTA_OBS') stats[n].acta++;
        }
      });
    });
    return stats;
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
              const fecha = excelDateToDate(p.maximaLegal);
              const diasVenc = Math.abs(diasEntreFechas(fecha));
              return (
                <div key={p.radicado} className="tv-semaforo-item">
                  <div className="tv-semaforo-info">
                    <div className="tv-semaforo-radicado">
                      {p.estrategico && <Star size={14} fill="#f9a825" color="#f9a825" />}
                      {p.radicado}
                    </div>
                    <div className="tv-semaforo-tipo">{ESTADOS_FLUJO[getEstadoFlujo(p)]?.label || 'SIN ESTADO'}</div>
                    <div className="tv-semaforo-detalles">
                      Técnico: {p.nombreArquitecto || '-'}<br/>
                      Revisor: {p.nombreIngeniero || '-'}
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
  if (vista === 'ingreso' && !tecnicoActivo) {
    return (
      <div className="tecnico-selector">
        <style>{STYLES}</style>
        <h1>Curaduría 2 Pereira</h1>
        <div className="subtitle">Proyectos Estratégicos 2026</div>
        <div className="hint">Selecciona tu nombre para ver tu panorama de proyectos</div>
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
    // Filtrar proyectos según el rol del técnico
    const misProyectos = proyectos.filter(p => 
      p.nombreArquitecto === tecnicoActivo.nombre || p.nombreIngeniero === tecnicoActivo.nombre
    );

    // Clasificar proyectos según su estado y rol del técnico
    const clasificarProyecto = (p) => {
      const estado = getEstadoFlujo(p);
      const esArq = p.nombreArquitecto === tecnicoActivo.nombre;
      const esIng = p.nombreIngeniero === tecnicoActivo.nombre;
      
      // ENTREGADOS - ya no está con él
      if (['EXPEDIDO', 'DESISTIDO', 'PENDIENTE'].includes(estado)) return 'entregados';
      
      // Para Arquitectos
      if (esArq) {
        if (['REV_ARQ_1', 'REV_ARQ_2'].includes(estado)) return 'activos';
        if (['REV_ESTR_1', 'REV_ESTR_2', 'ACTA_OBS'].includes(estado)) return 'entregados';
        if (estado === 'PENDIENTE_LDF') return 'vienen';
      }
      
      // Para Ingenieros
      if (esIng) {
        if (['REV_ESTR_1', 'REV_ESTR_2'].includes(estado)) return 'activos';
        if (['REV_ARQ_1', 'REV_ARQ_2', 'PENDIENTE_LDF'].includes(estado)) return 'vienen';
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

    const proyectosMostrar = tabTecnico === 'vienen' ? proyectosVienen : 
                            tabTecnico === 'activos' ? proyectosActivos : proyectosEntregados;
    
    // Ordenar: estratégicos primero, luego por urgencia
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
          <button className="btn-primary" onClick={() => setTecnicoActivo(null)}>
            ← Cambiar usuario
          </button>
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

        {tabTecnico === 'activos' && misEstrategicos.filter(p => clasificarProyecto(p) === 'activos').length > 0 && (
          <div style={{background: '#fffde7', border: '1px solid #fdd835', borderRadius: '8px', padding: '15px 20px', marginBottom: '20px', color: '#f57f17'}}>
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
          
          // Cálculos de tiempo
          const fechaLimiteEtapa = getFechaLimiteEtapa(p);
          const diasEtapa = fechaLimiteEtapa ? diasHabilesRestantes(fechaLimiteEtapa) : null;
          const fechaMaxLegal = excelDateToDate(p.maximaLegal);
          const diasLegal = diasEntreFechas(fechaMaxLegal);
          
          // Semáforo etapa - solo si está en revisión activa
          let semaforoEtapa = 'verde';
          const estaEnRevision = ['REV_ARQ_1','REV_ESTR_1','REV_ARQ_2','REV_ESTR_2'].includes(estadoActual);
          if (diasEtapa !== null && estaEnRevision) {
            if (diasEtapa < 0) semaforoEtapa = 'rojo';
            else if (diasEtapa <= 2) semaforoEtapa = 'amarillo';
          }
          
          const urgencia = estaEnRevision && diasEtapa !== null && diasEtapa < 0 ? 'urgente' : 
                          estaEnRevision && diasEtapa !== null && diasEtapa <= 2 ? 'pronto' : 'ok';
          
          return (
            <div key={p.radicado} className={`proyecto-tecnico ${urgencia}`}>
              <div className="proyecto-tecnico-info">
                <div className="proyecto-tecnico-header">
                  {p.estrategico && <Star size={20} fill="#f9a825" color="#f9a825" />}
                  <div className="proyecto-tecnico-radicado">{p.radicado}</div>
                  <span className="estado-badge" style={{background: estadoInfo?.bg, color: estadoInfo?.color}}>
                    {estadoInfo?.icon} {estadoInfo?.label}
                  </span>
                  {diasEtapa !== null && estaEnRevision && (
                    <span className={`semaforo-mini ${semaforoEtapa}`}>
                      <Clock size={12} /> 
                      {diasEtapa < 0 ? `${Math.abs(diasEtapa)}d vencido` : `${diasEtapa}d etapa`}
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
                    {diasLegal !== null && !['REV_ARQ_1','REV_ESTR_1','REV_ARQ_2','REV_ESTR_2','ACTA_OBS','EXPEDIDO','DESISTIDO','PENDIENTE'].includes(estadoActual) && (
                      diasLegal < 0 
                        ? <span style={{color:'#c62828'}}> (Vencido {Math.abs(diasLegal)}d)</span>
                        : <span style={{color:'#388e3c'}}> ({diasLegal}d restantes)</span>
                    )}
                    {diasLegal !== null && ['REV_ARQ_1','REV_ESTR_1','REV_ARQ_2','REV_ESTR_2'].includes(estadoActual) && (
                      <span style={{color:'#388e3c'}}> ✓ En revisión</span>
                    )}
                    {['ACTA_OBS'].includes(estadoActual) && (
                      <span style={{color:'#f57c00'}}> ⏸ Términos suspendidos</span>
                    )}
                  </div>
                </div>
                
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
                  {Object.entries(ESTADOS_FLUJO).map(([key, info]) => (
                    <option key={key} value={key}>{info.icon} {info.label}</option>
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

  return (
    <div className="app">
      <style>{STYLES + STYLES_TV}</style>
      <div className="header">
        <h1>Dashboard Curaduría Urbana N.° 2 de Pereira</h1>
        <div className="header-buttons">
          <button className="header-btn" onClick={cargarDatos}>
            <RefreshCw size={16} /> Actualizar
          </button>
          <button className="header-btn" onClick={() => setVista('ingreso')}>
            <LogIn size={16} /> Ingreso de Técnico
          </button>
          <button className="header-btn" onClick={() => setModoTV(true)}>
            <Tv size={16} /> Modo TV
          </button>
        </div>
      </div>
      
      <div className="nav">
        <button className={`nav-btn ${vista === 'dashboard' ? 'active' : ''}`} onClick={() => setVista('dashboard')}>
          <Home size={16} /> Dashboard
        </button>
        <button className={`nav-btn ${vista === 'estrategicos' ? 'active' : ''}`} onClick={() => setVista('estrategicos')}>
          <Star size={16} /> Estratégicos
        </button>
        <button className={`nav-btn ${vista === 'terminos' ? 'active' : ''}`} onClick={() => setVista('terminos')}>
          <Clock size={16} /> Términos
        </button>
        <button className={`nav-btn ${vista === 'proyectos' ? 'active' : ''}`} onClick={() => setVista('proyectos')}>
          <FileText size={16} /> Proyectos
        </button>
        <button className={`nav-btn ${vista === 'tecnicos' ? 'active' : ''}`} onClick={() => setVista('tecnicos')}>
          <Users size={16} /> Técnicos
        </button>
        <button className={`nav-btn ${vista === 'historial' ? 'active' : ''}`} onClick={() => setVista('historial')}>
          <History size={16} /> Historial
        </button>
      </div>

      <div className="content">
        {loading && <div className="loading">Cargando datos del Excel...</div>}
        {error && <div className="error-msg">Error: {error}</div>}
        
        {!loading && !error && vista === 'dashboard' && (
          <>
            <div className="stats-grid">
              <div className="stat-card"><h3>Total Radicados 2026</h3><div className="value">{totalProyectos}</div></div>
              <div className="stat-card info"><h3>⭐ Estratégicos</h3><div className="value">{proyectosEstrategicos}</div></div>
              <div className="stat-card info"><h3>En Revisión</h3><div className="value">{enEstudio}</div></div>
              <div className="stat-card success"><h3>Expedidos</h3><div className="value">{aprobados}</div></div>
              <div className="stat-card warning"><h3>Observaciones</h3><div className="value">{observaciones}</div></div>
              <div className="stat-card warning"><h3>Sin L.D.F</h3><div className="value">{sinLDF}</div></div>
              <div className="stat-card warning"><h3>⚠ Vencidos</h3><div className="value">{vencidos.length}</div></div>
              <div className="stat-card success"><h3>% Aprobación</h3><div className="value">{tasaAprobacion}%</div></div>
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
                      {name:'Desistidos',value:desistidos,color:'#757575'},
                      {name:'Vencidos',value:vencidos.length,color:'#c62828'}
                    ].filter(d=>d.value>0)} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={(e)=>`${e.name}: ${e.value}`}>
                      {[{color:'#388e3c'},{color:'#1976d2'},{color:'#f57c00'},{color:'#f9a825'},{color:'#757575'},{color:'#c62828'}].map((e,i)=><Cell key={i} fill={e.color} />)}
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

        {!loading && !error && vista === 'estrategicos' && (
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

        {!loading && !error && vista === 'terminos' && (
          <>
            <h2 style={{marginBottom:'20px'}}>⏰ Términos Legales (45 días)</h2>
            <div className="table">
              <table>
                <thead><tr><th>Radicado</th><th>Fecha Rad.</th><th>Fecha Máx. Legal</th><th>Estado</th><th>Días</th></tr></thead>
                <tbody>
                  {proyectos.filter(p=>p.maximaLegal).map(p=>{
                    const fecha = excelDateToDate(p.maximaLegal);
                    const dias = diasEntreFechas(fecha);
                    if (dias === null) return null;
                    const estado = getEstadoFlujo(p);
                    const info = ESTADOS_FLUJO[estado];
                    let badge='green', texto=`${dias} días`;
                    if (['EXPEDIDO','DESISTIDO','PENDIENTE','ACTA_OBS'].includes(estado)) { badge='gray'; texto='—'; }
                    else if (dias < 0) { badge='red'; texto=`Vencido ${Math.abs(dias)}d`; }
                    else if (dias <= 5) badge='red';
                    else if (dias <= 15) badge='orange';
                    return (
                      <tr key={p.radicado}>
                        <td><strong>{p.radicado}</strong></td>
                        <td>{p.fechaRadicacion}</td>
                        <td>{p.maximaLegal}</td>
                        <td><span className="estado-badge" style={{background: info?.bg, color: info?.color}}>{info?.icon} {info?.label}</span></td>
                        <td><span className={`badge ${badge}`}>{texto}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {!loading && !error && vista === 'proyectos' && (
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

        {!loading && !error && vista === 'tecnicos' && (
          <>
            <h2 style={{marginBottom:'20px'}}>Productividad del Equipo</h2>
            <div className="stats-grid">
              {TECNICOS.map(t=>{
                const s = productividadEquipo()[t.nombre]||{aprobados:0,revision:0,acta:0,total:0};
                return (
                  <div key={t.nombre} className="stat-card">
                    <h3>{t.nombre}</h3>
                    <div style={{marginTop:'10px', fontSize:'14px', color:'#666'}}>
                      <div>✓ Aprobados: <strong style={{color:'#388e3c'}}>{s.aprobados}</strong></div>
                      <div>🔵 En Revisión: <strong style={{color:'#1976d2'}}>{s.revision}</strong></div>
                      <div>📝 En Acta: <strong style={{color:'#f57c00'}}>{s.acta}</strong></div>
                      <div style={{marginTop:'8px', paddingTop:'8px', borderTop:'1px solid #f0f0f0'}}>Total: <strong>{s.total}</strong></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {!loading && !error && vista === 'historial' && (
          <>
            <h2 style={{marginBottom:'20px'}}>📜 Historial Completo de Movimientos</h2>
            <div className="table">
              <table>
                <thead><tr><th></th><th>Radicado</th><th>Estado</th><th>Técnico</th><th>Fecha</th></tr></thead>
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
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
