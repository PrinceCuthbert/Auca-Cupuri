import React, { createContext, useContext, useState, useEffect } from "react";
import { BASE_URL } from "../api/api";
import { useAuth } from "./AuthContext";

// Helper: read token for Safari ITP fix (Bearer header fallback)
const getAuthHeaders = () => {
  const token = localStorage.getItem("auca-cupuri-token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const { user } = useAuth(); // 👈 auth truth comes from AuthContext

  const [faculties, setFaculties] = useState([]);
  const [courses, setCourses] = useState([]);
 
  const [loading, setLoading] = useState(false);
 

// Fetch only constant data (Faculties/Courses) on load
  useEffect(() => {
    const fetchStaticData = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const [facRes, courseRes] = await Promise.all([
          fetch(`${BASE_URL}/faculties`, { credentials: "include", headers: getAuthHeaders() }),
          fetch(`${BASE_URL}/courses`, { credentials: "include", headers: getAuthHeaders() }),
        ]);

        if (facRes.ok && courseRes.ok) {
          setFaculties(await facRes.json());
          setCourses(await courseRes.json());
        }
      } catch (error) {
        console.error("Static data fetch failed", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStaticData();
  }, [user]);

  /**
   * DYNAMIC FETCH: This is the core fix. 
   * Components will call this with their specific needs (page, search, etc.)
   */
  const fetchExams = async (params = {}) => {
    const { page = 1, limit = 6, search = "", faculty = "All Faculties", course = "All Courses", examType = "All Types" } = params;

    // Build Query String
    const query = new URLSearchParams({
      page,
      limit,
      search,
      faculty,
      course,
      examType
    }).toString();

    try {
      const res = await fetch(`${BASE_URL}/exams?${query}`, {
        credentials: "include",
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Failed to fetch exams");
      return await res.json(); // Returns { exams: [], pagination: {} }
    } catch (err) {
      console.error("FetchExams Error:", err);
      return { exams: [], pagination: { totalPages: 1, currentPage: 1, totalExams: 0 } };
    }
  };

  const addExam = async (formData) => {
    const res = await fetch(`${BASE_URL}/exams/upload`, {
      method: "POST",
      credentials: "include",
      headers: getAuthHeaders(),
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to upload exam");
    }

    return data;
  };


  

  return (
    <AppContext.Provider
      value={{
        faculties,
        courses,
        loading,
        addExam,
       fetchExams
      }}>
      {children}
    </AppContext.Provider>
  );
};
