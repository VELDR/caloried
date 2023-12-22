const request = require('supertest');
const CryptoJS = require('crypto-js');
const app = require('../../index');
const { sequelize, Meal, Food, FoodLog } = require('../../models');
const { queryInterface } = sequelize;
const { generateToken } = require('../../utils/jwt.js');

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

const dummyFood = {
  name: 'Apple',
  servingSize: 1,
  servingUnit: 'piece',
  image: 'apple-image-url',
  calories: 95,
  fat: 0.3,
  carbs: 25,
  protein: 0.5,
  quantity: 1,
  date: '2023-01-01',
  mealType: 'Breakfast',
};

let userToken;
let userId;
let foodLogId;

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
    const meal = await Meal.create({
      diaryId: userId,
      date: dummyFood.date,
      mealType: dummyFood.mealType,
    });
    const food = await Food.create({
      name: dummyFood.name,
      servingSize: dummyFood.servingSize,
      servingUnit: dummyFood.servingUnit,
      image: dummyFood.calories,
      fat: dummyFood.fat,
      carbs: dummyFood.carbs,
      protein: dummyFood.protein,
    });

    const foodLog = await FoodLog.create({
      mealId: meal.id,
      foodId: food.id,
      quantity: dummyFood.quantity,
    });
    foodLogId = foodLog.id;
  } catch (err) {
    console.error(err);
  }
}, 10000);

afterAll(async () => {
  try {
    await queryInterface.bulkDelete('Users', null, {});
    await queryInterface.bulkDelete('Meals', null, {});
    await queryInterface.bulkDelete('Food', null, {});
    await queryInterface.bulkDelete('FoodLogs', null, {});
  } catch (err) {
    console.error(err);
  }
});

describe('Add Food To Diary', () => {
  it('should successfully add food to the diary', async () => {
    let response;
    try {
      response = await request(app)
        .post('/api/diary/add')
        .set('Authorization', `Bearer ${userToken}`)
        .send(dummyFood);
    } catch (err) {
      console.error(err);
    }
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Food added to diary.');
  });

  it('should return a validation error for invalid data', async () => {
    const invalidFood = {
      name: 'Apple',
      servingSize: 1,
      servingUnit: 'piece',
      image: 'apple-image-url',
      calories: 95,
      fat: 0.3,
      carbs: 25,
      protein: 0.5,
      quantity: 1,
      date: '2023-01-01',
      mealType: 'maksi',
    };
    let response;
    try {
      response = await request(app)
        .post('/api/diary/add')
        .set('Authorization', `Bearer ${userToken}`)
        .send(invalidFood);
    } catch (err) {
      console.error(err);
    }
    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      '"mealType" must be one of [Breakfast, Lunch, Dinner, Snack]'
    );
  });
});

describe('Get Meals By Date', () => {
  it('should retrieve meals for a specific date', async () => {
    let response;
    try {
      const testDate = '2023-01-01';
      response = await request(app)
        .get(`/api/diary/meal?date=${testDate}`)
        .set('Authorization', `Bearer ${userToken}`);
    } catch (err) {
      console.error(err);
    }
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });
});

describe('Edit Food In Diary', () => {
  it('should successfully edit food in the diary', async () => {
    const updatedFoodData = {
      quantity: 2,
      date: '2023-01-02',
      mealType: 'Lunch',
    };

    let response;
    try {
      response = await request(app)
        .put(`/api/diary/edit/${foodLogId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(updatedFoodData);
    } catch (err) {
      console.error(err);
    }
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Meal updated.');
  });

  it('should return a validation error for invalid data', async () => {
    const invalidData = {
      quantity: 2,
      date: '2023-01-02',
      mealType: 'maksi',
    };
    let response;
    try {
      response = await request(app)
        .put(`/api/diary/edit/${foodLogId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(invalidData);
    } catch (err) {
      console.error(err);
    }
    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      '"mealType" must be one of [Breakfast, Lunch, Dinner, Snack]'
    );
  });

  it('should return 404 for non-existent food log entry', async () => {
    const fakeId = 9999;
    const updatedFoodData = {
      quantity: 2,
      date: '2023-01-02',
      mealType: 'Lunch',
    };
    let response;
    try {
      response = await request(app)
        .put(`/api/diary/edit/${fakeId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(updatedFoodData);
    } catch (err) {
      console.error(err);
    }
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Meal not found.');
  });
});

describe('Delete Food From Diary', () => {
  it('should successfully delete food from the diary', async () => {
    let response;
    try {
      response = await request(app)
        .delete(`/api/diary/delete/${foodLogId}`)
        .set('Authorization', `Bearer ${userToken}`);
    } catch (err) {
      console.error(err);
    }
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Meal removed.');
  });

  it('should return 404 for non-existent food log entry', async () => {
    const fakeId = 9999;
    let response;
    try {
      response = await request(app)
        .delete(`/api/diary/delete/${fakeId}`)
        .set('Authorization', `Bearer ${userToken}`);
    } catch (err) {
      console.error(err);
    }

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Meal not found.');
  });
});

describe('Get User Yearly Activity', () => {
  it('should retrieve user yearly meal activity', async () => {
    let response;
    try {
      response = await request(app)
        .get('/api/diary/activity')
        .set('Authorization', `Bearer ${userToken}`);
    } catch (err) {
      console.error(err);
    }
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });
});

describe('Get User Calories Consumed', () => {
  it('should retrieve user calorie consumption over 7 days', async () => {
    const days = 7;
    let response;
    try {
      response = await request(app)
        .get(`/api/diary/calories-consumed?days=${days}`)
        .set('Authorization', `Bearer ${userToken}`);
    } catch (err) {
      console.error(err);
    }

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBe(days);
  });
});
