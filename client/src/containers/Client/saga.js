import CryptoJS from 'crypto-js';
import { setLoading, showPopup } from '@containers/App/actions';
import {
  adminLoginApi,
  forgotPasswordApi,
  loginApi,
  registerApi,
  resendVerificationEmailApi,
  resetPasswordApi,
  verifyOTPApi,
} from '@domain/api';
import toast from 'react-hot-toast';
import { takeLatest, call, put } from 'redux-saga/effects';
import config from '@config/index';
import {
  ADMIN_LOGIN,
  FORGOT_PASSWORD,
  LOGIN,
  REGISTER,
  RESEND_VERIFICATION_EMAIL,
  RESET_PASSWORD,
  VERIFY_OTP,
} from './constants';
import { setAdminLogin, setFirstLogin, setLogin, setToken } from './actions';

function* doRegister({ data, callback }) {
  yield put(setLoading(true));
  try {
    data.password = CryptoJS.AES.encrypt(data.password, config.crypto.secret).toString();
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

function* doResendVerificationEmail({ data, callback }) {
  yield put(setLoading(true));
  try {
    const response = yield call(resendVerificationEmailApi, data);
    toast.success(response?.message);
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

function* doLogin({ data, callback }) {
  yield put(setLoading(true));
  try {
    data.password = CryptoJS.AES.encrypt(data.password, config.crypto.secret).toString();
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
    data.password = CryptoJS.AES.encrypt(data.password, config.crypto.secret).toString();
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

function* doVerifyOtp({ otp, email, callback }) {
  yield put(setLoading(true));
  try {
    yield call(verifyOTPApi, { otp, email });
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

function* doForgotPassword({ email }) {
  yield put(setLoading(true));
  try {
    const response = yield call(forgotPasswordApi, email);
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

function* doResetPassword({ data, callback }) {
  yield put(setLoading(true));
  try {
    data.newPassword = CryptoJS.AES.encrypt(data.newPassword, config.crypto.secret).toString();
    const response = yield call(resetPasswordApi, data);
    toast.success(response.message);
    yield call(callback);
  } catch (error) {
    if (error.response && error.response.data) {
      toast.error(error.response.data.message);
    } else {
      yield put(showPopup());
    }
  }
  yield put(setLoading(false));
}

export default function* clientSaga() {
  yield takeLatest(REGISTER, doRegister);
  yield takeLatest(RESEND_VERIFICATION_EMAIL, doResendVerificationEmail);
  yield takeLatest(LOGIN, doLogin);
  yield takeLatest(ADMIN_LOGIN, doAdminLogin);
  yield takeLatest(VERIFY_OTP, doVerifyOtp);
  yield takeLatest(FORGOT_PASSWORD, doForgotPassword);
  yield takeLatest(RESET_PASSWORD, doResetPassword);
}
