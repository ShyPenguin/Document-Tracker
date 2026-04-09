import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as api from "../../api";
import Loading from "../Loading";
import Error from "../Error";
import { Link, useNavigate } from "react-router-dom";
import { removeTrack, setTrack } from "../../reducers/trackSlice";
import "./TrackView.css";
function TrackView() {
  const dispatch = useDispatch();
  const track = useSelector((state) => state.track.data);
  const document = useSelector((state) => state.track.document);
  const [code, setCode] = useState(document);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);

  const navigate = useNavigate();
  const trackDocument = async (id) => {
    try {
      setLoading(true);

      if (user.role == "admin") {
        const { data } = await api.getDocumentTrack(id, token);
        dispatch(
          setTrack({
            document: code,
            track: data,
          })
        );
      } else {
        const { data } = await api.deptGetDocumentTrack(id, token, user.office);
        dispatch(
          setTrack({
            document: code,
            track: data,
          })
        );
      }

      setLoading(false);
      setError("");
    } catch (err) {
      setLoading(false);
      setError(err.message);
      dispatch(removeTrack());
    }
  };

  const recordDelete = async (id) => {
    try {
      setLoading(true);

      await api.deleteDocumentTrack(id, token);

      setLoading(false);
      setError("");
      trackDocument(id);
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  useEffect(() => {
    trackDocument(code);
    // dispatch(removeTrack());
  }, []);
  return (
    <>
      <div className="track-form">
        <input
          type="text"
          id="track"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="track-input"
        />
        <button onClick={() => trackDocument(code)} className="track-button">
          Track
        </button>
      </div>

      {error && <Error error={error} setError={setError} />}
      {loading ? (
        <Loading />
      ) : track.length < 1 ? (
        <div>No Data Available</div>
      ) : (
        <>
          <div>
            {user.role == "admin" && (
              <div className="button-two">
                <button onClick={() => navigate(`create/${document}`)}>
                  Add a new record
                </button>
                <button
                  className="go-delete-button"
                  onClick={() => recordDelete(document)}
                >
                  Delete latest record
                </button>
              </div>
            )}
            <table className="">
              <thead>
                <tr>
                  <th>Action</th>
                  <th>Office</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {track.map((record) => (
                  <tr key={record._id}>
                    <td>
                      <Link to={`view/${record._id}`}>{record.action}</Link>
                    </td>
                    <td>{record.office.name}</td>
                    <td>{new Date(record.date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
}

export default TrackView;
