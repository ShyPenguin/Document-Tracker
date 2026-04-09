import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  outgoing: 0,
  incoming: 0,
  received: 0,
  returning: 0,
  returned: 0,
  created: 0,
};

const statusSlice = createSlice({
  name: "status",
  initialState,
  reducers: {
    setStatus: (state, action) => {
      state.outgoing = action.payload.outgoing;
      state.incoming = action.payload.incoming;
      state.received = action.payload.received;
      state.returning = action.payload.returning;
      state.returned = action.payload.returned;
      state.created = action.payload.created;
    },
    removeStatus: (state) => {
      state.outgoing = 0;
      state.incoming = 0;
      state.received = 0;
      state.returning = 0;
      state.returned = 0;
      state.created = 0;
    },
    noOp: (state) => state,
  },
});

export const { setStatus, removeStatus, noOp } = statusSlice.actions;
export default statusSlice.reducer;
