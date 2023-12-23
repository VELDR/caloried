const {
  handleResponse,
  handleServerError,
} = require('../helpers/responseHandler');

exports.authorizeAdmin = (req, res, next) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return handleResponse(res, 403, {
        message: 'Access forbidden. Admin authorization required.',
      });
    }

    next();
  } catch (error) {
    console.log(error);
    handleServerError(res);
  }
};
