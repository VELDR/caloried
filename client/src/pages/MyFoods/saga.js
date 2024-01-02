import { setLoading, showPopup } from '@containers/App/actions';
import { deleteCustomFoodApi, editCustomFoodApi, getMyFoodsApi } from '@domain/api';
import toast from 'react-hot-toast';
import { takeLatest, call, put } from 'redux-saga/effects';
import { DELETE_CUSTOM_FOOD, EDIT_CUSTOM_FOOD, GET_MY_FOODS } from './constants';
import { getMyFoods, setMyFoods } from './actions';

function* doGetMyFoods({ token }) {
  yield put(setLoading(true));
  try {
    const response = yield call(getMyFoodsApi, token);
    yield put(setMyFoods(response, token));
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

function* doEditCustomFood({ customFoodId, food, token, callback }) {
  yield put(setLoading(true));
  try {
    const response = yield call(editCustomFoodApi, customFoodId, food, token);
    toast.success(response.message);
    yield put(getMyFoods(token));
    yield call(callback);
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

function* doDeleteCustomFood({ customFoodId, token }) {
  yield put(setLoading(true));
  try {
    const response = yield call(deleteCustomFoodApi, customFoodId, token);
    yield put(getMyFoods(token));
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

export default function* myFoodsSaga() {
  yield takeLatest(GET_MY_FOODS, doGetMyFoods);
  yield takeLatest(EDIT_CUSTOM_FOOD, doEditCustomFood);
  yield takeLatest(DELETE_CUSTOM_FOOD, doDeleteCustomFood);
}
