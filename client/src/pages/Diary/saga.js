import { setLoading, showPopup } from '@containers/App/actions';
import { getMealsByDateApi, getUserByIdApi } from '@domain/api';
import toast from 'react-hot-toast';
import { takeLatest, call, put } from 'redux-saga/effects';
import { GET_MEALS_BY_DATE, GET_USER } from './constants';
import { setMealsByDate, setUser } from './actions';

function* doGetUserById({ token }) {
  yield put(setLoading(true));
  try {
    const response = yield call(getUserByIdApi, token);
    yield put(setUser(response));
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

function* doGetMealsByDate({ date, token }) {
  yield put(setLoading(true));
  try {
    const response = yield call(getMealsByDateApi, date, token);
    yield put(setMealsByDate(response, token));
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

export default function* diarySaga() {
  yield takeLatest(GET_USER, doGetUserById);
  yield takeLatest(GET_MEALS_BY_DATE, doGetMealsByDate);
}
