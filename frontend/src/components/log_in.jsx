import React, { useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

 const handleLogin = async () => {
  try {
    const res = await fetch("http://127.0.0.1:8000/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      console.log("Login success ", data);

      //  FIX: store token here
      localStorage.setItem("token", data.access_token);

      console.log("Stored:", localStorage.getItem("token"));

      // optional redirect
      window.location.href = "/";
    } else {
      console.log("Login failed ", data);
    }
  } catch (error) {
    console.log("Error:", error);
  }
};

  return (
    <>
      <input
        className="form-input"
        type="email"
        placeholder="Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="form-input"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className="form-btn" onClick={handleLogin}>
        Login
      </button>
    </>
  );
}

export default Login;