import React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as api from "../../api";
import Error from "../Error";
import Loading from "../Loading";
import { useDispatch, useSelector } from "react-redux";
import "./DocumentDView.css";
import { setStatus } from "../../reducers/statusSlice";

function DocumentDView() {
  const { id } = useParams();
  const [document, setDocument] = useState(null);
  const [error, setError] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const getDocument = async (id) => {
    try {
      let document;

      if (user.role == "admin") {
        const { data } = await api.fetchDocument(id, token);
        document = data;
      } else {
        const { data } = await api.deptFetchDocument(id, token, user.office);
        document = data;
      }

      const isoDate = new Date(document.date);
      const year = isoDate.getFullYear();
      const month = String(isoDate.getMonth() + 1).padStart(2, "0");
      const day = String(isoDate.getDate()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;
      setDocument({
        title: document.title,
        purpose: document.purpose,
        description: document.description,
        office: document.office,
        type: document.type,
        date: formattedDate,
      });

      setError("");
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  const documentUpdate = async (e) => {
    e.preventDefault();
    try {
      const formElements = e.target.elements;
      const title = formElements.title.value;
      const purpose = formElements.purpose.value;
      const description = formElements.description.value;
      const type = formElements.type.value;
      const office = formElements.office.value;
      const date = formElements.date.value;

      setLoading(true);

      if (user.role == "admin") {
        await api.updateDocument(
          id,
          {
            title: title,
            purpose: purpose,
            description: description,
            type: type,
            office: office,
            date: date,
          },
          token
        );
      } else {
        await api.deptUpdateDocument(
          id,
          {
            title: title,
            purpose: purpose,
            description: description,
            type: type,
            office: office,
            date: date,
          },
          token,
          user.office
        );
      }

      await getDocument(id);
      setError("");
      setIsEdit(false);
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  const documentDelete = async (id) => {
    try {
      setLoading(true);

      if (user.role == "admin") {
        await api.deleteDocument(id, token);
        navigate("/admin/documents");
        setError("");
        setIsEdit(false);
        setLoading(false);
      } else {
        await api.deptDeleteDocument(id, token, user.office);
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
        navigate("/department/documents");
        setError("");
        setIsEdit(false);
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  const cancel = async (id) => {
    setLoading(true);
    getDocument(id);
    setIsEdit(false);
  };

  useEffect(() => {
    getDocument(id);
  }, []);

  return (
    <div>
      <h3>Document Details</h3>
      {error && <Error error={error} setError={setError} />}
      {!isEdit ? (
        loading ? (
          <Loading />
        ) : !document ? (
          <div>No Data Available</div>
        ) : (
          <>
            <table className="document-table">
              <tbody>
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
                <tr>
                  <td>
                    <button onClick={() => documentDelete(id)}>Delete</button>
                  </td>
                  <td>
                    <button onClick={() => setIsEdit(true)}>Edit</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </>
        )
      ) : (
        <>
          {loading && <Loading />}
          <form className="document-form" onSubmit={documentUpdate}>
            <div className="form-group">
              <label htmlFor="title">Title:</label>
              <input
                type="text"
                id="title"
                name="title"
                className="form-control"
                defaultValue={document.title}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description:</label>
              <textarea
                id="description"
                name="description"
                className="form-control"
                rows="4"
                defaultValue={document.description}
                required
              ></textarea>
            </div>
            <div className="form-group">
              <label htmlFor="purpose">Purpose:</label>
              <input
                type="text"
                id="purpose"
                name="purpose"
                className="form-control"
                defaultValue={document.purpose}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="office">Office:</label>
              <input
                type="text"
                id="office"
                name="office"
                className="form-control"
                defaultValue={document.office.name}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="type">Type:</label>
              <input
                type="text"
                id="type"
                name="type"
                className="form-control"
                defaultValue={document.type.name}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="date">Date:</label>
              <input
                type="date"
                id="date"
                name="date"
                className="form-control"
                defaultValue={document.date}
                required
              />
            </div>
            {!loading && (
              <div className="button-two">
                <button type="submit" className="update-button">
                  Update
                </button>
                <button className="cancel-button" onClick={() => cancel(id)}>
                  Cancel
                </button>
              </div>
            )}
          </form>
        </>
      )}
    </div>
  );
}

export default DocumentDView;
