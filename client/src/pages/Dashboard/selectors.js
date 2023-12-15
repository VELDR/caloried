import { createSelector } from 'reselect';
import { initialState } from '@containers/Client/reducer';

const selectDashboardState = (state) => state.dashboard || initialState;

export const selectActivity = createSelector(selectDashboardState, (state) => state.activity);
export const selectConsumedCalories = createSelector(selectDashboardState, (state) => state.consumedCalories);
export const selectWeightEntries = createSelector(selectDashboardState, (state) => state.weightEntries);
