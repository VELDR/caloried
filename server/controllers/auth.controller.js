const { Op } = require('sequelize');
const CryptoJS = require('crypto-js');
const {
  handleResponse,
  handleServerError,
} = require('../helpers/responseHandler');
const { hashPassword, comparePassword } = require('../utils/bcrypt');
const {
  generateVerificationToken,
  generateToken,
  verifyToken,
} = require('../utils/jwt');
const { sendVerificationEmail } = require('../utils/nodemailer');
const { User, Admin } = require('../models');
const {
  registerValidator,
  loginValidator,
} = require('../validators/auth.validator');

exports.register = async (req, res) => {
  try {
    const userData = req.body;

    const plainPassword = CryptoJS.AES.decrypt(
      userData.password,
      process.env.CRYPTOJS_SECRET
    ).toString(CryptoJS.enc.Utf8);

    userData.password = plainPassword;

    const { error, value } = registerValidator.validate(userData);
    if (error) {
      return handleResponse(res, 400, { message: error.details[0].message });
    }
    const {
      username,
      email,
      password,
      sex,
      dob,
      height,
      weight,
      goal,
      activityLevel,
    } = value;

    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ username: username }, { email: email }],
      },
    });
    if (existingUser) {
      return handleResponse(res, 400, {
        message: 'Username or email already exists',
      });
    }

    const hashedPassword = hashPassword(password);

    const newUser = await User.create({
      username,
      password: hashedPassword,
      email,
      sex,
      dob,
      height,
      weight,
      goal,
      activityLevel,
      isEmailVerified: false,
    });
    const verificationToken = generateVerificationToken(newUser);
    await newUser.update({ verificationToken });

    const verificationLink = `${process.env.BACKEND_BASE_URL}/api/auth/verify-email?token=${newUser.verificationToken}`;

    sendVerificationEmail(email, verificationLink);

    return handleResponse(res, 201, {
      user: newUser,
      message: 'Registration Successful!',
    });
  } catch (error) {
    console.log(error);
    return handleServerError(res);
  }
};

exports.resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({
      where: { email: email },
    });

    if (!user) {
      return handleResponse(res, 404, { message: 'User not found.' });
    }
    if (user.isEmailVerified) {
      return handleResponse(res, 400, { message: 'Email already verified.' });
    }

    const newVerificationToken = generateVerificationToken(user);
    await user.update({ verificationToken: newVerificationToken });

    const verificationLink = `${process.env.BACKEND_BASE_URL}/api/auth/verify-email?token=${newVerificationToken}`;

    sendVerificationEmail(email, verificationLink);

    return handleResponse(res, 200, {
      message: 'Verification email resent successfully.',
    });
  } catch (error) {
    console.log(error);
    return handleServerError(res);
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    const decoded = verifyToken(token);
    const user = await User.findByPk(decoded.id);

    if (user && user.email === decoded.email) {
      user.isEmailVerified = true;
      user.verificationToken = null;
      await user.save();
      res.redirect(`${process.env.FRONTEND_BASE_URL}/verify-success`);
    } else {
      return handleResponse(res, 400, { message: 'Invalid token.' });
    }
  } catch (error) {
    console.log(error);
    return handleServerError(res);
  }
};

exports.login = async (req, res) => {
  try {
    const userData = req.body;

    const plainPassword = CryptoJS.AES.decrypt(
      userData.password,
      process.env.CRYPTOJS_SECRET
    ).toString(CryptoJS.enc.Utf8);

    userData.password = plainPassword;

    const { error, value } = loginValidator.validate(userData);
    if (error) {
      return handleResponse(res, 400, { message: error.details[0].message });
    }

    const { email, password } = value;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return handleResponse(res, 400, {
        message: 'Invalid email or password.',
      });
    }

    if (!user.isEmailVerified) {
      return handleResponse(res, 403, {
        message:
          'Your email address is not verified. Please check your email for the verification link.',
      });
    }

    const isPasswordMatch = await comparePassword(password, user.password);
    if (!isPasswordMatch) {
      return handleResponse(res, 400, {
        message: 'Invalid email or password.',
      });
    }

    let isFirstLogin = false;
    if (user.firstLogin) {
      isFirstLogin = true;
      user.firstLogin = false;
      await user.save();
    }
    const tokenPayload = {
      id: user.id,
      role: 'user',
    };

    return handleResponse(res, 200, {
      token: generateToken(tokenPayload),
      firstLogin: isFirstLogin,
      message: 'Successfully signed in!',
    });
  } catch (error) {
    console.log(error);
    return handleServerError(res);
  }
};

exports.adminLogin = async (req, res) => {
  try {
    const userData = req.body;
    const plainPassword = CryptoJS.AES.decrypt(
      userData.password,
      process.env.CRYPTOJS_SECRET
    ).toString(CryptoJS.enc.Utf8);
    userData.password = plainPassword;

    const { error, value } = loginValidator.validate(userData);
    if (error) {
      return handleResponse(res, 400, { message: error.details[0].message });
    }

    const { email, password } = value;
    const admin = await Admin.findOne({ where: { email } });

    if (!admin) {
      return handleResponse(res, 400, {
        message: 'Invalid email or password.',
      });
    }

    const isPasswordMatch = await comparePassword(password, admin.password);
    if (!isPasswordMatch) {
      return handleResponse(res, 400, {
        message: 'Invalid email or password.',
      });
    }

    const tokenPayload = {
      id: admin.id,
      role: 'admin',
    };

    return handleResponse(res, 200, {
      token: generateToken(tokenPayload),
      message: 'Successfully signed in!',
    });
  } catch (error) {
    console.log(error);
    return handleServerError(res);
  }
};
