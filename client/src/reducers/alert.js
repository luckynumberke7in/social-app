import { SET_ALERT, REMOVE_ALERT } from '../actions/types';

const initialState = [];

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case 'SET_ALERT':
      // add new alert after copying state
      return [...state, payload];
    case 'REMOVE_ALERT':
      // return new state with everything except selected id to remove
      return state.filter((alert) => alert.id !== payload);
    default:
      return state;
  }
}
