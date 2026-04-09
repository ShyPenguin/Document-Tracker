import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { setLogout } from "../reducers/authSlice";
import { removeUsers } from "../reducers/userSlice";
import { removeDocuments } from "../reducers/documentSlice";
import { removeOffices } from "../reducers/officeSlice";
import { removeTrack } from "../reducers/trackSlice";
import { removeTypes } from "../reducers/typeSlice";
import AdminRoutes from "../routes/AdminRoutes";
import "./adminview.css";

function AdminView() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const logOut = () => {
    dispatch(setLogout());
    dispatch(removeUsers());
    dispatch(removeTrack());
    dispatch(removeTypes());
    dispatch(removeOffices());
    dispatch(removeDocuments());
  };
  return (
    <>
      <div>
        <div className="main-content">
          <AdminRoutes />
        </div>
        <div className="sidebar-navigation">
          <div className="link">
            <label htmlFor="">
              Admin
              <div>
                <span>{`${user.firstName} ${user.lastName}`}</span>
              </div>
            </label>
          </div>
          <div className="separator"></div>
          <div className="link">
            <Link to="/admin/documents">Documents</Link>
          </div>
          <div className="link">
            <Link to="/admin/offices">Offices</Link>
          </div>
          <div className="link">
            <Link to="/admin/types">Types</Link>
          </div>
          <div className="link">
            <Link to="/admin/users">Users</Link>
          </div>
          <div className="link">
            <Link to="/admin/track">Track</Link>
          </div>
          <div className="link">
            <button onClick={() => logOut()}>Logout</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminView;
