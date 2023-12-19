const {
  fetchNutritionixFoodsApi,
  fetchNutritionixFoodDetailsApi,
} = require('../domain/api');
const { mapFoods, mapFoodDetails } = require('../helpers/formatNutrientData');
const {
  handleServerError,
  handleResponse,
} = require('../helpers/responseHandler');
const redisClient = require('../utils/redisClient');

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
      formattedResponse = mapFoods(nutritionixResponse);

      redisClient.set(cacheKey, JSON.stringify(formattedResponse), 'EX', 10800);
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
