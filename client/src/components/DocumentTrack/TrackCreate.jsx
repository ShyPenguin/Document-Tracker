import React from "react";
import * as api from "../../api";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Loading from "../Loading";
import Error from "../Error";
import { useSelector } from "react-redux";
import "./trackcreate.css";
function TrackCreate() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const document = useSelector((state) => state.track.document);
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);

  const recordCreate = async (e) => {
    e.preventDefault();
    try {
      const formElements = e.target.elements;
      const action = formElements.action.value;
      const date = formElements.date.value;
      const office = formElements.office.value;
      const remarks = formElements.remarks.value;

      setLoading(true);
      await api.createDocumentTrack(
        document,
        {
          action: action,
          date: date,
          office: office,
          remarks: remarks,
        },
        token
      );
      navigate(-1);
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };
  return (
    <>
      {error && <Error error={error} setError={setError} />}
      {loading && <Loading />}
      <div className="please">
        <form onSubmit={recordCreate}>
          <div>
            <label htmlFor="office">Office:</label>
            <input type="text" id="office" name="office" />
          </div>
          <div>
            <label htmlFor="action">Action:</label>
            <input type="text" id="action" name="action" />
          </div>
          <div className="remarks-container">
            <label htmlFor="remarks">Remarks:</label>
            <textarea
              className="remarks-textarea"
              type="text"
              id="remarks"
              name="remarks"
            />
          </div>

          <div>
            <label htmlFor="date">Date:</label>
            <input
              type="date"
              id="date"
              name="date"
              defaultValue={new Date().toISOString().split("T")[0]}
            />
          </div>
          <button type="submit">Create</button>
        </form>
      </div>
    </>
  );
}

export default TrackCreate;
