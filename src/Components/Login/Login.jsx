import React, { useState } from "react";
import "./Login.css";
import { IoEyeOffOutline } from "react-icons/io5";
import { LuEye } from "react-icons/lu";
const Login = () => {
  const [showPassword, setShoPassword] = useState(false);
  return (
    <div className="login-container">
      <div className="login-inner-card">
        <h3>Employee Login</h3>
        <p>Hey, Enter your details to get sign im to your account</p>
        <input
          type="text"
          className="login-input"
          placeholder="Enter Intership Id"
        />
        <div className="login-inner-card-div">
          <input
            type={showPassword ? "password" : "text"}
            className="login-input"
            placeholder="Enter Password"
          />
          {showPassword ? (
            <span
              className="login-icons-card"
              onClick={() => setShoPassword(false)}
            >
              <LuEye />
            </span>
          ) : (
            <span
              className="login-icons-card"
              onClick={() => setShoPassword(true)}
            >
              <IoEyeOffOutline />
            </span>
          )}
        </div>
        <h5>Having trouble in sign In?</h5>
        <button>Sign In</button>
        <span>
          Don't have an account ? <span>Register Now</span>
        </span>
      </div>
    </div>
  );
};

export default Login;
