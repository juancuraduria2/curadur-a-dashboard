import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Home, Star, Clock, FileText, Users, User, History, Search, Calendar, AlertTriangle, CheckCircle, Tv, LogIn, RefreshCw, ArrowLeft, StickyNote, Trophy, TrafficCone, ClipboardList } from 'lucide-react';

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
.tecnico-stats { display: grid; grid-template-columns: repeat(5, 1fr); gap: 15px; margin-bottom: 30px; }
.tecnico-stat { background: white; border: 1px solid #e0e0e0; border-radius: 12px; padding: 20px; text-align: center; }
.tecnico-stat .num { font-size: 36px; font-weight: 700; margin-bottom: 5px; }
.tecnico-stat .label { color: #666; font-size: 13px; }
.tecnico-stat.red .num { color: #c62828; }
.tecnico-stat.gold .num { color: #f9a825; }
.tecnico-stat.green .num { color: #388e3c; }
.tecnico-stat.blue .num { color: #1976d2; }
.tecnico-stat.orange .num { color: #f57c00; }
.aviso-estrategicos { background: #fffde7; border: 1px solid #fdd835; border-radius: 8px; padding: 15px 20px; margin-bottom: 30px; color: #f57f17; }
.proyecto-tecnico { background: white; border: 1px solid #e0e0e0; border-radius: 12px; padding: 20px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: flex-start; gap: 20px; }
.proyecto-tecnico.atendido { background: #f1f8e9; border-color: #7cb342; }
.proyecto-tecnico-info { flex: 1; }
.proyecto-tecnico-header { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
.proyecto-tecnico-radicado { font-size: 18px; font-weight: 700; color: #f9a825; }
.proyecto-tecnico-tipo { color: #666; font-size: 14px; margin-bottom: 5px; text-transform: uppercase; font-weight: 600; }
.proyecto-tecnico-fecha { color: #999; font-size: 13px; }
.proyecto-tecnico-badges { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 10px; }
.proyecto-tecnico-actions { display: flex; flex-direction: column; gap: 8px; align-items: flex-end; }
.btn-atender { background: #c62828; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 13px; }
.btn-atender.atendido { background: #388e3c; }
.btn-nota { background: transparent; border: 1px solid #e0e0e0; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 13px; color: #666; }
.nota-personal { background: #fff8e1; border: 1px solid #ffe082; padding: 10px; border-radius: 6px; margin-top: 10px; font-size: 13px; color: #6d4c00; }
.nota-input { width: 100%; padding: 10px; border: 1px solid #e0e0e0; border-radius: 6px; font-size: 13px; margin-top: 10px; resize: vertical; min-height: 60px; }
.nota-input { width: 100%; padding: 10px; border: 1px solid #e0e0e0; border-radius: 6px; font-size: 13px; margin-top: 10px; resize: vertical; min-height: 60px; }

/* MODO TV - Command Center */
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
// CONFIGURACIÓN Y HELPERS
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

const excelDateToJSDate = (serial) => {
  if (!serial || serial === '') return '';
  if (typeof serial === 'string' && serial.includes('/')) return serial;
  const num = Number(serial);
  if (isNaN(num) || num < 1) return String(serial);
  const utcDays = num - 25569;
  const utcValue = utcDays * 86400;
  const date = new Date(utcValue * 1000);
  const dd = String(date.getUTCDate()).padStart(2, '0');
  const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
  const yyyy = date.getUTCFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

const excelDateToDate = (serial) => {
  if (!serial) return null;
  if (typeof serial === 'string' && serial.includes('/')) {
    const partes = serial.split('/');
    if (partes.length !== 3) return null;
    return new Date(partes[2], partes[1] - 1, partes[0]);
  }
  const num = Number(serial);
  if (isNaN(num) || num < 1) return null;
  const utcDays = num - 25569;
  const utcValue = utcDays * 86400;
  return new Date(utcValue * 1000);
};

const mapearArquitecto = (inicial) => MAPEO_ARQUITECTOS[inicial] || inicial || '';
const mapearIngeniero = (inicial) => MAPEO_INGENIEROS[inicial] || inicial || '';

const formatoFechaLarga = (fechaStr) => {
  if (!fechaStr) return '';
  const partes = fechaStr.split('/');
  if (partes.length !== 3) return fechaStr;
  const meses = ['ene.', 'feb.', 'mar.', 'abr.', 'may.', 'jun.', 'jul.', 'ago.', 'sep.', 'oct.', 'nov.', 'dic.'];
  return `${parseInt(partes[0])} de ${meses[parseInt(partes[1]) - 1]} de ${partes[2]}`;
};

const diasEntreFechas = (fecha) => {
  if (!fecha) return null;
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const f = new Date(fecha);
  f.setHours(0, 0, 0, 0);
  return Math.floor((f - hoy) / (1000 * 60 * 60 * 24));
};

// ============================================
// COMPONENTE PRINCIPAL
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
  
  const [estrategicos, setEstrategicos] = useState(() => {
    const saved = localStorage.getItem('estrategicos');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [notasPersonales, setNotasPersonales] = useState(() => {
    const saved = localStorage.getItem('notasPersonales');
    return saved ? JSON.parse(saved) : {};
  });
  
  const [atendidos, setAtendidos] = useState(() => {
    const saved = localStorage.getItem('atendidos');
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
          estrategico: estrategicos.includes(String(p.radicado))
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

  useEffect(() => {
    cargarDatos();
  }, []);

  useEffect(() => {
    if (modoTV) {
      const timer = setInterval(() => setHoraTV(new Date()), 1000);
      return () => clearInterval(timer);
    }
  }, [modoTV]);

  const toggleEstrategico = (radicado) => {
    const radStr = String(radicado);
    const nuevosEstrategicos = estrategicos.includes(radStr)
      ? estrategicos.filter(r => r !== radStr)
      : [...estrategicos, radStr];
    setEstrategicos(nuevosEstrategicos);
    localStorage.setItem('estrategicos', JSON.stringify(nuevosEstrategicos));
    setProyectos(proyectos.map(p => 
      String(p.radicado) === radStr ? { ...p, estrategico: !p.estrategico } : p
    ));
  };

  const toggleAtendido = (radicado, tecnico) => {
    const key = `${tecnico}_${radicado}`;
    const nuevos = { ...atendidos };
    if (nuevos[key]) {
      delete nuevos[key];
    } else {
      nuevos[key] = new Date().toISOString();
    }
    setAtendidos(nuevos);
    localStorage.setItem('atendidos', JSON.stringify(nuevos));
  };

  const guardarNota = (radicado, tecnico, nota) => {
    const key = `${tecnico}_${radicado}`;
    const nuevas = { ...notasPersonales, [key]: nota };
    if (!nota || nota.trim() === '') delete nuevas[key];
    setNotasPersonales(nuevas);
    localStorage.setItem('notasPersonales', JSON.stringify(nuevas));
  };

  // Cálculos generales
  const totalProyectos = proyectos.length;
  const proyectosEstrategicos = proyectos.filter(p => p.estrategico).length;
  const enEstudio = proyectos.filter(p => p.estadoActual === 'REVISIÓN' || p.estadoActual === 'EN ESTUDIO').length;
  const aprobados = proyectos.filter(p => p.estadoActual === 'EXPEDIDO').length;
  const observaciones = proyectos.filter(p => p.estadoActual === 'OBSERVACIONES' || p.actaObservaciones).length;
  const sinLDF = proyectos.filter(p => p.estadoActual === 'NO L.D.F' || !p.fechaLegal).length;
  const desistidos = proyectos.filter(p => p.estadoActual === 'DESISTIDO').length;
  const tasaAprobacion = totalProyectos > 0 ? Math.round((aprobados / totalProyectos) * 100) : 0;

  const hoy = new Date();
  const vencidos = proyectos.filter(p => {
    const fecha = excelDateToDate(p.maximaLegal);
    if (!fecha) return false;
    return fecha < hoy && p.estadoActual !== 'EXPEDIDO' && p.estadoActual !== 'DESISTIDO';
  });
  // Últimos movimientos (basados en fechas del Excel)
  const ultimosMovimientos = () => {
    const movs = [];
    proyectos.forEach(p => {
      const eventos = [
        { fecha: p.fechaPrimeraRevArq, tipo: 'EN ESTUDIO', tecnico: p.nombreArquitecto },
        { fecha: p.fechaPrimeraRevIng, tipo: 'EN REVISION', tecnico: p.nombreIngeniero },
        { fecha: p.actaObservaciones, tipo: 'OBSERVACIONES', tecnico: p.nombreArquitecto || p.nombreIngeniero },
        { fecha: p.fechaFinalizacion, tipo: 'FINALIZADO', tecnico: p.nombreArquitecto || p.nombreIngeniero },
        { fecha: p.fechaLicencia, tipo: 'EXPEDIDO', tecnico: p.nombreArquitecto || p.nombreIngeniero }
      ];
      eventos.forEach(e => {
        if (e.fecha && e.tecnico) {
          const fechaObj = excelDateToDate(e.fecha);
          if (fechaObj) {
            movs.push({
              radicado: p.radicado,
              tipo: e.tipo,
              tecnico: e.tecnico,
              fecha: fechaObj,
              fechaStr: formatoFechaLarga(e.fecha),
              estrategico: p.estrategico
            });
          }
        }
      });
    });
    return movs.sort((a, b) => b.fecha - a.fecha).slice(0, 10);
  };

  // Productividad del equipo
  const productividadEquipo = () => {
    const stats = {};
    TECNICOS.forEach(t => {
      stats[t.nombre] = { aprobados: 0, revision: 0, acta: 0, total: 0 };
    });
    proyectos.forEach(p => {
      const nombres = [p.nombreArquitecto, p.nombreIngeniero].filter(Boolean);
      nombres.forEach(n => {
        if (stats[n]) {
          stats[n].total++;
          if (p.estadoActual === 'EXPEDIDO') stats[n].aprobados++;
          else if (p.estadoActual === 'REVISIÓN' || p.estadoActual === 'EN ESTUDIO') stats[n].revision++;
          if (p.actaObservaciones) stats[n].acta++;
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
    const nombresMeses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    const diasSemana = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    const fechaHoy = `${diasSemana[horaTV.getDay()]}, ${horaTV.getDate()} de ${nombresMeses[horaTV.getMonth()]}`;
    
    return (
      <div className="tv-mode">
        <style>{STYLES}</style>
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
          <div className="tv-stat-box total">
            <div className="num">{totalProyectos}</div>
            <div className="label">Total</div>
          </div>
          <div className="tv-stat-box strat">
            <div className="num">{proyectosEstrategicos}</div>
            <div className="label">⭐ Estratégicos</div>
          </div>
          <div className="tv-stat-box aprob">
            <div className="num">{aprobados}</div>
            <div className="label">Aprobados</div>
          </div>
          <div className="tv-stat-box rev">
            <div className="num">{enEstudio}</div>
            <div className="label">En Revisión</div>
          </div>
          <div className="tv-stat-box tasa">
            <div className="num">{tasaAprobacion}%</div>
            <div className="label">Tasa Aprob.</div>
          </div>
          <div className="tv-stat-box urg">
            <div className="num">{vencidos.length}</div>
            <div className="label">Urgentes</div>
          </div>
        </div>

        <div className="tv-grid-main">
          {/* PRODUCTIVIDAD */}
          <div className="tv-panel">
            <div className="tv-panel-title">
              <Trophy size={14} /> PRODUCTIVIDAD DEL EQUIPO
            </div>
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

          {/* ESTADO GENERAL */}
          <div className="tv-panel">
            <div className="tv-panel-title">
              📊 ESTADO GENERAL
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie 
                  data={[
                    {name: 'Aprobados', value: aprobados, color: '#4caf50'},
                    {name: 'En Revisión', value: enEstudio, color: '#2196f3'},
                    {name: 'Observaciones', value: observaciones, color: '#ff9800'},
                    {name: 'Vencidos', value: vencidos.length, color: '#f44336'}
                  ].filter(d => d.value > 0)} 
                  cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value"
                >
                  {[
                    {color: '#4caf50'}, {color: '#2196f3'}, {color: '#ff9800'}, {color: '#f44336'}
                  ].map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{background: '#1a1a2e', border: '1px solid #333'}} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{marginTop: '15px'}}>
              <div className="tv-leyenda-item" style={{marginBottom: '8px'}}>
                <div className="tv-leyenda-dot" style={{background:'#4caf50'}}></div>Aprobados <span style={{marginLeft:'auto', color:'#4caf50', fontWeight:600}}>{aprobados}</span>
              </div>
              <div className="tv-leyenda-item" style={{marginBottom: '8px'}}>
                <div className="tv-leyenda-dot" style={{background:'#2196f3'}}></div>En Revisión <span style={{marginLeft:'auto', color:'#2196f3', fontWeight:600}}>{enEstudio}</span>
              </div>
              <div className="tv-leyenda-item" style={{marginBottom: '8px'}}>
                <div className="tv-leyenda-dot" style={{background:'#ff9800'}}></div>Observaciones <span style={{marginLeft:'auto', color:'#ff9800', fontWeight:600}}>{observaciones}</span>
              </div>
            </div>
          </div>

          {/* SEMÁFORO DE TÉRMINOS */}
          <div className="tv-panel">
            <div className="tv-panel-title">
              🚦 SEMÁFORO DE TÉRMINOS
            </div>
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
                    <div className="tv-semaforo-tipo">{p.estadoActual || 'SIN ESTADO'}</div>
                    <div className="tv-semaforo-detalles">
                      Técnico: {p.nombreArquitecto || '-'}<br/>
                      Revisor: {p.nombreIngeniero || '-'}
                    </div>
                    <span className={`tv-badge-mini ${p.estadoActual === 'REVISIÓN' ? 'rev' : 'estudio'}`}>{p.estadoActual || 'PENDIENTE'}</span>
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

        {/* ÚLTIMOS MOVIMIENTOS */}
        <div className="tv-panel">
          <div className="tv-panel-title">
            <ClipboardList size={14} /> ÚLTIMOS MOVIMIENTOS
          </div>
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
            <div key={t.nombre} className="tecnico-card" onClick={() => setTecnicoActivo(t)}>
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
    const misProyectos = proyectos.filter(p => 
      p.nombreArquitecto === tecnicoActivo.nombre || p.nombreIngeniero === tecnicoActivo.nombre
    );
    const misEstrategicos = misProyectos.filter(p => p.estrategico);
    const misAprobados = misProyectos.filter(p => p.estadoActual === 'EXPEDIDO').length;
    const misRevision = misProyectos.filter(p => p.estadoActual === 'REVISIÓN' || p.estadoActual === 'EN ESTUDIO').length;
    const miTasa = misProyectos.length > 0 ? Math.round((misAprobados / misProyectos.length) * 100) : 0;
    
    // Estratégicos primero
    const proyectosOrdenados = [...misProyectos].sort((a, b) => (b.estrategico ? 1 : 0) - (a.estrategico ? 1 : 0));

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
          <div className="tecnico-stat red">
            <div className="num">{misProyectos.length}</div>
            <div className="label">Mis Proyectos</div>
          </div>
          <div className="tecnico-stat gold">
            <div className="num">{misEstrategicos.length}</div>
            <div className="label">⭐ Estratégicos</div>
          </div>
          <div className="tecnico-stat green">
            <div className="num">{misAprobados}</div>
            <div className="label">Aprobados</div>
          </div>
          <div className="tecnico-stat blue">
            <div className="num">{misRevision}</div>
            <div className="label">En Revisión</div>
          </div>
          <div className="tecnico-stat orange">
            <div className="num">{miTasa}%</div>
            <div className="label">% Aprobación</div>
          </div>
        </div>

        {misEstrategicos.length > 0 && (
          <div className="aviso-estrategicos">
            ⭐ <strong>Tienes {misEstrategicos.length} proyectos estratégicos asignados</strong><br/>
            <span style={{fontSize:'13px'}}>Estos aparecen primero en la lista. Tienen prioridad de revisión.</span>
          </div>
        )}

        <h3 style={{marginBottom:'15px'}}>Detalle de Proyectos (estratégicos primero)</h3>
        
        {proyectosOrdenados.map(p => {
          const key = `${tecnicoActivo.nombre}_${p.radicado}`;
          const estaAtendido = !!atendidos[key];
          const nota = notasPersonales[key] || '';
          const fechaMaxima = excelDateToDate(p.maximaLegal);
          const dias = diasEntreFechas(fechaMaxima);
          const vencido = dias !== null && dias < 0;
          
          return (
            <div key={p.radicado} className={`proyecto-tecnico ${estaAtendido ? 'atendido' : ''}`}>
              <div className="proyecto-tecnico-info">
                <div className="proyecto-tecnico-header">
                  {p.estrategico && <Star size={20} fill="#f9a825" color="#f9a825" />}
                  <div className="proyecto-tecnico-radicado">{p.radicado}</div>
                </div>
                <div className="proyecto-tecnico-tipo">{p.estadoActual || 'SIN ESTADO'}</div>
                <div className="proyecto-tecnico-fecha">
                  Fecha LDF: <strong>{formatoFechaLarga(p.fechaLegal) || 'Sin fecha'}</strong>
                </div>
                <div className="proyecto-tecnico-fecha">
                  Plazo legal vence: <strong>{p.maximaLegal || 'Sin fecha'}</strong>
                  {dias !== null && (
                    vencido 
                      ? <span style={{color:'#c62828'}}> — Vencido hace {Math.abs(dias)} días</span>
                      : <span style={{color:'#388e3c'}}> — {dias} días restantes</span>
                  )}
                </div>
                {nota && (
                  <div className="nota-personal">
                    <strong>📝 Mi nota:</strong> {nota}
                  </div>
                )}
              </div>
              <div className="proyecto-tecnico-actions">
                <div className="proyecto-tecnico-badges">
                  {p.estadoActual === 'REVISIÓN' && <span className="badge blue">REV ARQ</span>}
                  {p.actaObservaciones && <span className="badge orange">OBSERVACIONES</span>}
                  {vencido && <span className="badge red">⚠ VENCIDO</span>}
                  {p.estadoActual === 'EXPEDIDO' && <span className="badge green">✓ EXPEDIDO</span>}
                </div>
                <button 
                  className={`btn-atender ${estaAtendido ? 'atendido' : ''}`}
                  onClick={() => toggleAtendido(p.radicado, tecnicoActivo.nombre)}
                >
                  {estaAtendido ? '✓ Atendido hoy' : 'Marcar como atendido'}
                </button>
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
           (p.estadoActual || '').toLowerCase().includes(b);
  });

  return (
    <div className="app">
      <style>{STYLES}</style>
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
              <div className="stat-card info"><h3>Estratégicos</h3><div className="value">{proyectosEstrategicos}</div></div>
              <div className="stat-card info"><h3>En Revisión</h3><div className="value">{enEstudio}</div></div>
              <div className="stat-card success"><h3>Expedidos</h3><div className="value">{aprobados}</div></div>
              <div className="stat-card warning"><h3>Sin L.D.F</h3><div className="value">{sinLDF}</div></div>
              <div className="stat-card warning"><h3>Vencidos</h3><div className="value">{vencidos.length}</div></div>
            </div>
            <div className="charts-grid">
              <div className="chart-card">
                <h3>Distribución por Estado</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={[
                      {name:'Expedido',value:aprobados,color:'#388e3c'},
                      {name:'Revisión',value:enEstudio,color:'#1976d2'},
                      {name:'Desistido',value:desistidos,color:'#757575'},
                      {name:'Sin L.D.F',value:sinLDF,color:'#f57c00'},
                      {name:'Observaciones',value:observaciones,color:'#c62828'}
                    ].filter(d=>d.value>0)} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={(e)=>`${e.name}: ${e.value}`}>
                      {[{color:'#388e3c'},{color:'#1976d2'},{color:'#757575'},{color:'#f57c00'},{color:'#c62828'}].map((e,i)=><Cell key={i} fill={e.color} />)}
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
            <h2 style={{marginBottom:'20px'}}>Proyectos Estratégicos ({proyectosEstrategicos})</h2>
            <div className="table">
              <table>
                <thead><tr><th>Radicado</th><th>Fecha Rad.</th><th>Estado</th><th>Arquitecto</th><th>Ingeniero</th><th>Máx. Legal</th></tr></thead>
                <tbody>
                  {proyectos.filter(p=>p.estrategico).map(p=>(
                    <tr key={p.radicado}>
                      <td><strong>{p.radicado}</strong></td>
                      <td>{p.fechaRadicacion}</td>
                      <td><span className="badge blue">{p.estadoActual||'Sin estado'}</span></td>
                      <td>{p.nombreArquitecto||'-'}</td>
                      <td>{p.nombreIngeniero||'-'}</td>
                      <td>{p.maximaLegal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {!loading && !error && vista === 'terminos' && (
          <>
            <h2 style={{marginBottom:'20px'}}>Términos Legales (45 días)</h2>
            <div className="table">
              <table>
                <thead><tr><th>Radicado</th><th>Fecha Rad.</th><th>Fecha Máx. Legal</th><th>Estado</th><th>Días</th></tr></thead>
                <tbody>
                  {proyectos.filter(p=>p.maximaLegal).map(p=>{
                    const fecha = excelDateToDate(p.maximaLegal);
                    const dias = diasEntreFechas(fecha);
                    if (dias === null) return null;
                    let badge = 'green', texto = `${dias} días`;
                    if (dias < 0) { badge='red'; texto=`Vencido ${Math.abs(dias)}d`; }
                    else if (dias <= 5) badge='red';
                    else if (dias <= 15) badge='orange';
                    return (
                      <tr key={p.radicado}>
                        <td><strong>{p.radicado}</strong></td>
                        <td>{p.fechaRadicacion}</td>
                        <td>{p.maximaLegal}</td>
                        <td><span className="badge blue">{p.estadoActual||'Sin estado'}</span></td>
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
              <input type="text" className="search-input" placeholder="Buscar..." value={busqueda} onChange={(e)=>setBusqueda(e.target.value)} />
            </div>
            <div className="table">
              <table>
                <thead><tr><th>⭐</th><th>Radicado</th><th>Fecha</th><th>Estado</th><th>Arquitecto</th><th>Ingeniero</th><th>Máx. Legal</th></tr></thead>
                <tbody>
                  {proyectosFiltrados.map(p=>(
                    <tr key={p.radicado}>
                      <td><button className="btn-star" onClick={()=>toggleEstrategico(p.radicado)}><Star size={20} fill={p.estrategico?'#ffc107':'none'} color={p.estrategico?'#ffc107':'#ccc'} /></button></td>
                      <td><strong>{p.radicado}</strong></td>
                      <td>{p.fechaRadicacion}</td>
                      <td><span className="badge blue">{p.estadoActual||'Sin estado'}</span></td>
                      <td>{p.nombreArquitecto||'-'}</td>
                      <td>{p.nombreIngeniero||'-'}</td>
                      <td>{p.maximaLegal}</td>
                    </tr>
                  ))}
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
            <h2 style={{marginBottom:'20px'}}>Historial Completo de Movimientos</h2>
            <div className="table">
              <table>
                <thead><tr><th></th><th>Radicado</th><th>Estado</th><th>Técnico</th><th>Fecha</th></tr></thead>
                <tbody>
                  {ultimosMovimientos().concat(ultimosMovimientos()).slice(0,30).map((m,i)=>(
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
