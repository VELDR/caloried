const request = require('supertest');
const CryptoJS = require('crypto-js');
const app = require('../../index');
const { sequelize, User } = require('../../models');
const mockFoodsData = require('./mockFoodsData.json');
const mockFoodDetails = require('./mockFoodDetails.json');
const { queryInterface } = sequelize;
const {
  fetchNutritionixFoodsApi,
  fetchNutritionixFoodDetailsApi,
} = require('../../domain/api.js');
const { generateToken } = require('../../utils/jwt.js');
const Redis = require('ioredis');

jest.mock('../../domain/api.js', () => ({
  ...jest.requireActual('../../domain/api.js'),
  fetchNutritionixFoodDetailsApi: jest.fn(),
  fetchNutritionixFoodsApi: jest.fn(),
}));

const redisClientMock = new Redis();
jest.mock('ioredis', () => require('ioredis-mock'));

const dummyUser = {
  username: 'testuser',
  email: 'test@example.com',
  password: CryptoJS.AES.encrypt(
    'password123',
    process.env.CRYPTOJS_SECRET
  ).toString(),
  sex: 'male',
  dob: '1990-01-01',
  height: 180,
  weight: 75,
  goal: 'maintain',
  activityLevel: 3,
};

let userToken;
let userId;

beforeAll(async () => {
  try {
    const response = await request(app)
      .post('/api/auth/register')
      .send(dummyUser);

    userId = response.body.user.id;
    const userTokenPayload = {
      id: userId,
      role: 'user',
    };
    userToken = generateToken(userTokenPayload);
  } catch (err) {
    console.error(err);
  }
}, 10000);

afterAll(async () => {
  try {
    await queryInterface.bulkDelete('Users', null, {});
  } catch (err) {
    console.error(err);
  }
});

describe('Fetch Foods', () => {
  beforeEach(async () => {
    redisClientMock.flushall();
  });
  it('should fetch food data correctly', async () => {
    fetchNutritionixFoodsApi.mockResolvedValue(mockFoodsData);

    let response;
    try {
      response = await request(app)
        .post('/api/food/search')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ query: 'banana', category: 'All', page: 1, pageSize: 5 });
    } catch (err) {
      console.error(err);
    }
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('totalItems');
    expect(response.body).toHaveProperty('items');
  });
});

describe('Fetch Foods Details', () => {
  beforeEach(async () => {
    redisClientMock.flushall();
  });
  it('should fetch common food details correctly', async () => {
    fetchNutritionixFoodDetailsApi.mockResolvedValue(mockFoodDetails);

    let response;
    try {
      response = await request(app)
        .get('/api/food/common/banana')
        .set('Authorization', `Bearer ${userToken}`);
    } catch (err) {
      console.error(err);
    }
    expect(response.status).toBe(200);
  });
  it('should fetch branded food details correctly', async () => {
    fetchNutritionixFoodsApi.mockResolvedValue(mockFoodsData);

    let response;
    try {
      response = await request(app)
        .get('/api/food/branded/banana')
        .set('Authorization', `Bearer ${userToken}`);
    } catch (err) {
      console.error(err);
    }
    expect(response.status).toBe(200);
  });
  it('should return an error for invalid food type', async () => {
    let response;
    try {
      response = await request(app)
        .get('/api/food/invalid/foodname')
        .set('Authorization', `Bearer ${userToken}`);
    } catch (err) {
      console.error(err);
    }

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid food type specified.');
  });
});
