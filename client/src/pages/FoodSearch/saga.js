import { setLoading, showPopup } from '@containers/App/actions';
import { createCustomFoodApi, getFoodsApi } from '@domain/api';
import toast from 'react-hot-toast';
import { takeLatest, call, put } from 'redux-saga/effects';
import { getMyFoods } from '@pages/MyFoods/actions';
import { CREATE_CUSTOM_FOOD, GET_FOODS } from './constants';
import { setFoods } from './actions';

function* doGetFoods({ query, page, pageSize, token, category }) {
  yield put(setLoading(true));
  try {
    const response = yield call(getFoodsApi, query, page, pageSize, token, category);
    yield put(setFoods(response.items, response.totalItems, token));
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

function* doCreateCustomFood({ data, token, callback }) {
  yield put(setLoading(true));
  try {
    const response = yield call(createCustomFoodApi, data, token);
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

export default function* foodSearchSaga() {
  yield takeLatest(GET_FOODS, doGetFoods);
  yield takeLatest(CREATE_CUSTOM_FOOD, doCreateCustomFood);
}
