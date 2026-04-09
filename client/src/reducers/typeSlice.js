import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
  currentPage: 1,
  numberOfPage: 1,
};

const typeSlice = createSlice({
  name: "types",
  initialState,
  reducers: {
    setTypes: (state, action) => {
      state.data = action.payload.types;
      state.currentPage = action.payload.currentPage;
      state.numberOfPage = action.payload.numberOfPage;
    },
    removeTypes: (state) => {
      state.data = [];
      state.currentPage = 1;
      state.numberOfPage = 1;
    },
  },
});

export const { setTypes, removeTypes } = typeSlice.actions;
export default typeSlice.reducer;
