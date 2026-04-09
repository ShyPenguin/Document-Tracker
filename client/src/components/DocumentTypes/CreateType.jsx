import { useState } from "react";
import * as api from "../../api";
import { useNavigate } from "react-router-dom";
import Loading from "../Loading";
import Error from "../Error";
import { useSelector } from "react-redux";
import "./createtype.css";

function CreateType() {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.createType({ name: name }, token);
      setLoading(false);
      setName("");
      setError("");
      navigate("/admin/types");
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
        <div className="please2">
          <form onSubmit={handleSubmit}>
            <div>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <button type="submit">Create</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default CreateType;
