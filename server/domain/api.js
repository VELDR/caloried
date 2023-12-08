const axios = require('axios');

const baseURL = process.env.NUTRITIONIX_BASE_URL;

const callAPI = async (
  endpoint,
  method = 'GET',
  headers = {},
  params = {},
  data
) => {
  const options = {
    baseURL,
    url: endpoint,
    method,
    headers: {
      ...headers,
      'x-app-id': process.env.NUTRITIONIX_APP_ID,
      'x-app-key': process.env.NUTRITIONIX_API_KEY,
    },
    params,
    data,
  };

  const response = await axios(options);
  return response?.data;
};

const fetchNutritionixFoodsApi = (data) =>
  callAPI('/search/instant', 'POST', {}, {}, data);

const fetchNutritionixFoodDetailsApi = (data) =>
  callAPI('/natural/nutrients', 'POST', {}, {}, data);

module.exports = { fetchNutritionixFoodsApi, fetchNutritionixFoodDetailsApi };
