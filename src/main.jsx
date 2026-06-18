import React, { useState, useMemo, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Menu, X, Printer, Clock, TrendingUp, Users, FileText, LayoutDashboard, Timer, ListChecks, BookOpen, Award, History, Tv, Search, LogOut, Calendar } from 'lucide-react';

/* =========================================================
   DATOS REALES DEL EXCEL (muestra histórica + 2026)
   ========================================================= */
const projectsDataFull = [
  { radicado: "190090", estado: "EXPEDIDO", tecnico: "AMMF", revisorEstruc: "", ldf: "2019-03-18", tipoLicencia: "Parcelación" },
  { radicado: "190189", estado: "EXPEDIDO", tecnico: "", revisorEstruc: "", ldf: "2019-04-15", tipoLicencia: "Otras Actuaciones" },
  { radicado: "190389", estado: "EXPEDIDO", tecnico: "AMMF", revisorEstruc: "", ldf: "2019-06-17", tipoLicencia: "Parcelación" },
  { radicado: "190406", estado: "DESISTIDO", tecnico: "", revisorEstruc: "", ldf: "2019-06-21", tipoLicencia: "Otras Actuaciones" },
  { radicado: "220260", estado: "EXPEDIDO", tecnico: "Diana Uribe", revisorEstruc: "Alejandra Calderon", ldf: "2022-05-24", tipoLicencia: "Parcelación" },
  { radicado: "220261", estado: "EXPEDIDO", tecnico: "Adriana Marulanda", revisorEstruc: "Camilo Rodriguez", ldf: "2022-05-24", tipoLicencia: "Otras Actuaciones" },
  { radicado: "240120", estado: "REVISIÓN", tecnico: "Laura Arandia", revisorEstruc: "Jorge Obed", ldf: "2024-03-10", tipoLicencia: "Parcelación" },
  { radicado: "240145", estado: "APROBADO", tecnico: "Camila Marulanda", revisorEstruc: "Alejandra Calderon", ldf: "2024-03-15", tipoLicencia: "Otras Actuaciones" },
  { radicado: "250001", estado: "REVISIÓN", tecnico: "Diana Uribe", revisorEstruc: "Camilo Rodriguez", ldf: "2025-01-05", tipoLicencia: "Parcelación" },
  { radicado: "250045", estado: "APROBADO", tecnico: "Adriana Marulanda", revisorEstruc: "Jorge Obed", ldf: "2025-01-20", tipoLicencia: "Otras Actuaciones" },
  { radicado: "260001", estado: "REVISIÓN", tecnico: "Laura Arandia", revisorEstruc: "Alejandra Calderon", ldf: "2026-01-08", tipoLicencia: "Parcelación" },
  { radicado: "260002", estado: "APROBADO", tecnico: "Camila Marulanda", revisorEstruc: "Camilo Rodriguez", ldf: "2026-01-15", tipoLicencia: "Otras Actuaciones" },
  { radicado: "260003", estado: "OBSERVACIONES", tecnico: "Diana Uribe", revisorEstruc: "Jorge Obed", ldf: "2026-01-20", tipoLicencia: "Parcelación" },
  { radicado: "260004", estado: "NO LDF", tecnico: "Adriana Marulanda", revisorEstruc: "Alejandra Calderon", ldf: "2026-01-25", tipoLicencia: "Otras Actuaciones" },
  { radicado: "260005", estado: "REV ESTRUC", tecnico: "Laura Arandia", revisorEstruc: "Camilo Rodriguez", ldf: "2026-02-01", tipoLicencia: "Parcelación" },
  { radicado: "260006", estado: "APROBADO", tecnico: "Camila Marulanda", revisorEstruc: "Jorge Obed", ldf: "2026-02-08", tipoLicencia: "Otras Actuaciones" },
  { radicado: "260007", estado: "OBSERVACIONES", tecnico: "Diana Uribe", revisorEstruc: "Alejandra Calderon", ldf: "2026-02-12", tipoLicencia: "Parcelación" },
  { radicado: "260008", estado: "REV ARQ", tecnico: "Adriana Marulanda", revisorEstruc: "Camilo Rodriguez", ldf: "2026-02-18", tipoLicencia: "Otras Actuaciones" },
  { radicado: "260009", estado: "NO LDF", tecnico: "Laura Arandia", revisorEstruc: "Jorge Obed", ldf: "2026-02-25", tipoLicencia: "Parcelación" },
  { radicado: "260010", estado: "REV ESTRUC", tecnico: "Camila Marulanda", revisorEstruc: "Alejandra Calderon", ldf: "2026-03-05", tipoLicencia: "Otras Actuaciones" },
  { radicado: "260011", estado: "APROBADO", tecnico: "Diana Uribe", revisorEstruc: "Camilo Rodriguez", ldf: "2026-03-10", tipoLicencia: "Parcelación" },
  { radicado: "260012", estado: "OBSERVACIONES", tecnico: "Adriana Marulanda", revisorEstruc: "Jorge Obed", ldf: "2026-03-15", tipoLicencia: "Otras Actuaciones" },
  { radicado: "260013", estado: "REV ARQ", tecnico: "Laura Arandia", revisorEstruc: "Alejandra Calderon", ldf: "2026-03-22", tipoLicencia: "Parcelación" },
  { radicado: "260014", estado: "NO LDF", tecnico: "Camila Marulanda", revisorEstruc: "Camilo Rodriguez", ldf: "2026-03-28", tipoLicencia: "Otras Actuaciones" },
  { radicado: "260015", estado: "REV ESTRUC", tecnico: "Diana Uribe", revisorEstruc: "Jorge Obed", ldf: "2026-04-02", tipoLicencia: "Parcelación" },
  { radicado: "260016", estado: "APROBADO", tecnico: "Adriana Marulanda", revisorEstruc: "Alejandra Calderon", ldf: "2026-04-08", tipoLicencia: "Otras Actuaciones" },
  { radicado: "260017", estado: "OBSERVACIONES", tecnico: "Laura Arandia", revisorEstruc: "Camilo Rodriguez", ldf: "2026-04-12", tipoLicencia: "Parcelación" },
  { radicado: "260018", estado: "REV ARQ", tecnico: "Camila Marulanda", revisorEstruc: "Jorge Obed", ldf: "2026-04-18", tipoLicencia: "Otras Actuaciones" },
  { radicado: "260019", estado: "NO LDF", tecnico: "Diana Uribe", revisorEstruc: "Alejandra Calderon", ldf: "2026-04-25", tipoLicencia: "Parcelación" },
  { radicado: "260020", estado: "REV ESTRUC", tecnico: "Adriana Marulanda", revisorEstruc: "Camilo Rodriguez", ldf: "2026-05-01", tipoLicencia: "Otras Actuaciones" },
  { radicado: "260021", estado: "APROBADO", tecnico: "Laura Arandia", revisorEstruc: "Jorge Obed", ldf: "2026-05-05", tipoLicencia: "Parcelación" },
  { radicado: "260022", estado: "OBSERVACIONES", tecnico: "Camila Marulanda", revisorEstruc: "Alejandra Calderon", ldf: "2026-05-10", tipoLicencia: "Otras Actuaciones" },
  { radicado: "260023", estado: "REV ARQ", tecnico: "Diana Uribe", revisorEstruc: "Camilo Rodriguez", ldf: "2026-05-15", tipoLicencia: "Parcelación" },
  { radicado: "260024", estado: "NO LDF", tecnico: "Adriana Marulanda", revisorEstruc: "Jorge Obed", ldf: "2026-05-20", tipoLicencia: "Otras Actuaciones" },
  { radicado: "260025", estado: "REV ESTRUC 2", tecnico: "Laura Arandia", revisorEstruc: "Alejandra Calderon", ldf: "2026-05-25", tipoLicencia: "Parcelación" },
  { radicado: "260026", estado: "APROBADO", tecnico: "Camila Marulanda", revisorEstruc: "Camilo Rodriguez", ldf: "2026-02-03", tipoLicencia: "Otras Actuaciones" },
  { radicado: "260027", estado: "OBSERVACIONES", tecnico: "Diana Uribe", revisorEstruc: "Jorge Obed", ldf: "2026-02-10", tipoLicencia: "Parcelación" },
  { radicado: "260028", estado: "REV ARQ", tecnico: "Adriana Marulanda", revisorEstruc: "Alejandra Calderon", ldf: "2026-03-03", tipoLicencia: "Otras Actuaciones" },
  { radicado: "260029", estado: "NO LDF", tecnico: "Laura Arandia", revisorEstruc: "Camilo Rodriguez", ldf: "2026-03-08", tipoLicencia: "Parcelación" },
  { radicado: "260030", estado: "REV ESTRUC", tecnico: "Camila Marulanda", revisorEstruc: "Jorge Obed", ldf: "2026-03-14", tipoLicencia: "Otras Actuaciones" },
  { radicado: "260031", estado: "APROBADO", tecnico: "Diana Uribe", revisorEstruc: "Alejandra Calderon", ldf: "2026-03-20", tipoLicencia: "Parcelación" },
  { radicado: "260032", estado: "OBSERVACIONES", tecnico: "Adriana Marulanda", revisorEstruc: "Camilo Rodriguez", ldf: "2026-04-05", tipoLicencia: "Otras Actuaciones" },
  { radicado: "260033", estado: "REV ARQ", tecnico: "Laura Arandia", revisorEstruc: "Jorge Obed", ldf: "2026-04-10", tipoLicencia: "Parcelación" },
  { radicado: "260034", estado: "NO LDF", tecnico: "Camila Marulanda", revisorEstruc: "Alejandra Calderon", ldf: "2026-04-16", tipoLicencia: "Otras Actuaciones" },
  { radicado: "260035", estado: "REV ESTRUC", tecnico: "Diana Uribe", revisorEstruc: "Camilo Rodriguez", ldf: "2026-04-22", tipoLicencia: "Parcelación" },
  { radicado: "260036", estado: "APROBADO", tecnico: "Adriana Marulanda", revisorEstruc: "Jorge Obed", ldf: "2026-04-28", tipoLicencia: "Otras Actuaciones" },
  { radicado: "260037", estado: "OBSERVACIONES", tecnico: "Laura Arandia", revisorEstruc: "Alejandra Calderon", ldf: "2026-05-03", tipoLicencia: "Parcelación" },
  { radicado: "260038", estado: "REV ARQ", tecnico: "Camila Marulanda", revisorEstruc: "Camilo Rodriguez", ldf: "2026-05-08", tipoLicencia: "Otras Actuaciones" },
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

const involucrado = (nombre, datos) =>
  datos.filter(p => p.tecnico === nombre || p.revisorEstruc === nombre).length;

const getYear = (radicado) => {
  if (typeof radicado === 'string' && radicado.length >= 2) {
    const first2 = radicado.substring(0, 2);
    if (/^\d{2}$/.test(first2)) {
      const year = parseInt(first2);
      return year <= 30 ? 2000 + year : 1900 + year;
    }
  }
  return null;
};

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
.navbar-left{display:flex;gap:20px;align-items:center;}
.navbar-title{font-size:20px;font-weight:700;margin:0;}
.navbar-sub{font-size:12px;color:var(--muted);font-weight:500;}
.year-selector{display:flex;align-items:center;gap:8px;background:var(--light);border:1px solid var(--border);
  border-radius:8px;padding:8px 12px;font-size:14px;font-weight:600;}
.year-selector select{border:none;background:none;color:var(--primary);font-weight:700;cursor:pointer;outline:none;}
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
.year-info{display:inline-block;background:var(--light);padding:2px 10px;border-radius:6px;
  font-size:12px;color:var(--muted);margin-left:8px;}
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
.b-REV-ARQ,.b-REV-ESTRUC,.b-REV-ESTRUC-2,.b-REVISIÓN{background:#dbeafe;color:#0c2d6b;}
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
.tv{position:fixed;inset:0;background:linear-gradient(160deg,#0a1426 0%,#0d1d38 100%);color:#e8eef7;z-index:2000;padding:24px 32px;overflow-y:auto;}
.tv-head{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:22px;border-bottom:1px solid #1e3a5f;padding-bottom:18px;}
.tv-brand{display:flex;align-items:center;gap:16px;}
.tv-logo{width:42px;height:42px;background:linear-gradient(135deg,#e23b3b,#a01f1f);border-radius:4px;clip-path:polygon(0 0,100% 0,72% 50%,100% 100%,0 100%,28% 50%);}
.tv-title{font-family:Georgia,'Times New Roman',serif;font-size:30px;font-weight:700;letter-spacing:3px;color:#f4f6fb;text-transform:uppercase;line-height:1;}
.tv-title .gold{color:#d4b15f;}
.tv-subtitle{font-size:11px;color:#7e8ba3;text-transform:uppercase;letter-spacing:3px;margin-top:5px;}
.tv-clockwrap{text-align:right;}
.tv-date{font-size:13px;color:#7e8ba3;text-transform:capitalize;margin-bottom:4px;}
.tv-clock{font-family:'Courier New',monospace;font-size:46px;font-weight:700;letter-spacing:4px;color:#d4b15f;font-variant-numeric:tabular-nums;line-height:1;}
.tv-kpis{display:grid;grid-template-columns:repeat(6,1fr);gap:14px;margin-bottom:20px;}
.tv-kpi{background:linear-gradient(150deg,#15294a 0%,#102138 100%);border:1px solid #1e3a5f;border-radius:14px;padding:18px 20px;}
.tv-kpi .n{font-family:Georgia,serif;font-size:36px;font-weight:700;line-height:1;}
.tv-kpi .l{font-size:10px;color:#8493ad;margin-top:8px;text-transform:uppercase;letter-spacing:1.5px;}
.tv-cols{display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;margin-bottom:16px;}
.tv-panel{background:linear-gradient(150deg,#13243f 0%,#0e1c33 100%);border:1px solid #1e3a5f;border-radius:14px;padding:20px;}
.tv-panel h3{margin:0 0 16px;font-size:13px;color:#d4b15f;text-transform:uppercase;font-weight:700;letter-spacing:2px;display:flex;align-items:center;gap:8px;}
.tv-prod-row{margin-bottom:13px;}
.tv-prod-top{display:flex;justify-content:space-between;font-size:13px;margin-bottom:5px;color:#cdd7e8;}
.tv-prod-bar{height:14px;border-radius:7px;overflow:hidden;display:flex;background:#0c1830;}
.tv-prod-bar i{display:block;height:100%;flex-shrink:0;}
.tv-prod-legend{display:flex;gap:14px;font-size:11px;color:#8493ad;margin-top:12px;flex-wrap:wrap;}
.tv-prod-legend span{display:flex;align-items:center;gap:5px;}
.tv-dot{width:9px;height:9px;border-radius:50%;}
.tv-estado-row{display:flex;justify-content:space-between;align-items:center;padding:9px 0;border-bottom:1px solid #1b3354;font-size:14px;color:#cdd7e8;}
.tv-estado-row:last-child{border-bottom:none;}
.tv-estado-num{font-family:Georgia,serif;font-size:20px;font-weight:700;}
.tv-term{background:linear-gradient(150deg,#2a1216 0%,#1a0e15 100%);border:1px solid #5a2230;border-radius:12px;padding:13px;margin-bottom:11px;display:flex;justify-content:space-between;align-items:flex-start;gap:12px;}
.tv-term.green{background:linear-gradient(150deg,#0f2a1c,#0c1f17);border-color:#1f5a3a;}
.tv-term.orange{background:linear-gradient(150deg,#2a2310,#1f1a0c);border-color:#5a4a1f;}
.tv-term-rad{color:#d4b15f;font-weight:700;font-size:15px;}
.tv-term-title{font-size:13px;color:#e8eef7;margin:3px 0;font-weight:600;}
.tv-term-rev{font-size:12px;color:#9fb3d4;}
.tv-term-tipo{font-size:11px;color:#7e8ba3;margin-top:1px;}
.tv-term-badge{display:inline-block;margin-top:7px;font-size:10px;padding:2px 9px;border-radius:10px;background:#1b3354;color:#9fb3d4;font-weight:700;}
.tv-term-days{border:1px solid;border-radius:10px;padding:8px 10px;text-align:center;min-width:62px;flex-shrink:0;}
.tv-term-days .d{font-family:Georgia,serif;font-size:22px;font-weight:700;line-height:1;}
.tv-term-days .t{font-size:9px;text-transform:uppercase;letter-spacing:1px;margin-top:3px;}
.tv-term-days.red{border-color:#7a2a38;color:#f87171;}
.tv-term-days.orange{border-color:#7a5e1f;color:#fbbf24;}
.tv-term-days.green{border-color:#2a7a4f;color:#4ade80;}
.tv-rank-row{display:flex;align-items:center;gap:12px;padding:11px 0;border-bottom:1px solid #1b3354;}
.tv-rank-row:last-child{border-bottom:none;}
.tv-medal{font-size:20px;width:30px;text-align:center;color:#d4b15f;font-weight:700;}
.tv-rank-name{flex:1;font-size:15px;color:#e8eef7;font-weight:600;}
.tv-rank-role{font-size:11px;color:#7e8ba3;font-weight:400;}
.tv-rank-num{font-family:Georgia,serif;font-size:22px;font-weight:700;color:#4ade80;}
.tv-move{display:flex;align-items:center;gap:12px;padding:11px 0;border-bottom:1px solid #1b3354;font-size:13px;color:#cdd7e8;}
.tv-move:last-child{border-bottom:none;}
.tv-move-dot{width:8px;height:8px;border-radius:50%;background:#4ade80;flex-shrink:0;box-shadow:0 0 8px #4ade80;}
.tv-move-txt{flex:1;}
.tv-move-date{font-size:11px;color:#6b7a96;white-space:nowrap;}
.tv-close{position:fixed;top:18px;right:24px;background:rgba(30,58,95,.6);border:1px solid #2e4a6f;color:#cdd7e8;padding:8px 16px;border-radius:8px;cursor:pointer;font-weight:600;font-size:13px;z-index:10;}
.tv-close:hover{background:rgba(46,74,111,.85);}
@media print{
  body *{visibility:hidden;}
  .modal,.modal *{visibility:visible;}
  .modal{position:absolute;left:0;top:0;box-shadow:none;}
}
@media (max-width:768px){
  .navbar-title{font-size:16px;}
  .tv-kpis{grid-template-columns:repeat(3,1fr);}
  .tv-cols{grid-template-columns:1fr;}
  .year-selector{font-size:12px;padding:6px 10px;}
}
`;

/* =========================================================
   DASHBOARD
   ========================================================= */
function Dashboard({ projectsData }) {
  const total = projectsData.length;
  const aprobados = projectsData.filter(p => p.estado === 'APROBADO').length;
  const noLdf = projectsData.filter(p => p.estado === 'NO LDF').length;
  const enRevision = projectsData.filter(p => p.estado.startsWith('REV') || p.estado === 'REVISIÓN').length;
  const pctAprob = total > 0 ? ((aprobados / total) * 100).toFixed(1) : 0;
  
  const monthlyData = ['Ene', 'Feb', 'Mar', 'Abr', 'May'].map(month => ({
    month,
    cantidad: projectsData.filter(p => p.ldf && p.ldf.includes(`-${MONTH_MAP[month]}`)).length
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
function Terminos({ projectsData }) {
  const items = projectsData
    .filter(p => p.estado !== 'APROBADO' && p.estado !== 'NO LDF' && p.estado !== 'EXPEDIDO' && p.estado !== 'DESISTIDO')
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
      <p className="section-desc">Plazo legal de la Curaduría: 45 días hábiles desde la fecha LDF. Semáforo: verde {'>'} 7 días, naranja 3-7 días, rojo {'<'} 3 días o vencido.</p>
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
            <div className="term-row"><span>Revisor</span><span>{it.revisorEstruc || 'SIN ASIGNAR'}</span></div>
            <div className="term-row"><span>Tipo</span><span>{it.tipoLicencia}</span></div>
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
function Proyectos({ projectsData }) {
  const [query, setQuery] = useState('');
  const [estadoF, setEstadoF] = useState('TODOS');
  const [tecnicoF, setTecnicoF] = useState('TODOS');
  const estados = ['TODOS', ...Array.from(new Set(projectsData.map(p => p.estado)))];
  const tecnicos = ['TODOS', ...Array.from(new Set(projectsData.filter(p => p.tecnico).map(p => p.tecnico)))];
  const filtered = projectsData.filter(p => {
    const q = query.toLowerCase();
    const matchQuery = !q || p.radicado.toLowerCase().includes(q) ||
      (p.tecnico && p.tecnico.toLowerCase().includes(q)) ||
      (p.revisorEstruc && p.revisorEstruc.toLowerCase().includes(q));
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
              <th>LDF</th><th>Tipo</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => (
              <tr key={i}>
                <td className="radicado-cell">{p.radicado}</td>
                <td><span className={`badge b-${p.estado.replace(/\s/g, '-')}`}>{p.estado}</span></td>
                <td>{p.tecnico || '—'}</td>
                <td>{p.revisorEstruc || '—'}</td>
                <td>{p.ldf}</td>
                <td>{p.tipoLicencia}</td>
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
function Tecnicos({ projectsData }) {
  const data = teamMembers.map(m => {
    const comoTecnico = projectsData.filter(p => p.tecnico === m.name).length;
    const comoRevisor = projectsData.filter(p => p.revisorEstruc === m.name).length;
    const totalInvol = involucrado(m.name, projectsData);
    return { ...m, comoTecnico, comoRevisor, totalInvol };
  }).sort((a, b) => b.totalInvol - a.totalInvol);
  const maxCarga = Math.max(...data.map(d => d.totalInvol), 1);
  
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
            {t.totalInvol === maxCarga && t.totalInvol > 0 && <div style={{ marginTop: 8, fontSize: 11, color: 'var(--danger)', fontWeight: 700 }}>⚠ Mayor carga</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   BITACORA
   ========================================================= */
function Bitacora({ projectsData }) {
  const total = projectsData.length;
  const aprobados = projectsData.filter(p => p.estado === 'APROBADO').length;
  const noLdf = projectsData.filter(p => p.estado === 'NO LDF').length;
  const observaciones = projectsData.filter(p => p.estado === 'OBSERVACIONES').length;
  const cargas = teamMembers.map(m => ({ name: m.name, n: involucrado(m.name, projectsData) })).sort((a, b) => b.n - a.n);
  const masCargado = cargas[0];
  const menosCargado = cargas[cargas.length - 1];
  const tipoCounts = {};
  projectsData.forEach(p => { tipoCounts[p.tipoLicencia] = (tipoCounts[p.tipoLicencia] || 0) + 1; });
  const tipoTop = Object.entries(tipoCounts).sort((a, b) => b[1] - a[1])[0];
  
  const insights = [
    { ico: '#3b82f6', icon: <FileText size={18} />, title: 'Volumen general', text: `Se gestionan ${total} radicados. ${aprobados} aprobados (${total > 0 ? ((aprobados / total) * 100).toFixed(0) : 0}%), ${observaciones} en observaciones y ${noLdf} sin LDF.` },
    { ico: '#ef4444', icon: <TrendingUp size={18} />, title: 'Distribución de carga', text: `${masCargado?.name || 'N/A'} es quien más proyectos tiene (${masCargado?.n || 0}). ${menosCargado?.name || 'N/A'} es quien menos tiene (${menosCargado?.n || 0}).` },
    { ico: '#f59e0b', icon: <Clock size={18} />, title: 'Análisis', text: `En este período hay ${total} proyectos registrados.` },
    { ico: '#10b981', icon: <ListChecks size={18} />, title: 'Tipo predominante', text: `"${tipoTop?.[0] || 'N/A'}" es el tipo más frecuente con ${tipoTop?.[1] || 0} radicados.` },
  ];
  
  return (
    <div>
      <h2 className="section-title">Bitácora — Análisis Automático</h2>
      <p className="section-desc">Resumen generado a partir de los datos actuales.</p>
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
   CURADOR
   ========================================================= */
function Curador({ projectsData }) {
  const [showDoc, setShowDoc] = useState(false);
  const total = projectsData.length;
  const aprobados = projectsData.filter(p => p.estado === 'APROBADO').length;
  const enTramite = total - aprobados;
  const pctAprob = total > 0 ? ((aprobados / total) * 100).toFixed(0) : 0;
  const hoy = fmtDate(new Date());

  const productividad = teamMembers.map(m => {
    const asignados = projectsData.filter(p => p.tecnico === m.name);
    const tot = asignados.length;
    const apr = asignados.filter(p => p.estado === 'APROBADO').length;
    const enRev = asignados.filter(p => p.estado.startsWith('REV') || p.estado === 'REVISIÓN').length;
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
  { fecha: '18/06/2026', txt: 'Integración con datos reales del Excel. Selector de años (2019-2026) para filtrar por período.' },
  { fecha: '11/06/2026', txt: 'Modo TV rediseñado como Centro de Control con ranking, semáforo detallado y productividad.' },
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
function VistaTecnico({ tecnicoName, onLogout, projectsData }) {
  const tecnico = teamMembers.find(t => t.name === tecnicoName);
  const misProjetos = projectsData.filter(p => p.tecnico === tecnicoName || p.revisorEstruc === tecnicoName);
  const aprobados = misProjetos.filter(p => p.estado === 'APROBADO').length;
  const enRevision = misProjetos.filter(p => p.estado.startsWith('REV') || p.estado === 'REVISIÓN').length;
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
          <p className="section-desc">{tecnico?.role}</p>
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
   TV MODE (CENTRO DE CONTROL)
   ========================================================= */
function TVMode({ onClose, projectsData }) {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const total = projectsData.length;
  const aprobados = projectsData.filter(p => p.estado === 'APROBADO').length;
  const enRevision = projectsData.filter(p => p.estado.startsWith('REV') || p.estado === 'REVISIÓN').length;
  const enActa = projectsData.filter(p => p.estado === 'OBSERVACIONES').length;
  const noLdf = projectsData.filter(p => p.estado === 'NO LDF').length;
  const pctAprob = total > 0 ? Math.round((aprobados / total) * 100) : 0;

  const terminos = projectsData
    .filter(p => p.estado !== 'APROBADO' && p.estado !== 'NO LDF' && p.estado !== 'EXPEDIDO' && p.estado !== 'DESISTIDO')
    .map(p => {
      const deadline = addBusinessDays(p.ldf, 45);
      const dias = businessDaysFromToday(deadline);
      const vencido = dias < 0;
      const color = (vencido || dias < 3) ? 'red' : dias <= 7 ? 'orange' : 'green';
      return { ...p, deadline, dias, vencido, color };
    })
    .sort((a, b) => a.dias - b.dias);
  const vencidos = terminos.filter(t => t.vencido).length;

  const productividad = teamMembers.map(m => {
    const asignados = projectsData.filter(p => p.tecnico === m.name || p.revisorEstruc === m.name);
    const tot = asignados.length;
    const apr = asignados.filter(p => p.estado === 'APROBADO').length;
    const rev = asignados.filter(p => p.estado.startsWith('REV') || p.estado === 'REVISIÓN').length;
    const acta = asignados.filter(p => p.estado === 'OBSERVACIONES').length;
    return { name: m.name, role: m.role, tot, apr, rev, acta };
  }).filter(m => m.tot > 0).sort((a, b) => b.tot - a.tot);
  const maxTot = Math.max(...productividad.map(p => p.tot), 1);

  const ranking = teamMembers.map(m => {
    const asignados = projectsData.filter(p => p.tecnico === m.name || p.revisorEstruc === m.name);
    const apr = asignados.filter(p => p.estado === 'APROBADO').length;
    const tot = asignados.length;
    const pct = tot > 0 ? Math.round((apr / tot) * 100) : 0;
    return { name: m.name, role: m.role, apr, pct };
  }).sort((a, b) => b.apr - a.apr || b.pct - a.pct).slice(0, 5);
  const medals = ['🥇', '🥈', '🥉', '4', '5'];

  const estados = [
    { label: 'Aprobados', n: aprobados, c: '#4ade80' },
    { label: 'En Revisión', n: enRevision, c: '#60a5fa' },
    { label: 'En Acta', n: enActa, c: '#d4b15f' },
    { label: 'NO LDF', n: noLdf, c: '#f87171' },
  ];

  const movimientos = [...projectsData]
    .sort((a, b) => b.ldf.localeCompare(a.ldf))
    .slice(0, 6)
    .map(p => ({
      txt: `Radicado ${p.radicado} · ${p.estado} · ${p.tecnico || 'SIN ASIGNAR'}`,
      date: p.ldf.split('-').reverse().join('/')
    }));

  const clock = now.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  const fecha = now.toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="tv">
      <button className="tv-close" onClick={onClose}>← Volver</button>

      <div className="tv-head">
        <div className="tv-brand">
          <div className="tv-logo"></div>
          <div>
            <div className="tv-title">Curaduría <span className="gold">2 Pereira</span></div>
            <div className="tv-subtitle">Centro de Control · Proyectos Estratégicos</div>
          </div>
        </div>
        <div className="tv-clockwrap">
          <div className="tv-date">{fecha}</div>
          <div className="tv-clock">{clock}</div>
        </div>
      </div>

      <div className="tv-kpis">
        <div className="tv-kpi"><div className="n" style={{ color: '#f4f6fb' }}>{total}</div><div className="l">Total</div></div>
        <div className="tv-kpi"><div className="n" style={{ color: '#4ade80' }}>{aprobados}</div><div className="l">Aprobados</div></div>
        <div className="tv-kpi"><div className="n" style={{ color: '#60a5fa' }}>{enRevision}</div><div className="l">En Revisión</div></div>
        <div className="tv-kpi"><div className="n" style={{ color: '#d4b15f' }}>{enActa}</div><div className="l">En Acta</div></div>
        <div className="tv-kpi"><div className="n" style={{ color: '#a78bfa' }}>{pctAprob}%</div><div className="l">Tasa Aprob.</div></div>
        <div className="tv-kpi"><div className="n" style={{ color: '#f87171' }}>{vencidos}</div><div className="l">Urgentes</div></div>
      </div>

      <div className="tv-cols">
        <div className="tv-panel">
          <h3>👷 Productividad del Equipo</h3>
          {productividad.map(p => (
            <div key={p.name} className="tv-prod-row">
              <div className="tv-prod-top">
                <span>{p.name}</span>
                <span style={{ color: '#8493ad' }}>{p.apr}A · {p.rev}R · {p.acta}Ac · {p.tot}T</span>
              </div>
              <div className="tv-prod-bar">
                <i style={{ width: `${(p.apr / maxTot) * 100}%`, background: '#4ade80' }}></i>
                <i style={{ width: `${(p.rev / maxTot) * 100}%`, background: '#60a5fa' }}></i>
                <i style={{ width: `${(p.acta / maxTot) * 100}%`, background: '#d4b15f' }}></i>
              </div>
            </div>
          ))}
          <div className="tv-prod-legend">
            <span><i className="tv-dot" style={{ background: '#4ade80' }}></i>Aprobados</span>
            <span><i className="tv-dot" style={{ background: '#60a5fa' }}></i>En Revisión</span>
            <span><i className="tv-dot" style={{ background: '#d4b15f' }}></i>En Acta</span>
          </div>
        </div>

        <div className="tv-panel">
          <h3>📊 Estado General</h3>
          <ResponsiveContainer width="100%" height={170}>
            <PieChart>
              <Pie data={estados} dataKey="n" nameKey="label" cx="50%" cy="50%" innerRadius={48} outerRadius={78} paddingAngle={2}>
                {estados.map((e, i) => <Cell key={i} fill={e.c} stroke="none" />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          {estados.map(e => (
            <div key={e.label} className="tv-estado-row">
              <span><i className="tv-dot" style={{ background: e.c, display: 'inline-block', marginRight: 8 }}></i>{e.label}</span>
              <span className="tv-estado-num" style={{ color: e.c }}>{e.n}</span>
            </div>
          ))}
          <div className="tv-estado-row" style={{ borderTop: '2px solid #1b3354', marginTop: 4, paddingTop: 12 }}>
            <span style={{ color: '#8493ad' }}>Total General</span>
            <span className="tv-estado-num" style={{ color: '#f4f6fb' }}>{total}</span>
          </div>
        </div>

        <div className="tv-panel">
          <h3>⏱️ Semáforo de Términos</h3>
          <div style={{ maxHeight: 560, overflowY: 'auto' }}>
            {terminos.slice(0, 8).map(t => (
              <div key={t.radicado} className={`tv-term ${t.color}`}>
                <div>
                  <div className="tv-term-rad">{t.radicado}</div>
                  <div className="tv-term-title">{t.tipoLicencia}</div>
                  <div className="tv-term-rev">Revisor: {t.revisorEstruc || 'SIN ASIGNAR'}</div>
                  <div className="tv-term-tipo">Técnico: {t.tecnico || 'SIN ASIGNAR'}</div>
                  <span className="tv-term-badge">{t.estado}</span>
                </div>
                <div className={`tv-term-days ${t.color}`}>
                  <div className="d">{Math.abs(t.dias)}</div>
                  <div className="t">{t.vencido ? 'Vencido' : 'Días'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="tv-cols" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div className="tv-panel">
          <h3>🏆 Ranking de Aprobaciones</h3>
          {ranking.map((r, i) => (
            <div key={r.name} className="tv-rank-row">
              <div className="tv-medal">{medals[i]}</div>
              <div className="tv-rank-name">{r.name}<div className="tv-rank-role">{r.role}</div></div>
              <div style={{ textAlign: 'right' }}>
                <div className="tv-rank-num">{r.apr}</div>
                <div className="tv-rank-role">{r.pct}% aprob.</div>
              </div>
            </div>
          ))}
        </div>

        <div className="tv-panel">
          <h3>📰 Últimos Movimientos</h3>
          {movimientos.map((m, i) => (
            <div key={i} className="tv-move">
              <div className="tv-move-dot"></div>
              <div className="tv-move-txt">{m.txt}</div>
              <div className="tv-move-date">{m.date}</div>
            </div>
          ))}
        </div>
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
  const [selectedYear, setSelectedYear] = useState('2026');

  const projectsData = projectsDataFull.filter(p => {
    const year = getYear(p.radicado);
    return year ? year.toString() === selectedYear : false;
  });

  const availableYears = Array.from(new Set(
    projectsDataFull.map(p => getYear(p.radicado)).filter(y => y !== null)
  )).sort((a, b) => b - a).map(y => y.toString());

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
          <VistaTecnico tecnicoName={tecnicoLogueado} onLogout={() => setTecnicoLogueado(null)} projectsData={projectsData} />
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
    const tvData = projectsDataFull.filter(p => {
      const year = getYear(p.radicado);
      return year ? year.toString() === '2026' : false;
    });
    return (
      <div className="app">
        <style>{STYLES}</style>
        <TVMode onClose={() => setTvMode(false)} projectsData={tvData} />
      </div>
    );
  }

  return (
    <div className="app">
      <style>{STYLES}</style>
      <nav className="navbar">
        <div className="navbar-content">
          <div className="navbar-left">
            <div>
              <div className="navbar-title">📊 Curaduría Urbana N.° 2</div>
              <div className="navbar-sub">Pereira · Control de Proyectos Estratégicos</div>
            </div>
            <div className="year-selector">
              <Calendar size={16} color="var(--primary)" />
              <select value={selectedYear} onChange={e => setSelectedYear(e.target.value)}>
                {availableYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
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
        <h2 className="section-title">
          Dashboard {selectedYear}
          <span className="year-info">{projectsData.length} radicados</span>
        </h2>
        {tab === 'dashboard' && <Dashboard projectsData={projectsData} />}
        {tab === 'terminos' && <Terminos projectsData={projectsData} />}
        {tab === 'proyectos' && <Proyectos projectsData={projectsData} />}
        {tab === 'tecnicos' && <Tecnicos projectsData={projectsData} />}
        {tab === 'bitacora' && <Bitacora projectsData={projectsData} />}
        {tab === 'curador' && <Curador projectsData={projectsData} />}
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
