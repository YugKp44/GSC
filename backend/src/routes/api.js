const express = require('express');
const router = express.Router();
const { getSearchAnalytics, getVerifiedSites } = require('../services/searchConsole');

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Not authenticated' });
};

router.get('/sites', isAuthenticated, async (req, res) => {
  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.CALLBACK_URL
    );
    oauth2Client.setCredentials({
      access_token: req.user.accessToken
    });
    const sites = await getVerifiedSites(oauth2Client);
    res.json(sites);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/search-analytics', isAuthenticated, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const data = await getSearchAnalytics(
      req.user.accessToken,
      startDate || '2023-01-01',
      endDate || new Date().toISOString().split('T')[0]
    );
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;