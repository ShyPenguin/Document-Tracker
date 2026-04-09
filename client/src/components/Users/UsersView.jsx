import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUsers } from "../../reducers/userSlice";
import * as api from "../../api";
import { useNavigate } from "react-router-dom";
import Loading from "../Loading";
import Error from "../Error";
import "./userview.css"
function UsersView() {
  const dispatch = useDispatch();
  const currentPage = useSelector((state) => state.users.currentPage);
  const numberOfPage = useSelector((state) => state.users.numberOfPage);
  const users = useSelector((state) => state.users.data);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = useSelector((state) => state.auth.token);

  const navigate = useNavigate();
  const getUsers = async (page) => {
    try {
      setLoading(true);
      const { data } = await api.fetchUsers(page, token);
      const { data: users, currentPage, numberOfPage } = data;
      dispatch(
        setUsers({
          users: users,
          currentPage: currentPage,
          numberOfPage: numberOfPage,
        })
      );
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  const userDelete = async (id) => {
    try {
      setLoading(true);
      await api.deleteUser(id, token);

      setError("");
      setLoading(false);
      getUsers(1);
    } catch (err) {
      setLoading(false);
      setError(setError);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      getUsers(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < numberOfPage) {
      getUsers(currentPage + 1);
    }
  };

  useEffect(() => {
    getUsers(currentPage);
  }, []);
  return (
    <div>
      {error && <Error error={error} setError={setError} />}
      <div className="Create">
        <button onClick={() => navigate("/admin/users/create")}>
          Create User
        </button>
      </div>
      
      {loading ? (
        <Loading />
      ) : users.length < 1 ? (
        <div>No data available</div>
      ) : (
        <>
          <table className="users-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Username</th>
                  <th>Role</th>
                  <th>Office</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{`${user.firstName} ${user.lastName}`}</td>
                    <td>{user.username}</td>
                    <td>{user.role}</td>
                    <td>{user.office.name}</td>
                    <td className="Delete-Button">
                      <button onClick={() => userDelete(user._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
        </>
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

export default UsersView;
