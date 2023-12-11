const { Sequelize } = require('sequelize');
const {
  handleResponse,
  handleServerError,
} = require('../helpers/responseHandler');
const fs = require('fs');
const path = require('path');
const { User } = require('../models');
const { editProfileValidator } = require('../validators/user.validator');

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

exports.editProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const profileData = req.body;

    const { error, value } = editProfileValidator.validate(profileData);
    if (error) {
      return handleResponse(res, 400, { message: error.details[0].message });
    }

    const { username, email, sex, dob, height, weight, activityLevel, goal } =
      value;

    const currentUser = await User.findOne({ where: { id: userId } });
    if (!currentUser) {
      return handleResponse(res, 404, { message: 'User not found' });
    }

    let avatarPath;
    if (req.file) {
      avatarPath = `/uploads/${req.file.filename}`;

      if (currentUser.avatar) {
        const oldAvatarPath = path.join(__dirname, '..', currentUser.avatar);
        fs.unlink(oldAvatarPath, (err) => {
          if (err) console.error('Failed to delete old avatar image:', err);
        });
      }
    }

    await User.update(
      {
        username,
        email,
        sex,
        dob,
        height,
        weight,
        activityLevel,
        goal,
        avatar: avatarPath || Sequelize.literal('avatar'),
      },
      { where: { id: userId }, individualHooks: true }
    );

    const updatedUser = await User.findOne({ where: { id: userId } });

    return handleResponse(res, 200, {
      user: updatedUser,
      message: 'Profile updated successfully!',
    });
  } catch (error) {
    console.log(error);
    return handleServerError(res);
  }
};
