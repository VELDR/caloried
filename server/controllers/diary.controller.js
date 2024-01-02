const { Op } = require('sequelize');
const {
  handleResponse,
  handleServerError,
} = require('../helpers/responseHandler');
const { Meal, FoodLog, Food, sequelize, Diary } = require('../models');
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

    const caloriesPerServing = calories / quantity;
    const fatPerServing = fat / quantity;
    const carbsPerServing = carbs / quantity;
    const proteinPerServing = protein / quantity;

    const [meal, mealCreated] = await Meal.findOrCreate({
      where: { diaryId: userId, date, mealType },
      transaction,
    });
    const [food, foodCreated] = await Food.findOrCreate({
      where: { name, servingSize, servingUnit },
      defaults: {
        image,
        calories: caloriesPerServing,
        fat: fatPerServing,
        carbs: carbsPerServing,
        protein: proteinPerServing,
      },
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
    const mealId = foodLog.mealId;
    await foodLog.destroy();

    const isFoodAssociated = await FoodLog.findOne({
      where: { foodId: foodId },
    });

    if (!isFoodAssociated) {
      await Food.destroy({ where: { id: foodId } });
    }

    const remainingFoodLogs = await FoodLog.count({
      where: { mealId: mealId },
    });

    if (remainingFoodLogs === 0) {
      await Meal.destroy({ where: { id: mealId } });
    }

    return handleResponse(res, 200, { message: 'Meal removed.' });
  } catch (error) {
    return handleServerError(res);
  }
};

exports.getUserYearlyActivity = async (req, res) => {
  try {
    const userId = req.user.id;
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const activities = await Meal.findAll({
      include: [
        {
          model: Diary,
          as: 'diary',
          where: { userId: userId },
          attributes: [],
        },
        {
          model: FoodLog,
          as: 'foodLogs',
          attributes: [],
        },
      ],
      where: {
        date: {
          [Op.gte]: oneYearAgo,
        },
      },
      group: ['Meal.date'],
      attributes: [
        [sequelize.literal('DATE_FORMAT(Meal.date, "%Y-%m-%d")'), 'day'],
        [sequelize.fn('COUNT', sequelize.col('foodLogs.id')), 'value'],
      ],
      order: [['date', 'ASC']],
    });

    return handleResponse(res, 200, activities);
  } catch (error) {
    return handleServerError(res);
  }
};

exports.getUserCaloriesConsumed = async (req, res) => {
  try {
    const userId = req.user.id;
    const days = req.query.days ? parseInt(req.query.days) : 7;
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - (days - 1));

    const caloriesConsumed = await Meal.findAll({
      include: [
        {
          model: Diary,
          as: 'diary',
          where: { userId: userId },
          attributes: [],
        },
        {
          model: FoodLog,
          as: 'foodLogs',
          include: [
            {
              model: Food,
              as: 'food',
              attributes: [],
            },
          ],
          attributes: ['quantity'],
        },
      ],
      where: {
        date: {
          [Op.between]: [startDate, endDate],
        },
      },
      group: ['Meal.date'],
      attributes: [
        'date',
        [
          sequelize.fn(
            'SUM',
            sequelize.literal(
              '`foodLogs->food`.`calories` * `foodLogs`.`quantity`'
            )
          ),
          'totalCalories',
        ],
      ],
      order: [['date', 'ASC']],
    });

    let formattedData = [];
    for (
      let d = new Date(startDate);
      d <= endDate;
      d.setDate(d.getDate() + 1)
    ) {
      const formattedDate = d.toISOString().split('T')[0];
      const found = caloriesConsumed.find((day) => day.date === formattedDate);

      formattedData.push({
        x: formattedDate,
        y: found ? Math.round(found.dataValues.totalCalories) : 0,
      });
    }
    return handleResponse(res, 200, formattedData);
  } catch (error) {
    return handleServerError(res);
  }
};
