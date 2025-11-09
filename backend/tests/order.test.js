const request = require('supertest');
const app = require('../server');

// Mock auth middleware to inject user with role
jest.mock('../middleware/authMiddleware', () => {
  return (req, res, next) => {
    // default to a farmer for this test file; we want to ensure farmers cannot place orders
    req.user = { _id: '507f1f77bcf86cd799439012', role: 'farmer', name: 'Test Farmer' };
    next();
  };
});

describe('Order routes - role enforcement', () => {
  test('POST /api/orders should return 403 for farmer role (cannot place order)', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send({ productId: '507f1f77bcf86cd799439013', quantity: 1 });

    expect(res.statusCode).toBe(403);
    expect(res.body).toHaveProperty('message');
  });
});
