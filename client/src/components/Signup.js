import React, { useState } from "react";
import axios from "axios";

function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    const userData = { username, email, password };
    try {
      const response = await axios.post(
        "http://localhost:3001/signup",
        userData
      );
      if (response === 200) {
        console.log("signup successful");
      }
    } catch (err) {
      console.log("signup failed", err);
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
