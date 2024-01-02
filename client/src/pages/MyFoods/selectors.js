import { createSelector } from 'reselect';
import { initialState } from '@containers/Client/reducer';

const selectMyFoodsState = (state) => state.myFoods || initialState;

export const selectMyFoods = createSelector(selectMyFoodsState, (state) => state.myFoods);
