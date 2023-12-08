import { produce } from 'immer';
import { SET_FOOD_DETAILS } from './constants';

export const initialState = {
  foodDetails: null,
};

export const storedKey = [];

const foodDetailsReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_FOOD_DETAILS:
        draft.foodDetails = action.foodDetails;
        break;
    }
  });

export default foodDetailsReducer;
