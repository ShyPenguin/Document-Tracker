import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
  currentPage: 1,
  numberOfPage: 1,
};

const returningSlice = createSlice({
  name: "returning",
  initialState,
  reducers: {
    setReturning: (state, action) => {
      state.data = action.payload.documents;
      state.currentPage = action.payload.currentPage;
      state.numberOfPage = action.payload.numberOfPage;
    },
    removeReturning: (state) => {
      state.data = [];
      state.currentPage = 1;
      state.numberOfPage = 1;
    },
  },
});

export const { setReturning, removeReturning } = returningSlice.actions;
export default returningSlice.reducer;
