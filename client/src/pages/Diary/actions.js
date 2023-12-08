import {
  GET_MEALS_BY_DATE,
  GET_USER,
  RESET_SELECTION,
  SET_DATE,
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
