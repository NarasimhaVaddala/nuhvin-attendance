import React, { useEffect, useState } from "react";
import "./Signup.css";
import { IoEyeOffOutline } from "react-icons/io5";
import { LuEye } from "react-icons/lu";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer,  toast } from "react-toastify";
const Signup = ({ url }) => {
  const [showPassword, setShoPassword] = useState(false);
  const [userId, setUserId] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [emp_id , setemp_id] = useState("")
  const navigate = useNavigate();
  

  useEffect(() => {
    let token = localStorage.getItem("token");
    if (token) {
      return navigate("/");
    }
  }, []);

  const makeSignup = async () => {
    

    try {
      const data = await axios.post(`${url}/auth/reg`, {
        name: name,
        email: userId,
        emp_id:emp_id,
        password: password,
      });
      console.log(data);

      if (data.data.success) {
        alert("signup success please login");
        return navigate("/login");
      }
    } catch (error) {
      
        
      if (error.response.status == 400) {

        return toast.error("user already exists please login!");
      }
      toast.error(error.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-inner-card">

        <ToastContainer autoClose={500} />
        <h3>Employee Signup</h3>
        <p>Hey, Enter your details to create your account</p>
        <input
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
          type="text"
          className="login-input"
          placeholder="Enter Full Name"
        />
        <input
          value={userId}
          onChange={(e) => {
            setUserId(e.target.value);
          }}
          type="text"
          className="login-input"
          placeholder="Enter Email Id"
        />
        <input
          value={emp_id}
          onChange={(e) => {
            setemp_id(e.target.value);
          }}
          type="text"
          className="login-input"
          placeholder="Enter Employee Id"
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
        <button onClick={makeSignup}>Sign In</button>
        <span>
          Already have an account ?{" "}
          <span onClick={() => navigate("/login")}>Login</span>
        </span>
      </div>
    </div>
  );
};

export default Signup;
