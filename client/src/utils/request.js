import axios from 'axios';

import { logoutUser } from '@containers/Client/actions';
import store from '../configureStore';

axios.interceptors.request.use((reqConfig) => {
  const state = store.getState();
  const { token } = state.client;
  if (token) {
    reqConfig.headers.Authorization = `Bearer ${token}`;
  }
  return reqConfig;
});

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { dispatch } = store;
    if (error.response?.status === 401) {
      dispatch(logoutUser());
    }
    return Promise.reject(error);
  }
);

const request = (options) => axios(options);

export default request;
