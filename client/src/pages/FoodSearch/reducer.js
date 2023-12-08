import { produce } from 'immer';
import { SET_CURRENT_PAGE, SET_FOODS } from './constants';

export const initialState = {
  foods: null,
  totalItems: 0,
  currentPage: 1,
  pageSize: 5,
};

export const storedKey = [];

const foodSearchReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_FOODS:
        draft.foods = action.foods;
        draft.totalItems = action.totalItems;
        break;
      case SET_CURRENT_PAGE:
        draft.currentPage = action.page;
        break;
    }
  });

export default foodSearchReducer;
