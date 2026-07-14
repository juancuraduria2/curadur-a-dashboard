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

    const fileId = '01WQFWMZ5Z3Y7KPKOJ2ZD2M7NFHUUHWQW3';

    // Listar todas las hojas
    const sheetsResponse = await fetch(
      `https://graph.microsoft.com/v1.0/sites/${siteData.id}/drive/items/${fileId}/workbook/worksheets`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    const sheetsData = await sheetsResponse.json();

    res.status(200).json({
      success: true,
      hojasDisponibles: sheetsData.value?.map(s => s.name) || [],
      respuestaCompleta: sheetsData,
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
