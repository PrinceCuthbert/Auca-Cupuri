import React, { useState, useEffect, useRef } from "react";
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
  TrendingUp,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
  TimeScale,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import zoomPlugin from "chartjs-plugin-zoom";
import Footer from "../../pages/footer.jsx";

// Register Chart.js components including zoom
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
  TimeScale,
  zoomPlugin
);

const BASE_URL = import.meta.env.VITE_BASE_URL;

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const visitorChartRef = useRef(null);
  const hasLoggedVisit = useRef(false);

  const [exams, setExams] = useState([]);
  const [downloadStats, setDownloadStats] = useState({
    totalDownloads: 0,
    thisWeek: 0,
    studyStreak: 0,
  });
  const [visitorStats, setVisitorStats] = useState({
    data: [],
    summary: {
      total_visits: 0,
      total_unique_users: 0,
      visits_today: 0,
      visits_this_week: 0,
      unique_today: 0,
    },
  });
  const [visitorRange, setVisitorRange] = useState("month");
  const [chartData, setChartData] = useState({
    studyFocus: {
      labels: [],
      datasets: [{ data: [], backgroundColor: [] }],
    },
  });

  // Fetch visitor statistics (admin only)
  const fetchVisitorStats = async (range = "month") => {
    if (user?.role !== "admin") return;

    try {
      const res = await fetch(`${BASE_URL}/visits/stats?range=${range}`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setVisitorStats(data);
      }
    } catch (error) {
      console.error("Error fetching visitor stats:", error);
    }
  };

  // Fetch exams and generate real chart data
  useEffect(() => {
    if (!user) return;

    // Log visit to the dashboard (only once per session)
    const logVisit = async () => {
      if (hasLoggedVisit.current) return;
      hasLoggedVisit.current = true;

      try {
        await fetch(`${BASE_URL}/visits/log`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ page: "dashboard" }),
        });
      } catch {
        // Silent fail - don't block dashboard if logging fails
        console.log("Visit logging skipped");
      }
    };
    logVisit();

    const fetchExams = async () => {
      try {
        const res = await fetch(`${BASE_URL}/exams`, {
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Unauthorized");
        }

        const data = await res.json();
        setExams(data);
        generateChartData(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchExams();
  }, [user]);

  // Fetch visitor stats when range changes (admin only)
  useEffect(() => {
    if (user?.role === "admin") {
      fetchVisitorStats(visitorRange);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, visitorRange]);

  // Prepare visitor chart data
  const getVisitorChartData = () => {
    if (!visitorStats.data || visitorStats.data.length === 0) {
      return {
        labels: [],
        datasets: [
          {
            label: "Visits",
            data: [],
            borderColor: "#10b981",
            backgroundColor: "rgba(16, 185, 129, 0.1)",
            fill: true,
            tension: 0.4,
            pointRadius: 3,
            pointHoverRadius: 6,
            pointBackgroundColor: "#10b981",
            pointBorderColor: "#fff",
            pointBorderWidth: 2,
          },
        ],
      };
    }

    const labels = visitorStats.data.map((item) => {
      // Handle different date formats from backend
      let date;
      if (
        typeof item.time_period === "string" &&
        item.time_period.includes("-")
      ) {
        // For year-month format like "2025-01", add day
        if (item.time_period.length === 7) {
          date = new Date(item.time_period + "-01");
        } else {
          date = new Date(item.time_period);
        }
      } else {
        date = new Date(item.time_period);
      }

      if (visitorRange === "day") {
        return date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
      } else if (visitorRange === "week") {
        return date.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        });
      } else if (visitorRange === "month") {
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
      } else if (visitorRange === "year") {
        return date.toLocaleDateString("en-US", {
          month: "short",
          year: "2-digit",
        });
      }
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "2-digit",
      });
    });

    return {
      labels,
      datasets: [
        {
          label: "Total Visits",
          data: visitorStats.data.map((item) => item.visits),
          borderColor: "#10b981",
          backgroundColor: (context) => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(0, 0, 0, 300);
            gradient.addColorStop(0, "rgba(16, 185, 129, 0.3)");
            gradient.addColorStop(1, "rgba(16, 185, 129, 0.02)");
            return gradient;
          },
          fill: true,
          tension: 0.4,
          pointRadius: 5,
          pointHoverRadius: 8,
          pointBackgroundColor: "#10b981",
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
        },
        {
          label: "Unique Users",
          data: visitorStats.data.map((item) => item.unique_users),
          borderColor: "#3b82f6",
          backgroundColor: "transparent",
          borderDash: [5, 5],
          fill: false,
          tension: 0.4,
          pointRadius: 5,
          pointHoverRadius: 8,
          pointBackgroundColor: "#3b82f6",
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
        },
      ],
    };
  };

  const visitorChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          usePointStyle: true,
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: "rgba(17, 24, 39, 0.95)",
        titleColor: "#fff",
        bodyColor: "#d1d5db",
        padding: 12,
        borderColor: "rgba(16, 185, 129, 0.3)",
        borderWidth: 1,
        displayColors: true,
        callbacks: {
          title: (context) => {
            return `📅 ${context[0].label}`;
          },
          label: (context) => {
            const label = context.dataset.label || "";
            const value = context.parsed.y;
            return ` ${label}: ${value}`;
          },
        },
      },
      zoom: {
        limits: {
          x: { min: "original", max: "original" },
          y: { min: 0 },
        },
        pan: {
          enabled: true,
          mode: "x",
          modifierKey: "ctrl",
        },
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          drag: {
            enabled: true,
            backgroundColor: "rgba(16, 185, 129, 0.1)",
            borderColor: "rgba(16, 185, 129, 0.5)",
            borderWidth: 1,
          },
          mode: "x",
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxRotation: 45,
          minRotation: 0,
          autoSkip: true,
          maxTicksLimit: 12,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "#f1f5f9",
        },
        ticks: {
          precision: 0,
        },
      },
    },
  };

  const handleResetZoom = () => {
    const chart = visitorChartRef.current;
    if (chart) {
      chart.resetZoom();
    }
  };

  const handleZoomIn = () => {
    const chart = visitorChartRef.current;
    if (chart) {
      chart.zoom(1.2);
    }
  };

  const handleZoomOut = () => {
    const chart = visitorChartRef.current;
    if (chart) {
      chart.zoom(0.8);
    }
  };

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

    setChartData({
      studyFocus: studyFocusData,
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
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Dashboard Header */}
      <div className="flex justify-between items-center flex-wrap gap-6 relative border-t-4 border-t-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-t-lg pt-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center">
            <GraduationCap className="text-white" size={24} />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome back, {user?.name}!
          </h1>
        </div>
        <div>
          <span className="px-3 py-1 bg-purple-100 text-purple-900 rounded-full text-sm font-medium">
            {user?.role} Dashboard
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 mb-8">
        <button
          className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors"
          onClick={() => navigate("/cupuriportal/dashboard/upload")}>
          Upload
        </button>
        <button
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          onClick={() => navigate("/cupuriportal/dashboard/browse")}>
          Browse
        </button>
        {user?.role === "admin" && (
          <button
            className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-colors"
            onClick={() => navigate("/cupuriportal/dashboard/reviews")}>
            ⭐ Reviews
          </button>
        )}
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-xl shadow-sm p-6 flex justify-between items-center border border-gray-100">
          <div>
            <div className="text-3xl font-bold text-gray-800">
              {downloadStats.totalDownloads}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              Past papers accessed
            </div>
          </div>
          <div className="w-14 h-14 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
            <BookOpen size={24} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 flex justify-between items-center border border-gray-100">
          <div>
            <div className="text-3xl font-bold text-gray-800">
              {downloadStats.thisWeek}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              Papers downloaded this week
            </div>
          </div>
          <div className="w-14 h-14 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <Download size={24} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 flex justify-between items-center border border-gray-100">
          <div>
            <div className="text-3xl font-bold text-gray-800">
              {downloadStats.studyStreak}
            </div>
            <div className="text-sm text-gray-500 mt-1">Days active</div>
          </div>
          <div className="w-14 h-14 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
            <Flag size={24} />
          </div>
        </div>
      </div>

      {/* Admin Charts Section */}
      {user?.role === "admin" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-1">
                <BookOpen size={20} className="text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-800">
                  Study Focus
                </h3>
              </div>
              <p className="text-sm text-gray-500">Your downloads by subject</p>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-48 h-48">
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
              <div className="flex-1 space-y-3">
                {chartData.studyFocus.labels.map((label, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor:
                            chartData.studyFocus.datasets[0].backgroundColor[
                              index
                            ],
                        }}></div>
                      <span className="text-sm text-gray-700">{label}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {chartData.studyFocus.datasets[0].data[index]} exams
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <TrendingUp size={20} className="text-emerald-600" />
                  <h3 className="text-lg font-semibold text-gray-800">
                    Visitor Analytics
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleZoomOut}
                    className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Zoom Out">
                    <ZoomOut size={16} />
                  </button>
                  <button
                    onClick={handleZoomIn}
                    className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Zoom In">
                    <ZoomIn size={16} />
                  </button>
                  <button
                    onClick={handleResetZoom}
                    className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Reset Zoom">
                    <RotateCcw size={16} />
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-3">
                Scroll to zoom • Drag to select range • Ctrl+drag to pan
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: "day", label: "Today" },
                  { value: "week", label: "Week" },
                  { value: "month", label: "Month" },
                  { value: "year", label: "Year" },
                  { value: "all", label: "All Time" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setVisitorRange(option.value)}
                    className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                      visitorRange === option.value
                        ? "bg-emerald-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}>
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <div className="bg-emerald-50 rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-emerald-700">
                  {visitorStats.summary?.total_visits || 0}
                </div>
                <div className="text-xs text-emerald-600">Total Visits</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-blue-700">
                  {visitorStats.summary?.total_unique_users || 0}
                </div>
                <div className="text-xs text-blue-600">Unique Users</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-purple-700">
                  {visitorStats.summary?.visits_today || 0}
                </div>
                <div className="text-xs text-purple-600">Today</div>
              </div>
              <div className="bg-amber-50 rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-amber-700">
                  {visitorStats.summary?.visits_this_week || 0}
                </div>
                <div className="text-xs text-amber-600">This Week</div>
              </div>
            </div>

            <div className="h-64">
              <Line
                ref={visitorChartRef}
                data={getVisitorChartData()}
                options={visitorChartOptions}
              />
            </div>
          </div>
        </div>
      )}

      {/* Recent Exams Section */}
      <div className="mb-10">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">
            Recent Exams
          </h2>
          <p className="text-gray-500">Latest uploaded examination papers</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userExams.length ? (
            [...userExams]
              .sort(
                (a, b) =>
                  new Date(b.uploadDate || 0) - new Date(a.uploadDate || 0)
              )
              .slice(0, 3)
              .map((exam) => (
                <div
                  key={exam.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col h-full">
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold text-gray-800 mr-2">
                        {exam.title || "Untitled Exam"}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          exam.examType?.toLowerCase().includes("mid")
                            ? "bg-blue-100 text-blue-800"
                            : "bg-purple-100 text-purple-800"
                        }`}>
                        {exam.examType || "Exam"}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <FileText size={16} className="mr-2 text-gray-400" />
                        <span>
                          {exam.courseCode || exam.course || "Course"} -{" "}
                          {exam.faculty || "Faculty"}
                        </span>
                      </div>

                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar size={16} className="mr-2 text-gray-400" />
                        <span>
                          {new Date(
                            exam.uploadDate || Date.now()
                          ).toLocaleDateString()}
                        </span>
                      </div>

                      {exam.fileSize && (
                        <div className="flex items-center text-sm text-gray-600">
                          <FileText size={16} className="mr-2 text-gray-400" />
                          <span>{formatFileSize(exam.fileSize)}</span>
                        </div>
                      )}

                      <div className="flex items-center text-sm text-gray-600">
                        <FileIcon size={16} className="mr-2 text-gray-400" />
                        <span>
                          {exam.filePath
                            ? exam.filePath.split(".").pop()?.toUpperCase() ||
                              "PDF"
                            : "PDF"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
                    <button
                      className="flex-1 flex items-center justify-center gap-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
                      onClick={() =>
                        navigate("/cupuriportal/dashboard/browse")
                      }>
                      <Eye size={16} />
                      Visit
                    </button>
                    <button
                      className="flex-1 flex items-center justify-center gap-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                      onClick={() =>
                        navigate("/cupuriportal/dashboard/browse")
                      }>
                      <Download size={16} />
                      Download
                    </button>
                  </div>
                </div>
              ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-gray-200">
              <FileText size={48} className="text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No exams uploaded yet
              </h3>
              <p className="text-gray-500 mb-6">
                Upload your first exam to get started
              </p>
              <button
                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors"
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
