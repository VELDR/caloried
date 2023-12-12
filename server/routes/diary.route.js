const express = require('express');
const { authenticate } = require('../middlewares/authentication');
const {
  addFoodToDiary,
  getMealsByDate,
  editFoodInDiary,
  deleteFoodFromDiary,
  getUserYearlyActivity,
  getUserCaloriesConsumed,
} = require('../controllers/diary.controller');
const router = express.Router();

router.use(authenticate);

router.get('/meal', getMealsByDate);
router.post('/add', addFoodToDiary);
router.put('/edit/:foodLogId', editFoodInDiary);
router.delete('/delete/:foodLogId', deleteFoodFromDiary);
router.get('/activity', getUserYearlyActivity);
router.get('/calories-consumed', getUserCaloriesConsumed);

module.exports = router;
