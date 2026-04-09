import React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import * as api from "../../api";
import Error from "../Error";
import Loading from "../Loading";
import { setStatus } from "../../reducers/statusSlice";
function IncomingDView() {
  const { id } = useParams();
  const [record, setRecord] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [missing, setMissing] = useState("");
  const [document, setDocument] = useState(null);
  const [accept, setAccept] = useState(false);
  const documents = useSelector((state) => state.incoming.data);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);

  const getDocument = async (id) => {
    try {
      const { data } = await api.deptFetchDocument(id, token, user.office);

      const isoDate = new Date(data.date);
      const year = isoDate.getFullYear();
      const month = String(isoDate.getMonth() + 1).padStart(2, "0");
      const day = String(isoDate.getDate()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;
      setDocument({
        id: data._id,
        title: data.title,
        purpose: data.purpose,
        description: data.description,
        office: data.office,
        type: data.type,
        date: formattedDate,
      });

      setError("");
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  const getRecord = async (id) => {
    try {
      const data = documents.find((item) => item.id == id);
      if (!data) {
        setMissing("Record can't be Found");
      }
      setRecord(data);
      setError("");
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  const confirmDocument = async (e) => {
    e.preventDefault();
    try {
      const formElements = e.target.elements;
      const date = formElements.date.value;
      const remarks = formElements.remarks.value;
      setLoading(true);
      await api.deptConfirmDocument(
        { date: date, remarks: remarks },
        token,
        user.office,
        id
      );

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
      navigate("/department/incoming");
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };
  const cancel = async (id) => {
    setLoading(true);
    getDocument(id);
    getRecord(id);
    setAccept(false);
  };

  useEffect(() => {
    getRecord(id);
    getDocument(id);
  }, []);

  return (
    <>
      {error && <Error error={error} setError={setError} />}
      {!accept ? (
        loading ? (
          <Loading />
        ) : missing ? (
          <div>{missing}</div>
        ) : !document ? (
          <div>No Data Available</div>
        ) : (
          <>
            <div>
              <div className="mb-2">
                <table>
                  <tbody>
                    <tr>
                      <td colSpan="2">Document Details</td>
                    </tr>
                    <tr>
                      <td>Title:</td>
                      <td>{document.title}</td>
                    </tr>
                    <tr>
                      <td>Description:</td>
                      <td>{document.description}</td>
                    </tr>
                    <tr>
                      <td>Purpose:</td>
                      <td>{document.purpose}</td>
                    </tr>
                    <tr>
                      <td>Office:</td>
                      <td>{document.office.name}</td>
                    </tr>
                    <tr>
                      <td>Type:</td>
                      <td>{document.type.name}</td>
                    </tr>
                    <tr>
                      <td>Date:</td>
                      <td>{new Date(document.date).toLocaleDateString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div>
                <div>
                  <div className="record-section">
                    <div className="section-title">Record:</div>
                    <div className="sender-office">
                      Sender Office: {record.office}
                    </div>
                    <div className="remarks-container">
                      <label htmlFor="remarks">Remarks:</label>
                      <textarea
                        className="remarks-textarea"
                        id="remarks"
                        value={record.remarks}
                      ></textarea>
                    </div>
                    <div className="record-date">
                      Date: {new Date(record.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
              <div className="button-two">
                <div>
                  <button onClick={() => navigate(-1)}>Go Back</button>
                </div>
                <div>
                  <button onClick={() => setAccept(true)}>Accept</button>
                </div>
              </div>
            </div>
          </>
        )
      ) : (
        <>
          {loading && <Loading />}
          <form onSubmit={confirmDocument}>
            <div>
              <div className="edit-two">
                <div>
                  <div className="form-group">
                    <label htmlFor="remarks">Remarks:</label>
                    <textarea
                      id="remarks"
                      name="remarks"
                      defaultValue="N/A"
                    ></textarea>
                  </div>
                  <div className="form-group">
                    <label htmlFor="date">Date:</label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      defaultValue={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                </div>
              </div>

              {!loading && (
                <>
                  <div className="button-two">
                    <div>
                      <button type="submit">Confirm</button>
                    </div>
                    <div>
                      <button onClick={() => cancel(id)}>Cancel</button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </form>
        </>
      )}
    </>
  );
}

export default IncomingDView;
