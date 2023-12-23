const {
  handleResponse,
  handleServerError,
} = require('../helpers/responseHandler');
const { verifyToken } = require('../utils/jwt');

exports.authenticate = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return handleResponse(res, 401, { message: 'User is not authenticated' });
    }

    const bearerToken = req.headers.authorization;
    const token = bearerToken.split(' ')[1];
    const decoded = verifyToken(token);
    if (!decoded) {
      return handleResponse(res, 401, { message: 'You are not signed in' });
    }
    req.user = decoded;
    next();
  } catch (error) {
    handleServerError(res);
  }
};
