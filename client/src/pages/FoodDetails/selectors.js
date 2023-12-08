import { createSelector } from 'reselect';
import { initialState } from '@containers/Client/reducer';

const selectFoodDetailsState = (state) => state.foodDetails || initialState;

export const selectFoodDetails = createSelector(selectFoodDetailsState, (state) => state.foodDetails);
