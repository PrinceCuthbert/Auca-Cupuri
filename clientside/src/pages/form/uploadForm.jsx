import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../../css/forms/uploadForm.css";
import { Upload as UploadIcon, UploadCloud as CloudUpload } from "lucide-react";
import { toast } from "react-toastify";
import Footer from "../footer";
import { Select } from "antd";
import { useApp } from "../../context/AppContext";
const { Option } = Select;

const BASE_URL = import.meta.env.VITE_BASE_URL;

function UploadForm() {
  const navigate = useNavigate();

  const [title, setTitle] = useState();
  const [course, setCourse] = useState("");
  const [examType, setExamType] = useState();
  const [faculty, setFaculty] = useState();
  const [exam, setExam] = useState();

  // ✅ Extracted all courses from the commented section
  const courses = [
    "Applied Mathematics",
    "Digital Computer Fundamentals",
    "Computer Maintenance",
    "Introduction to Computer Applications",
    "Introduction to Computer Programming",
    "Operating Systems",
    "Programming with C",
    "Database Management Systems",
    "Database Development with PL/SQL",
    "Object-Oriented Programming",
    "Web Technology and Internet",
    "Web Design",
    "Computer Networks",
    "Advanced Computer Networks",
    "Routing and Switching",
    "Network Administration",
    "Network Programming (TCP/IP)",
    "Network Security",
    "Wireless Networks",
    "System Administration",
    "Java Programming",
    "Mobile Programming",
    "Mobile Communication",
    "Multimedia and Emerging Technologies",
    "Multimedia Computing",
    "Software Engineering",
    "Software Project Management",
    "Software Modeling & Design",
    "Software Quality Assurance",
    "Software Testing Techniques",
    "Software Security",
    "Best Programming Practice & Design Patterns",
    "Theory of Computation",
    "System Analysis and Design",
    "Management Information Systems",
    "Introduction to Big Data",
    "Dot Net",
    "Descriptive Statistics",
    "Probability and Statistics",
    "Multivariable Calculus and ODE",
    "Data Structures and Algorithms",
    "Study and Research Methods",
    "Academics English Writing",
    "General English",
    "Principles of Accounting I",
    "Introduction to Bible Study",
    "Bible Doctrines",
    "Philosophy, Science and Religion",
    "Health Principles",
    "Other",
  ];

  const faculties = [
    "Software Engineering",
    "Information Management",
    "Networking and Telecommunications",
  ];

  const examTypes = ["Mid-Term", "Final"];

  async function HandleSubmit(e) {
    e.preventDefault();

    if (!exam) return toast.error("Please upload a file.");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("faculty", faculty);
    formData.append("course", course);
    formData.append("examType", examType);
    formData.append("exam", exam);

    try {
      // Get user token from localStorage
      const user = JSON.parse(localStorage.getItem("auca-cupuri-user"));
      if (!user?.token) {
        toast.error("Please login to upload exams");
        navigate("/cupuriportal/login");
        return;
      }

      const res = await fetch(`${BASE_URL}/exams/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to upload exam");
      }

      toast.success("Exam uploaded successfully!");
      navigate("/cupuriportal/dashboard");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload exam");
    }
  }

  return (
    <>
      <div className="upload-container">
        <div className="upload-header">
          <h2>
            <CloudUpload className="cloud-icon" size={40} />
            Upload Exam
          </h2>
          <p>Add a new examination paper to the portal</p>
        </div>
        <hr />
        <form className="upload-form" onSubmit={HandleSubmit}>
          <div className="form-grid">
            {/* Exam Title */}
            <div className="form-group">
              <label htmlFor="examTitle">Exam Title *</label>
              <input
                id="examTitle"
                type="text"
                name="examTitle"
                required
                placeholder="e.g., Applied Mathematics Final 2023"
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Faculty (AntD Select) */}
            <div className="form-group">
              <label htmlFor="faculty">Faculty *</label>
              <Select
                id="faculty"
                showSearch
                placeholder="Select Faculty"
                style={{ width: "100%" }}
                value={faculty}
                onChange={(value) => setFaculty(value)}
                filterOption={(input, option) =>
                  option?.children.toLowerCase().includes(input.toLowerCase())
                }>
                {faculties.map((f) => (
                  <Option key={f} value={f}>
                    {f}
                  </Option>
                ))}
              </Select>
            </div>

            {/* Course (AntD Select) */}
            <div className="form-group">
              <label htmlFor="course">Course *</label>
              <Select
                id="course"
                showSearch
                placeholder="Select Course"
                style={{ width: "100%" }}
                value={course}
                onChange={(value) => setCourse(value)}
                filterOption={(input, option) =>
                  option?.children.toLowerCase().includes(input.toLowerCase())
                }>
                {courses.map((c) => (
                  <Option key={c} value={c}>
                    {c}
                  </Option>
                ))}
              </Select>
            </div>

            {/* Exam Type (AntD Select) */}
            <div className="form-group">
              <label htmlFor="examType">Exam Type *</label>
              <Select
                id="examType"
                placeholder="Select Exam Type"
                style={{ width: "100%" }}
                value={examType}
                onChange={(value) => setExamType(value)}>
                {examTypes.map((et) => (
                  <Option key={et} value={et}>
                    {et}
                  </Option>
                ))}
              </Select>
            </div>

            {/* File Upload */}
            <div className="form-group file-upload">
              <label htmlFor="uploadFile">Upload File *</label>
              <div className="file-box">
                <div className="upload-area">
                  <UploadIcon className="upload-icon" />
                  <div className="upload-text">
                    <label htmlFor="uploadFile" className="file-label">
                      <span>Upload a file</span>
                      <input
                        onChange={(e) => setExam(e.target.files[0])}
                        type="file"
                        id="uploadFile"
                        name="uploadFile"
                        required
                        className="hidden-input"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      />
                    </label>
                    <p>or drag and drop</p>
                  </div>
                  <p className="file-types">
                    PDF, DOC, DOCX, JPG, PNG up to 10MB
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="button-group">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate("/cupuriportal/dashboard")}>
              Cancel
            </button>
            <button type="submit" className="upload-btn">
              <UploadIcon
                size={16}
                style={{ marginRight: "6px", verticalAlign: "middle" }}
              />
              Upload Exam
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
}

export default UploadForm;
