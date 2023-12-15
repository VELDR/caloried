import { setLoading, showPopup } from '@containers/App/actions';
import toast from 'react-hot-toast';
import { takeLatest, call, put } from 'redux-saga/effects';
import { getUserActivityApi, getUserCaloriesConsumedApi, getUserWeightEntriesApi } from '@domain/api';
import { GET_USER_ACTIVITY, GET_USER_CALORIES_CONSUMED, GET_USER_WEIGHT_ENTRIES } from './constants';
import { setUserActivity, setUserCaloriesConsumed, setUserWeightEntries } from './actions';

function* doGetUserActivity({ token }) {
  yield put(setLoading(true));
  try {
    const response = yield call(getUserActivityApi, token);
    yield put(setUserActivity(response));
  } catch (error) {
    if (error.response && error.response.data) {
      toast.error(error.response.data.message);
    } else {
      yield put(showPopup());
    }
  } finally {
    yield put(setLoading(false));
  }
}

function* doGetUserCaloriesConsumed({ days, token }) {
  yield put(setLoading(true));
  try {
    const response = yield call(getUserCaloriesConsumedApi, days, token);
    yield put(setUserCaloriesConsumed(response));
  } catch (error) {
    if (error.response && error.response.data) {
      toast.error(error.response.data.message);
    } else {
      yield put(showPopup());
    }
  } finally {
    yield put(setLoading(false));
  }
}

function* doGetUserWeightEntries({ days, token }) {
  yield put(setLoading(true));
  try {
    const response = yield call(getUserWeightEntriesApi, days, token);
    yield put(setUserWeightEntries(response));
  } catch (error) {
    if (error.response && error.response.data) {
      toast.error(error.response.data.message);
    } else {
      yield put(showPopup());
    }
  } finally {
    yield put(setLoading(false));
  }
}

export default function* dashboardSaga() {
  yield takeLatest(GET_USER_ACTIVITY, doGetUserActivity);
  yield takeLatest(GET_USER_CALORIES_CONSUMED, doGetUserCaloriesConsumed);
  yield takeLatest(GET_USER_WEIGHT_ENTRIES, doGetUserWeightEntries);
}
