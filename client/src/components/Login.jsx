import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handlelogin = async (e) => {
    e.preventDefault(); 
  
    const userData = { email, password };
  
    try {
      const response = await axios.post("http://localhost:3001/login", userData);
  
      console.log("login successful");
      navigate("/room");
  
    } catch (err) {
      if (err.response) {
        console.log("Login failed:", err.response.data.message);
      } else {
        console.log("Login error:", err.message);
      }
    }
  };

  return (
    <div>
      <div>
        <form onSubmit={handlelogin}>
          <input
            type="text"
            placeholder="enter email"
            onChange={(event) => {
              setEmail(event.target.value);
            }}
          />
          <input
            type="text"
            placeholder="enter password"
            onChange={(event) => {
              setPassword(event.target.value);
            }}
          />
          <button type="submit">login</button>
        </form>
      </div>
      <p>Don't have an account?</p>
      <button onClick={() => navigate("/signup")}>Signup</button>
    </div>
  );
}

export default Login;
