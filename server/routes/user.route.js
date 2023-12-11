const express = require('express');
const { getUserById, editProfile } = require('../controllers/user.controller');
const { authenticate } = require('../middlewares/authentication');
const { uploadAvatar } = require('../middlewares/multer');
const router = express.Router();

router.use(authenticate);

router.get('/', getUserById);
router.put('/profile', uploadAvatar, editProfile);

module.exports = router;
