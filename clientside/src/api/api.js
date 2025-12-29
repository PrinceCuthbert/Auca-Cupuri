// src/api/api.js
export const BASE_URL =
  import.meta.env.VITE_BASE_URL || "http://localhost:3009/api";

const requestOptions = {
  credentials: "include", // Send cookies automatically
};

export const fetchFaculties = () =>
  fetch(`${BASE_URL}/faculties`, {
    ...requestOptions,
  });

export const fetchCourses = () =>
  fetch(`${BASE_URL}/courses`, {
    ...requestOptions,
  });

export const fetchExams = () =>
  fetch(`${BASE_URL}/exams`, {
    ...requestOptions,
  });

export const uploadExam = (formData) =>
  fetch(`${BASE_URL}/exams/upload`, {
    method: "POST",
    ...requestOptions,
    body: formData,
  });
