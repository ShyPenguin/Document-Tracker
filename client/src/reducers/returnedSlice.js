import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
  currentPage: 1,
  numberOfPage: 1,
};

const returnedSlice = createSlice({
  name: "returned",
  initialState,
  reducers: {
    setReturned: (state, action) => {
      state.data = action.payload.documents;
      state.currentPage = action.payload.currentPage;
      state.numberOfPage = action.payload.numberOfPage;
    },
    removeReturned: (state) => {
      state.data = [];
      state.currentPage = 1;
      state.numberOfPage = 1;
    },
  },
});

export const { setReturned, removeReturned } = returnedSlice.actions;
export default returnedSlice.reducer;
