import jwt from 'jsonwebtoken';

// ============================================
// VERIFICACIÓN DE TOKEN (middleware inline)
// ============================================

function verificarToken(req) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.substring(7)
    : null;

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
// ENDPOINT DE DATOS DEL EXCEL (protegido)
// ============================================

export default async (req, res) => {
  // Verificar autenticación antes de cualquier otra cosa
  const auth = verificarToken(req);
  if (!auth.ok) {
    return res.status(auth.status).json({
      success: false,
      error: auth.error,
      reason: auth.reason
    });
  }

  try {
    // Obtener token de Azure
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

    // Leer rango amplio para cubrir crecimiento futuro (fila 4239 hasta 6000)
    const rangeResponse = await fetch(
      `https://graph.microsoft.com/v1.0/sites/${siteData.id}/drive/items/${fileId}/workbook/worksheets('Seguimiento Proyectos')/range(address='A4239:BA6000')`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    const rangeData = await rangeResponse.json();

    const rows = rangeData.values || [];

    // Índices actualizados con columna S (PROYECTO ESTRATEGICO) y AN (FECHA RESPUESTA ACTA)
    const COLUMN_MAP = {
      'RADICADO': 0,                                          // A
      'FECHA RADICACIÓN': 1,                                  // B
      'FECHA MÁXIMA LEGAL Y DEBIDA FORMA': 5,                // F
      'FECHA DE LEGAL Y DEBIDA FORMA': 7,                    // H
      'ESTADO ACTUAL DEL PROYECTO': 14,                      // O
      'PROYECTO ESTRATEGICO': 18,                            // S
      'NOMBRE PROFESIONAL ARQUITECTURA': 23,                 // X
      'FECHA ASIGNACIÓN REVISIÓN ARQUITECTURA': 24,          // Y
      'FECHA PRIMERA REVISIÓN ARQUITECTÓNICA': 25,           // Z
      'NOMBRE PROFESIONAL INGENIERÍA': 28,                   // AC
      'FECHA PRIMERA REVISIÓN INGENIERÍA': 30,               // AE
      'ACTA DE OBSERVACIONES FECHA NOTIFICACIÓN': 35,        // AJ
      'ACTA DE OBSERVACIONES FECHA ENTREGA': 39,             // AN (respuesta del cliente al acta)
      'FINALIZACIÓN DEL TRAMITE FECHA FINALIZACIÓN': 42,     // AQ
      'LICENCIA / OTRAS ACTUACIONES FECHA EXPEDICIÓN': 53    // BB
    };

    const datos = [];
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const proyecto = {
        radicado: row[COLUMN_MAP['RADICADO']] || '',
        fechaRadicacion: row[COLUMN_MAP['FECHA RADICACIÓN']] || '',
        maximaLegal: row[COLUMN_MAP['FECHA MÁXIMA LEGAL Y DEBIDA FORMA']] || '',
        fechaLegal: row[COLUMN_MAP['FECHA DE LEGAL Y DEBIDA FORMA']] || '',
        estadoActual: row[COLUMN_MAP['ESTADO ACTUAL DEL PROYECTO']] || '',
        estrategicoExcel: row[COLUMN_MAP['PROYECTO ESTRATEGICO']] || '',
        nombreArquitecto: row[COLUMN_MAP['NOMBRE PROFESIONAL ARQUITECTURA']] || '',
        fechaAsignacionArq: row[COLUMN_MAP['FECHA ASIGNACIÓN REVISIÓN ARQUITECTURA']] || '',
        fechaPrimeraRevArq: row[COLUMN_MAP['FECHA PRIMERA REVISIÓN ARQUITECTÓNICA']] || '',
        nombreIngeniero: row[COLUMN_MAP['NOMBRE PROFESIONAL INGENIERÍA']] || '',
        fechaPrimeraRevIng: row[COLUMN_MAP['FECHA PRIMERA REVISIÓN INGENIERÍA']] || '',
        actaObservaciones: row[COLUMN_MAP['ACTA DE OBSERVACIONES FECHA NOTIFICACIÓN']] || '',
        fechaRespuestaActa: row[COLUMN_MAP['ACTA DE OBSERVACIONES FECHA ENTREGA']] || '',
        fechaFinalizacion: row[COLUMN_MAP['FINALIZACIÓN DEL TRAMITE FECHA FINALIZACIÓN']] || '',
        fechaLicencia: row[COLUMN_MAP['LICENCIA / OTRAS ACTUACIONES FECHA EXPEDICIÓN']] || ''
      };

      if (proyecto.radicado && proyecto.radicado !== '') {
        datos.push(proyecto);
      }
    }

    res.status(200).json({
      success: true,
      total: datos.length,
      proyectos: datos,
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
