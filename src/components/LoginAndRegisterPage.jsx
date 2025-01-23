import React, { useState } from "react";
import "../index.css";
import { backImg } from "../assets/background_logreg.png";

const LoginAndRegisterPage = () => {
  const [activeTab, setActiveTab] = useState("login");

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="login-register-container">
      <div className="header">
        <img src="....." alt="Main App Icon" className="app-icon"/>
        <div className="tab-selection">
          <button
            className={`tab ${activeTab === "login" ? "active" : ""}`}
            onClick={() => handleTabSwitch("login")}
          >
            Login
          </button>
          <button
            className={`tab ${activeTab === "register" ? "active" : ""}`}
            onClick={() => handleTabSwitch("register")}
          >
            Register
          </button>
        </div>
      </div>
      {activeTab === "login" ? <LoginForm /> : <RegisterForm />}
    </div>
  );
};

const LoginForm = () => {
  return (
    <div className="form-container">
      <div className="form-content">
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </div>
    </div>
  );
};

const RegisterForm = () => {
  return (
    <div className="form-container">
      <div className="form-content">
        <input type="text" placeholder="Name" required />
        <input type="email" placeholder="Email" required />
        <input type="tel" placeholder="Mobile" required />
        <input type="password" placeholder="Password" required />
        <input type="password" placeholder="Confirm Password" required />
        <button type="submit">Register</button>
      </div>
    </div>
  );
};

export default LoginAndRegisterPage;
