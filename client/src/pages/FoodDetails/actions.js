import { ADD_FOOD_TO_DIARY, GET_FOOD_DETAILS, SET_FOOD_DETAILS } from './constants';

export const getFoodDetails = (foodType, foodName, token) => ({
  type: GET_FOOD_DETAILS,
  foodType,
  foodName,
  token,
});

export const setFoodDetails = (foodDetails) => ({
  type: SET_FOOD_DETAILS,
  foodDetails,
});

export const addFoodToDiary = (foodData, token) => ({
  type: ADD_FOOD_TO_DIARY,
  foodData,
  token,
});
