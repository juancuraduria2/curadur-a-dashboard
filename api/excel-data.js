import jwt from 'jsonwebtoken';

// ============================================
// VERIFICACIÓN DE TOKEN
// ============================================

function verificarToken(req) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;

  if (!token) {
    return { ok: false, status: 401, error: 'Token no proporcionado' };
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return { ok: false, status: 500, error: 'Error de configuración del servidor' };
  }

  try {
    const decoded = jwt.verify(token, secret);
    return { ok: true, usuario: decoded };
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return { ok: false, status: 401, error: 'Sesión expirada', reason: 'expired' };
    }
    return { ok: false, status: 401, error: 'Token inválido', reason: 'invalid' };
  }
}

// ============================================
// DETECCIÓN AUTOMÁTICA DE COLUMNAS
// ============================================
// El código lee la fila 1 del Excel y ubica cada columna por su nombre.
// Si alguien agrega o mueve columnas, el dashboard sigue funcionando.
// "fallback" es la posición confirmada (A=0, B=1...) por si no encuentra el nombre.

const CAMPOS = {
  // Datos generales (columnas fijas)
  radicado:               { fallback: 0 },   // A
  fechaRadicacion:        { fallback: 1 },   // B
  maximaLegal:            { incluye: ['MAXIMA LEGAL'], fallback: 5 },    // F
  fechaLegal:             { incluye: ['FECHA DE LEGAL'], fallback: 7 },  // H
  estadoActual:           { incluye: ['ESTADO ACTUAL'], fallback: 14 },  // O
  estrategicoExcel:       { incluye: ['PROYECTO ESTRATEG'], fallback: 18 }, // S

  // Arquitectura
  nombreArquitecto:       { incluye: ['NOMBRE PROFESIONAL', 'ARQUITECTURA'], fallback: 23 },            // X
  fechaAsignacionArq:     { incluye: ['ASIGNACION', 'ARQUITECTONICA'], excluye: ['ACTA'], fallback: 24 }, // Y
  fechaPrimeraRevArq:     { incluye: ['PRIMERA', 'ARQUITECTONICA'], fallback: 25 },                     // Z
  fechaAsigArqActa:       { incluye: ['ASIGNACION', 'ARQUITECTONICA', 'ACTA'], fallback: 26 },          // AA
  fechaSegundaRevArq:     { incluye: ['SEGUNDA', 'ARQUITECTONICA'], fallback: 27 },                     // AB
  fechaTerceraRevArq:     { incluye: ['TERCERA', 'ARQUITECTONICA'], fallback: 28 },                     // AC
  fechaRevFinalArq:       { incluye: ['REVISION FINAL', 'ARQUITECTURA'], fallback: 29 },                // AD
  numRevisionesArq:       { incluye: ['NUMERO DE REVISIONES'], ocurrencia: 0, fallback: 30 },           // AE

  // Ingeniería / estructural
  nombreIngeniero:        { incluye: ['NOMBRE PROFESIONAL', 'INGENIERIA'], fallback: 32 },              // AG
  fechaIngresoIng:        { incluye: ['INGENIERIA', 'FECHA INGRESO'], fallback: 33 },                   // AH
  fechaPrimeraRevIng:     { incluye: ['PRIMERA', 'INGENIERIA'], fallback: 34 },                         // AI
  fechaAsigEstrActa:      { incluye: ['ASIGNACION', 'ESTRUCTURAL'], fallback: 35 },                     // AJ
  fechaSegundaRevEstr:    { incluye: ['SEGUNDA', 'ESTRUCTURAL'], fallback: 36 },                        // AK
  fechaTerceraRevEstr:    { incluye: ['TERCERA', 'ESTRUCTURAL'], fallback: 37 },                        // AL
  numRevisionesIng:       { incluye: ['NUMERO DE REVISIONES'], ocurrencia: 1, fallback: 40 },           // AO

  // Acta de observaciones
  actaObservaciones:      { incluye: ['ACTA', 'FECHA NOTIFICACION'], fallback: 43 },                    // AR
  actaFechaLimite:        { incluye: ['ACTA', 'FECHA LIMITE'], fallback: 44 },                          // AS
  actaSolicitudAmpliacion:{ incluye: ['ACTA', 'SOLICITUD AMPLIACION'], fallback: 45 },                  // AT
  actaFechaAmpliacion:    { incluye: ['ACTA', 'FECHA AMPLIACION'], fallback: 46 },                      // AU
  fechaRespuestaActa:     { incluye: ['ACTA', 'ENTREGA'], excluye: ['PERSISTENTES'], fallback: 47 },    // AV
  fechaPersistentes3:     { incluye: ['PERSISTENTES', 'TERCERA'], fallback: 48 },                       // AW
  fechaPersistentes4:     { incluye: ['PERSISTENTES', 'CUARTA'], fallback: 49 },                        // AX

  // Suspensión de términos (terremoto)
  suspensionSolicitud:    { incluye: ['SUSPENSION', 'FECHA SOLICITUD'], fallback: 50 },                 // AY
  suspensionLimite:       { incluye: ['SUSPENSION', 'FECHA LIMITE'], excluye: ['PANDEMIA'], fallback: 51 }, // AZ

  // Finalización y pagos
  fechaFinalizacion:      { incluye: ['FINALIZACION', 'FECHA FINALIZACION'], fallback: 52 },            // BA
  fechaLimitePago:        { incluye: ['FECHA LIMITE PAGO'], fallback: 54 },                             // BC
  fechaAportePagos:       { incluye: ['APORTE PAGOS'], fallback: 55 },                                  // BD

  // Licencia
  fechaLicencia:          { incluye: ['LICENCIA', 'EXPEDICION'], fallback: 63 }                         // BL (por confirmar)
};

const normalizar = (texto) => String(texto || '')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toUpperCase()
  .replace(/\s+/g, ' ')
  .trim();

const letraColumna = (indice) => {
  let n = indice + 1;
  let letra = '';
  while (n > 0) {
    const resto = (n - 1) % 26;
    letra = String.fromCharCode(65 + resto) + letra;
    n = Math.floor((n - 1) / 26);
  }
  return letra;
};

function detectarColumnas(encabezados) {
  const normalizados = encabezados.map(normalizar);
  const mapa = {};
  const noEncontradas = [];

  for (const [campo, def] of Object.entries(CAMPOS)) {
    if (!def.incluye) {
      mapa[campo] = def.fallback;
      continue;
    }
    const coincidencias = [];
    normalizados.forEach((h, i) => {
      if (!h) return;
      const cumpleIncluye = def.incluye.every(k => h.includes(k));
      const cumpleExcluye = !(def.excluye || []).some(k => h.includes(k));
      if (cumpleIncluye && cumpleExcluye) coincidencias.push(i);
    });
    const indice = coincidencias[def.ocurrencia || 0];
    if (indice !== undefined) {
      mapa[campo] = indice;
    } else {
      mapa[campo] = def.fallback;
      noEncontradas.push(campo);
    }
  }
  return { mapa, noEncontradas };
}

// ============================================
// ENDPOINT DE DATOS DEL EXCEL (protegido)
// ============================================

export default async (req, res) => {
  const auth = verificarToken(req);
  if (!auth.ok) {
    return res.status(auth.status).json({
      success: false,
      error: auth.error,
      reason: auth.reason
    });
  }

  try {
    // Token de Azure
    const tokenResponse = await fetch(
      `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/oauth2/v2.0/token`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: process.env.AZURE_CLIENT_ID,
          client_secret: process.env.AZURE_CLIENT_SECRET,
          scope: 'https://graph.microsoft.com/.default'
        }).toString()
      }
    );
    const tokenData = await tokenResponse.json();
    const token = tokenData.access_token;

    const siteResponse = await fetch(
      'https://graph.microsoft.com/v1.0/sites/curaduria2pereira.sharepoint.com:/sites/intranet',
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    const siteData = await siteResponse.json();

    const fileId = '01WQFWMZ5Z3Y7KPKOJ2ZD2M7NFHUUHWQW3';
    const baseUrl = `https://graph.microsoft.com/v1.0/sites/${siteData.id}/drive/items/${fileId}/workbook/worksheets('Seguimiento Proyectos')`;

    // 1. Leer encabezados (fila 1) para ubicar columnas por nombre
    const headersResponse = await fetch(
      `${baseUrl}/range(address='A1:CZ1')`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    const headersData = await headersResponse.json();
    const encabezados = (headersData.values && headersData.values[0]) || [];
    const { mapa, noEncontradas } = detectarColumnas(encabezados);

    // 2. Leer datos (rango amplio hasta CZ para cubrir columnas futuras)
    const rangeResponse = await fetch(
      `${baseUrl}/range(address='A4239:CZ6000')`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    const rangeData = await rangeResponse.json();
    const rows = rangeData.values || [];

    const valor = (row, campo) => {
      const v = row[mapa[campo]];
      return v === undefined || v === null ? '' : v;
    };

    const datos = [];
    for (const row of rows) {
      const proyecto = {};
      for (const campo of Object.keys(CAMPOS)) {
        proyecto[campo] = valor(row, campo);
      }
      if (proyecto.radicado && proyecto.radicado !== '') {
        datos.push(proyecto);
      }
    }

    // Diagnóstico: qué columna quedó asignada a cada campo
    const columnas = {};
    for (const [campo, indice] of Object.entries(mapa)) {
      columnas[campo] = letraColumna(indice);
    }

    res.status(200).json({
      success: true,
      total: datos.length,
      proyectos: datos,
      columnas,
      columnasNoEncontradas: noEncontradas,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
};
