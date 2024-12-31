const { google } = require('googleapis');

async function getVerifiedSites(oauth2Client) {
  const searchconsole = google.searchconsole({
    version: 'v1',
    auth: oauth2Client
  });

  try {
    const response = await searchconsole.sites.list();
    return response.data.siteEntry || [];
  } catch (error) {
    console.error('Error fetching verified sites:', error);
    throw error;
  }
}

async function getSearchAnalytics(accessToken, startDate, endDate) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.CALLBACK_URL
  );

  oauth2Client.setCredentials({
    access_token: accessToken
  });

  // First get the list of verified sites
  const sites = await getVerifiedSites(oauth2Client);
  
  if (!sites.length) {
    throw new Error('No verified sites found for this user');
  }

  const searchconsole = google.searchconsole({
    version: 'v1',
    auth: oauth2Client
  });

  try {
    const response = await searchconsole.searchanalytics.query({
      siteUrl: sites[0].siteUrl, // Use the first verified site
      requestBody: {
        startDate,
        endDate,
        dimensions: ['query', 'page'],
        rowLimit: 100
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching search analytics:', error);
    throw error;
  }
}

module.exports = {
  getSearchAnalytics,
  getVerifiedSites
};