import { combineReducers } from 'redux';

import appReducer, { storedKey as storedAppState } from '@containers/App/reducer';
import clientReducer, { storedKey as storedClientState } from '@containers/Client/reducer';
import signUpReducer, { storedKey as storedSignUpState } from '@pages/SignUp/reducer';
import languageReducer from '@containers/Language/reducer';
import diaryReducer, { storedKey as storedDiaryState } from '@pages/Diary/reducer';
import foodSearchReducer from '@pages/FoodSearch/reducer';
import foodDetailsReducer from '@pages/FoodDetails/reducer';
import dashboardReducer from '@pages/Dashboard/reducer';

import { mapWithPersistor } from './persistence';

const storedReducers = {
  app: { reducer: appReducer, whitelist: storedAppState },
  client: { reducer: clientReducer, whitelist: storedClientState },
  signUp: { reducer: signUpReducer, whitelist: storedSignUpState },
  diary: { reducer: diaryReducer, whitelist: storedDiaryState },
};

const temporaryReducers = {
  language: languageReducer,
  foodSearch: foodSearchReducer,
  foodDetails: foodDetailsReducer,
  dashboard: dashboardReducer,
};

const createReducer = () => {
  const coreReducer = combineReducers({
    ...mapWithPersistor(storedReducers),
    ...temporaryReducers,
  });
  const rootReducer = (state, action) => coreReducer(state, action);
  return rootReducer;
};

export default createReducer;
