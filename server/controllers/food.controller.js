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
const { CustomFood, User } = require('../models');
const redisClient = require('../utils/redisClient');
const { createFoodValidator } = require('../validators/food.validator');

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
