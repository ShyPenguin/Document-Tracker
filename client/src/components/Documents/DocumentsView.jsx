import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as api from "../../api";
import Loading from "../Loading";
import Error from "../Error";
import { removeDocuments, setDocuments } from "../../reducers/documentSlice";
import { Link, useNavigate } from "react-router-dom";
import { setTrack } from "../../reducers/trackSlice";
import "./DocumentsView.css";

function DocumentsView() {
  const dispatch = useDispatch();
  const [text, setText] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const currentPage = useSelector((state) => state.documents.currentPage);
  const numberOfPage = useSelector((state) => state.documents.numberOfPage);
  const documents = useSelector((state) => state.documents.data);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);

  const navigate = useNavigate();

  const searchDocuments = async (page, endDate, startDate, text) => {
    try {
      setLoading(true);

      if (user.role == "admin") {
        const { data } = await api.searchDocument(
          page,
          endDate,
          startDate,
          text,
          token
        );
        const { data: documents, currentPage, numberOfPage } = data;
        dispatch(
          setDocuments({
            documents: documents,
            currentPage: currentPage,
            numberOfPage: numberOfPage,
          })
        );
      } else {
        const { data } = await api.deptSearchDocument(
          page,
          endDate,
          startDate,
          text,
          token,
          user.office
        );
        const { data: documents, currentPage, numberOfPage } = data;
        dispatch(
          setDocuments({
            documents: documents,
            currentPage: currentPage,
            numberOfPage: numberOfPage,
          })
        );
      }

      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err.message);

      if (err.message.includes("404")) {
        dispatch(removeDocuments());
      }
    }
  };

  const goToTrack = async (document) => {
    dispatch(
      setTrack({
        document: document._id,
        track: document.documentHistory,
      })
    );

    if (user.role == "admin") {
      navigate("/admin/track");
    } else {
      navigate("/department/track");
    }
  };
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      searchDocuments(currentPage - 1, endDate, startDate, text);
    }
  };

  const handleNextPage = () => {
    if (currentPage < numberOfPage) {
      searchDocuments(currentPage + 1, endDate, startDate, text);
    }
  };

  useEffect(() => {
    searchDocuments(currentPage, endDate, startDate, text);
  }, []);
  return (
    <>
      <div>
        <div className="Search-Date">
          <div>
            <label htmlFor="startDate">Start Date:</label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="endDate">End Date:</label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        <div className="Search-input">
          <div>
            <label htmlFor="searchInput">Search:</label>
            <input
              type="text"
              id="searchInput"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
          <div>
            <button
              onClick={() => searchDocuments(1, endDate, startDate, text)}
            >
              Search
            </button>
          </div>
        </div>
        <div className="Create-button">
          <button
            onClick={() =>
              navigate(
                user.role === "admin"
                  ? "/admin/documents/create"
                  : "/department/documents/create"
              )
            }
          >
            Create Document
          </button>
        </div>

        {error && <Error error={error} setError={setError} />}
        {loading ? (
          <Loading />
        ) : (
          <>
            <div>
              {documents.length < 1 ? (
                <div> No Data Available </div>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Title</th>
                      <th>Type</th>
                      <th>Office</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documents.map((document) => (
                      <tr key={document._id}>
                        <td onClick={() => goToTrack(document)}>
                          {document._id}
                        </td>
                        <td>
                          <Link to={`${document._id}`}>{document.title}</Link>
                        </td>
                        <td>{document.type.name}</td>
                        <td>{document.office.name}</td>
                        <td>{new Date(document.date).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
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

export default DocumentsView;
