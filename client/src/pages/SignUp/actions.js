import {
  NEXT_STEP,
  PREVIOUS_STEP,
  RESET_FORM,
  SET_ACCOUNT,
  SET_ACTIVITY_LEVEL,
  SET_GOAL,
  SET_METRICS,
} from './constants';

export const nextStep = () => ({
  type: NEXT_STEP,
});

export const previousStep = () => ({
  type: PREVIOUS_STEP,
});

export const setGoal = (goal) => ({
  type: SET_GOAL,
  goal,
});

export const setMetrics = (metrics) => ({
  type: SET_METRICS,
  metrics,
});

export const setActivityLevel = (activityLevel) => ({
  type: SET_ACTIVITY_LEVEL,
  activityLevel,
});

export const setAccount = (account) => ({
  type: SET_ACCOUNT,
  account,
});

export const resetForm = () => ({
  type: RESET_FORM,
});
