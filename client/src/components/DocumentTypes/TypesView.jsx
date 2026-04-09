import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeTypes, setTypes } from "../../reducers/typeSlice";
import * as api from "../../api";
import { Link, useNavigate } from "react-router-dom";
import Loading from "../Loading";

function TypesView() {
  const dispatch = useDispatch();
  const currentPage = useSelector((state) => state.types.currentPage);
  const numberOfPage = useSelector((state) => state.types.numberOfPage);
  const [error, setError] = useState("");
  const types = useSelector((state) => state.types.data);
  const [loading, setLoading] = useState(true);
  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();
  const getTypes = async (page) => {
    try {
      setLoading(true);
      const { data } = await api.fetchTypes(page, token);
      const { data: types, currentPage, numberOfPage } = data;
      dispatch(
        setTypes({
          types: types,
          currentPage: currentPage,
          numberOfPage: numberOfPage,
        })
      );
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err.message);
      if (err.message.includes("404")) {
        dispatch(removeTypes());
      }
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      getTypes(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < numberOfPage) {
      getTypes(currentPage + 1);
    }
  };

  useEffect(() => {
    getTypes(currentPage);
  }, []);
  return (
    <div>
      {error && <p>{error}</p>}
      <div className="office-view-button">
        <button onClick={() => navigate("/admin/types/create")}>
          Create Type
        </button>
      </div>
      
      {loading ? (
        <Loading />
      ) : (
        <table className="office-table">
          <tbody>
            {types.length < 1 ? (
              <tr>
                <td colSpan="1">No data available</td>
              </tr>
            ) : (
              types.map((type) => (
                <tr key={type._id}>
                  <td>
                    <Link to={`${type._id}`}>{type.name}</Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

      )}
      <div>
        <div className="pagination">
          <button onClick={handlePreviousPage} disabled={currentPage === 1}>
            {"<"}
          </button>
          <button
            onClick={handleNextPage}
            disabled={currentPage === numberOfPage}
          >
            {">"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default TypesView;
