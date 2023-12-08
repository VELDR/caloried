const express = require('express');
const { authenticate } = require('../middlewares/authentication');
const {
  addFoodToDiary,
  getMealsByDate,
} = require('../controllers/diary.controller');
const router = express.Router();

router.use(authenticate);

router.get('/meal', getMealsByDate);
router.post('/add', addFoodToDiary);

module.exports = router;
