import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
  currentPage: 1,
  numberOfPage: 1,
};

const outGoingSlice = createSlice({
  name: "outgoing",
  initialState,
  reducers: {
    setOutgoing: (state, action) => {
      state.data = action.payload.documents;
      state.currentPage = action.payload.currentPage;
      state.numberOfPage = action.payload.numberOfPage;
    },
    removeOutgoing: (state) => {
      state.data = [];
      state.currentPage = 1;
      state.numberOfPage = 1;
    },
  },
});

export const { setOutgoing, removeOutgoing } = outGoingSlice.actions;
export default outGoingSlice.reducer;
