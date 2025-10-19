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
} from "lucide-react";
import Footer from "../footer";
import ReviewComponent from "../../components/ReviewComponent";
import "./browseExams.css";

const BrowseExams = () => {
  const { exams, faculties, courses, loading } = useApp();
  const { user } = useAuth();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState("All Faculties");
  const [selectedCourse, setSelectedCourse] = useState("All Courses");
  const [selectedExamType, setSelectedExamType] = useState("All Types");
  const [filteredExams, setFilteredExams] = useState([]);
  const [previewExam, setPreviewExam] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  // Debug mode - set to true to disable screenshot protection
  const DEBUG_MODE = false;

  // Filter exams based on search and filters
  useEffect(() => {
    console.log("🔍 Exams data:", exams);
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
    }
  }, [searchTerm, selectedFaculty, selectedCourse, selectedExamType, exams]);

  // Get unique faculties and courses for filter dropdowns
  const uniqueFaculties = [
    ...new Set(exams?.map((exam) => exam.faculty).filter(Boolean)),
  ];
  const uniqueCourses = [
    ...new Set(exams?.map((exam) => exam.course).filter(Boolean)),
  ];

  const handlePreview = (exam) => {
    console.log("👁️ Preview clicked for exam:", exam);
    console.log("📁 File path:", exam.filePath);
    console.log("🔗 Full URL:", `http://localhost:3009/${exam.filePath}`);
    setPreviewExam(exam);
    setShowPreview(true);

    // Only apply screenshot protection if not in debug mode
    if (!DEBUG_MODE) {
      // Add screenshot protection class to body
      document.body.classList.add("preview-open");

      // Disable right-click, text selection, and other interactions
      document.addEventListener("contextmenu", preventDefault);
      document.addEventListener("selectstart", preventDefault);
      document.addEventListener("dragstart", preventDefault);
      document.addEventListener("keydown", preventScreenshot);

      // Disable F12, Ctrl+Shift+I, Ctrl+U, etc.
      document.addEventListener("keydown", preventDevTools);
    }
  };

  const handleClosePreview = () => {
    setShowPreview(false);
    setPreviewExam(null);

    // Only remove screenshot protection if not in debug mode
    if (!DEBUG_MODE) {
      // Remove screenshot protection class from body
      document.body.classList.remove("preview-open");

      // Re-enable interactions
      document.removeEventListener("contextmenu", preventDefault);
      document.removeEventListener("selectstart", preventDefault);
      document.removeEventListener("dragstart", preventDefault);
      document.removeEventListener("keydown", preventScreenshot);
      document.removeEventListener("keydown", preventDevTools);
    }
  };

  const preventDefault = (e) => {
    // Allow right-click for debugging (Ctrl+Right-click or Shift+Right-click)
    if (e.type === "contextmenu" && (e.ctrlKey || e.shiftKey)) {
      return true; // Allow context menu for debugging
    }
    e.preventDefault();
    return false;
  };

  const preventScreenshot = (e) => {
    // Disable common screenshot shortcuts
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
    // Disable F12, Ctrl+Shift+I, Ctrl+U, etc.
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
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
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

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 MB";
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const getFileType = (filename) => {
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

  if (loading) {
    return (
      <div className="browse-exams-page">
        <div className="browse-exams-loading">
          <div className="loading-spinner"></div>
          <p>Loading exams...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="browse-exams-page">
      {DEBUG_MODE && (
        <div
          style={{
            background: "#fef3c7",
            color: "#92400e",
            padding: "0.5rem",
            textAlign: "center",
            fontWeight: "bold",
            borderBottom: "2px solid #f59e0b",
          }}>
          🐛 DEBUG MODE: Screenshot protection disabled
        </div>
      )}
      {/* Header Section */}
      <div className="browse-exams-header">
        <div className="browse-exams-title-group">
          <div className="browse-exams-icon">
            <BookOpen size={24} />
          </div>
          <h1 className="browse-exams-title">Browse Exams</h1>
        </div>
        <p className="browse-exams-subtitle">
          Search and filter examination papers by faculty, course, and type
        </p>
        <span className="exams-found-count">
          {filteredExams.length} exams found
        </span>
      </div>

      {/* Search and Filter Card */}
      <div className="browse-exams-filters-card">
        <div className="search-bar">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Search exams by title or course..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <div className="filter-item">
            <label htmlFor="faculty-select">Faculty</label>
            <select
              id="faculty-select"
              value={selectedFaculty}
              onChange={(e) => setSelectedFaculty(e.target.value)}>
              <option>All Faculties</option>
              {uniqueFaculties.map((faculty) => (
                <option key={faculty} value={faculty}>
                  {faculty}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-item">
            <label htmlFor="course-select">Course</label>
            <select
              id="course-select"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}>
              <option>All Courses</option>
              {uniqueCourses.map((course) => (
                <option key={course} value={course}>
                  {course}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-item">
            <label htmlFor="exam-type-select">Exam Type</label>
            <select
              id="exam-type-select"
              value={selectedExamType}
              onChange={(e) => setSelectedExamType(e.target.value)}>
              <option>All Types</option>
              <option>Final</option>
              <option>Mid-Term</option>
              <option>Quiz</option>
            </select>
          </div>
        </div>
      </div>

      {/* Exam List */}
      <div className="exam-list">
        {filteredExams.length === 0 ? (
          <div className="no-exams-found">
            <FileText size={48} />
            <h3>No exams found</h3>
            <p>Try adjusting your search criteria or filters</p>
          </div>
        ) : (
          filteredExams.map((exam) => (
            <div key={exam.id} className="exam-card">
              <div className="exam-info">
                <h3 className="exam-card-title">
                  {exam.title}
                  <span
                    className={`exam-type-tag ${exam.examType
                      ?.toLowerCase()
                      .replace(" ", "-")}`}>
                    {exam.examType}
                  </span>
                </h3>

                <div className="exam-details">
                  <div className="exam-detail-item">
                    <FileText size={16} />
                    <span>
                      {exam.courseCode || "N/A"} - {exam.course}
                    </span>
                  </div>

                  <div className="exam-detail-item">
                    <Calendar size={16} />
                    <span>{formatDate(exam.uploadDate)}</span>
                  </div>

                  <div className="exam-detail-item">
                    <User size={16} />
                    <span>{formatFileSize(exam.fileSize)}</span>
                  </div>

                  <div className="exam-detail-item">
                    <FileText size={16} />
                    <span>{getFileType(exam.filePath).toUpperCase()}</span>
                  </div>
                </div>

                <div className="exam-card-meta">
                  <span className="exam-title-display">{exam.title}</span>
                  <span className="exam-type-display">{exam.examType}</span>
                </div>
              </div>

              <div className="exam-actions">
                <button
                  className="preview-button"
                  onClick={() => handlePreview(exam)}>
                  <Eye size={16} />
                  Preview
                </button>
                <button
                  className="download-button"
                  onClick={() => handleDownload(exam)}>
                  <Download size={16} />
                  Download
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Preview Modal and Reviews */}
      {showPreview && previewExam && (
        <>
          <div className="preview-modal" onClick={handleClosePreview}>
            <div
              className="preview-content"
              onClick={(e) => e.stopPropagation()}>
              <div className="preview-header">
                <h3>{previewExam.title}</h3>
                <button className="close-preview" onClick={handleClosePreview}>
                  ×
                </button>
              </div>

              <div className="preview-body">
                {getFileType(previewExam.filePath) === "pdf" ? (
                  <iframe
                    src={`http://localhost:3009/uploads/${previewExam.filePath}#toolbar=0&navpanes=0&scrollbar=0`}
                    className="pdf-viewer"
                    title="Exam Preview"
                    onContextMenu={preventDefault}
                    onDragStart={preventDefault}
                  />
                ) : getFileType(previewExam.filePath) === "image" ? (
                  <img
                    src={`http://localhost:3009/uploads/${previewExam.filePath}`}
                    alt="Exam Preview"
                    className="image-viewer"
                    onContextMenu={preventDefault}
                    onDragStart={preventDefault}
                  />
                ) : (
                  <div className="unsupported-file">
                    <FileText size={64} />
                    <h3>Preview not available</h3>
                    <p>This file type cannot be previewed in the browser.</p>
                    <p>Please download the file to view it.</p>
                  </div>
                )}
              </div>

              <div className="preview-footer">
                <button
                  className="download-from-preview"
                  onClick={() => handleDownload(previewExam)}>
                  <Download size={16} />
                  Download
                </button>
              </div>
            </div>
          </div>

          {/* Review Section */}
          <div className="preview-reviews">
            <ReviewComponent
              examId={previewExam.id}
              onReviewSubmit={() => {
                // Refresh data if needed
                console.log("Review submitted for exam:", previewExam.id);
              }}
            />
          </div>
        </>
      )}

      <Footer />
    </div>
  );
};

export default BrowseExams;
