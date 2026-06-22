// ========== APP ==========
const TABS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "estrategicos", label: "Estratégicos", icon: Star },
  { id: "terminos", label: "Términos", icon: Clock },
  { id: "proyectos", label: "Proyectos", icon: FolderOpen },
  { id: "ingreso", label: "Ingreso Técnico", icon: UserPlus },
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

  useEffect(() => {
    document.body.className = dark ? "dark" : "";
  }, [dark]);

  return (
    <div className="app">
      <style>{STYLES}</style>
      {tvMode && <ModoTV proyectos={proyectos} onClose={() => setTvMode(false)} />}
      <div className="header">
        <div className="header-logo">C2</div>
        <h1>Dashboard Curaduría Urbana N.° 2 de Pereira</h1>
        <div className="header-actions">
          <button className="btn btn-sm" style={{ background: "rgba(255,255,255,.15)", color: "#fff", border: "none" }} onClick={() => setTvMode(true)}>
            <Tv size={14} style={{ verticalAlign: "middle", marginRight: 4 }} />TV
          </button>
          <button className="btn btn-sm" style={{ background: "rgba(255,255,255,.15)", color: "#fff", border: "none" }} onClick={() => setDark(!dark)}>
            {dark ? <Sun size={14} /> : <Moon size={14} />}
          </button>
        </div>
      </div>
      <div className="nav">
        {TABS.map(t => (
          <button key={t.id} className={tab === t.id ? "active" : ""} onClick={() => setTab(t.id)}>
            <t.icon size={15} />{t.label}
          </button>
        ))}
      </div>
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
const P2=[
{"r":"260081","f":"2026-02-26","e":"NO LDF","l":"","lr":"","t":"OBRA NUEVA","s":"Fabián Castro Ceballos","d":"Diagonal 22 No. 12-90","x":false},
{"r":"260082","f":"2026-03-02","e":"APROBADO","l":"2026-03-16","lr":"2026-03-16","t":"RECONOCIMIENTO","s":"Andrea Gallego Gómez","d":"Avenida 8 No. 24-69","x":false},
{"r":"260083","f":"2026-03-03","e":"RADICADO","l":"","lr":"","t":"RECONOCIMIENTO","s":"Laura Ceballos Montoya","d":"Avenida 47 No. 19-98","x":false},
{"r":"260084","f":"2026-03-02","e":"OBSERVACIONES","l":"2026-03-10","lr":"","t":"RECONOCIMIENTO","s":"Ricardo Morales Jiménez","d":"Carrera 20 No. 1-91","x":false},
{"r":"260085","f":"2026-03-03","e":"EN ESTUDIO","l":"2026-03-09","lr":"","t":"CONSTRUCCION","s":"Isabel Gutiérrez Giraldo","d":"Carrera 41 No. 28-97","x":false},
{"r":"260086","f":"2026-03-02","e":"EN ESTUDIO","l":"2026-03-09","lr":"","t":"PROPIEDAD HORIZONTAL","s":"Ricardo Montoya Montoya","d":"Transversal 22 No. 6-7","x":false},
{"r":"260087","f":"2026-03-02","e":"CORRECCION","l":"2026-03-23","lr":"","t":"URBANISMO","s":"Luis Aguilar Cardona","d":"Calle 37 No. 21-88","x":false},
{"r":"260088","f":"2026-03-02","e":"EN ESTUDIO","l":"2026-03-25","lr":"","t":"SUBDIVISION","s":"Pedro Reyes Sánchez","d":"Diagonal 49 No. 14-78","x":false},
{"r":"260089","f":"2026-03-05","e":"EN REVISION","l":"2026-03-17","lr":"","t":"OBRA NUEVA","s":"Germán Herrera Herrera","d":"Avenida 38 No. 14-40","x":false},
{"r":"260090","f":"2026-03-06","e":"OBSERVACIONES","l":"2026-03-30","lr":"","t":"URBANISMO","s":"Enrique Díaz Echeverri","d":"Carrera 17 No. 22-11","x":false},
{"r":"260091","f":"2026-03-04","e":"EN ESTUDIO","l":"2026-03-26","lr":"","t":"URBANISMO","s":"Alejandro García Medina","d":"Transversal 45 No. 20-61","x":false},
{"r":"260092","f":"2026-03-05","e":"EN ESTUDIO","l":"2026-03-19","lr":"","t":"SUBDIVISION","s":"Miguel Ríos González","d":"Carrera 17 No. 26-81","x":false},
{"r":"260093","f":"2026-03-09","e":"OBSERVACIONES","l":"2026-03-20","lr":"","t":"MODIFICACION","s":"Andrea Valencia Morales","d":"Carrera 18 No. 27-19","x":false},
{"r":"260094","f":"2026-03-05","e":"EN ESTUDIO","l":"2026-03-19","lr":"","t":"PROPIEDAD HORIZONTAL","s":"Angélica Salazar Gutiérrez","d":"Transversal 8 No. 15-89","x":false},
{"r":"260095","f":"2026-03-09","e":"RADICADO","l":"","lr":"","t":"SUBDIVISION","s":"Ernesto Valencia Cardona","d":"Transversal 6 No. 20-6","x":false},
{"r":"260096","f":"2026-03-09","e":"RADICADO","l":"","lr":"","t":"PROPIEDAD HORIZONTAL","s":"Claudia Rodríguez Hernández","d":"Carrera 44 No. 27-74","x":false},
{"r":"260097","f":"2026-03-11","e":"NOTIFICADO","l":"2026-03-24","lr":"2026-03-24","t":"PROPIEDAD HORIZONTAL","s":"María Rivera Montoya","d":"Diagonal 42 No. 15-36","x":false},
{"r":"260098","f":"2026-03-09","e":"NOTIFICADO","l":"2026-03-27","lr":"2026-03-27","t":"AMPLIACION","s":"Pedro Montoya Castillo","d":"Transversal 22 No. 11-86","x":false},
{"r":"260099","f":"2026-03-09","e":"EN REVISION","l":"2026-03-24","lr":"","t":"MODIFICACION","s":"Miguel Cardona Gutiérrez","d":"Transversal 49 No. 18-5","x":false},
{"r":"260100","f":"2026-03-12","e":"EN ESTUDIO","l":"2026-03-25","lr":"","t":"CERRAMIENTO","s":"Andrea Aguilar Ospina","d":"Calle 43 No. 28-70","x":false},
{"r":"260101","f":"2026-03-12","e":"NO LDF","l":"","lr":"","t":"RECONOCIMIENTO","s":"Catalina Jiménez Zuluaga","d":"Transversal 41 No. 15-98","x":false},
{"r":"260102","f":"2026-03-10","e":"EN ESTUDIO","l":"2026-04-01","lr":"","t":"DEMOLICION","s":"Ricardo Herrera Giraldo","d":"Transversal 8 No. 1-81","x":false},
{"r":"260103","f":"2026-03-16","e":"EN REVISION","l":"2026-03-26","lr":"","t":"SUBDIVISION","s":"Isabel García Mejía","d":"Transversal 6 No. 8-15","x":false},
{"r":"260104","f":"2026-03-16","e":"CORRECCION","l":"2026-04-10","lr":"","t":"DEMOLICION","s":"Adriana Aristizábal Gutiérrez","d":"Diagonal 46 No. 9-54","x":false},
{"r":"260105","f":"2026-03-18","e":"OBSERVACIONES","l":"2026-04-07","lr":"","t":"RECONOCIMIENTO","s":"Silvia Mejía Torres","d":"Transversal 13 No. 30-77","x":false},
{"r":"260106","f":"2026-03-17","e":"RADICADO","l":"","lr":"","t":"DEMOLICION","s":"Luis Ortiz Medina","d":"Avenida 33 No. 9-1","x":false},
{"r":"260107","f":"2026-03-16","e":"RADICADO","l":"","lr":"","t":"PROPIEDAD HORIZONTAL","s":"Teresa Londoño Cardona","d":"Carrera 29 No. 18-62","x":false},
{"r":"260108","f":"2026-03-16","e":"DESISTIDO","l":"","lr":"","t":"OBRA NUEVA","s":"Germán Ríos Ramos","d":"Carrera 45 No. 8-74","x":false},
{"r":"260109","f":"2026-03-18","e":"EN ESTUDIO","l":"2026-04-06","lr":"","t":"CONSTRUCCION","s":"Héctor Ceballos Montoya","d":"Transversal 25 No. 22-84","x":false},
{"r":"260110","f":"2026-03-16","e":"OBSERVACIONES","l":"2026-03-23","lr":"","t":"DEMOLICION","s":"Ernesto Duque Vargas","d":"Calle 29 No. 4-68","x":false},
{"r":"260111","f":"2026-03-19","e":"EN ESTUDIO","l":"2026-03-30","lr":"","t":"MODIFICACION","s":"Daniela Torres González","d":"Transversal 17 No. 11-80","x":false},
{"r":"260112","f":"2026-03-23","e":"NO LDF","l":"","lr":"","t":"URBANISMO","s":"Gloria Castaño Valencia","d":"Transversal 21 No. 21-92","x":false},
{"r":"260113","f":"2026-03-23","e":"OBSERVACIONES","l":"2026-04-14","lr":"","t":"CONSTRUCCION","s":"Rosa González Reyes","d":"Avenida 15 No. 24-12","x":false},
{"r":"260114","f":"2026-03-23","e":"NOTIFICADO","l":"2026-04-17","lr":"2026-04-17","t":"URBANISMO","s":"Mauricio Flores Giraldo","d":"Avenida 2 No. 2-42","x":false},
{"r":"260115","f":"2026-03-25","e":"EN ESTUDIO","l":"2026-04-10","lr":"","t":"CERRAMIENTO","s":"Beatriz Torres Reyes","d":"Diagonal 27 No. 19-88","x":false},
{"r":"260116","f":"2026-03-25","e":"EN ESTUDIO","l":"2026-04-06","lr":"","t":"URBANISMO","s":"Rosa Rojas Zuluaga","d":"Carrera 32 No. 30-75","x":false},
{"r":"260117","f":"2026-03-23","e":"EN ESTUDIO","l":"2026-04-17","lr":"","t":"SUBDIVISION","s":"Silvia Cruz Londoño","d":"Calle 30 No. 29-37","x":false},
{"r":"260118","f":"2026-03-26","e":"OBSERVACIONES","l":"2026-04-02","lr":"","t":"AMPLIACION","s":"Fabián Duque Chávez","d":"Transversal 45 No. 9-59","x":false},
{"r":"260119","f":"2026-03-27","e":"APROBADO","l":"2026-04-13","lr":"2026-04-13","t":"AMPLIACION","s":"Sandra Reyes Rojas","d":"Diagonal 23 No. 19-38","x":false},
{"r":"260120","f":"2026-03-27","e":"APROBADO","l":"2026-04-13","lr":"2026-04-13","t":"SUBDIVISION","s":"Carlos Salazar Castaño","d":"Calle 39 No. 24-64","x":false},
{"r":"260121","f":"2026-03-30","e":"CORRECCION","l":"2026-04-13","lr":"","t":"RECONOCIMIENTO","s":"Javier Castillo Morales","d":"Carrera 40 No. 9-87","x":false},
{"r":"260122","f":"2026-03-30","e":"RADICADO","l":"","lr":"","t":"DEMOLICION","s":"Alberto Pérez Echeverri","d":"Calle 20 No. 26-57","x":false},
{"r":"260123","f":"2026-03-24","e":"OBSERVACIONES","l":"2026-04-02","lr":"","t":"URBANISMO","s":"Ricardo Ramos Ceballos","d":"Transversal 12 No. 7-17","x":false},
{"r":"260124","f":"2026-03-31","e":"OBSERVACIONES","l":"2026-04-16","lr":"","t":"OBRA NUEVA","s":"Ernesto Ortiz Flores","d":"Avenida 31 No. 26-38","x":false},
{"r":"260125","f":"2026-03-31","e":"EN REVISION","l":"2026-04-08","lr":"","t":"AMPLIACION","s":"Luis Torres Morales","d":"Transversal 36 No. 12-12","x":false},
{"r":"260126","f":"2026-04-01","e":"NO LDF","l":"","lr":"","t":"SUBDIVISION","s":"Guillermo Sánchez Ríos","d":"Avenida 44 No. 24-87","x":false},
{"r":"260127","f":"2026-03-30","e":"OBSERVACIONES","l":"2026-04-24","lr":"","t":"CERRAMIENTO","s":"Sandra Castaño Morales","d":"Transversal 2 No. 20-72","x":false},
{"r":"260128","f":"2026-03-30","e":"CORRECCION","l":"2026-04-13","lr":"","t":"URBANISMO","s":"Alberto Ríos Giraldo","d":"Avenida 42 No. 14-15","x":false},
{"r":"260129","f":"2026-03-30","e":"EN ESTUDIO","l":"2026-04-06","lr":"","t":"SUBDIVISION","s":"Adriana Sánchez Pérez","d":"Carrera 35 No. 5-50","x":false},
{"r":"260130","f":"2026-04-01","e":"DESISTIDO","l":"","lr":"","t":"OBRA NUEVA","s":"Óscar Duque Ceballos","d":"Carrera 27 No. 21-13","x":false},
{"r":"260131","f":"2026-04-06","e":"OBSERVACIONES","l":"2026-04-24","lr":"","t":"SUBDIVISION","s":"María Giraldo Jiménez","d":"Carrera 29 No. 15-31","x":false},
{"r":"260132","f":"2026-04-06","e":"DESISTIDO","l":"","lr":"","t":"CERRAMIENTO","s":"Guillermo Botero Castillo","d":"Calle 26 No. 9-25","x":false},
{"r":"260133","f":"2026-03-31","e":"CORRECCION","l":"2026-04-20","lr":"","t":"URBANISMO","s":"Roberto Díaz Botero","d":"Diagonal 2 No. 2-43","x":false},
{"r":"260134","f":"2026-04-02","e":"NOTIFICADO","l":"2026-04-27","lr":"2026-04-27","t":"RECONOCIMIENTO","s":"Luis Mejía Díaz","d":"Diagonal 14 No. 27-30","x":false},
{"r":"260135","f":"2026-04-03","e":"RADICADO","l":"","lr":"","t":"PROPIEDAD HORIZONTAL","s":"Carlos Ortiz Torres","d":"Carrera 35 No. 9-23","x":false},
{"r":"260136","f":"2026-04-02","e":"OBSERVACIONES","l":"2026-04-07","lr":"","t":"DEMOLICION","s":"Carlos Castillo Reyes","d":"Diagonal 21 No. 1-23","x":false},
{"r":"260137","f":"2026-04-06","e":"EN ESTUDIO","l":"2026-04-24","lr":"","t":"OBRA NUEVA","s":"Andrea Ceballos González","d":"Transversal 29 No. 25-47","x":false},
{"r":"260138","f":"2026-04-07","e":"OBSERVACIONES","l":"2026-04-27","lr":"","t":"OBRA NUEVA","s":"Diego Zuluaga Martínez","d":"Diagonal 20 No. 15-83","x":false},
{"r":"260139","f":"2026-04-06","e":"EN ESTUDIO","l":"2026-04-27","lr":"","t":"MODIFICACION","s":"Beatriz Castaño Pérez","d":"Transversal 46 No. 30-57","x":false},
{"r":"260140","f":"2026-04-06","e":"EN REVISION","l":"2026-04-21","lr":"","t":"PROPIEDAD HORIZONTAL","s":"Diana González Ramírez","d":"Avenida 40 No. 21-75","x":false},
{"r":"260141","f":"2026-04-09","e":"RADICADO","l":"","lr":"","t":"MODIFICACION","s":"Javier Arango Gutiérrez","d":"Transversal 33 No. 20-56","x":false},
{"r":"260142","f":"2026-04-06","e":"EN REVISION","l":"2026-04-14","lr":"","t":"OBRA NUEVA","s":"Arturo Díaz Castro","d":"Transversal 15 No. 14-44","x":false},
{"r":"260143","f":"2026-04-13","e":"NO LDF","l":"","lr":"","t":"MODIFICACION","s":"Arturo Pérez Ramos","d":"Transversal 21 No. 22-33","x":false},
{"r":"260144","f":"2026-04-09","e":"NOTIFICADO","l":"2026-04-29","lr":"2026-04-29","t":"URBANISMO","s":"Pedro Hernández Hernández","d":"Transversal 7 No. 24-95","x":false},
{"r":"260145","f":"2026-04-10","e":"EN REVISION","l":"2026-05-04","lr":"","t":"CONSTRUCCION","s":"Teresa Mejía Mejía","d":"Avenida 43 No. 4-53","x":false},
{"r":"260146","f":"2026-04-13","e":"EN REVISION","l":"2026-05-01","lr":"","t":"CONSTRUCCION","s":"Ricardo Henao Chávez","d":"Avenida 7 No. 19-65","x":false},
{"r":"260147","f":"2026-04-10","e":"EN ESTUDIO","l":"2026-04-30","lr":"","t":"RECONOCIMIENTO","s":"Sandra Castillo Mejía","d":"Avenida 8 No. 25-36","x":false},
{"r":"260148","f":"2026-04-14","e":"EN ESTUDIO","l":"2026-05-04","lr":"","t":"OBRA NUEVA","s":"Pilar Zuluaga Zuluaga","d":"Diagonal 2 No. 20-85","x":false},
{"r":"260149","f":"2026-04-17","e":"RADICADO","l":"","lr":"","t":"CONSTRUCCION","s":"Camilo Ortiz Giraldo","d":"Avenida 22 No. 12-1","x":false},
{"r":"260150","f":"2026-04-13","e":"EN REVISION","l":"2026-05-06","lr":"","t":"MODIFICACION","s":"Luis Torres Ceballos","d":"Calle 6 No. 24-68","x":false},
{"r":"260151","f":"2026-04-13","e":"DESISTIDO","l":"","lr":"","t":"AMPLIACION","s":"Gloria Flores Jiménez","d":"Avenida 47 No. 11-73","x":false},
{"r":"260152","f":"2026-04-17","e":"EN ESTUDIO","l":"2026-04-23","lr":"","t":"DEMOLICION","s":"Alejandro Zuluaga López","d":"Calle 18 No. 15-85","x":false},
{"r":"260153","f":"2026-04-16","e":"OBSERVACIONES","l":"2026-05-05","lr":"","t":"MODIFICACION","s":"Mónica Díaz Ospina","d":"Calle 23 No. 14-15","x":false},
{"r":"260154","f":"2026-04-16","e":"OBSERVACIONES","l":"2026-05-11","lr":"","t":"AMPLIACION","s":"Catalina Londoño Chávez","d":"Calle 15 No. 13-77","x":false},
{"r":"260155","f":"2026-04-15","e":"EN ESTUDIO","l":"2026-04-29","lr":"","t":"RECONOCIMIENTO","s":"Pilar Ramírez Cruz","d":"Avenida 21 No. 4-1","x":false},
{"r":"260156","f":"2026-04-20","e":"RADICADO","l":"","lr":"","t":"DEMOLICION","s":"Jorge Rojas Valencia","d":"Carrera 33 No. 18-86","x":false},
{"r":"260157","f":"2026-04-22","e":"DESISTIDO","l":"","lr":"","t":"MODIFICACION","s":"Angélica Martínez Castro","d":"Calle 30 No. 30-10","x":false},
{"r":"260158","f":"2026-04-23","e":"APROBADO","l":"2026-05-11","lr":"2026-05-11","t":"PROPIEDAD HORIZONTAL","s":"Lucía Aristizábal Echeverri","d":"Transversal 19 No. 4-52","x":false},
{"r":"260159","f":"2026-04-17","e":"NOTIFICADO","l":"2026-04-27","lr":"2026-04-27","t":"PROPIEDAD HORIZONTAL","s":"Silvia Giraldo Jiménez","d":"Calle 28 No. 28-14","x":false},
{"r":"260160","f":"2026-04-20","e":"NO LDF","l":"","lr":"","t":"MODIFICACION","s":"Catalina Hernández Aguilar","d":"Avenida 48 No. 11-29","x":false}
];
const P3=[
{"r":"260161","f":"2026-04-21","e":"RADICADO","l":"","lr":"","t":"URBANISMO","s":"Ernesto Echeverri Sánchez","d":"Diagonal 33 No. 7-45","x":false},
{"r":"260162","f":"2026-04-21","e":"RADICADO","l":"","lr":"","t":"DEMOLICION","s":"Fernando Pérez Torres","d":"Avenida 13 No. 6-78","x":false},
{"r":"260163","f":"2026-04-21","e":"RADICADO","l":"","lr":"","t":"URBANISMO","s":"Camilo Echeverri Cardona","d":"Transversal 49 No. 19-98","x":false},
{"r":"260164","f":"2026-04-27","e":"NO LDF","l":"","lr":"","t":"PROPIEDAD HORIZONTAL","s":"Daniela Echeverri Zuluaga","d":"Avenida 41 No. 11-20","x":false},
{"r":"260165","f":"2026-04-24","e":"EN ESTUDIO","l":"2026-05-13","lr":"","t":"SUBDIVISION","s":"Mónica Duque López","d":"Avenida 33 No. 3-40","x":false},
{"r":"260166","f":"2026-04-27","e":"NO LDF","l":"","lr":"","t":"CONSTRUCCION","s":"Natalia Gutiérrez González","d":"Calle 40 No. 20-65","x":false},
{"r":"260167","f":"2026-04-27","e":"NO LDF","l":"","lr":"","t":"OBRA NUEVA","s":"Angélica Martínez Herrera","d":"Diagonal 42 No. 7-42","x":false},
{"r":"260168","f":"2026-04-27","e":"NO LDF","l":"","lr":"","t":"DEMOLICION","s":"Ana Herrera Pérez","d":"Avenida 46 No. 3-65","x":false},
{"r":"260169","f":"2026-04-29","e":"EN ESTUDIO","l":"2026-05-11","lr":"","t":"AMPLIACION","s":"Mauricio Arango Arango","d":"Diagonal 11 No. 12-48","x":false},
{"r":"260170","f":"2026-04-27","e":"NO LDF","l":"","lr":"","t":"CERRAMIENTO","s":"Margarita Henao López","d":"Avenida 5 No. 11-13","x":false},
{"r":"260171","f":"2026-04-29","e":"OBSERVACIONES","l":"2026-05-13","lr":"","t":"SUBDIVISION","s":"Arturo Londoño Henao","d":"Carrera 22 No. 3-75","x":false},
{"r":"260172","f":"2026-05-01","e":"EN ESTUDIO","l":"2026-05-18","lr":"","t":"SUBDIVISION","s":"Daniela Giraldo Londoño","d":"Transversal 9 No. 20-91","x":false},
{"r":"260173","f":"2026-04-27","e":"APROBADO","l":"2026-05-14","lr":"2026-05-14","t":"CERRAMIENTO","s":"Jorge Londoño Giraldo","d":"Diagonal 6 No. 21-86","x":false},
{"r":"260174","f":"2026-04-30","e":"OBSERVACIONES","l":"2026-05-05","lr":"","t":"CERRAMIENTO","s":"Patricia Rivera Díaz","d":"Avenida 50 No. 16-25","x":false},
{"r":"260175","f":"2026-04-29","e":"NOTIFICADO","l":"2026-05-08","lr":"2026-05-08","t":"URBANISMO","s":"Ricardo Pérez Ospina","d":"Diagonal 48 No. 29-68","x":false},
{"r":"260176","f":"2026-04-29","e":"OBSERVACIONES","l":"2026-05-25","lr":"","t":"DEMOLICION","s":"Javier Rojas Torres","d":"Carrera 12 No. 27-89","x":false},
{"r":"260177","f":"2026-05-05","e":"OBSERVACIONES","l":"2026-05-15","lr":"","t":"AMPLIACION","s":"María Medina Jiménez","d":"Carrera 29 No. 20-37","x":false},
{"r":"260178","f":"2026-05-06","e":"RADICADO","l":"","lr":"","t":"AMPLIACION","s":"Diego Valencia Reyes","d":"Avenida 31 No. 29-25","x":false},
{"r":"260179","f":"2026-05-04","e":"OBSERVACIONES","l":"2026-05-27","lr":"","t":"AMPLIACION","s":"Silvia Gutiérrez Rojas","d":"Diagonal 34 No. 14-21","x":false},
{"r":"260180","f":"2026-05-07","e":"EN ESTUDIO","l":"2026-06-01","lr":"","t":"DEMOLICION","s":"Claudia López Botero","d":"Transversal 24 No. 18-14","x":false},
{"r":"260181","f":"2026-05-07","e":"EN REVISION","l":"2026-05-15","lr":"","t":"SUBDIVISION","s":"Pedro Flores Ortiz","d":"Transversal 33 No. 5-56","x":false},
{"r":"260182","f":"2026-05-04","e":"CORRECCION","l":"2026-05-18","lr":"","t":"AMPLIACION","s":"Fabián Rodríguez Medina","d":"Calle 26 No. 17-48","x":false},
{"r":"260183","f":"2026-05-04","e":"NO LDF","l":"","lr":"","t":"URBANISMO","s":"Natalia Morales Rodríguez","d":"Avenida 7 No. 27-92","x":false},
{"r":"260184","f":"2026-05-11","e":"DESISTIDO","l":"","lr":"","t":"DEMOLICION","s":"Jorge Martínez Gutiérrez","d":"Transversal 45 No. 27-18","x":false},
{"r":"260185","f":"2026-05-11","e":"RADICADO","l":"","lr":"","t":"AMPLIACION","s":"Rosa García Hernández","d":"Calle 17 No. 7-20","x":false},
{"r":"260186","f":"2026-05-11","e":"CORRECCION","l":"2026-06-04","lr":"","t":"OBRA NUEVA","s":"Beatriz Sánchez Gutiérrez","d":"Carrera 20 No. 4-7","x":false},
{"r":"260187","f":"2026-05-07","e":"NO LDF","l":"","lr":"","t":"PROPIEDAD HORIZONTAL","s":"Silvia González Sánchez","d":"Transversal 39 No. 18-3","x":false},
{"r":"260188","f":"2026-05-12","e":"OBSERVACIONES","l":"2026-05-25","lr":"","t":"DEMOLICION","s":"Ricardo Castro García","d":"Diagonal 23 No. 8-74","x":false},
{"r":"260189","f":"2026-05-11","e":"EN ESTUDIO","l":"2026-05-18","lr":"","t":"OBRA NUEVA","s":"Natalia González Arango","d":"Diagonal 33 No. 26-65","x":false},
{"r":"260190","f":"2026-05-12","e":"EN ESTUDIO","l":"2026-06-01","lr":"","t":"CONSTRUCCION","s":"Alberto Rojas Jiménez","d":"Avenida 48 No. 1-46","x":false},
{"r":"260191","f":"2026-05-15","e":"EN ESTUDIO","l":"2026-05-27","lr":"","t":"URBANISMO","s":"Pilar Duque Ceballos","d":"Avenida 9 No. 2-46","x":false},
{"r":"260192","f":"2026-05-13","e":"DESISTIDO","l":"","lr":"","t":"DEMOLICION","s":"Pilar Castaño Ríos","d":"Transversal 41 No. 6-18","x":false},
{"r":"260193","f":"2026-05-11","e":"RADICADO","l":"","lr":"","t":"AMPLIACION","s":"María Gutiérrez Gómez","d":"Calle 13 No. 29-6","x":false},
{"r":"260194","f":"2026-05-13","e":"CORRECCION","l":"2026-06-03","lr":"","t":"MODIFICACION","s":"Guillermo Montoya Cruz","d":"Calle 49 No. 21-25","x":false},
{"r":"260195","f":"2026-05-13","e":"DESISTIDO","l":"","lr":"","t":"CONSTRUCCION","s":"Daniela Vargas Ortiz","d":"Calle 24 No. 14-52","x":false},
{"r":"260196","f":"2026-05-18","e":"NO LDF","l":"","lr":"","t":"MODIFICACION","s":"Gloria Rivera Cardona","d":"Transversal 24 No. 30-67","x":false},
{"r":"260197","f":"2026-05-15","e":"EN REVISION","l":"2026-06-02","lr":"","t":"URBANISMO","s":"Beatriz Henao Rivera","d":"Diagonal 19 No. 11-14","x":false},
{"r":"260198","f":"2026-05-13","e":"APROBADO","l":"2026-05-27","lr":"2026-05-27","t":"SUBDIVISION","s":"Mauricio Henao Aristizábal","d":"Transversal 11 No. 23-57","x":false},
{"r":"260199","f":"2026-05-18","e":"NO LDF","l":"","lr":"","t":"CERRAMIENTO","s":"Rosa Castro Ortiz","d":"Calle 5 No. 22-82","x":false},
{"r":"260200","f":"2026-05-18","e":"DESISTIDO","l":"","lr":"","t":"DEMOLICION","s":"Juan Torres Henao","d":"Transversal 3 No. 5-9","x":false},
{"r":"260201","f":"2026-05-18","e":"RADICADO","l":"","lr":"","t":"CERRAMIENTO","s":"Natalia Rojas Salazar","d":"Calle 39 No. 5-87","x":false},
{"r":"260202","f":"2026-05-19","e":"CORRECCION","l":"2026-06-04","lr":"","t":"AMPLIACION","s":"Enrique González Salazar","d":"Carrera 34 No. 12-51","x":false},
{"r":"260203","f":"2026-05-19","e":"OBSERVACIONES","l":"2026-06-01","lr":"","t":"URBANISMO","s":"Juan Ceballos Rivera","d":"Transversal 34 No. 13-72","x":false},
{"r":"260204","f":"2026-05-18","e":"APROBADO","l":"2026-06-01","lr":"2026-06-01","t":"AMPLIACION","s":"Laura Zuluaga Gutiérrez","d":"Transversal 13 No. 4-18","x":false},
{"r":"260205","f":"2026-05-25","e":"EN ESTUDIO","l":"2026-06-04","lr":"","t":"AMPLIACION","s":"Pedro Castaño Ramos","d":"Avenida 46 No. 3-71","x":false},
{"r":"260206","f":"2026-05-25","e":"APROBADO","l":"2026-06-08","lr":"2026-06-08","t":"DEMOLICION","s":"Carolina Aristizábal Giraldo","d":"Carrera 24 No. 17-29","x":false},
{"r":"260207","f":"2026-05-19","e":"NOTIFICADO","l":"2026-05-28","lr":"2026-05-28","t":"RECONOCIMIENTO","s":"Adriana Rodríguez Jiménez","d":"Diagonal 37 No. 12-60","x":false},
{"r":"260208","f":"2026-05-26","e":"NOTIFICADO","l":"2026-06-04","lr":"2026-06-04","t":"PROPIEDAD HORIZONTAL","s":"Pedro González Chávez","d":"Transversal 46 No. 24-62","x":false},
{"r":"260209","f":"2026-05-25","e":"NO LDF","l":"","lr":"","t":"MODIFICACION","s":"Álvaro González Ramírez","d":"Avenida 42 No. 3-58","x":false},
{"r":"260210","f":"2026-05-25","e":"RADICADO","l":"","lr":"","t":"CERRAMIENTO","s":"Jorge Mejía Echeverri","d":"Diagonal 12 No. 25-17","x":false},
{"r":"260211","f":"2026-05-25","e":"OBSERVACIONES","l":"2026-06-01","lr":"","t":"URBANISMO","s":"Catalina Torres Chávez","d":"Carrera 11 No. 11-91","x":false},
{"r":"260212","f":"2026-05-25","e":"DESISTIDO","l":"","lr":"","t":"OBRA NUEVA","s":"Ricardo Hernández Cruz","d":"Carrera 41 No. 18-36","x":false},
{"r":"260213","f":"2026-05-25","e":"OBSERVACIONES","l":"2026-06-18","lr":"","t":"OBRA NUEVA","s":"Pedro Ospina Botero","d":"Carrera 38 No. 19-20","x":false},
{"r":"260214","f":"2026-05-25","e":"OBSERVACIONES","l":"2026-06-18","lr":"","t":"CERRAMIENTO","s":"Álvaro Martínez Rodríguez","d":"Calle 3 No. 21-99","x":false},
{"r":"260215","f":"2026-05-29","e":"APROBADO","l":"2026-06-09","lr":"2026-06-09","t":"PROPIEDAD HORIZONTAL","s":"Óscar Zuluaga Echeverri","d":"Calle 32 No. 29-81","x":false},
{"r":"260216","f":"2026-05-29","e":"APROBADO","l":"2026-06-12","lr":"2026-06-12","t":"AMPLIACION","s":"Fernando Castaño Aguilar","d":"Avenida 30 No. 3-89","x":false},
{"r":"260217","f":"2026-05-26","e":"EN ESTUDIO","l":"2026-06-15","lr":"","t":"AMPLIACION","s":"Silvia Díaz Vargas","d":"Diagonal 10 No. 11-92","x":false},
{"r":"260218","f":"2026-05-29","e":"RADICADO","l":"","lr":"","t":"CERRAMIENTO","s":"Lucía Ramírez Jiménez","d":"Diagonal 36 No. 4-41","x":false},
{"r":"260219","f":"2026-05-28","e":"NO LDF","l":"","lr":"","t":"SUBDIVISION","s":"Mauricio Reyes Torres","d":"Calle 4 No. 10-50","x":false},
{"r":"260220","f":"2026-06-03","e":"OBSERVACIONES","l":"2026-06-15","lr":"","t":"DEMOLICION","s":"Héctor Salazar Gallego","d":"Avenida 13 No. 25-21","x":false},
{"r":"260221","f":"2026-06-01","e":"NOTIFICADO","l":"2026-06-22","lr":"2026-06-22","t":"AMPLIACION","s":"Patricia Cardona Rodríguez","d":"Calle 26 No. 17-59","x":false},
{"r":"260222","f":"2026-06-01","e":"EN ESTUDIO","l":"2026-06-17","lr":"","t":"CONSTRUCCION","s":"Ana Gutiérrez Cardona","d":"Diagonal 42 No. 22-61","x":false},
{"r":"260223","f":"2026-06-01","e":"OBSERVACIONES","l":"2026-06-09","lr":"","t":"MODIFICACION","s":"Jorge Cruz Gallego","d":"Avenida 49 No. 13-47","x":false},
{"r":"260224","f":"2026-06-01","e":"NO LDF","l":"","lr":"","t":"PROPIEDAD HORIZONTAL","s":"Isabel Gómez Jiménez","d":"Diagonal 19 No. 3-50","x":false},
{"r":"260225","f":"2026-06-04","e":"NO LDF","l":"","lr":"","t":"OBRA NUEVA","s":"Mónica Zuluaga Castaño","d":"Diagonal 8 No. 5-13","x":false},
{"r":"260226","f":"2026-06-04","e":"DESISTIDO","l":"","lr":"","t":"CERRAMIENTO","s":"Isabel Jiménez Torres","d":"Carrera 39 No. 17-52","x":false},
{"r":"260227","f":"2026-06-08","e":"EN ESTUDIO","l":"2026-06-15","lr":"","t":"DEMOLICION","s":"Carolina Vargas Montoya","d":"Diagonal 30 No. 5-78","x":false},
{"r":"260228","f":"2026-06-08","e":"EN ESTUDIO","l":"2026-07-02","lr":"","t":"CERRAMIENTO","s":"Alejandro Aguilar Zuluaga","d":"Avenida 38 No. 11-65","x":false},
{"r":"260229","f":"2026-06-09","e":"OBSERVACIONES","l":"2026-06-29","lr":"","t":"PROPIEDAD HORIZONTAL","s":"Patricia Montoya Rodríguez","d":"Avenida 22 No. 22-15","x":false},
{"r":"260230","f":"2026-06-08","e":"OBSERVACIONES","l":"2026-07-03","lr":"","t":"CONSTRUCCION","s":"Javier Montoya Cruz","d":"Diagonal 37 No. 8-93","x":false},
{"r":"260231","f":"2026-06-04","e":"OBSERVACIONES","l":"2026-06-15","lr":"","t":"OBRA NUEVA","s":"Alberto Gallego Zuluaga","d":"Transversal 10 No. 27-88","x":false},
{"r":"260232","f":"2026-06-08","e":"EN ESTUDIO","l":"2026-06-16","lr":"","t":"RECONOCIMIENTO","s":"Juan Herrera Ramos","d":"Transversal 10 No. 14-89","x":false},
{"r":"260233","f":"2026-06-08","e":"NO LDF","l":"","lr":"","t":"PROPIEDAD HORIZONTAL","s":"Rodrigo Ceballos Gallego","d":"Calle 46 No. 5-67","x":false},
{"r":"260234","f":"2026-06-08","e":"OBSERVACIONES","l":"2026-06-29","lr":"","t":"OBRA NUEVA","s":"Germán Ramos Rivera","d":"Transversal 35 No. 11-70","x":false},
{"r":"260235","f":"2026-06-09","e":"OBSERVACIONES","l":"2026-07-06","lr":"","t":"SUBDIVISION","s":"Rosa Montoya Gómez","d":"Carrera 18 No. 18-39","x":false},
{"r":"260236","f":"2026-06-09","e":"CORRECCION","l":"2026-06-23","lr":"","t":"SUBDIVISION","s":"Carolina Díaz Giraldo","d":"Transversal 21 No. 16-45","x":false},
{"r":"260237","f":"2026-06-12","e":"CORRECCION","l":"2026-06-25","lr":"","t":"SUBDIVISION","s":"Andrea Salazar Castaño","d":"Diagonal 25 No. 29-51","x":false},
{"r":"260238","f":"2026-06-15","e":"DESISTIDO","l":"","lr":"","t":"DEMOLICION","s":"Ricardo Martínez Gutiérrez","d":"Calle 23 No. 30-57","x":false},
{"r":"260239","f":"2026-06-15","e":"APROBADO","l":"2026-07-06","lr":"2026-07-06","t":"RECONOCIMIENTO","s":"Valentina Valencia Ortiz","d":"Diagonal 45 No. 9-18","x":false}
];
const P=[...P1,...P2,...P3];


const PROYECTOS_2026 = P.map(p => ({
  radicado: p.r, fechaRad: p.f, estado: p.e, ldf: p.l, ldfReal: p.lr,
  tipoLicencia: p.t, solicitante: p.s, direccion: p.d, estrategico: p.x,
  tecnico: "", revisorEstruc: ""
}));

const ARQUITECTOS = ["Diana Uribe","Adriana Marulanda","Laura Arandia","Camila Marulanda"];
const INGENIEROS = ["Alejandra Calderon","Camilo Rodriguez","Jorge Obed"];
const CURADOR = "Luis Fernando Montes";
const COLORS = ["#2e7d32","#1565c0","#f57c00","#7b1fa2","#c62828","#00838f","#4e342e","#283593","#558b2f","#d84315"];

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
  const [page, setPage] = useState(0);
  const totalPages = 3;

  useEffect(() => {
    const timer = setInterval(() => setPage(p => (p + 1) % totalPages), 12000);
    return () => clearInterval(timer);
  }, []);

  const stats = useMemo(() => {
    const byEstado = {};
    proyectos.forEach(p => { byEstado[p.estado] = (byEstado[p.estado] || 0) + 1; });
    const estrategicos = proyectos.filter(p => p.estrategico).length;
    const byMes = {};
    proyectos.forEach(p => { const m = p.fechaRad.slice(5,7); byMes[m] = (byMes[m] || 0) + 1; });
    const mesData = Object.entries(byMes).sort().map(([m, t]) => ({ mes: ["","Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"][parseInt(m)], total: t }));
    return { byEstado, estrategicos, mesData };
  }, [proyectos]);

  const now = new Date().toLocaleString("es-CO", { dateStyle:"long", timeStyle:"short" });

  return (
    <div className="tv-mode">
      <div className="tv-header">
        <div style={{ display:"flex", alignItems:"center", gap:16 }}>
          <Building2 size={28} />
          <h1>Curaduría Urbana N.° 2 de Pereira</h1>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:20 }}>
          <span style={{ fontSize:14, opacity:.8 }}>{now}</span>
          <div style={{ display:"flex", gap:6 }}>
            {[0,1,2].map(i => <div key={i} style={{ width:10, height:10, borderRadius:"50%", background: page===i?"#fff":"rgba(255,255,255,.3)" }} />)}
          </div>
          <button onClick={onClose} style={{ background:"rgba(255,255,255,.2)", border:"none", color:"#fff", padding:"6px 14px", borderRadius:6, cursor:"pointer", fontSize:13 }}>✕ Salir</button>
        </div>
      </div>
      <div className="tv-content fade-in" key={page}>
        {page === 0 && (
          <div className="tv-grid">
            <div className="tv-stat"><div className="number" style={{color:"var(--primary)"}}>{proyectos.length}</div><div className="label">Total Radicados</div></div>
            <div className="tv-stat"><div className="number" style={{color:"#f57c00"}}>{stats.estrategicos}</div><div className="label">Estratégicos</div></div>
            <div className="tv-stat"><div className="number" style={{color:"#1565c0"}}>{stats.byEstado["EN ESTUDIO"]||0}</div><div className="label">En Estudio</div></div>
            <div className="tv-stat"><div className="number" style={{color:"#2e7d32"}}>{stats.byEstado["APROBADO"]||0}</div><div className="label">Aprobados</div></div>
            <div className="tv-chart">
              <h3 style={{marginBottom:12,fontSize:16}}>Radicados por Mes</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={stats.mesData}><XAxis dataKey="mes" /><YAxis /><Tooltip />
                  <Bar dataKey="total" fill="var(--primary)" radius={[6,6,0,0]} /></BarChart>
              </ResponsiveContainer>
            </div>
            <div className="tv-stat"><div className="number" style={{color:"#f9a825"}}>{stats.byEstado["OBSERVACIONES"]||0}</div><div className="label">Observaciones</div></div>
            <div className="tv-stat"><div className="number" style={{color:"#c62828"}}>{stats.byEstado["DESISTIDO"]||0}</div><div className="label">Desistidos</div></div>
          </div>
        )}
        {page === 1 && (
          <div>
            <h2 style={{marginBottom:16,fontSize:20}}>Proyectos Estratégicos ({stats.estrategicos})</h2>
            <div className="table-wrap" style={{maxHeight:"calc(100vh - 160px)"}}>
              <table><thead><tr><th>Radicado</th><th>Fecha</th><th>Solicitante</th><th>Tipo</th><th>Estado</th><th>Dirección</th></tr></thead>
                <tbody>{proyectos.filter(p=>p.estrategico).map(p=>(
                  <tr key={p.radicado}><td><strong>{p.radicado}</strong></td><td>{formatDate(p.fechaRad)}</td><td>{p.solicitante}</td>
                    <td>{p.tipoLicencia}</td><td><span className={`badge ${estadoColor(p.estado)}`}>{p.estado}</span></td><td>{p.direccion}</td></tr>
                ))}</tbody></table>
            </div>
          </div>
        )}
        {page === 2 && (
          <div>
            <h2 style={{marginBottom:16,fontSize:20}}>Distribución por Estado</h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,height:"calc(100vh - 160px)"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"center"}}>
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart><Pie data={Object.entries(stats.byEstado).map(([name,value])=>({name,value}))} cx="50%" cy="50%" outerRadius={140} dataKey="value"
                    label={({name,value})=>`${name}: ${value}`} fontSize={13}>
                    {Object.keys(stats.byEstado).map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]} />)}
                  </Pie><Tooltip /></PieChart>
                </ResponsiveContainer>
              </div>
              <div style={{display:"flex",flexDirection:"column",justifyContent:"center",gap:12}}>
                {Object.entries(stats.byEstado).sort((a,b)=>b[1]-a[1]).map(([estado,count],i)=>(
                  <div key={estado} style={{display:"flex",alignItems:"center",gap:12}}>
                    <div style={{width:16,height:16,borderRadius:4,background:COLORS[i%COLORS.length],flexShrink:0}} />
                    <span style={{flex:1,fontSize:16}}>{estado}</span>
                    <span style={{fontSize:24,fontWeight:700}}>{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
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
        <div className="search-box">
          <input placeholder="Buscar por radicado, solicitante o dirección..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="table-wrap">
          <table><thead><tr><th>Radicado</th><th>Fecha</th><th>Solicitante</th><th>Tipo</th><th>Dirección</th><th>LDF</th><th>Estado</th></tr></thead>
            <tbody>{filtered.map(p => (
              <tr key={p.radicado}><td><strong>⭐ {p.radicado}</strong></td><td>{formatDate(p.fechaRad)}</td><td>{p.solicitante}</td>
                <td style={{fontSize:11}}>{p.tipoLicencia}</td><td style={{fontSize:11}}>{p.direccion}</td><td>{formatDate(p.ldf)}</td>
                <td><span className={`badge ${estadoColor(p.estado)}`}>{p.estado}</span></td></tr>
            ))}</tbody></table>
        </div>
      </div>
    </div>
  );
}

// --- 4. INGRESO DE TÉCNICOS ---
function IngresoTecnicoView({ proyectos, setProyectos }) {
  const [selRad, setSelRad] = useState("");
  const [tecnico, setTecnico] = useState("");
  const [revisor, setRevisor] = useState("");
  const [msg, setMsg] = useState(null);
  const [historial, setHistorial] = useState([]);

  const proyecto = useMemo(() => proyectos.find(p => p.radicado === selRad), [proyectos, selRad]);

  function asignar() {
    if (!selRad) return;
    const updated = proyectos.map(p => {
      if (p.radicado === selRad) {
        return { ...p, tecnico: tecnico || p.tecnico, revisorEstruc: revisor || p.revisorEstruc };
      }
      return p;
    });
    setProyectos(updated);
    const entry = { fecha: new Date().toLocaleString("es-CO"), radicado: selRad, tecnico: tecnico || "(sin cambio)", revisor: revisor || "(sin cambio)" };
    setHistorial(prev => [entry, ...prev]);
    setMsg({ type: "success", text: `Técnicos asignados al radicado ${selRad}` });
    setTimeout(() => setMsg(null), 3000);
  }

  return (
    <div className="fade-in">
      <div className="grid grid-2">
        <div className="card">
          <div className="card-header"><h3>Asignación de Técnicos</h3></div>
          {msg && <div className={`alert-row alert-${msg.type}`}>{msg.type === "success" ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}{msg.text}</div>}
          <div className="form-group">
            <label>Radicado</label>
            <select value={selRad} onChange={e => { setSelRad(e.target.value); setTecnico(""); setRevisor(""); }}>
              <option value="">Seleccionar radicado...</option>
              {proyectos.map(p => <option key={p.radicado} value={p.radicado}>{p.radicado} - {p.solicitante}</option>)}
            </select>
          </div>
          {proyecto && (
            <>
              <div style={{ background: "var(--primary-light)", padding: 12, borderRadius: 8, marginBottom: 14, fontSize: 13 }}>
                <div><strong>Tipo:</strong> {proyecto.tipoLicencia}</div>
                <div><strong>Estado:</strong> <span className={`badge ${estadoColor(proyecto.estado)}`}>{proyecto.estado}</span></div>
                <div><strong>Dirección:</strong> {proyecto.direccion}</div>
                {proyecto.tecnico && <div><strong>Arquitecto actual:</strong> {proyecto.tecnico}</div>}
                {proyecto.revisorEstruc && <div><strong>Ingeniero actual:</strong> {proyecto.revisorEstruc}</div>}
              </div>
              <div className="form-group">
                <label>Arquitecto Revisor</label>
                <select value={tecnico} onChange={e => setTecnico(e.target.value)}>
                  <option value="">Seleccionar arquitecto...</option>
                  {ARQUITECTOS.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Ingeniero Estructural</label>
                <select value={revisor} onChange={e => setRevisor(e.target.value)}>
                  <option value="">Seleccionar ingeniero...</option>
                  {INGENIEROS.map(ing => <option key={ing} value={ing}>{ing}</option>)}
                </select>
              </div>
              <button className="btn btn-primary" onClick={asignar} style={{ width: "100%" }}>
                <UserPlus size={14} style={{ verticalAlign: "middle", marginRight: 6 }} />Asignar Técnicos
              </button>
            </>
          )}
        </div>
        <div className="card">
          <div className="card-header"><h3>Historial de Asignaciones</h3></div>
          {historial.length === 0 ? (
            <p style={{ color: "var(--text3)", fontSize: 13, textAlign: "center", padding: 30 }}>No hay asignaciones en esta sesión</p>
          ) : (
            <div style={{ maxHeight: 400, overflowY: "auto" }}>
              {historial.map((h, i) => (
                <div key={i} className="timeline-item">
                  <div className="timeline-dot" />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>Radicado {h.radicado}</div>
                    <div style={{ fontSize: 12, color: "var(--text2)" }}>Arquitecto: {h.tecnico} | Ingeniero: {h.revisor}</div>
                    <div style={{ fontSize: 11, color: "var(--text3)" }}>{h.fecha}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
// --- 5. TÉRMINOS ---
function TerminosView({ proyectos }) {
  const [filtro, setFiltro] = useState("todos");
  const h = hoy();

  const analisis = useMemo(() => {
    return proyectos.filter(p => p.ldf && p.estado !== "APROBADO" && p.estado !== "DESISTIDO" && p.estado !== "NOTIFICADO")
      .map(p => {
        const vencimiento45 = addDiasHabiles(p.ldf, 45);
        const vencStr = vencimiento45.toISOString().slice(0, 10);
        const diasRestantes = diasHabilesEntre(h, vencStr);
        const vencido = vencStr < h;
        const porVencer = !vencido && diasRestantes <= 5;
        const noLdf = p.estado === "NO LDF";
        const vencimientoNoLdf = noLdf ? addDiasHabiles(p.fechaRad, 30) : null;
        return { ...p, vencimiento: vencStr, diasRestantes, vencido, porVencer, vencimientoNoLdf };
      }).sort((a, b) => a.diasRestantes - b.diasRestantes);
  }, [proyectos, h]);

  const filtered = useMemo(() => {
    if (filtro === "vencidos") return analisis.filter(a => a.vencido);
    if (filtro === "porVencer") return analisis.filter(a => a.porVencer);
    if (filtro === "enTermino") return analisis.filter(a => !a.vencido && !a.porVencer);
    return analisis;
  }, [analisis, filtro]);

  const vencidos = analisis.filter(a => a.vencido).length;
  const porVencer = analisis.filter(a => a.porVencer).length;
  const enTermino = analisis.filter(a => !a.vencido && !a.porVencer).length;

  return (
    <div className="fade-in">
      <div className="grid grid-4" style={{ marginBottom: 16 }}>
        <StatCard number={analisis.length} label="Con Término Activo" icon={Clock} />
        <StatCard number={vencidos} label="Vencidos" color="#d32f2f" icon={XCircle} />
        <StatCard number={porVencer} label="Por Vencer (≤5 días)" color="#f9a825" icon={AlertTriangle} />
        <StatCard number={enTermino} label="En Término" color="#2e7d32" icon={CheckCircle} />
      </div>
      <div className="card">
        <div className="pill-row">
          {[["todos","Todos"],["vencidos","Vencidos"],["porVencer","Por Vencer"],["enTermino","En Término"]].map(([k,l])=>(
            <button key={k} className={`pill ${filtro===k?"active":""}`} onClick={()=>setFiltro(k)}>{l}</button>
          ))}
        </div>
        <div className="table-wrap">
          <table><thead><tr><th>Radicado</th><th>Estado</th><th>Fecha Rad.</th><th>LDF</th><th>Vencimiento (45d)</th><th>Días Restantes</th><th>Semáforo</th></tr></thead>
            <tbody>{filtered.map(p => (
              <tr key={p.radicado}>
                <td><strong>{p.estrategico?"⭐ ":""}{p.radicado}</strong></td>
                <td><span className={`badge ${estadoColor(p.estado)}`}>{p.estado}</span></td>
                <td>{formatDate(p.fechaRad)}</td><td>{formatDate(p.ldf)}</td><td>{formatDate(p.vencimiento)}</td>
                <td style={{fontWeight:700, color: p.vencido?"#c62828":p.porVencer?"#f57f17":"#2e7d32"}}>{p.vencido ? `−${Math.abs(p.diasRestantes)}` : p.diasRestantes}</td>
                <td>{p.vencido ? <span className="badge badge-red">VENCIDO</span> : p.porVencer ? <span className="badge badge-yellow">POR VENCER</span> : <span className="badge badge-green">EN TÉRMINO</span>}</td>
              </tr>
            ))}</tbody></table>
        </div>
      </div>
    </div>
  );
}

// --- 6. PROYECTOS ---
function ProyectosView({ proyectos }) {
  const [search, setSearch] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("todos");
  const [tipoFiltro, setTipoFiltro] = useState("todos");

  const estados = useMemo(() => [...new Set(proyectos.map(p => p.estado))].sort(), [proyectos]);
  const tipos = useMemo(() => [...new Set(proyectos.map(p => p.tipoLicencia))].sort(), [proyectos]);

  const filtered = useMemo(() => {
    return proyectos.filter(p => {
      if (estadoFiltro !== "todos" && p.estado !== estadoFiltro) return false;
      if (tipoFiltro !== "todos" && p.tipoLicencia !== tipoFiltro) return false;
      if (search) {
        const q = search.toLowerCase();
        return p.radicado.includes(q) || p.solicitante.toLowerCase().includes(q) || p.direccion.toLowerCase().includes(q);
      }
      return true;
    });
  }, [proyectos, search, estadoFiltro, tipoFiltro]);

  return (
    <div className="fade-in">
      <div className="card">
        <div className="search-box">
          <input placeholder="Buscar radicado, solicitante o dirección..." value={search} onChange={e => setSearch(e.target.value)} />
          <select value={estadoFiltro} onChange={e => setEstadoFiltro(e.target.value)}>
            <option value="todos">Todos los estados</option>
            {estados.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
          <select value={tipoFiltro} onChange={e => setTipoFiltro(e.target.value)}>
            <option value="todos">Todos los tipos</option>
            {tipos.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div style={{ fontSize: 13, color: "var(--text2)", marginBottom: 10 }}>Mostrando {filtered.length} de {proyectos.length} proyectos</div>
        <div className="table-wrap" style={{ maxHeight: 600 }}>
          <table><thead><tr><th>Radicado</th><th>Fecha</th><th>Solicitante</th><th>Tipo</th><th>Dirección</th><th>LDF</th><th>Estado</th></tr></thead>
            <tbody>{filtered.map(p => (
              <tr key={p.radicado}>
                <td><strong>{p.estrategico?"⭐ ":""}{p.radicado}</strong></td>
                <td>{formatDate(p.fechaRad)}</td><td>{p.solicitante}</td>
                <td style={{fontSize:11}}>{p.tipoLicencia}</td><td style={{fontSize:11}}>{p.direccion}</td>
                <td>{formatDate(p.ldf)}</td><td><span className={`badge ${estadoColor(p.estado)}`}>{p.estado}</span></td>
              </tr>
            ))}</tbody></table>
        </div>
      </div>
    </div>
  );
}

// --- 7. TÉCNICOS ---
function TecnicosView({ proyectos }) {
  const [sel, setSel] = useState(null);

  const tecData = useMemo(() => {
    const all = [...ARQUITECTOS, ...INGENIEROS];
    return all.map(nombre => {
      const asignados = proyectos.filter(p => involucrado(p, nombre));
      const rol = ARQUITECTOS.includes(nombre) ? "Arquitecto" : "Ingeniero";
      const byEstado = {};
      asignados.forEach(p => { byEstado[p.estado] = (byEstado[p.estado] || 0) + 1; });
      return { nombre, rol, total: asignados.length, byEstado, proyectos: asignados };
    });
  }, [proyectos]);

  const colorsAvatar = ["#2e7d32","#1565c0","#f57c00","#7b1fa2","#c62828","#00838f","#4e342e"];

  return (
    <div className="fade-in">
      <div className="grid grid-3" style={{ marginBottom: 16 }}>
        {tecData.map((t, i) => (
          <div key={t.nombre} className="tecnico-card" style={{ cursor: "pointer", border: sel === t.nombre ? "2px solid var(--primary)" : undefined }} onClick={() => setSel(sel === t.nombre ? null : t.nombre)}>
            <div className="tecnico-avatar" style={{ background: colorsAvatar[i % colorsAvatar.length] }}>{t.nombre.split(" ").map(n => n[0]).join("").slice(0, 2)}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{t.nombre}</div>
              <div style={{ fontSize: 12, color: "var(--text3)" }}>{t.rol}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: "var(--primary)" }}>{t.total}</div>
              <div style={{ fontSize: 11, color: "var(--text3)" }}>proyectos</div>
            </div>
          </div>
        ))}
      </div>
      {sel && (() => {
        const tec = tecData.find(t => t.nombre === sel);
        if (!tec) return null;
        return (
          <div className="card fade-in">
            <div className="card-header"><h3>Proyectos de {tec.nombre} ({tec.total})</h3></div>
            {tec.total === 0 ? <p style={{ textAlign: "center", color: "var(--text3)", padding: 20 }}>Sin proyectos asignados</p> : (
              <div className="table-wrap">
                <table><thead><tr><th>Radicado</th><th>Solicitante</th><th>Tipo</th><th>Estado</th></tr></thead>
                  <tbody>{tec.proyectos.map(p => (
                    <tr key={p.radicado}><td><strong>{p.radicado}</strong></td><td>{p.solicitante}</td>
                      <td style={{fontSize:11}}>{p.tipoLicencia}</td><td><span className={`badge ${estadoColor(p.estado)}`}>{p.estado}</span></td></tr>
                  ))}</tbody></table>
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
}

// --- 8. CURADOR ---
function CuradorView({ proyectos }) {
  const pendientes = useMemo(() => proyectos.filter(p => p.estado === "EN ESTUDIO" || p.estado === "EN REVISION"), [proyectos]);
  const aprobados = useMemo(() => proyectos.filter(p => p.estado === "APROBADO" || p.estado === "NOTIFICADO"), [proyectos]);
  const h = hoy();
  const urgentes = useMemo(() => {
    return proyectos.filter(p => {
      if (!p.ldf || p.estado === "APROBADO" || p.estado === "DESISTIDO") return false;
      const venc = addDiasHabiles(p.ldf, 45).toISOString().slice(0,10);
      const dias = diasHabilesEntre(h, venc);
      return venc >= h && dias <= 5;
    });
  }, [proyectos, h]);

  return (
    <div className="fade-in">
      <div className="card" style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 16, padding: 20 }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 22, fontWeight: 700 }}>LF</div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>{CURADOR}</div>
          <div style={{ fontSize: 13, color: "var(--text2)" }}>Curador Urbano N.° 2 de Pereira</div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 20, textAlign: "center" }}>
          <div><div style={{ fontSize: 28, fontWeight: 700, color: "var(--primary)" }}>{proyectos.length}</div><div style={{ fontSize: 11, color: "var(--text3)" }}>Total</div></div>
          <div><div style={{ fontSize: 28, fontWeight: 700, color: "#1565c0" }}>{pendientes.length}</div><div style={{ fontSize: 11, color: "var(--text3)" }}>Pendientes</div></div>
          <div><div style={{ fontSize: 28, fontWeight: 700, color: "#2e7d32" }}>{aprobados.length}</div><div style={{ fontSize: 11, color: "var(--text3)" }}>Aprobados</div></div>
        </div>
      </div>
      {urgentes.length > 0 && (
        <div className="card" style={{ marginBottom: 16 }}>
          <div className="card-header"><h3>⚠️ Proyectos Urgentes (≤5 días hábiles)</h3></div>
          {urgentes.map(p => (
            <div key={p.radicado} className="alert-row alert-warning">
              <AlertTriangle size={16} />
              <span><strong>{p.radicado}</strong> — {p.solicitante} — {p.estado}</span>
            </div>
          ))}
        </div>
      )}
      <div className="grid grid-2">
        <div className="card">
          <div className="card-header"><h3>Pendientes de Revisión ({pendientes.length})</h3></div>
          <div className="table-wrap" style={{ maxHeight: 350 }}>
            <table><thead><tr><th>Radicado</th><th>Solicitante</th><th>Estado</th></tr></thead>
              <tbody>{pendientes.map(p => (
                <tr key={p.radicado}><td><strong>{p.radicado}</strong></td><td>{p.solicitante}</td>
                  <td><span className={`badge ${estadoColor(p.estado)}`}>{p.estado}</span></td></tr>
              ))}</tbody></table>
          </div>
        </div>
        <div className="card">
          <div className="card-header"><h3>Aprobados Recientes ({aprobados.length})</h3></div>
          <div className="table-wrap" style={{ maxHeight: 350 }}>
            <table><thead><tr><th>Radicado</th><th>Solicitante</th><th>Tipo</th></tr></thead>
              <tbody>{aprobados.map(p => (
                <tr key={p.radicado}><td><strong>{p.radicado}</strong></td><td>{p.solicitante}</td><td style={{fontSize:11}}>{p.tipoLicencia}</td></tr>
              ))}</tbody></table>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- 9. HISTORIAL ---
function HistorialView({ proyectos }) {
  const [filtroMes, setFiltroMes] = useState("todos");
  const meses = useMemo(() => {
    const s = new Set(proyectos.map(p => p.fechaRad.slice(0, 7)));
    return [...s].sort();
  }, [proyectos]);

  const eventos = useMemo(() => {
    let items = proyectos.map(p => ({
      fecha: p.fechaRad, tipo: "Radicación", radicado: p.radicado,
      detalle: `${p.tipoLicencia} — ${p.solicitante}`, estado: p.estado
    }));
    proyectos.forEach(p => {
      if (p.ldf) items.push({ fecha: p.ldf, tipo: "LDF Asignado", radicado: p.radicado, detalle: `LDF: ${formatDate(p.ldf)}`, estado: p.estado });
      if (p.ldfReal) items.push({ fecha: p.ldfReal, tipo: "LDF Cumplido", radicado: p.radicado, detalle: `LDF Real: ${formatDate(p.ldfReal)}`, estado: p.estado });
    });
    if (filtroMes !== "todos") items = items.filter(e => e.fecha.startsWith(filtroMes));
    return items.sort((a, b) => b.fecha.localeCompare(a.fecha));
  }, [proyectos, filtroMes]);

  return (
    <div className="fade-in">
      <div className="card">
        <div className="card-header">
          <h3>Historial de Eventos ({eventos.length})</h3>
          <select value={filtroMes} onChange={e => setFiltroMes(e.target.value)} style={{ fontSize: 12 }}>
            <option value="todos">Todos los meses</option>
            {meses.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <div style={{ maxHeight: 600, overflowY: "auto" }}>
          {eventos.slice(0, 200).map((ev, i) => (
            <div key={i} className="timeline-item">
              <div className="timeline-dot" style={{ background: ev.tipo === "Radicación" ? "var(--primary)" : ev.tipo === "LDF Asignado" ? "#1565c0" : "#2e7d32" }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: 600, fontSize: 13 }}>{ev.radicado} — {ev.tipo}</span>
                  <span style={{ fontSize: 11, color: "var(--text3)" }}>{formatDate(ev.fecha)}</span>
                </div>
                <div style={{ fontSize: 12, color: "var(--text2)" }}>{ev.detalle}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- 10. HISTÓRICO ---
function HistoricoView() {
  const data = HISTORICO_ANOS;
  const total = data.reduce((s, d) => s + d.total, 0);

  return (
    <div className="fade-in">
      <div className="grid grid-4" style={{ marginBottom: 16 }}>
        <StatCard number={total.toLocaleString()} label="Total Histórico (2019-2026)" icon={Archive} />
        <StatCard number={data.length} label="Años de Datos" icon={Calendar} />
        <StatCard number={Math.max(...data.map(d => d.total))} label="Máximo Anual" color="#f57c00" icon={Star} />
        <StatCard number={data[data.length - 1].total} label="Radicados 2026" color="#1565c0" icon={FolderOpen} />
      </div>
      <div className="grid grid-2">
        <div className="card">
          <div className="card-header"><h3>Radicados por Año</h3></div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data}><XAxis dataKey="ano" fontSize={12} /><YAxis fontSize={12} /><Tooltip />
              <Bar dataKey="total" fill="var(--primary)" radius={[4,4,0,0]} name="Total" />
              <Bar dataKey="aprobados" fill="#2e7d32" radius={[4,4,0,0]} name="Aprobados" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <div className="card-header"><h3>Tendencia Histórica</h3></div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={data}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="ano" fontSize={12} /><YAxis fontSize={12} />
              <Tooltip /><Legend fontSize={11} />
              <Area type="monotone" dataKey="total" stroke="var(--primary)" fill="var(--primary-light)" name="Total" />
              <Area type="monotone" dataKey="aprobados" stroke="#2e7d32" fill="#e8f5e9" name="Aprobados" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="card" style={{ marginTop: 16 }}>
        <div className="card-header"><h3>Detalle por Año</h3></div>
        <div className="table-wrap">
          <table><thead><tr><th>Año</th><th>Total</th><th>Aprobados</th><th>Desistidos</th><th>Tasa Aprobación</th></tr></thead>
            <tbody>{data.map(d => (
              <tr key={d.ano}><td><strong>{d.ano}</strong></td><td>{d.total}</td><td>{d.aprobados}</td><td>{d.desistidos}</td>
                <td>
                  <div className="progress-bar" style={{ width: 100 }}>
                    <div className="progress-fill" style={{ width: `${(d.aprobados / d.total * 100)}%`, background: "#2e7d32" }} />
                  </div>
                  <span style={{ fontSize: 11 }}>{(d.aprobados / d.total * 100).toFixed(1)}%</span>
                </td></tr>
            ))}</tbody></table>
        </div>
      </div>
    </div>
  );
}
// ========== APP ==========
const TABS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "estrategicos", label: "Estratégicos", icon: Star },
  { id: "terminos", label: "Términos", icon: Clock },
  { id: "proyectos", label: "Proyectos", icon: FolderOpen },
  { id: "ingreso", label: "Ingreso Técnico", icon: UserPlus },
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

  useEffect(() => {
    document.body.className = dark ? "dark" : "";
  }, [dark]);

  return (
    <div className="app">
      <style>{STYLES}</style>
      {tvMode && <ModoTV proyectos={proyectos} onClose={() => setTvMode(false)} />}
      <div className="header">
        <div className="header-logo">C2</div>
        <h1>Dashboard Curaduría Urbana N.° 2 de Pereira</h1>
        <div className="header-actions">
          <button className="btn btn-sm" style={{ background: "rgba(255,255,255,.15)", color: "#fff", border: "none" }} onClick={() => setTvMode(true)}>
            <Tv size={14} style={{ verticalAlign: "middle", marginRight: 4 }} />TV
          </button>
          <button className="btn btn-sm" style={{ background: "rgba(255,255,255,.15)", color: "#fff", border: "none" }} onClick={() => setDark(!dark)}>
            {dark ? <Sun size={14} /> : <Moon size={14} />}
          </button>
        </div>
      </div>
      <div className="nav">
        {TABS.map(t => (
          <button key={t.id} className={tab === t.id ? "active" : ""} onClick={() => setTab(t.id)}>
            <t.icon size={15} />{t.label}
          </button>
        ))}
      </div>
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
