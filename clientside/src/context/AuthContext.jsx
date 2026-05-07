import { createContext, useContext, useState } from "react";

import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3009/api";

export function AuthProvider({ children }) {

// 1. Create a helper to get the role from the token
  const getRole = () => {
    if (!token) return null;
    try {
      const decoded = jwtDecode(token);
      return decoded.role; // This pulls the role you signed on the backend
    } catch {
      return null;
    }
  };


  function loadStoredUser() {
    try {
      const raw = localStorage.getItem("auca-cupuri-user");
      if (!raw || raw === "undefined") return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  // Token is stored separately so apiRequest can read it without
  // touching the user object (Safari ITP fix — can't rely on cookies).
  function loadStoredToken() {
    return localStorage.getItem("auca-cupuri-token") || null;
  }

  const [user, setUser] = useState(loadStoredUser);
  const [token, setToken] = useState(loadStoredToken);

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
      // Store the raw JWT so apiRequest can send it as Authorization: Bearer
      // This is the Safari/iOS ITP fix — cookies are blocked cross-domain.
      if (data.token) {
        localStorage.setItem("auca-cupuri-token", data.token);
        setToken(data.token);
      }
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
          // role,
          password,
        }),
        //  I don't need this for the register part because the user is not logged in yet. And the credentials:
        // "include"  is used to send the session cookie to the server.
        // This is the same as using "withCredentials: true" in the fetch options.
        // But "credentials: "include"" is the correct way to send the session cookie to the server. 
        // So, here when yoou are registering a new user, you don't have a session cookie yet.
        // But when you are logging in, you have a session cookie.
        
        
        // credentials: "include",
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
    localStorage.removeItem("auca-cupuri-token");
    setToken(null);
    setUser(null);
  };

  // Check if user is authenticated and is admin to get admin privileges
  const isAuthenticated = !!user;
  const userRole = getRole();
  const isAdmin = userRole === "admin";

  return (
    <AuthContext.Provider
      value={{ user, token, login, register, logout, isAuthenticated, isAdmin, userRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
