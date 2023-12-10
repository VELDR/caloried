const {
  handleResponse,
  handleServerError,
} = require('../helpers/responseHandler');
const { Meal, FoodLog, Food, sequelize } = require('../models');
const {
  addFoodToDiaryValidator,
  editFoodInDiaryValidator,
} = require('../validators/diary.validator');

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
  try {
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

    const [meal, mealCreated] = await Meal.findOrCreate({
      where: { diaryId: userId, date, mealType },
      transaction,
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
      message: 'Food added to diary.',
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error in adding food to diary: ', error);
    return handleServerError(res);
  }
};

exports.editFoodInDiary = async (req, res) => {
  try {
    const userId = req.user.id;
    const foodLogId = req.params.foodLogId;
    const updatedData = req.body;

    const { error, value } = editFoodInDiaryValidator.validate(updatedData);

    if (error) {
      return handleResponse(res, 400, { message: error.details[0].message });
    }

    const { quantity, date, mealType } = value;

    const foodLog = await FoodLog.findOne({
      where: { id: foodLogId },
      include: {
        model: Meal,
        as: 'meal',
        where: { diaryId: userId },
      },
    });

    if (!foodLog) {
      return handleResponse(res, 404, { message: 'Meal not found.' });
    }

    const oldMealId = foodLog.mealId;

    const [newMeal] = await Meal.findOrCreate({
      where: { diaryId: userId, date, mealType },
    });

    await foodLog.update({ quantity, mealId: newMeal.id });

    const updatedFoodLog = await Meal.findByPk(foodLog.mealId, {
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

    const oldMealFoodLogs = await FoodLog.count({
      where: { mealId: oldMealId },
    });
    if (oldMealFoodLogs === 0) {
      await Meal.destroy({ where: { id: oldMealId } });
    }

    return handleResponse(res, 200, {
      message: 'Meal updated.',
      updatedFoodLogData: updatedFoodLog,
    });
  } catch (error) {
    console.error('Error in editing food in diary: ', error);
    return handleServerError(res);
  }
};

exports.deleteFoodFromDiary = async (req, res) => {
  try {
    const userId = req.user.id;
    const foodLogId = req.params.foodLogId;

    const foodLog = await FoodLog.findOne({
      where: { id: foodLogId },
      include: [
        {
          model: Meal,
          as: 'meal',
          where: { diaryId: userId },
        },
        {
          model: Food,
          as: 'food',
        },
      ],
    });

    if (!foodLog) {
      return handleResponse(res, 404, { message: 'Meal not found.' });
    }

    const foodId = foodLog.foodId;
    await foodLog.destroy();

    const isFoodAssociated = await FoodLog.findOne({
      where: { foodId: foodId },
    });

    if (!isFoodAssociated) {
      await Food.destroy({ where: { id: foodId } });
    }

    return handleResponse(res, 200, { message: 'Meal removed.' });
  } catch (error) {
    console.error('Error in deleting food from diary: ', error);
    return handleServerError(res);
  }
};
