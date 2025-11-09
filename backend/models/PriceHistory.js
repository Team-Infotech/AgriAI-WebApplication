const mongoose = require('mongoose');

const priceHistorySchema = new mongoose.Schema({
  crop: { type: String, required: true },
  predicted_price: { type: Number, required: true },
  source: { type: String, default: 'flask' }
}, { timestamps: true });

module.exports = mongoose.model('PriceHistory', priceHistorySchema);
