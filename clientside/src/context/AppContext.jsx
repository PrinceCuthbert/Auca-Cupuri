import React, { createContext, useContext, useState, useEffect } from "react";
import { BASE_URL } from "../api/api";
import { useAuth } from "./AuthContext";

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
        console.log("📍 Fetching protected data with cookies");

        const [facRes, courseRes, examRes] = await Promise.all([
          fetch(`${BASE_URL}/faculties`, { credentials: "include" }),
          fetch(`${BASE_URL}/courses`, { credentials: "include" }),
          fetch(`${BASE_URL}/exams`, { credentials: "include" }),
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
      } catch (err) {
        console.error("Error fetching app data:", err);
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
      body: formData,
    });

    if (!res.ok) {
      throw new Error("Failed to upload exam");
    }

    const newExam = await res.json();
    setExams((prev) => [...prev, newExam]);
    return newExam;
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
      });
      if (!examRes.ok) throw new Error("Failed to refresh exams");
      const examData = await examRes.json();
      setExams(examData);
    } catch (err) {
      console.error("Error refreshing exams:", err);
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
