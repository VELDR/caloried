import { all } from 'redux-saga/effects';

import appSaga from '@containers/App/saga';
import clientSaga from '@containers/Client/saga';
import diarySaga from '@pages/Diary/saga';
import foodSearchSaga from '@pages/FoodSearch/saga';
import foodDetailsSaga from '@pages/FoodDetails/saga';

export default function* rootSaga() {
  yield all([appSaga(), clientSaga(), diarySaga(), foodSearchSaga(), foodDetailsSaga()]);
}
