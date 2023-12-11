const Joi = require('joi');

const editProfileValidator = Joi.object({
  username: Joi.string().min(3).max(20).required().messages({
    'string.base': 'Username must be a string',
    'string.min': 'Username must be at least {#limit} characters long',
    'string.max': 'Username cannot be more than {#limit} characters long',
    'string.empty': 'Username is required',
  }),
  email: Joi.string().email().required().messages({
    'string.base': 'Email must be a string',
    'string.email': 'Email must be a valid email',
    'string.empty': 'Email is required',
  }),
  avatar: Joi.string().allow(''),
  sex: Joi.string()
    .valid('male', 'female')
    .required()
    .messages({ 'any.only': 'Please select a your sex' }),
  dob: Joi.date()
    .less('now')
    .required()
    .messages({ 'date.less': 'Invalid date of birth.' }),
  height: Joi.number().min(120).max(250).required().messages({
    'number.min': 'Height must be greater than or equal to {#limit}',
    'number.max': 'Height must be less than or equal to {#limit}',
  }),
  weight: Joi.number().min(20).max(400).required().messages({
    'number.min': 'Weight must be greater than or equal to {#limit}',
    'number.max': 'Weight must be less than or equal to {#limit}',
  }),
  goal: Joi.string()
    .valid('gain', 'lose', 'maintain')
    .required()
    .messages({ 'any.only': 'Please select a goal' }),
  activityLevel: Joi.number().valid(1, 2, 3, 4, 5).required().messages({
    'any.only': 'Please select an activity level',
  }),
});

module.exports = { editProfileValidator };
