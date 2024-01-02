import {
  DELETE_CUSTOM_FOOD_BY_ID,
  DELETE_CUSTOM_FOOD_SUCCESS,
  DELETE_USER_BY_ID,
  DELETE_USER_SUCCESS,
  GET_ALL_CUSTOM_FOODS,
  GET_ALL_USERS,
  GET_USER_DEMOGRAPHICS,
  GET_USER_SEX_DISTRIBUTION,
  SET_ALL_CUSTOM_FOODS,
  SET_ALL_USERS,
  SET_USER_DEMOGRAPHICS,
  SET_USER_SEX_DISTRIBUTION,
} from './constants';

export const getAllUsers = (page, pageSize, token, sort, order) => ({
  type: GET_ALL_USERS,
  page,
  pageSize,
  token,
  sort,
  order,
});

export const setAllUsers = (users, totalUsers) => ({
  type: SET_ALL_USERS,
  users,
  totalUsers,
});

export const deleteUserById = (userId, token) => ({
  type: DELETE_USER_BY_ID,
  userId,
  token,
});

export const deleteUserSuccess = (userId) => ({
  type: DELETE_USER_SUCCESS,
  userId,
});

export const getUserDemographics = (token) => ({
  type: GET_USER_DEMOGRAPHICS,
  token,
});

export const setUserDemographics = (demographics) => ({
  type: SET_USER_DEMOGRAPHICS,
  demographics,
});

export const getUserSexDistribution = (token) => ({
  type: GET_USER_SEX_DISTRIBUTION,
  token,
});

export const setUserSexDistribution = (sexDistribution) => ({
  type: SET_USER_SEX_DISTRIBUTION,
  sexDistribution,
});

export const getAllCustomFoods = (page, pageSize, token, sort, order) => ({
  type: GET_ALL_CUSTOM_FOODS,
  page,
  pageSize,
  token,
  sort,
  order,
});

export const setAllCustomFoods = (customFoods, totalCustomFoods) => ({
  type: SET_ALL_CUSTOM_FOODS,
  customFoods,
  totalCustomFoods,
});

export const deleteCustomFoodById = (customFoodId, token) => ({
  type: DELETE_CUSTOM_FOOD_BY_ID,
  customFoodId,
  token,
});

export const deleteCustomFoodSuccess = (customFoodId) => ({
  type: DELETE_CUSTOM_FOOD_SUCCESS,
  customFoodId,
});
