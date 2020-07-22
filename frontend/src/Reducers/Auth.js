import { createActions, handleActions, combineActions } from 'redux-actions';

const initState = {
  isAuthenticated: !!localStorage.getItem('mr_token'),
  token: localStorage.getItem('mr_token'),
};

export const creators = createActions({
  AUTH_CHECK: () => ({})
});

const authCheckReducer = (state) => {
  state = Object.assign({}, state, {
    isAuthenticated: !!localStorage.getItem('mr_token')
  });
  return state;
};

export default handleActions (
  {
    AUTH_CHECK: authCheckReducer,
  },
  initState
);
