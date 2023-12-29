const express = require('express');
const { authenticate } = require('../middlewares/authentication');
const {
  fetchFoods,
  fetchFoodDetails,
  createCustomFood,
} = require('../controllers/food.controller');
const { uploadImage } = require('../middlewares/multer');
const router = express.Router();

router.use(authenticate);

router.post('/search', fetchFoods);
router.get('/:foodType/:foodName', fetchFoodDetails);
router.post('/create', uploadImage, createCustomFood);

module.exports = router;
