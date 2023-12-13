import { CHANGE_PASSWORD, EDIT_PROFILE } from './constants';

export const editProfile = (data, token, callback) => ({
  type: EDIT_PROFILE,
  data,
  token,
  callback,
});

export const changePassword = (data, token, callback) => ({
  type: CHANGE_PASSWORD,
  data,
  token,
  callback,
});
