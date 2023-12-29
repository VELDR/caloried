import config from '@config/index';
import { merge } from 'lodash';

import request from '@utils/request';

const endpoints = {
  ping: 'ping.json',
  auth: 'auth',
  user: 'user',
  food: 'food',
  diary: 'diary',
};

export const callAPI = async (endpoint, method, header = {}, params = {}, data = {}) => {
  const defaultHeader = {
    'Content-Type': 'application/json; charset=UTF-8',
  };

  const headers = merge(defaultHeader, header);
  const options = {
    url: config.api.host + endpoint,
    method,
    headers,
    data,
    params,
  };

  return request(options).then((response) => {
    const responseAPI = response.data;
    return responseAPI;
  });
};

export const ping = () => callAPI(endpoints.ping, 'get');

// AUTH
export const registerApi = (data) => callAPI(`${endpoints.auth}/register`, 'POST', {}, {}, data);
export const resendVerificationEmailApi = (data) =>
  callAPI(`${endpoints.auth}/resend-verification`, 'POST', {}, {}, data);
export const loginApi = (data) => callAPI(`${endpoints.auth}/login`, 'POST', {}, {}, data);
export const adminLoginApi = (data) => callAPI(`${endpoints.auth}/admin-login`, 'POST', {}, {}, data);
export const changePasswordApi = (data, token) =>
  callAPI(`${endpoints.auth}/change-password`, 'PUT', { Authorization: `Bearer ${token}` }, {}, data);
export const verifyOTPApi = (data) => callAPI(`${endpoints.auth}/verify-email`, 'POST', {}, {}, data);
export const resetPasswordApi = (data) => callAPI(`${endpoints.auth}/reset-password`, 'PUT', {}, {}, data);
export const forgotPasswordApi = (data) => callAPI(`${endpoints.auth}/forgot-password`, 'POST', {}, {}, data);

// USER
export const getUserByIdApi = (token) => callAPI(`${endpoints.user}`, 'GET', { Authorization: `Bearer ${token}` });
export const editProfileApi = (data, token) =>
  callAPI(
    `${endpoints.user}/profile`,
    'PUT',
    { Authorization: `Bearer ${token}`, 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    {},
    data
  );
export const getAllUsersPaginatedApi = (page, pageSize, token, sort, order) =>
  callAPI(`${endpoints.user}/all?page=${page}&pageSize=${pageSize}&sort=${sort}&order=${order}`, 'GET', {
    Authorization: `Bearer ${token}`,
  });
export const deleteUserByIdApi = (userId, token) =>
  callAPI(`${endpoints.user}/delete/${userId}`, 'DELETE', { Authorization: `Bearer ${token}` });
export const getUserDemographicsApi = (token) =>
  callAPI(`${endpoints.user}/demographic`, 'GET', { Authorization: `Bearer ${token}` });
export const getUserSexDistributionApi = (token) =>
  callAPI(`${endpoints.user}/sex-distribution`, 'GET', { Authorization: `Bearer ${token}` });
export const getUserWeightEntriesApi = (days, token) =>
  callAPI(`${endpoints.user}/weight-tracking?days=${days}`, 'GET', { Authorization: `Bearer ${token}` });

// FOOD
export const getFoodsApi = (query, page, pageSize, token, category) =>
  callAPI(
    `${endpoints.food}/search?page=${page}&pageSize=${pageSize}`,
    'POST',
    { Authorization: `Bearer ${token}` },
    {},
    { query, category }
  );
export const getFoodDetailsApi = (foodType, foodName, token) =>
  callAPI(`${endpoints.food}/${foodType}/${foodName}`, 'GET', { Authorization: `Bearer ${token}` });
export const createCustomFoodApi = (data, token) =>
  callAPI(
    `${endpoints.food}/create`,
    'POST',
    {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    },
    {},
    data
  );

// DIARY
export const getMealsByDateApi = (date, token) =>
  callAPI(`${endpoints.diary}/meal?date=${date}`, 'GET', { Authorization: `Bearer ${token}` });
export const addFoodToDiaryApi = (foodData, token) =>
  callAPI(`${endpoints.diary}/add`, 'POST', { Authorization: `Bearer ${token}` }, {}, foodData);
export const editFoodInDiaryApi = (foodData, foodLogId, token) =>
  callAPI(`${endpoints.diary}/edit/${foodLogId}`, 'PUT', { Authorization: `Bearer ${token}` }, {}, foodData);
export const deleteFoodFromDiaryApi = (foodLogId, token) =>
  callAPI(`${endpoints.diary}/delete/${foodLogId}`, 'DELETE', { Authorization: `Bearer ${token}` });
export const getUserActivityApi = (token) =>
  callAPI(`${endpoints.diary}/activity`, 'GET', { Authorization: `Bearer ${token}` });
export const getUserCaloriesConsumedApi = (days, token) =>
  callAPI(`${endpoints.diary}/calories-consumed?days=${days}`, 'GET', { Authorization: `Bearer ${token}` });
