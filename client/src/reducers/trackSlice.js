import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  document: "",
  data: [],
};

const trackSlice = createSlice({
  name: "track",
  initialState,
  reducers: {
    setTrack: (state, action) => {
      state.document = action.payload.document;
      if (action.payload.track) {
        state.data = action.payload.track;
      }
    },
    removeTrack: (state) => {
      state.data = [];
      state.document = "";
    },
  },
});

export const { setTrack, removeTrack } = trackSlice.actions;
export default trackSlice.reducer;
