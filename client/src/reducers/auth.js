import { REGISTER_SUCCESS, REGISTER_FAIL } from '../actions/types';

// set state for action taking place
const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  loading: true,
  user: null,
};
// if auth action is a success, deliver token and set state
// if auth action fails, remove token and deliver payload(err msg)
export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case REGISTER_SUCCESS:
      localStorage.setItem('token', payload.token);
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        loading: false,
      };
    case REGISTER_FAIL:
      localStorage.removeItem('token');
      return {
        ...state,
        ...payload,
        isAuthenticated: false,
        loading: false,
      };
    default:
      return state;
  }
}
