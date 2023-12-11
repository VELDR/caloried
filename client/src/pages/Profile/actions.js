import { EDIT_PROFILE } from './constants';

export const editProfile = (data, token, callback) => ({
  type: EDIT_PROFILE,
  data,
  token,
  callback,
});
