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

    // Archivos
    const filesResponse = await fetch(
      `https://graph.microsoft.com/v1.0/sites/${siteData.id}/drive/root:/Curaduria 2 Pereira/Seguimiento Proyectos/Archivos de Control:/children`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    const filesData = await filesResponse.json();
    const excelFile = filesData.value.find(f => f.name === 'Seguimiento Proyectos.xlsx');

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
      primeras5Filas: rows.slice(0, 5),
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
