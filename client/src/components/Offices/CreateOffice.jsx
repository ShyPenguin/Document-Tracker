import { React, useState } from "react";
import * as api from "../../api";
import { useNavigate } from "react-router-dom";
import Loading from "../Loading";
import Error from "../Error";
import { useSelector } from "react-redux";
import "./createoffice.css"

function CreateOffice() {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.createOffice({ name: name }, token);
      setLoading(false);
      setName("");
      setError("");
      navigate("/admin/offices");
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };
  return (
    <div>
      {error && <Error error={error} setError={setError} />}
      {loading ? (
        <Loading />
      ) : (
        <form className="cool-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Create Office:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <button className="submit-button" type="submit">Create</button>
        </form>
      )}
    </div>
  );
}

export default CreateOffice;
