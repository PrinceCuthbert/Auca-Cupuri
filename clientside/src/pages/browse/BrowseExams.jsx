import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import {
  Search,
  BookOpen,
  Calendar,
  User,
  FileText,
  Download,
  Eye,
  X,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Modal } from "antd";
import Footer from "../footer";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const BrowseExams = () => {
  const { exams, faculties, courses, loading, refreshExams } = useApp();
  const { user } = useAuth();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState("All Faculties");
  const [selectedCourse, setSelectedCourse] = useState("All Courses");
  const [selectedExamType, setSelectedExamType] = useState("All Types");
  const [filteredExams, setFilteredExams] = useState([]);
  const [previewExam, setPreviewExam] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ open: false, exam: null });
  const [resultModal, setResultModal] = useState({
    open: false,
    success: true,
    message: "",
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const examsPerPage = 6;

  // Debug mode - set to true to disable screenshot protection
  const DEBUG_MODE = false;

  // Filter exams based on search and filters
  useEffect(() => {
    if (exams) {
      let tempExams = [...exams];

      // Filter by search term
      if (searchTerm) {
        tempExams = tempExams.filter(
          (exam) =>
            exam.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            exam.course?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            exam.faculty?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Filter by faculty
      if (selectedFaculty !== "All Faculties") {
        tempExams = tempExams.filter(
          (exam) => exam.faculty === selectedFaculty
        );
      }

      // Filter by course
      if (selectedCourse !== "All Courses") {
        tempExams = tempExams.filter((exam) => exam.course === selectedCourse);
      }

      // Filter by exam type
      if (selectedExamType !== "All Types") {
        tempExams = tempExams.filter(
          (exam) => exam.examType === selectedExamType
        );
      }

      setFilteredExams(tempExams);
      setCurrentPage(1); // Reset to first page when filters change
    }
  }, [searchTerm, selectedFaculty, selectedCourse, selectedExamType, exams]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredExams.length / examsPerPage);
  const startIndex = (currentPage - 1) * examsPerPage;
  const endIndex = startIndex + examsPerPage;
  const paginatedExams = filteredExams.slice(startIndex, endIndex);

  // Pagination handlers
  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    // Scroll to top of exam list
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  // Get unique faculties and courses for filter dropdowns
  const uniqueFaculties = [
    ...new Set(exams?.map((exam) => exam.faculty).filter(Boolean)),
  ];
  const uniqueCourses = [
    ...new Set(exams?.map((exam) => exam.course).filter(Boolean)),
  ];

  const handlePreview = (exam) => {
    setPreviewExam(exam);
    setShowPreview(true);

    // Only apply screenshot protection if not in debug mode
    if (!DEBUG_MODE) {
      document.body.style.overflow = "hidden";
      document.addEventListener("contextmenu", preventDefault);
      document.addEventListener("selectstart", preventDefault);
      document.addEventListener("dragstart", preventDefault);
      document.addEventListener("keydown", preventScreenshot);
      document.addEventListener("keydown", preventDevTools);
    }
  };

  const handleClosePreview = () => {
    setShowPreview(false);
    setPreviewExam(null);

    // Only remove screenshot protection if not in debug mode
    if (!DEBUG_MODE) {
      document.body.style.overflow = "auto";
      document.removeEventListener("contextmenu", preventDefault);
      document.removeEventListener("selectstart", preventDefault);
      document.removeEventListener("dragstart", preventDefault);
      document.removeEventListener("keydown", preventScreenshot);
      document.removeEventListener("keydown", preventDevTools);
    }
  };

  const preventDefault = (e) => {
    if (e.type === "contextmenu" && (e.ctrlKey || e.shiftKey)) {
      return true;
    }
    e.preventDefault();
    return false;
  };

  const preventScreenshot = (e) => {
    if (
      e.key === "PrintScreen" ||
      (e.ctrlKey && e.shiftKey && e.key === "S") ||
      (e.ctrlKey && e.key === "s")
    ) {
      e.preventDefault();
      return false;
    }
  };

  const preventDevTools = (e) => {
    if (
      e.key === "F12" ||
      (e.ctrlKey && e.shiftKey && e.key === "I") ||
      (e.ctrlKey && e.key === "u") ||
      (e.ctrlKey && e.key === "U") ||
      (e.ctrlKey && e.shiftKey && e.key === "C") ||
      (e.ctrlKey && e.key === "a") ||
      (e.ctrlKey && e.key === "A")
    ) {
      e.preventDefault();
      return false;
    }
  };

  const handleDownload = async (exam) => {
    try {
      const response = await fetch(
        `http://localhost:3009/uploads/${exam.filePath}`,
        {
          credentials: "include", // Send cookies with request
        }
      );

      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = exam.filePath?.split("/").pop() || "exam.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
      alert("Download failed. Please try again.");
    }
  };

  const handleDeleteClick = (exam) => {
    setDeleteModal({ open: true, exam });
  };

  const handleDeleteConfirm = async () => {
    const exam = deleteModal.exam;
    if (!exam) return;

    setDeleteLoading(exam.id);
    setDeleteModal({ open: false, exam: null });

    try {
      const response = await fetch(`${BASE_URL}/exams/${exam.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Delete failed");
      }

      // Refresh the exams list
      if (refreshExams) {
        await refreshExams();
      }

      setResultModal({
        open: true,
        success: true,
        message: "Exam deleted successfully!",
      });
    } catch (error) {
      console.error("Delete error:", error);
      setResultModal({
        open: true,
        success: false,
        message: error.message || "Failed to delete exam. Please try again.",
      });
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ open: false, exam: null });
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 MB";
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  // Check if filePath is a multi-image (JSON array)
  const isMultiImage = (filePath) => {
    try {
      const parsed = JSON.parse(filePath);
      return Array.isArray(parsed);
    } catch {
      return false;
    }
  };

  // Get array of file paths (handles both single and multi)
  const getFilePaths = (filePath) => {
    try {
      const parsed = JSON.parse(filePath);
      if (Array.isArray(parsed)) return parsed;
      return [filePath];
    } catch {
      return [filePath];
    }
  };

  const getFileType = (filename) => {
    // Handle JSON array (multi-image)
    if (isMultiImage(filename)) {
      return "multi-image";
    }
    const ext = filename.split(".").pop().toLowerCase();
    if (["pdf"].includes(ext)) return "pdf";
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) return "image";
    if (["doc", "docx"].includes(ext)) return "document";
    return "unknown";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedFaculty("All Faculties");
    setSelectedCourse("All Courses");
    setSelectedExamType("All Types");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading exams...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {DEBUG_MODE && (
        <div className="bg-amber-100 text-amber-900 py-2 px-4 text-center font-bold border-b-2 border-amber-500">
          🐛 DEBUG MODE: Screenshot protection disabled
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 bg-teal-500 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Browse Exams</h1>
          </div>
          <p className="text-gray-600 text-sm">
            Search and filter examination papers by faculty, course, and type
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search exams by title or course..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Faculty
              </label>
              <select
                value={selectedFaculty}
                onChange={(e) => setSelectedFaculty(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition bg-white">
                <option>All Faculties</option>
                {uniqueFaculties.map((faculty) => (
                  <option key={faculty} value={faculty}>
                    {faculty}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course
              </label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition bg-white">
                <option>All Courses</option>
                {uniqueCourses.map((course) => (
                  <option key={course} value={course}>
                    {course}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Exam Type
              </label>
              <select
                value={selectedExamType}
                onChange={(e) => setSelectedExamType(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition bg-white">
                <option>All Types</option>
                <option>Final</option>
                <option>Mid-Term</option>
                <option>Quiz</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-gray-900">
              {filteredExams.length}
            </span>{" "}
            exam{filteredExams.length !== 1 && "s "}
            found
            {totalPages > 1 && (
              <span className="text-gray-400 ml-2">
                (showing {startIndex + 1}-
                {Math.min(endIndex, filteredExams.length)} of{" "}
                {filteredExams.length})
              </span>
            )}
          </p>
          {(searchTerm ||
            selectedFaculty !== "All Faculties" ||
            selectedCourse !== "All Courses" ||
            selectedExamType !== "All Types") && (
            <button
              onClick={clearFilters}
              className="text-sm text-teal-600 hover:text-teal-700 font-medium transition">
              Clear filters
            </button>
          )}
        </div>

        {/* Exam List */}
        <div className="space-y-4">
          {filteredExams.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">No exams found</p>
              <p className="text-gray-500 text-sm mt-1">
                Try adjusting your search criteria or filters
              </p>
            </div>
          ) : (
            paginatedExams.map((exam) => (
              <div
                key={exam.id}
                className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3 mb-2 flex-wrap">
                      <h3 className="text-lg font-semibold text-gray-900 flex-1 min-w-0">
                        {exam.title}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                          exam.examType === "Final"
                            ? "bg-red-100 text-red-700"
                            : exam.examType === "Mid-Term"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-purple-100 text-purple-700"
                        }`}>
                        {exam.examType}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <FileText className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{exam.course}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 flex-shrink-0" />
                        <span className="whitespace-nowrap">
                          {formatDate(exam.uploadDate)}
                        </span>
                      </div>
                      {exam.fileSize && (
                        <div className="flex items-center gap-1.5">
                          <FileText className="w-4 h-4 flex-shrink-0" />
                          <span className="whitespace-nowrap">
                            {formatFileSize(exam.fileSize)}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5">
                        <FileText className="w-4 h-4 flex-shrink-0" />
                        <span className="whitespace-nowrap">
                          {isMultiImage(exam.filePath)
                            ? `${getFilePaths(exam.filePath).length} PAGES`
                            : getFileType(exam.filePath).toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 flex-shrink-0">
                    <button
                      onClick={() => handlePreview(exam)}
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 text-sm">
                      <Eye className="w-4 h-4" />
                      Preview
                    </button>
                    <button
                      onClick={() => handleDownload(exam)}
                      className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 text-sm">
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                    {user?.role === "admin" && (
                      <button
                        onClick={() => handleDeleteClick(exam)}
                        disabled={deleteLoading === exam.id}
                        className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                        <Trash2 className="w-4 h-4" />
                        {deleteLoading === exam.id ? "Deleting..." : "Delete"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            {/* Previous Button */}
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition">
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => {
                  // Show first page, last page, current page, and pages around current
                  const showPage =
                    page === 1 ||
                    page === totalPages ||
                    Math.abs(page - currentPage) <= 1;
                  const showEllipsis =
                    (page === 2 && currentPage > 3) ||
                    (page === totalPages - 1 && currentPage < totalPages - 2);

                  if (showEllipsis) {
                    return (
                      <span key={page} className="px-2 text-gray-400">
                        ...
                      </span>
                    );
                  }

                  if (!showPage) return null;

                  return (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`w-10 h-10 text-sm font-medium rounded-lg transition ${
                        currentPage === page
                          ? "bg-teal-600 text-white"
                          : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                      }`}>
                      {page}
                    </button>
                  );
                }
              )}
            </div>

            {/* Next Button */}
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition">
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Preview Modal - Clean Full-Size Viewer */}
      {showPreview && previewExam && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-90"
          onClick={handleClosePreview}>
          <div className="relative w-full h-full flex items-center justify-center p-4">
            {/* Close Button - Top Right */}
            <button
              onClick={handleClosePreview}
              className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm text-white rounded-full transition">
              <X size={24} />
            </button>

            {/* Download Button - Top Left */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDownload(previewExam);
              }}
              className="absolute top-4 left-4 z-10 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 shadow-lg">
              <Download size={16} />
              Download
            </button>

            {/* Title Bar - Top Center */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 bg-white bg-opacity-20 backdrop-blur-sm text-white px-6 py-2 rounded-lg shadow-lg max-w-2xl">
              <p className="text-sm font-medium truncate">
                {previewExam.title}
              </p>
            </div>

            {/* Content */}
            <div
              className="w-full h-full flex items-center justify-center pt-16"
              onClick={(e) => e.stopPropagation()}>
              {getFileType(previewExam.filePath) === "pdf" ? (
                <div className="w-full h-full max-w-6xl bg-white rounded-lg overflow-hidden shadow-2xl">
                  <iframe
                    src={`http://localhost:3009/uploads/${previewExam.filePath}#toolbar=0&navpanes=0&scrollbar=0`}
                    className="w-full h-full"
                    title="Exam Preview"
                    onContextMenu={preventDefault}
                    onDragStart={preventDefault}
                  />
                </div>
              ) : getFileType(previewExam.filePath) === "multi-image" ? (
                // Multi-image scrollable view
                <div className="w-full h-full max-w-4xl bg-gray-900 rounded-lg overflow-y-auto shadow-2xl">
                  <div className="p-4 space-y-4">
                    <div className="sticky top-0 bg-gray-900 py-2 text-center text-white text-sm font-medium border-b border-gray-700 mb-4">
                      📄 {getFilePaths(previewExam.filePath).length} pages -
                      Scroll to view all
                    </div>
                    {getFilePaths(previewExam.filePath).map(
                      (filePath, index) => (
                        <div key={index} className="relative">
                          <div className="absolute top-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                            Page {index + 1} of{" "}
                            {getFilePaths(previewExam.filePath).length}
                          </div>
                          <img
                            src={`http://localhost:3009/uploads/${filePath}`}
                            alt={`Exam Page ${index + 1}`}
                            className="w-full rounded-lg shadow-lg"
                            onContextMenu={preventDefault}
                            onDragStart={preventDefault}
                          />
                        </div>
                      )
                    )}
                  </div>
                </div>
              ) : getFileType(previewExam.filePath) === "image" ? (
                <img
                  src={`http://localhost:3009/uploads/${previewExam.filePath}`}
                  alt="Exam Preview"
                  className="max-w-full max-h-full object-contain"
                  onContextMenu={preventDefault}
                  onDragStart={preventDefault}
                />
              ) : (
                <div className="bg-white rounded-lg p-12 text-center shadow-2xl">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Preview not available
                  </h3>
                  <p className="text-gray-600 mb-4">
                    This file type cannot be previewed in the browser.
                  </p>
                  <p className="text-gray-500 text-sm">
                    Please download the file to view it.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        title="Delete Exam"
        open={deleteModal.open}
        onOk={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
        centered>
        <p>
          Are you sure you want to delete "{deleteModal.exam?.title}"? This
          action cannot be undone.
        </p>
      </Modal>

      {/* Result Modal */}
      <Modal
        title={resultModal.success ? "Success" : "Error"}
        open={resultModal.open}
        onOk={() => setResultModal({ open: false, success: true, message: "" })}
        onCancel={() =>
          setResultModal({ open: false, success: true, message: "" })
        }
        okText="OK"
        cancelButtonProps={{ style: { display: "none" } }}
        centered>
        <div className="flex items-center gap-3">
          {resultModal.success ? (
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          )}
          <p className="text-gray-700">{resultModal.message}</p>
        </div>
      </Modal>

      <Footer />
    </div>
  );
};

export default BrowseExams;
