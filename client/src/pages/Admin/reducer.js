import { produce } from 'immer';
import {
  DELETE_CUSTOM_FOOD_SUCCESS,
  DELETE_USER_SUCCESS,
  SET_ALL_CUSTOM_FOODS,
  SET_ALL_USERS,
  SET_USER_DEMOGRAPHICS,
  SET_USER_SEX_DISTRIBUTION,
} from './constants';

export const initialState = {
  users: [],
  totalUsers: 0,
  customFoods: [],
  totalCustomFoods: 0,
  demographics: null,
  sexDistribution: null,
};

export const storedKey = [];

const adminReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_ALL_USERS:
        draft.users = action.users;
        draft.totalUsers = action.totalUsers;
        break;
      case DELETE_USER_SUCCESS:
        draft.users = draft.users.filter((user) => user.id !== action.userId);
        break;
      case SET_USER_DEMOGRAPHICS:
        draft.demographics = action.demographics;
        break;
      case SET_USER_SEX_DISTRIBUTION:
        draft.sexDistribution = action.sexDistribution;
        break;
      case SET_ALL_CUSTOM_FOODS:
        draft.customFoods = action.customFoods;
        draft.totalCustomFoods = action.totalCustomFoods;
        break;
      case DELETE_CUSTOM_FOOD_SUCCESS:
        draft.customFoods = draft.customFoods.filter((food) => food.id !== action.customFoodId);
    }
  });

export default adminReducer;
