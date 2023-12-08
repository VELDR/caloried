import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectSignUpState = (state) => state.signUp || initialState;

export const selectCurrentStep = createSelector(selectSignUpState, (state) => state.currentStep);
export const selectGoal = createSelector(selectSignUpState, (state) => state.goal);
export const selectMetrics = createSelector(selectSignUpState, (state) => state.metrics);
export const selectActivityLevel = createSelector(selectSignUpState, (state) => state.activityLevel);
export const selectAccount = createSelector(selectSignUpState, (state) => state.account);
