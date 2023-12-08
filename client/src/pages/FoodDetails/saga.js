import { setLoading, showPopup } from '@containers/App/actions';
import { addFoodToDiaryApi, getFoodDetailsApi } from '@domain/api';
import toast from 'react-hot-toast';
import { takeLatest, call, put } from 'redux-saga/effects';
import { ADD_FOOD_TO_DIARY, GET_FOOD_DETAILS } from './constants';
import { setFoodDetails } from './actions';

function* doGetFoodDetails({ foodType, foodName, token }) {
  yield put(setLoading(true));
  try {
    const response = yield call(getFoodDetailsApi, foodType, foodName, token);
    yield put(setFoodDetails(response));
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

function* doAddFoodToDiary({ foodData, token }) {
  yield put(setLoading(true));
  try {
    const response = yield call(addFoodToDiaryApi, foodData, token);
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

export default function* foodDetailsSaga() {
  yield takeLatest(GET_FOOD_DETAILS, doGetFoodDetails);
  yield takeLatest(ADD_FOOD_TO_DIARY, doAddFoodToDiary);
}
