import { DELETE_CUSTOM_FOOD, EDIT_CUSTOM_FOOD, GET_MY_FOODS, SET_MY_FOODS } from './constants';

export const getMyFoods = (token) => ({
  type: GET_MY_FOODS,
  token,
});

export const setMyFoods = (myFoods) => ({
  type: SET_MY_FOODS,
  myFoods,
});

export const editCustomFood = (customFoodId, food, token, callback) => ({
  type: EDIT_CUSTOM_FOOD,
  customFoodId,
  food,
  token,
  callback,
});

export const deleteCustomFood = (customFoodId, token) => ({
  type: DELETE_CUSTOM_FOOD,
  customFoodId,
  token,
});
