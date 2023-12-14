const jwt = require('jsonwebtoken');

const secretKey = process.env.SECRET_KEY;

const generateToken = (user, expiresIn = '1d') => {
  const { id, role } = user;
  return jwt.sign({ id, role }, secretKey, { expiresIn });
};

const generateEmailVerificationToken = (otp, email, expiresIn = '2m') => {
  return jwt.sign({ otp, email }, secretKey, { expiresIn });
};

const generateForgotPasswordToken = (email) => {
  return jwt.sign({ email }, secretKey, { expiresIn: '5m' });
};

const verifyToken = (token) => {
  return jwt.verify(token, secretKey);
};

module.exports = {
  generateToken,
  generateEmailVerificationToken,
  generateForgotPasswordToken,
  verifyToken,
};
