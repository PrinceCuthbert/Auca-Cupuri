import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GraduationCap, Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import Footer from "../footer";

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
      <div className="min-h-screen flex justify-center items-center bg-emerald-50 p-4">
        <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-md w-full max-w-md text-center">
          <div className="mb-8">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl mx-auto mb-4 flex items-center justify-center text-white">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Sign in to AUCA CUPURI</h2>
          </div>

          <form className="flex flex-col gap-4 text-left" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-sm text-gray-700">Email address</label>
              <input
                type="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                placeholder="admin@auca.ac.rw"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-sm text-gray-700">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword((prev) => !prev)}>
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* {error && <p className="text-red-600 text-sm mt-1">{error}</p>} */}

            <button
              type="submit"
              className="mt-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-300 shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="mt-6 text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/cupuriportal/signup" className="text-emerald-600 font-semibold hover:underline">
              Sign up here
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
