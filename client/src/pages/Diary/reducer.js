import { produce } from 'immer';
import {
  RESET_SELECTION,
  SET_DATE,
  SET_DELETE_FOOD_FROM_DIARY,
  SET_MEALS_BY_DATE,
  SET_MEAL_TYPE,
  SET_USER,
} from './constants';

export const initialState = {
  user: null,
  meals: null,
  selectedMealType: null,
  selectedDate: null,
};

export const storedKey = ['selectedMealType', 'selectedDate'];

const diaryReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_USER:
        draft.user = action.user;
        break;
      case SET_MEALS_BY_DATE:
        draft.meals = action.meals;
        break;
      case SET_MEAL_TYPE:
        draft.selectedMealType = action.mealType;
        break;
      case SET_DATE:
        draft.selectedDate = action.date;
        break;
      case RESET_SELECTION:
        draft.selectedMealType = null;
        draft.selectedDate = null;
        break;
      case SET_DELETE_FOOD_FROM_DIARY:
        draft.meals.forEach((meal) => {
          meal.foodLogs = meal.foodLogs.filter((foodLog) => foodLog.id !== action.foodLogId);
        });
        break;
    }
  });

export default diaryReducer;
