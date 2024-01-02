const { Op } = require('sequelize');
const {
  fetchNutritionixFoodsApi,
  fetchNutritionixFoodDetailsApi,
} = require('../domain/api');
const { mapFoods, mapFoodDetails } = require('../helpers/formatNutrientData');
const {
  handleServerError,
  handleResponse,
} = require('../helpers/responseHandler');
const fs = require('fs');
const path = require('path');
const { CustomFood, User, Food } = require('../models');
const redisClient = require('../utils/redisClient');
const { createFoodValidator } = require('../validators/food.validator');
const { invalidateFoodsCache } = require('../helpers/cacheHelper');

exports.fetchFoods = async (req, res) => {
  try {
    const query = req.body.query;
    const category = req.body.category;
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 5;

    const cacheKey = `foods:${query}:${category}:${page}:${pageSize}`;

    const cachedData = await redisClient.get(cacheKey);
    let formattedResponse;

    if (cachedData) {
      formattedResponse = JSON.parse(cachedData);
    } else {
      const nutritionixResponse = await fetchNutritionixFoodsApi({
        query: query,
        detailed: true,
      });

      const customFoods = await CustomFood.findAll({
        where: {
          name: {
            [Op.like]: `%${query}%`,
          },
        },
      });
      formattedResponse = mapFoods(nutritionixResponse, customFoods);

      redisClient.set(cacheKey, JSON.stringify(formattedResponse), 'EX', 10800);
      await redisClient.sadd('foodsCacheKeys', cacheKey);
    }

    const filteredResponse =
      category === 'All'
        ? formattedResponse
        : formattedResponse.filter(
            (food) => food.type === category?.toLowerCase()
          );

    const startIndex = (page - 1) * pageSize;
    const paginatedResponse = filteredResponse.slice(
      startIndex,
      startIndex + pageSize
    );

    return handleResponse(res, 200, {
      totalItems: filteredResponse.length,
      items: paginatedResponse,
    });
  } catch (error) {
    return handleServerError(res);
  }
};

exports.fetchFoodDetails = async (req, res) => {
  try {
    const { foodType, foodName } = req.params;

    const cacheKey = `foodDetails:${foodType}:${foodName.toLowerCase()}`;

    const cachedData = await redisClient.get(cacheKey);
    let foodDetails;

    if (cachedData) {
      foodDetails = JSON.parse(cachedData);
    } else {
      if (foodType === 'common') {
        const nutritionixResponse = await fetchNutritionixFoodDetailsApi({
          query: foodName,
        });
        foodDetails = mapFoodDetails(nutritionixResponse.foods);
      } else if (foodType === 'branded') {
        const nutritionixResponse = await fetchNutritionixFoodsApi({
          query: foodName,
          detailed: true,
        });
        const formattedResponse = mapFoods(nutritionixResponse);
        foodDetails = formattedResponse.find(
          (food) => food.foodName.toLowerCase() === foodName.toLowerCase()
        );
      } else if (foodType === 'custom') {
        const customFood = await CustomFood.findOne({
          where: {
            name: foodName,
          },
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['username'],
            },
          ],
        });

        if (customFood) {
          const formattedCustomFood = mapFoods({}, [customFood]);
          foodDetails = formattedCustomFood[0];
        } else {
          return handleResponse(res, 404, {
            message: 'Custom food not found.',
          });
        }
      } else {
        return handleResponse(res, 400, {
          message: 'Invalid food type specified.',
        });
      }

      redisClient.set(cacheKey, JSON.stringify(foodDetails), 'EX', 10800);
    }

    return handleResponse(res, 200, foodDetails || null);
  } catch (error) {
    return handleServerError(res);
  }
};

exports.createCustomFood = async (req, res) => {
  try {
    const userId = req.user.id;
    const foodData = req.body;

    const { error, value } = createFoodValidator.validate(foodData);
    if (error) {
      return handleResponse(res, 400, { message: error.details[0].message });
    }

    let imagePath;
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    }

    const customFood = await CustomFood.create({
      userId,
      ...value,
      image: imagePath,
    });

    const cacheKeys = await redisClient.smembers('foodsCacheKeys');
    cacheKeys.forEach((key) => redisClient.del(key));
    await redisClient.del('foodsCacheKeys');

    return handleResponse(res, 201, {
      message: 'Food created successfully!',
      food: customFood,
    });
  } catch (error) {
    return handleServerError(res);
  }
};

exports.getUserCustomFoods = async (req, res) => {
  try {
    const userId = req.user.id;

    const customFoods = await CustomFood.findAll({
      where: {
        userId: userId,
      },
    });

    if (!customFoods) {
      return handleResponse(res, 404, {
        message: 'No custom foods found for the user.',
      });
    }

    const formattedCustomFoods = customFoods.map((food) => {
      return {
        id: food.id,
        foodName: food.name,
        servingQty: 1,
        servingUnit: food.servingUnit,
        servingWeight: food.servingSize,
        nutrients: {
          calories: {
            value: food.calories,
          },
          protein: {
            value: food.protein,
          },
          carbs: {
            value: food.carbs,
          },
          fat: {
            value: food.fat,
          },
        },
        image: food.image,
      };
    });

    return handleResponse(res, 200, formattedCustomFoods);
  } catch (error) {
    return handleServerError(res);
  }
};

exports.editCustomFood = async (req, res) => {
  try {
    const userId = req.user.id;
    const customFoodId = req.params.customFoodId;
    const foodData = req.body;

    const { error, value } = createFoodValidator.validate(foodData);
    if (error) {
      return handleResponse(res, 400, { message: error.details[0].message });
    }

    const customFood = await CustomFood.findOne({
      where: {
        id: customFoodId,
        userId: userId,
      },
    });

    if (!customFood) {
      return handleResponse(res, 404, { message: 'Custom food not found.' });
    }

    let imagePath = customFood.image;

    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
      if (customFood.image) {
        const oldImagePath = path.join(__dirname, '..', customFood.image);
        fs.unlink(oldImagePath, (err) => {
          if (err) console.error('Failed to delete old image:', err);
        });
      }
    }

    const associatedFood = await Food.findOne({
      where: {
        name: customFood.name,
        servingSize: customFood.servingSize,
        servingUnit: customFood.servingUnit,
      },
    });

    if (associatedFood) {
      await associatedFood.update({
        ...value,
        image: imagePath,
      });
    }

    await customFood.update({
      ...value,
      image: imagePath,
    });

    const cacheKey = `foodDetails:custom:${customFood.name.toLowerCase()}`;
    await redisClient.del(cacheKey);
    await invalidateFoodsCache();

    return handleResponse(res, 200, {
      message: 'Food updated successfully!',
      food: customFood,
    });
  } catch (error) {
    return handleServerError(res);
  }
};

exports.deleteCustomFood = async (req, res) => {
  try {
    const userId = req.user.id;
    const customFoodId = req.params.customFoodId;

    const customFood = await CustomFood.findOne({
      where: {
        id: customFoodId,
        userId: userId,
      },
    });

    if (!customFood) {
      return handleResponse(res, 404, { message: 'Custom food not found.' });
    }

    const food = await Food.findOne({
      where: {
        name: customFood.name,
        servingSize: customFood.servingSize,
        servingUnit: customFood.servingUnit,
      },
    });

    if (food) {
      await food.destroy();
    }

    if (customFood.image) {
      const imagePath = path.join(__dirname, '..', customFood.image);
      fs.unlink(imagePath, (err) => {
        if (err) console.error('Failed to delete image file:', err);
      });
    }

    await customFood.destroy();

    const cacheKey = `foodDetails:custom:${customFood.name.toLowerCase()}`;
    await redisClient.del(cacheKey);
    await invalidateFoodsCache();

    return handleResponse(res, 200, { message: 'Food deleted successfully!' });
  } catch (error) {
    return handleServerError(res);
  }
};

exports.getAllCustomFoodsPaginated = async (req, res) => {
  try {
    const defaultPageSize = 10;
    const defaultPage = 1;

    const page = parseInt(req.query.page) || defaultPage;
    const pageSize = parseInt(req.query.pageSize) || defaultPageSize;
    const sort = req.query.sort || 'id';
    const order = req.query.order || 'ASC';

    const offset = (page - 1) * pageSize;
    const { count, rows } = await CustomFood.findAndCountAll({
      limit: pageSize,
      offset: offset,
      order: [[sort, order]],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['username'],
        },
      ],
    });

    if (rows.length === 0) {
      return handleResponse(res, 404, { message: 'No custom foods found.' });
    }

    const result = {
      total: count,
      customFoods: rows,
      page,
      pageSize,
    };

    return handleResponse(res, 200, result);
  } catch (error) {
    return handleServerError(res);
  }
};

exports.deleteCustomFoodById = async (req, res) => {
  try {
    const customFoodId = req.params.customFoodId;

    const customFood = await CustomFood.findByPk(customFoodId);

    if (!customFood) {
      return handleResponse(res, 404, { message: 'Custom food not found.' });
    }

    const food = await Food.findOne({
      where: {
        name: customFood.name,
        servingSize: customFood.servingSize,
        servingUnit: customFood.servingUnit,
      },
    });

    if (food) {
      await food.destroy();
    }

    if (customFood.image) {
      const imagePath = path.join(__dirname, '..', customFood.image);
      fs.unlink(imagePath, (err) => {
        if (err) console.error('Failed to delete image file:', err);
      });
    }

    await customFood.destroy();

    const cacheKey = `foodDetails:custom:${customFood.name.toLowerCase()}`;
    await redisClient.del(cacheKey);
    await invalidateFoodsCache();

    return handleResponse(res, 200, { message: 'Food deleted successfully!' });
  } catch (error) {
    return handleServerError(res);
  }
};
