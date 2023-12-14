const { Op } = require('sequelize');
const CryptoJS = require('crypto-js');
const {
  handleResponse,
  handleServerError,
} = require('../helpers/responseHandler');
const { hashPassword, comparePassword } = require('../utils/bcrypt');
const {
  generateToken,
  verifyToken,
  generateEmailVerificationToken,
  generateForgotPasswordToken,
} = require('../utils/jwt');
const {
  sendOTPVerificationEmail,
  sendPasswordResetEmail,
} = require('../utils/nodemailer');
const { User, Admin } = require('../models');
const {
  registerValidator,
  loginValidator,
  changePasswordValidator,
  resetPasswordValidator,
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
    const OTP = Math.floor(1000 + Math.random() * 9000).toString();
    await sendOTPVerificationEmail(email, OTP);
    const verificationToken = generateEmailVerificationToken(OTP, email);
    await newUser.update({ verificationToken });

    return handleResponse(res, 201, {
      user: newUser,
      message: 'Registration Successful! Please verify your email.',
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

    const newOTP = Math.floor(1000 + Math.random() * 9000).toString();

    const newVerificationToken = generateEmailVerificationToken(newOTP, email);
    await user.update({ verificationToken: newVerificationToken });

    await sendOTPVerificationEmail(email, newOTP);

    return handleResponse(res, 200, { message: 'Verification OTP resent.' });
  } catch (error) {
    console.log(error);
    return handleServerError(res);
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { otp, email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return handleResponse(res, 404, { message: 'User not found.' });
    }
    try {
      const decoded = verifyToken(user.verificationToken);

      if (decoded.otp === otp && decoded.email === email) {
        user.isEmailVerified = true;
        user.verificationToken = null;
        await user.save();
        return handleResponse(res, 200, { message: 'Verification Success!' });
      } else {
        return handleResponse(res, 400, { message: 'Invalid OTP.' });
      }
    } catch (error) {
      return handleResponse(res, 400, {
        message: 'Verification failed. OTP is expired.',
      });
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
          'Your email address is not verified. Please check your email for the verification OTP.',
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

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    const { error, value } = changePasswordValidator.validate({
      currentPassword,
      newPassword,
    });

    if (error) {
      return handleResponse(res, 400, { message: error.details[0].message });
    }

    const user = await User.findByPk(userId);

    const isPasswordMatch = await comparePassword(
      value.currentPassword,
      user.password
    );

    if (!isPasswordMatch) {
      return handleResponse(res, 400, {
        message: 'Current password is incorrect',
      });
    }

    const hashedNewPassword = hashPassword(value.newPassword);
    await user.update({ password: hashedNewPassword });

    return handleResponse(res, 200, {
      message: 'Password changed successfully',
    });
  } catch (error) {
    return handleServerError(res);
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    console.log(email, '<<<<EMAIL');
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return handleResponse(res, 404, { message: 'Email not registered.' });
    }
    const token = generateForgotPasswordToken(email);

    await sendPasswordResetEmail(email, token);

    return handleResponse(res, 200, {
      message: 'Reset password link sent via email',
    });
  } catch (error) {
    console.log(error);
    return handleServerError(res);
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const userData = req.body;

    const plainPassword = CryptoJS.AES.decrypt(
      userData.newPassword,
      process.env.CRYPTOJS_SECRET
    ).toString(CryptoJS.enc.Utf8);

    userData.newPassword = plainPassword;

    const { error, value } = resetPasswordValidator.validate(userData);
    if (error) {
      return handleResponse(res, 400, { message: error.details[0].message });
    }

    const { email, newPassword, token } = value;

    try {
      const decoded = verifyToken(token);
      console.log(decoded, token);
    } catch (error) {
      return handleResponse(res, 400, { message: 'Token expired.' });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return handleResponse(res, 404, { message: 'Email not registered.' });
    }

    await User.update(
      { password: hashPassword(newPassword) },
      { where: { email: email } }
    );

    return handleResponse(res, 200, { message: 'Password reset successful.' });
  } catch (error) {
    return handleServerError(res);
  }
};
