const {
  handleResponse,
  handleServerError,
} = require('../helpers/responseHandler');
const { User, Admin } = require('../models');
const { verifyToken } = require('../utils/jwt');

exports.authenticate = async (req, res, next) => {
  try {
    if (!req.headers.authorization)
      return handleResponse(res, 400, { message: 'User is not authenticated' });

    const bearerToken = req.headers.authorization;
    const token = bearerToken.split(' ')[1];
    const decoded = verifyToken(token);
    if (!decoded) {
      return handleResponse(res, 400, { message: 'You are not signed in' });
    }

    const { id, isAdmin } = decoded;

    const user = isAdmin ? await Admin.findByPk(id) : await User.findByPk(id);

    if (!user) {
      return handleResponse(res, 400, { message: 'You are not signed in' });
    }
    req.user = user;

    next();
  } catch (error) {
    handleServerError(res);
  }
};
