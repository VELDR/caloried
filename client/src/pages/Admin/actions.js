import {
  DELETE_USER_BY_ID,
  DELETE_USER_SUCCESS,
  GET_ALL_USERS,
  GET_USER_DEMOGRAPHICS,
  GET_USER_SEX_DISTRIBUTION,
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

export const setAllUsers = (users, total) => ({
  type: SET_ALL_USERS,
  users,
  total,
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
