import React, { useState } from "react";
import "./App.css";

const mockLogin = (username, password) => {
  if (username && password) {
    if (username === "admin" && password === "admin") {
      return { success: true, role: "admin" };
    }
    return { success: true, role: "student" };
  }
  return { success: false, message: "Invalid credentials. Please try again." };
};

const Header = () => (
  <header className="app-header">
    <div className="header-content">
      <h1 className="logo">Career Assessment Tool</h1>
      <nav className="nav-links">
        <a href="#home">Home</a>
        <a href="#about">About</a>
      </nav>
    </div>
  </header>
);

const Popup = ({ message, onClose }) => (
  <div className="popup-overlay">
    <div className="popup-card">
      <h3>{message}</h3>
      <button className="popup-button" onClick={onClose}>
        OK
      </button>
    </div>
  </div>
);

const LoginForm = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = mockLogin(username, password);
    if (result.success) {
      onLoginSuccess(result.role);
    } else {
      setMessage(result.message);
    }
  };

  return (
    <div className="login-card">
      <h2 className="login-title">Login to Your Account</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Username</label>
          <input
            type="text"
            value={username}
            placeholder="Enter username"
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            placeholder="Enter password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {message && <p className="error-message">{message}</p>}

        <button type="submit" className="login-button">
          Login
        </button>
      </form>

      <div className="signup-section">
        <p>Don't have an account?</p>
        <button
          className="signup-button"
          onClick={() => alert("Signup feature coming soon!")}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default function App() {
  const [userRole, setUserRole] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const handleLoginSuccess = (role) => {
    setUserRole(role);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const renderDashboard = () => {
    if (userRole === "admin") {
      return (
        <div className="dashboard-view">
          <h2>Admin Dashboard</h2>
          <p>Welcome, Admin! You can now manage assessments and test data.</p>
          <button className="login-button" onClick={() => setUserRole(null)}>
            Logout
          </button>
        </div>
      );
    } else if (userRole === "student") {
      return (
        <div className="dashboard-view">
          <h2>Student Dashboard</h2>
          <p>Welcome, Student! You can take career assessments and view results.</p>
          <button className="login-button" onClick={() => setUserRole(null)}>
            Logout
          </button>
        </div>
      );
    }
    return <LoginForm onLoginSuccess={handleLoginSuccess} />;
  };

  return (
    <div className="app-container">
      <Header />
      <main className="main-content">{renderDashboard()}</main>
      {showPopup && (
        <Popup message="Successfully Registered!" onClose={closePopup} />
      )}
    </div>
  );
}
