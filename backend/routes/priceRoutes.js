const express = require('express');
const router = express.Router();
const axios = require('axios');
const PriceHistory = require('../models/PriceHistory');

// GET /api/prices/history
router.get('/history', async (req, res) => {
  try {
    const items = await PriceHistory.find().sort({ createdAt: -1 }).limit(50);
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/prices/predict
router.post('/predict', async (req, res) => {
  const { crop } = req.body;
  if (!crop) return res.status(400).json({ message: 'Crop is required' });
  try {
    const flaskUrl = process.env.FLASK_API_URL || 'http://127.0.0.1:5001/predict';
  // Forward to Flask microservice (3s timeout)
  const resp = await axios.post(flaskUrl, { crop }, { timeout: 3000 });
    const predicted_price = resp.data.predicted_price;
    // Save to DB
    const entry = new PriceHistory({ crop, predicted_price, source: 'flask' });
    await entry.save();
    res.json({ crop, predicted_price });
  } catch (err) {
    // Log error for debugging and fallback to mock prediction
    console.error('priceRoutes: error contacting flask:', err && err.message, err && err.code);
    const fallback = 1000 + (Math.abs(hashCode(crop)) % 500);
    try { await new PriceHistory({ crop, predicted_price: fallback, source: 'fallback' }).save(); } catch(e){ console.error('priceRoutes: failed to save fallback to DB', e && e.message); }
    res.json({ crop, predicted_price: fallback, note: 'flask unavailable, returning fallback', error: err && err.message });
  }
});

function hashCode(s) {
  let h = 0; for (let i=0;i<s.length;i++) h = ((h<<5)-h) + s.charCodeAt(i);
  return h;
}

module.exports = router;

