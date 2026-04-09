import { combineReducers } from "redux";
import offices from "./officeSlice";
import authReducer from "./authSlice";
import types from "./typeSlice";
import users from "./userSlice";
import documents from "./documentSlice";
import track from "./trackSlice";
import status from "./statusSlice";
import outgoing from "./outGoingSlice";
import received from "./receivedSlice";
import incoming from "./incomingSlice";
import returned from "./returnedSlice";
import returning from "./returningSlice";

export default combineReducers({
  offices: offices,
  types: types,
  users: users,
  documents: documents,
  track: track,
  status: status,
  outgoing: outgoing,
  received: received,
  incoming: incoming,
  returned: returned,
  returning: returning,
  auth: authReducer,
});
