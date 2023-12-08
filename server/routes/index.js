const express = require('express');
const authRoute = require('./auth.route.js');
const userRoute = require('./user.route.js');
const foodRoute = require('./food.route.js');
const diaryRoute = require('./diary.route.js');
const router = express.Router();

router.use('/auth', authRoute);
router.use('/user', userRoute);
router.use('/food', foodRoute);
router.use('/diary', diaryRoute);

module.exports = router;
