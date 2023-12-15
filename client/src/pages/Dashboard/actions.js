import {
  GET_USER_ACTIVITY,
  GET_USER_CALORIES_CONSUMED,
  GET_USER_WEIGHT_ENTRIES,
  SET_USER_ACTIVITY,
  SET_USER_CALORIES_CONSUMED,
  SET_USER_WEIGHT_ENTRIES,
} from './constants';

export const getUserActivity = (token) => ({
  type: GET_USER_ACTIVITY,
  token,
});

export const setUserActivity = (activity) => ({
  type: SET_USER_ACTIVITY,
  activity,
});

export const getUserCaloriesConsumed = (days, token) => ({
  type: GET_USER_CALORIES_CONSUMED,
  days,
  token,
});

export const setUserCaloriesConsumed = (consumedCalories) => ({
  type: SET_USER_CALORIES_CONSUMED,
  consumedCalories,
});

export const getUserWeightEntries = (days, token) => ({
  type: GET_USER_WEIGHT_ENTRIES,
  days,
  token,
});

export const setUserWeightEntries = (weightEntries) => ({
  type: SET_USER_WEIGHT_ENTRIES,
  weightEntries,
});
