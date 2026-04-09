import React from "react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import * as api from "../../api";
import Error from "../Error";
import Loading from "../Loading";
import "./officedview.css"

function OfficeDView() {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const token = useSelector((state) => state.auth.token);

  const navigate = useNavigate();

  const getOffice = async (id) => {
    try {
      const { data } = await api.fetchOffice(id, token);

      setName(data.name);
      setError("");
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  const officeUpdate = async (e) => {
    e.preventDefault();
    try {
      const inputs = {
        name: name,
      };
      setLoading(true);
      await api.updateOffice(id, inputs, token);

      await getOffice(id);
      setError("");
      setIsEdit(false);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  const officeDelete = async (id) => {
    try {
      setLoading(true);
      await api.deleteOffice(id, token);

      setError("");
      setIsEdit(false);
      setLoading(false);
      navigate("/admin/offices");
    } catch (err) {
      setLoading(false);
      setError(setError);
    }
  };

  const cancel = async (id) => {
    setLoading(true);
    getOffice(id);
    setIsEdit(false);
  };

  useEffect(() => {
    getOffice(id);
  }, []);

  return (
    <div>
      {error && <Error error={error} setError={setError} />}

      {loading ? (
        <Loading />
      ) : !isEdit ? (
        !name ? (
          <div>No Data Avaiable</div>
        ) : (
          <>
            <div className="office-details">
              <p>Name: {name}</p>
              <div className="button-container">
                <button className="edit-button" onClick={() => setIsEdit(true)}>
                  Edit
                </button>
                <button className="delete-button" onClick={() => officeDelete(id)}>
                  Delete
                </button>
              </div>
            </div>
          </>

        )
      ) : (
        <>
          <form onSubmit={officeUpdate} className="office-form">
            <div className="form-group">
              <label htmlFor="name">Office Name:</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input"
              />
            </div>
            <div className="button-container">
              <button type="submit" className="save-button">Save</button>
              <button onClick={() => cancel(id)} className="cancel-button">Cancel</button>
            </div>
          </form>
        </>

      )}

      {/* Rest of your component content */}
    </div>
  );
}
export default OfficeDView;
