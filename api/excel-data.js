export default async (req, res) => {
  try {
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

    // Buscar el archivo directamente por nombre en todo el sitio
    const searchResponse = await fetch(
      `https://graph.microsoft.com/v1.0/sites/${siteData.id}/drive/root/search(q='Seguimiento Proyectos')`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    const searchData = await searchResponse.json();

    res.status(200).json({
      success: true,
      siteId: siteData.id,
      resultadoBusqueda: searchData,
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
