import { createSelector } from 'reselect';
import { initialState } from '@containers/Client/reducer';

const selectDiaryState = (state) => state.diary || initialState;

export const selectUser = createSelector(selectDiaryState, (state) => state.user);
export const selectMeals = createSelector(selectDiaryState, (state) => state.meals);
export const selectSelectedMealType = createSelector(selectDiaryState, (state) => state.selectedMealType);
export const selectSelectedDate = createSelector(selectDiaryState, (state) => state.selectedDate);
