import { produce } from 'immer';
import { DELETE_USER_SUCCESS, SET_ALL_USERS, SET_USER_DEMOGRAPHICS, SET_USER_SEX_DISTRIBUTION } from './constants';

export const initialState = {
  users: [],
  total: 0,
  demographics: null,
  sexDistribution: null,
};

export const storedKey = [];

const adminReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_ALL_USERS:
        draft.users = action.users;
        draft.total = action.total;
        break;
      case DELETE_USER_SUCCESS:
        draft.users = draft.users.filter((user) => user.id !== action.userId);
        break;
      case SET_USER_DEMOGRAPHICS:
        draft.demographics = action.demographics;
        break;
      case SET_USER_SEX_DISTRIBUTION:
        draft.sexDistribution = action.sexDistribution;
        break;
    }
  });

export default adminReducer;
