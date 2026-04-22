import React, { useState } from "react";
import Login from "../components/log_in";
import Signup from "../components/sign_up";
import "../css_styling/registration.css";
import signupImg from "../assets/login.svg";

function Registration() {
  const [isSignup, setIsSignup] = useState(false);

  return (
    <div className="registration-container">

      {/* LEFT */}
      <div className="registration-left">

        <div className="logo">LOST&FOUND</div>

        <h2 className="registration-title">
          {isSignup ? "Create an account" : "Log in to your account"}
        </h2>

        <p className="registration-sub">
          {isSignup ? (
            <>Already have an account? <span onClick={() => setIsSignup(false)}>Login</span></>
          ) : (
            <>Don't have an account? <span onClick={() => setIsSignup(true)}>Sign Up</span></>
          )}
        </p>

        <div className="success-box">
          You have successfully logged out.
        </div>

        <div className="divider">With Email and Password</div>

        {isSignup ? <Signup /> : <Login />}

      </div>

      {/* RIGHT */}
      <div className="registration-right">
        <img src={signupImg} alt="signup" className="registration-image" />
      </div>

    </div>
  );
}

export default Registration;