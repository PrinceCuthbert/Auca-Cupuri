import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FileText, Calendar, User, BookOpen, Download } from "lucide-react";
import Footer from "../../pages/footer.jsx";
import "../../css/browsePage/browse.css";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const Browse = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [faculties, setFaculties] = useState([]);
  const [courses, setCourses] = useState([]);
  const [exams, setExams] = useState([]);
  // const [user, setUser] = useState(null);
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });
  const [filteredExams, setFilteredExams] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState(
    searchParams.get("faculty") || ""
  );
  const [selectedCourse, setSelectedCourse] = useState(
    searchParams.get("course") || ""
  );
  const [selectedExamType, setSelectedExamType] = useState(
    searchParams.get("examType") || ""
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch faculties, courses, and exams from backend
  useEffect(() => {
    if (!user?.token) return; // do not fetch if not logged in

    const fetchData = async () => {
      try {
        const [facRes, courseRes, examRes] = await Promise.all([
          fetch(`${BASE_URL}/faculties`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          }),
          fetch(`${BASE_URL}/courses`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          }),
          fetch(`${BASE_URL}/exams`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          }),
        ]);

        if (!facRes.ok || !courseRes.ok || !examRes.ok) {
          throw new Error("Failed to fetch data from server");
        }

        const [facData, courseData, examData] = await Promise.all([
          facRes.json(),
          courseRes.json(),
          examRes.json(),
        ]);

        setFaculties(Array.isArray(facData) ? facData : []);
        setCourses(Array.isArray(courseData) ? courseData : []);
        setExams(Array.isArray(examData) ? examData : []);
        setFilteredExams(Array.isArray(examData) ? examData : []);
      } catch (err) {
        console.error("Failed to fetch data", err);
      }
    };

    fetchData();
  }, [user?.token]);

  // Escape key navigation
  useEffect(() => {
    function handleEscape(e) {
      if (e.key === "Escape") navigate("/cupuriportal/dashboard");
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [navigate]);

  // Filter exams based on search and selection
  useEffect(() => {
    let filtered = [...exams];

    if (searchQuery) {
      filtered = filtered.filter(
        (exam) =>
          exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          courses
            .find((c) => c._id === exam.courseId)
            ?.title.toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    }

    if (selectedFaculty) {
      const facultyCourseIds = courses
        .filter((c) => c.facultyId === selectedFaculty)
        .map((c) => c._id);
      filtered = filtered.filter((exam) =>
        facultyCourseIds.includes(exam.courseId)
      );
    }

    if (selectedCourse) {
      filtered = filtered.filter((exam) => exam.courseId === selectedCourse);
    }

    if (selectedExamType) {
      filtered = filtered.filter((exam) => exam.examType === selectedExamType);
    }

    setFilteredExams(filtered);
  }, [
    searchQuery,
    selectedFaculty,
    selectedCourse,
    selectedExamType,
    exams,
    courses,
  ]);

  const handleFacultyChange = (facultyId) => {
    setSelectedFaculty(facultyId);
    setSelectedCourse("");
    setSearchParams({ faculty: facultyId });
  };

  const handleCourseChange = (courseId) => {
    setSelectedCourse(courseId);
    setSearchParams({ faculty: selectedFaculty, course: courseId });
  };

  const handleExamTypeChange = (examType) => {
    setSelectedExamType(examType);
    setSearchParams({
      faculty: selectedFaculty,
      course: selectedCourse,
      examType,
    });
  };

  const clearFilters = () => {
    setSelectedFaculty("");
    setSelectedCourse("");
    setSelectedExamType("");
    setSearchQuery("");
    setSearchParams({});
  };

  const facultyCourses = selectedFaculty
    ? courses.filter((c) => c.facultyId === selectedFaculty)
    : [];

  const getCourseName = (courseId) =>
    courses.find((c) => c._id === courseId)?.title || "Unknown";

  return (
    <>
      <div className="browse-page">
        <div className="browse-header">
          <div className="header-left">
            <div className="icon-word">
              <div className="icon-bg gradient">
                <BookOpen className="icon-white" />
              </div>
              <h1 className="page-title">Browse Exams</h1>
            </div>
            <p className="page-subtitle">
              Search and filter examination papers by faculty, course, and type
            </p>
          </div>

          <div className="header-right">
            <button
              className="clear-button"
              onClick={() => navigate("/cupuriportal/dashboard")}>
              Go Back
            </button>
            <span className="results-count">
              {filteredExams.length} exam{filteredExams.length !== 1 && "s"}{" "}
              found
            </span>
            {(selectedFaculty ||
              selectedCourse ||
              selectedExamType ||
              searchQuery) && (
              <button onClick={clearFilters} className="clear-button">
                Clear filters
              </button>
            )}
          </div>
        </div>

        <div className="filter-bar">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search exams by title or course..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="select-div">
            <div className="dropdown">
              <label>Faculty</label>
              <select
                value={selectedFaculty}
                onChange={(e) => handleFacultyChange(e.target.value)}
                className="filter-select">
                <option value="">All Faculties</option>
                {faculties.map((f) => (
                  <option key={f._id} value={f._id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="dropdown">
              <label>Course</label>
              <select
                value={selectedCourse}
                onChange={(e) => handleCourseChange(e.target.value)}
                className="filter-select"
                disabled={!selectedFaculty}>
                <option value="">All Courses</option>
                {facultyCourses.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="dropdown">
              <label>Exam Type</label>
              <select
                value={selectedExamType}
                onChange={(e) => handleExamTypeChange(e.target.value)}
                className="filter-select">
                <option value="">All Types</option>
                <option value="Mid-Term">Mid-Term</option>
                <option value="Final">Final</option>
              </select>
            </div>
          </div>
        </div>

        <div className="exam-results">
          {filteredExams.length > 0 ? (
            filteredExams.map((exam) => (
              <div key={exam._id} className="exam-card">
                <div className="exam-header">
                  <div className="exam-info">
                    <h3 className="exam-title">{exam.title}</h3>
                    <span
                      className={`exam-badge ${exam.examType.toLowerCase()}`}>
                      {exam.examType}
                    </span>
                    <div className="exam-course">
                      <FileText size={14} /> {getCourseName(exam.courseId)}
                    </div>
                    <div className="exam-filename">{exam.fileName}</div>
                  </div>
                </div>

                <div className="exam-meta">
                  <span>
                    <Calendar size={14} />{" "}
                    {new Date(exam.uploadDate).toLocaleDateString()}
                  </span>
                  <span>
                    <User size={14} /> {exam.fileSize}
                  </span>
                </div>

                <div className="exam-actions">
                  <button
                    className="download-button"
                    onClick={() => {
                      const a = document.createElement("a");
                      a.href = exam.fileUrl;
                      a.download = exam.fileName;
                      a.click();
                    }}>
                    <Download size={16} /> Download
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <FileText size={36} />
              <p>No exams found. Try different filters.</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Browse;
