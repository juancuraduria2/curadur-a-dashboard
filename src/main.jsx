import React, { useState, useMemo, useEffect, useCallback } from "react";
import ReactDOM from "react-dom/client";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
  LineChart, Line, CartesianGrid, Legend, AreaChart, Area
} from "recharts";
import {
  LayoutDashboard, Tv, Star, UserPlus, Clock, FolderOpen, Users, Gavel,
  History, Archive, Search, Filter, ChevronDown, ChevronUp, Calendar,
  AlertTriangle, CheckCircle, XCircle, FileText, ArrowRight, RefreshCw,
  Building2, Eye, Edit3, Trash2, Plus, Download, Moon, Sun, Menu, X
} from "lucide-react";

// ========== STYLES ==========
const STYLES = `
* { margin:0; padding:0; box-sizing:border-box; }
:root {
  --bg: #f0f2f5; --card: #ffffff; --primary: #c62828; --primary-light: #ffebee;
  --accent: #d32f2f; --accent2: #f57c00; --danger: #d32f2f; --warning: #f9a825;
  --success: #2e7d32; --text: #1a1a2e; --text2: #555; --text3: #888;
  --border: #e0e0e0; --shadow: 0 2px 8px rgba(0,0,0,0.08);
  --radius: 10px; --header-h: 56px;
}
.dark { --bg:#121212; --card:#1e1e1e; --text:#e0e0e0; --text2:#aaa; --text3:#777; --border:#333; --primary-light:#3d1111; }
body { font-family:'Segoe UI',system-ui,-apple-system,sans-serif; background:var(--bg); color:var(--text); }
.app { min-height:100vh; }
.header { height:var(--header-h); background:var(--primary); color:#fff; display:flex; align-items:center; padding:0 20px; position:sticky; top:0; z-index:100; gap:12px; }
.header h1 { font-size:16px; font-weight:600; white-space:nowrap; }
.header-logo { height:32px; width:32px; background:#fff; border-radius:50%; display:flex; align-items:center; justify-content:center; color:var(--primary); font-weight:800; font-size:14px; flex-shrink:0; }
.nav { display:flex; gap:2px; overflow-x:auto; padding:0 16px; background:var(--card); border-bottom:1px solid var(--border); }
.nav button { padding:10px 14px; border:none; background:none; cursor:pointer; font-size:13px; color:var(--text2); white-space:nowrap; border-bottom:2px solid transparent; transition:all .2s; display:flex; align-items:center; gap:6px; }
.nav button:hover { color:var(--primary); background:var(--primary-light); }
.nav button.active { color:var(--primary); border-bottom-color:var(--primary); font-weight:600; }
.content { padding:20px; max-width:1400px; margin:0 auto; }
.grid { display:grid; gap:16px; }
.grid-4 { grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); }
.grid-3 { grid-template-columns:repeat(auto-fit,minmax(300px,1fr)); }
.grid-2 { grid-template-columns:repeat(auto-fit,minmax(400px,1fr)); }
.card { background:var(--card); border-radius:var(--radius); padding:20px; box-shadow:var(--shadow); border:1px solid var(--border); }
.card-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; }
.card-header h3 { font-size:14px; color:var(--text2); font-weight:500; }
.stat-card { text-align:center; }
.stat-card .number { font-size:36px; font-weight:700; line-height:1.1; }
.stat-card .label { font-size:13px; color:var(--text2); margin-top:4px; }
.stat-card .sub { font-size:11px; color:var(--text3); margin-top:2px; }
.badge { display:inline-block; padding:3px 10px; border-radius:12px; font-size:11px; font-weight:600; }
.badge-green { background:#e8f5e9; color:#2e7d32; }
.badge-red { background:#ffebee; color:#c62828; }
.badge-orange { background:#fff3e0; color:#e65100; }
.badge-blue { background:#e3f2fd; color:#1565c0; }
.badge-gray { background:#f5f5f5; color:#616161; }
.badge-yellow { background:#fffde7; color:#f57f17; }
.badge-purple { background:#f3e5f5; color:#7b1fa2; }
input,select { padding:8px 12px; border:1px solid var(--border); border-radius:6px; font-size:13px; background:var(--card); color:var(--text); }
input:focus,select:focus { outline:none; border-color:var(--primary); }
.search-box { display:flex; gap:8px; margin-bottom:16px; flex-wrap:wrap; }
.search-box input { flex:1; min-width:200px; }
.btn { padding:8px 16px; border:none; border-radius:6px; cursor:pointer; font-size:13px; font-weight:500; transition:all .2s; }
.btn-primary { background:var(--primary); color:#fff; }
.btn-primary:hover { background:var(--accent); }
.btn-sm { padding:5px 10px; font-size:12px; }
.btn-outline { background:transparent; border:1px solid var(--border); color:var(--text2); }
.btn-outline:hover { border-color:var(--primary); color:var(--primary); }
table { width:100%; border-collapse:collapse; font-size:13px; }
th { text-align:left; padding:10px 12px; background:var(--primary-light); color:var(--primary); font-weight:600; position:sticky; top:0; }
td { padding:8px 12px; border-bottom:1px solid var(--border); }
tr:hover { background:var(--primary-light); }
.table-wrap { overflow-x:auto; max-height:500px; overflow-y:auto; border-radius:var(--radius); border:1px solid var(--border); }
.progress-bar { height:8px; background:#e0e0e0; border-radius:4px; overflow:hidden; }
.progress-fill { height:100%; border-radius:4px; transition:width .5s; }
.pill-row { display:flex; gap:6px; flex-wrap:wrap; margin-bottom:12px; }
.pill { padding:5px 12px; border-radius:16px; font-size:12px; border:1px solid var(--border); cursor:pointer; background:var(--card); color:var(--text2); transition:all .2s; }
.pill.active { background:var(--primary); color:#fff; border-color:var(--primary); }
.modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.5); display:flex; align-items:center; justify-content:center; z-index:200; }
.modal { background:var(--card); border-radius:var(--radius); padding:24px; width:90%; max-width:500px; max-height:80vh; overflow-y:auto; }
.form-group { margin-bottom:14px; }
.form-group label { display:block; font-size:12px; color:var(--text2); margin-bottom:4px; font-weight:500; }
.form-group input,.form-group select { width:100%; }
.header-actions { margin-left:auto; display:flex; gap:8px; align-items:center; }
.fade-in { animation:fadeIn .5s ease; }
@keyframes fadeIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
.alert-row { display:flex; align-items:center; gap:10px; padding:10px 14px; border-radius:8px; margin-bottom:8px; font-size:13px; }
.alert-danger { background:#ffebee; color:#c62828; }
.alert-warning { background:#fff8e1; color:#f57f17; }
.alert-success { background:#e8f5e9; color:#2e7d32; }
.tecnico-card { display:flex; align-items:center; gap:14px; padding:14px; border-radius:var(--radius); border:1px solid var(--border); background:var(--card); }
.tecnico-avatar { width:40px; height:40px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:700; color:#fff; font-size:16px; }
.timeline-item { display:flex; gap:12px; padding:12px 0; border-bottom:1px solid var(--border); }
.timeline-dot { width:10px; height:10px; border-radius:50%; background:var(--primary); margin-top:5px; flex-shrink:0; }
@media(max-width:768px) {
  .nav { padding:0 8px; } .nav button { padding:8px 10px; font-size:12px; }
  .content { padding:12px; } .grid-4 { grid-template-columns:repeat(2,1fr); }
}
`;

// ========== DATA ==========
const P1=[
{"r":"260001","f":"2026-01-07","e":"EN ESTUDIO","l":"2026-01-20","lr":"","t":"RECONOCIMIENTO","s":"Diego Ramírez Ceballos","d":"Calle 44 No. 24-70","x":true},
{"r":"260002","f":"2026-01-05","e":"OBSERVACIONES","l":"2026-01-12","lr":"","t":"CONSTRUCCION","s":"Pedro Díaz Morales","d":"Diagonal 39 No. 1-72","x":true},
{"r":"260003","f":"2026-01-05","e":"RADICADO","l":"","lr":"","t":"OBRA NUEVA","s":"Óscar Morales Herrera","d":"Diagonal 18 No. 26-1","x":true},
{"r":"260004","f":"2026-01-12","e":"EN REVISION","l":"2026-01-30","lr":"","t":"CERRAMIENTO","s":"Mónica Torres Díaz","d":"Avenida 7 No. 3-49","x":true},
{"r":"260005","f":"2026-01-05","e":"DESISTIDO","l":"","lr":"","t":"CERRAMIENTO","s":"Javier Cruz Martínez","d":"Transversal 35 No. 4-49","x":true},
{"r":"260006","f":"2026-01-05","e":"OBSERVACIONES","l":"2026-01-30","lr":"","t":"PROPIEDAD HORIZONTAL","s":"Natalia Salazar Gómez","d":"Calle 3 No. 22-30","x":true},
{"r":"260007","f":"2026-01-12","e":"APROBADO","l":"2026-01-19","lr":"2026-01-19","t":"RECONOCIMIENTO","s":"Sandra Rojas Ortiz","d":"Transversal 41 No. 27-47","x":true},
{"r":"260008","f":"2026-01-07","e":"DESISTIDO","l":"","lr":"","t":"RECONOCIMIENTO","s":"Roberto Ortiz Giraldo","d":"Calle 39 No. 21-22","x":true},
{"r":"260009","f":"2026-01-12","e":"RADICADO","l":"","lr":"","t":"DEMOLICION","s":"Silvia Rojas Ortiz","d":"Diagonal 15 No. 22-42","x":true},
{"r":"260010","f":"2026-01-14","e":"RADICADO","l":"","lr":"","t":"CONSTRUCCION","s":"Diego Martínez Ramos","d":"Transversal 18 No. 3-28","x":true},
{"r":"260011","f":"2026-01-12","e":"EN REVISION","l":"2026-01-27","lr":"","t":"RECONOCIMIENTO","s":"Daniela Cardona Aguilar","d":"Transversal 10 No. 9-18","x":true},
{"r":"260012","f":"2026-01-12","e":"RADICADO","l":"","lr":"","t":"OBRA NUEVA","s":"Claudia Ceballos Duque","d":"Transversal 38 No. 13-47","x":true},
{"r":"260013","f":"2026-01-12","e":"NOTIFICADO","l":"2026-01-21","lr":"2026-01-21","t":"OBRA NUEVA","s":"Adriana Hernández López","d":"Calle 10 No. 21-21","x":true},
{"r":"260014","f":"2026-01-16","e":"RADICADO","l":"","lr":"","t":"PROPIEDAD HORIZONTAL","s":"Luis Rojas Rojas","d":"Diagonal 30 No. 17-33","x":true},
{"r":"260015","f":"2026-01-15","e":"EN REVISION","l":"2026-01-20","lr":"","t":"URBANISMO","s":"Margarita Valencia Ortiz","d":"Avenida 8 No. 10-56","x":true},
{"r":"260016","f":"2026-01-13","e":"NO LDF","l":"","lr":"","t":"SUBDIVISION","s":"Ernesto Rivera Ospina","d":"Calle 41 No. 10-82","x":true},
{"r":"260017","f":"2026-01-16","e":"OBSERVACIONES","l":"2026-01-26","lr":"","t":"CERRAMIENTO","s":"Enrique Flores Valencia","d":"Diagonal 1 No. 20-42","x":true},
{"r":"260018","f":"2026-01-16","e":"EN ESTUDIO","l":"2026-02-02","lr":"","t":"SUBDIVISION","s":"Fernando López Reyes","d":"Diagonal 6 No. 3-94","x":true},
{"r":"260019","f":"2026-01-19","e":"EN REVISION","l":"2026-02-10","lr":"","t":"DEMOLICION","s":"Jorge Londoño Montoya","d":"Diagonal 11 No. 9-68","x":true},
{"r":"260020","f":"2026-01-20","e":"OBSERVACIONES","l":"2026-02-02","lr":"","t":"OBRA NUEVA","s":"Enrique Gallego Giraldo","d":"Carrera 46 No. 10-52","x":true},
{"r":"260021","f":"2026-01-20","e":"OBSERVACIONES","l":"2026-02-09","lr":"","t":"OBRA NUEVA","s":"Mauricio Sánchez Reyes","d":"Carrera 5 No. 11-3","x":true},
{"r":"260022","f":"2026-01-20","e":"OBSERVACIONES","l":"2026-02-12","lr":"","t":"RECONOCIMIENTO","s":"Carlos González Aristizábal","d":"Calle 15 No. 3-5","x":true},
{"r":"260023","f":"2026-01-22","e":"DESISTIDO","l":"","lr":"","t":"OBRA NUEVA","s":"Fernando Ortiz Londoño","d":"Transversal 14 No. 18-17","x":true},
{"r":"260024","f":"2026-01-22","e":"CORRECCION","l":"2026-02-16","lr":"","t":"PROPIEDAD HORIZONTAL","s":"Rodrigo Reyes Montoya","d":"Transversal 13 No. 4-13","x":true},
{"r":"260025","f":"2026-01-23","e":"NO LDF","l":"","lr":"","t":"MODIFICACION","s":"Óscar Ríos Gallego","d":"Calle 44 No. 21-83","x":true},
{"r":"260026","f":"2026-01-19","e":"EN ESTUDIO","l":"2026-02-03","lr":"","t":"URBANISMO","s":"Fernando Gómez Gómez","d":"Diagonal 29 No. 5-55","x":true},
{"r":"260027","f":"2026-01-20","e":"APROBADO","l":"2026-02-02","lr":"2026-02-02","t":"URBANISMO","s":"Mauricio Mejía Pérez","d":"Calle 42 No. 18-2","x":true},
{"r":"260028","f":"2026-01-20","e":"CORRECCION","l":"2026-02-02","lr":"","t":"DEMOLICION","s":"Óscar Cardona Montoya","d":"Carrera 26 No. 29-8","x":true},
{"r":"260029","f":"2026-01-21","e":"DESISTIDO","l":"","lr":"","t":"MODIFICACION","s":"Claudia Ríos Gutiérrez","d":"Transversal 45 No. 24-72","x":true},
{"r":"260030","f":"2026-01-26","e":"RADICADO","l":"","lr":"","t":"DEMOLICION","s":"Valentina Gutiérrez Díaz","d":"Calle 38 No. 24-70","x":true},
{"r":"260031","f":"2026-01-22","e":"RADICADO","l":"","lr":"","t":"CONSTRUCCION","s":"Ana Duque Montoya","d":"Diagonal 34 No. 6-8","x":true},
{"r":"260032","f":"2026-01-26","e":"EN ESTUDIO","l":"2026-02-05","lr":"","t":"URBANISMO","s":"Javier González Castaño","d":"Carrera 26 No. 4-73","x":true},
{"r":"260033","f":"2026-01-26","e":"OBSERVACIONES","l":"2026-02-02","lr":"","t":"PROPIEDAD HORIZONTAL","s":"Pedro Medina Londoño","d":"Diagonal 37 No. 17-41","x":true},
{"r":"260034","f":"2026-01-26","e":"EN ESTUDIO","l":"2026-02-10","lr":"","t":"RECONOCIMIENTO","s":"Claudia Aguilar Ramírez","d":"Avenida 30 No. 11-97","x":true},
{"r":"260035","f":"2026-01-26","e":"EN ESTUDIO","l":"2026-02-19","lr":"","t":"PROPIEDAD HORIZONTAL","s":"Sandra González Valencia","d":"Carrera 33 No. 9-17","x":true},
{"r":"260036","f":"2026-01-27","e":"EN REVISION","l":"2026-02-09","lr":"","t":"CERRAMIENTO","s":"Ricardo Flores Herrera","d":"Diagonal 46 No. 10-79","x":true},
{"r":"260037","f":"2026-02-02","e":"OBSERVACIONES","l":"2026-02-09","lr":"","t":"OBRA NUEVA","s":"Patricia Londoño Pérez","d":"Carrera 17 No. 4-14","x":true},
{"r":"260038","f":"2026-02-02","e":"OBSERVACIONES","l":"2026-02-16","lr":"","t":"SUBDIVISION","s":"Javier Díaz Aristizábal","d":"Avenida 14 No. 22-82","x":true},
{"r":"260039","f":"2026-02-02","e":"APROBADO","l":"2026-02-23","lr":"2026-02-23","t":"SUBDIVISION","s":"Ana Hernández Echeverri","d":"Transversal 18 No. 2-1","x":false},
{"r":"260040","f":"2026-01-30","e":"RADICADO","l":"","lr":"","t":"SUBDIVISION","s":"Alejandro Ceballos Herrera","d":"Diagonal 46 No. 14-72","x":false},
{"r":"260041","f":"2026-01-28","e":"EN ESTUDIO","l":"2026-02-06","lr":"","t":"OBRA NUEVA","s":"María Jiménez Duque","d":"Diagonal 10 No. 14-17","x":false},
{"r":"260042","f":"2026-01-29","e":"APROBADO","l":"2026-02-04","lr":"2026-02-04","t":"CERRAMIENTO","s":"Laura Castaño Reyes","d":"Calle 23 No. 25-72","x":false},
{"r":"260043","f":"2026-02-05","e":"NO LDF","l":"","lr":"","t":"PROPIEDAD HORIZONTAL","s":"Angélica Torres Reyes","d":"Carrera 12 No. 29-53","x":false},
{"r":"260044","f":"2026-01-30","e":"EN ESTUDIO","l":"2026-02-16","lr":"","t":"MODIFICACION","s":"Roberto Ceballos Reyes","d":"Avenida 11 No. 26-90","x":false},
{"r":"260045","f":"2026-02-02","e":"NO LDF","l":"","lr":"","t":"CONSTRUCCION","s":"Rodrigo Morales Gómez","d":"Transversal 23 No. 10-30","x":false},
{"r":"260046","f":"2026-02-02","e":"EN ESTUDIO","l":"2026-02-13","lr":"","t":"MODIFICACION","s":"Gloria Ortiz González","d":"Avenida 23 No. 21-66","x":false},
{"r":"260047","f":"2026-02-04","e":"OBSERVACIONES","l":"2026-02-26","lr":"","t":"CERRAMIENTO","s":"Juan Sánchez Cruz","d":"Carrera 38 No. 9-5","x":false},
{"r":"260048","f":"2026-02-02","e":"OBSERVACIONES","l":"2026-02-18","lr":"","t":"CERRAMIENTO","s":"Beatriz Henao Ospina","d":"Calle 25 No. 29-74","x":false},
{"r":"260049","f":"2026-02-04","e":"APROBADO","l":"2026-02-23","lr":"2026-02-23","t":"CONSTRUCCION","s":"Catalina Valencia Castaño","d":"Carrera 24 No. 14-9","x":false},
{"r":"260050","f":"2026-02-09","e":"CORRECCION","l":"2026-03-05","lr":"","t":"CERRAMIENTO","s":"Roberto Sánchez Gallego","d":"Avenida 33 No. 10-86","x":false},
{"r":"260051","f":"2026-02-09","e":"APROBADO","l":"2026-02-23","lr":"2026-02-23","t":"OBRA NUEVA","s":"Jorge Gómez Medina","d":"Transversal 44 No. 24-23","x":false},
{"r":"260052","f":"2026-02-09","e":"OBSERVACIONES","l":"2026-02-26","lr":"","t":"OBRA NUEVA","s":"Carlos Chávez Gutiérrez","d":"Carrera 28 No. 26-75","x":false},
{"r":"260053","f":"2026-02-09","e":"OBSERVACIONES","l":"2026-03-02","lr":"","t":"AMPLIACION","s":"Mauricio Castaño Díaz","d":"Diagonal 31 No. 26-95","x":false},
{"r":"260054","f":"2026-02-09","e":"OBSERVACIONES","l":"2026-02-23","lr":"","t":"OBRA NUEVA","s":"Roberto Echeverri Zuluaga","d":"Avenida 6 No. 27-97","x":false},
{"r":"260055","f":"2026-02-09","e":"OBSERVACIONES","l":"2026-02-23","lr":"","t":"RECONOCIMIENTO","s":"Diana Rodríguez Martínez","d":"Carrera 31 No. 20-99","x":false},
{"r":"260056","f":"2026-02-09","e":"NO LDF","l":"","lr":"","t":"PROPIEDAD HORIZONTAL","s":"Valentina Aristizábal Giraldo","d":"Transversal 32 No. 13-32","x":false},
{"r":"260057","f":"2026-02-09","e":"OBSERVACIONES","l":"2026-02-16","lr":"","t":"URBANISMO","s":"Pilar Castro Morales","d":"Carrera 45 No. 17-60","x":false},
{"r":"260058","f":"2026-02-09","e":"OBSERVACIONES","l":"2026-02-17","lr":"","t":"AMPLIACION","s":"Jorge Ríos Londoño","d":"Diagonal 36 No. 20-41","x":false},
{"r":"260059","f":"2026-02-16","e":"EN REVISION","l":"2026-03-12","lr":"","t":"OBRA NUEVA","s":"Beatriz Mejía Herrera","d":"Carrera 48 No. 28-61","x":false},
{"r":"260060","f":"2026-02-13","e":"APROBADO","l":"2026-02-25","lr":"2026-02-25","t":"SUBDIVISION","s":"Pilar Arango Cardona","d":"Carrera 18 No. 15-10","x":false},
{"r":"260061","f":"2026-02-16","e":"APROBADO","l":"2026-03-02","lr":"2026-03-02","t":"CERRAMIENTO","s":"Héctor Valencia Hernández","d":"Carrera 10 No. 8-50","x":false},
{"r":"260062","f":"2026-02-16","e":"EN ESTUDIO","l":"2026-02-27","lr":"","t":"URBANISMO","s":"Óscar Medina Vargas","d":"Diagonal 30 No. 14-8","x":false},
{"r":"260063","f":"2026-02-13","e":"EN REVISION","l":"2026-03-02","lr":"","t":"PROPIEDAD HORIZONTAL","s":"Miguel Rodríguez Salazar","d":"Transversal 31 No. 1-46","x":false},
{"r":"260064","f":"2026-02-16","e":"RADICADO","l":"","lr":"","t":"MODIFICACION","s":"Guillermo Ceballos Ceballos","d":"Diagonal 39 No. 29-29","x":false},
{"r":"260065","f":"2026-02-16","e":"EN ESTUDIO","l":"2026-03-06","lr":"","t":"AMPLIACION","s":"Juan Rojas Vargas","d":"Transversal 47 No. 6-60","x":false},
{"r":"260066","f":"2026-02-16","e":"NOTIFICADO","l":"2026-03-10","lr":"2026-03-10","t":"CONSTRUCCION","s":"Lucía Duque Salazar","d":"Calle 6 No. 21-55","x":false},
{"r":"260067","f":"2026-02-16","e":"EN REVISION","l":"2026-02-26","lr":"","t":"CONSTRUCCION","s":"Claudia Rojas Ramos","d":"Carrera 30 No. 11-44","x":false},
{"r":"260068","f":"2026-02-23","e":"EN REVISION","l":"2026-03-09","lr":"","t":"MODIFICACION","s":"Claudia Hernández Montoya","d":"Calle 48 No. 18-7","x":false},
{"r":"260069","f":"2026-02-18","e":"EN ESTUDIO","l":"2026-02-25","lr":"","t":"CONSTRUCCION","s":"Enrique Rodríguez Reyes","d":"Carrera 2 No. 20-20","x":false},
{"r":"260070","f":"2026-02-18","e":"EN ESTUDIO","l":"2026-02-26","lr":"","t":"PROPIEDAD HORIZONTAL","s":"Laura Ríos Giraldo","d":"Avenida 50 No. 12-22","x":false},
{"r":"260071","f":"2026-02-23","e":"OBSERVACIONES","l":"2026-03-03","lr":"","t":"DEMOLICION","s":"Patricia Pérez Duque","d":"Calle 20 No. 19-87","x":false},
{"r":"260072","f":"2026-02-23","e":"NO LDF","l":"","lr":"","t":"RECONOCIMIENTO","s":"Luis Duque Giraldo","d":"Carrera 7 No. 23-99","x":false},
{"r":"260073","f":"2026-02-23","e":"EN REVISION","l":"2026-03-19","lr":"","t":"URBANISMO","s":"Álvaro Martínez Castillo","d":"Diagonal 28 No. 22-48","x":false},
{"r":"260074","f":"2026-02-19","e":"OBSERVACIONES","l":"2026-03-06","lr":"","t":"CONSTRUCCION","s":"Óscar Cardona Pérez","d":"Transversal 24 No. 21-59","x":false},
{"r":"260075","f":"2026-02-25","e":"EN ESTUDIO","l":"2026-03-09","lr":"","t":"OBRA NUEVA","s":"Daniela Ortiz Zuluaga","d":"Diagonal 50 No. 16-60","x":false},
{"r":"260076","f":"2026-02-24","e":"EN REVISION","l":"2026-03-19","lr":"","t":"SUBDIVISION","s":"Héctor Reyes Hernández","d":"Avenida 29 No. 8-97","x":false},
{"r":"260077","f":"2026-02-24","e":"OBSERVACIONES","l":"2026-03-13","lr":"","t":"CERRAMIENTO","s":"Juan Cardona Ramos","d":"Carrera 32 No. 7-46","x":false},
{"r":"260078","f":"2026-03-02","e":"APROBADO","l":"2026-03-16","lr":"2026-03-16","t":"PROPIEDAD HORIZONTAL","s":"Miguel Ortiz Mejía","d":"Calle 34 No. 7-11","x":false},
{"r":"260079","f":"2026-02-24","e":"RADICADO","l":"","lr":"","t":"AMPLIACION","s":"Isabel Reyes Giraldo","d":"Transversal 42 No. 23-63","x":false},
{"r":"260080","f":"2026-02-26","e":"EN REVISION","l":"2026-03-05","lr":"","t":"SUBDIVISION","s":"Diego Aguilar Giraldo","d":"Carrera 20 No. 22-75","x":false}
];
const P2=[
{"r":"260081","f":"2026-03-02","e":"EN ESTUDIO","l":"2026-03-12","lr":"","t":"DEMOLICION","s":"Natalia Herrera Salazar","d":"Transversal 50 No. 12-42","x":false},
{"r":"260082","f":"2026-03-02","e":"EN ESTUDIO","l":"2026-03-16","lr":"","t":"RECONOCIMIENTO","s":"Fabián Botero López","d":"Avenida 45 No. 21-33","x":false},
{"r":"260083","f":"2026-03-02","e":"OBSERVACIONES","l":"2026-03-13","lr":"","t":"CONSTRUCCION","s":"Carolina Ospina Reyes","d":"Calle 27 No. 8-15","x":false},
{"r":"260084","f":"2026-03-02","e":"RADICADO","l":"","lr":"","t":"AMPLIACION","s":"Germán Zuluaga Henao","d":"Diagonal 22 No. 5-88","x":false},
{"r":"260085","f":"2026-03-04","e":"EN ESTUDIO","l":"2026-03-18","lr":"","t":"OBRA NUEVA","s":"Andrea Montoya Castro","d":"Carrera 15 No. 19-67","x":false},
{"r":"260086","f":"2026-03-04","e":"OBSERVACIONES","l":"2026-03-19","lr":"","t":"URBANISMO","s":"Ricardo Henao Gallego","d":"Avenida 33 No. 7-24","x":false},
{"r":"260087","f":"2026-03-05","e":"NO LDF","l":"","lr":"","t":"MODIFICACION","s":"Álvaro Echeverri Cardona","d":"Calle 12 No. 30-41","x":false},
{"r":"260088","f":"2026-03-05","e":"EN REVISION","l":"2026-03-23","lr":"","t":"CONSTRUCCION","s":"Gloria Giraldo Mejía","d":"Transversal 8 No. 15-52","x":false},
{"r":"260089","f":"2026-03-06","e":"DESISTIDO","l":"","lr":"","t":"CERRAMIENTO","s":"Camilo Vargas Ospina","d":"Diagonal 40 No. 3-19","x":false},
{"r":"260090","f":"2026-03-06","e":"EN ESTUDIO","l":"2026-03-20","lr":"","t":"PROPIEDAD HORIZONTAL","s":"Teresa Castillo Rojas","d":"Carrera 42 No. 28-63","x":false},
{"r":"260091","f":"2026-03-09","e":"OBSERVACIONES","l":"2026-03-23","lr":"","t":"DEMOLICION","s":"Arturo Londoño Vargas","d":"Avenida 16 No. 11-35","x":false},
{"r":"260092","f":"2026-03-09","e":"APROBADO","l":"2026-03-25","lr":"2026-03-25","t":"SUBDIVISION","s":"Isabel Castaño Arango","d":"Calle 31 No. 22-48","x":false},
{"r":"260093","f":"2026-03-09","e":"EN ESTUDIO","l":"2026-03-27","lr":"","t":"RECONOCIMIENTO","s":"Guillermo Salazar Ríos","d":"Transversal 19 No. 17-92","x":false},
{"r":"260094","f":"2026-03-10","e":"NO LDF","l":"","lr":"","t":"OBRA NUEVA","s":"Mónica Gallego Henao","d":"Diagonal 5 No. 25-14","x":false},
{"r":"260095","f":"2026-03-10","e":"RADICADO","l":"","lr":"","t":"AMPLIACION","s":"Fabián Mejía Echeverri","d":"Carrera 37 No. 2-66","x":false},
{"r":"260096","f":"2026-03-12","e":"EN REVISION","l":"2026-03-30","lr":"","t":"CONSTRUCCION","s":"Rosa Zuluaga Botero","d":"Calle 49 No. 13-27","x":false},
{"r":"260097","f":"2026-03-12","e":"OBSERVACIONES","l":"2026-03-24","lr":"","t":"URBANISMO","s":"Enrique Giraldo Cardona","d":"Avenida 21 No. 9-83","x":false},
{"r":"260098","f":"2026-03-13","e":"CORRECCION","l":"2026-04-02","lr":"","t":"MODIFICACION","s":"Daniela Arango Salazar","d":"Transversal 27 No. 20-15","x":false},
{"r":"260099","f":"2026-03-13","e":"EN ESTUDIO","l":"2026-03-30","lr":"","t":"CERRAMIENTO","s":"Alberto Ospina Duque","d":"Diagonal 14 No. 8-71","x":false},
{"r":"260100","f":"2026-03-16","e":"EN ESTUDIO","l":"2026-04-01","lr":"","t":"PROPIEDAD HORIZONTAL","s":"Valentina Henao Mejía","d":"Carrera 9 No. 16-39","x":false},
{"r":"260101","f":"2026-03-16","e":"DESISTIDO","l":"","lr":"","t":"DEMOLICION","s":"Jorge Castaño Londoño","d":"Calle 17 No. 27-54","x":false},
{"r":"260102","f":"2026-03-17","e":"EN ESTUDIO","l":"2026-04-03","lr":"","t":"OBRA NUEVA","s":"Lucía Montoya Vargas","d":"Avenida 38 No. 4-92","x":false},
{"r":"260103","f":"2026-03-17","e":"OBSERVACIONES","l":"2026-03-31","lr":"","t":"CONSTRUCCION","s":"Héctor Echeverri Salazar","d":"Transversal 3 No. 28-16","x":false},
{"r":"260104","f":"2026-03-18","e":"NO LDF","l":"","lr":"","t":"RECONOCIMIENTO","s":"Margarita Botero Giraldo","d":"Diagonal 43 No. 18-63","x":false},
{"r":"260105","f":"2026-03-18","e":"APROBADO","l":"2026-04-06","lr":"2026-04-06","t":"URBANISMO","s":"Rodrigo Gallego Zuluaga","d":"Carrera 14 No. 5-37","x":false},
{"r":"260106","f":"2026-03-19","e":"RADICADO","l":"","lr":"","t":"AMPLIACION","s":"Claudia Ríos Arango","d":"Calle 36 No. 11-28","x":false},
{"r":"260107","f":"2026-03-19","e":"EN REVISION","l":"2026-04-08","lr":"","t":"MODIFICACION","s":"Fernando Henao Castaño","d":"Avenida 47 No. 22-75","x":false},
{"r":"260108","f":"2026-03-20","e":"EN ESTUDIO","l":"2026-04-06","lr":"","t":"CERRAMIENTO","s":"Andrea Mejía Echeverri","d":"Transversal 36 No. 14-49","x":false},
{"r":"260109","f":"2026-03-23","e":"OBSERVACIONES","l":"2026-04-08","lr":"","t":"PROPIEDAD HORIZONTAL","s":"Carlos Salazar Ospina","d":"Diagonal 25 No. 9-81","x":false},
{"r":"260110","f":"2026-03-23","e":"EN ESTUDIO","l":"2026-04-09","lr":"","t":"SUBDIVISION","s":"Patricia Zuluaga Botero","d":"Carrera 43 No. 3-22","x":false},
{"r":"260111","f":"2026-03-24","e":"DESISTIDO","l":"","lr":"","t":"OBRA NUEVA","s":"Álvaro Londoño Gallego","d":"Calle 8 No. 26-67","x":false},
{"r":"260112","f":"2026-03-24","e":"OBSERVACIONES","l":"2026-04-10","lr":"","t":"CONSTRUCCION","s":"Sandra Arango Ríos","d":"Avenida 12 No. 17-43","x":false},
{"r":"260113","f":"2026-03-25","e":"EN ESTUDIO","l":"2026-04-13","lr":"","t":"RECONOCIMIENTO","s":"Luis Botero Henao","d":"Transversal 21 No. 25-18","x":false},
{"r":"260114","f":"2026-03-25","e":"RADICADO","l":"","lr":"","t":"URBANISMO","s":"Natalia Giraldo Mejía","d":"Diagonal 33 No. 2-56","x":false},
{"r":"260115","f":"2026-03-26","e":"APROBADO","l":"2026-04-14","lr":"2026-04-14","t":"DEMOLICION","s":"Diego Ospina Salazar","d":"Carrera 22 No. 30-91","x":false},
{"r":"260116","f":"2026-03-27","e":"OBSERVACIONES","l":"2026-04-13","lr":"","t":"AMPLIACION","s":"Pilar Duque Zuluaga","d":"Calle 43 No. 6-34","x":false},
{"r":"260117","f":"2026-03-27","e":"NO LDF","l":"","lr":"","t":"MODIFICACION","s":"Miguel Vargas Echeverri","d":"Avenida 28 No. 19-72","x":false},
{"r":"260118","f":"2026-03-30","e":"EN REVISION","l":"2026-04-16","lr":"","t":"CERRAMIENTO","s":"Silvia Montoya Arango","d":"Transversal 15 No. 10-85","x":false},
{"r":"260119","f":"2026-03-30","e":"EN ESTUDIO","l":"2026-04-15","lr":"","t":"PROPIEDAD HORIZONTAL","s":"Roberto Castaño Botero","d":"Diagonal 47 No. 21-37","x":false},
{"r":"260120","f":"2026-03-31","e":"OBSERVACIONES","l":"2026-04-17","lr":"","t":"OBRA NUEVA","s":"Beatriz Echeverri Londoño","d":"Carrera 35 No. 12-68","x":false},
{"r":"260121","f":"2026-04-01","e":"EN ESTUDIO","l":"2026-04-20","lr":"","t":"CONSTRUCCION","s":"Germán Salazar Gallego","d":"Calle 22 No. 4-53","x":false},
{"r":"260122","f":"2026-04-01","e":"DESISTIDO","l":"","lr":"","t":"SUBDIVISION","s":"Angélica Henao Ríos","d":"Avenida 40 No. 25-19","x":false},
{"r":"260123","f":"2026-04-02","e":"RADICADO","l":"","lr":"","t":"RECONOCIMIENTO","s":"Ernesto Giraldo Ospina","d":"Transversal 6 No. 3-94","x":false},
{"r":"260124","f":"2026-04-02","e":"EN REVISION","l":"2026-04-22","lr":"","t":"URBANISMO","s":"Carolina Mejía Zuluaga","d":"Diagonal 19 No. 27-46","x":false},
{"r":"260125","f":"2026-04-03","e":"OBSERVACIONES","l":"2026-04-21","lr":"","t":"AMPLIACION","s":"Arturo Botero Montoya","d":"Carrera 4 No. 8-31","x":false},
{"r":"260126","f":"2026-04-06","e":"EN ESTUDIO","l":"2026-04-23","lr":"","t":"MODIFICACION","s":"María Arango Henao","d":"Calle 14 No. 15-87","x":false},
{"r":"260127","f":"2026-04-06","e":"APROBADO","l":"2026-04-24","lr":"2026-04-24","t":"DEMOLICION","s":"Juan Ospina Castaño","d":"Avenida 19 No. 6-42","x":false},
{"r":"260128","f":"2026-04-07","e":"NO LDF","l":"","lr":"","t":"CERRAMIENTO","s":"Laura Londoño Echeverri","d":"Transversal 40 No. 17-28","x":false},
{"r":"260129","f":"2026-04-07","e":"EN ESTUDIO","l":"2026-04-27","lr":"","t":"OBRA NUEVA","s":"Pedro Gallego Salazar","d":"Diagonal 8 No. 10-63","x":false},
{"r":"260130","f":"2026-04-08","e":"OBSERVACIONES","l":"2026-04-24","lr":"","t":"PROPIEDAD HORIZONTAL","s":"Rosa Zuluaga Giraldo","d":"Carrera 27 No. 23-95","x":false},
{"r":"260131","f":"2026-04-08","e":"EN REVISION","l":"2026-04-28","lr":"","t":"CONSTRUCCION","s":"Mauricio Ríos Botero","d":"Calle 40 No. 18-51","x":false},
{"r":"260132","f":"2026-04-09","e":"RADICADO","l":"","lr":"","t":"URBANISMO","s":"Catalina Vargas Londoño","d":"Avenida 24 No. 2-76","x":false},
{"r":"260133","f":"2026-04-09","e":"EN ESTUDIO","l":"2026-04-28","lr":"","t":"SUBDIVISION","s":"Ricardo Montoya Gallego","d":"Transversal 29 No. 24-14","x":false},
{"r":"260134","f":"2026-04-10","e":"DESISTIDO","l":"","lr":"","t":"RECONOCIMIENTO","s":"Diana Castaño Zuluaga","d":"Diagonal 3 No. 13-89","x":false},
{"r":"260135","f":"2026-04-13","e":"OBSERVACIONES","l":"2026-04-30","lr":"","t":"AMPLIACION","s":"Alberto Henao Arango","d":"Carrera 47 No. 9-32","x":false},
{"r":"260136","f":"2026-04-13","e":"EN ESTUDIO","l":"2026-05-01","lr":"","t":"MODIFICACION","s":"Valentina Echeverri Ospina","d":"Calle 29 No. 22-57","x":false},
{"r":"260137","f":"2026-04-14","e":"APROBADO","l":"2026-05-04","lr":"2026-05-04","t":"OBRA NUEVA","s":"Jorge Salazar Montoya","d":"Avenida 35 No. 14-83","x":false},
{"r":"260138","f":"2026-04-14","e":"NO LDF","l":"","lr":"","t":"CERRAMIENTO","s":"Mónica Giraldo Londoño","d":"Transversal 12 No. 7-48","x":false},
{"r":"260139","f":"2026-04-15","e":"EN REVISION","l":"2026-05-05","lr":"","t":"DEMOLICION","s":"Fernando Botero Ríos","d":"Diagonal 35 No. 28-21","x":false},
{"r":"260140","f":"2026-04-15","e":"RADICADO","l":"","lr":"","t":"PROPIEDAD HORIZONTAL","s":"Adriana Ospina Mejía","d":"Carrera 39 No. 4-66","x":false},
{"r":"260141","f":"2026-04-16","e":"EN ESTUDIO","l":"2026-05-06","lr":"","t":"CONSTRUCCION","s":"Camilo Zuluaga Henao","d":"Calle 5 No. 27-13","x":false},
{"r":"260142","f":"2026-04-16","e":"OBSERVACIONES","l":"2026-05-04","lr":"","t":"URBANISMO","s":"Silvia Gallego Castaño","d":"Avenida 10 No. 20-39","x":false},
{"r":"260143","f":"2026-04-17","e":"EN ESTUDIO","l":"2026-05-07","lr":"","t":"SUBDIVISION","s":"Luis Arango Echeverri","d":"Transversal 33 No. 16-72","x":false},
{"r":"260144","f":"2026-04-20","e":"DESISTIDO","l":"","lr":"","t":"RECONOCIMIENTO","s":"Gloria Londoño Salazar","d":"Diagonal 42 No. 5-45","x":false},
{"r":"260145","f":"2026-04-20","e":"EN ESTUDIO","l":"2026-05-08","lr":"","t":"AMPLIACION","s":"Héctor Mejía Giraldo","d":"Carrera 16 No. 11-88","x":false},
{"r":"260146","f":"2026-04-21","e":"APROBADO","l":"2026-05-11","lr":"2026-05-11","t":"MODIFICACION","s":"Angélica Ríos Botero","d":"Calle 37 No. 3-24","x":false},
{"r":"260147","f":"2026-04-22","e":"EN REVISION","l":"2026-05-12","lr":"","t":"OBRA NUEVA","s":"Ernesto Vargas Zuluaga","d":"Avenida 42 No. 26-57","x":false},
{"r":"260148","f":"2026-04-22","e":"OBSERVACIONES","l":"2026-05-08","lr":"","t":"CERRAMIENTO","s":"Carolina Montoya Henao","d":"Transversal 25 No. 19-83","x":false},
{"r":"260149","f":"2026-04-23","e":"NO LDF","l":"","lr":"","t":"DEMOLICION","s":"Arturo Castaño Arango","d":"Diagonal 16 No. 12-36","x":false},
{"r":"260150","f":"2026-04-23","e":"RADICADO","l":"","lr":"","t":"PROPIEDAD HORIZONTAL","s":"María Echeverri Gallego","d":"Carrera 8 No. 25-69","x":false},
{"r":"260151","f":"2026-04-24","e":"EN ESTUDIO","l":"2026-05-14","lr":"","t":"CONSTRUCCION","s":"Juan Henao Ospina","d":"Calle 46 No. 8-42","x":false},
{"r":"260152","f":"2026-04-27","e":"OBSERVACIONES","l":"2026-05-13","lr":"","t":"URBANISMO","s":"Sandra Salazar Londoño","d":"Avenida 31 No. 1-95","x":false},
{"r":"260153","f":"2026-04-27","e":"EN ESTUDIO","l":"2026-05-15","lr":"","t":"RECONOCIMIENTO","s":"Pedro Giraldo Ríos","d":"Transversal 46 No. 22-18","x":false},
{"r":"260154","f":"2026-04-28","e":"DESISTIDO","l":"","lr":"","t":"SUBDIVISION","s":"Beatriz Botero Mejía","d":"Diagonal 27 No. 15-71","x":false},
{"r":"260155","f":"2026-04-28","e":"EN ESTUDIO","l":"2026-05-18","lr":"","t":"AMPLIACION","s":"Roberto Ospina Zuluaga","d":"Carrera 44 No. 10-34","x":false},
{"r":"260156","f":"2026-04-29","e":"APROBADO","l":"2026-05-19","lr":"2026-05-19","t":"MODIFICACION","s":"Lucía Arango Montoya","d":"Calle 19 No. 29-87","x":false},
{"r":"260157","f":"2026-04-29","e":"EN REVISION","l":"2026-05-19","lr":"","t":"OBRA NUEVA","s":"Álvaro Londoño Henao","d":"Avenida 6 No. 18-52","x":false},
{"r":"260158","f":"2026-04-30","e":"OBSERVACIONES","l":"2026-05-18","lr":"","t":"CERRAMIENTO","s":"Pilar Gallego Castaño","d":"Transversal 38 No. 6-29","x":false},
{"r":"260159","f":"2026-05-04","e":"NO LDF","l":"","lr":"","t":"DEMOLICION","s":"Miguel Zuluaga Arango","d":"Diagonal 9 No. 23-64","x":false},
{"r":"260160","f":"2026-05-04","e":"RADICADO","l":"","lr":"","t":"PROPIEDAD HORIZONTAL","s":"Daniela Mejía Salazar","d":"Carrera 23 No. 7-97","x":false}
];
const P3=[
{"r":"260161","f":"2026-05-04","e":"EN ESTUDIO","l":"2026-05-21","lr":"","t":"CONSTRUCCION","s":"Diego Ríos Giraldo","d":"Calle 2 No. 14-53","x":false},
{"r":"260162","f":"2026-05-05","e":"OBSERVACIONES","l":"2026-05-21","lr":"","t":"URBANISMO","s":"Natalia Botero Ospina","d":"Avenida 48 No. 24-16","x":false},
{"r":"260163","f":"2026-05-05","e":"EN ESTUDIO","l":"2026-05-25","lr":"","t":"SUBDIVISION","s":"Fabián Echeverri Londoño","d":"Transversal 9 No. 27-82","x":false},
{"r":"260164","f":"2026-05-06","e":"DESISTIDO","l":"","lr":"","t":"RECONOCIMIENTO","s":"Teresa Henao Gallego","d":"Diagonal 44 No. 4-39","x":false},
{"r":"260165","f":"2026-05-06","e":"EN REVISION","l":"2026-05-26","lr":"","t":"AMPLIACION","s":"Guillermo Salazar Ríos","d":"Carrera 36 No. 17-65","x":false},
{"r":"260166","f":"2026-05-07","e":"APROBADO","l":"2026-05-27","lr":"2026-05-27","t":"MODIFICACION","s":"Claudia Giraldo Botero","d":"Calle 33 No. 20-98","x":false},
{"r":"260167","f":"2026-05-07","e":"EN ESTUDIO","l":"2026-05-27","lr":"","t":"OBRA NUEVA","s":"Fernando Ospina Montoya","d":"Avenida 15 No. 13-41","x":false},
{"r":"260168","f":"2026-05-08","e":"OBSERVACIONES","l":"2026-05-26","lr":"","t":"CERRAMIENTO","s":"Andrea Zuluaga Mejía","d":"Transversal 20 No. 10-74","x":false},
{"r":"260169","f":"2026-05-08","e":"NO LDF","l":"","lr":"","t":"DEMOLICION","s":"Carlos Arango Henao","d":"Diagonal 38 No. 16-27","x":false},
{"r":"260170","f":"2026-05-11","e":"RADICADO","l":"","lr":"","t":"PROPIEDAD HORIZONTAL","s":"Patricia Londoño Castaño","d":"Carrera 50 No. 2-83","x":false},
{"r":"260171","f":"2026-05-11","e":"EN ESTUDIO","l":"2026-06-01","lr":"","t":"CONSTRUCCION","s":"Álvaro Gallego Echeverri","d":"Calle 11 No. 28-56","x":false},
{"r":"260172","f":"2026-05-12","e":"EN REVISION","l":"2026-06-01","lr":"","t":"URBANISMO","s":"Sandra Montoya Salazar","d":"Avenida 27 No. 6-29","x":false},
{"r":"260173","f":"2026-05-12","e":"DESISTIDO","l":"","lr":"","t":"RECONOCIMIENTO","s":"Luis Castaño Giraldo","d":"Transversal 14 No. 22-92","x":false},
{"r":"260174","f":"2026-05-13","e":"OBSERVACIONES","l":"2026-06-02","lr":"","t":"SUBDIVISION","s":"Mónica Ríos Ospina","d":"Diagonal 21 No. 9-45","x":false},
{"r":"260175","f":"2026-05-13","e":"EN ESTUDIO","l":"2026-06-03","lr":"","t":"AMPLIACION","s":"Ricardo Henao Zuluaga","d":"Carrera 41 No. 15-78","x":false},
{"r":"260176","f":"2026-05-14","e":"APROBADO","l":"2026-06-04","lr":"2026-06-04","t":"MODIFICACION","s":"Diana Mejía Arango","d":"Calle 24 No. 1-31","x":false},
{"r":"260177","f":"2026-05-14","e":"EN ESTUDIO","l":"2026-06-04","lr":"","t":"OBRA NUEVA","s":"Jorge Echeverri Botero","d":"Avenida 20 No. 19-64","x":false},
{"r":"260178","f":"2026-05-15","e":"RADICADO","l":"","lr":"","t":"CERRAMIENTO","s":"Valentina Salazar Londoño","d":"Transversal 7 No. 24-17","x":false},
{"r":"260179","f":"2026-05-18","e":"OBSERVACIONES","l":"2026-06-05","lr":"","t":"DEMOLICION","s":"Ernesto Giraldo Gallego","d":"Diagonal 32 No. 18-53","x":false},
{"r":"260180","f":"2026-05-18","e":"NO LDF","l":"","lr":"","t":"PROPIEDAD HORIZONTAL","s":"Carolina Ospina Henao","d":"Carrera 3 No. 11-86","x":false},
{"r":"260181","f":"2026-05-19","e":"EN REVISION","l":"2026-06-08","lr":"","t":"CONSTRUCCION","s":"Arturo Zuluaga Castaño","d":"Calle 47 No. 5-29","x":false},
{"r":"260182","f":"2026-05-19","e":"EN ESTUDIO","l":"2026-06-08","lr":"","t":"URBANISMO","s":"María Arango Ríos","d":"Avenida 36 No. 23-62","x":false},
{"r":"260183","f":"2026-05-20","e":"DESISTIDO","l":"","lr":"","t":"SUBDIVISION","s":"Juan Botero Mejía","d":"Transversal 43 No. 8-95","x":false},
{"r":"260184","f":"2026-05-20","e":"OBSERVACIONES","l":"2026-06-09","lr":"","t":"RECONOCIMIENTO","s":"Laura Londoño Salazar","d":"Diagonal 15 No. 3-48","x":false},
{"r":"260185","f":"2026-05-21","e":"EN ESTUDIO","l":"2026-06-10","lr":"","t":"AMPLIACION","s":"Pedro Gallego Giraldo","d":"Carrera 29 No. 26-71","x":false},
{"r":"260186","f":"2026-05-21","e":"APROBADO","l":"2026-06-11","lr":"2026-06-11","t":"MODIFICACION","s":"Rosa Montoya Ospina","d":"Calle 38 No. 12-24","x":false},
{"r":"260187","f":"2026-05-22","e":"EN REVISION","l":"2026-06-11","lr":"","t":"OBRA NUEVA","s":"Mauricio Castaño Henao","d":"Avenida 43 No. 16-57","x":false},
{"r":"260188","f":"2026-05-22","e":"RADICADO","l":"","lr":"","t":"CERRAMIENTO","s":"Silvia Ríos Zuluaga","d":"Transversal 30 No. 21-83","x":false},
{"r":"260189","f":"2026-05-25","e":"OBSERVACIONES","l":"2026-06-12","lr":"","t":"DEMOLICION","s":"Alberto Henao Arango","d":"Diagonal 7 No. 14-36","x":false},
{"r":"260190","f":"2026-05-25","e":"NO LDF","l":"","lr":"","t":"PROPIEDAD HORIZONTAL","s":"Catalina Echeverri Botero","d":"Carrera 13 No. 30-69","x":false},
{"r":"260191","f":"2026-05-26","e":"EN ESTUDIO","l":"2026-06-15","lr":"","t":"CONSTRUCCION","s":"Germán Salazar Londoño","d":"Calle 9 No. 7-42","x":false},
{"r":"260192","f":"2026-05-26","e":"EN REVISION","l":"2026-06-15","lr":"","t":"URBANISMO","s":"Angélica Giraldo Gallego","d":"Avenida 25 No. 20-95","x":false},
{"r":"260193","f":"2026-05-27","e":"EN ESTUDIO","l":"2026-06-16","lr":"","t":"SUBDIVISION","s":"Héctor Ospina Castaño","d":"Transversal 16 No. 5-18","x":false},
{"r":"260194","f":"2026-05-27","e":"DESISTIDO","l":"","lr":"","t":"RECONOCIMIENTO","s":"Margarita Zuluaga Ríos","d":"Diagonal 49 No. 25-51","x":false},
{"r":"260195","f":"2026-05-28","e":"OBSERVACIONES","l":"2026-06-17","lr":"","t":"AMPLIACION","s":"Rodrigo Arango Mejía","d":"Carrera 34 No. 13-84","x":false},
{"r":"260196","f":"2026-05-28","e":"EN ESTUDIO","l":"2026-06-17","lr":"","t":"MODIFICACION","s":"Adriana Botero Henao","d":"Calle 26 No. 2-37","x":false},
{"r":"260197","f":"2026-05-29","e":"APROBADO","l":"2026-06-19","lr":"2026-06-19","t":"OBRA NUEVA","s":"Camilo Londoño Giraldo","d":"Avenida 9 No. 28-63","x":false},
{"r":"260198","f":"2026-06-01","e":"RADICADO","l":"","lr":"","t":"CERRAMIENTO","s":"Gloria Gallego Ospina","d":"Transversal 22 No. 18-96","x":false},
{"r":"260199","f":"2026-06-01","e":"EN ESTUDIO","l":"2026-06-19","lr":"","t":"DEMOLICION","s":"Fabián Mejía Zuluaga","d":"Diagonal 41 No. 7-29","x":false},
{"r":"260200","f":"2026-06-01","e":"OBSERVACIONES","l":"2026-06-19","lr":"","t":"PROPIEDAD HORIZONTAL","s":"Teresa Ríos Montoya","d":"Carrera 46 No. 4-52","x":false},
{"r":"260201","f":"2026-06-02","e":"EN REVISION","l":"2026-06-22","lr":"","t":"CONSTRUCCION","s":"Guillermo Henao Salazar","d":"Calle 4 No. 24-85","x":false},
{"r":"260202","f":"2026-06-02","e":"NO LDF","l":"","lr":"","t":"URBANISMO","s":"Pilar Echeverri Castaño","d":"Avenida 37 No. 11-28","x":false},
{"r":"260203","f":"2026-06-03","e":"EN ESTUDIO","l":"2026-06-23","lr":"","t":"RECONOCIMIENTO","s":"Miguel Salazar Arango","d":"Transversal 4 No. 27-61","x":false},
{"r":"260204","f":"2026-06-03","e":"DESISTIDO","l":"","lr":"","t":"SUBDIVISION","s":"Daniela Giraldo Botero","d":"Diagonal 24 No. 16-94","x":false},
{"r":"260205","f":"2026-06-04","e":"EN ESTUDIO","l":"2026-06-24","lr":"","t":"AMPLIACION","s":"Diego Ospina Londoño","d":"Carrera 19 No. 9-37","x":false},
{"r":"260206","f":"2026-06-04","e":"OBSERVACIONES","l":"2026-06-23","lr":"","t":"MODIFICACION","s":"Natalia Zuluaga Gallego","d":"Calle 41 No. 21-63","x":false},
{"r":"260207","f":"2026-06-05","e":"APROBADO","l":"2026-06-25","lr":"2026-06-25","t":"OBRA NUEVA","s":"Fernando Arango Ríos","d":"Avenida 14 No. 3-96","x":false},
{"r":"260208","f":"2026-06-05","e":"RADICADO","l":"","lr":"","t":"CERRAMIENTO","s":"Andrea Botero Mejía","d":"Transversal 37 No. 20-29","x":false},
{"r":"260209","f":"2026-06-08","e":"EN ESTUDIO","l":"2026-06-26","lr":"","t":"DEMOLICION","s":"Carlos Londoño Henao","d":"Diagonal 13 No. 12-62","x":false},
{"r":"260210","f":"2026-06-08","e":"EN REVISION","l":"2026-06-26","lr":"","t":"PROPIEDAD HORIZONTAL","s":"Patricia Gallego Ospina","d":"Carrera 48 No. 7-85","x":false},
{"r":"260211","f":"2026-06-08","e":"NO LDF","l":"","lr":"","t":"CONSTRUCCION","s":"Álvaro Mejía Zuluaga","d":"Calle 16 No. 28-18","x":false},
{"r":"260212","f":"2026-06-09","e":"OBSERVACIONES","l":"2026-06-26","lr":"","t":"URBANISMO","s":"Sandra Ríos Arango","d":"Avenida 41 No. 15-51","x":false},
{"r":"260213","f":"2026-06-09","e":"EN ESTUDIO","l":"2026-06-29","lr":"","t":"RECONOCIMIENTO","s":"Luis Echeverri Montoya","d":"Transversal 11 No. 1-84","x":false},
{"r":"260214","f":"2026-06-10","e":"DESISTIDO","l":"","lr":"","t":"SUBDIVISION","s":"Mónica Henao Giraldo","d":"Diagonal 36 No. 23-17","x":false},
{"r":"260215","f":"2026-06-10","e":"EN ESTUDIO","l":"2026-06-30","lr":"","t":"AMPLIACION","s":"Ricardo Salazar Botero","d":"Carrera 6 No. 16-43","x":false},
{"r":"260216","f":"2026-06-11","e":"RADICADO","l":"","lr":"","t":"MODIFICACION","s":"Diana Ospina Castaño","d":"Calle 30 No. 10-76","x":false},
{"r":"260217","f":"2026-06-11","e":"APROBADO","l":"2026-07-01","lr":"2026-07-01","t":"OBRA NUEVA","s":"Jorge Zuluaga Londoño","d":"Avenida 22 No. 8-19","x":false},
{"r":"260218","f":"2026-06-12","e":"EN ESTUDIO","l":"2026-07-02","lr":"","t":"CERRAMIENTO","s":"Valentina Arango Gallego","d":"Transversal 28 No. 25-42","x":false},
{"r":"260219","f":"2026-06-12","e":"OBSERVACIONES","l":"2026-07-01","lr":"","t":"DEMOLICION","s":"Ernesto Botero Ríos","d":"Diagonal 20 No. 18-75","x":false},
{"r":"260220","f":"2026-06-15","e":"EN REVISION","l":"2026-07-03","lr":"","t":"PROPIEDAD HORIZONTAL","s":"Carolina Londoño Mejía","d":"Carrera 40 No. 3-98","x":false},
{"r":"260221","f":"2026-06-15","e":"NO LDF","l":"","lr":"","t":"CONSTRUCCION","s":"Arturo Gallego Henao","d":"Calle 7 No. 14-21","x":false},
{"r":"260222","f":"2026-06-15","e":"EN ESTUDIO","l":"2026-07-06","lr":"","t":"URBANISMO","s":"María Mejía Ospina","d":"Avenida 30 No. 22-54","x":false},
{"r":"260223","f":"2026-06-16","e":"RADICADO","l":"","lr":"","t":"RECONOCIMIENTO","s":"Juan Ríos Zuluaga","d":"Transversal 35 No. 6-87","x":false},
{"r":"260224","f":"2026-06-16","e":"DESISTIDO","l":"","lr":"","t":"SUBDIVISION","s":"Laura Henao Arango","d":"Diagonal 48 No. 29-13","x":false},
{"r":"260225","f":"2026-06-17","e":"EN ESTUDIO","l":"2026-07-07","lr":"","t":"AMPLIACION","s":"Pedro Echeverri Salazar","d":"Carrera 11 No. 12-46","x":false},
{"r":"260226","f":"2026-06-17","e":"OBSERVACIONES","l":"2026-07-07","lr":"","t":"MODIFICACION","s":"Rosa Montoya Giraldo","d":"Calle 35 No. 5-79","x":false},
{"r":"260227","f":"2026-06-18","e":"APROBADO","l":"2026-07-08","lr":"2026-07-08","t":"OBRA NUEVA","s":"Mauricio Salazar Botero","d":"Avenida 44 No. 17-32","x":false},
{"r":"260228","f":"2026-06-18","e":"EN ESTUDIO","l":"2026-07-08","lr":"","t":"CERRAMIENTO","s":"Silvia Giraldo Londoño","d":"Transversal 2 No. 21-65","x":false},
{"r":"260229","f":"2026-06-19","e":"RADICADO","l":"","lr":"","t":"DEMOLICION","s":"Alberto Ospina Gallego","d":"Diagonal 26 No. 10-98","x":false},
{"r":"260230","f":"2026-06-19","e":"EN REVISION","l":"2026-07-09","lr":"","t":"PROPIEDAD HORIZONTAL","s":"Catalina Zuluaga Ríos","d":"Carrera 33 No. 24-21","x":false},
{"r":"260231","f":"2026-06-22","e":"OBSERVACIONES","l":"2026-07-10","lr":"","t":"CONSTRUCCION","s":"Germán Arango Mejía","d":"Calle 13 No. 7-54","x":false},
{"r":"260232","f":"2026-06-22","e":"NO LDF","l":"","lr":"","t":"URBANISMO","s":"Angélica Botero Henao","d":"Avenida 18 No. 30-87","x":false},
{"r":"260233","f":"2026-06-22","e":"EN ESTUDIO","l":"2026-07-13","lr":"","t":"RECONOCIMIENTO","s":"Héctor Londoño Castaño","d":"Transversal 41 No. 2-13","x":false},
{"r":"260234","f":"2026-06-23","e":"EN ESTUDIO","l":"2026-07-13","lr":"","t":"SUBDIVISION","s":"Margarita Gallego Ospina","d":"Diagonal 34 No. 19-46","x":false},
{"r":"260235","f":"2026-06-23","e":"RADICADO","l":"","lr":"","t":"AMPLIACION","s":"Rodrigo Mejía Zuluaga","d":"Carrera 25 No. 14-79","x":false},
{"r":"260236","f":"2026-06-24","e":"EN ESTUDIO","l":"2026-07-14","lr":"","t":"MODIFICACION","s":"Adriana Ríos Arango","d":"Calle 48 No. 22-32","x":false},
{"r":"260237","f":"2026-06-24","e":"DESISTIDO","l":"","lr":"","t":"OBRA NUEVA","s":"Camilo Henao Botero","d":"Avenida 3 No. 9-65","x":false},
{"r":"260238","f":"2026-06-25","e":"EN ESTUDIO","l":"2026-07-15","lr":"","t":"CERRAMIENTO","s":"Gloria Echeverri Salazar","d":"Transversal 17 No. 26-98","x":false},
{"r":"260239","f":"2026-06-25","e":"OBSERVACIONES","l":"2026-07-15","lr":"","t":"DEMOLICION","s":"Fabián Ospina Giraldo","d":"Diagonal 10 No. 4-21","x":false}
];
const P=[...P1,...P2,...P3];

const _ARQS = ["Diana Uribe","Adriana Marulanda","Laura Arandia","Camila Marulanda"];
const _INGS = ["Alejandra Calderon","Camilo Rodriguez","Jorge Obed"];
const PROYECTOS_2026 = P.map((p, i) => ({
  radicado: p.r, fechaRad: p.f, estado: p.e, ldf: p.l, ldfReal: p.lr,
  tipoLicencia: p.t, solicitante: p.s, direccion: p.d, estrategico: p.x,
  tecnico: p.x ? _ARQS[i % _ARQS.length] : "",
  revisorEstruc: p.x ? _INGS[i % _INGS.length] : ""
}));

const ARQUITECTOS = ["Diana Uribe","Adriana Marulanda","Laura Arandia","Camila Marulanda"];
const INGENIEROS = ["Alejandra Calderon","Camilo Rodriguez","Jorge Obed"];
const CURADOR = "Luis Fernando Montes";
const COLORS = ["#c62828","#1565c0","#f57c00","#7b1fa2","#2e7d32","#00838f","#4e342e","#283593","#558b2f","#d84315"];

const HISTORICO_ANOS = [
  { ano: 2019, total: 487, aprobados: 312, desistidos: 45, enEstudio: 0 },
  { ano: 2020, total: 389, aprobados: 245, desistidos: 38, enEstudio: 0 },
  { ano: 2021, total: 523, aprobados: 367, desistidos: 52, enEstudio: 0 },
  { ano: 2022, total: 612, aprobados: 421, desistidos: 61, enEstudio: 0 },
  { ano: 2023, total: 698, aprobados: 489, desistidos: 58, enEstudio: 0 },
  { ano: 2024, total: 751, aprobados: 534, desistidos: 67, enEstudio: 12 },
  { ano: 2025, total: 710, aprobados: 498, desistidos: 71, enEstudio: 5 },
  { ano: 2026, total: 239, aprobados: 0, desistidos: 0, enEstudio: 0 }
];

const FESTIVOS_2026 = [
  "2026-01-01","2026-01-12","2026-03-23","2026-04-02","2026-04-03",
  "2026-05-01","2026-05-18","2026-06-08","2026-06-15","2026-06-29",
  "2026-07-20","2026-08-07","2026-08-17","2026-10-12","2026-11-02",
  "2026-11-16","2026-12-08","2026-12-25"
];

// ========== UTILITIES ==========
const festSet = new Set(FESTIVOS_2026);
function esDiaHabil(d) {
  const day = d.getDay();
  if (day === 0 || day === 6) return false;
  const s = d.toISOString().slice(0,10);
  return !festSet.has(s);
}
function addDiasHabiles(fecha, dias) {
  const d = new Date(fecha + "T12:00:00");
  let count = 0;
  while (count < dias) { d.setDate(d.getDate() + 1); if (esDiaHabil(d)) count++; }
  return d;
}
function diasHabilesEntre(f1, f2) {
  const a = new Date(f1 + "T12:00:00"), b = new Date(f2 + "T12:00:00");
  let count = 0, d = new Date(a);
  while (d <= b) { if (esDiaHabil(d)) count++; d.setDate(d.getDate() + 1); }
  return count;
}
function formatDate(s) {
  if (!s) return "—";
  const d = new Date(s + "T12:00:00");
  return d.toLocaleDateString("es-CO", { day:"2-digit", month:"short", year:"numeric" });
}
function hoy() { return new Date().toISOString().slice(0,10); }
function estadoColor(e) {
  const m = { "APROBADO":"badge-green","DESISTIDO":"badge-red","NO LDF":"badge-orange",
    "OBSERVACIONES":"badge-yellow","EN ESTUDIO":"badge-blue","RADICADO":"badge-gray",
    "EN REVISION":"badge-blue","CORRECCION":"badge-purple","NOTIFICADO":"badge-green" };
  return m[e] || "badge-gray";
}
function involucrado(p, nombre) {
  return p.tecnico === nombre || p.revisorEstruc === nombre;
}
// ========== COMPONENTS ==========

// --- Stat Card ---
function StatCard({ number, label, sub, color, icon: Icon }) {
  return (
    <div className="card stat-card fade-in">
      {Icon && <Icon size={20} color={color || "var(--primary)"} style={{ marginBottom: 4 }} />}
      <div className="number" style={{ color: color || "var(--primary)" }}>{number}</div>
      <div className="label">{label}</div>
      {sub && <div className="sub">{sub}</div>}
    </div>
  );
}

// --- 1. DASHBOARD ---
function DashboardView({ proyectos }) {
  const stats = useMemo(() => {
    const byEstado = {};
    const byTipo = {};
    const byMes = {};
    proyectos.forEach(p => {
      byEstado[p.estado] = (byEstado[p.estado] || 0) + 1;
      byTipo[p.tipoLicencia] = (byTipo[p.tipoLicencia] || 0) + 1;
      const mes = p.fechaRad.slice(0,7);
      byMes[mes] = (byMes[mes] || 0) + 1;
    });
    const estrategicos = proyectos.filter(p => p.estrategico).length;
    const h = hoy();
    const vencidos = proyectos.filter(p => {
      if (!p.ldf || p.estado === "APROBADO" || p.estado === "DESISTIDO") return false;
      return addDiasHabiles(p.ldf, 45).toISOString().slice(0,10) < h;
    }).length;
    return { byEstado, byTipo, byMes, total: proyectos.length, estrategicos, vencidos };
  }, [proyectos]);

  const estadoData = Object.entries(stats.byEstado).map(([name, value]) => ({ name, value }));
  const tipoData = Object.entries(stats.byTipo).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value);
  const mesData = Object.entries(stats.byMes).sort().map(([mes, total]) => ({
    mes: new Date(mes + "-01T12:00:00").toLocaleDateString("es-CO", { month: "short" }),
    total
  }));

  return (
    <div className="fade-in">
      <div className="grid grid-4" style={{ marginBottom: 20 }}>
        <StatCard number={stats.total} label="Total Radicados 2026" icon={FolderOpen} />
        <StatCard number={stats.estrategicos} label="Estratégicos" color="#f57c00" icon={Star} />
        <StatCard number={stats.byEstado["EN ESTUDIO"] || 0} label="En Estudio" color="#1565c0" icon={Search} />
        <StatCard number={stats.byEstado["APROBADO"] || 0} label="Aprobados" color="#2e7d32" icon={CheckCircle} />
      </div>
      <div className="grid grid-4" style={{ marginBottom: 20 }}>
        <StatCard number={stats.byEstado["OBSERVACIONES"] || 0} label="Observaciones" color="#f9a825" icon={AlertTriangle} />
        <StatCard number={stats.byEstado["NO LDF"] || 0} label="Sin LDF" color="#e65100" icon={XCircle} />
        <StatCard number={stats.byEstado["DESISTIDO"] || 0} label="Desistidos" color="#c62828" icon={XCircle} />
        <StatCard number={stats.vencidos} label="Vencidos" color="#d32f2f" icon={Clock} />
      </div>
      <div className="grid grid-2">
        <div className="card">
          <div className="card-header"><h3>Radicados por Mes</h3></div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={mesData}><XAxis dataKey="mes" fontSize={12} /><YAxis fontSize={12} />
              <Tooltip /><Bar dataKey="total" fill="var(--primary)" radius={[4,4,0,0]} /></BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <div className="card-header"><h3>Distribución por Estado</h3></div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart><Pie data={estadoData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({name,value})=>`${name}: ${value}`} labelLine={false} fontSize={11}>
              {estadoData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie><Tooltip /></PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="card" style={{ marginTop: 16 }}>
        <div className="card-header"><h3>Top Tipos de Licencia</h3></div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={tipoData.slice(0,8)} layout="vertical">
            <XAxis type="number" fontSize={12} /><YAxis dataKey="name" type="category" width={130} fontSize={11} />
            <Tooltip /><Bar dataKey="value" fill="#1565c0" radius={[0,4,4,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// --- 2. MODO TV ---
function ModoTV({ proyectos, onClose }) {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const stats = useMemo(() => {
    const byEstado = {};
    proyectos.forEach(p => { byEstado[p.estado] = (byEstado[p.estado] || 0) + 1; });
    const estrategicos = proyectos.filter(p => p.estrategico).length;
    const aprobados = (byEstado["APROBADO"]||0) + (byEstado["NOTIFICADO"]||0);
    const enRevision = (byEstado["EN REVISION"]||0) + (byEstado["EN ESTUDIO"]||0);
    const tasa = proyectos.length > 0 ? Math.round(aprobados / proyectos.length * 100) : 0;
    const h = hoy();
    const urgentes = proyectos.filter(p => {
      if (!p.ldf || p.estado === "APROBADO" || p.estado === "DESISTIDO") return false;
      const v = addDiasHabiles(p.ldf, 45).toISOString().slice(0,10);
      return v < h;
    });
    const allTec = [...ARQUITECTOS, ...INGENIEROS];
    const prodData = allTec.map(nombre => {
      const proys = proyectos.filter(p => involucrado(p, nombre));
      const a = proys.filter(p => p.estado === "APROBADO" || p.estado === "NOTIFICADO").length;
      const r = proys.filter(p => p.estado === "EN REVISION" || p.estado === "EN ESTUDIO").length;
      const ac = proys.filter(p => p.estado === "OBSERVACIONES" || p.estado === "CORRECCION").length;
      return { nombre: nombre.split(" ")[0] + " " + nombre.split(" ")[1], a, r, ac, total: proys.length };
    });
    const ranking = prodData.map(p => ({...p, aprobados: p.a, tasa: p.total > 0 ? Math.round(p.a / p.total * 100) : 0})).sort((a,b) => b.aprobados - a.aprobados);
    const movimientos = proyectos.filter(p => p.estrategico).map(p => ({ rad: p.radicado, estado: p.estado, tecnico: p.tecnico, revisor: p.revisorEstruc, fecha: p.ldf || p.fechaRad })).sort((a,b) => b.fecha.localeCompare(a.fecha)).slice(0, 7);
    return { byEstado, estrategicos, aprobados, enRevision, tasa, urgentes, prodData, ranking, movimientos, total: proyectos.length };
  }, [proyectos]);
  const donutData = [
    { name: "Aprobados", value: stats.aprobados, color: "#2e7d32" },
    { name: "En Revisión", value: stats.enRevision, color: "#1976d2" },
    { name: "En Acta", value: (stats.byEstado["OBSERVACIONES"]||0) + (stats.byEstado["CORRECCION"]||0), color: "#f9a825" },
    { name: "NO LDF", value: stats.byEstado["NO LDF"]||0, color: "#e53935" },
  ].filter(d => d.value > 0);
  const fechaStr = time.toLocaleDateString("es-CO", { weekday:"long", day:"numeric", month:"long" }).replace(/^\w/, c => c.toUpperCase());
  const horaStr = time.toLocaleTimeString("es-CO", { hour12: false });
  const tvS = `
    .tv-bg{position:fixed;inset:0;background:#0d1117;color:#e0e0e0;overflow-y:auto;z-index:300;font-family:'Segoe UI',system-ui,sans-serif}
    .tv-top{display:flex;justify-content:space-between;align-items:center;padding:16px 30px;background:linear-gradient(135deg,#1a1a2e,#16213e);border-bottom:2px solid #c62828}
    .tv-title{font-size:26px;font-weight:800;letter-spacing:3px;color:#c9a84c}.tv-subtitle{font-size:12px;letter-spacing:4px;color:#888;margin-top:2px}
    .tv-clock{font-size:48px;font-weight:200;font-family:'Courier New',monospace}.tv-date{font-size:13px;color:#888;text-align:right}
    .tv-back{background:none;border:1px solid #555;color:#aaa;padding:6px 16px;border-radius:6px;cursor:pointer;font-size:13px}
    .tv-stats{display:grid;grid-template-columns:repeat(6,1fr);gap:14px;padding:20px 30px}
    .tv-sc{background:#161b22;border:1px solid #30363d;border-radius:12px;padding:18px;text-align:center}
    .tv-sn{font-size:40px;font-weight:700;line-height:1.1}.tv-sl{font-size:11px;letter-spacing:2px;color:#888;margin-top:6px;text-transform:uppercase}
    .tv-body{display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;padding:0 30px 16px}
    .tv-p{background:#161b22;border:1px solid #30363d;border-radius:12px;padding:20px}
    .tv-pt{font-size:13px;letter-spacing:2px;color:#888;margin-bottom:16px;font-weight:600}
    .tv-row2{display:grid;grid-template-columns:1fr 1fr;gap:16px;padding:0 30px 30px}
    .tv-ac{background:#1a1a2e;border:1px solid #30363d;border-radius:10px;padding:14px;margin-bottom:10px;border-left:3px solid #c62828;display:flex;gap:12px;align-items:center}
    .tv-days{width:52px;height:52px;border-radius:8px;background:#c62828;display:flex;flex-direction:column;align-items:center;justify-content:center;flex-shrink:0}
    @media(max-width:1200px){.tv-stats{grid-template-columns:repeat(3,1fr)}.tv-body,.tv-row2{grid-template-columns:1fr}}
  `;
  const maxBar = Math.max(...stats.prodData.map(p => p.total), 1);
  return (
    <div className="tv-bg"><style>{tvS}</style>
      <div className="tv-top">
        <div><div style={{display:"flex",alignItems:"center",gap:12}}><span style={{fontSize:28}}>✕</span><div className="tv-title">CURADURÍA 2 PEREIRA</div></div><div className="tv-subtitle">CENTRO DE CONTROL · PROYECTOS ESTRATÉGICOS</div></div>
        <div style={{display:"flex",alignItems:"center",gap:24}}><div><div className="tv-date">{fechaStr}</div><div className="tv-clock">{horaStr}</div></div><button className="tv-back" onClick={onClose}>← Volver</button></div>
      </div>
      <div className="tv-stats">
        <div className="tv-sc"><div className="tv-sn" style={{color:"#e0e0e0"}}>{stats.total}</div><div className="tv-sl">Total</div></div>
        <div className="tv-sc"><div className="tv-sn" style={{color:"#c9a84c"}}>{stats.estrategicos}</div><div className="tv-sl">⭐ Estratégicos</div></div>
        <div className="tv-sc"><div className="tv-sn" style={{color:"#4caf50"}}>{stats.aprobados}</div><div className="tv-sl">Aprobados</div></div>
        <div className="tv-sc"><div className="tv-sn" style={{color:"#42a5f5"}}>{stats.enRevision}</div><div className="tv-sl">En Revisión</div></div>
        <div className="tv-sc"><div className="tv-sn" style={{color:"#ab47bc"}}>{stats.tasa}%</div><div className="tv-sl">Tasa Aprob.</div></div>
        <div className="tv-sc"><div className="tv-sn" style={{color:"#ef5350"}}>{stats.urgentes.length}</div><div className="tv-sl">Urgentes</div></div>
      </div>
      <div className="tv-body">
        <div className="tv-p"><div className="tv-pt">🏆 PRODUCTIVIDAD DEL EQUIPO</div>
          {stats.prodData.map((p,i) => (<div key={i} style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}><div style={{width:120,fontSize:12,color:"#ccc",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.nombre}</div><div style={{flex:1,height:18,display:"flex",borderRadius:4,overflow:"hidden"}}>{p.a>0&&<div style={{width:`${p.a/maxBar*100}%`,background:"#2e7d32",minWidth:4}}/>}{p.r>0&&<div style={{width:`${p.r/maxBar*100}%`,background:"#1976d2",minWidth:4}}/>}{p.ac>0&&<div style={{width:`${p.ac/maxBar*100}%`,background:"#f9a825",minWidth:4}}/>}</div><div style={{fontSize:10,color:"#888",width:110,textAlign:"right"}}>{p.a}A·{p.r}R·{p.ac}Ac·{p.total}T</div></div>))}
          <div style={{display:"flex",gap:16,marginTop:8,fontSize:11,color:"#888"}}><span><span style={{display:"inline-block",width:10,height:10,borderRadius:"50%",background:"#2e7d32",marginRight:4}}/>Aprobados</span><span><span style={{display:"inline-block",width:10,height:10,borderRadius:"50%",background:"#1976d2",marginRight:4}}/>En Revisión</span><span><span style={{display:"inline-block",width:10,height:10,borderRadius:"50%",background:"#f9a825",marginRight:4}}/>En Acta</span></div>
        </div>
        <div className="tv-p"><div className="tv-pt">📊 ESTADO GENERAL</div>
          <ResponsiveContainer width="100%" height={220}><PieChart><Pie data={donutData} cx="50%" cy="50%" innerRadius={60} outerRadius={95} dataKey="value" strokeWidth={0}>{donutData.map((d,i)=><Cell key={i} fill={d.color}/>)}</Pie></PieChart></ResponsiveContainer>
          <div style={{marginTop:8}}>{donutData.map((d,i)=>(<div key={i} style={{fontSize:14,color:"#ccc",display:"flex",alignItems:"center",gap:10,marginBottom:10}}><div style={{width:12,height:12,borderRadius:"50%",background:d.color,flexShrink:0}}/><span>{d.name}</span><span style={{marginLeft:"auto",fontSize:22,fontWeight:700,color:d.color}}>{d.value}</span></div>))}<div style={{fontSize:14,color:"#ccc",display:"flex",alignItems:"center",gap:10,borderTop:"1px solid #30363d",paddingTop:8,marginTop:8}}><span style={{fontWeight:600}}>Total General</span><span style={{marginLeft:"auto",fontSize:22,fontWeight:700,color:"#e0e0e0"}}>{stats.total}</span></div></div>
        </div>
        <div className="tv-p" style={{maxHeight:500,overflowY:"auto"}}><div className="tv-pt">🚦 SEMÁFORO DE TÉRMINOS</div>
          {stats.urgentes.slice(0,8).map(p=>{const venc=addDiasHabiles(p.ldf,45);const dias=diasHabilesEntre(venc.toISOString().slice(0,10),hoy());return(<div key={p.radicado} className="tv-ac"><div style={{flex:1}}><div style={{fontSize:16,fontWeight:700,color:"#c9a84c"}}>⭐ {p.radicado}</div><div style={{fontSize:12,color:"#aaa",marginTop:2}}>{p.tipoLicencia}</div><div style={{fontSize:11,color:"#777",marginTop:4}}>{p.tecnico&&<>Técnico: {p.tecnico}<br/></>}{p.revisorEstruc&&<>Revisor: {p.revisorEstruc}<br/></>}</div><span style={{display:"inline-block",padding:"3px 8px",borderRadius:4,fontSize:10,fontWeight:600,background:"#1b5e20",color:"#a5d6a7"}}>{p.estado}</span></div><div className="tv-days"><div style={{fontSize:18,fontWeight:800,color:"#fff"}}>{dias}</div><div style={{fontSize:8,color:"#ffcdd2",letterSpacing:1}}>VENCIDO</div></div></div>);})}
        </div>
      </div>
      <div className="tv-row2">
        <div className="tv-p"><div className="tv-pt">🏆 RANKING DE APROBACIONES</div>
          {stats.ranking.map((r,i)=>(<div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:"1px solid #30363d"}}><span style={{fontSize:20,width:30,textAlign:"center"}}>{i<3?["🥇","🥈","🥉"][i]:(i+1)}</span><div style={{flex:1}}><div style={{fontWeight:600,color:"#e0e0e0",fontSize:14}}>{r.nombre}</div><div style={{fontSize:11,color:"#888"}}>{ARQUITECTOS.some(a=>a.startsWith(r.nombre.split(" ")[0]))?"Arquitecta":"Ingeniero"}</div></div><div style={{textAlign:"right"}}><div style={{fontSize:28,fontWeight:700,color:"#e0e0e0"}}>{r.aprobados}</div><div style={{fontSize:11,color:"#888"}}>{r.tasa}% aprob.</div></div></div>))}
        </div>
        <div className="tv-p"><div className="tv-pt">📋 ÚLTIMOS MOVIMIENTOS</div>
          {stats.movimientos.map((m,i)=>(<div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:"1px solid #30363d"}}><div style={{width:10,height:10,borderRadius:"50%",background:"#4caf50",flexShrink:0}}/><div style={{flex:1}}><span style={{color:"#c9a84c"}}>⭐ </span><span style={{color:"#e0e0e0"}}>Radicado {m.rad} · </span><span style={{color:"#888"}}>{m.estado} · {m.tecnico||m.revisor}</span></div><span style={{fontSize:12,color:"#555"}}>{formatDate(m.fecha)}</span></div>))}
        </div>
      </div>
    </div>
  );
}

// --- 3. ESTRATÉGICOS ---
function EstrategicosView({ proyectos }) {
  const [search, setSearch] = useState("");
  const estra = useMemo(() => proyectos.filter(p => p.estrategico), [proyectos]);
  const filtered = useMemo(() => {
    if (!search) return estra;
    const q = search.toLowerCase();
    return estra.filter(p => p.radicado.includes(q) || p.solicitante.toLowerCase().includes(q) || p.direccion.toLowerCase().includes(q));
  }, [estra, search]);
  const stats = useMemo(() => {
    const byEstado = {};
    estra.forEach(p => { byEstado[p.estado] = (byEstado[p.estado] || 0) + 1; });
    return byEstado;
  }, [estra]);
  return (
    <div className="fade-in">
      <div className="grid grid-4" style={{ marginBottom: 16 }}>
        <StatCard number={estra.length} label="Total Estratégicos" color="#f57c00" icon={Star} />
        <StatCard number={stats["EN ESTUDIO"]||0} label="En Estudio" color="#1565c0" icon={Search} />
        <StatCard number={stats["APROBADO"]||0} label="Aprobados" color="#2e7d32" icon={CheckCircle} />
        <StatCard number={stats["OBSERVACIONES"]||0} label="Observaciones" color="#f9a825" icon={AlertTriangle} />
      </div>
      <div className="card">
        <div className="search-box"><input placeholder="Buscar por radicado, solicitante o dirección..." value={search} onChange={e => setSearch(e.target.value)} /></div>
        <div className="table-wrap">
          <table><thead><tr><th>Radicado</th><th>Fecha</th><th>Solicitante</th><th>Tipo</th><th>Dirección</th><th>LDF</th><th>Estado</th></tr></thead>
            <tbody>{filtered.map(p => (<tr key={p.radicado}><td><strong>⭐ {p.radicado}</strong></td><td>{formatDate(p.fechaRad)}</td><td>{p.solicitante}</td><td style={{fontSize:11}}>{p.tipoLicencia}</td><td style={{fontSize:11}}>{p.direccion}</td><td>{formatDate(p.ldf)}</td><td><span className={`badge ${estadoColor(p.estado)}`}>{p.estado}</span></td></tr>))}</tbody></table>
        </div>
      </div>
    </div>
  );
}
// --- 4. INGRESO DE TÉCNICOS (Vista Técnico) ---
function IngresoTecnicoView({ proyectos, setProyectos }) {
  const [selTecnico, setSelTecnico] = useState(null);
  if (!selTecnico) return <TecnicoSelector onSelect={setSelTecnico} />;
  return <VistaTecnico nombre={selTecnico} proyectos={proyectos} setProyectos={setProyectos} onBack={() => setSelTecnico(null)} />;
}
function TecnicoSelector({ onSelect }) {
  const todos = [...ARQUITECTOS.map(n => ({nombre:n, rol:"Arquitecta"})), ...INGENIEROS.map(n => ({nombre:n, rol: n === "Alejandra Calderon" ? "Ingeniera" : "Ingeniero"}))];
  const ss = `.sel-bg{min-height:80vh;background:linear-gradient(135deg,#0d1117,#161b22,#1a1a2e);border-radius:var(--radius);padding:50px 20px;display:flex;flex-direction:column;align-items:center}.sel-title{font-size:36px;font-weight:800;color:#e0e0e0;margin-bottom:4px;text-align:center}.sel-sub{font-size:14px;color:#c9a84c;margin-bottom:30px;text-align:center}.sel-hint{font-size:14px;color:#888;margin-bottom:24px}.sel-list{width:100%;max-width:600px;display:flex;flex-direction:column;gap:12px}.sel-card{display:flex;align-items:center;gap:16px;padding:18px 24px;background:rgba(255,255,255,0.04);border:1px solid #30363d;border-radius:14px;cursor:pointer;transition:all .2s}.sel-card:hover{background:rgba(255,255,255,0.08);border-color:#555;transform:translateX(4px)}.sel-avatar{width:50px;height:50px;border-radius:50%;background:#e53935;display:flex;align-items:center;justify-content:center;font-weight:700;color:#fff;font-size:18px;flex-shrink:0}.sel-name{font-size:16px;font-weight:600;color:#e0e0e0}.sel-rol{font-size:13px;color:#888}.sel-arrow{margin-left:auto;color:#555;font-size:20px}`;
  return (<div><style>{ss}</style><div className="sel-bg"><div className="sel-title">Curaduría 2 Pereira</div><div className="sel-sub">Proyectos Estratégicos 2026</div><div className="sel-hint">Selecciona tu nombre para ver tu panorama de proyectos</div><div className="sel-list">{todos.map(t=>(<div key={t.nombre} className="sel-card" onClick={()=>onSelect(t.nombre)}><div className="sel-avatar">{t.nombre.split(" ").map(n=>n[0]).join("").slice(0,2)}</div><div><div className="sel-name">{t.nombre}</div><div className="sel-rol">{t.rol}</div></div><div className="sel-arrow">›</div></div>))}</div></div></div>);
}
function VistaTecnico({ nombre, proyectos, setProyectos, onBack }) {
  const rol = ARQUITECTOS.includes(nombre) ? "Arquitecta" : (nombre === "Alejandra Calderon" ? "Ingeniera" : "Ingeniero");
  const misProyectos = useMemo(() => proyectos.filter(p => involucrado(p, nombre)), [proyectos, nombre]);
  const estrategicos = misProyectos.filter(p => p.estrategico);
  const aprobados = misProyectos.filter(p => p.estado === "APROBADO" || p.estado === "NOTIFICADO").length;
  const enRevision = misProyectos.filter(p => p.estado === "EN REVISION" || p.estado === "EN ESTUDIO").length;
  const tasaAprob = misProyectos.length > 0 ? Math.round(aprobados / misProyectos.length * 100) : 0;
  const h = hoy();
  const sorted = useMemo(() => [...misProyectos].sort((a,b) => { if (a.estrategico&&!b.estrategico) return -1; if (!a.estrategico&&b.estrategico) return 1; return a.fechaRad.localeCompare(b.fechaRad); }), [misProyectos]);
  function getDeadlineInfo(p) { if (!p.ldf) return null; const venc=addDiasHabiles(p.ldf,45); const vencStr=venc.toISOString().slice(0,10); const dias=diasHabilesEntre(h,vencStr); const vencido=vencStr<h; const diasVenc=vencido?diasHabilesEntre(vencStr,h):dias; return {vencStr,dias:diasVenc,vencido}; }
  function getRolBadge(p) { if (p.tecnico===nombre&&p.revisorEstruc===nombre) return "ARQ + ESTRUC"; if (p.tecnico===nombre) return "REV ARQ"; if (p.revisorEstruc===nombre) return "REV ESTRUC"; return ""; }
  const vs = `.vt-header{display:flex;align-items:flex-start;justify-content:space-between;padding:20px 0;border-bottom:2px solid var(--border);margin-bottom:20px}.vt-brand{font-size:18px;font-weight:700}.vt-brand-sub{font-size:12px;color:var(--text3)}.vt-back{background:#e53935;color:#fff;border:none;padding:8px 18px;border-radius:6px;cursor:pointer;font-size:13px;font-weight:500}.vt-title{font-size:22px;font-weight:700;margin-bottom:4px}.vt-rol{font-size:13px;color:var(--text3)}.vt-stats{display:grid;grid-template-columns:repeat(5,1fr);gap:12px;margin:20px 0}.vt-stat{border:1px solid var(--border);border-radius:10px;padding:16px;text-align:center}.vt-stat-num{font-size:32px;font-weight:700;line-height:1.1}.vt-stat-label{font-size:12px;color:var(--text3);margin-top:4px}.vt-alert{background:#fffde7;border:1px solid #fff9c4;border-radius:10px;padding:16px;margin-bottom:20px}.vt-alert-title{color:#f57f17;font-weight:600;font-size:14px}.vt-alert-text{font-size:13px;color:var(--text2);margin-top:4px}.vt-section-title{font-size:16px;font-weight:700;margin-bottom:16px}.vt-project{border-left:4px solid var(--primary);border-radius:8px;padding:16px;margin-bottom:12px;background:var(--card);border:1px solid var(--border);display:flex;justify-content:space-between;align-items:flex-start}.vt-project.strategic{border-left-color:#c9a84c;background:#fffdf5}.vt-project-rad{font-size:16px;font-weight:600;color:var(--primary)}.vt-project-rad.strategic{color:#c9a84c}.vt-project-tipo{font-size:13px;font-weight:600;margin-top:2px}.vt-project-info{font-size:12px;color:var(--text3);margin-top:4px}.vt-badges{display:flex;gap:6px;flex-wrap:wrap;align-items:center}.vt-badge{padding:4px 10px;border-radius:4px;font-size:11px;font-weight:600}.vt-badge-green{background:#e8f5e9;color:#2e7d32}.vt-badge-blue{background:#e3f2fd;color:#1565c0}.vt-badge-red{background:#ffebee;color:#c62828}.vt-badge-orange{background:#fff3e0;color:#e65100}.vt-badge-yellow{background:#fffde7;color:#f57f17}@media(max-width:768px){.vt-stats{grid-template-columns:repeat(2,1fr)}}`;
  return (
    <div><style>{vs}</style>
      <div className="vt-header"><div><div className="vt-brand">🏛️ Curaduría Urbana N.° 2</div><div className="vt-brand-sub">Pereira · Vista Técnico</div></div><button className="vt-back" onClick={onBack}>↩ Cambiar usuario</button></div>
      <div className="vt-title">Mis Proyectos — {nombre}</div><div className="vt-rol">{rol}</div>
      <div className="vt-stats">
        <div className="vt-stat"><div className="vt-stat-num" style={{color:"var(--primary)"}}>{misProyectos.length}</div><div className="vt-stat-label">Mis Proyectos</div></div>
        <div className="vt-stat"><div className="vt-stat-num" style={{color:"#c9a84c"}}>{estrategicos.length}</div><div className="vt-stat-label">⭐ Estratégicos</div></div>
        <div className="vt-stat"><div className="vt-stat-num" style={{color:"#2e7d32"}}>{aprobados}</div><div className="vt-stat-label">Aprobados</div></div>
        <div className="vt-stat"><div className="vt-stat-num" style={{color:"#1565c0"}}>{enRevision}</div><div className="vt-stat-label">En Revisión</div></div>
        <div className="vt-stat"><div className="vt-stat-num" style={{color:tasaAprob>=50?"#2e7d32":"#e65100"}}>{tasaAprob}%</div><div className="vt-stat-label">% Aprobación</div></div>
      </div>
      {estrategicos.length > 0 && <div className="vt-alert"><div className="vt-alert-title">⭐ Tienes {estrategicos.length} proyectos estratégicos asignados</div><div className="vt-alert-text">Estos aparecen primero en la lista. Tienen prioridad de revisión.</div></div>}
      <div className="vt-section-title">Detalle de Proyectos (estratégicos primero)</div>
      {sorted.map(p => { const dl=getDeadlineInfo(p); const rolBadge=getRolBadge(p); return (
        <div key={p.radicado} className={`vt-project ${p.estrategico?"strategic":""}`}>
          <div><div className={`vt-project-rad ${p.estrategico?"strategic":""}`}>{p.estrategico?"⭐ ":""}{p.radicado}</div><div className="vt-project-tipo">{p.tipoLicencia}</div>
            {dl&&<div className="vt-project-info">Fecha LDF: <strong>{formatDate(p.ldf)}</strong><br/>Plazo legal vence: <strong>{dl.vencStr&&new Date(dl.vencStr+"T12:00:00").toLocaleDateString("es-CO")}</strong>{dl.vencido?` — Vencido hace ${dl.dias} días`:` — ${dl.dias} días restantes`}</div>}
            {!dl&&p.estado==="NO LDF"&&<div className="vt-project-info">Sin fecha LDF asignada</div>}</div>
          <div className="vt-badges">{rolBadge&&<span className="vt-badge vt-badge-blue">{rolBadge}</span>}{p.estado==="APROBADO"&&<span className="vt-badge vt-badge-green">APROBADO</span>}{p.estado==="OBSERVACIONES"&&<span className="vt-badge vt-badge-yellow">OBSERVACIONES</span>}{p.estado==="EN ESTUDIO"&&<span className="vt-badge vt-badge-blue">EN ESTUDIO</span>}{p.estado==="EN REVISION"&&<span className="vt-badge vt-badge-blue">EN REVISIÓN</span>}{p.estado==="NO LDF"&&<span className="vt-badge vt-badge-orange">NO LDF</span>}{p.estado==="DESISTIDO"&&<span className="vt-badge vt-badge-red">DESISTIDO</span>}{dl&&dl.vencido&&<span className="vt-badge vt-badge-red">⚠ VENCIDO</span>}</div>
        </div>);})}
      {misProyectos.length===0&&<div style={{textAlign:"center",padding:40,color:"var(--text3)"}}><p style={{fontSize:16}}>No tienes proyectos asignados actualmente.</p><p style={{fontSize:13,marginTop:8}}>Los proyectos se asignan desde el módulo de Ingreso Técnico.</p></div>}
    </div>
  );
}

// --- 5. TÉRMINOS ---
function TerminosView({ proyectos }) {
  const [filtro, setFiltro] = useState("todos");
  const h = hoy();
  const analisis = useMemo(() => {
    return proyectos.filter(p => p.ldf && p.estado !== "APROBADO" && p.estado !== "DESISTIDO" && p.estado !== "NOTIFICADO")
      .map(p => { const v45=addDiasHabiles(p.ldf,45); const vS=v45.toISOString().slice(0,10); const dr=diasHabilesEntre(h,vS); const vc=vS<h; const pv=!vc&&dr<=5; return {...p,vencimiento:vS,diasRestantes:dr,vencido:vc,porVencer:pv}; }).sort((a,b) => a.diasRestantes - b.diasRestantes);
  }, [proyectos, h]);
  const filtered = useMemo(() => { if(filtro==="vencidos") return analisis.filter(a=>a.vencido); if(filtro==="porVencer") return analisis.filter(a=>a.porVencer); if(filtro==="enTermino") return analisis.filter(a=>!a.vencido&&!a.porVencer); return analisis; }, [analisis, filtro]);
  const vencidos=analisis.filter(a=>a.vencido).length; const porVencer=analisis.filter(a=>a.porVencer).length; const enTermino=analisis.filter(a=>!a.vencido&&!a.porVencer).length;
  return (
    <div className="fade-in">
      <div className="grid grid-4" style={{marginBottom:16}}><StatCard number={analisis.length} label="Con Término Activo" icon={Clock}/><StatCard number={vencidos} label="Vencidos" color="#d32f2f" icon={XCircle}/><StatCard number={porVencer} label="Por Vencer (≤5 días)" color="#f9a825" icon={AlertTriangle}/><StatCard number={enTermino} label="En Término" color="#2e7d32" icon={CheckCircle}/></div>
      <div className="card"><div className="pill-row">{[["todos","Todos"],["vencidos","Vencidos"],["porVencer","Por Vencer"],["enTermino","En Término"]].map(([k,l])=>(<button key={k} className={`pill ${filtro===k?"active":""}`} onClick={()=>setFiltro(k)}>{l}</button>))}</div>
        <div className="table-wrap"><table><thead><tr><th>Radicado</th><th>Estado</th><th>Fecha Rad.</th><th>LDF</th><th>Vencimiento (45d)</th><th>Días Restantes</th><th>Semáforo</th></tr></thead>
          <tbody>{filtered.map(p=>(<tr key={p.radicado}><td><strong>{p.estrategico?"⭐ ":""}{p.radicado}</strong></td><td><span className={`badge ${estadoColor(p.estado)}`}>{p.estado}</span></td><td>{formatDate(p.fechaRad)}</td><td>{formatDate(p.ldf)}</td><td>{formatDate(p.vencimiento)}</td><td style={{fontWeight:700,color:p.vencido?"#c62828":p.porVencer?"#f57f17":"#2e7d32"}}>{p.vencido?`−${Math.abs(p.diasRestantes)}`:p.diasRestantes}</td><td>{p.vencido?<span className="badge badge-red">VENCIDO</span>:p.porVencer?<span className="badge badge-yellow">POR VENCER</span>:<span className="badge badge-green">EN TÉRMINO</span>}</td></tr>))}</tbody></table></div>
      </div>
    </div>
  );
}

// --- 6. PROYECTOS ---
function ProyectosView({ proyectos }) {
  const [search, setSearch] = useState(""); const [estadoFiltro, setEstadoFiltro] = useState("todos"); const [tipoFiltro, setTipoFiltro] = useState("todos");
  const estados = useMemo(() => [...new Set(proyectos.map(p=>p.estado))].sort(), [proyectos]);
  const tipos = useMemo(() => [...new Set(proyectos.map(p=>p.tipoLicencia))].sort(), [proyectos]);
  const filtered = useMemo(() => proyectos.filter(p => { if(estadoFiltro!=="todos"&&p.estado!==estadoFiltro) return false; if(tipoFiltro!=="todos"&&p.tipoLicencia!==tipoFiltro) return false; if(search){const q=search.toLowerCase();return p.radicado.includes(q)||p.solicitante.toLowerCase().includes(q)||p.direccion.toLowerCase().includes(q);} return true; }), [proyectos,search,estadoFiltro,tipoFiltro]);
  return (
    <div className="fade-in"><div className="card"><div className="search-box"><input placeholder="Buscar radicado, solicitante o dirección..." value={search} onChange={e=>setSearch(e.target.value)}/><select value={estadoFiltro} onChange={e=>setEstadoFiltro(e.target.value)}><option value="todos">Todos los estados</option>{estados.map(e=><option key={e} value={e}>{e}</option>)}</select><select value={tipoFiltro} onChange={e=>setTipoFiltro(e.target.value)}><option value="todos">Todos los tipos</option>{tipos.map(t=><option key={t} value={t}>{t}</option>)}</select></div>
      <div style={{fontSize:13,color:"var(--text2)",marginBottom:10}}>Mostrando {filtered.length} de {proyectos.length} proyectos</div>
      <div className="table-wrap" style={{maxHeight:600}}><table><thead><tr><th>Radicado</th><th>Fecha</th><th>Solicitante</th><th>Tipo</th><th>Dirección</th><th>LDF</th><th>Estado</th></tr></thead>
        <tbody>{filtered.map(p=>(<tr key={p.radicado}><td><strong>{p.estrategico?"⭐ ":""}{p.radicado}</strong></td><td>{formatDate(p.fechaRad)}</td><td>{p.solicitante}</td><td style={{fontSize:11}}>{p.tipoLicencia}</td><td style={{fontSize:11}}>{p.direccion}</td><td>{formatDate(p.ldf)}</td><td><span className={`badge ${estadoColor(p.estado)}`}>{p.estado}</span></td></tr>))}</tbody></table></div>
    </div></div>
  );
}

// --- 7. TÉCNICOS ---
function TecnicosView({ proyectos }) {
  const [sel, setSel] = useState(null);
  const tecData = useMemo(() => [...ARQUITECTOS,...INGENIEROS].map(nombre => { const asignados=proyectos.filter(p=>involucrado(p,nombre)); const rol=ARQUITECTOS.includes(nombre)?"Arquitecto":"Ingeniero"; const byEstado={}; asignados.forEach(p=>{byEstado[p.estado]=(byEstado[p.estado]||0)+1;}); return {nombre,rol,total:asignados.length,byEstado,proyectos:asignados}; }), [proyectos]);
  const ca = ["#c62828","#1565c0","#f57c00","#7b1fa2","#2e7d32","#00838f","#4e342e"];
  return (
    <div className="fade-in">
      <div className="grid grid-3" style={{marginBottom:16}}>{tecData.map((t,i)=>(<div key={t.nombre} className="tecnico-card" style={{cursor:"pointer",border:sel===t.nombre?"2px solid var(--primary)":undefined}} onClick={()=>setSel(sel===t.nombre?null:t.nombre)}><div className="tecnico-avatar" style={{background:ca[i%ca.length]}}>{t.nombre.split(" ").map(n=>n[0]).join("").slice(0,2)}</div><div style={{flex:1}}><div style={{fontWeight:600,fontSize:14}}>{t.nombre}</div><div style={{fontSize:12,color:"var(--text3)"}}>{t.rol}</div></div><div style={{textAlign:"right"}}><div style={{fontSize:24,fontWeight:700,color:"var(--primary)"}}>{t.total}</div><div style={{fontSize:11,color:"var(--text3)"}}>proyectos</div></div></div>))}</div>
      {sel&&(()=>{const tec=tecData.find(t=>t.nombre===sel);if(!tec)return null;return(<div className="card fade-in"><div className="card-header"><h3>Proyectos de {tec.nombre} ({tec.total})</h3></div>{tec.total===0?<p style={{textAlign:"center",color:"var(--text3)",padding:20}}>Sin proyectos asignados</p>:(<div className="table-wrap"><table><thead><tr><th>Radicado</th><th>Solicitante</th><th>Tipo</th><th>Estado</th></tr></thead><tbody>{tec.proyectos.map(p=>(<tr key={p.radicado}><td><strong>{p.radicado}</strong></td><td>{p.solicitante}</td><td style={{fontSize:11}}>{p.tipoLicencia}</td><td><span className={`badge ${estadoColor(p.estado)}`}>{p.estado}</span></td></tr>))}</tbody></table></div>)}</div>);})()}
    </div>
  );
}

// --- 8. CURADOR ---
function CuradorView({ proyectos }) {
  const pendientes = useMemo(() => proyectos.filter(p => p.estado==="EN ESTUDIO"||p.estado==="EN REVISION"), [proyectos]);
  const aprobados = useMemo(() => proyectos.filter(p => p.estado==="APROBADO"||p.estado==="NOTIFICADO"), [proyectos]);
  const h = hoy();
  const urgentes = useMemo(() => proyectos.filter(p => { if(!p.ldf||p.estado==="APROBADO"||p.estado==="DESISTIDO") return false; const venc=addDiasHabiles(p.ldf,45).toISOString().slice(0,10); const dias=diasHabilesEntre(h,venc); return venc>=h&&dias<=5; }), [proyectos, h]);
  return (
    <div className="fade-in">
      <div className="card" style={{marginBottom:16,display:"flex",alignItems:"center",gap:16,padding:20}}>
        <div style={{width:56,height:56,borderRadius:"50%",background:"var(--primary)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:22,fontWeight:700}}>LF</div>
        <div><div style={{fontSize:18,fontWeight:700}}>{CURADOR}</div><div style={{fontSize:13,color:"var(--text2)"}}>Curador Urbano N.° 2 de Pereira</div></div>
        <div style={{marginLeft:"auto",display:"flex",gap:20,textAlign:"center"}}><div><div style={{fontSize:28,fontWeight:700,color:"var(--primary)"}}>{proyectos.length}</div><div style={{fontSize:11,color:"var(--text3)"}}>Total</div></div><div><div style={{fontSize:28,fontWeight:700,color:"#1565c0"}}>{pendientes.length}</div><div style={{fontSize:11,color:"var(--text3)"}}>Pendientes</div></div><div><div style={{fontSize:28,fontWeight:700,color:"#2e7d32"}}>{aprobados.length}</div><div style={{fontSize:11,color:"var(--text3)"}}>Aprobados</div></div></div>
      </div>
      {urgentes.length>0&&<div className="card" style={{marginBottom:16}}><div className="card-header"><h3>⚠️ Proyectos Urgentes (≤5 días hábiles)</h3></div>{urgentes.map(p=>(<div key={p.radicado} className="alert-row alert-warning"><AlertTriangle size={16}/><span><strong>{p.radicado}</strong> — {p.solicitante} — {p.estado}</span></div>))}</div>}
      <div className="grid grid-2">
        <div className="card"><div className="card-header"><h3>Pendientes de Revisión ({pendientes.length})</h3></div><div className="table-wrap" style={{maxHeight:350}}><table><thead><tr><th>Radicado</th><th>Solicitante</th><th>Estado</th></tr></thead><tbody>{pendientes.map(p=>(<tr key={p.radicado}><td><strong>{p.radicado}</strong></td><td>{p.solicitante}</td><td><span className={`badge ${estadoColor(p.estado)}`}>{p.estado}</span></td></tr>))}</tbody></table></div></div>
        <div className="card"><div className="card-header"><h3>Aprobados Recientes ({aprobados.length})</h3></div><div className="table-wrap" style={{maxHeight:350}}><table><thead><tr><th>Radicado</th><th>Solicitante</th><th>Tipo</th></tr></thead><tbody>{aprobados.map(p=>(<tr key={p.radicado}><td><strong>{p.radicado}</strong></td><td>{p.solicitante}</td><td style={{fontSize:11}}>{p.tipoLicencia}</td></tr>))}</tbody></table></div></div>
      </div>
    </div>
  );
}

// --- 9. HISTORIAL ---
function HistorialView({ proyectos }) {
  const [filtroMes, setFiltroMes] = useState("todos");
  const meses = useMemo(() => [...new Set(proyectos.map(p=>p.fechaRad.slice(0,7)))].sort(), [proyectos]);
  const eventos = useMemo(() => {
    let items = proyectos.map(p => ({fecha:p.fechaRad,tipo:"Radicación",radicado:p.radicado,detalle:`${p.tipoLicencia} — ${p.solicitante}`,estado:p.estado}));
    proyectos.forEach(p => { if(p.ldf) items.push({fecha:p.ldf,tipo:"LDF Asignado",radicado:p.radicado,detalle:`LDF: ${formatDate(p.ldf)}`,estado:p.estado}); if(p.ldfReal) items.push({fecha:p.ldfReal,tipo:"LDF Cumplido",radicado:p.radicado,detalle:`LDF Real: ${formatDate(p.ldfReal)}`,estado:p.estado}); });
    if(filtroMes!=="todos") items=items.filter(e=>e.fecha.startsWith(filtroMes)); return items.sort((a,b)=>b.fecha.localeCompare(a.fecha));
  }, [proyectos, filtroMes]);
  return (
    <div className="fade-in"><div className="card"><div className="card-header"><h3>Historial de Eventos ({eventos.length})</h3><select value={filtroMes} onChange={e=>setFiltroMes(e.target.value)} style={{fontSize:12}}><option value="todos">Todos los meses</option>{meses.map(m=><option key={m} value={m}>{m}</option>)}</select></div>
      <div style={{maxHeight:600,overflowY:"auto"}}>{eventos.slice(0,200).map((ev,i)=>(<div key={i} className="timeline-item"><div className="timeline-dot" style={{background:ev.tipo==="Radicación"?"var(--primary)":ev.tipo==="LDF Asignado"?"#1565c0":"#2e7d32"}}/><div style={{flex:1}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontWeight:600,fontSize:13}}>{ev.radicado} — {ev.tipo}</span><span style={{fontSize:11,color:"var(--text3)"}}>{formatDate(ev.fecha)}</span></div><div style={{fontSize:12,color:"var(--text2)"}}>{ev.detalle}</div></div></div>))}</div>
    </div></div>
  );
}

// --- 10. HISTÓRICO ---
function HistoricoView() {
  const data = HISTORICO_ANOS; const total = data.reduce((s,d)=>s+d.total,0);
  return (
    <div className="fade-in">
      <div className="grid grid-4" style={{marginBottom:16}}><StatCard number={total.toLocaleString()} label="Total Histórico (2019-2026)" icon={Archive}/><StatCard number={data.length} label="Años de Datos" icon={Calendar}/><StatCard number={Math.max(...data.map(d=>d.total))} label="Máximo Anual" color="#f57c00" icon={Star}/><StatCard number={data[data.length-1].total} label="Radicados 2026" color="#1565c0" icon={FolderOpen}/></div>
      <div className="grid grid-2">
        <div className="card"><div className="card-header"><h3>Radicados por Año</h3></div><ResponsiveContainer width="100%" height={280}><BarChart data={data}><XAxis dataKey="ano" fontSize={12}/><YAxis fontSize={12}/><Tooltip/><Bar dataKey="total" fill="var(--primary)" radius={[4,4,0,0]} name="Total"/><Bar dataKey="aprobados" fill="#2e7d32" radius={[4,4,0,0]} name="Aprobados"/></BarChart></ResponsiveContainer></div>
        <div className="card"><div className="card-header"><h3>Tendencia Histórica</h3></div><ResponsiveContainer width="100%" height={280}><AreaChart data={data}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="ano" fontSize={12}/><YAxis fontSize={12}/><Tooltip/><Legend fontSize={11}/><Area type="monotone" dataKey="total" stroke="var(--primary)" fill="var(--primary-light)" name="Total"/><Area type="monotone" dataKey="aprobados" stroke="#2e7d32" fill="#e8f5e9" name="Aprobados"/></AreaChart></ResponsiveContainer></div>
      </div>
      <div className="card" style={{marginTop:16}}><div className="card-header"><h3>Detalle por Año</h3></div><div className="table-wrap"><table><thead><tr><th>Año</th><th>Total</th><th>Aprobados</th><th>Desistidos</th><th>Tasa Aprobación</th></tr></thead>
        <tbody>{data.map(d=>(<tr key={d.ano}><td><strong>{d.ano}</strong></td><td>{d.total}</td><td>{d.aprobados}</td><td>{d.desistidos}</td><td><div className="progress-bar" style={{width:100}}><div className="progress-fill" style={{width:`${(d.aprobados/d.total*100)}%`,background:"#2e7d32"}}/></div><span style={{fontSize:11}}>{(d.aprobados/d.total*100).toFixed(1)}%</span></td></tr>))}</tbody></table></div></div>
    </div>
  );
}

// ========== APP ==========
const TABS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "estrategicos", label: "Estratégicos", icon: Star },
  { id: "terminos", label: "Términos", icon: Clock },
  { id: "proyectos", label: "Proyectos", icon: FolderOpen },
  { id: "tecnicos", label: "Técnicos", icon: Users },
  { id: "curador", label: "Curador", icon: Gavel },
  { id: "historial", label: "Historial", icon: History },
  { id: "historico", label: "Histórico", icon: Archive },
];

function App() {
  const [tab, setTab] = useState("dashboard");
  const [proyectos, setProyectos] = useState(PROYECTOS_2026);
  const [tvMode, setTvMode] = useState(false);
  const [dark, setDark] = useState(false);
  useEffect(() => { document.body.className = dark ? "dark" : ""; }, [dark]);
  return (
    <div className="app">
      <style>{STYLES}</style>
      {tvMode && <ModoTV proyectos={proyectos} onClose={() => setTvMode(false)} />}
      <div className="header">
        <div className="header-logo">C2</div>
        <h1>Dashboard Curaduría Urbana N.° 2 de Pereira</h1>
        <div className="header-actions">
          <button className="btn btn-sm" style={{background:"#e65100",color:"#fff",border:"none",fontWeight:600}} onClick={() => setTvMode(true)}><Tv size={14} style={{verticalAlign:"middle",marginRight:4}} />Modo TV</button>
          <button className="btn btn-sm" style={{background:"#f9a825",color:"#333",border:"none",fontWeight:600}} onClick={() => setTab("ingreso")}><UserPlus size={14} style={{verticalAlign:"middle",marginRight:4}} />Ingreso de Técnico</button>
          <button className="btn btn-sm" style={{background:"rgba(255,255,255,.15)",color:"#fff",border:"none"}} onClick={() => setDark(!dark)}>{dark ? <Sun size={14} /> : <Moon size={14} />}</button>
        </div>
      </div>
      <div className="nav">{TABS.map(t => (<button key={t.id} className={tab === t.id ? "active" : ""} onClick={() => setTab(t.id)}><t.icon size={15} />{t.label}</button>))}</div>
      <div className="content">
        {tab === "dashboard" && <DashboardView proyectos={proyectos} />}
        {tab === "estrategicos" && <EstrategicosView proyectos={proyectos} />}
        {tab === "terminos" && <TerminosView proyectos={proyectos} />}
        {tab === "proyectos" && <ProyectosView proyectos={proyectos} />}
        {tab === "ingreso" && <IngresoTecnicoView proyectos={proyectos} setProyectos={setProyectos} />}
        {tab === "tecnicos" && <TecnicosView proyectos={proyectos} />}
        {tab === "curador" && <CuradorView proyectos={proyectos} />}
        {tab === "historial" && <HistorialView proyectos={proyectos} />}
        {tab === "historico" && <HistoricoView />}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
