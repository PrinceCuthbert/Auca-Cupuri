import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GraduationCap, Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";

import { useAuth } from "../../context/AuthContext";
import Footer from "../footer";

export default function SignUp() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
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

    if (!formData.fullName || !formData.email || !formData.password) {
      return toast.error("Please fill in all fields!");
    }

    setLoading(true);
    try {
      console.log("Starting registration process...");
      await register({
        fullName: formData.fullName,
        email: formData.email,
        // role is fixed to 'student' for all new self-registrations
        role: "student",
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
      <div className="min-h-screen bg-emerald-50 flex flex-col items-center justify-center p-4">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Create your account
          </h2>
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link
              to="/cupuriportal/login"
              className="text-emerald-600 font-semibold hover:underline">
              Sign in here
            </Link>
          </p>
        </div>

        <main className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-md p-8">
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="fullName"
                  className="font-semibold text-sm text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="email"
                  className="font-semibold text-sm text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="password"
                  className="font-semibold text-sm text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="confirmPassword"
                  className="font-semibold text-sm text-gray-700">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }>
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="mt-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-300 shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
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
