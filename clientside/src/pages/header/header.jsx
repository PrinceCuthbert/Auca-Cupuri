import React, { useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
// import "./header.css";
import "../../css/homepage/header.css";

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Debug authentication state
  console.log("Header - Authentication state:", { user, isAuthenticated });

  useEffect(() => {
    // Map paths to titles

    const pageTitles = {
      "/": "Past Paper Exams Portal",
      "/cupuriportal/login": "Login",
      "/cupuriportal/signup": "Sign Up",
      "/cupuriportal/dashboard/browse": "Browse",
      "/cupuriportal/dashboard/upload": "Upload",
      "/cupuriportal/dashboard": "Dashboard",
      "/cupuriportal/reviews": "Reviews",
    };

    const title = pageTitles[location.pathname];
    document.title = `Auca Cupuri | ${title}`;

    return function () {
      document.title = "Auca Cupuri | Past Paper Exams Portal";
      // console.log(`Clean up effect for pages ${title}`);
    };
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/cupuriportal/login");
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link
          to={isAuthenticated && user ? "#" : "/"}
          onClick={(e) => isAuthenticated && user && e.preventDefault()}
          className="logo-group">
          <div className="logo-icon">
            <svg className="icon-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
            </svg>
          </div>
          <div className="logo-texts">
            <h1 className="logo-title">AUCA CUPURI</h1>
            <p className="logo-subtitle">Past Exams Portal</p>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="main-nav">
          {isAuthenticated && user && (
            <>
              <Link to="/cupuriportal/dashboard/browse" className="nav-link">
                <svg
                  className="nav-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                Browse
              </Link>

              <Link to="/cupuriportal/dashboard" className="nav-link active">
                <svg
                  className="nav-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Dashboard
              </Link>
              <Link to="/cupuriportal/reviews" className="nav-link">
                <svg
                  className="icon-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                Reviews
              </Link>
            </>
          )}
        </nav>

        {/* User Menu */}
        {isAuthenticated && user ? (
          <div className="user-menu">
            <div className="user-info">
              <div className="user-name-role">
                <p className="user-name">{user.name}</p>
                <p className="user-role">{user.role}</p>
              </div>
            </div>
            <button onClick={handleLogout} className="logout-btn">
              <svg
                className="nav-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Logout
            </button>
          </div>
        ) : (
          <div className="auth-links">
            <Link to="/cupuriportal/login" className="login-link">
              Login
            </Link>
            <Link to="/cupuriportal/signup" className="signup-btn">
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
