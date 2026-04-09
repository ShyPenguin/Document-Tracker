import React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as api from "../../api";
import Error from "../Error";
import Loading from "../Loading";
import { useSelector } from "react-redux";
import "./trackdview.css";

function TrackDView() {
  const { id } = useParams();
  const [record, setRecord] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [missing, setMissing] = useState("");

  const track = useSelector((state) => state.track.data);

  const navigate = useNavigate();

  const getRecord = async (id) => {
    try {
      const data = track.find((item) => item._id == id);
      if (!data) {
        setMissing("Record can't be Found");
      }
      setRecord(data);
      setError("");
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  useEffect(() => {
    getRecord(id);
  }, []);

  return (
    <>
      {error && <Error error={error} setError={setError} />}
      {loading ? (
        <Loading />
      ) : missing ? (
        <div>{missing}</div>
      ) : (
        <div>
          <table className="record-table">
            <tbody>
              <tr>
                <td className="table-label">Office:</td>
                <td>{record.office.name}</td>
              </tr>
              <tr>
                <td className="table-label">Remarks:</td>
                <td>{record.remarks}</td>
              </tr>
              <tr>
                <td className="table-label">Action:</td>
                <td>{record.action}</td>
              </tr>
              <tr>
                <td className="table-label">Date:</td>
                <td>{new Date(record.date).toLocaleDateString()}</td>
              </tr>
            </tbody>
          </table>

          <button className="go-back-button" onClick={() => navigate(-1)}>
            Go Back
          </button>
        </div>
      )}
    </>
  );
}

export default TrackDView;
