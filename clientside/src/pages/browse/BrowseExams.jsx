import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import {
  Search,
  BookOpen,
  Calendar,
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
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  const uniqueFaculties = [
    ...new Set(exams?.map((exam) => exam.faculty).filter(Boolean)),
  ];
  const uniqueCourses = [
    ...new Set(exams?.map((exam) => exam.course).filter(Boolean)),
  ];

  const handlePreview = (exam) => {
    setPreviewExam(exam);
    setShowPreview(true);
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
      const uploadsUrl = BASE_URL.replace("/api", "");
      const response = await fetch(`${uploadsUrl}/uploads/${exam.filePath}`, {
        credentials: "include",
      });

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
    } catch {
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

      if (refreshExams) {
        await refreshExams();
      }

      setResultModal({
        open: true,
        success: true,
        message: "Exam deleted successfully!",
      });
    } catch (error) {
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

  const isMultiImage = (filePath) => {
    try {
      const parsed = JSON.parse(filePath);
      return Array.isArray(parsed);
    } catch {
      return false;
    }
  };

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
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-[#008767] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-slate-600">Loading exams...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {DEBUG_MODE && (
        <div className="bg-amber-100 text-amber-900 py-2 px-4 text-center font-bold border-b-2 border-amber-500">
          🐛 DEBUG MODE: Screenshot protection disabled
        </div>
      )}

      {/* Page Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 bg-[#008767] rounded-xl flex items-center justify-center shadow-sm">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Browse Exams
              </h1>
              <p className="text-slate-500 text-sm sm:text-base mt-1">
                Access your faculty resources and past examination papers
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Search and Filter Section - Standardized Padding */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-8 mb-8">
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by title, course, or faculty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#008767] focus:bg-white focus:border-transparent outline-none transition-all text-base"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                Faculty
              </label>
              <select
                value={selectedFaculty}
                onChange={(e) => setSelectedFaculty(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#008767] outline-none transition bg-white text-sm font-medium text-slate-700">
                <option>All Faculties</option>
                {uniqueFaculties.map((faculty) => (
                  <option key={faculty} value={faculty}>
                    {faculty}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                Course
              </label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#008767] outline-none transition bg-white text-sm font-medium text-slate-700">
                <option>All Courses</option>
                {uniqueCourses.map((course) => (
                  <option key={course} value={course}>
                    {course}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                Exam Type
              </label>
              <select
                value={selectedExamType}
                onChange={(e) => setSelectedExamType(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#008767] outline-none transition bg-white text-sm font-medium text-slate-700">
                <option>All Types</option>
                <option>Final</option>
                <option>Mid-Term</option>
                <option>Quiz</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Metadata */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 px-1">
          <p className="text-sm text-slate-500 font-medium">
            Showing{" "}
            <span className="text-slate-900">{filteredExams.length}</span>{" "}
            results found
            {totalPages > 1 && (
              <span className="ml-1 opacity-70">
                ({startIndex + 1}-{Math.min(endIndex, filteredExams.length)})
              </span>
            )}
          </p>
          {(searchTerm ||
            selectedFaculty !== "All Faculties" ||
            selectedCourse !== "All Courses" ||
            selectedExamType !== "All Types") && (
            <button
              onClick={clearFilters}
              className="text-sm text-[#008767] hover:underline font-bold transition self-start sm:self-auto">
              Clear all filters
            </button>
          )}
        </div>

        {/* Exam List - Motion Removed for rendering */}
        <div className="grid grid-cols-1 gap-6">
          {filteredExams.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center">
              <FileText className="w-16 h-16 text-slate-200 mx-auto mb-4" />
              <h3 className="text-slate-800 font-bold text-lg">
                No matching exams
              </h3>
              <p className="text-slate-500 text-sm mt-2">
                We couldn't find any papers matching your current filters.
              </p>
            </div>
          ) : (
            paginatedExams.map((exam) => (
              <div
                key={exam.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-8 hover:shadow-md transition-shadow group">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#008767] transition-colors">
                        {exam.title}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest ${
                          exam.examType === "Final"
                            ? "bg-red-50 text-red-600 border border-red-100"
                            : exam.examType === "Mid-Term"
                            ? "bg-blue-50 text-blue-600 border border-blue-100"
                            : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                        }`}>
                        {exam.examType}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-600 font-medium">
                      <BookOpen className="w-4 h-4 text-slate-400" />
                      <span className="text-sm">{exam.course}</span>
                      <span className="text-slate-300 mx-1">|</span>
                      <span className="text-sm text-slate-500">
                        {exam.faculty}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-400 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        <span>Uploaded {formatDate(exam.uploadDate)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <FileText className="w-4 h-4" />
                        <span>{formatFileSize(exam.fileSize)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                        <span className="uppercase">
                          {isMultiImage(exam.filePath)
                            ? `${getFilePaths(exam.filePath).length} Pages`
                            : getFileType(exam.filePath)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
                    <motion.button
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handlePreview(exam)}
                      className="flex-1 sm:flex-none px-6 py-3 bg-white border-2 border-slate-100 text-slate-700 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-50 hover:border-slate-200 transition-all">
                      <Eye className="w-4 h-4" />
                      Preview
                    </motion.button>
                    <motion.button
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleDownload(exam)}
                      className="flex-1 sm:flex-none px-6 py-3 bg-[#008767] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/10 hover:bg-[#006d53] transition-all">
                      <Download className="w-4 h-4" />
                      Download
                    </motion.button>
                    {user?.role === "admin" && (
                      <motion.button
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleDeleteClick(exam)}
                        disabled={deleteLoading === exam.id}
                        className="w-12 h-12 flex items-center justify-center bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all border border-red-100 disabled:opacity-50">
                        <Trash2 className="w-5 h-5" />
                      </motion.button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 text-slate-500 hover:bg-white hover:shadow-sm rounded-lg disabled:opacity-30 transition-all">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${
                      currentPage === page
                        ? "bg-[#008767] text-white shadow-lg shadow-emerald-900/20"
                        : "text-slate-600 hover:bg-white hover:shadow-sm"
                    }`}>
                    {page}
                  </button>
                )
              )}
            </div>
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 text-slate-500 hover:bg-white hover:shadow-sm rounded-lg disabled:opacity-30 transition-all">
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        )}
      </div>

      {/* Preview Overlay */}
      {showPreview && previewExam && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/95 backdrop-blur-md"
          onClick={handleClosePreview}>
          <div className="relative w-full h-full flex flex-col items-center p-4">
            <div className="w-full max-w-7xl flex items-center justify-between mb-4 z-10">
              <div className="bg-white/10 px-4 py-2 rounded-xl border border-white/20">
                <p className="text-white text-sm font-bold truncate max-w-[200px] sm:max-w-md">
                  {previewExam.title}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload(previewExam);
                  }}
                  className="px-4 py-2 bg-[#008767] text-white rounded-lg font-bold text-sm flex items-center gap-2">
                  <Download size={16} />
                  Download
                </button>
                <button
                  onClick={handleClosePreview}
                  className="w-10 h-10 flex items-center justify-center bg-white/10 text-white rounded-full hover:bg-white/20">
                  <X size={24} />
                </button>
              </div>
            </div>

            <div
              className="flex-1 w-full max-w-5xl rounded-2xl overflow-hidden bg-slate-800 shadow-2xl"
              onClick={(e) => e.stopPropagation()}>
              {getFileType(previewExam.filePath) === "pdf" ? (
                <iframe
                  src={`http://localhost:3009/uploads/${previewExam.filePath}#toolbar=0`}
                  className="w-full h-full"
                  title="Exam Preview"
                />
              ) : getFileType(previewExam.filePath) === "multi-image" ? (
                <div className="w-full h-full overflow-y-auto p-4 space-y-4">
                  {getFilePaths(previewExam.filePath).map((path, idx) => (
                    <img
                      key={idx}
                      src={`http://localhost:3009/uploads/${path}`}
                      className="w-full rounded-lg shadow-lg"
                      alt="page"
                    />
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <img
                    src={`http://localhost:3009/uploads/${previewExam.filePath}`}
                    className="max-w-full max-h-full object-contain"
                    alt="Preview"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <Modal
        title={
          <span className="font-bold text-slate-800">Confirm Deletion</span>
        }
        open={deleteModal.open}
        onOk={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        okText="Delete Permanently"
        cancelText="Cancel"
        okButtonProps={{
          danger: true,
          className: "font-bold rounded-lg px-6 h-10",
        }}
        cancelButtonProps={{ className: "font-bold rounded-lg px-6 h-10" }}
        centered>
        <p className="text-slate-600 py-4">
          Are you sure you want to delete{" "}
          <span className="font-bold text-slate-900">
            "{deleteModal.exam?.title}"
          </span>
          ? This action is permanent and cannot be reversed.
        </p>
      </Modal>

      {/* Result Notification */}
      <Modal
        title={null}
        footer={null}
        open={resultModal.open}
        onCancel={() =>
          setResultModal({ open: false, success: true, message: "" })
        }
        centered
        width={400}>
        <div className="py-6 text-center">
          <div
            className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${
              resultModal.success
                ? "bg-emerald-100 text-emerald-600"
                : "bg-red-100 text-red-600"
            }`}>
            {resultModal.success ? <BookOpen size={32} /> : <X size={32} />}
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            {resultModal.success ? "Success!" : "Action Failed"}
          </h3>
          <p className="text-slate-500 mb-6">{resultModal.message}</p>
          <button
            onClick={() =>
              setResultModal({ open: false, success: true, message: "" })
            }
            className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold">
            Dismiss
          </button>
        </div>
      </Modal>

      <Footer />
    </div>
  );
};

export default BrowseExams;
