import { produce } from 'immer';
import { SET_MY_FOODS } from './constants';

export const initialState = {
  myFoods: [],
};

export const storedKey = [];

const myFoodsReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_MY_FOODS:
        draft.myFoods = action.myFoods;
        break;
    }
  });

export default myFoodsReducer;
