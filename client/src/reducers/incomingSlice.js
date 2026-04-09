import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
  currentPage: 1,
  numberOfPage: 1,
};

const incomingSlice = createSlice({
  name: "incoming",
  initialState,
  reducers: {
    setIncoming: (state, action) => {
      state.data = action.payload.documents;
      state.currentPage = action.payload.currentPage;
      state.numberOfPage = action.payload.numberOfPage;
    },
    removeIncoming: (state) => {
      state.data = [];
      state.currentPage = 1;
      state.numberOfPage = 1;
    },
  },
});

export const { setIncoming, removeIncoming } = incomingSlice.actions;
export default incomingSlice.reducer;
