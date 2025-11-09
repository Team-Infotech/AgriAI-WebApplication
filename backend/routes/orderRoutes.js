const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const auth = require('../middleware/authMiddleware');
const roles = require('../middleware/roleMiddleware');

// Place order (buyer only)
router.post('/', auth, roles('buyer'), async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.quantity < quantity) return res.status(400).json({ message: 'Insufficient quantity' });
    product.quantity -= quantity;
    await product.save();
    const totalPrice = product.price * quantity;
    const order = new Order({ buyer: req.user._id, product: product._id, quantity, totalPrice });
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get orders for user
router.get('/', auth, async (req, res) => {
  try {
    const filter = req.user.role === 'buyer' ? { buyer: req.user._id } : {};
    const orders = await Order.find(filter).populate('product').populate('buyer', 'name email');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
