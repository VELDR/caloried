const {
  handleResponse,
  handleServerError,
} = require('../helpers/responseHandler');
const { User } = require('../models');

exports.getUserById = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId);

    if (!user) {
      return handleResponse(res, 404, {
        message: 'User not found.',
      });
    }

    delete user.dataValues.password;

    return handleResponse(res, 200, user);
  } catch (error) {
    console.log(error);
    return handleServerError(res);
  }
};
