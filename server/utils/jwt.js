const jwt = require('jsonwebtoken');

const secretKey = process.env.SECRET_KEY;

const generateToken = (user, expiresIn = '1d') => {
  const { id } = user;
  return jwt.sign({ id }, secretKey, { expiresIn });
};

const generateVerificationToken = (user, expiresIn = '1d') => {
  const { id, email } = user;
  return jwt.sign({ id, email }, secretKey, { expiresIn });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, secretKey);
  } catch (error) {
    return null;
  }
};

module.exports = { generateToken, generateVerificationToken, verifyToken };
