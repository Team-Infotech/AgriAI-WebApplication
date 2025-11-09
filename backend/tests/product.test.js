const request = require('supertest');
const app = require('../server');

// Mock auth middleware to inject user with role
jest.mock('../middleware/authMiddleware', () => {
  return (req, res, next) => {
    // default to a buyer; tests will override by requiring a different mock if needed
    req.user = { _id: '507f1f77bcf86cd799439011', role: 'buyer', name: 'Test Buyer' };
    next();
  };
});

describe('Product routes - role enforcement', () => {
  test('POST /api/products should return 403 for buyer role (cannot create product)', async () => {
    const res = await request(app)
      .post('/api/products')
      .send({ title: 'Test Product', description: 'x', price: 10, quantity: 5 });

    expect(res.statusCode).toBe(403);
    expect(res.body).toHaveProperty('message');
  });
});
