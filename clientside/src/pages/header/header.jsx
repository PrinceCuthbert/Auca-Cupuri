import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
// CSS has been replaced with Tailwind classes

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Debug authentication state
  // console.log("Header - Authentication state:", { user, isAuthenticated });

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

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate("/cupuriportal/login");
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-sm font-sans">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
        {/* Logo */}
        <Link
          to={isAuthenticated && user ? "/cupuriportal/dashboard" : "/"}
          className="flex items-center gap-3 no-underline">
          <div className="bg-gradient-to-br from-emerald-600 to-teal-600 p-2 rounded-xl flex transition-transform duration-300 hover:scale-110 text-white">
            <svg
              className="w-6 h-6 text-white"
              fill="currentColor"
              viewBox="0 0 20 20">
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
            </svg>
          </div>
          <div className="flex flex-col leading-tight select-none">
            <h1 className="text-xl font-bold m-0 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              AUCA CUPURI
            </h1>
            <p className="text-xs text-gray-500 m-0 hidden sm:block">
              Past Exams Portal
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {isAuthenticated && user && (
            <>
              <Link
                to="/cupuriportal/dashboard/browse"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 select-none ${
                  isActiveRoute("/cupuriportal/dashboard/browse")
                    ? "bg-emerald-100 text-emerald-700 shadow-sm"
                    : "text-gray-600 hover:text-emerald-600 hover:bg-emerald-50"
                }`}>
                <svg
                  className="w-4 h-4"
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

              <Link
                to="/cupuriportal/dashboard"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 select-none ${
                  isActiveRoute("/cupuriportal/dashboard")
                    ? "bg-emerald-100 text-emerald-700 shadow-sm"
                    : "text-gray-600 hover:text-emerald-600 hover:bg-emerald-50"
                }`}>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                Dashboard
              </Link>

              <Link
                to="/cupuriportal/reviews"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 select-none ${
                  isActiveRoute("/cupuriportal/reviews")
                    ? "bg-emerald-100 text-emerald-700 shadow-sm"
                    : "text-gray-600 hover:text-emerald-600 hover:bg-emerald-50"
                }`}>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
                Reviews
              </Link>
            </>
          )}
        </nav>

        {/* Desktop User Menu */}
        {isAuthenticated && user ? (
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="m-0 text-sm font-semibold text-gray-900 select-none">
                  {user.name}
                </p>
                <p className="m-0 text-xs font-semibold text-emerald-600 capitalize select-none">
                  {user.role}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-red-600 bg-transparent border-0 rounded-lg cursor-pointer hover:text-red-700 hover:bg-red-50 transition-all duration-300 select-none">
              <svg
                className="w-4 h-4"
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
          <div className="hidden md:flex gap-2 items-center">
            <Link
              to="/cupuriportal/login"
              className="text-sm font-medium text-gray-700 no-underline hover:text-emerald-600 transition-colors duration-300 select-none">
              Login
            </Link>
            <Link
              to="/cupuriportal/signup"
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg no-underline shadow-lg hover:from-emerald-700 hover:to-teal-700 hover:-translate-y-0.5 transition-all duration-300 select-none">
              Sign Up
            </Link>
          </div>
        )}

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
          {mobileMenuOpen ? (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          {isAuthenticated && user ? (
            <div className="p-4 space-y-2">
              {/* User Info */}
              <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="m-0 text-sm font-semibold text-gray-900">
                    {user.name}
                  </p>
                  <p className="m-0 text-xs font-medium text-emerald-600 capitalize">
                    {user.role}
                  </p>
                </div>
              </div>

              {/* Navigation Links */}
              <Link
                to="/cupuriportal/dashboard/browse"
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActiveRoute("/cupuriportal/dashboard/browse")
                    ? "bg-emerald-100 text-emerald-700"
                    : "text-gray-700 hover:bg-gray-50"
                }`}>
                <svg
                  className="w-5 h-5"
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
                Browse Exams
              </Link>

              <Link
                to="/cupuriportal/dashboard"
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActiveRoute("/cupuriportal/dashboard")
                    ? "bg-emerald-100 text-emerald-700"
                    : "text-gray-700 hover:bg-gray-50"
                }`}>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                Dashboard
              </Link>

              <Link
                to="/cupuriportal/reviews"
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActiveRoute("/cupuriportal/reviews")
                    ? "bg-emerald-100 text-emerald-700"
                    : "text-gray-700 hover:bg-gray-50"
                }`}>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
                Reviews
              </Link>

              <hr className="my-3 border-gray-200" />

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all">
                <svg
                  className="w-5 h-5"
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
            <div className="p-4 space-y-3">
              <Link
                to="/cupuriportal/login"
                className="block w-full text-center px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                Login
              </Link>
              <Link
                to="/cupuriportal/signup"
                className="block w-full text-center px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
