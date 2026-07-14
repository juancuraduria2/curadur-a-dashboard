import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts';
import { Home, Star, Clock, FileText, Users, User, History, TrendingUp, Search, Calendar, AlertTriangle, CheckCircle, XCircle, Tv, LogIn, RefreshCw } from 'lucide-react';

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
.search-box { display: flex; gap: 10px; margin-bottom: 20px; }
.search-input { flex: 1; padding: 12px 16px; border: 1px solid #e0e0e0; border-radius: 8px; font-size: 14px; }
.search-input:focus { outline: none; border-color: #c62828; }
.btn-primary { background: #c62828; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-size: 14px; }
.btn-primary:hover { background: #b71c1c; }
.btn-star { background: none; border: none; cursor: pointer; padding: 4px; }
.tv-mode { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: #0a0a0a; color: white; z-index: 1000; padding: 40px; overflow-y: auto; }
.tv-mode .tv-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 2px solid #333; }
.tv-mode .tv-clock { font-size: 32px; font-weight: 300; color: #ff5252; }
.tv-mode .tv-title { font-size: 28px; font-weight: 300; }
.tv-mode .tv-close { background: #c62828; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-size: 14px; }
.tv-mode .tv-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 40px; }
.tv-mode .tv-stat { background: rgba(255,255,255,0.05); padding: 30px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); }
.tv-mode .tv-stat h3 { font-size: 14px; color: #999; margin-bottom: 15px; text-transform: uppercase; }
.tv-mode .tv-stat .value { font-size: 48px; font-weight: 700; color: #ff5252; }
`;

// Mapeo de iniciales a nombres completos
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

// Convertir número serial de Excel a fecha dd/mm/yyyy
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

// Mapear inicial a nombre completo
const mapearArquitecto = (inicial) => {
  if (!inicial) return '';
  return MAPEO_ARQUITECTOS[inicial] || inicial;
};

const mapearIngeniero = (inicial) => {
  if (!inicial) return '';
  return MAPEO_INGENIEROS[inicial] || inicial;
};
// Componente principal
function App() {
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [vista, setVista] = useState('dashboard');
  const [busqueda, setBusqueda] = useState('');
  const [modoTV, setModoTV] = useState(false);
  const [horaTV, setHoraTV] = useState(new Date());
  const [estrategicos, setEstrategicos] = useState(() => {
    const saved = localStorage.getItem('estrategicos');
    return saved ? JSON.parse(saved) : [];
  });

  // Cargar datos del Excel
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

  // Reloj del Modo TV
  useEffect(() => {
    if (modoTV) {
      const timer = setInterval(() => setHoraTV(new Date()), 1000);
      return () => clearInterval(timer);
    }
  }, [modoTV]);

  // Toggle estratégico
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

  // Cálculos para estadísticas
  const totalProyectos = proyectos.length;
  const proyectosEstrategicos = proyectos.filter(p => p.estrategico).length;
  const enEstudio = proyectos.filter(p => p.estadoActual === 'REVISIÓN' || p.estadoActual === 'EN ESTUDIO').length;
  const aprobados = proyectos.filter(p => p.estadoActual === 'EXPEDIDO').length;
  const observaciones = proyectos.filter(p => p.estadoActual === 'OBSERVACIONES' || p.actaObservaciones).length;
  const sinLDF = proyectos.filter(p => p.estadoActual === 'NO L.D.F' || !p.fechaLegal).length;
  const desistidos = proyectos.filter(p => p.estadoActual === 'DESISTIDO').length;
  
  // Calcular vencidos
  const hoy = new Date();
  const vencidos = proyectos.filter(p => {
    if (!p.maximaLegal) return false;
    const partes = p.maximaLegal.split('/');
    if (partes.length !== 3) return false;
    const fecha = new Date(partes[2], partes[1] - 1, partes[0]);
    return fecha < hoy && p.estadoActual !== 'EXPEDIDO' && p.estadoActual !== 'DESISTIDO';
  }).length;

  // Datos para gráficos
  const distribucionEstados = [
    { name: 'Expedido', value: aprobados, color: '#388e3c' },
    { name: 'Revisión', value: enEstudio, color: '#1976d2' },
    { name: 'Desistido', value: desistidos, color: '#757575' },
    { name: 'Sin L.D.F', value: sinLDF, color: '#f57c00' },
    { name: 'Observaciones', value: observaciones, color: '#c62828' }
  ].filter(d => d.value > 0);

  // Radicados por mes
  const radicadosPorMes = () => {
    const meses = {};
    proyectos.forEach(p => {
      if (p.fechaRadicacion) {
        const partes = p.fechaRadicacion.split('/');
        if (partes.length === 3) {
          const key = `${partes[1]}/${partes[2]}`;
          meses[key] = (meses[key] || 0) + 1;
        }
      }
    });
    const nombreMeses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return Object.entries(meses)
      .map(([key, value]) => {
        const [mes, año] = key.split('/');
        return { mes: nombreMeses[parseInt(mes) - 1], value, orden: parseInt(mes) };
      })
      .sort((a, b) => a.orden - b.orden);
  };
  // Filtrar proyectos por búsqueda
  const proyectosFiltrados = proyectos.filter(p => {
    if (!busqueda) return true;
    const b = busqueda.toLowerCase();
    return String(p.radicado).toLowerCase().includes(b) ||
           (p.nombreArquitecto || '').toLowerCase().includes(b) ||
           (p.nombreIngeniero || '').toLowerCase().includes(b) ||
           (p.estadoActual || '').toLowerCase().includes(b);
  });

  // Productividad por técnico
  const productividadTecnicos = () => {
    const arquitectos = {};
    const ingenieros = {};
    proyectos.forEach(p => {
      if (p.nombreArquitecto) {
        arquitectos[p.nombreArquitecto] = (arquitectos[p.nombreArquitecto] || 0) + 1;
      }
      if (p.nombreIngeniero) {
        ingenieros[p.nombreIngeniero] = (ingenieros[p.nombreIngeniero] || 0) + 1;
      }
    });
    return { arquitectos, ingenieros };
  };

  // Modo TV
  if (modoTV) {
    return (
      <div className="tv-mode">
        <style>{STYLES}</style>
        <div className="tv-header">
          <div className="tv-title">Curaduría Urbana N.° 2 de Pereira - Command Center</div>
          <div className="tv-clock">{horaTV.toLocaleTimeString('es-CO')}</div>
          <button className="tv-close" onClick={() => setModoTV(false)}>Salir Modo TV</button>
        </div>
        <div className="tv-stats">
          <div className="tv-stat">
            <h3>Total Radicados</h3>
            <div className="value">{totalProyectos}</div>
          </div>
          <div className="tv-stat">
            <h3>En Revisión</h3>
            <div className="value">{enEstudio}</div>
          </div>
          <div className="tv-stat">
            <h3>Expedidos</h3>
            <div className="value">{aprobados}</div>
          </div>
          <div className="tv-stat">
            <h3>Vencidos</h3>
            <div className="value">{vencidos}</div>
          </div>
        </div>
        <div style={{background: 'rgba(255,255,255,0.05)', padding: '30px', borderRadius: '12px'}}>
          <h3 style={{marginBottom: '20px', fontSize: '20px'}}>Distribución de Estados</h3>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie data={distribucionEstados} cx="50%" cy="50%" outerRadius={140} dataKey="value" label={(e) => `${e.name}: ${e.value}`}>
                {distribucionEstados.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{background: '#1a1a1a', border: '1px solid #333'}} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <style>{STYLES}</style>
      <div className="header">
        <h1>Dashboard Curaduría Urbana N.° 2 de Pereira</h1>
        <div className="header-buttons">
          <button className="header-btn" onClick={cargarDatos}>
            <RefreshCw size={16} /> Actualizar
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
      </div>

      <div className="content">
        {loading && <div className="loading">Cargando datos del Excel...</div>}
        {error && <div className="error-msg">Error: {error}</div>}
        
        {!loading && !error && vista === 'dashboard' && (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Radicados 2026</h3>
                <div className="value">{totalProyectos}</div>
              </div>
              <div className="stat-card info">
                <h3>Estratégicos</h3>
                <div className="value">{proyectosEstrategicos}</div>
              </div>
              <div className="stat-card info">
                <h3>En Revisión</h3>
                <div className="value">{enEstudio}</div>
              </div>
              <div className="stat-card success">
                <h3>Expedidos</h3>
                <div className="value">{aprobados}</div>
              </div>
              <div className="stat-card warning">
                <h3>Sin L.D.F</h3>
                <div className="value">{sinLDF}</div>
              </div>
              <div className="stat-card">
                <h3>Desistidos</h3>
                <div className="value">{desistidos}</div>
              </div>
              <div className="stat-card warning">
                <h3>Vencidos</h3>
                <div className="value">{vencidos}</div>
              </div>
            </div>

            <div className="charts-grid">
              <div className="chart-card">
                <h3>Radicados por Mes</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={radicadosPorMes()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#c62828" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="chart-card">
                <h3>Distribución por Estado</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={distribucionEstados} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={(e) => `${e.name}: ${e.value}`}>
                      {distribucionEstados.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
        {!loading && !error && vista === 'estrategicos' && (
          <>
            <h2 style={{marginBottom: '20px'}}>Proyectos Estratégicos ({proyectosEstrategicos})</h2>
            <div className="table">
              <table>
                <thead>
                  <tr>
                    <th>Radicado</th>
                    <th>Fecha Radicación</th>
                    <th>Estado</th>
                    <th>Arquitecto</th>
                    <th>Ingeniero</th>
                    <th>Máx. Legal</th>
                  </tr>
                </thead>
                <tbody>
                  {proyectos.filter(p => p.estrategico).map(p => (
                    <tr key={p.radicado}>
                      <td><strong>{p.radicado}</strong></td>
                      <td>{p.fechaRadicacion}</td>
                      <td><span className="badge blue">{p.estadoActual || 'Sin estado'}</span></td>
                      <td>{p.nombreArquitecto || '-'}</td>
                      <td>{p.nombreIngeniero || '-'}</td>
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
            <h2 style={{marginBottom: '20px'}}>Términos Legales (45 días)</h2>
            <div className="table">
              <table>
                <thead>
                  <tr>
                    <th>Radicado</th>
                    <th>Fecha Radicación</th>
                    <th>Fecha Máx. Legal</th>
                    <th>Estado</th>
                    <th>Días Restantes</th>
                  </tr>
                </thead>
                <tbody>
                  {proyectos.map(p => {
                    if (!p.maximaLegal) return null;
                    const partes = p.maximaLegal.split('/');
                    if (partes.length !== 3) return null;
                    const fecha = new Date(partes[2], partes[1] - 1, partes[0]);
                    const diff = Math.floor((fecha - hoy) / (1000 * 60 * 60 * 24));
                    let badge = 'green';
                    let texto = `${diff} días`;
                    if (diff < 0) { badge = 'red'; texto = `Vencido ${Math.abs(diff)}d`; }
                    else if (diff <= 5) badge = 'red';
                    else if (diff <= 15) badge = 'orange';
                    return (
                      <tr key={p.radicado}>
                        <td><strong>{p.radicado}</strong></td>
                        <td>{p.fechaRadicacion}</td>
                        <td>{p.maximaLegal}</td>
                        <td><span className="badge blue">{p.estadoActual || 'Sin estado'}</span></td>
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
              <input
                type="text"
                className="search-input"
                placeholder="Buscar por radicado, técnico, estado..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
            <div className="table">
              <table>
                <thead>
                  <tr>
                    <th>Estratégico</th>
                    <th>Radicado</th>
                    <th>Fecha Rad.</th>
                    <th>Estado</th>
                    <th>Arquitecto</th>
                    <th>Ingeniero</th>
                    <th>Máx. Legal</th>
                  </tr>
                </thead>
                <tbody>
                  {proyectosFiltrados.map(p => (
                    <tr key={p.radicado}>
                      <td>
                        <button 
                          className="btn-star" 
                          onClick={() => toggleEstrategico(p.radicado)}
                          title={p.estrategico ? 'Quitar de estratégicos' : 'Marcar como estratégico'}
                        >
                          <Star 
                            size={20} 
                            fill={p.estrategico ? '#ffc107' : 'none'} 
                            color={p.estrategico ? '#ffc107' : '#ccc'} 
                          />
                        </button>
                      </td>
                      <td><strong>{p.radicado}</strong></td>
                      <td>{p.fechaRadicacion}</td>
                      <td><span className="badge blue">{p.estadoActual || 'Sin estado'}</span></td>
                      <td>{p.nombreArquitecto || '-'}</td>
                      <td>{p.nombreIngeniero || '-'}</td>
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
            <h2 style={{marginBottom: '20px'}}>Productividad del Equipo</h2>
            <div className="charts-grid">
              <div className="chart-card">
                <h3>Arquitectos - Proyectos Asignados</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={Object.entries(productividadTecnicos().arquitectos).map(([name, value]) => ({name, value}))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#c62828" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="chart-card">
                <h3>Ingenieros - Proyectos Asignados</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={Object.entries(productividadTecnicos().ingenieros).map(([name, value]) => ({name, value}))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#1976d2" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
