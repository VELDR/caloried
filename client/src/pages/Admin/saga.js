import { setLoading, showPopup } from '@containers/App/actions';
import toast from 'react-hot-toast';
import { takeLatest, call, put } from 'redux-saga/effects';
import {
  deleteCustomFoodByIdApi,
  deleteUserByIdApi,
  getAllCustomFoodsPaginatedApi,
  getAllUsersPaginatedApi,
  getUserDemographicsApi,
  getUserSexDistributionApi,
} from '@domain/api';
import {
  DELETE_CUSTOM_FOOD_BY_ID,
  DELETE_USER_BY_ID,
  GET_ALL_CUSTOM_FOODS,
  GET_ALL_USERS,
  GET_USER_DEMOGRAPHICS,
  GET_USER_SEX_DISTRIBUTION,
} from './constants';
import {
  deleteCustomFoodSuccess,
  deleteUserSuccess,
  setAllCustomFoods,
  setAllUsers,
  setUserDemographics,
  setUserSexDistribution,
} from './actions';

function* doGetAllUsers({ page, pageSize, token, sort, order }) {
  yield put(setLoading(true));
  try {
    const response = yield call(getAllUsersPaginatedApi, page, pageSize, token, sort, order);
    yield put(setAllUsers(response.users, response.total));
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

export function* doDeleteUserById({ userId, token }) {
  yield put(setLoading(true));
  try {
    const response = yield call(deleteUserByIdApi, userId, token);
    toast.success(response.message);
    yield put(deleteUserSuccess(userId));
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

function* doGetUserDemographics({ token }) {
  yield put(setLoading(true));
  try {
    const response = yield call(getUserDemographicsApi, token);
    yield put(setUserDemographics(response));
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

function* doGetUserSexDistribution({ token }) {
  yield put(setLoading(true));
  try {
    const response = yield call(getUserSexDistributionApi, token);
    yield put(setUserSexDistribution(response));
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

function* doGetAllCustomFoods({ page, pageSize, token, sort, order }) {
  yield put(setLoading(true));
  try {
    const response = yield call(getAllCustomFoodsPaginatedApi, page, pageSize, token, sort, order);
    yield put(setAllCustomFoods(response.customFoods, response.total));
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

export function* doDeleteCustomFoodById({ customFoodId, token }) {
  yield put(setLoading(true));
  try {
    const response = yield call(deleteCustomFoodByIdApi, customFoodId, token);
    toast.success(response.message);
    yield put(deleteCustomFoodSuccess(customFoodId));
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

export default function* adminSaga() {
  yield takeLatest(GET_ALL_USERS, doGetAllUsers);
  yield takeLatest(DELETE_USER_BY_ID, doDeleteUserById);
  yield takeLatest(GET_USER_DEMOGRAPHICS, doGetUserDemographics);
  yield takeLatest(GET_USER_SEX_DISTRIBUTION, doGetUserSexDistribution);
  yield takeLatest(GET_ALL_CUSTOM_FOODS, doGetAllCustomFoods);
  yield takeLatest(DELETE_CUSTOM_FOOD_BY_ID, doDeleteCustomFoodById);
}
