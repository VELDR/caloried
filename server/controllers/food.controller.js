const {
  fetchNutritionixFoodsApi,
  fetchNutritionixFoodDetailsApi,
} = require('../domain/api');
const { mapFoods, mapFoodDetails } = require('../helpers/formatNutrientData');
const {
  handleServerError,
  handleResponse,
} = require('../helpers/responseHandler');

exports.fetchFoods = async (req, res) => {
  try {
    const query = req.body.query;
    const category = req.body.category;
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 5;

    const nutritionixResponse = await fetchNutritionixFoodsApi({
      query: query,
      detailed: true,
    });

    const formattedResponse = mapFoods(nutritionixResponse);

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
    console.log(error);
    return handleServerError(res);
  }
};

exports.fetchFoodDetails = async (req, res) => {
  try {
    const { foodType, foodName } = req.params;

    let foodDetails;

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

    return handleResponse(res, 200, foodDetails || null);
  } catch (error) {
    console.log(error);
    return handleServerError(res);
  }
};
