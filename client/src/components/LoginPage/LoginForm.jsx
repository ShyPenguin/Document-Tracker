import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setLogin } from "../../reducers/authSlice";
import { useNavigate } from "react-router-dom";
import * as api from "../../api";
import Loading from "../Loading";
import Error from "../Error";
import "./login.css";

function LoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const login = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const { data } = await api.loggedIn({
        username: username,
        password: password,
      });

      const { token, userInfo } = data;
      if (token) {
        dispatch(
          setLogin({
            user: userInfo,
            token: token,
          })
        );
        if (userInfo.role == "admin") {
          navigate("/admin");
        } else {
          navigate("/department");
        }
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  return (
    <div>
      {error && <Error error={error} setError={setError} />}
      {loading && <Loading />}
      <div class="container">
        <div class="header">
          <h1>MORESCO</h1>
        </div>
        <div class="user-info"></div>
        <form class="login-form" onSubmit={login}>
          <label for="username">Username:</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label for="password">Password:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
