// src/api/api.js
export const BASE_URL =
  import.meta.env.VITE_BASE_URL || "http://localhost:3009/api";

// Base URL without /api for static files like uploads
export const UPLOADS_URL = BASE_URL.replace("/api", "");

/**
 * Reusable fetch wrapper with error handling
 * @param {string} endpoint - API endpoint (e.g., "/exams")
 * @param {object} options - Fetch options
 * @returns {Promise<any>} - Parsed JSON response
 */
export const apiRequest = async (endpoint, options = {}) => {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    credentials: "include",
    ...options,
    headers: {
      ...(options.body instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),
      ...options.headers,
    },
  });

  // Handle non-JSON responses (like downloads)
  const contentType = response.headers.get("content-type");
  if (contentType && !contentType.includes("application/json")) {
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    return response;
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.message || `Request failed with status ${response.status}`
    );
  }

  return data;
};

/**
 * API helper functions organized by domain
 */
export const api = {
  // Auth
  auth: {
    login: (email, password) =>
      apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),
    register: (userData) =>
      apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify(userData),
      }),
    logout: () =>
      apiRequest("/auth/logout", { method: "POST" }).catch(() => {}),
  },

  // Exams
  exams: {
    getAll: () => apiRequest("/exams"),
    getById: (id) => apiRequest(`/exams/${id}`),
    upload: (formData) =>
      apiRequest("/exams/upload", {
        method: "POST",
        body: formData,
      }),
    delete: (id) => apiRequest(`/exams/${id}`, { method: "DELETE" }),
  },

  // Reviews
  reviews: {
    getGeneral: () => apiRequest("/reviews/general"),
    getGeneralStats: () => apiRequest("/reviews/general/stats"),
    createGeneral: (data) =>
      apiRequest("/reviews/general", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    deleteGeneral: (id) =>
      apiRequest(`/reviews/general/${id}`, { method: "DELETE" }),
    createResponse: (reviewId, response) =>
      apiRequest(`/reviews/${reviewId}/response`, {
        method: "POST",
        body: JSON.stringify({ response }),
      }),
    updateResponse: (reviewId, response) =>
      apiRequest(`/reviews/${reviewId}/response`, {
        method: "PUT",
        body: JSON.stringify({ response }),
      }),
    deleteResponse: (reviewId) =>
      apiRequest(`/reviews/${reviewId}/response`, { method: "DELETE" }),
  },

  // Visits (Admin)
  visits: {
    log: (page) =>
      apiRequest("/visits/log", {
        method: "POST",
        body: JSON.stringify({ page }),
      }),
    getStats: (range = "month") => apiRequest(`/visits/stats?range=${range}`),
  },

  // Faculties & Courses
  faculties: {
    getAll: () => apiRequest("/faculties"),
  },
  courses: {
    getAll: () => apiRequest("/courses"),
  },
};

// Legacy exports for backward compatibility
const requestOptions = {
  credentials: "include",
};

export const fetchFaculties = () =>
  fetch(`${BASE_URL}/faculties`, { ...requestOptions });

export const fetchCourses = () =>
  fetch(`${BASE_URL}/courses`, { ...requestOptions });

export const fetchExams = () =>
  fetch(`${BASE_URL}/exams`, { ...requestOptions });

export const uploadExam = (formData) =>
  fetch(`${BASE_URL}/exams/upload`, {
    method: "POST",
    ...requestOptions,
    body: formData,
  });
