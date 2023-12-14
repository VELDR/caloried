const express = require('express');
const {
  register,
  login,
  verifyEmail,
  resendVerificationEmail,
  adminLogin,
  changePassword,
  resetPassword,
  forgotPassword,
} = require('../controllers/auth.controller');
const { authenticate } = require('../middlewares/authentication');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/admin-login', adminLogin);

router.post('/resend-verification', resendVerificationEmail);
router.post('/verify-email', verifyEmail);

router.put('/change-password', authenticate, changePassword);
router.put('/reset-password', resetPassword);
router.post('/forgot-password', forgotPassword);

module.exports = router;
