import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GraduationCap, Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import Footer from "../footer";
import "../../css/homepage/login/login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return setError("Email and password are required");

    setLoading(true);
    setError(""); // Clear previous errors
    try {
      await login(email, password);
      toast.success("Logged in successfully!");
      navigate("/cupuriportal/dashboard");
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="login-page">
        <div className="login-title-section">
          <div className="icon-container">
            <GraduationCap className="icon-white" />
          </div>
          <h2>Sign in to AUCA CUPURI</h2>
          <p className="signup">
            Don't have an account?{" "}
            <Link to="/cupuriportal/signup" className="signup-link">
              Sign up here
            </Link>
          </p>
        </div>

        <main className="login-main">
          <div className="login-card">
            <form className="login-form" onSubmit={handleSubmit}>
              <label>Email address</label>
              <input
                type="email"
                placeholder="admin@auca.ac.rw"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                required
              />

              <label>Password</label>
              <div className="input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  required
                />
                <span
                  className="toggle-icon"
                  onClick={() => setShowPassword((prev) => !prev)}>
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </span>
              </div>

              {/* {error && <p className="error-message">{error}</p>} */}

              <button
                type="submit"
                className="submit-button"
                disabled={loading}>
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
