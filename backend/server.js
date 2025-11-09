const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(helmet());

// Note: do NOT connect to MongoDB when this file is required by tests.
// Connect only when the server is started directly (node server.js or npm start).

const path = require('path');

// Routes (will be added)
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const priceRoutes = require("./routes/priceRoutes");

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/prices', priceRoutes);

// Serve frontend static files (prefer production build if present)
let frontendPath = path.join(__dirname, '..', 'frontend', 'build');
const fs = require('fs');
if (!fs.existsSync(frontendPath)) {
  // fallback to dev/static folder
  frontendPath = path.join(__dirname, '..', 'frontend');
}
app.use(express.static(frontendPath));
app.get('/', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Fallback for client-side routing (match any non-/api route)
// Use a regex route to avoid path-to-regexp parameter parsing issues with a raw '*'
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

const PORT = process.env.PORT || 5000;

// Export app for testing and only start server when run directly
if (require.main === module) {
  // Connect to MongoDB and then start the server
  mongoose.connect(process.env.MONGO_URI)
    .then(() => {
      console.log("✅ MongoDB connected");
      app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    })
    .catch(err => console.error("❌ MongoDB connection error:", err));
}

module.exports = app;
