import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

// set initial state
const initialState = {};

// set middleware to read react changes
const middleware = [thunk];

// create store that will watch over componenets, when they change, will update state automatically
const store = createStore(
  rootReducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
