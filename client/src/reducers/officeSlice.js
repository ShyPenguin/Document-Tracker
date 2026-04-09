import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
  currentPage: 1,
  numberOfPage: 1,
};

const officeSlice = createSlice({
  name: "offices",
  initialState,
  reducers: {
    setOffices: (state, action) => {
      state.data = action.payload.offices;
      state.currentPage = action.payload.currentPage;
      state.numberOfPage = action.payload.numberOfPage;
    },
    removeOffices: (state) => {
      state.data = [];
      state.currentPage = 1;
      state.numberOfPage = 1;
    },
  },
});

export const { setOffices, removeOffices } = officeSlice.actions;
export default officeSlice.reducer;
