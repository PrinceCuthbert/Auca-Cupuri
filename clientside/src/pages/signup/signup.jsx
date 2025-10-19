import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GraduationCap, Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";

import { useAuth } from "../../context/AuthContext";
import Footer from "../footer";
import "../../css/homepage/login/login.css";
import "../../css/homepage/signup/signup.css";

export default function SignUp() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    role: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match!");
    }

    if (
      !formData.fullName ||
      !formData.email ||
      !formData.role ||
      !formData.password
    ) {
      return toast.error("Please fill in all fields!");
    }

    setLoading(true);
    try {
      console.log("Starting registration process...");
      await register({
        fullName: formData.fullName,
        email: formData.email,
        role: formData.role,
        password: formData.password,
      });

      console.log("Registration successful, redirecting...");
      toast.success("Account created successfully!");
      navigate("/cupuriportal/login");
    } catch (err) {
      console.error("Registration failed:", err);
      toast.error(err.message || "Registration failed. Please try again.");
    } finally {
      console.log("Setting loading to false");
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
          <h2>Create your account</h2>
          <p className="signup">
            Already have an account?{" "}
            <Link to="/cupuriportal/login" className="signup-link">
              Sign in here
            </Link>
          </p>
        </div>

        <main className="login-main">
          <div className="login-card">
            <form className="login-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="role">Role</label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required>
                  <option value="">Select Role</option>
                  <option value="student">Student</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="form-group input-with-icon">
                <label htmlFor="password">Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <span onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff /> : <Eye />}
                </span>
              </div>

              <div className="form-group input-with-icon">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <span
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? <EyeOff /> : <Eye />}
                </span>
              </div>

              <button
                type="submit"
                className="submit-button"
                disabled={loading}>
                {loading ? "Creating account..." : "Create account"}
              </button>
            </form>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
