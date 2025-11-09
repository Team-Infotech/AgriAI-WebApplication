const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const auth = require('../middleware/authMiddleware');
const roles = require('../middleware/roleMiddleware');

// Create product (farmer only)
router.post('/', auth, roles('farmer'), async (req, res) => {
  try {
    const { title, description, imageUrl, price, quantity } = req.body;
    const product = new Product({ title, description, imageUrl, price, quantity, farmer: req.user._id });
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().populate('farmer', 'name email');
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('farmer', 'name email');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update product (owner only)
router.put('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.farmer.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not allowed' });
    Object.assign(product, req.body);
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Delete product (owner only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.farmer.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not allowed' });
    await product.remove();
    res.json({ message: 'Product removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
