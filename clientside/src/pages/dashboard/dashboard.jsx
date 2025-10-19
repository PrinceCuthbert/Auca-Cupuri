import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FileText,
  BookOpen,
  Users,
  GraduationCap,
  Download,
  Calendar,
  Clock,
  Flag,
  Eye,
  FileIcon,
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import Footer from "../../pages/footer.jsx";
import "../../css/dashboard/dashboard.css";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const BASE_URL = import.meta.env.VITE_BASE_URL;

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [exams, setExams] = useState([]);
  const [downloadStats, setDownloadStats] = useState({
    totalDownloads: 0,
    thisWeek: 0,
    studyStreak: 0,
  });
  const [chartData, setChartData] = useState({
    studyFocus: {
      labels: [],
      datasets: [{ data: [], backgroundColor: [] }],
    },
    weeklyPattern: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [
        {
          label: "Study Activity",
          data: [0, 0, 0, 0, 0, 0, 0],
          backgroundColor: "#8b5cf6",
          borderRadius: 4,
          borderSkipped: false,
        },
      ],
    },
  });

  // Fetch exams and generate real chart data
  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await fetch(`${BASE_URL}/exams`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setExams(data);
          generateChartData(data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchExams();
  }, [user?.token]);

  // Generate real chart data from exams
  const generateChartData = (examsData) => {
    // Calculate study focus (downloads by course/faculty)
    const courseStats = {};
    examsData.forEach((exam) => {
      const course = exam.course || exam.faculty || "Unknown";
      courseStats[course] = (courseStats[course] || 0) + 1;
    });

    const sortedCourses = Object.entries(courseStats)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5); // Top 5 courses

    const colors = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444"];

    const studyFocusData = {
      labels: sortedCourses.map(([course]) =>
        course.length > 20 ? course.substring(0, 20) + "..." : course
      ),
      datasets: [
        {
          data: sortedCourses.map(([, count]) => count),
          backgroundColor: colors.slice(0, sortedCourses.length),
          borderWidth: 0,
        },
      ],
    };

    // Calculate weekly pattern (mock data based on exam upload dates)
    const weeklyData = [0, 0, 0, 0, 0, 0, 0];

    examsData.forEach((exam) => {
      const examDate = new Date(
        exam.uploadDate || exam.created_at || Date.now()
      );
      const dayOfWeek = examDate.getDay();
      if (dayOfWeek >= 0 && dayOfWeek <= 6) {
        weeklyData[dayOfWeek] = (weeklyData[dayOfWeek] || 0) + 1;
      }
    });

    // Normalize weekly data to max 5
    const maxWeekly = Math.max(...weeklyData);
    const normalizedWeekly =
      maxWeekly > 0
        ? weeklyData.map((val) => Math.round((val / maxWeekly) * 5))
        : weeklyData;

    const weeklyPatternData = {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [
        {
          label: "Study Activity",
          data: normalizedWeekly,
          backgroundColor: "#8b5cf6",
          borderRadius: 4,
          borderSkipped: false,
        },
      ],
    };

    setChartData({
      studyFocus: studyFocusData,
      weeklyPattern: weeklyPatternData,
    });

    // Calculate real download statistics
    const totalDownloads = examsData.length;
    const thisWeek = examsData.filter((exam) => {
      const examDate = new Date(
        exam.uploadDate || exam.created_at || Date.now()
      );
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return examDate >= weekAgo;
    }).length;

    // Mock study streak (in real app, this would come from user activity logs)
    const studyStreak = Math.min(7, Math.floor(totalDownloads / 3));

    setDownloadStats({
      totalDownloads,
      thisWeek,
      studyStreak,
    });
  };

  // Exams: all users see all exams
  const userExams = exams;

  // Helper function to format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <div className="dashboard">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div className="dashboard-title">
          <div className="icon-bg gradient">
            <GraduationCap className="icon-white" />
          </div>
          <h1>Welcome back, {user?.name}!</h1>
        </div>
        <div className="dashboard-role">
          <span className="role-badge">{user?.role} Dashboard</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="dashboard-buttons">
        <button
          className="upload-button"
          onClick={() => navigate("/cupuriportal/dashboard/upload")}>
          Upload
        </button>
        <button
          className="browse-button"
          onClick={() => navigate("/cupuriportal/dashboard/browse")}>
          Browse
        </button>
        {user?.role === "admin" && (
          <button
            className="reviews-button"
            onClick={() => navigate("/cupuriportal/dashboard/reviews")}>
            ⭐ Reviews
          </button>
        )}
      </div>

      {/* Key Metrics Cards */}
      <div className="metrics-grid">
        <div className="metric-card purple">
          <div className="metric-content">
            <div className="metric-value">{downloadStats.totalDownloads}</div>
            <div className="metric-label">Past papers accessed</div>
          </div>
          <div className="metric-icon">
            <BookOpen size={24} />
          </div>
        </div>

        <div className="metric-card green">
          <div className="metric-content">
            <div className="metric-value">{downloadStats.thisWeek}</div>
            <div className="metric-label">Papers downloaded this week</div>
          </div>
          <div className="metric-icon">
            <Download size={24} />
          </div>
        </div>

        <div className="metric-card purple">
          <div className="metric-content">
            <div className="metric-value">{downloadStats.studyStreak}</div>
            <div className="metric-label">Days active</div>
          </div>
          <div className="metric-icon">
            <Flag size={24} />
          </div>
        </div>
      </div>

      {/* Admin Charts Section */}
      {user?.role === "admin" && (
        <div className="charts-section">
          <div className="chart-card">
            <div className="chart-header">
              <div className="chart-title">
                <BookOpen size={20} />
                <h3>Study Focus</h3>
              </div>
              <p>Your downloads by subject</p>
            </div>
            <div className="chart-content">
              <div className="doughnut-chart">
                <Doughnut
                  data={chartData.studyFocus}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                  }}
                />
              </div>
              <div className="chart-legend">
                {chartData.studyFocus.labels.map((label, index) => (
                  <div key={index} className="legend-item">
                    <div
                      className="legend-color"
                      style={{
                        backgroundColor:
                          chartData.studyFocus.datasets[0].backgroundColor[
                            index
                          ],
                      }}></div>
                    <span className="legend-label">{label}</span>
                    <span className="legend-value">
                      {chartData.studyFocus.datasets[0].data[index]} exams
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="chart-card">
            <div className="chart-header">
              <div className="chart-title">
                <Calendar size={20} />
                <h3>Weekly Pattern</h3>
              </div>
              <p>Your study activity this week</p>
            </div>
            <div className="chart-content">
              <div className="bar-chart">
                <Bar
                  data={chartData.weeklyPattern}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 5,
                        grid: {
                          color: "#f1f5f9",
                        },
                      },
                      x: {
                        grid: {
                          display: false,
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Exams Section */}
      <div className="recent-exams-section">
        <div className="recent-exams-header">
          <h2>Recent Exams</h2>
          <p>Latest uploaded examination papers</p>
        </div>
        <div className="exams-grid">
          {userExams.length ? (
            userExams.slice(0, 6).map((exam) => (
              <div key={exam.id} className="exam-card">
                <div className="exam-info">
                  <h3 className="exam-card-title">
                    {exam.title || "Untitled Exam"}
                    <span
                      className={`exam-type-tag ${exam.examType
                        ?.toLowerCase()
                        .replace(" ", "-")}`}>
                      {exam.examType || "Exam"}
                    </span>
                  </h3>

                  <div className="exam-details">
                    <div className="exam-detail-item">
                      <FileText size={16} />
                      <span>
                        {exam.courseCode || exam.course || "Course"} -{" "}
                        {exam.faculty || "Faculty"}
                      </span>
                    </div>

                    <div className="exam-detail-item">
                      <Calendar size={16} />
                      <span>
                        {new Date(
                          exam.uploadDate || Date.now()
                        ).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="exam-detail-item">
                      <FileText size={16} />
                      <span>{formatFileSize(exam.fileSize || 2500000)}</span>
                    </div>

                    <div className="exam-detail-item">
                      <FileIcon size={16} />
                      <span>
                        {exam.filePath
                          ? exam.filePath.split(".").pop()?.toUpperCase() ||
                            "PDF"
                          : "PDF"}
                      </span>
                    </div>
                  </div>

                  <div className="exam-card-meta">
                    <span className="exam-title-display">
                      {exam.title || "Untitled Exam"}
                    </span>
                    <span className="exam-type-display">
                      {exam.examType || "Exam"}
                    </span>
                  </div>
                </div>

                <div className="exam-actions">
                  <button
                    className="preview-button"
                    onClick={() => navigate("/cupuriportal/dashboard/browse")}>
                    <Eye size={16} />
                    Preview
                  </button>
                  <button
                    className="download-button"
                    onClick={() => navigate("/cupuriportal/dashboard/browse")}>
                    <Download size={16} />
                    Download
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-exams">
              <FileText size={48} />
              <h3>No exams uploaded yet</h3>
              <p>Upload your first exam to get started</p>
              <button
                className="upload-button"
                onClick={() => navigate("/cupuriportal/dashboard/upload")}>
                Upload Exam
              </button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
