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
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const [facRes, courseRes, examRes] = await Promise.all([
          fetch(`${BASE_URL}/faculties`, { credentials: "include", headers: getAuthHeaders() }),
          fetch(`${BASE_URL}/courses`,   { credentials: "include", headers: getAuthHeaders() }),
          fetch(`${BASE_URL}/exams`,     { credentials: "include", headers: getAuthHeaders() }),
        ]);

        if (!facRes.ok || !courseRes.ok || !examRes.ok) {
          throw new Error("Unauthorized or failed fetch");
        }

        const [facData, courseData, examData] = await Promise.all([
          facRes.json(),
          courseRes.json(),
          examRes.json(),
        ]);

        setFaculties(facData);
        setCourses(courseData);
        setExams(examData);
      } catch {
        // Silent fail - data will be empty
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]); // 👈 refetch when login/logout happens

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

    setExams((prev) => [...prev, data]);
    return data;
  };

  const getCoursesByFaculty = (facultyIdOrName) =>
    courses.filter(
      (course) =>
        course.facultyId === facultyIdOrName ||
        course.faculty === facultyIdOrName
    );

  const refreshExams = async () => {
    try {
      const examRes = await fetch(`${BASE_URL}/exams`, {
        credentials: "include",
        headers: getAuthHeaders(),
      });
      if (!examRes.ok) throw new Error("Failed to refresh exams");
      const examData = await examRes.json();
      setExams(examData);
    } catch {
      // Silent fail - keep existing exams data
    }
  };

  const getExamsByCourse = (courseId, examType) =>
    exams.filter(
      (exam) =>
        exam.courseId === courseId &&
        (examType ? exam.examType === examType : true)
    );

  const searchExams = (query) => {
    const q = query.toLowerCase();
    return exams.filter(
      (exam) =>
        exam.title.toLowerCase().includes(q) ||
        courses.find(
          (course) =>
            course._id === exam.courseId &&
            course.title.toLowerCase().includes(q)
        )
    );
  };

  return (
    <AppContext.Provider
      value={{
        faculties,
        courses,
        exams,
        loading,
        addExam,
        refreshExams,
        getCoursesByFaculty,
        getExamsByCourse,
        searchExams,
      }}>
      {children}
    </AppContext.Provider>
  );
};
