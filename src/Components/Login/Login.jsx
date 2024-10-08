import React, { useEffect, useState } from "react";
import "./Login.css";
import { IoEyeOffOutline } from "react-icons/io5";
import { LuEye } from "react-icons/lu";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
const Login = ({ url, setLoggedIn }) => {
  const navigate = useNavigate();
  console.log(url);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setLoggedIn(true);
      return navigate("/");
    }
  }, []);

  const [showPassword, setShoPassword] = useState(false);
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

  const makeLogin = async () => {
    try {
      const data = await axios.post(`${url}/auth/login`, {
        email: userId,
        password: password,
      });
      if (data.data.success) {
        localStorage.setItem("token", data.data.token);
        localStorage.setItem('role' , data.data.role)
        console.log(data.data)
        if(data.data.role === 'admin') {
          return navigate("/admin")
        }
        return navigate("/");
      }

      if (!data.data.success) {
        toast.error(data.data.error);
      }
    } catch (error) {
     
        
        
      if (error.response?.status == 401) {

        return toast.error("Invalid Credentials");
      }
      toast.error(error.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-inner-card">
        <ToastContainer autoClose={500} />
        <h3>Employee Login</h3>
        <p>Hey, Enter your details to get sign in to your account</p>
        <input
          value={userId}
          onChange={(e) => {
            setUserId(e.target.value);
          }}
          type="text"
          className="login-input"
          placeholder="Enter Email Id"
        />
        <div className="login-inner-card-div">
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
        {/* <h5>Having trouble in sign In?</h5> */}
        <button onClick={makeLogin}>Sign In</button>
        <span>
          Don't have an account ?{" "}
          <span onClick={() => navigate("/signup")}>Register Now</span>
        </span>
      </div>
    </div>
  );
};

export default Login;
