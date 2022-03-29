import { createReducer } from "@reduxjs/toolkit";
import { read } from "../app/localStorage";

const initialState = {
  ...{
    gmapsToken: null,
  },
  ...read("api"),
};

const apiReducer = createReducer(initialState, {
  SET_GMAPS_TOKEN: (state, action) => {
    state.token = action.value;
  },
});

export default apiReducer;
