// src/store.js
import { createStore } from 'redux';

// Define an initial state
const initialState = {
  count: 0, // Example state
};

// Create a reducer function (handles state updates)
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, count: state.count + 1 };
    case 'DECREMENT':
      return { ...state, count: state.count - 1 };
    default:
      return state;
  }
};

// Create the Redux store
const store = createStore(reducer);

export default store;