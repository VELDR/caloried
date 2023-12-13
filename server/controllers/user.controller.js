const { Sequelize } = require('sequelize');
const {
  handleResponse,
  handleServerError,
} = require('../helpers/responseHandler');
const fs = require('fs');
const path = require('path');
const { User } = require('../models');
const { editProfileValidator } = require('../validators/user.validator');
const {
  calculateAge,
  determineAgeGroup,
} = require('../helpers/functionHelper');

exports.getAllUsersPaginated = async (req, res) => {
  try {
    const defaultPageSize = 10;
    const defaultPage = 1;

    const page = parseInt(req.query.page) || defaultPage;
    const pageSize = parseInt(req.query.pageSize) || defaultPageSize;
    const sort = req.query.sort || 'id';
    const order = req.query.order || 'ASC';

    const offset = (page - 1) * pageSize;

    const { count, rows } = await User.findAndCountAll({
      attributes: { exclude: ['password'] },
      limit: pageSize,
      offset: offset,
      order: [[sort, order]],
    });

    if (rows.length === 0) {
      return handleResponse(res, 404, { message: 'No users found.' });
    }

    return handleResponse(res, 200, {
      total: count,
      users: rows,
      page,
      pageSize,
    });
  } catch (error) {
    console.log(error);
    return handleServerError(res);
  }
};

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

exports.deleteUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByPk(userId);
    if (!user) {
      return handleResponse(res, 404, { message: 'User not found.' });
    }

    await user.destroy();

    return handleResponse(res, 200, {
      deletedUser: user,
      message: 'User deleted successfully.',
    });
  } catch (error) {
    console.log(error);
    return handleServerError(res);
  }
};

exports.getUsersByAgeGroup = async (req, res) => {
  try {
    const users = await User.findAll();

    const ageGroups = {
      '0-12': { male: 0, female: 0 },
      '13-17': { male: 0, female: 0 },
      '18-24': { male: 0, female: 0 },
      '25-54': { male: 0, female: 0 },
      '55-64': { male: 0, female: 0 },
      '65+': { male: 0, female: 0 },
    };

    users.forEach((user) => {
      const age = calculateAge(user.dob);
      const ageGroup = determineAgeGroup(age);

      if (ageGroup in ageGroups) {
        ageGroups[ageGroup][user.sex] += 1;
      }
    });

    const formattedData = Object.keys(ageGroups).map((ageGroup) => ({
      ageGroup,
      ...ageGroups[ageGroup],
    }));

    return handleResponse(res, 200, formattedData);
  } catch (error) {
    console.error(error);
    return handleServerError(res);
  }
};

exports.getUserSexDistribution = async (req, res) => {
  try {
    const totalMales = await User.count({ where: { sex: 'male' } });
    const totalFemales = await User.count({ where: { sex: 'female' } });

    const data = [
      { id: 'Male', value: totalMales },
      { id: 'Female', value: totalFemales },
    ];

    return handleResponse(res, 200, data);
  } catch (error) {
    console.error(error);
    return handleServerError(res);
  }
};
