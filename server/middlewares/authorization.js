const {
  handleResponse,
  handleServerError,
} = require('../helpers/responseHandler');
const { verifyToken } = require('../utils/jwt');

exports.authorizeAdmin = (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return handleResponse(res, 401, {
        message: 'No authorization token provided',
      });
    }
    const token = req.headers.authorization.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      return handleResponse(res, 401, { message: 'Invalid or expired token' });
    }

    if (decoded.role !== 'admin') {
      return handleResponse(res, 403, {
        message: 'Access forbidden. Admin authorization required.',
      });
    }
    req.user = decoded;

    next();
  } catch (error) {
    console.log(error);
    handleServerError(res);
  }
};
