import { produce } from 'immer';

import { LOGOUT_USER, SET_FIRST_LOGIN, SET_LOGIN, SET_TOKEN } from '@containers/Client/constants';

export const initialState = {
  login: false,
  token: null,
  firstLogin: false,
};

export const storedKey = ['token', 'login', 'firstLogin'];

const clientReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_LOGIN:
        draft.login = action.login;
        break;
      case SET_TOKEN:
        draft.token = action.token;
        break;
      case SET_FIRST_LOGIN:
        draft.firstLogin = action.firstLogin;
        break;
      case LOGOUT_USER:
        return initialState;
    }
  });

export default clientReducer;
