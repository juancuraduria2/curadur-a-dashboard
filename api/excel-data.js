const https = require('https');

// Mapeo de columnas del Excel a sus índices
const COLUMN_MAP = {
  'RADICADO': 0,
  'FECHA RADICACIÓN': 1,
  'FECHA MÁXIMA LEGAL Y DEBIDA FORMA': 3,
  'FECHA DE LEGAL Y DEBIDA FORMA': 7,
  'ESTADO ACTUAL DEL PROYECTO': 14,
  'NOMBRE PROFESIONAL ARQUITECTURA': 22,
  'FECHA ASIGNACIÓN REVISIÓN ARQUITECTURA': 23,
  'FECHA PRIMERA REVISIÓN ARQUITECTÓNICA': 24,
  'NOMBRE PROFESIONAL INGENIERÍA': 27,
  'FECHA PRIMERA REVISIÓN INGENIERÍA': 29,
  'ACTA DE OBSERVACIONES FECHA NOTIFICACIÓN': 34,
  'FINALIZACIÓN DEL TRAMITE FECHA FINALIZACIÓN': 42,
  'LICENCIA / OTRAS ACTUACIONES FECHA EXPEDICIÓN': 52
};

async function getAccessToken() {
  return new Promise((resolve, reject) => {
    const postData = new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: process.env.AZURE_CLIENT_ID,
      client_secret: process.env.AZURE_CLIENT_SECRET,
      scope: 'https://graph.microsoft.com/.default'
    });

    const options = {
      hostname: 'login.microsoftonline.com',
      path: `/${process.env.AZURE_TENANT_ID}/oauth2/v2.0/token`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData.toString())
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json.access_token);
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(postData.toString());
    req.end();
  });
}

async function graphRequest(accessToken, path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'graph.microsoft.com',
      path: path,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

module.exports = async (req, res) => {
  try {
    const token = await getAccessToken();
    // Obtener el sitio de SharePoint
    const siteId = await graphRequest(
      token,
      '/v1.0/sites/curaduria2pereira.sharepoint.com:/sites/intranet'
    );

    if (!siteId.id) {
      throw new Error('No se encontró el sitio de SharePoint');
    }

    // Obtener la lista de "Archivos de Control"
    const driveId = await graphRequest(
      token,
      `/v1.0/sites/${siteId.id}/drive`
    );

    if (!driveId.id) {
      throw new Error('No se encontró la unidad de SharePoint');
    }

    // Buscar el archivo "Seguimiento Proyectos.xlsx"
    const searchResults = await graphRequest(
      token,
      `/v1.0/sites/${siteId.id}/drive/root/children?$filter=name eq 'Archivos de Control'`
    );

    let folderContent = await graphRequest(
      token,
      `/v1.0/sites/${siteId.id}/drive/root:/Archivos de Control:/children`
    );

    const excelFile = folderContent.value.find(f => f.name === 'Seguimiento Proyectos.xlsx');
    
    if (!excelFile) {
      throw new Error('No se encontró el archivo Seguimiento Proyectos.xlsx');
    }

    // Obtener el contenido del Excel
    const workbookContent = await graphRequest(
      token,
      `/v1.0/sites/${siteId.id}/drive/items/${excelFile.id}/workbook/worksheets('Seguimiento Proyectos')/usedRange?$select=values`
    );

    // Procesar los datos
    const rows = workbookContent.value;
    const datos = [];

    // Saltamos la fila de encabezados (fila 0)
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      
      const proyecto = {
        radicado: row[COLUMN_MAP['RADICADO']] || '',
        fechaRadicacion: row[COLUMN_MAP['FECHA RADICACIÓN']] || '',
        maximaLegal: row[COLUMN_MAP['FECHA MÁXIMA LEGAL Y DEBIDA FORMA']] || '',
        fechaLegal: row[COLUMN_MAP['FECHA DE LEGAL Y DEBIDA FORMA']] || '',
        estadoActual: row[COLUMN_MAP['ESTADO ACTUAL DEL PROYECTO']] || '',
        nombreArquitecto: row[COLUMN_MAP['NOMBRE PROFESIONAL ARQUITECTURA']] || '',
        fechaAsignacionArq: row[COLUMN_MAP['FECHA ASIGNACIÓN REVISIÓN ARQUITECTURA']] || '',
        fechaPrimeraRevArq: row[COLUMN_MAP['FECHA PRIMERA REVISIÓN ARQUITECTÓNICA']] || '',
        nombreIngeniero: row[COLUMN_MAP['NOMBRE PROFESIONAL INGENIERÍA']] || '',
        fechaPrimeraRevIng: row[COLUMN_MAP['FECHA PRIMERA REVISIÓN INGENIERÍA']] || '',
        actaObservaciones: row[COLUMN_MAP['ACTA DE OBSERVACIONES FECHA NOTIFICACIÓN']] || '',
        fechaFinalizacion: row[COLUMN_MAP['FINALIZACIÓN DEL TRAMITE FECHA FINALIZACIÓN']] || '',
        fechaLicencia: row[COLUMN_MAP['LICENCIA / OTRAS ACTUACIONES FECHA EXPEDICIÓN']] || ''
      };

      if (proyecto.radicado) {
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
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
};
