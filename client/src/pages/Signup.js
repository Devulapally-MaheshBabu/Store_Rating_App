import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "Normal User",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/signup", formData);
      alert("Registration Successful! Please Login.");
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.error || "Registration Failed");
    }
  };

  return (
    <div
      style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: "300px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <h2>Register</h2>
        <input
          name="name"
          placeholder="Name (Min 10 chars)"
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password (1 Upper, 1 Special)"
          onChange={handleChange}
          required
        />
        <input
          name="address"
          placeholder="Address"
          onChange={handleChange}
          required
        />

        <select name="role" onChange={handleChange}>
          <option value="Normal User">Normal User</option>
          <option value="Store Owner">Store Owner</option>
          <option value="System Administrator">System Administrator</option>
        </select>

        <button
          type="submit"
          style={{
            padding: "10px",
            background: "green",
            color: "white",
            border: "none",
          }}
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Signup;
