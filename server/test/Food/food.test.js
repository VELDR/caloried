const request = require('supertest');
const CryptoJS = require('crypto-js');
const app = require('../../index');
const { sequelize, Admin, CustomFood } = require('../../models');
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

const dummyAdmin = {
  username: 'testadmin',
  email: 'testadmin@example.com',
  password: CryptoJS.AES.encrypt(
    'password123',
    process.env.CRYPTOJS_SECRET
  ).toString(),
};

let userToken;
let adminToken;
let userId;
let adminId;
let customFoodId;
let customFoodId2;

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

    const adminUser = await Admin.create({
      username: dummyAdmin.username,
      email: dummyAdmin.email,
      password: dummyAdmin.password,
    });
    adminId = adminUser.id;
    const adminTokenPayload = {
      id: adminId,
      role: 'admin',
    };
    adminToken = generateToken(adminTokenPayload);

    const customFood = await CustomFood.create({
      name: 'banana',
      servingUnit: 'piece',
      servingSize: 50,
      image: null,
      carbs: 2,
      fat: 3,
      protein: 5,
      calories: 55,
      userId,
    });
    customFoodId = customFood.id;
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

    customFoodId2 = response.body.food.id;

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

describe('Get User Custom Foods', () => {
  it('should return custom foods created by the user', async () => {
    const response = await request(app)
      .get('/api/food/myFoods')
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(200);

    if (response.body.length > 0) {
      const firstFood = response.body[0];
      expect(firstFood).toHaveProperty('id');
      expect(firstFood).toHaveProperty('foodName');
      expect(firstFood).toHaveProperty('servingQty');
      expect(firstFood).toHaveProperty('servingUnit');
      expect(firstFood).toHaveProperty('servingWeight');
      expect(firstFood).toHaveProperty('nutrients');
      expect(firstFood).toHaveProperty('image');
    }
  });
});

describe('Edit Custom Food', () => {
  let createdImagePath;
  const imagePath = path.join(__dirname, '..', '..', 'uploads', 'test.jpg');

  it('should return a validation error for invalid data', async () => {
    const response = await request(app)
      .put(`/api/food/myFoods/${customFoodId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .field('name', '')
      .field('servingUnit', 'grams')
      .field('servingSize', '75')
      .field('calories', '100')
      .field('protein', '5')
      .field('carbs', '10')
      .field('fat', '3');

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Food name is required');
  });

  it('should edit a custom food successfully', async () => {
    const response = await request(app)
      .put(`/api/food/myFoods/${customFoodId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .field('name', 'EditedTestFood')
      .field('servingUnit', 'grams')
      .field('servingSize', '75')
      .field('calories', '100')
      .field('protein', '5')
      .field('carbs', '10')
      .field('fat', '3')
      .attach('image', imagePath);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      'message',
      'Food updated successfully!'
    );

    createdImagePath = path.join(
      __dirname,
      '..',
      '..',
      response.body.food.image
    );

    const editedFood = response.body.food;

    expect(editedFood).toHaveProperty('name', 'EditedTestFood');
    expect(editedFood).toHaveProperty('servingUnit', 'grams');
    expect(editedFood).toHaveProperty('servingSize', 75);
    expect(editedFood).toHaveProperty('calories', 100);
    expect(editedFood).toHaveProperty('protein', 5);
    expect(editedFood).toHaveProperty('carbs', 10);
    expect(editedFood).toHaveProperty('fat', 3);
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

describe('Get All CustomFoods Paginated', () => {
  it('should get all custom foods with pagination with status 200', async () => {
    const response = await request(app)
      .get('/api/food/all')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('total');
    expect(response.body).toHaveProperty('customFoods');
  });
});

describe('Delete Custom Food', () => {
  it('should delete a custom food successfully by user', async () => {
    const response = await request(app)
      .delete(`/api/food/myFoods/${customFoodId}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      'message',
      'Food deleted successfully!'
    );
  });
});

describe('Delete Custom Food', () => {
  it('should delete a custom food successfully by admin', async () => {
    const response = await request(app)
      .delete(`/api/food/delete/${customFoodId2}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      'message',
      'Food deleted successfully!'
    );
  });
});

describe('404 Error Test', () => {
  it('should return not found for editing custom food when user has none', async () => {
    const response = await request(app)
      .put(`/api/food/myFoods/${customFoodId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .field('name', 'EditedTestFood')
      .field('servingUnit', 'grams')
      .field('servingSize', '75')
      .field('calories', '100')
      .field('protein', '5')
      .field('carbs', '10')
      .field('fat', '3');

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'Custom food not found.');
  });
  it('should return not found for deleting non-existing custom food for user', async () => {
    const response = await request(app)
      .delete(`/api/food/myFoods/0`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'Custom food not found.');
  });
  it('should return not found for getting all custom foods paginated when custom foods is empty', async () => {
    const response = await request(app)
      .get('/api/food/all')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'No custom foods found.');
  });
  it('should return not found for deleting non-existing custom food for admin', async () => {
    const response = await request(app)
      .delete(`/api/food/delete/0`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'Custom food not found.');
  });
});
