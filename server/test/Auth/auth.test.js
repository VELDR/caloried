const request = require('supertest');
const CryptoJS = require('crypto-js');
const app = require('../../index');
const { User, Admin, sequelize } = require('../../models');
const { generateForgotPasswordToken } = require('../../utils/jwt');
const jwt = require('jsonwebtoken');
const { queryInterface } = sequelize;
const nodemailer = require('nodemailer');

const dummyUser = {
  username: 'newUser',
  email: 'newUser@example.com',
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

let OTP;
const sendMailMock = jest.fn();

jest.mock('nodemailer');

nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock });

beforeAll(async () => {
  try {
    const adminUser = await Admin.create({
      username: dummyAdmin.username,
      email: dummyAdmin.email,
      password: dummyAdmin.password,
    });
    console.log(adminUser, '<<<<<<DA ADMINNNN');
  } catch (err) {
    console.error(err);
  }
});

beforeEach(() => {
  sendMailMock.mockClear();
  nodemailer.createTransport.mockClear();
});

afterAll(async () => {
  try {
    await queryInterface.bulkDelete('Users', null, {});
    await queryInterface.bulkDelete('Admins', null, {});
  } catch (err) {
    console.error(err);
  }
});

describe('Register', () => {
  it('should return a joi error for invalid input', async () => {
    let response;
    try {
      response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'newUser',
          email: 'newUser',
          password: CryptoJS.AES.encrypt(
            'password123',
            process.env.CRYPTOJS_SECRET
          ).toString(),
        });
    } catch (err) {
      console.error(err);
    }
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Email must be a valid email');
  });

  it('should register user with status 201', async () => {
    let response;
    try {
      response = await request(app).post('/api/auth/register').send(dummyUser);
      const decoded = jwt.decode(response.body.user.verificationToken);
      OTP = decoded.otp;
    } catch (err) {
      console.error(err);
    }

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('user');
    expect(response.body.user.email).toEqual(dummyUser.email);
  });

  it('should return a 400 error for an existing user', async () => {
    let response;
    try {
      response = await request(app).post('/api/auth/register').send(dummyUser);
    } catch (err) {
      console.error(err);
    }

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Username or email already exists');
  });
});

describe('Login Before Verification', () => {
  it('should send error 403 response with email not verified message', async () => {
    let response;
    try {
      response = await request(app)
        .post('/api/auth/login')
        .send({
          email: dummyUser.email,
          password: CryptoJS.AES.encrypt(
            'password123',
            process.env.CRYPTOJS_SECRET
          ).toString(),
        });
    } catch (err) {
      console.error(err);
    }
    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe(
      'Your email address is not verified. Please check your email for the verification OTP.'
    );
  });
});

describe('Resend Verification Email When User is not Verified', () => {
  it('should send 404 error for a non-existent email', async () => {
    let response;
    try {
      response = await request(app)
        .post('/api/auth/resend-verification')
        .send({ email: 'fake@gmail.com' });
    } catch (err) {
      console.error(err);
    }
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('User not found.');
  });
  it('should successfully resend an OTP', async () => {
    let response;
    try {
      response = await request(app)
        .post('/api/auth/resend-verification')
        .send({ email: dummyUser.email });

      const user = await User.findOne({
        where: { email: dummyUser.email },
      });
      const decoded = jwt.decode(user.verificationToken);
      OTP = decoded.otp;
    } catch (err) {
      console.error(err);
    }
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Verification OTP resent.');
  });
});

describe('Verify Email', () => {
  it('should return an error for invalid OTP', async () => {
    let response;
    try {
      response = await request(app)
        .post('/api/auth/verify-email')
        .send({ otp: 'wrongotp', email: dummyUser.email });
    } catch (err) {
      console.error(err);
    }
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid OTP.');
  });
  it('should send 404 error for a non-existent email', async () => {
    let response;
    try {
      response = await request(app)
        .post('/api/auth/verify-email')
        .send({ otp: OTP, email: 'fake@gmail.com' });
    } catch (err) {
      console.error(err);
    }
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('User not found.');
  });

  it('should successfully verify email', async () => {
    let response;
    try {
      response = await request(app)
        .post('/api/auth/verify-email')
        .send({ otp: OTP, email: dummyUser.email });
    } catch (err) {
      console.error(err);
    }
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Verification Success!');
  });
});

describe('Login After Verification', () => {
  it('should return an error for invalid credentials', async () => {
    let response;
    try {
      response = await request(app)
        .post('/api/auth/login')
        .send({
          email: dummyUser.email,
          password: CryptoJS.AES.encrypt(
            'wrongpassword',
            process.env.CRYPTOJS_SECRET
          ).toString(),
        });
    } catch (err) {
      console.error(err);
    }
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid email or password.');
  });
  it('should return a joi validation error', async () => {
    let response;
    try {
      response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'invalidEmail',
          password: CryptoJS.AES.encrypt(
            'wrongpassword',
            process.env.CRYPTOJS_SECRET
          ).toString(),
        });
    } catch (err) {
      console.error(err);
    }
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Email must be a valid email');
  });
  it('should successfully log in a user', async () => {
    let response;
    try {
      response = await request(app).post('/api/auth/login').send({
        email: dummyUser.email,
        password: dummyUser.password,
      });
    } catch (err) {
      console.error(err);
    }
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body.message).toBe('Successfully signed in!');
  });
});

describe('Resend Verification Email When User is Verified', () => {
  it('should send a 400 error message', async () => {
    let response;
    try {
      response = await request(app)
        .post('/api/auth/resend-verification')
        .send({ email: dummyUser.email });
    } catch (err) {
      console.error(err);
    }
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Email already verified.');
  });
});

describe('Forgot Password', () => {
  it('should return a 404 error for unregistered email', async () => {
    let response;
    try {
      response = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: 'fake@gmail.com' });
    } catch (err) {
      console.error(err);
    }
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Email not registered.');
  });
  it('should send reset password link for registered email', async () => {
    let response;
    try {
      response = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: dummyUser.email });
    } catch (err) {
      console.error(err);
    }
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Reset password link sent via email');
  });
});

describe('Reset Password', () => {
  it('should successfully reset the user password', async () => {
    const token = generateForgotPasswordToken(dummyUser.email);
    const newPassword = 'newPassword123';

    let response;
    try {
      response = await request(app)
        .put('/api/auth/reset-password')
        .send({
          email: dummyUser.email,
          newPassword: CryptoJS.AES.encrypt(
            newPassword,
            process.env.CRYPTOJS_SECRET
          ).toString(),
          token,
        });
    } catch (err) {
      console.error(err);
    }
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Password reset successful.');
  });

  it('should return a joi error for invalid email format', async () => {
    const invalidToken = 'invalidtoken';
    let response;
    try {
      response = await request(app)
        .put('/api/auth/reset-password')
        .send({
          email: 'invalidEmail',
          newPassword: CryptoJS.AES.encrypt(
            'newPassword123',
            process.env.CRYPTOJS_SECRET
          ).toString(),
          token: invalidToken,
        });
    } catch (err) {
      console.error(err);
    }
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid email format');
  });

  it('should return an error for invalid token', async () => {
    const invalidToken = 'invalidtoken';
    let response;
    try {
      response = await request(app)
        .put('/api/auth/reset-password')
        .send({
          email: dummyUser.email,
          newPassword: CryptoJS.AES.encrypt(
            'newPassword123',
            process.env.CRYPTOJS_SECRET
          ).toString(),
          token: invalidToken,
        });
    } catch (err) {
      console.error(err);
    }
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Token expired.');
  });
  it('should return a 404 error for unregistered email', async () => {
    const token = generateForgotPasswordToken(dummyUser.email);
    const newPassword = 'newPassword123';
    let response;
    try {
      response = await request(app)
        .put('/api/auth/reset-password')
        .send({
          email: 'fake@gmail.com',
          newPassword: CryptoJS.AES.encrypt(
            newPassword,
            process.env.CRYPTOJS_SECRET
          ).toString(),
          token,
        });
    } catch (err) {
      console.error(err);
    }
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Email not registered.');
  });
});

describe('Admin Login', () => {
  // it('should successfully log in an admin', async () => {
  //   let response;
  //   try {
  //     response = await request(app).post('/api/auth/admin-login').send({
  //       email: dummyAdmin.email,
  //       password: dummyAdmin.password,
  //     });
  //   } catch (err) {
  //     console.error(err);
  //   }
  //   console.log(response.body, '<<<<<<<<ADMINININI');
  //   console.log(dummyAdmin.password);
  //   expect(response.status).toBe(200);
  //   expect(response.body).toHaveProperty('token');
  //   expect(response.body.message).toBe('Successfully signed in!');
  // });
  it('should return an error for invalid credentials', async () => {
    let response;
    try {
      response = await request(app)
        .post('/api/auth/admin-login')
        .send({
          email: dummyAdmin.email,
          password: CryptoJS.AES.encrypt(
            'wrongpassword',
            process.env.CRYPTOJS_SECRET
          ).toString(),
        });
    } catch (err) {
      console.error(err);
    }
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid email or password.');
  });
  it('should return a joi validation error', async () => {
    let response;
    try {
      response = await request(app).post('/api/auth/admin-login').send({
        email: 'invalidEmail',
        password: dummyAdmin.password,
      });
    } catch (err) {
      console.error(err);
    }
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Email must be a valid email');
  });
});
