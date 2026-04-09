import React from "react";
import * as api from "../../api";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Loading from "../Loading";
import Error from "../Error";
import { useDispatch, useSelector } from "react-redux";
import "./DocumentCreate.css";
import { setStatus } from "../../reducers/statusSlice";

function DocumentCreate() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const documentCreate = async (e) => {
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
        await api.createDocument(
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
        setLoading(false);
        setError("");
        navigate("/admin/documents");
      } else {
        await api.deptCreateDocument(
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

        navigate("/department/documents");
      }
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };
  return (
    <div>
      {error && <Error error={error} setError={setError} />}
      {loading && <Loading />}
      <form className="create-document-form" onSubmit={documentCreate}>
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input type="text" id="title" name="title" className="form-input" />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <input
            type="text"
            id="description"
            name="description"
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="purpose">Purpose:</label>
          <input
            type="text"
            id="purpose"
            name="purpose"
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="office">Office:</label>
          <input type="text" id="office" name="office" className="form-input" />
        </div>
        <div className="form-group">
          <label htmlFor="type">Type:</label>
          <input type="text" id="type" name="type" className="form-input" />
        </div>
        <div className="form-group">
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            id="date"
            name="date"
            defaultValue={new Date().toISOString().split("T")[0]}
            className="form-input"
          />
        </div>
        <button type="submit" className="create-document-button">
          Create
        </button>
      </form>
    </div>
  );
}

export default DocumentCreate;
