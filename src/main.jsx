import React, { useState, useMemo, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Menu, X, Printer, Clock, TrendingUp, Users, FileText, LayoutDashboard, Timer, ListChecks, BookOpen, Award, History, Tv, Search, LogOut } from 'lucide-react';

/* =========================================================
   DATOS DE PROYECTOS
   ========================================================= */
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

const CURADOR = 'Luis Fernando Montes';

/* =========================================================
   FESTIVOS COLOMBIA 2026 Y DIAS HABILES
   ========================================================= */
const HOLIDAYS_2026 = [
  '2026-01-01', '2026-01-12', '2026-03-23', '2026-04-02', '2026-04-03',
  '2026-05-01', '2026-05-18', '2026-06-08', '2026-06-15', '2026-06-29',
  '2026-07-20', '2026-08-07', '2026-08-17', '2026-10-12', '2026-11-02',
  '2026-11-16', '2026-12-08', '2026-12-25'
];

const toDate = (str) => {
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
};

const isBusinessDay = (date) => {
  const day = date.getDay();
  if (day === 0 || day === 6) return false;
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return !HOLIDAYS_2026.includes(`${y}-${m}-${d}`);
};

const addBusinessDays = (startStr, n) => {
  const date = toDate(startStr);
  let count = 0;
  while (count < n) {
    date.setDate(date.getDate() + 1);
    if (isBusinessDay(date)) count++;
  }
  return date;
};

const businessDaysFromToday = (targetDate) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(targetDate);
  target.setHours(0, 0, 0, 0);
  if (target.getTime() === today.getTime()) return 0;
  let count = 0;
  const cur = new Date(today);
  if (target > today) {
    while (cur < target) {
      cur.setDate(cur.getDate() + 1);
      if (isBusinessDay(cur)) count++;
    }
    return count;
  } else {
    while (cur > target) {
      cur.setDate(cur.getDate() - 1);
      if (isBusinessDay(cur)) count--;
    }
    return count;
  }
};

const fmtDate = (date) => {
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
};

const involucrado = (nombre) =>
  projectsData.filter(p => p.tecnico === nombre || p.revisorEstruc === nombre).length;

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6'];
const MONTH_MAP = { 'Ene': '01', 'Feb': '02', 'Mar': '03', 'Abr': '04', 'May': '05' };

/* =========================================================
   CSS
   ========================================================= */
const STYLES = `
:root{
  --primary:#3b82f6; --success:#10b981; --danger:#ef4444; --warning:#f59e0b;
  --dark:#1f2937; --light:#f9fafb; --border:#e5e7eb; --muted:#6b7280;
}
*{box-sizing:border-box;}
body{margin:0;background:var(--light);color:var(--dark);
  font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto',sans-serif;}
.app{min-height:100vh;display:flex;flex-direction:column;}
.navbar{background:#fff;border-bottom:1px solid var(--border);padding:14px 24px;
  position:sticky;top:0;z-index:100;box-shadow:0 1px 3px rgba(0,0,0,.08);}
.navbar-content{max-width:1400px;margin:0 auto;display:flex;justify-content:space-between;align-items:center;}
.navbar-title{font-size:20px;font-weight:700;}
.navbar-sub{font-size:12px;color:var(--muted);font-weight:500;}
.tabs{background:#fff;border-bottom:1px solid var(--border);padding:0 16px;
  display:flex;gap:2px;overflow-x:auto;max-width:1400px;margin:0 auto;width:100%;}
.tab{background:none;border:none;padding:14px 16px;cursor:pointer;font-size:13px;font-weight:600;
  color:var(--muted);border-bottom:3px solid transparent;white-space:nowrap;display:flex;
  align-items:center;gap:6px;transition:.2s;}
.tab:hover{color:var(--primary);}
.tab.active{color:var(--primary);border-bottom-color:var(--primary);}
.content{max-width:1400px;margin:0 auto;padding:28px 20px;width:100%;}
h2.section-title{font-size:20px;margin:0 0 18px;}
p.section-desc{color:var(--muted);font-size:14px;margin:-12px 0 20px;}
.kpi-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;margin-bottom:32px;}
.kpi-card{background:#fff;padding:22px;border-radius:12px;border:1px solid var(--border);
  text-align:center;box-shadow:0 1px 3px rgba(0,0,0,.05);transition:.2s;}
.kpi-card:hover{transform:translateY(-2px);box-shadow:0 6px 16px rgba(0,0,0,.08);}
.kpi-number{font-size:34px;font-weight:700;color:var(--primary);}
.kpi-label{font-size:13px;color:var(--muted);font-weight:600;margin-top:4px;}
.charts-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(360px,1fr));gap:20px;margin-bottom:24px;}
.card{background:#fff;padding:22px;border-radius:12px;border:1px solid var(--border);box-shadow:0 1px 3px rgba(0,0,0,.05);}
.card h3{margin:0 0 16px;font-size:15px;}
.table-container{background:#fff;border-radius:12px;border:1px solid var(--border);overflow-x:auto;box-shadow:0 1px 3px rgba(0,0,0,.05);}
table{width:100%;border-collapse:collapse;}
thead{background:var(--light);border-bottom:2px solid var(--border);}
th{padding:12px 14px;text-align:left;font-weight:700;font-size:13px;}
tbody tr{border-bottom:1px solid var(--border);transition:.15s;}
tbody tr:hover{background:var(--light);}
td{padding:11px 14px;font-size:13px;}
.radicado-cell{font-weight:600;color:var(--primary);}
.badge{display:inline-block;padding:3px 11px;border-radius:20px;font-size:11px;font-weight:700;white-space:nowrap;}
.b-APROBADO{background:#d1fae5;color:#065f46;}
.b-NO-LDF{background:#fecaca;color:#991b1b;}
.b-OBSERVACIONES{background:#fef3c7;color:#92400e;}
.b-REV-ARQ,.b-REV-ESTRUC,.b-REV-ESTRUC-2{background:#dbeafe;color:#0c2d6b;}
.search-bar{display:flex;align-items:center;gap:8px;background:#fff;border:1px solid var(--border);
  border-radius:10px;padding:9px 14px;margin-bottom:16px;max-width:420px;}
.search-bar input{border:none;outline:none;font-size:14px;width:100%;}
.btn{background:var(--primary);color:#fff;border:none;padding:10px 18px;border-radius:9px;
  font-size:14px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:7px;}
.btn:hover{background:#2563eb;}
.btn-logout{background:#ef4444;}
.btn-logout:hover{background:#dc2626;}
.btn-tv{background:#f59e0b;}
.btn-tv:hover{background:#d97706;}
.tech-selector{min-height:100vh;background:linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  display:flex;align-items:center;justify-content:center;padding:20px;}
.tech-selector-content{max-width:500px;width:100%;text-align:center;}
.tech-selector-title{font-size:32px;font-weight:800;color:#fff;margin:0 0 8px;}
.tech-selector-sub{font-size:14px;color:#cbd5e1;margin:0 0 40px;}
.tech-buttons-wrapper{display:grid;grid-template-columns:1fr;gap:10px;}
.tech-button{background:#1e293b;border:1px solid #334155;border-radius:12px;padding:14px 16px;
  cursor:pointer;display:grid;grid-template-columns:50px 1fr 20px;align-items:center;gap:16px;transition:.2s;
  text-align:left;min-height:70px;}
.tech-button:hover{background:#334155;border-color:#475569;}
.tech-avatar{width:50px;height:50px;border-radius:50%;background:#ef4444;
  display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:16px;}
.tech-button-text{display:flex;flex-direction:column;justify-content:center;}
.tech-button-name{font-size:15px;font-weight:700;color:#fff;}
.tech-button-role{font-size:12px;color:#94a3b8;margin-top:2px;}
.tech-button-arrow{color:#60a5fa;font-size:18px;}
.project-card{background:#fff;border-left:6px solid var(--primary);border-radius:10px;
  padding:16px;margin-bottom:14px;box-shadow:0 1px 3px rgba(0,0,0,.05);}
.project-card.urgent{border-left-color:var(--danger);}
.project-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;}
.project-rad{font-weight:700;color:var(--primary);font-size:15px;}
.project-status{display:flex;align-items:center;gap:8px;}
.project-title{font-size:15px;font-weight:600;margin:8px 0 4px;}
.project-meta{font-size:12px;color:var(--muted);margin:4px 0;}
.project-urgency{background:var(--danger);color:#fff;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:700;}
.hist-item{display:flex;gap:12px;padding:12px 0;border-bottom:1px solid var(--border);font-size:13px;}
.hist-date{color:var(--muted);min-width:90px;}
.hist-dot{width:9px;height:9px;border-radius:50%;background:var(--primary);margin-top:5px;flex-shrink:0;}
.term-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px;}
.term-card{background:#fff;border:1px solid var(--border);border-radius:12px;padding:16px;
  box-shadow:0 1px 3px rgba(0,0,0,.05);border-left:6px solid var(--border);}
.term-card.green{border-left-color:var(--success);}
.term-card.orange{border-left-color:var(--warning);}
.term-card.red{border-left-color:var(--danger);}
.term-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;}
.term-rad{font-weight:700;color:var(--primary);}
.term-dot{width:12px;height:12px;border-radius:50%;}
.dot-green{background:var(--success);} .dot-orange{background:var(--warning);} .dot-red{background:var(--danger);}
.term-row{font-size:13px;color:var(--muted);margin:3px 0;display:flex;justify-content:space-between;}
.term-days{font-size:22px;font-weight:700;margin-top:8px;}
.term-days.green{color:var(--success);} .term-days.orange{color:var(--warning);} .term-days.red{color:var(--danger);}
.bita-item{background:#fff;border:1px solid var(--border);border-radius:10px;padding:14px 16px;
  margin-bottom:10px;box-shadow:0 1px 2px rgba(0,0,0,.04);display:flex;gap:12px;align-items:flex-start;}
.bita-ico{width:34px;height:34px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;color:#fff;}
.bita-title{font-weight:700;font-size:14px;}
.bita-text{font-size:13px;color:var(--muted);margin-top:2px;}
.tech-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:16px;}
.tech-card{background:#fff;padding:20px;border-radius:12px;border:1px solid var(--border);
  box-shadow:0 1px 3px rgba(0,0,0,.05);transition:.2s;}
.tech-card:hover{transform:translateY(-2px);}
.tech-name{font-weight:700;font-size:15px;}
.tech-role{font-size:12px;color:var(--muted);margin-bottom:10px;}
.tech-stat{display:flex;justify-content:space-between;font-size:13px;margin:4px 0;}
.tech-bignum{font-size:30px;font-weight:700;color:var(--primary);}
.prod-bar{height:8px;background:#e5e7eb;border-radius:4px;overflow:hidden;width:80px;display:inline-block;vertical-align:middle;margin-right:8px;}
.prod-bar span{display:block;height:100%;}
.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.5);display:flex;align-items:flex-start;
  justify-content:center;padding:30px;overflow-y:auto;z-index:1000;}
.modal{background:#fff;border-radius:12px;max-width:800px;width:100%;padding:34px;}
.modal-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:18px;}
.doc h1{font-size:22px;margin:0 0 4px;}
.doc h2{font-size:15px;margin:22px 0 8px;border-bottom:2px solid var(--border);padding-bottom:5px;}
.doc p{font-size:14px;line-height:1.6;}
.doc ul{font-size:14px;line-height:1.7;}
.tv{position:fixed;inset:0;background:#0f172a;color:#fff;z-index:2000;padding:30px 40px;overflow-y:auto;}
.tv-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;}
.tv-title{font-size:28px;font-weight:800;text-transform:uppercase;letter-spacing:2px;}
.tv-subtitle{font-size:12px;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;}
.tv-clock{font-size:48px;font-weight:800;font-variant-numeric:tabular-nums;color:#f59e0b;}
.tv-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:24px;}
.tv-kpi{background:#1e293b;border-radius:10px;padding:20px;text-align:center;border:1px solid #334155;}
.tv-kpi .n{font-size:34px;font-weight:800;color:#60a5fa;}
.tv-kpi .l{font-size:12px;color:#94a3b8;margin-top:4px;text-transform:uppercase;}
.tv-panel{background:#1e293b;border-radius:10px;padding:18px;margin-bottom:16px;border:1px solid #334155;}
.tv-panel h3{margin:0 0 12px;font-size:13px;color:#e2e8f0;text-transform:uppercase;font-weight:700;}
.tv-rank{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #334155;font-size:13px;color:#cbd5e1;}
.tv-rank:last-child{border-bottom:none;}
.tv-bar{height:6px;background:#334155;border-radius:3px;overflow:hidden;margin-top:4px;margin-bottom:8px;}
.tv-bar span{display:block;height:100%;background:#60a5fa;}
.tv-move{display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #334155;font-size:14px;color:#cbd5e1;}
.tv-move:last-child{border-bottom:none;}
.tv-close{position:fixed;top:20px;right:24px;background:#ef4444;border:none;color:#fff;
  padding:8px 14px;border-radius:8px;cursor:pointer;font-weight:600;font-size:13px;}
.tv-close:hover{background:#dc2626;}
@media print{
  body *{visibility:hidden;}
  .modal,.modal *{visibility:visible;}
  .modal{position:absolute;left:0;top:0;box-shadow:none;}
}
@media (max-width:768px){
  .navbar-title{font-size:16px;}
  .tv-grid{grid-template-columns:repeat(2,1fr);}
  .tv-kpi .n{font-size:24px;}
}
`;

/* =========================================================
   DASHBOARD
   ========================================================= */
function Dashboard() {
  const total = projectsData.length;
  const aprobados = projectsData.filter(p => p.estado === 'APROBADO').length;
  const noLdf = projectsData.filter(p => p.estado === 'NO LDF').length;
  const enRevision = projectsData.filter(p => p.estado.startsWith('REV')).length;
  const pctAprob = ((aprobados / total) * 100).toFixed(1);
  const monthlyData = ['Ene', 'Feb', 'Mar', 'Abr', 'May'].map(month => ({
    month,
    cantidad: projectsData.filter(p => p.ldf.includes(`2026-${MONTH_MAP[month]}`)).length
  }));
  const statusCounts = {};
  projectsData.forEach(p => { statusCounts[p.estado] = (statusCounts[p.estado] || 0) + 1; });
  const statusData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
  return (
    <div>
      <div className="kpi-grid">
        <div className="kpi-card"><div className="kpi-number">{total}</div><div className="kpi-label">Total de Proyectos</div></div>
        <div className="kpi-card"><div className="kpi-number">{aprobados}</div><div className="kpi-label">Aprobados</div></div>
        <div className="kpi-card"><div className="kpi-number">{enRevision}</div><div className="kpi-label">En Revisión</div></div>
        <div className="kpi-card"><div className="kpi-number">{noLdf}</div><div className="kpi-label">Sin LDF</div></div>
        <div className="kpi-card"><div className="kpi-number">{pctAprob}%</div><div className="kpi-label">% Aprobación</div></div>
      </div>
      <div className="charts-grid">
        <div className="card">
          <h3>Proyectos por Mes</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" /><YAxis allowDecimals={false} /><Tooltip />
              <Bar dataKey="cantidad" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <h3>Distribución por Estado</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" labelLine={false}
                label={({ name, value }) => `${name}: ${value}`} outerRadius={95} dataKey="value">
                {statusData.map((e, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   TERMINOS
   ========================================================= */
function semaforoColor(dias, vencido) {
  if (vencido || dias < 3) return 'red';
  if (dias <= 7) return 'orange';
  return 'green';
}
function Terminos() {
  const items = projectsData
    .filter(p => p.estado !== 'APROBADO' && p.estado !== 'NO LDF')
    .map(p => {
      const deadline = addBusinessDays(p.ldf, 45);
      const dias = businessDaysFromToday(deadline);
      const vencido = dias < 0;
      return { ...p, deadline, dias, vencido, color: semaforoColor(dias, vencido) };
    })
    .sort((a, b) => a.dias - b.dias);
  const enRojo = items.filter(i => i.color === 'red').length;
  const enNaranja = items.filter(i => i.color === 'orange').length;
  const enVerde = items.filter(i => i.color === 'green').length;
  return (
    <div>
      <h2 className="section-title">Términos y Plazos Legales</h2>
      <p className="section-desc">Plazo legal de la Curaduría: 45 días hábiles desde la fecha LDF. Semáforo: verde &gt;7 días, naranja 3-7 días, rojo &lt;3 días o vencido.</p>
      <div className="kpi-grid">
        <div className="kpi-card"><div className="kpi-number" style={{ color: 'var(--success)' }}>{enVerde}</div><div className="kpi-label">En plazo (verde)</div></div>
        <div className="kpi-card"><div className="kpi-number" style={{ color: 'var(--warning)' }}>{enNaranja}</div><div className="kpi-label">Por vencer (naranja)</div></div>
        <div className="kpi-card"><div className="kpi-number" style={{ color: 'var(--danger)' }}>{enRojo}</div><div className="kpi-label">Críticos / vencidos (rojo)</div></div>
      </div>
      <div className="term-grid">
        {items.map(it => (
          <div key={it.radicado} className={`term-card ${it.color}`}>
            <div className="term-head">
              <span className="term-rad">{it.radicado}</span>
              <span className={`term-dot dot-${it.color}`}></span>
            </div>
            <div className="term-row"><span>Estado</span><span><span className={`badge b-${it.estado.replace(/\s/g, '-')}`}>{it.estado}</span></span></div>
            <div className="term-row"><span>LDF</span><span>{it.ldf}</span></div>
            <div className="term-row"><span>Vence</span><span>{fmtDate(it.deadline)}</span></div>
            <div className={`term-days ${it.color}`}>
              {it.vencido ? `Vencido hace ${Math.abs(it.dias)} días` : `${it.dias} días hábiles`}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   PROYECTOS
   ========================================================= */
function Proyectos() {
  const [query, setQuery] = useState('');
  const [estadoF, setEstadoF] = useState('TODOS');
  const [tecnicoF, setTecnicoF] = useState('TODOS');
  const estados = ['TODOS', ...Array.from(new Set(projectsData.map(p => p.estado)))];
  const tecnicos = ['TODOS', ...Array.from(new Set(projectsData.map(p => p.tecnico)))];
  const filtered = projectsData.filter(p => {
    const q = query.toLowerCase();
    const matchQuery = !q || p.radicado.toLowerCase().includes(q) ||
      p.tecnico.toLowerCase().includes(q) || p.revisorEstruc.toLowerCase().includes(q);
    const matchEstado = estadoF === 'TODOS' || p.estado === estadoF;
    const matchTec = tecnicoF === 'TODOS' || p.tecnico === tecnicoF;
    return matchQuery && matchEstado && matchTec;
  });
  return (
    <div>
      <h2 className="section-title">Listado de Proyectos ({filtered.length})</h2>
      <div className="search-bar">
        <Search size={18} color="#6b7280" />
        <input placeholder="Buscar radicado, técnico o revisor..." value={query} onChange={e => setQuery(e.target.value)} />
      </div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
        <select value={estadoF} onChange={e => setEstadoF(e.target.value)} style={{ padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, background: '#fff' }}>
          {estados.map(e => <option key={e} value={e}>{e === 'TODOS' ? 'Todos los estados' : e}</option>)}
        </select>
        <select value={tecnicoF} onChange={e => setTecnicoF(e.target.value)} style={{ padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, background: '#fff' }}>
          {tecnicos.map(t => <option key={t} value={t}>{t === 'TODOS' ? 'Todos los técnicos' : t}</option>)}
        </select>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Radicado</th><th>Estado</th><th>Técnico</th><th>Revisor Estruc.</th>
              <th>LDF</th><th>Tipo</th><th>Prórroga</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => (
              <tr key={i}>
                <td className="radicado-cell">{p.radicado}</td>
                <td><span className={`badge b-${p.estado.replace(/\s/g, '-')}`}>{p.estado}</span></td>
                <td>{p.tecnico}</td>
                <td>{p.revisorEstruc}</td>
                <td>{p.ldf}</td>
                <td>{p.tipoLicencia}</td>
                <td>{p.extension ? 'Sí (15 días)' : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* =========================================================
   TECNICOS
   ========================================================= */
function Tecnicos() {
  const data = teamMembers.map(m => {
    const comoTecnico = projectsData.filter(p => p.tecnico === m.name).length;
    const comoRevisor = projectsData.filter(p => p.revisorEstruc === m.name).length;
    const totalInvol = involucrado(m.name);
    return { ...m, comoTecnico, comoRevisor, totalInvol };
  }).sort((a, b) => b.totalInvol - a.totalInvol);
  const maxCarga = Math.max(...data.map(d => d.totalInvol));
  return (
    <div>
      <h2 className="section-title">Productividad del Equipo</h2>
      <p className="section-desc">Se cuenta cada proyecto donde la persona participa como revisor arquitectónico (técnico) o como revisor estructural.</p>
      <div className="tech-grid">
        {data.map(t => (
          <div key={t.name} className="tech-card">
            <div className="tech-name">{t.name}</div>
            <div className="tech-role">{t.role}</div>
            <div className="tech-bignum">{t.totalInvol}</div>
            <div className="tech-stat"><span>Como técnico</span><strong>{t.comoTecnico}</strong></div>
            <div className="tech-stat"><span>Como rev. estruc.</span><strong>{t.comoRevisor}</strong></div>
            {t.totalInvol === maxCarga && <div style={{ marginTop: 8, fontSize: 11, color: 'var(--danger)', fontWeight: 700 }}>⚠ Mayor carga</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   BITACORA
   ========================================================= */
function Bitacora() {
  const total = projectsData.length;
  const aprobados = projectsData.filter(p => p.estado === 'APROBADO').length;
  const noLdf = projectsData.filter(p => p.estado === 'NO LDF').length;
  const observaciones = projectsData.filter(p => p.estado === 'OBSERVACIONES').length;
  const conProrroga = projectsData.filter(p => p.extension).length;
  const cargas = teamMembers.map(m => ({ name: m.name, n: involucrado(m.name) })).sort((a, b) => b.n - a.n);
  const masCargado = cargas[0];
  const menosCargado = cargas[cargas.length - 1];
  const tipoCounts = {};
  projectsData.forEach(p => { tipoCounts[p.tipoLicencia] = (tipoCounts[p.tipoLicencia] || 0) + 1; });
  const tipoTop = Object.entries(tipoCounts).sort((a, b) => b[1] - a[1])[0];
  const insights = [
    { ico: '#3b82f6', icon: <FileText size={18} />, title: 'Volumen general', text: `Se gestionan ${total} radicados. ${aprobados} aprobados (${((aprobados / total) * 100).toFixed(0)}%), ${observaciones} en observaciones y ${noLdf} sin LDF.` },
    { ico: '#ef4444', icon: <TrendingUp size={18} />, title: 'Distribución de carga', text: `${masCargado.name} es quien más proyectos tiene (${masCargado.n}). ${menosCargado.name} es quien menos tiene (${menosCargado.n}).` },
    { ico: '#f59e0b', icon: <Clock size={18} />, title: 'Prórrogas activas', text: `${conProrroga} proyectos tienen prórroga de 15 días.` },
    { ico: '#10b981', icon: <ListChecks size={18} />, title: 'Tipo predominante', text: `"${tipoTop[0]}" es el tipo más frecuente con ${tipoTop[1]} radicados.` },
  ];
  return (
    <div>
      <h2 className="section-title">Bitácora — Análisis Automático</h2>
      <p className="section-desc">Resumen generado a partir de los datos actuales de la curaduría.</p>
      {insights.map((it, i) => (
        <div key={i} className="bita-item">
          <div className="bita-ico" style={{ background: it.ico }}>{it.icon}</div>
          <div>
            <div className="bita-title">{it.title}</div>
            <div className="bita-text">{it.text}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* =========================================================
   CURADOR (ACTUALIZADO)
   ========================================================= */
function Curador() {
  const [showDoc, setShowDoc] = useState(false);
  const total = projectsData.length;
  const aprobados = projectsData.filter(p => p.estado === 'APROBADO').length;
  const enTramite = total - aprobados;
  const pctAprob = ((aprobados / total) * 100).toFixed(0);
  const hoy = fmtDate(new Date());

  const productividad = teamMembers.map(m => {
    const asignados = projectsData.filter(p => p.tecnico === m.name);
    const tot = asignados.length;
    const apr = asignados.filter(p => p.estado === 'APROBADO').length;
    const enRev = asignados.filter(p => p.estado.startsWith('REV')).length;
    const pct = tot > 0 ? Math.round((apr / tot) * 100) : 0;
    return { ...m, tot, apr, enRev, pct };
  }).sort((a, b) => b.tot - a.tot);

  const pctColor = (pct) => pct >= 50 ? '#10b981' : pct >= 20 ? '#f59e0b' : '#ef4444';

  return (
    <div>
      <h2 className="section-title">Vista del Curador</h2>
      <p className="section-desc">Panel ejecutivo para {CURADOR}, Curador Urbano N.° 2 de Pereira.</p>

      <div className="kpi-grid">
        <div className="kpi-card"><div className="kpi-number">{total}</div><div className="kpi-label">Total Radicados</div></div>
        <div className="kpi-card"><div className="kpi-number" style={{ color: 'var(--success)' }}>{aprobados}</div><div className="kpi-label">Aprobados</div></div>
        <div className="kpi-card"><div className="kpi-number" style={{ color: 'var(--warning)' }}>{enTramite}</div><div className="kpi-label">En Trámite</div></div>
        <div className="kpi-card"><div className="kpi-number" style={{ color: '#8b5cf6' }}>{pctAprob}%</div><div className="kpi-label">Tasa de Aprobación</div></div>
      </div>

      <button className="btn" style={{ marginBottom: 20 }} onClick={() => setShowDoc(true)}><Printer size={17} />Generar Informe PDF</button>

      <div className="card">
        <h3>📊 Resumen de Productividad</h3>
        <div className="table-container" style={{ border: 'none', boxShadow: 'none' }}>
          <table>
            <thead>
              <tr>
                <th>Técnico</th><th>Rol</th><th>Total</th><th>Aprobados</th><th>En Rev.</th><th>% Aprob.</th>
              </tr>
            </thead>
            <tbody>
              {productividad.map(p => (
                <tr key={p.name}>
                  <td style={{ fontWeight: 600 }}>{p.name}</td>
                  <td style={{ color: 'var(--muted)' }}>{p.role}</td>
                  <td style={{ fontWeight: 700 }}>{p.tot}</td>
                  <td style={{ color: 'var(--success)', fontWeight: 700 }}>{p.apr}</td>
                  <td style={{ color: 'var(--primary)', fontWeight: 700 }}>{p.enRev}</td>
                  <td>
                    <div className="prod-bar"><span style={{ width: `${p.pct}%`, background: pctColor(p.pct) }}></span></div>
                    <strong style={{ color: pctColor(p.pct) }}>{p.pct}%</strong>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showDoc && (
        <div className="modal-overlay" onClick={() => setShowDoc(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <strong>Informe Ejecutivo</strong>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn" onClick={() => window.print()}><Printer size={16} />Imprimir</button>
                <button className="btn" style={{ background: '#6b7280' }} onClick={() => setShowDoc(false)}>Cerrar</button>
              </div>
            </div>
            <div className="doc">
              <h1>Informe Ejecutivo de Gestión</h1>
              <p style={{ color: '#6b7280' }}>Curaduría Urbana N.° 2 de Pereira · {CURADOR} · {hoy}</p>
              <h2>1. Resumen general</h2>
              <p>Se han radicado {total} proyectos estratégicos. De estos, {aprobados} han sido aprobados
                ({pctAprob}% de tasa de aprobación) y {enTramite} se encuentran en trámite.</p>
              <h2>2. Productividad por técnico</h2>
              <ul>
                {productividad.map(p => (
                  <li key={p.name}>{p.name} ({p.role}): {p.tot} asignados, {p.apr} aprobados, {p.pct}% de aprobación.</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   HISTORIAL
   ========================================================= */
const historialData = [
  { fecha: '11/06/2026', txt: 'Mejoras en Vista del Curador y Modo TV (estado general y movimientos).' },
  { fecha: '10/06/2026', txt: 'Despliegue en producción (Vercel).' },
];
function Historial() {
  return (
    <div>
      <h2 className="section-title">Historial de Cambios</h2>
      <div className="card">
        {historialData.map((h, i) => (
          <div key={i} className="hist-item">
            <div className="hist-dot"></div>
            <div className="hist-date">{h.fecha}</div>
            <div>{h.txt}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   VISTA TECNICO
   ========================================================= */
function VistaTecnico({ tecnicoName, onLogout }) {
  const tecnico = teamMembers.find(t => t.name === tecnicoName);
  const misProjetos = projectsData.filter(p => p.tecnico === tecnicoName || p.revisorEstruc === tecnicoName);
  const aprobados = misProjetos.filter(p => p.estado === 'APROBADO').length;
  const enRevision = misProjetos.filter(p => p.estado.startsWith('REV')).length;
  const total = misProjetos.length;
  const misProyectosConDeadline = misProjetos.map(p => {
    const deadline = addBusinessDays(p.ldf, 45);
    const dias = businessDaysFromToday(deadline);
    const vencido = dias < 0;
    return { ...p, deadline, dias, vencido };
  }).sort((a, b) => a.dias - b.dias);
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 className="section-title" style={{ margin: 0 }}>Mis Proyectos — {tecnicoName}</h2>
          <p className="section-desc">{tecnico.role}</p>
        </div>
        <button className="btn btn-logout" onClick={onLogout}><LogOut size={17} />Cambiar usuario</button>
      </div>
      <div className="kpi-grid">
        <div className="kpi-card"><div className="kpi-number">{total}</div><div className="kpi-label">Mis Proyectos</div></div>
        <div className="kpi-card"><div className="kpi-number">{aprobados}</div><div className="kpi-label">Aprobados</div></div>
        <div className="kpi-card"><div className="kpi-number">{enRevision}</div><div className="kpi-label">En Revisión</div></div>
        <div className="kpi-card"><div className="kpi-number">{total > 0 ? ((aprobados / total) * 100).toFixed(0) : 0}%</div><div className="kpi-label">% Aprobación</div></div>
      </div>
      <h3 style={{ fontSize: 16, marginTop: 28, marginBottom: 14 }}>Detalle de Proyectos</h3>
      <div>
        {misProyectosConDeadline.map((p, i) => (
          <div key={i} className={`project-card ${p.vencido || p.dias < 3 ? 'urgent' : ''}`}>
            <div className="project-header">
              <div>
                <div className="project-rad">{p.radicado}</div>
                <div className="project-title">{p.tipoLicencia}</div>
              </div>
              <div className="project-status">
                <span className={`badge b-${p.estado.replace(/\s/g, '-')}`}>{p.estado}</span>
                {(p.vencido || p.dias < 3) && <span className="project-urgency">⚠ VENCIDO</span>}
              </div>
            </div>
            <div className="project-meta">Fecha LDF: <strong>{p.ldf}</strong></div>
            <div className="project-meta">
              Plazo legal vence: <strong>{fmtDate(p.deadline)}</strong>
              {p.vencido ? ` — Vencido hace ${Math.abs(p.dias)} días` : ` — ${p.dias} días hábiles restantes`}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   SELECTOR DE TECNICO
   ========================================================= */
function TecnicoSelector({ onSelect, onContinue }) {
  return (
    <div className="tech-selector">
      <div className="tech-selector-content">
        <h1 className="tech-selector-title">Curaduría 2 Pereira</h1>
        <p className="tech-selector-sub">Proyectos Estratégicos 2026</p>
        <p style={{ fontSize: 14, color: '#cbd5e1', marginBottom: 32 }}>Selecciona tu nombre para ver tu panorama de proyectos</p>
        <div className="tech-buttons-wrapper">
          {teamMembers.map(member => {
            const initials = member.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
            return (
              <button key={member.name} className="tech-button" onClick={() => onSelect(member.name)}>
                <div className="tech-avatar">{initials}</div>
                <div className="tech-button-text">
                  <div className="tech-button-name">{member.name}</div>
                  <div className="tech-button-role">{member.role}</div>
                </div>
                <div className="tech-button-arrow">›</div>
              </button>
            );
          })}
        </div>
        <div style={{ marginTop: 40, paddingTop: 20, borderTop: '1px solid #334155' }}>
          <button className="btn" onClick={onContinue} style={{ width: '100%', justifyContent: 'center', background: '#475569' }}>
            Continuar al Dashboard General
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   TV MODE (ACTUALIZADO)
   ========================================================= */
function TVMode({ onClose }) {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const total = projectsData.length;
  const aprobados = projectsData.filter(p => p.estado === 'APROBADO').length;
  const enRevision = projectsData.filter(p => p.estado.startsWith('REV')).length;
  const enActa = projectsData.filter(p => p.estado === 'OBSERVACIONES').length;
  const noLdf = projectsData.filter(p => p.estado === 'NO LDF').length;

  const terms = projectsData
    .filter(p => p.estado !== 'APROBADO' && p.estado !== 'NO LDF')
    .map(p => {
      const deadline = addBusinessDays(p.ldf, 45);
      const dias = businessDaysFromToday(deadline);
      const vencido = dias < 0;
      if (vencido || dias < 3) return 'red';
      if (dias <= 7) return 'orange';
      return 'green';
    });
  const termsRed = terms.filter(t => t === 'red').length;
  const termsOrange = terms.filter(t => t === 'orange').length;
  const termsGreen = terms.filter(t => t === 'green').length;

  const ranking = teamMembers.map(m => ({ name: m.name, n: involucrado(m.name) }))
    .sort((a, b) => b.n - a.n).slice(0, 5);
  const maxN = Math.max(...ranking.map(r => r.n));

  const clock = now.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const fecha = now.toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="tv">
      <button className="tv-close" onClick={onClose}>✕ Salir</button>
      <div className="tv-head">
        <div>
          <div className="tv-title">Curaduría 2 Pereira</div>
          <div className="tv-subtitle">Centro de Control · Proyectos Estratégicos</div>
          <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4, textTransform: 'capitalize' }}>{fecha}</div>
        </div>
        <div className="tv-clock">{clock}</div>
      </div>

      <div className="tv-grid">
        <div className="tv-kpi"><div className="n" style={{ color: '#10b981' }}>{aprobados}</div><div className="l">Aprobados</div></div>
        <div className="tv-kpi"><div className="n" style={{ color: '#3b82f6' }}>{enRevision}</div><div className="l">En Revisión</div></div>
        <div className="tv-kpi"><div className="n" style={{ color: '#f59e0b' }}>{enActa}</div><div className="l">En Acta</div></div>
        <div className="tv-kpi"><div className="n" style={{ color: '#ef4444' }}>{noLdf}</div><div className="l">NO LDF</div></div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="tv-panel">
          <h3>Semáforo de Términos</h3>
          <div className="tv-rank"><span style={{ color: '#10b981' }}>En plazo</span><strong style={{ fontSize: 20, color: '#10b981' }}>{termsGreen}</strong></div>
          <div className="tv-rank"><span style={{ color: '#f59e0b' }}>Por vencer</span><strong style={{ fontSize: 20, color: '#f59e0b' }}>{termsOrange}</strong></div>
          <div className="tv-rank"><span style={{ color: '#ef4444' }}>Críticos</span><strong style={{ fontSize: 20, color: '#ef4444' }}>{termsRed}</strong></div>
        </div>
        <div className="tv-panel">
          <h3>Productividad del Equipo</h3>
          {ranking.map(r => (
            <div key={r.name}>
              <div className="tv-rank"><span>{r.name}</span><strong>{r.n}</strong></div>
              <div className="tv-bar"><span style={{ width: `${(r.n / maxN) * 100}%` }}></span></div>
            </div>
          ))}
        </div>
      </div>

      <div className="tv-panel">
        <h3>📰 Últimos Movimientos</h3>
        {historialData.map((h, i) => (
          <div key={i} className="tv-move">
            <span>{h.txt}</span>
            <span style={{ color: '#64748b', whiteSpace: 'nowrap', marginLeft: 16 }}>{h.fecha}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   APP PRINCIPAL
   ========================================================= */
const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
  { id: 'terminos', label: 'Términos', icon: <Timer size={16} /> },
  { id: 'proyectos', label: 'Proyectos', icon: <ListChecks size={16} /> },
  { id: 'tecnicos', label: 'Técnicos', icon: <Users size={16} /> },
  { id: 'bitacora', label: 'Bitácora', icon: <BookOpen size={16} /> },
  { id: 'curador', label: 'Curador', icon: <Award size={16} /> },
  { id: 'historial', label: 'Historial', icon: <History size={16} /> },
];

function App() {
  const [tab, setTab] = useState('dashboard');
  const [tecnicoLogueado, setTecnicoLogueado] = useState(null);
  const [mostrarSelector, setMostrarSelector] = useState(true);
  const [tvMode, setTvMode] = useState(false);

  if (tecnicoLogueado) {
    return (
      <div className="app">
        <style>{STYLES}</style>
        <nav className="navbar">
          <div className="navbar-content">
            <div>
              <div className="navbar-title">📊 Curaduría Urbana N.° 2</div>
              <div className="navbar-sub">Pereira · Vista Técnico</div>
            </div>
          </div>
        </nav>
        <div className="content">
          <VistaTecnico tecnicoName={tecnicoLogueado} onLogout={() => setTecnicoLogueado(null)} />
        </div>
      </div>
    );
  }

  if (mostrarSelector) {
    return (
      <div className="app">
        <style>{STYLES}</style>
        <TecnicoSelector onSelect={setTecnicoLogueado} onContinue={() => setMostrarSelector(false)} />
      </div>
    );
  }

  if (tvMode) {
    return (
      <div className="app">
        <style>{STYLES}</style>
        <TVMode onClose={() => setTvMode(false)} />
      </div>
    );
  }

  return (
    <div className="app">
      <style>{STYLES}</style>
      <nav className="navbar">
        <div className="navbar-content">
          <div>
            <div className="navbar-title">📊 Curaduría Urbana N.° 2</div>
            <div className="navbar-sub">Pereira · Control de Proyectos Estratégicos</div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-tv" onClick={() => setTvMode(true)}><Tv size={17} />Modo TV</button>
            <button className="btn" onClick={() => setMostrarSelector(true)} style={{ background: '#ef4444' }}>Ingreso de Técnico</button>
          </div>
        </div>
      </nav>
      <div className="tabs">
        {TABS.map(t => (
          <button key={t.id} className={`tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
            {t.icon}{t.label}
          </button>
        ))}
      </div>
      <div className="content">
        {tab === 'dashboard' && <Dashboard />}
        {tab === 'terminos' && <Terminos />}
        {tab === 'proyectos' && <Proyectos />}
        {tab === 'tecnicos' && <Tecnicos />}
        {tab === 'bitacora' && <Bitacora />}
        {tab === 'curador' && <Curador />}
        {tab === 'historial' && <Historial />}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
