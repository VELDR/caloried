import { createSelector } from 'reselect';
import { initialState } from '@containers/Client/reducer';

const selectFoodSearchState = (state) => state.foodSearch || initialState;

export const selectFoods = createSelector(selectFoodSearchState, (state) => state.foods);
export const selectCurrentPage = createSelector(selectFoodSearchState, (state) => state.currentPage);
export const selectPageSize = createSelector(selectFoodSearchState, (state) => state.pageSize);
export const selectTotalItems = createSelector(selectFoodSearchState, (state) => state.totalItems);
