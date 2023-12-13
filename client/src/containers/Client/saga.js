import CryptoJS from 'crypto-js';
import { setLoading, showPopup } from '@containers/App/actions';
import { adminLoginApi, loginApi, registerApi, resendVerificationEmailApi } from '@domain/api';
import toast from 'react-hot-toast';
import { takeLatest, call, put } from 'redux-saga/effects';
import { ADMIN_LOGIN, LOGIN, REGISTER, RESEND_VERIFICATION_EMAIL } from './constants';
import { setAdminLogin, setFirstLogin, setLogin, setToken } from './actions';

function* doRegister({ data, callback }) {
  yield put(setLoading(true));
  try {
    data.password = CryptoJS.AES.encrypt(data.password, import.meta.env.VITE_CRYPTOJS_SECRET).toString();
    const response = yield call(registerApi, data);
    yield call(callback);
    toast.success(response?.message);
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

function* doResendVerificationEmail({ data }) {
  yield put(setLoading(true));
  try {
    const response = yield call(resendVerificationEmailApi, data);
    toast.success(response?.message);
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

function* doLogin({ data, callback }) {
  yield put(setLoading(true));
  try {
    data.password = CryptoJS.AES.encrypt(data.password, import.meta.env.VITE_CRYPTOJS_SECRET).toString();
    const response = yield call(loginApi, data);

    yield put(setLogin(true));
    yield put(setToken(response.token));
    yield put(setFirstLogin(response.firstLogin));
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

function* doAdminLogin({ data, callback }) {
  yield put(setLoading(true));
  try {
    data.password = CryptoJS.AES.encrypt(data.password, import.meta.env.VITE_CRYPTOJS_SECRET).toString();
    const response = yield call(adminLoginApi, data);

    yield put(setAdminLogin(true));
    yield put(setToken(response.token));
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

export default function* clientSaga() {
  yield takeLatest(REGISTER, doRegister);
  yield takeLatest(RESEND_VERIFICATION_EMAIL, doResendVerificationEmail);
  yield takeLatest(LOGIN, doLogin);
  yield takeLatest(ADMIN_LOGIN, doAdminLogin);
}
