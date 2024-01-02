import { all } from 'redux-saga/effects';

import appSaga from '@containers/App/saga';
import clientSaga from '@containers/Client/saga';
import diarySaga from '@pages/Diary/saga';
import foodSearchSaga from '@pages/FoodSearch/saga';
import foodDetailsSaga from '@pages/FoodDetails/saga';
import profileSaga from '@pages/Profile/saga';
import dashboardSaga from '@pages/Dashboard/saga';
import adminSaga from '@pages/Admin/saga';
import myFoodsSaga from '@pages/MyFoods/saga';

export default function* rootSaga() {
  yield all([
    appSaga(),
    clientSaga(),
    diarySaga(),
    foodSearchSaga(),
    foodDetailsSaga(),
    profileSaga(),
    dashboardSaga(),
    adminSaga(),
    myFoodsSaga(),
  ]);
}
