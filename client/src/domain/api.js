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
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
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

// USER
export const getUserByIdApi = (token) => callAPI(`${endpoints.user}`, 'GET', { Authorization: `Bearer ${token}` });
export const editProfileApi = (data, token) =>
  callAPI(`${endpoints.user}/profile`, 'PUT', { Authorization: `Bearer ${token}` }, {}, data);

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

// DIARY
export const getMealsByDateApi = (date, token) =>
  callAPI(`${endpoints.diary}/meal?date=${date}`, 'GET', { Authorization: `Bearer ${token}` });
export const addFoodToDiaryApi = (foodData, token) =>
  callAPI(`${endpoints.diary}/add`, 'POST', { Authorization: `Bearer ${token}` }, {}, foodData);
export const editFoodInDiaryApi = (foodData, foodLogId, token) =>
  callAPI(`${endpoints.diary}/edit/${foodLogId}`, 'PUT', { Authorization: `Bearer ${token}` }, {}, foodData);
export const deleteFoodFromDiaryApi = (foodLogId, token) =>
  callAPI(`${endpoints.diary}/delete/${foodLogId}`, 'DELETE', { Authorization: `Bearer ${token}` });
