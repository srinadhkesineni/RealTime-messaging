import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    const userData = { username, email, password };

    try {
      const response = await axios.post(
        "http://localhost:3001/signup",
        userData
      );

      console.log("Signup successful");
      navigate("/");
    } catch (err) {
      if (err.response) {
        console.log("Signup failed:", err.response.data.message);
        alert(err.response.data.message);
      } else {
        console.log("Signup error:", err.message);
      }
    }
  };

  return (
    <div>
      <div>
        <form onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="enter username"
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
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
          <button type="submit">Signup</button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
