const Joi = require('joi');

const addFoodToDiaryValidator = Joi.object({
  name: Joi.string().trim().required(),
  servingSize: Joi.number().positive().required(),
  servingUnit: Joi.string().trim().required(),
  image: Joi.string().trim().required(),
  calories: Joi.number().positive().required(),
  fat: Joi.number().required(),
  carbs: Joi.number().required(),
  protein: Joi.number().required(),
  quantity: Joi.number().positive().integer().min(1).required(),
  date: Joi.date().iso().required(),
  mealType: Joi.string()
    .valid('Breakfast', 'Lunch', 'Dinner', 'Snack')
    .required(),
});

const editFoodInDiaryValidator = Joi.object({
  quantity: Joi.number().positive().integer().min(1).required(),
  date: Joi.date().iso().required(),
  mealType: Joi.string()
    .valid('Breakfast', 'Lunch', 'Dinner', 'Snack')
    .required(),
});

module.exports = { addFoodToDiaryValidator, editFoodInDiaryValidator };
