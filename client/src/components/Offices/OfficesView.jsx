import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeOffices, setOffices } from "../../reducers/officeSlice";
import * as api from "../../api";
import { Link, useNavigate } from "react-router-dom";
import Loading from "../Loading";
import "./officesview.css"
function OfficesView() {
  const dispatch = useDispatch();
  const currentPage = useSelector((state) => state.offices.currentPage);
  const numberOfPage = useSelector((state) => state.offices.numberOfPage);
  const offices = useSelector((state) => state.offices.data);
  const token = useSelector((state) => state.auth.token);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const getOffices = async (page) => {
    try {
      setLoading(true);
      const { data } = await api.fetchOffices(page, token);
      const { data: offices, currentPage, numberOfPage } = data;
      dispatch(
        setOffices({
          offices: offices,
          currentPage: currentPage,
          numberOfPage: numberOfPage,
        })
      );
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err.message);
      if (err.message.includes("404")) {
        dispatch(removeOffices());
      }
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      getOffices(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < numberOfPage) {
      getOffices(currentPage + 1);
    }
  };

  useEffect(() => {
    getOffices(currentPage);
  }, []);
  return (
    <div>
      {error && <p>{error}</p>}
      <div className="office-view-button">
        <button onClick={() => navigate("/admin/offices/create")}>
          Create Office
        </button>
      </div>
      {loading ? (
        <Loading />
      ) : offices.length < 1 ? (
        <div>No data available</div>
      ) : (
        <table className="office-table">
            <tbody>
              {offices.map((office) => (
                <tr key={office._id}>
                  <td>
                    <Link to={`${office._id}`}>{office.name}</Link>
                  </td>
                </tr>
              ))}
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

export default OfficesView;
