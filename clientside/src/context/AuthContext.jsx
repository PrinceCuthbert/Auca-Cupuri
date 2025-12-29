import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3009/api";

export function AuthProvider({ children }) {
  function loadStoredUser() {
    try {
      const raw = localStorage.getItem("auca-cupuri-user");
      if (!raw || raw === "undefined") return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  const [user, setUser] = useState(loadStoredUser);

  // LOGIN
  const login = async (email, password) => {
    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("auca-cupuri-user", JSON.stringify(data.user));
      setUser(data.user);
      return data.user;
    } catch (error) {
      throw error;
    }
  };

  // REGISTER
  const register = async ({ fullName, email, role, password }) => {
    try {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullName,
          email,
          role,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Signup failed");
      }
      return data;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await fetch(`${BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      }).catch(() => {});
    } catch {
      // Silent fail - logout should always clear local state
    }
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
