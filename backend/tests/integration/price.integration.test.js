const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');
const axios = require('axios');

jest.mock('axios');

let mongoServer;
let app;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  // connect mongoose
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  // ensure the server app is required after mongoose connect to avoid race
  app = require('../../server');
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Integration: /api/prices/predict with real DB', () => {
  test('saves PriceHistory with source=flask when axios resolves', async () => {
    axios.post.mockResolvedValue({ data: { predicted_price: 2222 } });

    const res = await request(app)
      .post('/api/prices/predict')
      .send({ crop: 'integration-crop' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('predicted_price', 2222);

    // Verify saved in DB
    const PriceHistory = require('../../models/PriceHistory');
    const record = await PriceHistory.findOne({ crop: 'integration-crop' }).lean();
    expect(record).toBeTruthy();
    expect(record.source).toBe('flask');
    expect(record.predicted_price).toBe(2222);
  });
});
