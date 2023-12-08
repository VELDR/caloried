import { GET_FOODS, SET_CURRENT_PAGE, SET_FOODS } from './constants';

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
