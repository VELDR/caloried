const {
  handleResponse,
  handleServerError,
} = require('../helpers/responseHandler');

exports.authorizeAdmin = (req, res, next) => {
  try {
    const { isAdmin } = req.user;
    if (!isAdmin) {
      return handleResponse(res, 403, {
        message: 'Access forbidden. Admin authorization required.',
      });
    }
    next();
  } catch (error) {
    handleServerError(res);
  }
};
