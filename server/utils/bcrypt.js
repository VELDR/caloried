const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);

const hashPassword = (password) => {
  const hashedPassword = bcrypt.hashSync(password, salt);
  return hashedPassword;
};

const comparePassword = (password, hash) => {
  const isMatch = bcrypt.compare(password, hash);
  return isMatch;
};

module.exports = { hashPassword, comparePassword };
