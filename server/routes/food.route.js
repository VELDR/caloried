const express = require('express');
const { authenticate } = require('../middlewares/authentication');
const {
  fetchFoods,
  fetchFoodDetails,
} = require('../controllers/food.controller');
const router = express.Router();

router.use(authenticate);

router.post('/search', fetchFoods);
router.get('/:foodType/:foodName', fetchFoodDetails);

module.exports = router;
