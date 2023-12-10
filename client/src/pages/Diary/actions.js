import {
  DELETE_FOOD_FROM_DIARY,
  EDIT_FOOD_IN_DIARY,
  GET_MEALS_BY_DATE,
  GET_USER,
  RESET_SELECTION,
  SET_DATE,
  SET_DELETE_FOOD_FROM_DIARY,
  SET_EDIT_FOOD_IN_DIARY,
  SET_MEALS_BY_DATE,
  SET_MEAL_TYPE,
  SET_USER,
} from './constants';

export const getUser = (token) => ({
  type: GET_USER,
  token,
});

export const setUser = (user, token) => ({
  type: SET_USER,
  user,
  token,
});

export const getMealsByDate = (date, token) => ({
  type: GET_MEALS_BY_DATE,
  date,
  token,
});

export const setMealsByDate = (meals, token) => ({
  type: SET_MEALS_BY_DATE,
  meals,
  token,
});

export const setMealType = (mealType) => ({
  type: SET_MEAL_TYPE,
  mealType,
});

export const setDate = (date) => ({
  type: SET_DATE,
  date,
});

export const resetSelection = () => ({
  type: RESET_SELECTION,
});

export const editFoodInDiary = (foodData, foodLogId, token, originalDate) => ({
  type: EDIT_FOOD_IN_DIARY,
  foodData,
  foodLogId,
  token,
  originalDate,
});

export const setEditFoodInDiary = (foodLogId, updatedFoodLogData) => ({
  type: SET_EDIT_FOOD_IN_DIARY,
  foodLogId,
  updatedFoodLogData,
});

export const deleteFoodFromDiary = (foodLogId, token) => ({
  type: DELETE_FOOD_FROM_DIARY,
  foodLogId,
  token,
});

export const setDeleteFoodFromDiary = (foodLogId) => ({
  type: SET_DELETE_FOOD_FROM_DIARY,
  foodLogId,
});
