import { createSelector } from 'reselect';
import { initialState } from '@containers/Client/reducer';

const selectAdminState = (state) => state.admin || initialState;

export const selectUsers = createSelector(selectAdminState, (state) => state.users);
export const selectTotalUsers = createSelector(selectAdminState, (state) => state.total);
export const selectDemographics = createSelector(selectAdminState, (state) => state.demographics);
export const selectSexDistribution = createSelector(selectAdminState, (state) => state.sexDistribution);
