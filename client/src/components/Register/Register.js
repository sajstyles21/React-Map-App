import React from "react";
import { useState } from "react";
import "./Register.css";
import { useMutation } from "react-query";
import { register } from "../../services/apiCalls";

const Register = ({ callback }) => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const { isLoading, mutate } = useMutation(register, {
    onSuccess: (response) => {
      setMessage("Registered Successfully");
      setData({ name: "", email: "", password: "" });
    },
    onError: (error) => {
      setMessage(error.response.data);
    },
    onMutate: () => {},
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate({
      name: data.name,
      email: data.email,
      password: data.password,
    });
  };

  return (
    <div className="registerContainer">
      <div className="registerBox">
        <span className="cross" onClick={() => callback()}>
          x
        </span>
        <h1 style={{ textAlign: "center" }}>Register</h1>
        <form onSubmit={handleSubmit}>
          <div className="box">
            <label htmlFor="name">Name</label>
            <input
              name="name"
              type="text"
              autoComplete="name"
              value={data.name}
              onChange={handleChange}
              placeholder="Enter name"
              className="input-class"
              required={true}
            />
          </div>
          <div className="box">
            <label htmlFor="name">Email</label>
            <input
              name="email"
              type="email"
              value={data.email}
              autoComplete="email"
              onChange={handleChange}
              placeholder="Enter email"
              className="input-class"
              required={true}
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
              required={true}
            />
          </div>
          {message && (
            <p style={{ textAlign: "center", marginTop: "10px" }}>{message}</p>
          )}
          <div className="box">
            <button
              type="submit"
              style={{ cursor: "pointer" }}
              className="submit"
            >
              {isLoading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
