import { createReducer } from "@reduxjs/toolkit";
import { read } from "../app/localStorage";

const initialState = {
  ...{
    clocks: [],
  },
  ...read("clocks"),
};

const clocksReducer = createReducer(initialState, {
  ADD_CLOCK: (state, action) => {
    state.clocks = [...state.clocks, action.new]
  },
});

export default apiReducer;
