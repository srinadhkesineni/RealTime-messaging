import React, { useState } from "react";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handlelogin = async () => {
    const userData = { email, password };
    try {
      const response = await axios.post(
        "http://localhost:3001/login",
        userData
      );
      if (response === 200) {
        console.log("login successful");
      }
    } catch (err) {
      console.log("login failed", err);
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
    </div>
  );
}

export default Login;
