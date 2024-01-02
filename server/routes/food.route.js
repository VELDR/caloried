const express = require('express');
const { authenticate } = require('../middlewares/authentication');
const {
  fetchFoods,
  fetchFoodDetails,
  createCustomFood,
  getUserCustomFoods,
  editCustomFood,
  deleteCustomFood,
  getAllCustomFoodsPaginated,
  deleteCustomFoodById,
} = require('../controllers/food.controller');
const { uploadImage } = require('../middlewares/multer');
const { authorizeAdmin } = require('../middlewares/authorization');
const router = express.Router();

router.use(authenticate);

router.post('/search', fetchFoods);
router.get('/:foodType/:foodName', fetchFoodDetails);
router.post('/create', uploadImage, createCustomFood);
router.get('/myFoods', getUserCustomFoods);
router.put('/myFoods/:customFoodId', uploadImage, editCustomFood);
router.delete('/myFoods/:customFoodId', deleteCustomFood);
router.get('/all', authorizeAdmin, getAllCustomFoodsPaginated);
router.delete('/delete/:customFoodId', authorizeAdmin, deleteCustomFoodById);

module.exports = router;
