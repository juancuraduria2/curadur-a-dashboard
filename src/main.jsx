import React, { useState, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LayoutDashboard, ListChecks, Search, Calendar, Star, FileText, MapPin, User, Building } from 'lucide-react';

/* ====================================================
   239 PROYECTOS REALES 2026 - DATOS DEL EXCEL
   ==================================================== */
const projectsDataFull = [
  { radicado: "260001", fechaRad: "2026-01-06", estado: "NO LDF", tecnico: "", revisorEstruc: "", ldf: "2026-02-16", ldfReal: "", tipoLicencia: "CONSTRUCCION", solicitante: "JAIDER GARCÍA CANO", direccion: "MZ 4 LT 3 VILLA MAGDALIA / CUBA", estrategico: true },
  { radicado: "260002", fechaRad: "2026-01-07", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-02-17", ldfReal: "2026-01-27", tipoLicencia: "CONSTRUCCION", solicitante: "INGENIA CONSTRUCCIONES S.A.S.", direccion: "MZ A # 10 - 72 PINARES DE SAN MARTIN", estrategico: true },
  { radicado: "260003", fechaRad: "2026-01-08", estado: "DESISTIDO", tecnico: "", revisorEstruc: "", ldf: "2026-02-18", ldfReal: "2026-01-29", tipoLicencia: "CONSTRUCCION", solicitante: "EDWIN CARDONA RUIZ", direccion: "CR 11 B # 1 - 21", estrategico: true },
  { radicado: "260004", fechaRad: "2026-01-08", estado: "DESISTIDO", tecnico: "", revisorEstruc: "", ldf: "2026-02-18", ldfReal: "", tipoLicencia: "CONSTRUCCION", solicitante: "LILIANA PATRICIA DIAZ GALLEGO", direccion: "MZ 4-B LT 4 JARDINES DE CONDINA VDA NUEVO SOL", estrategico: true },
  { radicado: "OA-260005", fechaRad: "2026-01-08", estado: "APROBADO", tecnico: "", revisorEstruc: "", ldf: "2026-02-18", ldfReal: "", tipoLicencia: "AJUSTE DE COTAS", solicitante: "H.M.I. HENRY MORENO INGENIERIA S.A.S. y OTROS", direccion: "PARAJE FLOTA OCCIDENTAL VIA CARTAGO", estrategico: false },
  { radicado: "260005", fechaRad: "2026-01-08", estado: "APROBADO", tecnico: "", revisorEstruc: "", ldf: "2026-02-18", ldfReal: "", tipoLicencia: "URBANIZACION", solicitante: "MUKALA CONSTRUCCIONES S.A.S.", direccion: "CR 30 ENTRE ALAMOS Y SAN LUIS", estrategico: true },
  { radicado: "260006", fechaRad: "2026-01-14", estado: "APROBADO", tecnico: "", revisorEstruc: "", ldf: "2026-02-24", ldfReal: "", tipoLicencia: "CONSTRUCCION", solicitante: "PAPELES NACIONALES S.A.S.", direccion: "PARAJE LA MARINA VÍA PEREIRA – CARTAGO. / FÁBRICA PAPELES NA", estrategico: true },
  { radicado: "260007", fechaRad: "2026-01-14", estado: "APROBADO", tecnico: "", revisorEstruc: "", ldf: "2026-02-24", ldfReal: "2026-01-29", tipoLicencia: "CONSTRUCCION", solicitante: "PAPELES NACIONALES S.A.S.", direccion: "PARAJE LA MARINA VÍA PEREIRA – CARTAGO. / FÁBRICA PAPELES NA", estrategico: true },
  { radicado: "260008", fechaRad: "2026-01-14", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-02-24", ldfReal: "2026-02-25", tipoLicencia: "RECONOCIMIENTO", solicitante: "GLADYS  DELGADO RIAÑO", direccion: "CL 66C # 1B-03 PLAN PARCIAL LA REINA LLANO GRANDE", estrategico: true },
  { radicado: "260009", fechaRad: "2026-01-15", estado: "DESISTIDO", tecnico: "", revisorEstruc: "", ldf: "2026-02-25", ldfReal: "2026-02-26", tipoLicencia: "CONSTRUCCION", solicitante: "ELIZABETH  CASTRO CARDENAS", direccion: "LT 9 EL POBLADO 2 MZ 38 K 26B 32 49 Mz 38 Cs 9", estrategico: true },
  { radicado: "260010", fechaRad: "2026-01-15", estado: "NO LDF", tecnico: "", revisorEstruc: "", ldf: "2026-02-25", ldfReal: "", tipoLicencia: "CONSTRUCCION", solicitante: "ADRIANA MURIEL OSPINA", direccion: "CL 24 # 20-136 LA PRADERA D/DAS", estrategico: true },
  { radicado: "260011", fechaRad: "2026-01-19", estado: "APROBADO", tecnico: "", revisorEstruc: "", ldf: "2026-02-28", ldfReal: "2026-01-19", tipoLicencia: "CONSTRUCCION", solicitante: "LILIANA MARIA PEREZ PALACIO", direccion: "CR 31 # 15-02 SAN LUIS", estrategico: true },
  { radicado: "260012", fechaRad: "2026-01-20", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-03-02", ldfReal: "2026-02-25", tipoLicencia: "CONSTRUCCION", solicitante: "OSCAR EDUARDO ROJAS MORENO", direccion: "CORREGIMIENTO ARABIA LT A REMANENTE PREDIO EL PORVENIR", estrategico: true },
  { radicado: "260013", fechaRad: "2026-01-21", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-03-03", ldfReal: "2026-02-09", tipoLicencia: "CONSTRUCCION", solicitante: "INVERSIONES Y PROYECTOS DEL EJE SAS", direccion: "A TURBAY CRUCE CR CUBA LA PUERTA DEL SOL", estrategico: true },
  { radicado: "260014", fechaRad: "2026-01-22", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-03-04", ldfReal: "2026-02-17", tipoLicencia: "CONSTRUCCION", solicitante: "EDITH  GOMEZ BEDOYA", direccion: "LA GLORIA VEREDA LA PALMILLA", estrategico: true },
  { radicado: "260015", fechaRad: "2026-01-22", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-03-04", ldfReal: "2026-03-05", tipoLicencia: "CONSTRUCCION", solicitante: "KATHERIN  MEJIA OSPINA", direccion: "SC PARAJE DE PAVAS LT 2", estrategico: true },
  { radicado: "260016", fechaRad: "2026-01-23", estado: "DESISTIDO", tecnico: "", revisorEstruc: "", ldf: "2026-03-05", ldfReal: "2026-02-04", tipoLicencia: "CONSTRUCCION", solicitante: "VALENTINA  VIZCAINO TORRES", direccion: "LT 9 CONDOMINIO LAS MARIAS CERRITOS", estrategico: true },
  { radicado: "260017", fechaRad: "2026-01-26", estado: "APROBADO", tecnico: "", revisorEstruc: "", ldf: "2026-03-07", ldfReal: "2026-01-26", tipoLicencia: "CONSTRUCCION", solicitante: "GLORIA EUGENIA JARA VASQUEZ", direccion: "MZ 25 LT 5 VILLA DEL PRADO", estrategico: true },
  { radicado: "260018", fechaRad: "2026-01-26", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-03-07", ldfReal: "2026-03-09", tipoLicencia: "CONSTRUCCION", solicitante: "MIGUEL ANGEL CAÑAVERAL OSPINA", direccion: "MZ E LT 5 GIBRALTAR", estrategico: true },
  { radicado: "260019", fechaRad: "2026-01-27", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-03-09", ldfReal: "2026-01-27", tipoLicencia: "URBANIZACION", solicitante: "CONSTRUCCIONES CFC Y ASOCIADOS SAS-BIC", direccion: "LT A3 PARAJE O FRACCION DE CONSOTA CANAAN", estrategico: true },
  { radicado: "260020", fechaRad: "2026-01-27", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-03-09", ldfReal: "2026-01-27", tipoLicencia: "CONSTRUCCION", solicitante: "LEALCOT INGENIERIA E INMOBILIARIA SAS", direccion: "UNIDAD DEPORTIVA EL JARDIN", estrategico: true },
  { radicado: "260021", fechaRad: "2026-01-27", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-03-09", ldfReal: "2026-01-27", tipoLicencia: "CONSTRUCCION", solicitante: "JHON FREDY OSPINA MONTOYA", direccion: "MZ 14 LT 11 CIUDADELA DEL CAFE SC E", estrategico: true },
  { radicado: "260022", fechaRad: "2026-01-28", estado: "APROBADO", tecnico: "", revisorEstruc: "", ldf: "2026-03-10", ldfReal: "2026-01-28", tipoLicencia: "RECONOCIMIENTO", solicitante: "MARICELA  ALZATE ALZATE", direccion: "CR 5B #38-19 CAÑARTE", estrategico: true },
  { radicado: "OA-260033", fechaRad: "2026-01-28", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-03-10", ldfReal: "", tipoLicencia: "REGLAMENTO PROPIEDAD HORIZONTAL", solicitante: "PROYECTOS URBANOS 3L SAS", direccion: "AV. SUR CL 83 Y 84 / ANDALUCIA", estrategico: false },
  { radicado: "260023", fechaRad: "2026-01-29", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-03-11", ldfReal: "2026-03-12", tipoLicencia: "CONSTRUCCION", solicitante: "HIDROTECNIK SAS", direccion: "LT 01A CERRITOS LIVING", estrategico: true },
  { radicado: "260024", fechaRad: "2026-01-29", estado: "DESISTIDO", tecnico: "", revisorEstruc: "", ldf: "2026-03-11", ldfReal: "2026-02-05", tipoLicencia: "RECONOCIMIENTO", solicitante: "CARLOS ALBERTO QUICENO GOMEZ", direccion: "CL 14 # 4-39 CENTRO", estrategico: true },
  { radicado: "260025", fechaRad: "2026-01-29", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-03-11", ldfReal: "2026-03-12", tipoLicencia: "CONSTRUCCION", solicitante: "NERLI  PALACIOS PALACIOS", direccion: "MZ M LT 6 POBLADO I", estrategico: true },
  { radicado: "260026", fechaRad: "2026-02-02", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-03-14", ldfReal: "2026-03-16", tipoLicencia: "CONSTRUCCION", solicitante: "JULIA VALENTINA SALAZAR GALLEGO", direccion: "MZ 17 LT 21 ET 2 VILLA OLIMPICA CORALES", estrategico: true },
  { radicado: "260027", fechaRad: "2026-02-02", estado: "APROBADO", tecnico: "", revisorEstruc: "", ldf: "2026-03-14", ldfReal: "2026-02-09", tipoLicencia: "URBANIZACION", solicitante: "INVERSIONES Y ACTIVOS M Y M S.A.S", direccion: "LT 98 CONDINA", estrategico: true },
  { radicado: "260029", fechaRad: "2026-02-02", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-03-14", ldfReal: "2026-02-05", tipoLicencia: "RECONOCIMIENTO", solicitante: "FAMILIA VALENCIA Y CIA S EN C", direccion: "SC VEREDA LIBARE CORREGIMIENTO LA FLORIDA LT 7 LAS BRISAS", estrategico: true },
  { radicado: "260030", fechaRad: "2026-02-03", estado: "APROBADO", tecnico: "", revisorEstruc: "", ldf: "2026-03-16", ldfReal: "2026-02-03", tipoLicencia: "RECONOCIMIENTO", solicitante: "THOMAS MARIANO RIVAS SILES", direccion: "CR 12B # 11B-78 APT 101BF HENAO", estrategico: true },
  { radicado: "260031", fechaRad: "2026-02-03", estado: "APROBADO", tecnico: "", revisorEstruc: "", ldf: "2026-03-16", ldfReal: "2026-02-03", tipoLicencia: "CONSTRUCCION", solicitante: "EDIFICIO PANORAMA PH", direccion: "CL 17 #23-64 EDIFICIO PANORAMA", estrategico: true },
  { radicado: "260032", fechaRad: "2026-02-03", estado: "APROBADO", tecnico: "", revisorEstruc: "", ldf: "2026-03-16", ldfReal: "2026-02-20", tipoLicencia: "URBANIZACION", solicitante: "ARTICA DISEÑOS SAS", direccion: "LT G SC MONTEVERDE PINARES", estrategico: true },
  { radicado: "260033", fechaRad: "2026-02-04", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-03-17", ldfReal: "2026-03-18", tipoLicencia: "CONSTRUCCION", solicitante: "CARE CAPITAL SAS", direccion: "CR 13 # 105-131 AVDA 30 AGOSTO UP P7 EDIFICIO CLINICA CENTRA", estrategico: true },
  { radicado: "260034", fechaRad: "2026-02-04", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-03-17", ldfReal: "2026-03-18", tipoLicencia: "CONSTRUCCION", solicitante: "CARE CAPITAL SAS", direccion: "CR 13 # 105-131 AVDA 30 AGOSTO UP P9 EDIFICIO CLINICA CENTRA", estrategico: true },
  { radicado: "260035", fechaRad: "2026-02-04", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-03-17", ldfReal: "2026-03-18", tipoLicencia: "CONSTRUCCION", solicitante: "CARE CAPITAL SAS", direccion: "CR 13 # 105-131 AVDA 30 AGOSTO UP P8 EDIFICIO CLINICA CENTRA", estrategico: true },
  { radicado: "260036", fechaRad: "2026-02-05", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-03-18", ldfReal: "2026-02-23", tipoLicencia: "CONSTRUCCION", solicitante: "ARPRO ARQUITECTOS INGENIEROS SAS", direccion: "SC NARANJITO MZ 4B LT J FLORA", estrategico: true },
  { radicado: "260037", fechaRad: "2026-02-05", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-03-18", ldfReal: "2026-02-18", tipoLicencia: "CONSTRUCCION", solicitante: "DOS X TRUIZ SAS", direccion: "UA 2 PLAN PARCIAL VILLA HERMOSA KANAIMA EL CONGOLO LT 11", estrategico: true },
  { radicado: "260038", fechaRad: "2026-02-05", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-03-18", ldfReal: "2026-03-19", tipoLicencia: "CONSTRUCCION", solicitante: "ADRIÁN ALBERTO SALAZAR SALAZAR", direccion: "MZ 13 LT 6 PERLA DEL SUR", estrategico: true },
  { radicado: "260039", fechaRad: "2026-02-05", estado: "APROBADO", tecnico: "", revisorEstruc: "", ldf: "2026-03-18", ldfReal: "2026-02-05", tipoLicencia: "SUBDIVISION", solicitante: "A. BOTERO Y COMPANIA SOCIEDAD EN COMANDITA POR ACCIONES", direccion: "CR 17 Y 18 CON CL 86 LT 4 VILLA OLIMPICA", estrategico: false },
  { radicado: "260040", fechaRad: "2026-02-06", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-03-19", ldfReal: "2026-03-20", tipoLicencia: "SUBDIVISION", solicitante: "RAFAEL CANDAMIL ARIAS", direccion: "EL GUAYABO VDA EL JAZMIN", estrategico: false },
  { radicado: "260041", fechaRad: "2026-02-06", estado: "APROBADO", tecnico: "", revisorEstruc: "", ldf: "2026-03-19", ldfReal: "2026-02-23", tipoLicencia: "PARCELACION + SUBDIVISION", solicitante: "JORGE ALONSO GÓMEZ AGUDELO", direccion: "LOTE EL ENCANTO - VEREDA CAÑAVERAL / SCT CONDINA", estrategico: false },
  { radicado: "260042", fechaRad: "2026-02-06", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-03-19", ldfReal: "2026-03-20", tipoLicencia: "CONSTRUCCION", solicitante: "JALBUILDER BETANCUR CORREA", direccion: "CR 27 #66-57 CUBA", estrategico: false },
  { radicado: "260043", fechaRad: "2026-02-06", estado: "APROBADO", tecnico: "", revisorEstruc: "", ldf: "2026-03-19", ldfReal: "2026-02-09", tipoLicencia: "CONSTRUCCION", solicitante: "LILIANA PATRICIA DIAZ GALLEGO", direccion: "MZ 4-B LT 4 JARDINES DE CONDINA VDA NUEVO SOL", estrategico: false },
  { radicado: "260044", fechaRad: "2026-02-09", estado: "APROBADO", tecnico: "", revisorEstruc: "", ldf: "2026-03-21", ldfReal: "2026-02-09", tipoLicencia: "SUBDIVISION", solicitante: "JANETH ALEXANDRA RIVERA ZAPATA", direccion: "LT 1 PARAJE COMBIA", estrategico: false },
  { radicado: "260046", fechaRad: "2026-02-09", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-03-21", ldfReal: "2026-02-27", tipoLicencia: "CONSTRUCCION", solicitante: "CONCEPCION MORENO DE AGUDELO", direccion: "CS 428  #65-48 BR LA UNION CUBA", estrategico: false },
  { radicado: "OA-260053", fechaRad: "2026-02-09", estado: "APROBADO", tecnico: "", revisorEstruc: "", ldf: "2026-03-21", ldfReal: "", tipoLicencia: "REGLAMENTO PROPIEDAD HORIZONTAL", solicitante: "FORTAL SAS", direccion: "CL 86 #40-60 VIA ALTAGRACIA-CONJUNTO RESIDENCIAL CEDRO NEGRO", estrategico: false },
  { radicado: "260047", fechaRad: "2026-02-11", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-03-24", ldfReal: "2026-02-11", tipoLicencia: "CONSTRUCCION", solicitante: "DOS PASSOS SAS", direccion: "LT 6 LA PIRAGUA CERRITOS", estrategico: false },
  { radicado: "260048", fechaRad: "2026-02-11", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-03-24", ldfReal: "2026-02-11", tipoLicencia: "RECONOCIMIENTO", solicitante: "OSCAR ORLANDO ALARCON BAQUERO", direccion: "MZ 7 CS 18 MONTELIBANO", estrategico: false },
  { radicado: "260049", fechaRad: "2026-02-12", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-03-25", ldfReal: "2026-02-12", tipoLicencia: "CONSTRUCCION", solicitante: "LEALCOT INGENIERIA E INMOBILIARIA SAS", direccion: "PARQUE INFANTIL CUBA", estrategico: false },
  { radicado: "OA-260064", fechaRad: "2026-02-12", estado: "APROBADO", tecnico: "", revisorEstruc: "", ldf: "2026-03-25", ldfReal: "", tipoLicencia: "REGLAMENTO PROPIEDAD HORIZONTAL", solicitante: "ELIZABETH LADINO GUERRERO", direccion: "MZ O CS 03 URB.EL CARDAL", estrategico: false },
  { radicado: "260050", fechaRad: "2026-02-12", estado: "DESISTIDO", tecnico: "", revisorEstruc: "", ldf: "2026-03-25", ldfReal: "2026-02-17", tipoLicencia: "CONSTRUCCION", solicitante: "LINA MARCELA USMA ACEVEDO", direccion: "CL 4 # 10-50 BERLIN", estrategico: false },
  { radicado: "260051", fechaRad: "2026-02-13", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-03-26", ldfReal: "2026-02-16", tipoLicencia: "CONSTRUCCION", solicitante: "EDWIN CARDONA RUIZ", direccion: "CR 11B #1-21", estrategico: false },
  { radicado: "260052", fechaRad: "2026-02-13", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-03-26", ldfReal: "2026-02-13", tipoLicencia: "CONSTRUCCION", solicitante: "HENRY HASSEM ESTUPIÑAN LUCUMI", direccion: "LT 6 A 1 VEREDA CONDINA", estrategico: false },
  { radicado: "260053", fechaRad: "2026-02-13", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-03-26", ldfReal: "2026-02-18", tipoLicencia: "CONSTRUCCION", solicitante: "PROMOTORA Y CONSTRUCTORA BUEN VIVIR SAS", direccion: "LT 66 CONDOMINIO ANDAHUAYLAS COMBIA", estrategico: false },
  { radicado: "260054", fechaRad: "2026-02-13", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-03-26", ldfReal: "2026-02-18", tipoLicencia: "CONSTRUCCION", solicitante: "ORLANDO  TRUJILLO ACOSTA", direccion: "EL MANZANO KM 15 VIA PEREIRA ARMENIA", estrategico: false },
  { radicado: "260055", fechaRad: "2026-02-16", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-03-28", ldfReal: "2026-02-16", tipoLicencia: "CONSTRUCCION", solicitante: "OLIVERIO TEUSA AUSIQUE", direccion: "CL 25 # 6-59 CENTRO", estrategico: false },
  { radicado: "260056", fechaRad: "2026-02-16", estado: "DESISTIDO", tecnico: "", revisorEstruc: "", ldf: "2026-03-28", ldfReal: "", tipoLicencia: "RECONOCIMIENTO", solicitante: "SIGIFREDO MARIN ARIAS", direccion: "SC PARAJE ALEGRIAS", estrategico: false },
  { radicado: "260057", fechaRad: "2026-02-17", estado: "NEGADO", tecnico: "", revisorEstruc: "", ldf: "2026-03-30", ldfReal: "2026-02-17", tipoLicencia: "SUBDIVISION", solicitante: "YEIMY ALEXANDRA AVILA CAÑAS", direccion: "FINCA LA PONDEROSA 2 VDA COROZAL", estrategico: false },
  { radicado: "260058", fechaRad: "2026-02-18", estado: "DESISTIDO", tecnico: "", revisorEstruc: "", ldf: "2026-03-31", ldfReal: "", tipoLicencia: "SUBDIVISION", solicitante: "JAIME ALBERTO CARMONA VALENCIA", direccion: "FINCA PINARES VEREDA BETULIA", estrategico: false },
  { radicado: "OA-260132", fechaRad: "2026-02-19", estado: "APROBADO", tecnico: "", revisorEstruc: "", ldf: "2026-04-01", ldfReal: "", tipoLicencia: "REGLAMENTO PROPIEDAD HORIZONTAL", solicitante: "H.M.I. HENRY MORENO INGENIERIA S.A.S. y OTROS", direccion: "PARAJE FLOTA OCCIDENTAL VIA CARTAGO", estrategico: false },
  { radicado: "260059", fechaRad: "2026-02-20", estado: "DESISTIDO", tecnico: "", revisorEstruc: "", ldf: "2026-04-02", ldfReal: "2026-02-20", tipoLicencia: "CONSTRUCCION", solicitante: "OSCAR ANDRES LOAIZA MARIN", direccion: "MZ 9 LT 3 PLAN DE VIVIENDA LOS PARAISOS ET 2 CUBA", estrategico: false },
  { radicado: "260060", fechaRad: "2026-02-20", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-04-02", ldfReal: "2026-02-20", tipoLicencia: "CONSTRUCCION", solicitante: "HITOS URBANOS SAS", direccion: "LT 1 - 2 - 3 - 4 Y 5 HACIENDA QUIMBAYA ENTRADA 4 CERRITOS", estrategico: false },
  { radicado: "260061", fechaRad: "2026-02-23", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-04-04", ldfReal: "2026-03-25", tipoLicencia: "CONSTRUCCION", solicitante: "JOSE NICOLAS RAMIREZ ECHEVERRI", direccion: "LT 5 PARCELACION", estrategico: false },
  { radicado: "260062", fechaRad: "2026-02-23", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-04-04", ldfReal: "2026-04-09", tipoLicencia: "CONSTRUCCION", solicitante: "JHON ARLEY PULGARIN GALINDO", direccion: "C 75B # 31-27 MZ J CS 6 LA HABANA CUBA", estrategico: false },
  { radicado: "260063", fechaRad: "2026-02-23", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-04-04", ldfReal: "2026-04-09", tipoLicencia: "RECONOCIMIENTO", solicitante: "JESUS EMILIO PINO", direccion: "MZ 14 LT 20 GILBERTO PELAEZ", estrategico: false },
  { radicado: "260064", fechaRad: "2026-02-23", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-04-04", ldfReal: "2026-03-02", tipoLicencia: "RECONOCIMIENTO", solicitante: "ALBERTO RESTREPO MEJIA", direccion: "LT 3 GUAYABAL", estrategico: false },
  { radicado: "260065", fechaRad: "2026-02-24", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-04-06", ldfReal: "2026-02-27", tipoLicencia: "CONSTRUCCION", solicitante: "PROMOTORA Y CONSTRUCTORA BUEN VIVIR SAS", direccion: "LT 65 COND.ANDAHUAYLAS", estrategico: false },
  { radicado: "260066", fechaRad: "2026-02-24", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-04-06", ldfReal: "2026-03-12", tipoLicencia: "CONSTRUCCION", solicitante: "SENDA CONSTRUCCIONES S.A.S", direccion: "PARQUE RESIDENCIAL LA CIELITO PARAJE LA JULIA ET 3", estrategico: false },
  { radicado: "260067", fechaRad: "2026-02-24", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-04-06", ldfReal: "2026-02-24", tipoLicencia: "CONSTRUCCION", solicitante: "YENI ALEXANDRA ECHEVERRI VELEZ", direccion: "MZ 6 CS 19 VILLA ELISA", estrategico: false },
  { radicado: "260068", fechaRad: "2026-02-25", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-04-07", ldfReal: "2026-03-02", tipoLicencia: "CONSTRUCCION", solicitante: "FRANCISCO JAVIER OSORIO BOTERO", direccion: "LT 01-B1 DONACION VEREDA EL POMO COMBIA", estrategico: false },
  { radicado: "260069", fechaRad: "2026-02-25", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-04-07", ldfReal: "2026-04-13", tipoLicencia: "CONSTRUCCION", solicitante: "KARINA  BUITRAGO ECHEVERRI", direccion: "MZ 5 CS 5 CIUDAD BOQUIA", estrategico: false },
  { radicado: "260070", fechaRad: "2026-02-25", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-04-07", ldfReal: "2026-04-13", tipoLicencia: "CONSTRUCCION", solicitante: "LEIDY YULIETH GONZALEZ HENAO", direccion: "MZ 3 LT 38 MONTELIBANO", estrategico: false },
  { radicado: "260071", fechaRad: "2026-02-26", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-04-08", ldfReal: "2026-04-14", tipoLicencia: "CONSTRUCCION", solicitante: "RUBEN DARIO QUINTERO SALAZAR", direccion: "MZ 1 LT 16 VILLA MAGDALIA", estrategico: false },
  { radicado: "260072", fechaRad: "2026-02-27", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-04-09", ldfReal: "2026-02-27", tipoLicencia: "CONSTRUCCION", solicitante: "MARIA STELLA VELEZ ACEVEDO", direccion: "MZ 3 LT 24 MALAGA LLANO GRANDE", estrategico: false },
  { radicado: "260074", fechaRad: "2026-02-27", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-04-09", ldfReal: "2026-03-03", tipoLicencia: "RECONOCIMIENTO", solicitante: "MARIA CAROLA QUINTERO MORALES", direccion: "LT LA ESPERANZA VIA LA FLORIDA LA BANANERA", estrategico: false },
  { radicado: "260075", fechaRad: "2026-02-27", estado: "DESISTIDO", tecnico: "", revisorEstruc: "", ldf: "2026-04-09", ldfReal: "2026-02-27", tipoLicencia: "RECONOCIMIENTO", solicitante: "AMPARO BOTERO LONDOÑO", direccion: "CL 18 NO 9A Y 10A CL 18 NO 9 52/66 CENTRO", estrategico: false },
  { radicado: "260076", fechaRad: "2026-03-02", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-04-11", ldfReal: "2026-03-12", tipoLicencia: "RECONOCIMIENTO", solicitante: "CRUZ ELISA GRAJALES GONZALEZ", direccion: "LAS DELICIAS CORREGIMIENTO DE ARABIA", estrategico: false },
  { radicado: "260077", fechaRad: "2026-03-02", estado: "APROBADO", tecnico: "", revisorEstruc: "", ldf: "2026-04-11", ldfReal: "2026-04-01", tipoLicencia: "SUBDIVISION", solicitante: "JUAN DAVID VILLA CASTAÑO", direccion: "CR 11 #4 Y 5", estrategico: false },
  { radicado: "260078", fechaRad: "2026-03-04", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-04-14", ldfReal: "2026-03-04", tipoLicencia: "CONSTRUCCION", solicitante: "CARLOS ALBERTO CHAVES RESTREPO", direccion: "CR 23B CL 70B-13 CS 23 SAN FERNANDO CUBA", estrategico: false },
  { radicado: "260079", fechaRad: "2026-03-04", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-04-14", ldfReal: "2026-03-04", tipoLicencia: "CONSTRUCCION", solicitante: "JULIANA ANDREA MISAS DUQUE", direccion: "MZ 14 LT 22 MONTELIBANO", estrategico: false },
  { radicado: "260080", fechaRad: "2026-03-04", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-04-14", ldfReal: "2026-03-04", tipoLicencia: "CONSTRUCCION", solicitante: "ESNEIDER  LOSADA CORTES", direccion: "MZ 15 LT 8 BELLO HORIZONTE", estrategico: false },
   { radicado: "260081", fechaRad: "2026-03-05", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-04-15", ldfReal: "2026-03-09", tipoLicencia: "CONSTRUCCION", solicitante: "CARLOS MARIO VALENCIA ARCILA", direccion: "MZ 12 LT 11 VILLA DEL PRADO", estrategico: false },
  { radicado: "260082", fechaRad: "2026-03-06", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-04-16", ldfReal: "2026-03-09", tipoLicencia: "CONSTRUCCION", solicitante: "MICHEL ALVARO LOPEZ OSPINA", direccion: "ENTRADA 5 VIA LA VIRGINIA CERRITOS DIAGONAL MAS 20 MTS CONDO", estrategico: false },
  { radicado: "260083", fechaRad: "2026-03-06", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-04-16", ldfReal: "2026-03-17", tipoLicencia: "CONSTRUCCION", solicitante: "LUZ MARY GALLEGO GRAJALES", direccion: "MZ 46 CS 14 JARDIN I", estrategico: false },
  { radicado: "260084", fechaRad: "2026-03-09", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-04-18", ldfReal: "2026-03-09", tipoLicencia: "CONSTRUCCION", solicitante: "JERSON ALEXANDER MURILLO ORTIZ", direccion: "LT 10 SC EL CAIRO CONDOMINIO ATARDECERES DE JAIBANA CERRITOS", estrategico: false },
  { radicado: "260085", fechaRad: "2026-03-09", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-04-18", ldfReal: "2026-03-09", tipoLicencia: "CONSTRUCCION", solicitante: "METROMEDICS SAS", direccion: "CR 3BIS # 12 Y 13 LT 22 CR 3BIS # 12-34 AMERICA", estrategico: false },
  { radicado: "260086", fechaRad: "2026-03-10", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-04-20", ldfReal: "2026-03-10", tipoLicencia: "CONSTRUCCION", solicitante: "LEIDY JOHANNA CADAVID MONTOYA", direccion: "CR 10 ENTRE 27Y 28 # 27-26", estrategico: false },
  { radicado: "260087", fechaRad: "2026-03-10", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-04-20", ldfReal: "2026-03-10", tipoLicencia: "CONSTRUCCION", solicitante: "ANGELA MARIA AGUDELO OTALVARO", direccion: "CR 3 # 22-71", estrategico: false },
  { radicado: "OA-260161", fechaRad: "2026-03-10", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-04-20", ldfReal: "", tipoLicencia: "AJUSTE DE COTAS", solicitante: "JUAN ALEJANDRO LELION LOPEZ", direccion: "COND.LAGOS DE MALABAR CERRITOS", estrategico: false },
  { radicado: "260088", fechaRad: "2026-03-11", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-04-21", ldfReal: "2026-03-11", tipoLicencia: "CONSTRUCCION", solicitante: "MARIA OFELIA VELASQUEZ CIFUENTES", direccion: "LT CASERIO DE ARABIA", estrategico: false },
  { radicado: "OA-260164", fechaRad: "2026-03-11", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-04-21", ldfReal: "", tipoLicencia: "REGLAMENTO PROPIEDAD HORIZONTAL", solicitante: "MUKALA CONSTRUCCIONES SAS", direccion: "CR 30 ENTRE ALAMOS Y SAN LUIS", estrategico: false },
  { radicado: "260089", fechaRad: "2026-03-12", estado: "APROBADO", tecnico: "", revisorEstruc: "", ldf: "2026-04-22", ldfReal: "2026-03-12", tipoLicencia: "SUBDIVISION", solicitante: "CARLOS ALBERTO TORRES CARDONA", direccion: "LT 1 CUCHILLA DE LOS CASTRO CUBA", estrategico: false },
  { radicado: "260090", fechaRad: "2026-03-13", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-04-23", ldfReal: "2026-04-29", tipoLicencia: "CONSTRUCCION", solicitante: "ASOCIACION DE USUARIOS DEL ACUEDUCTO DE COMBIA BAJA E.S.P", direccion: "LT SEGUNDA ETAPA MONTEVALO CASAS DEL CAMPO PARAJE DE COMBIA ", estrategico: false },
  { radicado: "260091", fechaRad: "2026-03-13", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-04-23", ldfReal: "2026-04-17", tipoLicencia: "CONSTRUCCION", solicitante: "VIP-INVERVAL LTDA. EN LIQUIDACION", direccion: "CR 6 #18 Y 19 18-27", estrategico: false },
  { radicado: "260092", fechaRad: "2026-03-16", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-04-25", ldfReal: "2026-04-30", tipoLicencia: "CONSTRUCCION", solicitante: "NELSON  PINZON HERNANDEZ", direccion: "VEREDA EL POMO PREDIO 'PRIMAVERA'", estrategico: false },
  { radicado: "260093", fechaRad: "2026-03-17", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-04-27", ldfReal: "2026-04-15", tipoLicencia: "CONSTRUCCION", solicitante: "MIGUEL ANGEL ARRELLANO SALAS", direccion: "VI PEREIRA CERRITOS MALABAR ENTRADA 6 CONDOMINIO MALABAR PH ", estrategico: false },
  { radicado: "260094", fechaRad: "2026-03-24", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-05-04", ldfReal: "2026-04-15", tipoLicencia: "CONSTRUCCION", solicitante: "CARLOS HERNANDO NAVARRO", direccion: "MZ 32 LT 10 SAMARIA II", estrategico: false },
  { radicado: "OA-260188", fechaRad: "2026-03-24", estado: "APROBADO", tecnico: "", revisorEstruc: "", ldf: "2026-05-04", ldfReal: "", tipoLicencia: "REGLAMENTO PROPIEDAD HORIZONTAL", solicitante: "CONSUELO  GIRALDO HERRERA", direccion: "CL 42B #6B-02", estrategico: false },
  { radicado: "260095", fechaRad: "2026-03-25", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-05-05", ldfReal: "2026-03-25", tipoLicencia: "RECONOCIMIENTO", solicitante: "LUZ BEIDA USMA CAÑAVERAL", direccion: "EL PLACER LT 3 COMBIA", estrategico: false },
  { radicado: "260096", fechaRad: "2026-03-25", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-05-05", ldfReal: "2026-03-25", tipoLicencia: "CONSTRUCCION", solicitante: "MARIA LIGIA MACHADO MOSQUERA", direccion: "CL 66C # 45-28 LT 5 AGUAS CLARAS", estrategico: false },
  { radicado: "260097", fechaRad: "2026-03-25", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-05-05", ldfReal: "2026-03-31", tipoLicencia: "CONSTRUCCION", solicitante: "MARIA NUBIA ECHEVERRI MORALES", direccion: "SAN JOSE VEREDA PEREZ ALTO", estrategico: false },
  { radicado: "260098", fechaRad: "2026-03-26", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-05-06", ldfReal: "2026-03-26", tipoLicencia: "SUBDIVISION", solicitante: "LUZ MARIA ARANGO E HIJOS SAS", direccion: "FINCA LA MARIA CERRITOS", estrategico: false },
  { radicado: "260099", fechaRad: "2026-03-26", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-05-06", ldfReal: "2026-04-09", tipoLicencia: "CONSTRUCCION", solicitante: "LINA MARCELA USMA ACEVEDO", direccion: "CL 4 # 10 - 50 BERLÍN", estrategico: false },
  { radicado: "260100", fechaRad: "2026-03-26", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-05-06", ldfReal: "2026-04-01", tipoLicencia: "CONSTRUCCION", solicitante: "CARLOS ARTURO HOLGUIN LOPEZ", direccion: "CL 18BIS # 30-37 SAN LUIS", estrategico: false },
  { radicado: "260101", fechaRad: "2026-03-27", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-05-07", ldfReal: "2026-03-30", tipoLicencia: "CONSTRUCCION", solicitante: "LUIS JAIR ANZOLA MORALES", direccion: "CL 24 #13-33", estrategico: false },
  { radicado: "260102", fechaRad: "2026-03-30", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-05-09", ldfReal: "2026-04-07", tipoLicencia: "CONSTRUCCION", solicitante: "PARROQUIA SAN ANTONIO MARIA CLARET", direccion: "CR 7 CLS 24 Y 25 # 24-52 IGLESIA CLARET LT A", estrategico: false },
  { radicado: "260103", fechaRad: "2026-03-30", estado: "APROBADO", tecnico: "", revisorEstruc: "", ldf: "2026-05-09", ldfReal: "2026-03-30", tipoLicencia: "SUBDIVISION", solicitante: "VALENTINA KALLEWAARD ECHEVERRI", direccion: "PARAJE LA CRISTALINA CS 2 LA IRLANDA", estrategico: false },
  { radicado: "260104", fechaRad: "2026-03-30", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-05-09", ldfReal: "2026-05-11", tipoLicencia: "RECONOCIMIENTO", solicitante: "JULIO CESAR GRAJALES GOMEZ", direccion: "PREDIO MI HERENCIA VDA EL GUAYABAL", estrategico: false },
  { radicado: "260105", fechaRad: "2026-03-30", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-05-09", ldfReal: "2026-04-27", tipoLicencia: "CONSTRUCCION", solicitante: "LUZ ALBA CASTAÑO HERNANDEZ", direccion: "LT 1A SC PARAJE MUNDO NUEVO PREDIO CONSOTA CORREGIMIENTO A B", estrategico: false },
  { radicado: "260106", fechaRad: "2026-03-31", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-05-11", ldfReal: "2026-05-15", tipoLicencia: "CONSTRUCCION", solicitante: "MARIA LUCENIA LOAIZA OSORIO", direccion: "MZ I LT 4 ET 3 PINARES CR 20 # 10-20", estrategico: false },
  { radicado: "260107", fechaRad: "2026-03-31", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-05-11", ldfReal: "2026-04-09", tipoLicencia: "CONSTRUCCION", solicitante: "MARIA AYDE GONZALEZ CASTAÑO", direccion: "CR 20B #24-15P LT 107 PALERMO", estrategico: false },
  { radicado: "260108", fechaRad: "2026-03-31", estado: "DESISTIDO", tecnico: "", revisorEstruc: "", ldf: "2026-05-11", ldfReal: "", tipoLicencia: "CONSTRUCCION", solicitante: "JAIRO DE JESUS  SALAZAR RIOS", direccion: "LA GAVIOTA VEREDA LA BELLA", estrategico: false },
  { radicado: "260109", fechaRad: "2026-04-01", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-05-12", ldfReal: "2026-05-19", tipoLicencia: "RECONOCIMIENTO", solicitante: "DIANA MARIA RIOS MARULANDA", direccion: "LT B GUADUALEJO SC ARABIA", estrategico: false },
  { radicado: "260110", fechaRad: "2026-04-01", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-05-12", ldfReal: "2026-04-09", tipoLicencia: "CONSTRUCCION", solicitante: "MARIA NELLY ESCOBAR DE VELASQUEZ", direccion: "MZ 9 LT 1 CR 6 # 42-03 PLAN DE VIVIENDA LOS CONSTRUCTORES", estrategico: false },
  { radicado: "260111", fechaRad: "2026-04-01", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-05-12", ldfReal: "2026-04-01", tipoLicencia: "CONSTRUCCION", solicitante: "MARYURI  JARAMILLO ESCOBAR", direccion: "CR 8B #2E-30 ALFONSO LOPEZ", estrategico: false },
  { radicado: "260112", fechaRad: "2026-04-01", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-05-12", ldfReal: "2026-04-01", tipoLicencia: "CONSTRUCCION", solicitante: "JM HOLDING COLOMBIA SAS", direccion: "CL 16 # 4-69", estrategico: false },
  { radicado: "OA-260206", fechaRad: "2026-04-01", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-05-12", ldfReal: "", tipoLicencia: "REGLAMENTO PROPIEDAD HORIZONTAL", solicitante: "DEISY  RUIZ ARIAS", direccion: "CR 15BIS # 30-10 CLS 30 Y 31 SAN NICOLAS", estrategico: false },
  { radicado: "260113", fechaRad: "2026-04-06", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-05-16", ldfReal: "2026-04-29", tipoLicencia: "CONSTRUCCION", solicitante: "LUZ MARY VALENCIA CORREA", direccion: "LT 1B SC VDA VILLEGAS VIA PEREIRA CARTAGO", estrategico: false },
  { radicado: "260114", fechaRad: "2026-04-06", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-05-16", ldfReal: "2026-04-09", tipoLicencia: "CONSTRUCCION", solicitante: "ANGELICA MARIA CARDONA DE LOS RIOS", direccion: "BUENOS AIRES", estrategico: false },
  { radicado: "260115", fechaRad: "2026-04-07", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-05-18", ldfReal: "2026-04-07", tipoLicencia: "RECONOCIMIENTO", solicitante: "BLANCA INÉS OROZCO GALLEGO", direccion: "MZ 17 CS 12 SC B VILLA CONSOTA EL DORADO 1", estrategico: false },
  { radicado: "260116", fechaRad: "2026-04-07", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-05-18", ldfReal: "2026-04-07", tipoLicencia: "RECONOCIMIENTO", solicitante: "RITA HELENA CARDONA GIRALDO", direccion: "MZ 2 LT 1 MALAGA CR 2 # 60-38", estrategico: false },
  { radicado: "260117", fechaRad: "2026-04-07", estado: "NO LDF", tecnico: "", revisorEstruc: "", ldf: "2026-05-18", ldfReal: "", tipoLicencia: "CONSTRUCCION", solicitante: "VICTOR  GIRALDO DIAZ", direccion: "LT 3 BARAJAS VILLA DEL PRADO", estrategico: false },
  { radicado: "260118", fechaRad: "2026-04-07", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-05-18", ldfReal: "2026-04-09", tipoLicencia: "CONSTRUCCION", solicitante: "ANGELICA MARIA CARDONA DE LOS RIOS", direccion: "LT DE TERRENO 1 PARAJE COMBIA", estrategico: false },
  { radicado: "260119", fechaRad: "2026-04-07", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-05-18", ldfReal: "2026-04-08", tipoLicencia: "CONSTRUCCION", solicitante: "FRANCISCO ANTONIO DIAZ MEDINA", direccion: "LT 59 COND. YAGUARUNDI PH CERRITOS", estrategico: false },
  { radicado: "260120", fechaRad: "2026-04-07", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-05-18", ldfReal: "2026-04-07", tipoLicencia: "CONSTRUCCION", solicitante: "MARTA INES ALVAREZ DE MONTOYA", direccion: "MZ 10 CS 5 URB.PORTAL DE SAN JOAQUIN ETP 3", estrategico: false },
  { radicado: "260121", fechaRad: "2026-04-07", estado: "DESISTIDO", tecnico: "", revisorEstruc: "", ldf: "2026-05-18", ldfReal: "2026-04-07", tipoLicencia: "CONSTRUCCION", solicitante: "KAROL STEFANNY SOLANO HIGUITA", direccion: "MZ 2 CS 4 LA DIVISA", estrategico: false },
  { radicado: "260122", fechaRad: "2026-04-07", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-05-18", ldfReal: "2026-05-21", tipoLicencia: "RECONOCIMIENTO", solicitante: "ANGELA MARIA MARTINEZ VARGAS", direccion: "CL 75B # 34A-46 MZ 15 CS 8 SC A 2500 LTS", estrategico: false },
  { radicado: "260123", fechaRad: "2026-04-08", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-05-19", ldfReal: "2026-04-09", tipoLicencia: "CONSTRUCCION", solicitante: "GLORIA AMPARO SERNA HINCAPIE", direccion: "LA FABIOLA LT 1 VDA EL CHOCHO", estrategico: false },
  { radicado: "260124", fechaRad: "2026-04-09", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-05-20", ldfReal: "2026-04-14", tipoLicencia: "CONSTRUCCION", solicitante: "TFM ENERGY S.A.S. E.S.P.", direccion: "LT 1-2-3 FINCA PIPINTA FRACCION DE COMBIA PARAJKE BARBERI", estrategico: false },
  { radicado: "260125", fechaRad: "2026-04-09", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-05-20", ldfReal: "2026-04-14", tipoLicencia: "CONSTRUCCION", solicitante: "TFM ENERGY S.A.S. E.S.P.", direccion: "LT 2 - LT 3 VRDA LA SUECIA / COMBIA", estrategico: false },
  { radicado: "260126", fechaRad: "2026-04-09", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-05-20", ldfReal: "2026-04-10", tipoLicencia: "CONSTRUCCION", solicitante: "MARIA FERNANDA VALERO JAIMES", direccion: "LT 4 LA MESA SAN JOAQUIN", estrategico: false },
  { radicado: "260127", fechaRad: "2026-04-09", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-05-20", ldfReal: "2026-04-09", tipoLicencia: "CONSTRUCCION", solicitante: "ESPERANZA  NARANJO RINCON", direccion: "CR 38 # 71-39 MZ A CS 8  TERRANOVA", estrategico: false },
  { radicado: "OA-260217", fechaRad: "2026-04-10", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-05-21", ldfReal: "", tipoLicencia: "AJUSTE DE COTAS", solicitante: "LATERIZIO SAS", direccion: "LA GRAN RESERVA SCT NARANJITO", estrategico: false },
  { radicado: "OA-260218", fechaRad: "2026-04-10", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-05-21", ldfReal: "", tipoLicencia: "AJUSTE DE COTAS", solicitante: "LATERIZIO SAS", direccion: "LA GRAN RESERVA SCT NARANJITO", estrategico: false },
  { radicado: "260128", fechaRad: "2026-04-10", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-05-21", ldfReal: "2026-04-13", tipoLicencia: "CONSTRUCCION", solicitante: "MARINO  ARISTIZABAL MONTES", direccion: "CR 4 #22-56", estrategico: false },
  { radicado: "260129", fechaRad: "2026-04-10", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-05-21", ldfReal: "2026-05-26", tipoLicencia: "RECONOCIMIENTO", solicitante: "MARIA NIRSA MORENO BERMUDEZ", direccion: "CL 19B #23-04 APTO 1 ED. ADAN MORENO", estrategico: false },
  { radicado: "260130", fechaRad: "2026-04-13", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-05-23", ldfReal: "2026-05-19", tipoLicencia: "RECONOCIMIENTO", solicitante: "HECTOR ALONSO PEREZ ALVAREZ", direccion: "AV.30 DE AGOSTO #87-300 LT 2", estrategico: false },
  { radicado: "260131", fechaRad: "2026-04-13", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-05-23", ldfReal: "2026-04-13", tipoLicencia: "RECONOCIMIENTO", solicitante: "MONICA VIVIANA UNI TREJOS", direccion: "CL 1E #9B-54 AV.SANTANDER  1 53", estrategico: false },
  { radicado: "260132", fechaRad: "2026-04-13", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-05-23", ldfReal: "2026-04-13", tipoLicencia: "CONSTRUCCION", solicitante: "JOHANA MARCELA PINEDA", direccion: "CL 71C # 36B-35 MZ 3 LT 1 SAN FELIPE CUBA", estrategico: false },
  { radicado: "260133", fechaRad: "2026-04-13", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-05-23", ldfReal: "2026-04-15", tipoLicencia: "CONSTRUCCION", solicitante: "CESAR DAVID RAMIREZ BURGOS", direccion: "MZ 40 CS 3 CIUDAD HEROES", estrategico: false },
  { radicado: "260134", fechaRad: "2026-04-13", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-05-23", ldfReal: "2026-05-27", tipoLicencia: "CONSTRUCCION", solicitante: "JUAN CARLOS CALLE GUTIERREZ", direccion: "CR 16C # 99A-53 ZONA B BELMONTE MZ 7B LT 15", estrategico: false },
  { radicado: "260135", fechaRad: "2026-04-15", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-05-26", ldfReal: "2026-04-15", tipoLicencia: "CONSTRUCCION", solicitante: "FRANCISCO JAVIER GARCIA FRANCO", direccion: "CR 2BIS # 16-67", estrategico: false },
  { radicado: "260136", fechaRad: "2026-04-17", estado: "APROBADO", tecnico: "", revisorEstruc: "", ldf: "2026-05-28", ldfReal: "2026-04-21", tipoLicencia: "CONSTRUCCION", solicitante: "EDIFICIO LEVEL PH SAS", direccion: "LT 4 LOS ALAMOS CL 13 #23", estrategico: false },
  { radicado: "260137", fechaRad: "2026-04-17", estado: "DESISTIDO", tecnico: "", revisorEstruc: "", ldf: "2026-05-28", ldfReal: "", tipoLicencia: "CONSTRUCCION", solicitante: "GEOVANNY  ECHEVERRY RAMOS", direccion: "MZ 8 LT 110 PLAN DE VIVIENDA LOS GUAYACANES", estrategico: false },
  { radicado: "260138", fechaRad: "2026-04-20", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-05-30", ldfReal: "2026-05-07", tipoLicencia: "CONSTRUCCION", solicitante: "LUZ DARY DE JESUS CASTRILLON LADINO", direccion: "LA ESTRELLA Y EL DIAMANTE LA ESTRELLA LA PALMILLA", estrategico: false },
  { radicado: "260139", fechaRad: "2026-04-20", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-05-30", ldfReal: "2026-04-22", tipoLicencia: "CONSTRUCCION", solicitante: "JOSE ADAN ARANGO LOPEZ", direccion: "MZ 5 LT 26 LOS PARAISOS ETP 1", estrategico: false },
  { radicado: "260140", fechaRad: "2026-04-20", estado: "APROBADO", tecnico: "", revisorEstruc: "", ldf: "2026-05-30", ldfReal: "2026-04-20", tipoLicencia: "CONSTRUCCION", solicitante: "ERY EDUARDO HURTADO JORDAN", direccion: "CR 24 # 73-111 SAN FERNANDO CUBA", estrategico: false },
  { radicado: "260141", fechaRad: "2026-04-20", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-05-30", ldfReal: "2026-04-20", tipoLicencia: "CONSTRUCCION", solicitante: "BENJAMIN ANTONIO MERCADO", direccion: "SC PARAJE NARANJITO MZ UNO LT 8 VILLA MAGDALIA", estrategico: false },
  { radicado: "260142", fechaRad: "2026-04-21", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-06-01", ldfReal: "2026-05-08", tipoLicencia: "CONSTRUCCION", solicitante: "INGENIA CONSTRUCCIONES SAS", direccion: "LT 17 SANTA RITA ET V VIA MORELIA ALCALA", estrategico: false },
  { radicado: "260143", fechaRad: "2026-04-22", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-06-02", ldfReal: "2026-04-22", tipoLicencia: "CONSTRUCCION", solicitante: "LUILLY HASON VALENCIA MARIN", direccion: "SC D LT 34 MZ 11 CIUDADELA DEL CAFE", estrategico: false },
  { radicado: "260144", fechaRad: "2026-04-22", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-06-02", ldfReal: "2026-04-22", tipoLicencia: "CONSTRUCCION", solicitante: "MONICA ANDREA AREVALO USECHE", direccion: "MZ C LT 4 URBANIZACION LA MESA SAN JOAQUIN", estrategico: false },
  { radicado: "260145", fechaRad: "2026-04-23", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-06-03", ldfReal: "2026-04-30", tipoLicencia: "CONSTRUCCION", solicitante: "DISTRACOM S.A", direccion: "CL 17 # 23-157 ZONA DE TAXIS TERMINAL DE TRANSPORTE", estrategico: false },
  { radicado: "260146", fechaRad: "2026-04-23", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-06-03", ldfReal: "2026-04-23", tipoLicencia: "CONSTRUCCION", solicitante: "MARIA LUCENIA VARGAS", direccion: "MZ 11 CS 5 VILLA DEL PRADO", estrategico: false },
  { radicado: "260148", fechaRad: "2026-04-24", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-06-04", ldfReal: "2026-05-06", tipoLicencia: "CONSTRUCCION", solicitante: "WILLIAM MONTOYA GALLEGO", direccion: "CL 14 #8-77", estrategico: false },
  { radicado: "260149", fechaRad: "2026-04-24", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-06-04", ldfReal: "2026-04-24", tipoLicencia: "SUBDIVISION", solicitante: "JAIME ALBERTO CARMONA VALENCIA", direccion: "FINCA PINARES VEREDA BETULIA", estrategico: false },
  { radicado: "260150", fechaRad: "2026-04-24", estado: "NO LDF", tecnico: "", revisorEstruc: "", ldf: "2026-06-04", ldfReal: "", tipoLicencia: "CONSTRUCCION", solicitante: "FELIPE  GARCIA GARCIA", direccion: "CL 34B # 1A-49 MZ 11 CS 10 OTUN", estrategico: false },
  { radicado: "260151", fechaRad: "2026-04-24", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-06-04", ldfReal: "2026-04-27", tipoLicencia: "CONSTRUCCION", solicitante: "GRUPO EMPRESARIAL DINAMICA SAS", direccion: "CL 7 # 14-108 CIRCUNVALAR", estrategico: false },
  { radicado: "260152", fechaRad: "2026-04-24", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-06-04", ldfReal: "2026-05-05", tipoLicencia: "CONSTRUCCION", solicitante: "LUIS ALBERTO ZAPATA ARANGO", direccion: "LT 2 VEREDA LA FLORIDA", estrategico: false },
  { radicado: "260153", fechaRad: "2026-04-27", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-06-06", ldfReal: "2026-04-27", tipoLicencia: "RECONOCIMIENTO", solicitante: "ADRIANA  HURTADO ALZATE", direccion: "CR 6 # 13-13 /15 LT 1", estrategico: false },
  { radicado: "260154", fechaRad: "2026-04-27", estado: "NO LDF", tecnico: "", revisorEstruc: "", ldf: "2026-06-06", ldfReal: "", tipoLicencia: "CONSTRUCCION", solicitante: "ROSA AMELIA USMA MORENO", direccion: "CR 3 # RIO MZ 5 LT 30 CL 44 # 3-39 EL TRIUNFO", estrategico: false },
  { radicado: "OA-260255", fechaRad: "2026-04-28", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-06-08", ldfReal: "", tipoLicencia: "REGLAMENTO PROPIEDAD HORIZONTAL", solicitante: "UBENY DE JESUS  MONROY BUENO", direccion: "MZ 4 LT 44 EL ZAFIRO PARAJE HUERTAS", estrategico: false },
  { radicado: "260155", fechaRad: "2026-04-28", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-06-08", ldfReal: "2026-04-28", tipoLicencia: "CONSTRUCCION", solicitante: "LUIS MANUEL FLOREZ CARVAJAL", direccion: "CL 74 # 22B-57 CUBA", estrategico: false },
  { radicado: "260156", fechaRad: "2026-04-28", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-06-08", ldfReal: "2026-04-28", tipoLicencia: "CONSTRUCCION", solicitante: "JOSE ALBERTO PINEDA VILLADA", direccion: "VILLA MARIA PARAJE TRIBUNAS", estrategico: false },
   { radicado: "260157", fechaRad: "2026-04-29", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-06-09", ldfReal: "2026-05-27", tipoLicencia: "CONSTRUCCION", solicitante: "DIEGO LOPEZ CASTAÑEDA", direccion: "K 26A 32 22 Mz 36 Cs 23 EL POBLADO", estrategico: false },
  { radicado: "260158", fechaRad: "2026-04-29", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-06-09", ldfReal: "2026-04-29", tipoLicencia: "CONSTRUCCION", solicitante: "DORIS YANETH LENIS PARRA", direccion: "CR 40D # 73B-20 MZ 8 LT 5 LA ALBANIA", estrategico: false },
  { radicado: "260159", fechaRad: "2026-04-29", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-06-09", ldfReal: "2026-05-05", tipoLicencia: "CONSTRUCCION", solicitante: "DIANA MARITZA MUÑOZ AGUDELO", direccion: "LT 30B MONTEVALO CASAS DEL CAMPO COMBIA", estrategico: false },
  { radicado: "260160", fechaRad: "2026-04-29", estado: "APROBADO", tecnico: "", revisorEstruc: "", ldf: "2026-06-09", ldfReal: "2026-05-04", tipoLicencia: "CONSTRUCCION", solicitante: "CENTRO COMERCIAL UNICENTRO PEREIRA", direccion: "AV.30 DE AGOSTO #76-21 CC. UNICENTRO", estrategico: false },
  { radicado: "260161", fechaRad: "2026-04-30", estado: "NO LDF", tecnico: "", revisorEstruc: "", ldf: "2026-06-10", ldfReal: "", tipoLicencia: "CONSTRUCCION", solicitante: "OLIMPO  GARCIA SALAZAR", direccion: "CR 5 # 35-57/59", estrategico: false },
  { radicado: "260162", fechaRad: "2026-04-30", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-06-10", ldfReal: "2026-05-07", tipoLicencia: "CONSTRUCCION", solicitante: "A1A INMOBILIRIA SAS", direccion: "MALL SAN PABLO LT 1 HUERTAS", estrategico: false },
  { radicado: "260163", fechaRad: "2026-04-30", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-06-10", ldfReal: "2026-05-05", tipoLicencia: "CONSTRUCCION", solicitante: "ODILIA MONTOYA DUQUE", direccion: "CL 15 # 16 BIS Y 17 16 B-18", estrategico: false },
  { radicado: "260164", fechaRad: "2026-04-30", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-06-10", ldfReal: "2026-04-30", tipoLicencia: "CONSTRUCCION", solicitante: "PEDRO PABLO OCHOA CUCALEANO", direccion: "LT 13 CONDOMINIO ALEGRANZA KM 5 VIA ARMENIA HUERTAS", estrategico: false },
  { radicado: "OA-260259", fechaRad: "2026-04-30", estado: "APROBADO", tecnico: "", revisorEstruc: "", ldf: "2026-06-10", ldfReal: "", tipoLicencia: "REGLAMENTO PROPIEDAD HORIZONTAL", solicitante: "EDIFICIO LEVEL PH SAS", direccion: "LT 4 LOS ALAMOS CL 13 #23", estrategico: false },
  { radicado: "260165", fechaRad: "2026-05-04", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-06-13", ldfReal: "2026-05-04", tipoLicencia: "SUBDIVISION", solicitante: "ZONA FRANCA INTERNACIONAL DE PEREIRA SAS", direccion: "LT 2A PARAJE LA LORENA ZONA FRANCA INTERNACIONAL", estrategico: false },
  { radicado: "260166", fechaRad: "2026-05-04", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-06-13", ldfReal: "2026-05-04", tipoLicencia: "CONSTRUCCION", solicitante: "KAROL STEFANNY SOLANO HIGUITA", direccion: "MZ 2 CS 4 LA DIVISA", estrategico: false },
  { radicado: "260167", fechaRad: "2026-05-04", estado: "NO LDF", tecnico: "", revisorEstruc: "", ldf: "2026-06-13", ldfReal: "", tipoLicencia: "CONSTRUCCION", solicitante: "FUSTHEL DAVID MANYOMA VELASQUEZ", direccion: "MZ P LT 10 POBLADO I", estrategico: false },
  { radicado: "260168", fechaRad: "2026-05-04", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-06-13", ldfReal: "2026-06-03", tipoLicencia: "CONSTRUCCION", solicitante: "FABIAN DE JESUS  JARAMILLO CARDONA", direccion: "EL JORDAN", estrategico: false },
  { radicado: "OA-260263", fechaRad: "2026-05-04", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-06-13", ldfReal: "", tipoLicencia: "APROBACION DE PISCINAS", solicitante: "MARINO  GONZALEZ", direccion: "LA PEÑA ROJA", estrategico: false },
  { radicado: "260169", fechaRad: "2026-05-06", estado: "NO LDF", tecnico: "", revisorEstruc: "", ldf: "2026-06-16", ldfReal: "", tipoLicencia: "CONSTRUCCION", solicitante: "MARIA JOSEFA TREJOS ALZATE", direccion: "CL 30 BIS # 11-08", estrategico: false },
  { radicado: "260170", fechaRad: "2026-05-07", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-06-17", ldfReal: "2026-05-11", tipoLicencia: "CONSTRUCCION", solicitante: "MARISABEL  TORRES ORTIZ", direccion: "CONDOMINIO CONDINA LAS BRISAS MONTE LARGO", estrategico: false },
  { radicado: "260171", fechaRad: "2026-05-07", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-06-17", ldfReal: "2026-05-12", tipoLicencia: "CONSTRUCCION", solicitante: "JOSE ALDEMAR CARDONA LONDOÑO", direccion: "MZ D LT 5 ATENAS", estrategico: false },
  { radicado: "260172", fechaRad: "2026-05-08", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-06-18", ldfReal: "2026-05-08", tipoLicencia: "CONSTRUCCION", solicitante: "SEBASTIAN  ROBLEDO LOAIZA", direccion: "ENTRADA 4 VIA CERRITOS LA VIRGINIA LT 5 CONDOMINIO SAMAY PH", estrategico: false },
  { radicado: "260173", fechaRad: "2026-05-08", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-06-18", ldfReal: "2026-05-08", tipoLicencia: "CONSTRUCCION", solicitante: "INVERSIONES EN INMUEBLES AC SAS", direccion: "LT INTERIOR B3 SC PARAJE LA LORENA ZONA FRANCA INTERNACIONAL", estrategico: false },
  { radicado: "260174", fechaRad: "2026-05-08", estado: "NO LDF", tecnico: "", revisorEstruc: "", ldf: "2026-06-18", ldfReal: "", tipoLicencia: "CONSTRUCCION", solicitante: "MARTHA LUCIA FRANCO ARANGO", direccion: "MZ 12 LT 14 SAMARIA 2", estrategico: false },
  { radicado: "OA-260269", fechaRad: "2026-05-11", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-06-20", ldfReal: "", tipoLicencia: "AJUSTE DE COTAS", solicitante: "CONSUMER ELECTRONICS GROUP SAS", direccion: "LT 4 AL 8 BODEGAS PENTAGRAMA CERRITOS", estrategico: false },
  { radicado: "260175", fechaRad: "2026-05-12", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-06-22", ldfReal: "2026-05-12", tipoLicencia: "CONSTRUCCION", solicitante: "JUAN DAVID OSORIO QUINTERO", direccion: "CL 78 # 29-15 MZ 21A  CS 2 LENINGRADO 2", estrategico: false },
  { radicado: "260176", fechaRad: "2026-05-12", estado: "NO LDF", tecnico: "", revisorEstruc: "", ldf: "2026-06-22", ldfReal: "", tipoLicencia: "CONSTRUCCION", solicitante: "DIANA PATRICIA CIRO HIGUITA", direccion: "CM BRISAS DE CONDINA P.H. VARIANTE CONDINA ENTRADA VEREDA MO", estrategico: false },
  { radicado: "260177", fechaRad: "2026-05-12", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-06-22", ldfReal: "2026-05-15", tipoLicencia: "CONSTRUCCION", solicitante: "ALVARO DE JESUS DOMINGUEZ MORALES", direccion: "CR 22 # 30-77 MZ C CS 14 POBLADO I", estrategico: false },
  { radicado: "260178", fechaRad: "2026-05-12", estado: "NO LDF", tecnico: "", revisorEstruc: "", ldf: "2026-06-22", ldfReal: "", tipoLicencia: "CONSTRUCCION", solicitante: "ESNARDO ANDRES MARQUEZ BOTERO", direccion: "CR 9 #25-50/52", estrategico: false },
  { radicado: "260179", fechaRad: "2026-05-13", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-06-23", ldfReal: "2026-05-13", tipoLicencia: "CONSTRUCCION", solicitante: "GLORIA LUCIA LOPERA CHAVES", direccion: "VEREDA SAN FERNANDO LT 1 Y 2", estrategico: false },
  { radicado: "260180", fechaRad: "2026-05-13", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-06-23", ldfReal: "2026-05-13", tipoLicencia: "CONSTRUCCION", solicitante: "ICONIKA CONSTRUCTORA SAS", direccion: "LT 47 COND.HACIENDA MALABAR RINCON DEL MONTE ENTRADA 6 CERRI", estrategico: false },
  { radicado: "260181", fechaRad: "2026-05-14", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-06-24", ldfReal: "2026-05-14", tipoLicencia: "CONSTRUCCION", solicitante: "LEIBY YURANY ALVAREZ ORTIZ", direccion: "MZ L LT 2 PARAJE CONSOTA HAMBURGO", estrategico: false },
  { radicado: "260182", fechaRad: "2026-05-15", estado: "NO LDF", tecnico: "", revisorEstruc: "", ldf: "2026-06-25", ldfReal: "", tipoLicencia: "CONSTRUCCION", solicitante: "ALBA LUCIA HERMOSA NUÑEZ", direccion: "SC PARAJE ALEGRIAS LT DE TERRENO LA GLORIA", estrategico: false },
  { radicado: "260183", fechaRad: "2026-05-15", estado: "NO LDF", tecnico: "", revisorEstruc: "", ldf: "2026-06-25", ldfReal: "", tipoLicencia: "CONSTRUCCION", solicitante: "ROGELIO ARIAS LOPEZ", direccion: "CL 23A # 20-61P LT 100 LOS COTEROS", estrategico: false },
  { radicado: "260184", fechaRad: "2026-05-15", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-06-25", ldfReal: "2026-05-15", tipoLicencia: "CONSTRUCCION", solicitante: "SUMINFINITECH SAS", direccion: "MZ 8 LT 1 PORTAL DE SAN JOAQUIN", estrategico: false },
  { radicado: "260186", fechaRad: "2026-05-15", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-06-25", ldfReal: "2026-05-15", tipoLicencia: "CONSTRUCCION", solicitante: "MARIA ALEYDA BARRERA DE PARRA", direccion: "MZ 23 CS 9 CL 34 # 1B-36 URBANIZACION OTUN", estrategico: false },
  { radicado: "260187", fechaRad: "2026-05-19", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-06-29", ldfReal: "2026-05-29", tipoLicencia: "SUBDIVISION", solicitante: "HOLDING GROUP JRC & CIA SCA", direccion: "LT LUISITANIA VRDA COMBIA", estrategico: false },
  { radicado: "260188", fechaRad: "2026-05-19", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-06-29", ldfReal: "2026-05-19", tipoLicencia: "CONSTRUCCION", solicitante: "SEGUNDO DARIO QUITIAN ARIZA", direccion: "MZ 2 LT 2 ALTAGRACIA", estrategico: false },
  { radicado: "260189", fechaRad: "2026-05-20", estado: "NO LDF", tecnico: "", revisorEstruc: "", ldf: "2026-06-30", ldfReal: "", tipoLicencia: "CONSTRUCCION", solicitante: "JOSE HERIBERTO ESTRADA GARCIA", direccion: "MZ 1 LT 22 PLAN DE VIVIENDA LOS PARAISOS", estrategico: false },
  { radicado: "260190", fechaRad: "2026-05-20", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-06-30", ldfReal: "2026-05-20", tipoLicencia: "CONSTRUCCION", solicitante: "CLAUDIA LORENA COLORADO BECERRA", direccion: "CR 6 # 19 Y 17# 19-58/62 OLAYA HERRERA", estrategico: false },
  { radicado: "260191", fechaRad: "2026-05-20", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-06-30", ldfReal: "2026-05-25", tipoLicencia: "CONSTRUCCION", solicitante: "ANA CRISTINA MUÑOZ GIRALDO", direccion: "CM CAMPESTRE LA GRANJA LT 10  TRIBUNAS", estrategico: false },
  { radicado: "260192", fechaRad: "2026-05-20", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-06-30", ldfReal: "2026-05-26", tipoLicencia: "CONSTRUCCION", solicitante: "HUMBERTO  CANDAMIL CARDONA", direccion: "CR 12 #4-76/84 CL 5 #11-79 COROCITO", estrategico: false },
  { radicado: "260193", fechaRad: "2026-05-21", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-07-01", ldfReal: "2026-06-05", tipoLicencia: "CONSTRUCCION", solicitante: "RICARDO ELIAS BUITRAGO GOMEZ", direccion: "MZ F LT 9 PARAJE DE CONSOTA HAMBURGO", estrategico: false },
  { radicado: "260194", fechaRad: "2026-05-22", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-07-02", ldfReal: "2026-05-22", tipoLicencia: "CONSTRUCCION", solicitante: "LILIANA MARIA PEREZ PALACIO", direccion: "CR 31 # 15-02 SAN LUIS", estrategico: false },
  { radicado: "260195", fechaRad: "2026-05-22", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-07-02", ldfReal: "2026-05-22", tipoLicencia: "CONSTRUCCION", solicitante: "A. BOTERO Y COMPANIA SOCIEDAD EN COMANDITA POR ACCIONES", direccion: "CR 17 Y 18 CON CL 86 LT 4 VILLA OLIMPICA", estrategico: false },
  { radicado: "OA-260289", fechaRad: "2026-05-22", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-07-02", ldfReal: "", tipoLicencia: "MOVIMIENTO DE TIERRAS", solicitante: "ARTICA DISEÑOS SAS", direccion: "LT G SC MONTEVERDE PINARES", estrategico: false },
  { radicado: "260196", fechaRad: "2026-05-25", estado: "NO LDF", tecnico: "", revisorEstruc: "", ldf: "2026-07-04", ldfReal: "", tipoLicencia: "CONSTRUCCION", solicitante: "AMC INGENIERIA Y SOLUCIONES SAS", direccion: "CL AV ESQ DE LA CR 16 # 4B-58 AVD CIRCUNVALAR", estrategico: false },
  { radicado: "260197", fechaRad: "2026-05-25", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-07-04", ldfReal: "2026-05-25", tipoLicencia: "SUBDIVISION", solicitante: "BUSTOS VILLEGAS SAS", direccion: "ZONA PRIVADA ZP 01-3 MERCASA", estrategico: false },
  { radicado: "260198", fechaRad: "2026-05-26", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-07-06", ldfReal: "2026-06-01", tipoLicencia: "CONSTRUCCION", solicitante: "PROMOTORA Y CONSTRUCTORA BUEN VIVIR SAS", direccion: "LT 86 COND.ANDAHUAYLAS", estrategico: false },
  { radicado: "260199", fechaRad: "2026-05-26", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-07-06", ldfReal: "2026-06-01", tipoLicencia: "CONSTRUCCION", solicitante: "PROMOTORA Y CONSTRUCTORA BUEN VIVIR SAS", direccion: "LT 24 CONDOMINIO BRISAS DE CONDINA VARIANTE CONDINA", estrategico: false },
  { radicado: "260200", fechaRad: "2026-05-26", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-07-06", ldfReal: "2026-06-01", tipoLicencia: "CONSTRUCCION", solicitante: "PROMOTORA Y CONSTRUCTORA BUEN VIVIR SAS", direccion: "LT 22 COND.ANDAHUAYLAS", estrategico: false },
  { radicado: "260201", fechaRad: "2026-05-26", estado: "NO LDF", tecnico: "", revisorEstruc: "", ldf: "2026-07-06", ldfReal: "", tipoLicencia: "CONSTRUCCION", solicitante: "MODESTO ANTONIO VINASCO HENAO", direccion: "CL 20BIS # 20-18 PROVIDENCIA", estrategico: false },
  { radicado: "260202", fechaRad: "2026-05-26", estado: "NO LDF", tecnico: "", revisorEstruc: "", ldf: "2026-07-06", ldfReal: "", tipoLicencia: "CONSTRUCCION", solicitante: "GLORIA ESTELLA PATIÑO ALCARAZ", direccion: "CL 67 # 25-64 CUBA", estrategico: false },
  { radicado: "260203", fechaRad: "2026-05-27", estado: "NO LDF", tecnico: "", revisorEstruc: "", ldf: "2026-07-07", ldfReal: "", tipoLicencia: "CONSTRUCCION", solicitante: "CRISTIAN EDUARDO BLANDON MUÑOZ", direccion: "LT 19A SC ECOFINCAS EL CORTIJO CERRITOS", estrategico: false },
  { radicado: "260204", fechaRad: "2026-05-27", estado: "NO LDF", tecnico: "", revisorEstruc: "", ldf: "2026-07-07", ldfReal: "", tipoLicencia: "CONSTRUCCION", solicitante: "GOMEGO SA", direccion: "LT 2C2 -1 MALABAR CERRITOS", estrategico: false },
  { radicado: "260205", fechaRad: "2026-05-27", estado: "NO LDF", tecnico: "", revisorEstruc: "", ldf: "2026-07-07", ldfReal: "", tipoLicencia: "SUBDIVISION", solicitante: "KEVIN MEJIA GARCIA", direccion: "LT B LAS BRISAS ALTAGRACIA", estrategico: false },
  { radicado: "260206", fechaRad: "2026-05-28", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-07-08", ldfReal: "2026-06-04", tipoLicencia: "CONSTRUCCION", solicitante: "CHARITO KATHERINE RAMIREZ CANO", direccion: "MZ 11 LT 219 SAN MARCOS CUBA", estrategico: false },
  { radicado: "260207", fechaRad: "2026-05-28", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-07-08", ldfReal: "2026-06-04", tipoLicencia: "CONSTRUCCION", solicitante: "CHARITO KATHERINE RAMIREZ CANO", direccion: "MZ 11 LT 220 SAN MARCOS CUBA", estrategico: false },
  { radicado: "260208", fechaRad: "2026-05-28", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-07-08", ldfReal: "2026-06-04", tipoLicencia: "CONSTRUCCION", solicitante: "CHARITO KATHERINE RAMIREZ CANO", direccion: "MZ 11 LT 221 SAN MARCOS CUBA", estrategico: false },
  { radicado: "260209", fechaRad: "2026-05-28", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-07-08", ldfReal: "2026-06-04", tipoLicencia: "CONSTRUCCION", solicitante: "CHARITO KATHERINE RAMIREZ CANO", direccion: "MZ 11 LT 222 SAN MARCOS CUBA", estrategico: false },
  { radicado: "260210", fechaRad: "2026-05-28", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-07-08", ldfReal: "2026-05-28", tipoLicencia: "CONSTRUCCION", solicitante: "SILVIA ZULEYMA MOSQUERA MOSQUERA", direccion: "MZ 9 LT 11 SC E CR 37C # 72-52 LA ACUARELA", estrategico: false },
  { radicado: "260211", fechaRad: "2026-05-29", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-07-09", ldfReal: "2026-06-01", tipoLicencia: "CONSTRUCCION", solicitante: "UNIVERSIDAD CATOLICA DE PEREIRA", direccion: "AV LAS AMERICAS NO 49 95", estrategico: false },
  { radicado: "260212", fechaRad: "2026-05-29", estado: "NO LDF", tecnico: "", revisorEstruc: "", ldf: "2026-07-09", ldfReal: "", tipoLicencia: "CONSTRUCCION", solicitante: "CLEMENCIA FILOMENA RAMIREZ CORREA", direccion: "LT 107 BELLA SARDI PARAJE LA LINDA CL 69 # 49-17", estrategico: false },
  { radicado: "260213", fechaRad: "2026-06-01", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-07-11", ldfReal: "2026-06-01", tipoLicencia: "CONSTRUCCION", solicitante: "MARTHA FABIOLA ECHEVERRY FRANCO", direccion: "MZ 6 LT 19 CL 61C # 1A-03 MALAGA SC LLANO GRANDE", estrategico: false },
  { radicado: "260214", fechaRad: "2026-06-01", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-07-11", ldfReal: "2026-06-09", tipoLicencia: "CONSTRUCCION", solicitante: "TULIO FERNANDO REYES NUÑEZ", direccion: "LT 3 VEREDA CONDINA", estrategico: false },
  { radicado: "260215", fechaRad: "2026-06-01", estado: "NO LDF", tecnico: "", revisorEstruc: "", ldf: "2026-07-11", ldfReal: "", tipoLicencia: "CONSTRUCCION", solicitante: "SANDRA MILENA PARRA GIL", direccion: "LT 01LIBARE BARRIO VILLA SANTANA", estrategico: false },
  { radicado: "260216", fechaRad: "2026-06-02", estado: "NO LDF", tecnico: "", revisorEstruc: "", ldf: "2026-07-13", ldfReal: "", tipoLicencia: "CONSTRUCCION", solicitante: "JAIRO ANDRES NIÑO PALENCIA", direccion: "MZ 2 LT 40 PERLA DEL SUR", estrategico: false },
  { radicado: "260217", fechaRad: "2026-06-02", estado: "NO LDF", tecnico: "", revisorEstruc: "", ldf: "2026-07-13", ldfReal: "", tipoLicencia: "RECONOCIMIENTO", solicitante: "AMILBIA DE JESUS USMA DE VANEGAS", direccion: "CL 42A # 2-05 LT 250 LAS PALMAS", estrategico: false },
  { radicado: "260218", fechaRad: "2026-06-02", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-07-13", ldfReal: "2026-06-02", tipoLicencia: "CONSTRUCCION", solicitante: "NINFA  RESTREPO", direccion: "MZ M CS 103 CACHIPAY", estrategico: false },
  { radicado: "260219", fechaRad: "2026-06-02", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-07-13", ldfReal: "2026-06-02", tipoLicencia: "CONSTRUCCION", solicitante: "ELIZABETH  CASTRO CARDENAS", direccion: "LT 9 EL POBLADO 2 MZ 38 K 26B 32 49 Mz 38 Cs 9", estrategico: false },
  { radicado: "260220", fechaRad: "2026-06-03", estado: "NO LDF", tecnico: "", revisorEstruc: "", ldf: "2026-07-14", ldfReal: "", tipoLicencia: "CONSTRUCCION", solicitante: "PAULA ANDREA MARTINEZ DE GRANT", direccion: "LT 3 SC CERRITOS", estrategico: false },
  { radicado: "260221", fechaRad: "2026-06-03", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-07-14", ldfReal: "2026-06-03", tipoLicencia: "CONSTRUCCION", solicitante: "GRUPO BURITICA SAS", direccion: "CR 11 # 39-38 EL JARDIN", estrategico: false },
  { radicado: "260222", fechaRad: "2026-06-03", estado: "NO LDF", tecnico: "", revisorEstruc: "", ldf: "2026-07-14", ldfReal: "", tipoLicencia: "CONSTRUCCION", solicitante: "LIBARDO  CORDON ASTROZ", direccion: "LT 2A-1B SC MALABAR VEREDA CERRITOS", estrategico: false },
  { radicado: "260223", fechaRad: "2026-06-03", estado: "NO LDF", tecnico: "", revisorEstruc: "", ldf: "2026-07-14", ldfReal: "", tipoLicencia: "CONSTRUCCION", solicitante: "MARIANA  RAMIREZ LADINO", direccion: "MZ 3 LT 4 VILLA MAGDALIA", estrategico: false },
  { radicado: "OA-260313", fechaRad: "2026-06-03", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-07-14", ldfReal: "", tipoLicencia: "REGLAMENTO PROPIEDAD HORIZONTAL", solicitante: "INVERSIONES Y ACTIVOS M Y M S.A.S", direccion: "LT 98 CONDINA", estrategico: false },
  { radicado: "260224", fechaRad: "2026-06-05", estado: "NO LDF", tecnico: "", revisorEstruc: "", ldf: "2026-07-16", ldfReal: "", tipoLicencia: "CONSTRUCCION", solicitante: "LEIDY JHOANA MONTOYA VILLA", direccion: "VR LIBARE VILLA SANTANA LT 15", estrategico: false },
  { radicado: "260225", fechaRad: "2026-06-05", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-07-16", ldfReal: "2026-06-05", tipoLicencia: "SUBDIVISION", solicitante: "CESAR AUGUSTO HERRERA OSSA", direccion: "LT VDA LA FLORIDA", estrategico: false },
  { radicado: "260226", fechaRad: "2026-06-05", estado: "NO LDF", tecnico: "", revisorEstruc: "", ldf: "2026-07-16", ldfReal: "", tipoLicencia: "SUBDIVISION", solicitante: "CONSTRUCTORA CIVICOL SAS", direccion: "CR 16C 97 LT 2 I BELMONTE", estrategico: false },
  { radicado: "OA-260320", fechaRad: "2026-06-05", estado: "REVISIÓN", tecnico: "", revisorEstruc: "", ldf: "2026-07-16", ldfReal: "", tipoLicencia: "REGLAMENTO PROPIEDAD HORIZONTAL", solicitante: "CONSTRUCTORA CIVICOL SAS", direccion: "CR 16C 97 LT 2 I BELMONTE", estrategico: false },
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

const fmtDate = (str) => {
  if (!str) return '—';
  const [y, m, d] = str.split('-');
  return `${d}/${m}/${y}`;
};
const COLORS = ['#3b82f6','#10b981','#f59e0b','#ef4444','#8b5cf6','#ec4899'];
const MONTH_MAP = { Ene:'01', Feb:'02', Mar:'03', Abr:'04', May:'05', Jun:'06', Jul:'07', Ago:'08', Sep:'09', Oct:'10', Nov:'11', Dic:'12' };

const STYLES = `
:root{--primary:#3b82f6;--success:#10b981;--danger:#ef4444;--warning:#f59e0b;--dark:#1f2937;--light:#f9fafb;--border:#e5e7eb;--muted:#6b7280;--gold:#d4b15f;}
*{box-sizing:border-box;}
body{margin:0;background:var(--light);color:var(--dark);font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto',sans-serif;}
.app{min-height:100vh;display:flex;flex-direction:column;}
.navbar{background:#fff;border-bottom:1px solid var(--border);padding:14px 24px;position:sticky;top:0;z-index:100;box-shadow:0 1px 3px rgba(0,0,0,.08);}
.navbar-content{max-width:1400px;margin:0 auto;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;}
.navbar-title{font-size:20px;font-weight:700;margin:0;}
.navbar-sub{font-size:12px;color:var(--muted);font-weight:500;}
.tabs{background:#fff;border-bottom:1px solid var(--border);padding:0 16px;display:flex;gap:2px;overflow-x:auto;max-width:1400px;margin:0 auto;width:100%;}
.tab{background:none;border:none;padding:14px 16px;cursor:pointer;font-size:13px;font-weight:600;color:var(--muted);border-bottom:3px solid transparent;white-space:nowrap;display:flex;align-items:center;gap:6px;transition:.2s;}
.tab:hover{color:var(--primary);} .tab.active{color:var(--primary);border-bottom-color:var(--primary);}
.content{max-width:1400px;margin:0 auto;padding:28px 20px;width:100%;}
h2.section-title{font-size:22px;margin:0 0 18px;}
p.section-desc{color:var(--muted);font-size:14px;margin:-12px 0 20px;}
.kpi-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:16px;margin-bottom:28px;}
.kpi-card{background:#fff;padding:22px;border-radius:12px;border:1px solid var(--border);text-align:center;box-shadow:0 1px 3px rgba(0,0,0,.05);transition:.2s;}
.kpi-card:hover{transform:translateY(-2px);box-shadow:0 6px 16px rgba(0,0,0,.08);}
.kpi-number{font-size:32px;font-weight:800;color:var(--primary);}
.kpi-label{font-size:12px;color:var(--muted);font-weight:600;margin-top:4px;text-transform:uppercase;letter-spacing:.5px;}
.charts-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(360px,1fr));gap:20px;margin-bottom:24px;}
.card{background:#fff;padding:22px;border-radius:12px;border:1px solid var(--border);box-shadow:0 1px 3px rgba(0,0,0,.05);}
.card h3{margin:0 0 16px;font-size:15px;}
.table-container{background:#fff;border-radius:12px;border:1px solid var(--border);overflow-x:auto;box-shadow:0 1px 3px rgba(0,0,0,.05);}
table{width:100%;border-collapse:collapse;} thead{background:var(--light);border-bottom:2px solid var(--border);}
th{padding:12px 14px;text-align:left;font-weight:700;font-size:12px;color:var(--muted);text-transform:uppercase;letter-spacing:.5px;}
tbody tr{border-bottom:1px solid var(--border);transition:.15s;} tbody tr:hover{background:#f9fafb;}
td{padding:11px 14px;font-size:13px;}
.rad-cell{font-weight:700;color:var(--primary);}
.badge{display:inline-block;padding:3px 11px;border-radius:20px;font-size:11px;font-weight:700;white-space:nowrap;}
.b-APROBADO{background:#d1fae5;color:#065f46;}
.b-NO-LDF{background:#fecaca;color:#991b1b;}
.b-DESISTIDO{background:#e5e7eb;color:#4b5563;}
.b-REVISIÓN{background:#dbeafe;color:#1e3a8a;}
.b-NEGADO{background:#fee2e2;color:#991b1b;}
.search-bar{display:flex;align-items:center;gap:8px;background:#fff;border:1px solid var(--border);border-radius:10px;padding:9px 14px;margin-bottom:16px;}
.search-bar input{border:none;outline:none;font-size:14px;width:100%;}
.filters{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:16px;align-items:center;}
.filters select{padding:8px 12px;border:1px solid var(--border);border-radius:8px;font-size:13px;background:#fff;}
.estrat-banner{background:linear-gradient(135deg,#fef3c7 0%,#fffbeb 100%);border:2px solid #fde68a;border-radius:12px;padding:20px;margin-bottom:20px;}
.estrat-title{font-size:15px;color:#92400e;font-weight:700;margin-bottom:8px;}
.proj-card{background:#fff;border-left:6px solid var(--primary);border-radius:10px;padding:16px;margin-bottom:14px;box-shadow:0 1px 3px rgba(0,0,0,.05);}
.proj-card.estrategico{background:linear-gradient(135deg,#fffbeb 0%,#fff 100%);border-left-color:var(--gold);}
.proj-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;flex-wrap:wrap;gap:8px;}
.proj-rad{font-weight:700;color:var(--primary);font-size:16px;}
.proj-rad.star{color:var(--gold);}
.proj-info{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:8px;margin-top:8px;}
.proj-meta{font-size:13px;color:var(--muted);}
.proj-meta strong{color:var(--dark);}
.empty-tec{color:#dc2626;font-style:italic;font-size:12px;}
`;
/* DASHBOARD */
function Dashboard({ projectsData }) {
  const total = projectsData.length;
  const aprobados = projectsData.filter(p => p.estado === 'APROBADO').length;
  const enRevision = projectsData.filter(p => p.estado === 'REVISIÓN').length;
  const noLdf = projectsData.filter(p => p.estado === 'NO LDF').length;
  const desistidos = projectsData.filter(p => p.estado === 'DESISTIDO').length;
  const estrategicos = projectsData.filter(p => p.estrategico).length;
  const sinAsignar = projectsData.filter(p => !p.tecnico).length;
  const pctAprob = total > 0 ? ((aprobados / total) * 100).toFixed(1) : 0;

  const meses = ['Ene','Feb','Mar','Abr','May','Jun'];
  const monthlyData = meses.map(m => ({
    month: m,
    cantidad: projectsData.filter(p => p.fechaRad && p.fechaRad.includes(`-${MONTH_MAP[m]}-`)).length
  }));

  const statusCounts = {};
  projectsData.forEach(p => { statusCounts[p.estado] = (statusCounts[p.estado] || 0) + 1; });
  const statusData = Object.entries(statusCounts).map(([name, value]) => ({ name, value })).sort((a,b)=>b.value-a.value);

  const tipoCounts = {};
  projectsData.forEach(p => { tipoCounts[p.tipoLicencia] = (tipoCounts[p.tipoLicencia] || 0) + 1; });
  const tipoData = Object.entries(tipoCounts).map(([name, value]) => ({ name, value })).sort((a,b)=>b.value-a.value);

  return (
    <div>
      <div className="kpi-grid">
        <div className="kpi-card"><div className="kpi-number">{total}</div><div className="kpi-label">Total Radicados 2026</div></div>
        <div className="kpi-card"><div className="kpi-number" style={{color:'var(--gold)'}}>{estrategicos}</div><div className="kpi-label">⭐ Estratégicos</div></div>
        <div className="kpi-card"><div className="kpi-number" style={{color:'var(--success)'}}>{aprobados}</div><div className="kpi-label">Aprobados</div></div>
        <div className="kpi-card"><div className="kpi-number">{enRevision}</div><div className="kpi-label">En Revisión</div></div>
        <div className="kpi-card"><div className="kpi-number" style={{color:'var(--danger)'}}>{noLdf}</div><div className="kpi-label">Sin LDF</div></div>
        <div className="kpi-card"><div className="kpi-number">{pctAprob}%</div><div className="kpi-label">% Aprobación</div></div>
      </div>

      {sinAsignar > 0 && (
        <div className="estrat-banner" style={{background:'linear-gradient(135deg,#fee2e2 0%,#fef2f2 100%)',borderColor:'#fecaca'}}>
          <div className="estrat-title" style={{color:'#991b1b'}}>⚠️ {sinAsignar} proyectos sin técnico asignado</div>
          <div style={{fontSize:13,color:'#7f1d1d'}}>Cuando el equipo empiece a llenar el campo "Revisor" en el Excel, automáticamente se reflejará aquí.</div>
        </div>
      )}

      <div className="charts-grid">
        <div className="card">
          <h3>📅 Proyectos por Mes</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" /><YAxis allowDecimals={false} /><Tooltip />
              <Bar dataKey="cantidad" fill="#3b82f6" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <h3>📊 Distribución por Estado</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" labelLine={false} label={({name,value})=>`${name}: ${value}`} outerRadius={90} dataKey="value">
                {statusData.map((e,i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <h3>🏗️ Tipos de Proyecto (Actuaciones)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={tipoData} layout="vertical" margin={{left: 50}}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" /><YAxis type="category" dataKey="name" width={180} fontSize={12} /><Tooltip />
            <Bar dataKey="value" fill="#10b981" radius={[0,6,6,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/* LISTADO DE PROYECTOS */
function Proyectos({ projectsData }) {
  const [query, setQuery] = useState('');
  const [estadoF, setEstadoF] = useState('TODOS');
  const [tipoF, setTipoF] = useState('TODOS');
  const [soloEst, setSoloEst] = useState(false);

  const estados = ['TODOS', ...Array.from(new Set(projectsData.map(p => p.estado)))];
  const tipos = ['TODOS', ...Array.from(new Set(projectsData.map(p => p.tipoLicencia)))];

  const filtered = projectsData.filter(p => {
    const q = query.toLowerCase();
    const matchQ = !q || p.radicado.toLowerCase().includes(q) ||
      (p.solicitante && p.solicitante.toLowerCase().includes(q)) ||
      (p.direccion && p.direccion.toLowerCase().includes(q));
    return matchQ && (estadoF === 'TODOS' || p.estado === estadoF) && (tipoF === 'TODOS' || p.tipoLicencia === tipoF) && (!soloEst || p.estrategico);
  });

  return (
    <div>
      <h2 className="section-title">📋 Listado de Proyectos ({filtered.length})</h2>
      <p className="section-desc">Todos los proyectos radicados en 2026. Usa los filtros para encontrar lo que buscas.</p>

      <div className="search-bar">
        <Search size={18} color="#6b7280" />
        <input placeholder="Buscar por radicado, solicitante o dirección..." value={query} onChange={e => setQuery(e.target.value)} />
      </div>
      <div className="filters">
        <select value={estadoF} onChange={e => setEstadoF(e.target.value)}>
          {estados.map(e => <option key={e} value={e}>{e === 'TODOS' ? 'Todos los estados' : e}</option>)}
        </select>
        <select value={tipoF} onChange={e => setTipoF(e.target.value)}>
          {tipos.map(t => <option key={t} value={t}>{t === 'TODOS' ? 'Todos los tipos' : t}</option>)}
        </select>
        <label style={{display:'flex',alignItems:'center',gap:6,cursor:'pointer',fontSize:13,fontWeight:600}}>
          <input type="checkbox" checked={soloEst} onChange={e => setSoloEst(e.target.checked)} /> ⭐ Solo Estratégicos
        </label>
      </div>

      <div className="table-container">
        <table>
          <thead><tr><th></th><th>Radicado</th><th>Fecha</th><th>Estado</th><th>Tipo</th><th>Solicitante</th><th>Técnico</th><th>LDF</th></tr></thead>
          <tbody>
            {filtered.map((p, i) => (
              <tr key={i} style={p.estrategico ? {background:'#fffbeb'} : {}}>
                <td style={{textAlign:'center',width:30}}>{p.estrategico && '⭐'}</td>
                <td className="rad-cell">{p.radicado}</td>
                <td>{fmtDate(p.fechaRad)}</td>
                <td><span className={`badge b-${p.estado.replace(/\s/g, '-')}`}>{p.estado}</span></td>
                <td style={{fontSize:12}}>{p.tipoLicencia}</td>
                <td style={{fontSize:12,maxWidth:200,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}} title={p.solicitante}>{p.solicitante}</td>
                <td>{p.tecnico || <span className="empty-tec">Sin asignar</span>}</td>
                <td>{fmtDate(p.ldf)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* PROYECTOS ESTRATÉGICOS */
function ProyectosEstrategicos({ projectsData }) {
  const estrategicos = projectsData.filter(p => p.estrategico);
  const total = estrategicos.length;
  const aprobados = estrategicos.filter(p => p.estado === 'APROBADO').length;
  const enRevision = estrategicos.filter(p => p.estado === 'REVISIÓN').length;
  const desistidos = estrategicos.filter(p => p.estado === 'DESISTIDO').length;
  const noLdf = estrategicos.filter(p => p.estado === 'NO LDF').length;

  return (
    <div>
      <h2 className="section-title">⭐ Proyectos Estratégicos</h2>
      <p className="section-desc">Proyectos prioritarios identificados por la curaduría (mayor ingreso, constructoras importantes).</p>

      <div className="estrat-banner">
        <div className="estrat-title">⭐ Resumen de Estratégicos</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(120px,1fr))',gap:12,marginTop:12}}>
          <div><strong style={{fontSize:28,color:'var(--gold)'}}>{total}</strong><div style={{fontSize:12,color:'#92400e'}}>Total</div></div>
          <div><strong style={{fontSize:28,color:'var(--success)'}}>{aprobados}</strong><div style={{fontSize:12,color:'#92400e'}}>Aprobados</div></div>
          <div><strong style={{fontSize:28,color:'var(--primary)'}}>{enRevision}</strong><div style={{fontSize:12,color:'#92400e'}}>En Revisión</div></div>
          <div><strong style={{fontSize:28,color:'var(--danger)'}}>{noLdf}</strong><div style={{fontSize:12,color:'#92400e'}}>Sin LDF</div></div>
          <div><strong style={{fontSize:28,color:'#6b7280'}}>{desistidos}</strong><div style={{fontSize:12,color:'#92400e'}}>Desistidos</div></div>
        </div>
      </div>

      <h3 style={{fontSize:16,marginTop:24,marginBottom:14}}>Detalle de los {total} Proyectos Estratégicos</h3>
      <div>
        {estrategicos.map((p, i) => (
          <div key={i} className="proj-card estrategico">
            <div className="proj-header">
              <div>
                <div className="proj-rad star">⭐ {p.radicado}</div>
                <div style={{fontSize:14,fontWeight:600,marginTop:4}}>{p.tipoLicencia}</div>
              </div>
              <span className={`badge b-${p.estado.replace(/\s/g, '-')}`}>{p.estado}</span>
            </div>
            <div className="proj-info">
              <div className="proj-meta">👤 <strong>Solicitante:</strong> {p.solicitante}</div>
              <div className="proj-meta">📍 <strong>Dirección:</strong> {p.direccion}</div>
              <div className="proj-meta">📅 <strong>Radicado:</strong> {fmtDate(p.fechaRad)}</div>
              <div className="proj-meta">⏰ <strong>LDF:</strong> {fmtDate(p.ldf)}</div>
              <div className="proj-meta">👷 <strong>Técnico:</strong> {p.tecnico || <span className="empty-tec">Sin asignar</span>}</div>
              <div className="proj-meta">🏗️ <strong>Revisor:</strong> {p.revisorEstruc || <span className="empty-tec">Sin asignar</span>}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* CURADOR */
function Curador({ projectsData }) {
  const total = projectsData.length;
  const aprobados = projectsData.filter(p => p.estado === 'APROBADO').length;
  const enTramite = total - aprobados;
  const pctAprob = total > 0 ? ((aprobados / total) * 100).toFixed(0) : 0;
  const estrategicos = projectsData.filter(p => p.estrategico);
  const estTotal = estrategicos.length;
  const estApr = estrategicos.filter(p => p.estado === 'APROBADO').length;

  return (
    <div>
      <h2 className="section-title">🏆 Vista del Curador</h2>
      <p className="section-desc">Panel ejecutivo para {CURADOR}, Curador Urbano N.° 2 de Pereira.</p>

      <div className="kpi-grid">
        <div className="kpi-card"><div className="kpi-number">{total}</div><div className="kpi-label">Total Radicados</div></div>
        <div className="kpi-card"><div className="kpi-number" style={{color:'var(--gold)'}}>{estTotal}</div><div className="kpi-label">⭐ Estratégicos</div></div>
        <div className="kpi-card"><div className="kpi-number" style={{color:'var(--success)'}}>{aprobados}</div><div className="kpi-label">Aprobados</div></div>
        <div className="kpi-card"><div className="kpi-number" style={{color:'var(--warning)'}}>{enTramite}</div><div className="kpi-label">En Trámite</div></div>
        <div className="kpi-card"><div className="kpi-number" style={{color:'#8b5cf6'}}>{pctAprob}%</div><div className="kpi-label">Tasa Aprob.</div></div>
      </div>

      {estTotal > 0 && (
        <div className="estrat-banner">
          <div className="estrat-title">⭐ Estado de Proyectos Estratégicos</div>
          <div style={{marginTop:8,fontSize:14}}>De los <strong>{estTotal}</strong> proyectos estratégicos, <strong style={{color:'var(--success)'}}>{estApr} están aprobados</strong> ({estTotal > 0 ? Math.round((estApr/estTotal)*100) : 0}% de tasa de aprobación).</div>
        </div>
      )}

      <div className="card" style={{marginTop:20}}>
        <h3>⭐ Detalle de Proyectos Estratégicos ({estTotal})</h3>
        <div className="table-container" style={{border:'none',boxShadow:'none'}}>
          <table>
            <thead><tr><th>Radicado</th><th>Estado</th><th>Tipo</th><th>Solicitante</th><th>Fecha LDF</th></tr></thead>
            <tbody>
              {estrategicos.map(p => (
                <tr key={p.radicado} style={{background:'#fffbeb'}}>
                  <td className="rad-cell">⭐ {p.radicado}</td>
                  <td><span className={`badge b-${p.estado.replace(/\s/g, '-')}`}>{p.estado}</span></td>
                  <td style={{fontSize:12}}>{p.tipoLicencia}</td>
                  <td style={{fontSize:12,maxWidth:250,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}} title={p.solicitante}>{p.solicitante}</td>
                  <td>{fmtDate(p.ldf)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* APP PRINCIPAL */
const TABS = [
  { id:'dashboard', label:'Dashboard', icon:<LayoutDashboard size={16}/> },
  { id:'proyectos', label:'Proyectos', icon:<ListChecks size={16}/> },
  { id:'estrategicos', label:'Estratégicos', icon:<Star size={16}/> },
  { id:'curador', label:'Curador', icon:<FileText size={16}/> },
];

function App() {
  const [tab, setTab] = useState('dashboard');

  return (
    <div className="app">
      <style>{STYLES}</style>
      <nav className="navbar">
        <div className="navbar-content">
          <div>
            <div className="navbar-title">📊 Curaduría Urbana N.° 2 — Pereira</div>
            <div className="navbar-sub">Proyectos Estratégicos 2026 · {projectsDataFull.length} radicados</div>
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
        {tab === 'dashboard' && <Dashboard projectsData={projectsDataFull} />}
        {tab === 'proyectos' && <Proyectos projectsData={projectsDataFull} />}
        {tab === 'estrategicos' && <ProyectosEstrategicos projectsData={projectsDataFull} />}
        {tab === 'curador' && <Curador projectsData={projectsDataFull} />}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
