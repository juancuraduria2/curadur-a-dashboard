export default async (req, res) => {
  try {
    // Obtener token
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

    // Sitio
    const siteResponse = await fetch(
      'https://graph.microsoft.com/v1.0/sites/curaduria2pereira.sharepoint.com:/sites/intranet',
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    const siteData = await siteResponse.json();

    // Archivos - RUTA CORRECTA: solo Archivos de Control
    const filesResponse = await fetch(
      `https://graph.microsoft.com/v1.0/sites/${siteData.id}/drive/root:/Archivos de Control:/children`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    const filesData = await filesResponse.json();

    if (!filesData.value) {
      return res.status(500).json({
        success: false,
        error: 'No se pudo listar archivos',
        sharePointResponse: filesData,
        timestamp: new Date().toISOString()
      });
    }

    const excelFile = filesData.value.find(f => f.name === 'Seguimiento Proyectos.xlsx');
    if (!excelFile) {
      return res.status(500).json({
        success: false,
        error: 'Archivo no encontrado',
        archivosDisponibles: filesData.value.map(f => f.name),
        timestamp: new Date().toISOString()
      });
    }

    // Obtener las primeras 5 filas para inspección
    const workbookResponse = await fetch(
      `https://graph.microsoft.com/v1.0/sites/${siteData.id}/drive/items/${excelFile.id}/workbook/worksheets('Seguimiento Proyectos')/usedRange?$select=values`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    const workbookData = await workbookResponse.json();

    const rows = workbookData.value || [];

    res.status(200).json({
      success: true,
      totalRows: rows.length,
      primeras3Filas: rows.slice(0, 3),
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
