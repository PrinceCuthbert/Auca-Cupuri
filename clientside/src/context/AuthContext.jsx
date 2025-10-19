import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3009/api";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(
    () => JSON.parse(localStorage.getItem("auca-cupuri-user")) || null
  );

  // LOGIN
  const login = async (email, password) => {
    try {
      console.log("Attempting login to:", `${BASE_URL}/auth/login`);
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("Login response:", { status: res.status, data });

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      // store user info + token
      const userWithToken = { ...data.user, token: data.token };
      localStorage.setItem("auca-cupuri-user", JSON.stringify(userWithToken));
      setUser(userWithToken);
      return userWithToken;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  // REGISTER
  const register = async ({ fullName, email, role, password }) => {
    try {
      console.log("Attempting registration to:", `${BASE_URL}/auth/register`);
      console.log("Registration payload:", {
        fullName,
        email,
        role,
        password: "***",
      });

      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullName, // backend expects `name`
          email,
          role,
          password,
        }),
      });

      console.log("Registration response status:", res.status);
      console.log(
        "Registration response headers:",
        Object.fromEntries(res.headers.entries())
      );

      const data = await res.json();
      console.log("Registration response data:", data);

      if (!res.ok) {
        throw new Error(data.message || "Signup failed");
      }
      return data;
    } catch (error) {
      console.error("Registration error:", error);
      console.error("Error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("auca-cupuri-user");
    setUser(null);
  };

  // Check if user is authenticated
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
