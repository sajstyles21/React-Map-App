import React from "react";
import { useState } from "react";
import "./Login.css";
import { useMutation } from "react-query";
import { login } from "../../services/apiCalls";

const Login = ({
  callback,
  setCurrentUser,
  setShowLogin,
  updateCurrentUser,
}) => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const { isLoading, mutate } = useMutation(login, {
    onSuccess: (response) => {
      setMessage("Login Successfully");
      localStorage.setItem("user", JSON.stringify(response));
      setCurrentUser(response);
      updateCurrentUser();
      setShowLogin(false);
    },
    onError: (error) => {
      setMessage(error.response.data);
    },
    onMutate: () => {},
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate({
      email: data.email,
      password: data.password,
    });
  };

  return (
    <div className="loginContainer">
      <div className="loginBox">
        <span className="cross" onClick={() => callback()}>
          x
        </span>
        <h1 style={{ textAlign: "center" }}>Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="box">
            <label htmlFor="name">Email</label>
            <input
              name="email"
              type="email"
              value={data.email}
              onChange={handleChange}
              autoComplete="email"
              placeholder="Enter email"
              className="input-class"
            />
          </div>
          <div className="box">
            <label htmlFor="name">Password</label>
            <input
              name="password"
              type="password"
              value={data.password}
              onChange={handleChange}
              autoComplete="current-password"
              placeholder="Enter password"
              className="input-class"
            />
          </div>
          {message && (
            <p style={{ textAlign: "center", marginTop: "10px" }}>{message}</p>
          )}
          <div className="box">
            <button type="submit" className="submit">
              {isLoading ? "Logging In..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
