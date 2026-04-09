import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as api from "../../api";
import Loading from "../Loading";
import Error from "../Error";
import { Link, useNavigate } from "react-router-dom";
import { setTrack } from "../../reducers/trackSlice";
import { removeReturning, setReturning } from "../../reducers/returningSlice";
import "./returning.css";
function ReturningView() {
  const dispatch = useDispatch();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const currentPage = useSelector((state) => state.returning.currentPage);
  const numberOfPage = useSelector((state) => state.returning.numberOfPage);
  const documents = useSelector((state) => state.returning.data);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);

  const navigate = useNavigate();
  const filterDocuments = async (page, endDate, startDate) => {
    try {
      setLoading(true);
      const { data } = await api.deptFilterDocumentStatus(
        page,
        endDate,
        startDate,
        token,
        user.office,
        "Returning"
      );
      const { data: documents, currentPage, numberOfPage } = data;

      dispatch(
        setReturning({
          documents: documents,
          currentPage: currentPage,
          numberOfPage: numberOfPage,
        })
      );
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err.message);
      if (err.message.includes("404")) {
        dispatch(removeReturning());
      }
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      filterDocuments(currentPage - 1, endDate, startDate);
    }
  };

  const handleNextPage = () => {
    if (currentPage < numberOfPage) {
      filterDocuments(currentPage + 1, endDate, startDate);
    }
  };

  const goToTrack = async (document) => {
    dispatch(
      setTrack({
        document: document.id,
      })
    );

    if (user.role == "admin") {
      navigate("/admin/track");
    } else {
      navigate("/department/track");
    }
  };

  useEffect(() => {
    filterDocuments(currentPage, endDate, startDate);
  }, []);
  return (
    <>
      <div>
        <div className="container-filter">
          <div className="filter">
            <div className="filter-status">
              <div>
                <label htmlFor="startDate">Start Date:</label>
              </div>
              <div>
                <input
                  type="date"
                  id="startDate"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
            </div>
            <div className="filter-status">
              <div>
                <label htmlFor="endDate">End Date:</label>
              </div>
              <div>
                <input
                  type="date"
                  id="endDate"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div>
            <button onClick={() => filterDocuments(1, endDate, startDate)}>
              Search
            </button>
          </div>
        </div>
        {error && <Error error={error} setError={setError} />}
        {loading ? (
          <Loading />
        ) : documents.length < 1 ? (
          <div> No data available</div>
        ) : (
          <>
            <div>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Type</th>
                    <th>Sender</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((document) => (
                    <tr key={document.id}>
                      <td onClick={() => goToTrack(document)}>{document.id}</td>
                      <td>
                        <Link to={`view/${document.id}`}>{document.title}</Link>
                      </td>
                      <td>{document.type}</td>
                      <td>{document.office}</td>
                      <td>{new Date(document.date).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
          </>
        )}
      </div>
    </>
  );
}

export default ReturningView;
