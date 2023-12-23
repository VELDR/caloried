import { produce } from 'immer';
import {
  NEXT_STEP,
  PREVIOUS_STEP,
  RESET_FORM,
  SET_ACCOUNT,
  SET_ACTIVITY_LEVEL,
  SET_GOAL,
  SET_METRICS,
} from './constants';

export const initialState = {
  currentStep: 0,
  goal: null,
  metrics: {},
  activityLevel: null,
  account: {},
};

export const storedKey = ['goal', 'metrics', 'activityLevel', 'account', 'currentStep'];

const signUpReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case NEXT_STEP:
        if (state.currentStep < 5) {
          draft.currentStep = state.currentStep + 1;
        }
        break;
      case PREVIOUS_STEP:
        if (draft.currentStep !== 0) {
          draft.currentStep = state.currentStep - 1;
        }
        break;
      case SET_GOAL:
        draft.goal = action.goal;
        break;
      case SET_METRICS:
        draft.metrics = action.metrics;
        break;
      case SET_ACTIVITY_LEVEL:
        draft.activityLevel = action.activityLevel;
        break;
      case SET_ACCOUNT:
        draft.account = action.account;
        break;
      case RESET_FORM:
        return initialState;
    }
  });

export default signUpReducer;
