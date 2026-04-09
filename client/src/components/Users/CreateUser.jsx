import React from "react";
import * as api from "../../api";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Loading from "../Loading";
import Error from "../Error";
import { useSelector } from "react-redux";
import "./CreateUser.css";

function CreateUser() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formElements = e.target.elements;
      const firstName = formElements.firstName.value;
      const lastName = formElements.lastName.value;
      const username = formElements.username.value;
      const password = formElements.password.value;
      const role = formElements.role.value;
      const office = formElements.office.value;

      await api.createUser(
        {
          firstName: firstName,
          lastName: lastName,
          username: username,
          password: password,
          role: role,
          office: office,
        },
        token
      );
      setLoading(false);
      setError("");
      navigate("/admin/users");
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  return (
    <>
      <h2>CreateUser</h2>
      {error && <Error error={error} setError={setError} />}
      {loading && <Loading />}
      <form className="clean-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="firstName">First Name:</label>
          <input type="text" id="firstName" name="firstName" />
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Last Name:</label>
          <input type="text" id="lastName" name="lastName" />
        </div>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" name="username" />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" />
        </div>
        <div className="form-group">
          <label htmlFor="role">Role:</label>
          <input type="text" id="role" name="role" />
        </div>
        <div className="form-group">
          <label htmlFor="office">Office:</label>
          <input type="text" id="office" name="office" />
        </div>
        <button className="submit-button" type="submit">Create</button>
      </form>
    </>
  );
}

export default CreateUser;
