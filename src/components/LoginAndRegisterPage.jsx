import React, { useState } from "react";
import "../index.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import appIcon from '../assets/app.svg'

const LoginAndRegisterPage = () => {
  const [activeTab, setActiveTab] = useState("register");

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="login-register-container">
      <ToastContainer></ToastContainer>
      <div className="header">
        <img src={appIcon} alt="Main App Icon" className="app-icon"/>
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
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault(); 

    const userData = { username, password };
    console.log(userData)

    try {
      const response = await fetch('https://linkmanager-backend.onrender.com/login', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success("Login Success!")
        localStorage.setItem('fp2_user_jwt', data.token);
        localStorage.setItem('fp2_username', userData.username);
        window.location.href = '/dashboard'
      } else {
        console.log(data)
        toast.error("Invalid credentials");
      }
    } catch (error) {
      toast.error("Network error", error) 
    }
  };

  return (
    <div className="form-container">
      <form className="form-content" onSubmit={handleLogin}>
        <input 
          type="text" 
          placeholder="Username" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        {/* {error && <div className="error-message">{error}</div>} */}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

const RegisterForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phoneno, setPhoneno] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault(); 

    if (password !== confirmPassword) {
      toast.warn("Passwords do not match");
      return;
    }

    const userData = { username, email, phoneno, password };
    console.log(userData)
    fetch('https://linkmanager-backend.onrender.com/register', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
  })
      .then(response => {
          if (!response.ok) {
              return response.json().then(err => {
                  throw new Error(err.error || 'Network response was not ok');
              });
          }
          return response.json();
      })
      .then(data => {
          // console.log('Registration successful:', data);
          toast.success('Registration successful!');
          setTimeout(() => {
            window.location.href = '/'
          }, 1000);
          
      })
      .catch(error => {
          console.error('There was a problem with the registration:', error);
          toast.error('Registration failed: ' + error.message);
      });
      
  };

  return (
    <div className="form-container">
      <form className="form-content" onSubmit={handleRegister}>
        <input 
          type="text" 
          placeholder="Name" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          required 
        />
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <input 
          type="tel" 
          placeholder="Mobile" 
          value={phoneno} 
          onChange={(e) => setPhoneno(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="Confirm Password" 
          value={confirmPassword} 
          onChange={(e) => setConfirmPassword(e.target.value)} 
          required 
        />
        {/* {error && <div className="error-message">{error}</div>} */}
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default LoginAndRegisterPage;