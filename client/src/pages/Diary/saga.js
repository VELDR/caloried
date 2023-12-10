import { setLoading, showPopup } from '@containers/App/actions';
import { deleteFoodFromDiaryApi, editFoodInDiaryApi, getMealsByDateApi, getUserByIdApi } from '@domain/api';
import toast from 'react-hot-toast';
import { takeLatest, call, put } from 'redux-saga/effects';
import { DELETE_FOOD_FROM_DIARY, EDIT_FOOD_IN_DIARY, GET_MEALS_BY_DATE, GET_USER } from './constants';
import { getMealsByDate, setDeleteFoodFromDiary, setMealsByDate, setUser } from './actions';

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

function* doEditFoodInDiary({ foodData, foodLogId, token, originalDate }) {
  yield put(setLoading(true));
  try {
    const response = yield call(editFoodInDiaryApi, foodData, foodLogId, token);

    // If updated date is different from original date, remove it from ui.
    if (foodData.date !== originalDate) {
      yield put(setDeleteFoodFromDiary(foodLogId));
    } else {
      yield put(getMealsByDate(originalDate, token));
    }

    toast.success(response.message);
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

function* doDeleteFoodFromDiary({ foodLogId, token }) {
  yield put(setLoading(true));
  try {
    const response = yield call(deleteFoodFromDiaryApi, foodLogId, token);
    yield put(setDeleteFoodFromDiary(foodLogId));
    toast.success(response.message);
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
  yield takeLatest(EDIT_FOOD_IN_DIARY, doEditFoodInDiary);
  yield takeLatest(DELETE_FOOD_FROM_DIARY, doDeleteFoodFromDiary);
}
