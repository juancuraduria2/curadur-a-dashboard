import React, { useState, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Menu, X, Download, PrinterIcon, Clock, TrendingUp, Users, FileText } from 'lucide-react';
import './styles.css';

// Datos de proyectos
const projectsData = [
  { radicado: '2026-001', estado: 'OBSERVACIONES', tecnico: 'Diana Uribe', revisorEstruc: 'Alejandra Calderon', ldf: '2026-01-08', observaciones: '2026-01-10', extension: false, tipoLicencia: 'Parcelación' },
  { radicado: '2026-002', estado: 'REV ARQ', tecnico: 'Adriana Marulanda', revisorEstruc: 'Camilo Rodriguez', ldf: '2026-01-15', observaciones: null, extension: false, tipoLicencia: 'Otras Actuaciones' },
  { radicado: '2026-003', estado: 'APROBADO', tecnico: 'Laura Arandia', revisorEstruc: 'Jorge Obed', ldf: '2026-01-20', observaciones: null, extension: false, tipoLicencia: 'Parcelación' },
  { radicado: '2026-004', estado: 'NO LDF', tecnico: 'Camila Marulanda', revisorEstruc: 'Alejandra Calderon', ldf: '2026-01-25', observaciones: null, extension: false, tipoLicencia: 'Otras Actuaciones' },
  { radicado: '2026-005', estado: 'REV ESTRUC', tecnico: 'Diana Uribe', revisorEstruc: 'Camilo Rodriguez', ldf: '2026-02-01', observaciones: '2026-02-05', extension: true, tipoLicencia: 'Parcelación' },
  { radicado: '2026-006', estado: 'APROBADO', tecnico: 'Adriana Marulanda', revisorEstruc: 'Jorge Obed', ldf: '2026-02-08', observaciones: null, extension: false, tipoLicencia: 'Otras Actuaciones' },
  { radicado: '2026-007', estado: 'OBSERVACIONES', tecnico: 'Laura Arandia', revisorEstruc: 'Alejandra Calderon', ldf: '2026-02-12', observaciones: '2026-02-14', extension: false, tipoLicencia: 'Parcelación' },
  { radicado: '2026-008', estado: 'REV ARQ', tecnico: 'Camila Marulanda', revisorEstruc: 'Camilo Rodriguez', ldf: '2026-02-18', observaciones: null, extension: false, tipoLicencia: 'Otras Actuaciones' },
  { radicado: '2026-009', estado: 'NO LDF', tecnico: 'Diana Uribe', revisorEstruc: 'Jorge Obed', ldf: '2026-02-25', observaciones: null, extension: false, tipoLicencia: 'Parcelación' },
  { radicado: '2026-010', estado: 'REV ESTRUC', tecnico: 'Adriana Marulanda', revisorEstruc: 'Alejandra Calderon', ldf: '2026-03-05', observaciones: null, extension: false, tipoLicencia: 'Otras Actuaciones' },
  { radicado: '2026-011', estado: 'APROBADO', tecnico: 'Laura Arandia', revisorEstruc: 'Camilo Rodriguez', ldf: '2026-03-10', observaciones: null, extension: false, tipoLicencia: 'Parcelación' },
  { radicado: '2026-012', estado: 'OBSERVACIONES', tecnico: 'Camila Marulanda', revisorEstruc: 'Jorge Obed', ldf: '2026-03-15', observaciones: '2026-03-18', extension: true, tipoLicencia: 'Otras Actuaciones' },
  { radicado: '2026-013', estado: 'REV ARQ', tecnico: 'Diana Uribe', revisorEstruc: 'Alejandra Calderon', ldf: '2026-03-22', observaciones: null, extension: false, tipoLicencia: 'Parcelación' },
  { radicado: '2026-014', estado: 'NO LDF', tecnico: 'Adriana Marulanda', revisorEstruc: 'Camilo Rodriguez', ldf: '2026-03-28', observaciones: null, extension: false, tipoLicencia: 'Otras Actuaciones' },
  { radicado: '2026-015', estado: 'REV ESTRUC', tecnico: 'Laura Arandia', revisorEstruc: 'Jorge Obed', ldf: '2026-04-02', observaciones: null, extension: false, tipoLicencia: 'Parcelación' },
  { radicado: '2026-016', estado: 'APROBADO', tecnico: 'Camila Marulanda', revisorEstruc: 'Alejandra Calderon', ldf: '2026-04-08', observaciones: null, extension: false, tipoLicencia: 'Otras Actuaciones' },
  { radicado: '2026-017', estado: 'OBSERVACIONES', tecnico: 'Diana Uribe', revisorEstruc: 'Camilo Rodriguez', ldf: '2026-04-12', observaciones: '2026-04-15', extension: false, tipoLicencia: 'Parcelación' },
  { radicado: '2026-018', estado: 'REV ARQ', tecnico: 'Adriana Marulanda', revisorEstruc: 'Jorge Obed', ldf: '2026-04-18', observaciones: null, extension: false, tipoLicencia: 'Otras Actuaciones' },
  { radicado: '2026-019', estado: 'NO LDF', tecnico: 'Laura Arandia', revisorEstruc: 'Alejandra Calderon', ldf: '2026-04-25', observaciones: null, extension: false, tipoLicencia: 'Parcelación' },
  { radicado: '2026-020', estado: 'REV ESTRUC', tecnico: 'Camila Marulanda', revisorEstruc: 'Camilo Rodriguez', ldf: '2026-05-01', observaciones: null, extension: false, tipoLicencia: 'Otras Actuaciones' },
  { radicado: '2026-021', estado: 'APROBADO', tecnico: 'Diana Uribe', revisorEstruc: 'Jorge Obed', ldf: '2026-05-05', observaciones: null, extension: false, tipoLicencia: 'Parcelación' },
  { radicado: '2026-022', estado: 'OBSERVACIONES', tecnico: 'Adriana Marulanda', revisorEstruc: 'Alejandra Calderon', ldf: '2026-05-10', observaciones: '2026-05-12', extension: true, tipoLicencia: 'Otras Actuaciones' },
  { radicado: '2026-023', estado: 'REV ARQ', tecnico: 'Laura Arandia', revisorEstruc: 'Camilo Rodriguez', ldf: '2026-05-15', observaciones: null, extension: false, tipoLicencia: 'Parcelación' },
  { radicado: '2026-024', estado: 'NO LDF', tecnico: 'Camila Marulanda', revisorEstruc: 'Jorge Obed', ldf: '2026-05-20', observaciones: null, extension: false, tipoLicencia: 'Otras Actuaciones' },
  { radicado: '2026-025', estado: 'REV ESTRUC 2', tecnico: 'Diana Uribe', revisorEstruc: 'Alejandra Calderon', ldf: '2026-05-25', observaciones: null, extension: false, tipoLicencia: 'Parcelación' },
  { radicado: '2026-026', estado: 'APROBADO', tecnico: 'Adriana Marulanda', revisorEstruc: 'Camilo Rodriguez', ldf: '2026-02-03', observaciones: null, extension: false, tipoLicencia: 'Otras Actuaciones' },
  { radicado: '2026-027', estado: 'OBSERVACIONES', tecnico: 'Laura Arandia', revisorEstruc: 'Jorge Obed', ldf: '2026-02-10', observaciones: '2026-02-12', extension: false, tipoLicencia: 'Parcelación' },
  { radicado: '2026-028', estado: 'REV ARQ', tecnico: 'Camila Marulanda', revisorEstruc: 'Alejandra Calderon', ldf: '2026-03-03', observaciones: null, extension: false, tipoLicencia: 'Otras Actuaciones' },
  { radicado: '2026-029', estado: 'NO LDF', tecnico: 'Diana Uribe', revisorEstruc: 'Camilo Rodriguez', ldf: '2026-03-08', observaciones: null, extension: false, tipoLicencia: 'Parcelación' },
  { radicado: '2026-030', estado: 'REV ESTRUC', tecnico: 'Adriana Marulanda', revisorEstruc: 'Jorge Obed', ldf: '2026-03-14', observaciones: null, extension: false, tipoLicencia: 'Otras Actuaciones' },
  { radicado: '2026-031', estado: 'APROBADO', tecnico: 'Laura Arandia', revisorEstruc: 'Alejandra Calderon', ldf: '2026-03-20', observaciones: null, extension: false, tipoLicencia: 'Parcelación' },
  { radicado: '2026-032', estado: 'OBSERVACIONES', tecnico: 'Camila Marulanda', revisorEstruc: 'Camilo Rodriguez', ldf: '2026-04-05', observaciones: '2026-04-08', extension: false, tipoLicencia: 'Otras Actuaciones' },
  { radicado: '2026-033', estado: 'REV ARQ', tecnico: 'Diana Uribe', revisorEstruc: 'Jorge Obed', ldf: '2026-04-10', observaciones: null, extension: false, tipoLicencia: 'Parcelación' },
  { radicado: '2026-034', estado: 'NO LDF', tecnico: 'Adriana Marulanda', revisorEstruc: 'Alejandra Calderon', ldf: '2026-04-16', observaciones: null, extension: false, tipoLicencia: 'Otras Actuaciones' },
  { radicado: '2026-035', estado: 'REV ESTRUC', tecnico: 'Laura Arandia', revisorEstruc: 'Camilo Rodriguez', ldf: '2026-04-22', observaciones: null, extension: false, tipoLicencia: 'Parcelación' },
  { radicado: '2026-036', estado: 'APROBADO', tecnico: 'Camila Marulanda', revisorEstruc: 'Jorge Obed', ldf: '2026-04-28', observaciones: null, extension: false, tipoLicencia: 'Otras Actuaciones' },
  { radicado: '2026-037', estado: 'OBSERVACIONES', tecnico: 'Diana Uribe', revisorEstruc: 'Alejandra Calderon', ldf: '2026-05-03', observaciones: '2026-05-06', extension: true, tipoLicencia: 'Parcelación' },
  { radicado: '2026-038', estado: 'REV ARQ', tecnico: 'Adriana Marulanda', revisorEstruc: 'Camilo Rodriguez', ldf: '2026-05-08', observaciones: null, extension: false, tipoLicencia: 'Otras Actuaciones' },
];

const teamMembers = [
  { name: 'Diana Uribe', role: 'Arquitecta' },
  { name: 'Adriana Marulanda', role: 'Arquitecta' },
  { name: 'Laura Arandia', role: 'Arquitecta' },
  { name: 'Camila Marulanda', role: 'Arquitecta' },
  { name: 'Alejandra Calderon', role: 'Ingeniera' },
  { name: 'Camilo Rodriguez', role: 'Ingeniero' },
  { name: 'Jorge Obed', role: 'Ingeniero' },
];

function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [menuOpen, setMenuOpen] = useState(false);

  const stats = useMemo(() => {
    const total = projectsData.length;
    const aprobados = projectsData.filter(p => p.estado === 'APROBADO').length;
    const noLdf = projectsData.filter(p => p.estado === 'NO LDF').length;
    const porcentajeAprobacion = ((aprobados / total) * 100).toFixed(1);
    
    return { total, aprobados, noLdf, porcentajeAprobacion };
  }, []);

  const monthlyData = useMemo(() => {
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May'];
    return months.map(month => {
      const count = projectsData.filter(p => {
        const monthMap = { 'Ene': '01', 'Feb': '02', 'Mar': '03', 'Abr': '04', 'May': '05' };
        return p.ldf.includes(`2026-${monthMap[month]}`);
      }).length;
      return { month, count };
    });
  }, []);

  const statusData = useMemo(() => {
    const states = {};
    projectsData.forEach(p => {
      states[p.estado] = (states[p.estado] || 0) + 1;
    });
    return Object.entries(states).map(([name, value]) => ({ name, value }));
  }, []);

  const technicianData = useMemo(() => {
    const techs = {};
    projectsData.forEach(p => {
      techs[p.tecnico] = (techs[p.tecnico] || 0) + 1;
    });
    return Object.entries(techs).map(([name, projects]) => ({ name, projects }));
  }, []);

  const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6'];

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <div className="navbar-content">
          <h1 className="navbar-title">📊 Curaduría Urbana N.° 2 - Pereira</h1>
          <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      <div className="tabs">
        {['dashboard', 'proyectos', 'técnicos'].map(tab => (
          <button
            key={tab}
            className={`tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => { setActiveTab(tab); setMenuOpen(false); }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="content">
        {activeTab === 'dashboard' && (
          <div>
            <div className="kpi-grid">
              <div className="kpi-card">
                <div className="kpi-number">{stats.total}</div>
                <div className="kpi-label">Total de Proyectos</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-number">{stats.aprobados}</div>
                <div className="kpi-label">Aprobados</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-number">{stats.noLdf}</div>
                <div className="kpi-label">Sin LDF</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-number">{stats.porcentajeAprobacion}%</div>
                <div className="kpi-label">% Aprobación</div>
              </div>
            </div>

            <div className="charts-grid">
              <div className="chart-container">
                <h3>Proyectos por Mes</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-container">
                <h3>Distribución por Estado</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={statusData} cx="50%" cy="50%" labelLine={false} label={({name, value}) => `${name}: ${value}`} outerRadius={100} fill="#8884d8" dataKey="value">
                      {statusData.map((entry, index) => <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'proyectos' && (
          <div>
            <h2 style={{ marginBottom: '20px' }}>Listado de Proyectos</h2>
            <div className="table-container">
              <table className="projects-table">
                <thead>
                  <tr>
                    <th>Radicado</th>
                    <th>Estado</th>
                    <th>Técnico</th>
                    <th>Revisor Estruc.</th>
                    <th>LDF</th>
                    <th>Tipo</th>
                  </tr>
                </thead>
                <tbody>
                  {projectsData.map((project, idx) => (
                    <tr key={idx}>
                      <td className="radicado-cell">{project.radicado}</td>
                      <td><span className={`status-badge status-${project.estado.replace(/\s/g, '-')}`}>{project.estado}</span></td>
                      <td>{project.tecnico}</td>
                      <td>{project.revisorEstruc}</td>
                      <td>{project.ldf}</td>
                      <td>{project.tipoLicencia}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'técnicos' && (
          <div>
            <h2 style={{ marginBottom: '20px' }}>Productividad por Técnico</h2>
            <div className="tech-grid">
              {technicianData.map((tech, idx) => (
                <div key={idx} className="tech-card">
                  <div className="tech-name">{tech.name}</div>
                  <div className="tech-projects">{tech.projects} proyectos</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Dashboard />
  </React.StrictMode>
);
