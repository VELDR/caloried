const express = require('express');
const { getUserById } = require('../controllers/user.controller');
const { authenticate } = require('../middlewares/authentication');
const router = express.Router();

router.use(authenticate);

router.get('/', getUserById);

module.exports = router;
