const request = require('supertest');
const CryptoJS = require('crypto-js');
const app = require('../../index');
const { sequelize, User } = require('../../models');
const mockFoodsData = require('./mockFoodsData.json');
const mockFoodDetails = require('./mockFoodDetails.json');
const { queryInterface } = sequelize;
const fs = require('fs');
const path = require('path');
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

const dummyCustomFood = {
  foodName: 'banana',
  servingQty: 1,
  servingUnit: 'piece',
  servingWeight: 50,
  image: null,
  nutrients: {
    carbs: {
      value: 2,
      dv: '1',
    },
    fat: {
      value: 3,
      dv: '4',
    },
    protein: {
      value: 5,
      dv: null,
    },
    calories: {
      value: 55,
      dv: null,
    },
  },
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

describe('Create Custom Food', () => {
  let createdImagePath;
  const imagePath = path.join(__dirname, '..', '..', 'uploads', 'test.jpg');

  it('should return a validation error for invalid data', async () => {
    const response = await request(app)
      .post('/api/food/create')
      .set('Authorization', `Bearer ${userToken}`)
      .field('name', '')
      .field('servingUnit', 'piece')
      .field('servingSize', '50')
      .field('calories', '66')
      .field('protein', '3')
      .field('carbs', '2')
      .field('fat', '1');
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Food name is required');
  });
  it('should create a custom food successfully', async () => {
    const response = await request(app)
      .post('/api/food/create')
      .set('Authorization', `Bearer ${userToken}`)
      .field('name', 'TestFood')
      .field('servingUnit', 'piece')
      .field('servingSize', '50')
      .field('calories', '66')
      .field('protein', '3')
      .field('carbs', '2')
      .field('fat', '1')
      .attach('image', imagePath);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty(
      'message',
      'Food created successfully!'
    );
    createdImagePath = path.join(
      __dirname,
      '..',
      '..',
      response.body.food.image
    );
  });
  afterAll(() => {
    if (createdImagePath) {
      try {
        fs.unlinkSync(createdImagePath);
      } catch (error) {
        console.error('Error deleting file:', error);
      }
    }
  });
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
  it('should fetch only specified categories of food data correctly', async () => {
    fetchNutritionixFoodsApi.mockResolvedValue(mockFoodsData);

    let response;
    try {
      response = await request(app)
        .post('/api/food/search')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ query: 'banana', category: 'Branded', page: 1, pageSize: 5 });
    } catch (err) {
      console.error(err);
    }
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('totalItems');
    expect(response.body).toHaveProperty('items');
    expect(response.body.items[0].type).toBe('branded');
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
  it('should fetch custom food details correctly', async () => {
    let response;
    try {
      response = await request(app)
        .get('/api/food/custom/TestFood')
        .set('Authorization', `Bearer ${userToken}`);
    } catch (err) {
      console.error(err);
    }
    expect(response.status).toBe(200);
  });
  it('should fetch custom food details correctly', async () => {
    let response;
    try {
      response = await request(app)
        .get('/api/food/custom/nonexistingfood')
        .set('Authorization', `Bearer ${userToken}`);
    } catch (err) {
      console.error(err);
    }
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'Custom food not found.');
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
