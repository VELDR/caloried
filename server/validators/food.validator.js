const Joi = require('joi');

const createFoodValidator = Joi.object({
  name: Joi.string().required().messages({
    'string.empty': 'Food name is required',
  }),
  image: Joi.string().allow(''),
  servingSize: Joi.number().integer().required().messages({
    'string.empty': 'Serving size is required',
  }),
  servingUnit: Joi.string().required().messages({
    'string.empty': 'Serving unit is required',
  }),
  calories: Joi.number().required().messages({
    'string.empty': 'Calories is required',
  }),
  fat: Joi.number().required().messages({
    'string.empty': 'Fat is required',
  }),
  carbs: Joi.number().required().messages({
    'string.empty': 'Carbs is required',
  }),
  protein: Joi.number().required().messages({
    'string.empty': 'Protein is required',
  }),
}).unknown(true);

module.exports = { createFoodValidator };
