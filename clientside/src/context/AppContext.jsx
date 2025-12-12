import React, { createContext, useContext, useState, useEffect } from "react";
import { BASE_URL } from "../api/api"; // import your api helper

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within an AppProvider");
  return context;
};

// Helper function to get auth headers
const getAuthHeaders = () => {
  const user = JSON.parse(localStorage.getItem("auca-cupuri-user"));
  if (!user?.token) return {};
  return { Authorization: `Bearer ${user.token}` };
};

export const AppProvider = ({ children }) => {
  const [faculties, setFaculties] = useState([]);
  const [courses, setCourses] = useState([]);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check if user is logged in
        const user = JSON.parse(localStorage.getItem("auca-cupuri-user"));
        if (!user?.token) {
          console.log("No user token found, skipping data fetch");
          setLoading(false);
          return;
        }

        console.log(
          "🔐 Auth token found:",
          user.token.substring(0, 20) + "..."
        );
        console.log("📍 Fetching from:", BASE_URL);

        const [facRes, courseRes, examRes] = await Promise.all([
          fetch(`${BASE_URL}/faculties`, {
            headers: { ...getAuthHeaders() },
          }),
          fetch(`${BASE_URL}/courses`, {
            headers: { ...getAuthHeaders() },
          }),
          fetch(`${BASE_URL}/exams`, {
            headers: { ...getAuthHeaders() },
          }),
        ]);

        console.log("📡 API Responses:", {
          faculties: { status: facRes.status, ok: facRes.ok },
          courses: { status: courseRes.status, ok: courseRes.ok },
          exams: { status: examRes.status, ok: examRes.ok },
        });

        if (!facRes.ok || !courseRes.ok || !examRes.ok) {
          const examErr = await examRes.text();
          console.error("Exam API error response:", examErr);
          throw new Error("Failed to fetch data from server");
        }

        const [facData, courseData, examData] = await Promise.all([
          facRes.json(),
          courseRes.json(),
          examRes.json(),
        ]);

        console.log("🔍 API Response - Exams data:", examData);
        console.log(
          "🔍 API Response - Exams type:",
          Array.isArray(examData) ? "Array" : typeof examData
        );
        console.log("🔍 API Response - Faculties data:", facData);
        console.log("🔍 API Response - Courses data:", courseData);

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
  }, []);

  const addExam = async (formData) => {
    try {
      const res = await fetch(`${BASE_URL}/exams/upload`, {
        method: "POST",
        headers: { ...getAuthHeaders() },
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to upload exam");
      const newExam = await res.json();
      setExams((prev) => [...prev, newExam]);
      return newExam;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const getCoursesByFaculty = (facultyIdOrName) =>
    courses.filter(
      (course) =>
        course.facultyId === facultyIdOrName ||
        course.faculty === facultyIdOrName
    );

  const getExamsByCourse = (courseId, examType) =>
    exams.filter(
      (exam) =>
        exam.courseId === courseId &&
        (examType ? exam.examType === examType : true)
    );

  const searchExams = (query) => {
    const lowercaseQuery = query.toLowerCase();
    return exams.filter(
      (exam) =>
        exam.title.toLowerCase().includes(lowercaseQuery) ||
        courses.find(
          (course) =>
            course._id === exam.courseId &&
            course.title.toLowerCase().includes(lowercaseQuery)
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
        getCoursesByFaculty,
        getExamsByCourse,
        searchExams,
      }}>
      {children}
    </AppContext.Provider>
  );
};
