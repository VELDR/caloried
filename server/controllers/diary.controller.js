const {
  handleResponse,
  handleServerError,
} = require('../helpers/responseHandler');
const { Meal, FoodLog, Food, sequelize } = require('../models');
const { addFoodToDiaryValidator } = require('../validators/diary.validator');

exports.getMealsByDate = async (req, res) => {
  try {
    const userId = req.user.id;
    const { date } = req.query;

    const meals = await Meal.findAll({
      where: { diaryId: userId, date: new Date(date) },
      include: [
        {
          model: FoodLog,
          as: 'foodLogs',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          include: [
            {
              model: Food,
              as: 'food',
              attributes: {
                exclude: ['id', 'isAdminAdded', 'createdAt', 'updatedAt'],
              },
            },
          ],
        },
      ],
    });

    if (!meals) {
      return handleResponse(res, 404, { message: 'Meals not found.' });
    }

    return handleResponse(res, 200, meals);
  } catch (error) {
    console.error('Error fetching meals:', error);
    return handleServerError(res);
  }
};

exports.addFoodToDiary = async (req, res) => {
  const userId = req.user.id;
  const foodData = req.body;

  const { error, value } = addFoodToDiaryValidator.validate(foodData);

  if (error) {
    return handleResponse(res, 400, { message: error.details[0].message });
  }

  const {
    name,
    servingSize,
    servingUnit,
    image,
    calories,
    fat,
    carbs,
    protein,
    quantity,
    date,
    mealType,
  } = value;

  const transaction = await sequelize.transaction();

  try {
    const [meal, mealCreated] = await Meal.findOrCreate({
      where: { diaryId: userId, date, mealType },
      transaction,
      logging: console.log,
    });

    const [food, foodCreated] = await Food.findOrCreate({
      where: { name, servingSize, servingUnit },
      defaults: { image, calories, fat, carbs, protein },
      transaction,
    });

    await FoodLog.create(
      { mealId: meal.id, foodId: food.id, quantity },
      { transaction }
    );

    await transaction.commit();
    return handleResponse(res, 200, {
      message: 'Food added to diary successfully',
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error in adding food to diary: ', error);
    return handleServerError(res);
  }
};
