export default async (req, res) => {
  try {
    // Obtener token de acceso
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
    if (!tokenData.access_token) {
      throw new Error('No se pudo obtener token de Azure AD');
    }

    const token = tokenData.access_token;

    // Obtener el sitio
    const siteResponse = await fetch(
      'https://graph.microsoft.com/v1.0/sites/curaduria2pereira.sharepoint.com:/sites/intranet',
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    const siteData = await siteResponse.json();

    if (!siteData.id) {
      throw new Error('No se encontró el sitio SharePoint: ' + JSON.stringify(siteData));
    }

    // Obtener archivos en Archivos de Control
    const filesResponse = await fetch(
      `https://graph.microsoft.com/v1.0/sites/${siteData.id}/drive/root:/Archivos de Control:/children`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    const filesData = await filesResponse.json();

    const excelFile = filesData.value?.find(f => f.name === 'Seguimiento Proyectos.xlsx');
    if (!excelFile) {
      throw new Error('Archivo no encontrado en SharePoint');
    }

    // Obtener datos del Excel
    const workbookResponse = await fetch(
      `https://graph.microsoft.com/v1.0/sites/${siteData.id}/drive/items/${excelFile.id}/workbook/worksheets('Seguimiento Proyectos')/usedRange?$select=values`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    const workbookData = await workbookResponse.json();

    const rows = workbookData.value || [];

    const COLUMN_MAP = {
      'RADICADO': 0,
      'FECHA RADICACIÓN': 1,
      'FECHA MÁXIMA LEGAL Y DEBIDA FORMA': 5,
      'FECHA DE LEGAL Y DEBIDA FORMA': 7,
      'ESTADO ACTUAL DEL PROYECTO': 14,
      'NOMBRE PROFESIONAL ARQUITECTURA': 22,
      'FECHA ASIGNACIÓN REVISIÓN ARQUITECTURA': 23,
      'FECHA PRIMERA REVISIÓN ARQUITECTÓNICA': 24,
      'NOMBRE PROFESIONAL INGENIERÍA': 27,
      'FECHA PRIMERA REVISIÓN INGENIERÍA': 29,
      'ACTA DE OBSERVACIONES FECHA NOTIFICACIÓN': 34,
      'FINALIZACIÓN DEL TRAMITE FECHA FINALIZACIÓN': 41,
      'LICENCIA / OTRAS ACTUACIONES FECHA EXPEDICIÓN': 52
    };

    const datos = [];
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
