const express = require('express');
const {
  getUserById,
  editProfile,
  getAllUsersPaginated,
  deleteUserById,
  getUsersByAgeGroup,
  getUserSexDistribution,
} = require('../controllers/user.controller');
const { authenticate } = require('../middlewares/authentication');
const { uploadAvatar } = require('../middlewares/multer');
const { authorizeAdmin } = require('../middlewares/authorization');
const router = express.Router();

router.use(authenticate);

router.get('/', getUserById);
router.put('/profile', uploadAvatar, editProfile);

router.get('/all', authorizeAdmin, getAllUsersPaginated);
router.delete('/delete/:userId', authorizeAdmin, deleteUserById);

router.get('/demographic', authorizeAdmin, getUsersByAgeGroup);
router.get('/sex-distribution', authorizeAdmin, getUserSexDistribution);

module.exports = router;
