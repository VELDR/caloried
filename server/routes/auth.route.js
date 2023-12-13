const express = require('express');
const {
  register,
  login,
  verifyEmail,
  resendVerificationEmail,
  adminLogin,
} = require('../controllers/auth.controller');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/admin-login', adminLogin);

router.post('/resend-verification', resendVerificationEmail);
router.get('/verify-email', verifyEmail);

module.exports = router;
