import { CLEAR_FOODS, CREATE_CUSTOM_FOOD, GET_FOODS, SET_CURRENT_PAGE, SET_FOODS } from './constants';

export const getFoods = (query, page, pageSize, category, token) => ({
  type: GET_FOODS,
  query,
  page,
  pageSize,
  category,
  token,
});

export const setFoods = (foods, totalItems, token) => ({
  type: SET_FOODS,
  foods,
  totalItems,
  token,
});

export const setCurrentPage = (page) => ({
  type: SET_CURRENT_PAGE,
  page,
});

export const createCustomFood = (data, token, callback) => ({
  type: CREATE_CUSTOM_FOOD,
  data,
  token,
  callback,
});

export const clearFoods = () => ({
  type: CLEAR_FOODS,
});
