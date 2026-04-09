import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
  currentPage: 1,
  numberOfPage: 1,
};

const documentSlice = createSlice({
  name: "documents",
  initialState,
  reducers: {
    setDocuments: (state, action) => {
      state.data = action.payload.documents;
      state.currentPage = action.payload.currentPage;
      state.numberOfPage = action.payload.numberOfPage;
    },
    removeDocuments: (state) => {
      state.data = [];
      state.currentPage = 1;
      state.numberOfPage = 1;
    },
  },
});

export const { setDocuments, removeDocuments } = documentSlice.actions;
export default documentSlice.reducer;
