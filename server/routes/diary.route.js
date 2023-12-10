const express = require('express');
const { authenticate } = require('../middlewares/authentication');
const {
  addFoodToDiary,
  getMealsByDate,
  editFoodInDiary,
  deleteFoodFromDiary,
} = require('../controllers/diary.controller');
const router = express.Router();

router.use(authenticate);

router.get('/meal', getMealsByDate);
router.post('/add', addFoodToDiary);
router.put('/edit/:foodLogId', editFoodInDiary);
router.delete('/delete/:foodLogId', deleteFoodFromDiary);

module.exports = router;
