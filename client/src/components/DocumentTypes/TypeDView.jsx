import React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as api from "../../api";
import Error from "../Error";
import Loading from "../Loading";
import { useSelector } from "react-redux";
import "./typedview.css";

function TypeDView() {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();

  const getType = async (id) => {
    try {
      const { data } = await api.fetchType(id, token);

      setName(data.name);
      setError("");
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  const typeUpdate = async (e) => {
    e.preventDefault();
    try {
      const inputs = {
        name: name,
      };
      setLoading(true);
      await api.updateType(id, inputs, token);

      await getType(id);
      setError("");
      setIsEdit(false);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  const typeDelete = async (id) => {
    try {
      setLoading(true);
      await api.deleteType(id, token);

      setError("");
      setIsEdit(false);
      setLoading(false);
      navigate("/admin/types");
    } catch (err) {
      setLoading(false);
      setError(setError);
    }
  };

  const cancel = async (id) => {
    setLoading(true);
    getType(id);
    setIsEdit(false);
  };

  useEffect(() => {
    getType(id);
  }, []);

  return (
    <div>
      {error && <Error error={error} setError={setError} />}

      {loading ? (
        <Loading />
      ) : !isEdit ? (
        !name ? (
          <div>No Data available</div>
        ) : (
          <>
            <div className="type-info">
              <div className="hope">
                <p className="type-name">Name: {name}</p>
              </div>
              <div className="hopefully">
                <div>
                  <button
                    className="edit-button"
                    onClick={() => setIsEdit(true)}
                  >
                    Edit
                  </button>
                </div>
                <div>
                  <button
                    className="delete-button"
                    onClick={() => typeDelete(id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </>
        )
      ) : (
        <>
          <form onSubmit={typeUpdate}>
            <div className="form-group">
              <label htmlFor="name">Type Name:</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="button-group">
              <button type="submit" className="save-button">
                Save
              </button>
              <button onClick={() => cancel(id)} className="cancel-button">
                Cancel
              </button>
            </div>
          </form>
        </>
      )}

      {/* Rest of your component content */}
    </div>
  );
}
export default TypeDView;
