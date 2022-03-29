import { configureStore } from '@reduxjs/toolkit';
import apiReducer from "../reducers/api";
import { write } from "./localStorage";

const store = configureStore({
  reducer: {
    api: apiReducer,
  },
});

export default store;

store.subscribe(() => {
  const state = store.getState();
  write("api", state.api);
});
