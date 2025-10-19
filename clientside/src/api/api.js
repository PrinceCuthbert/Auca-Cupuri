// src/api/api.js
export const BASE_URL =
  import.meta.env.VITE_BASE_URL || "http://localhost:3009/api";

const getAuthHeaders = () => {
  const user = JSON.parse(localStorage.getItem("auca-cupuri-user"));
  if (!user?.token) return {};
  return { Authorization: `Bearer ${user.token}` };
};

export const fetchFaculties = () =>
  fetch(`${BASE_URL}/faculties`, {
    headers: { ...getAuthHeaders() },
  });

export const fetchCourses = () =>
  fetch(`${BASE_URL}/courses`, {
    headers: { ...getAuthHeaders() },
  });

export const fetchExams = () =>
  fetch(`${BASE_URL}/exams`, {
    headers: { ...getAuthHeaders() },
  });

export const uploadExam = (formData) =>
  fetch(`${BASE_URL}/exams/upload`, {
    method: "POST",
    headers: { ...getAuthHeaders() }, // add token here too
    body: formData,
  });
