import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { setLogout } from "../reducers/authSlice";
import { removeUsers } from "../reducers/userSlice";
import { removeDocuments } from "../reducers/documentSlice";
import { removeOffices } from "../reducers/officeSlice";
import { removeTrack } from "../reducers/trackSlice";
import { removeTypes } from "../reducers/typeSlice";
import DeptRoutes from "../routes/DeptRoutes";
import { removeStatus, setStatus } from "../reducers/statusSlice";
import { removeOutgoing } from "../reducers/outGoingSlice";
import { removeReceived } from "../reducers/receivedSlice";
import * as api from "../api";
import Loading from "../components/Loading";
import Error from "../components/Error";
import { removeIncoming } from "../reducers/incomingSlice";
import { removeReturned } from "../reducers/returnedSlice";
import { removeReturning } from "../reducers/returningSlice";
import "./deptview.css";

function DeptView() {
  const dispatch = useDispatch();
  const outgoing = useSelector((state) => state.status.outgoing);
  const incoming = useSelector((state) => state.status.incoming);
  const received = useSelector((state) => state.status.received);
  const returning = useSelector((state) => state.status.returning);
  const returned = useSelector((state) => state.status.returned);
  const created = useSelector((state) => state.status.created);
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const logOut = () => {
    dispatch(setLogout());
    dispatch(removeUsers());
    dispatch(removeTrack());
    dispatch(removeTypes());
    dispatch(removeOffices());
    dispatch(removeDocuments());
    dispatch(removeStatus());
    dispatch(removeOutgoing());
    dispatch(removeReceived());
    dispatch(removeIncoming());
    dispatch(removeReturned());
    dispatch(removeReturning());
  };

  const getNumberOfDocumentStatuses = async () => {
    try {
      setLoading(true);
      const { data } = await api.deptGetNumberOfDocumentStatuses(
        token,
        user.office
      );
      dispatch(
        setStatus({
          outgoing: data.Outgoing,
          incoming: data.Incoming,
          received: data.Received,
          returning: data.Returning,
          returned: data.Returned,
          created: data.Created,
        })
      );
      setLoading(false);
      setError("");
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  useEffect(() => {
    getNumberOfDocumentStatuses();
  }, []);

  return (
    <>
      <div className="main-content">
        <DeptRoutes />
      </div>

      {error && <Error error={error} setError={setError} />}
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="sidebar-navigation">
            <div className="link">
              <label htmlFor="">
                {user.office}
                <div>
                  <span>{`${user.firstName} ${user.lastName}`}</span>
                </div>
              </label>
            </div>
            <div className="separator"></div>
            <div className="navigation">
              <div>
                <Link to="/department/documents">Documents</Link>
              </div>
              <div>
                <Link to="/department/track">Track</Link>
              </div>
              <div className="sidebar-track">
                <div className="row">
                  <Link to="/department/incoming">Incoming </Link>
                </div>
                <div className="incomming">{incoming}</div>
              </div>
              <div className="sidebar-track">
                <div className="row">
                  <Link to="/department/received">Received </Link>
                </div>
                <div className="received">
                  {Number(received) + Number(created)}
                </div>
              </div>
              <div className="sidebar-track">
                <div className="row">
                  <Link to="/department/outgoing">Outgoing </Link>
                </div>
                <div className="outgoing">{outgoing}</div>
              </div>
              <div className="sidebar-track">
                <div className="row">
                  <Link to="/department/returning">Returning</Link>
                </div>
                <div className="returning">{returning}</div>
              </div>
              <div className="sidebar-track">
                <div className="row">
                  <Link to="/department/returned">Returned</Link>
                </div>
                <div className="returned">{returned}</div>
              </div>
              <div className="logout">
                <button onClick={() => logOut()}>Logout</button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default DeptView;
