const request = require('supertest');
const CryptoJS = require('crypto-js');
const app = require('../../index');
const { Admin, sequelize } = require('../../models');
const { generateToken } = require('../../utils/jwt');
const fs = require('fs');
const path = require('path');
const { queryInterface } = sequelize;

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

beforeAll(async () => {
  try {
    //User
    const response = await request(app)
      .post('/api/auth/register')
      .send(dummyUser);

    userId = response.body.user.id;
    const userTokenPayload = {
      id: userId,
      role: 'user',
    };
    userToken = generateToken(userTokenPayload);

    //Admin
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
  } catch (err) {
    console.error(err);
  }
}, 10000);

afterAll(async () => {
  try {
    await queryInterface.bulkDelete('Users', null, {});
    await queryInterface.bulkDelete('Admins', null, {});
  } catch (err) {
    console.error(err);
  }
});

describe('Get User by Id', () => {
  it('should get User by id with status 200', async () => {
    let response;
    try {
      response = await request(app)
        .get('/api/user')
        .set('Authorization', `Bearer ${userToken}`);
    } catch (err) {
      console.error(err);
    }
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', userId);
    expect(response.body).toHaveProperty('email', dummyUser.email);
    expect(response.body).not.toHaveProperty('password');
  });
});

describe('Get All Users Paginated', () => {
  it('should get all users with pagination with status 200', async () => {
    let response;
    try {
      response = await request(app)
        .get('/api/user/all')
        .set('Authorization', `Bearer ${adminToken}`);
    } catch (err) {
      console.error(err);
    }

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('total');
    expect(response.body).toHaveProperty('users');
  });
});

describe('Get Users by Age Group', () => {
  it('should get Users by age group with status 200', async () => {
    let response;
    try {
      response = await request(app)
        .get('/api/user/demographic')
        .set('Authorization', `Bearer ${adminToken}`);
    } catch (err) {
      console.error(err);
    }
    expect(response.status).toBe(200);
    expect(response.body[0]).toHaveProperty('ageGroup');
  });
});

describe('Get User Sex Distribution', () => {
  it('should get User sex distribution with status 200', async () => {
    let response;
    try {
      response = await request(app)
        .get('/api/user/sex-distribution')
        .set('Authorization', `Bearer ${adminToken}`);
    } catch (err) {
      console.error(err);
    }
    expect(response.status).toBe(200);
    expect(response.body[0]).toHaveProperty('id');
  });
});

describe('Get User Weight Entries', () => {
  it('should get User weight entries with status 200', async () => {
    let response;
    try {
      response = await request(app)
        .get('/api/user/weight-tracking')
        .set('Authorization', `Bearer ${userToken}`);
    } catch (err) {
      console.error(err);
    }

    expect(response.status).toBe(200);
    expect(response.body[0]).toHaveProperty('x');
    expect(response.body[0]).toHaveProperty('y');
    expect(response.body[0].y).toEqual(dummyUser.weight);
  });
});

describe('Edit User Profile', () => {
  let createdAvatarPath;
  const avatarPath = path.join(__dirname, '..', '..', 'uploads', 'test.jpg');
  it('should successfully update the user profile', async () => {
    const updatedData = {
      username: 'edit testuser',
      email: 'edittest@example.com',
      sex: 'female',
      dob: '1990-01-01',
      avatar: avatarPath,
      height: 175,
      weight: 50,
      goal: 'maintain',
      activityLevel: 2,
    };
    let response;
    try {
      response = await request(app)
        .put('/api/user/profile')
        .set('Authorization', `Bearer ${userToken}`)
        .field('username', updatedData.username)
        .field('email', updatedData.email)
        .field('sex', updatedData.sex)
        .field('dob', updatedData.dob)
        .field('height', updatedData.height)
        .field('weight', updatedData.weight)
        .field('goal', updatedData.goal)
        .field('activityLevel', updatedData.activityLevel)
        .attach('avatar', avatarPath);
    } catch (err) {
      console.error(err);
    }
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Profile updated successfully!');
    expect(response.body.user).toHaveProperty('id', userId);
    createdAvatarPath = path.join(
      __dirname,
      '..',
      '..',
      response.body.user.avatar
    );
  });

  it('should return a validation error for invalid data', async () => {
    const invalidData = {
      username: 'edit testuser',
      email: 'edittest@example.com',
      sex: 'fem',
      dob: '1990-01-01',
      height: 175,
      weight: 50,
      goal: 'maintain',
      activityLevel: 2,
    };
    let response;
    try {
      response = await request(app)
        .put('/api/user/profile')
        .set('Authorization', `Bearer ${userToken}`)
        .send(invalidData);
    } catch (err) {
      console.error(err);
    }
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Please select a your sex');
  });
  afterAll(() => {
    if (createdAvatarPath) {
      try {
        fs.unlinkSync(createdAvatarPath);
      } catch (error) {
        console.error('Error deleting file:', error);
      }
    }
  });
});

describe('Delete User by Id', () => {
  it('should show status 404 user not found when trying to delete', async () => {
    const fakeId = 9999;
    let response;
    try {
      response = await request(app)
        .delete(`/api/user/delete/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`);
    } catch (err) {
      console.error(err);
    }
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('User not found.');
  });

  it('should delete user by id with status 200', async () => {
    let response;
    try {
      response = await request(app)
        .delete(`/api/user/delete/${userId}`)
        .set('Authorization', `Bearer ${adminToken}`);
    } catch (err) {
      console.error(err);
    }
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('deletedUser');
    expect(response.body.deletedUser.id).toEqual(userId);
  });
});
