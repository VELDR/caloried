const express = require('express');
const {
  register,
  login,
  verifyEmail,
  resendVerificationEmail,
  adminLogin,
  changePassword,
} = require('../controllers/auth.controller');
const { authenticate } = require('../middlewares/authentication');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/admin-login', adminLogin);

router.post('/resend-verification', resendVerificationEmail);
router.get('/verify-email', verifyEmail);

router.put('/change-password', authenticate, changePassword);

module.exports = router;
