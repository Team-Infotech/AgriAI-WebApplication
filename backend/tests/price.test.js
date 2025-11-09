const request = require('supertest');
const app = require('../server');

// We'll mock axios and the PriceHistory model to avoid real HTTP or DB operations
jest.mock('axios');
jest.mock('../models/PriceHistory');

const axios = require('axios');
const PriceHistory = require('../models/PriceHistory');

describe('Price routes - predict', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('forwards to flask and returns predicted_price on success', async () => {
    axios.post.mockResolvedValue({ data: { predicted_price: 1234 } });
    // mock save to resolve
    PriceHistory.mockImplementation(function (obj) { this.save = async () => ({ _id: '1', ...obj }); });

    const res = await request(app)
      .post('/api/prices/predict')
      .send({ crop: 'wheat' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('predicted_price', 1234);
    expect(axios.post).toHaveBeenCalled();
    // Ensure we saved the result with source 'flask'
    expect(PriceHistory).toHaveBeenCalledWith(expect.objectContaining({ crop: 'wheat', predicted_price: 1234, source: 'flask' }));
  });

  test('returns fallback when axios throws', async () => {
    axios.post.mockRejectedValue(new Error('ECONNREFUSED'));
    PriceHistory.mockImplementation(function (obj) { this.save = async () => ({ _id: '2', ...obj }); });

    const res = await request(app)
      .post('/api/prices/predict')
      .send({ crop: 'maize' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('predicted_price');
    expect(res.body).toHaveProperty('note', 'flask unavailable, returning fallback');
    // Ensure fallback save used source 'fallback'
    expect(PriceHistory).toHaveBeenCalledWith(expect.objectContaining({ crop: 'maize', source: 'fallback' }));
  });
});
