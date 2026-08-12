import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Upload as UploadIcon,
  UploadCloud as CloudUpload,
  FileText,
  X,
  CheckCircle,
  Image,
} from "lucide-react";
import { toast } from "react-toastify";
import Footer from "../footer";
import { Select } from "antd";
import { useApp } from "../../context/AppContext";

const { Option } = Select;

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
  "image/jpg",
  "image/heic",
  "image/heif",
];

function UploadForm() {
  const navigate = useNavigate();
  const { addExam } = useApp();

  const [title, setTitle] = useState("");
  const [course, setCourse] = useState("");
  const [examType, setExamType] = useState();
  const [faculty, setFaculty] = useState();
  const [examFiles, setExamFiles] = useState([]); // Array of files
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false); // Drag & Drop visual feedback state

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

  // Helper to validate and add incoming files (from input or drag-and-drop)
  const validateAndAddFiles = (incomingFiles) => {
    const validFiles = [];

    for (const file of incomingFiles) {
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`File "${file.name}" exceeds the 20MB limit.`);
        continue;
      }

      if (!ALLOWED_TYPES.includes(file.type)) {
        toast.error(`File "${file.name}" is not a supported format.`);
        continue;
      }

      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      setExamFiles((prev) => [...prev, ...validFiles]);
    }
  };

  // Drag and Drop Handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      validateAndAddFiles(droppedFiles);
    }
  };

  // Input File Selection
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    validateAndAddFiles(selectedFiles);
    e.target.value = ""; // Reset input so same file can be re-added
  };

  const removeFile = (index) => {
    setExamFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const moveFileUp = (index) => {
    if (index === 0) return;
    setExamFiles((prev) => {
      const newFiles = [...prev];
      [newFiles[index - 1], newFiles[index]] = [
        newFiles[index],
        newFiles[index - 1],
      ];
      return newFiles;
    });
  };

  const moveFileDown = (index) => {
    if (index === examFiles.length - 1) return;
    setExamFiles((prev) => {
      const newFiles = [...prev];
      [newFiles[index], newFiles[index + 1]] = [
        newFiles[index + 1],
        newFiles[index],
      ];
      return newFiles;
    });
  };

  const isImageFile = (file) => file.type.startsWith("image/");

  const getTotalFileSize = () => {
    return examFiles.reduce((sum, file) => sum + file.size, 0);
  };

  async function HandleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    if (examFiles.length === 0) {
      toast.error("Please upload at least one file.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("faculty", faculty);
    formData.append("course", course);
    formData.append("examType", examType);

    examFiles.forEach((file) => {
      formData.append("exam", file);
    });

    try {
      const user = JSON.parse(localStorage.getItem("auca-cupuri-user"));
      if (!user) {
        toast.error("Please login to upload exams");
        navigate("/login");
        return;
      }

      const uploadPromise = addExam(formData);

      toast.promise(uploadPromise, {
        pending: `Uploading ${examFiles.length} file(s) in the background... You can navigate away!`,
        success: "Exam uploaded successfully!",
        error: "Failed to upload exam. Please try again.",
      });

      setSuccess(true);
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (error) {
      toast.error(error.message || "Failed to start upload");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <>
        <div className="max-w-2xl mx-auto p-4">
          <div className="bg-white rounded-xl shadow-lg border border-emerald-100 p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Upload Successful!
            </h2>
            <p className="text-gray-600 mb-6">
              Your exam has been uploaded successfully and is now available for
              students.
            </p>
            <button
              onClick={() => navigate("/dashboard")}
              className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
              Go to Dashboard
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <div className="max-w-2xl mx-auto p-4">
        <div className="bg-white rounded-xl shadow-lg border border-emerald-100">
          {/* Header */}
          <div className="p-6 border-b">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-500 p-2 rounded-lg">
                <CloudUpload className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Upload Exam</h1>
            </div>
            <p className="text-gray-600 mt-1">
              Add a new examination paper to the portal
            </p>
          </div>

          <form onSubmit={HandleSubmit} className="p-6 space-y-6">
            {/* Exam Title */}
            <div>
              <label
                htmlFor="examTitle"
                className="block text-sm font-medium text-gray-700 mb-1">
                Exam Title *
              </label>
              <input
                id="examTitle"
                type="text"
                name="examTitle"
                required
                placeholder="e.g., Applied Mathematics Final 2023"
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
              />
            </div>

            {/* Faculty */}
            <div>
              <label
                htmlFor="faculty"
                className="block text-sm font-medium text-gray-700 mb-1">
                Faculty *
              </label>
              <Select
                id="faculty"
                showSearch
                placeholder="Select Faculty"
                style={{ width: "100%" }}
                value={faculty}
                onChange={(value) => setFaculty(value)}
                filterOption={(input, option) =>
                  option?.children.toLowerCase().includes(input.toLowerCase())
                }
                className="[&_.ant-select-selector]:!rounded-lg [&_.ant-select-selector]:!border-gray-300 [&_.ant-select-selector]:!py-1 [&_.ant-select-focused_.ant-select-selector]:!border-emerald-500 [&_.ant-select-focused_.ant-select-selector]:!shadow-[0_0_0_2px_rgba(16,185,129,0.2)]">
                {faculties.map((f) => (
                  <Option key={f} value={f}>
                    {f}
                  </Option>
                ))}
              </Select>
            </div>

            {/* Course */}
            <div>
              <label
                htmlFor="course"
                className="block text-sm font-medium text-gray-700 mb-1">
                Course *
              </label>
              <Select
                id="course"
                showSearch
                placeholder="Select Course"
                style={{ width: "100%" }}
                value={course}
                onChange={(value) => setCourse(value)}
                filterOption={(input, option) =>
                  option?.children.toLowerCase().includes(input.toLowerCase())
                }
                className="[&_.ant-select-selector]:!rounded-lg [&_.ant-select-selector]:!border-gray-300 [&_.ant-select-selector]:!py-1 [&_.ant-select-focused_.ant-select-selector]:!border-emerald-500 [&_.ant-select-focused_.ant-select-selector]:!shadow-[0_0_0_2px_rgba(16,185,129,0.2)]">
                {courses.map((c) => (
                  <Option key={c} value={c}>
                    {c}
                  </Option>
                ))}
              </Select>
            </div>

            {/* Exam Type */}
            <div>
              <label
                htmlFor="examType"
                className="block text-sm font-medium text-gray-700 mb-1">
                Exam Type *
              </label>
              <Select
                id="examType"
                placeholder="Select Exam Type"
                style={{ width: "100%" }}
                value={examType}
                onChange={(value) => setExamType(value)}
                className="[&_.ant-select-selector]:!rounded-lg [&_.ant-select-selector]:!border-gray-300 [&_.ant-select-selector]:!py-1 [&_.ant-select-focused_.ant-select-selector]:!border-emerald-500 [&_.ant-select-focused_.ant-select-selector]:!shadow-[0_0_0_2px_rgba(16,185,129,0.2)]">
                {examTypes.map((et) => (
                  <Option key={et} value={et}>
                    {et}
                  </Option>
                ))}
              </Select>
            </div>

            {/* File Upload / Drag & Drop Zone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload File(s) *
                <span className="text-gray-400 font-normal ml-2">
                  (You can upload multiple images for multi-page exams)
                </span>
              </label>

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-xl transition-all duration-300 ${isDragging
                  ? "border-emerald-500 bg-emerald-100/80 scale-[1.01] shadow-md"
                  : "border-emerald-300 hover:border-emerald-400 bg-emerald-50/50"
                  }`}>
                <div className="space-y-1 text-center pointer-events-none">
                  <UploadIcon
                    className={`mx-auto h-12 w-12 transition-transform duration-300 ${isDragging ? "text-emerald-600 scale-110" : "text-emerald-500"
                      }`}
                  />
                  <div className="flex text-sm text-gray-600 justify-center items-center">
                    <label
                      htmlFor="uploadFile"
                      className="relative cursor-pointer pointer-events-auto bg-white rounded-md font-medium text-emerald-600 hover:text-emerald-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-emerald-500 px-1">
                      <span>Upload file(s)</span>
                      <input
                        onChange={handleFileChange}
                        type="file"
                        id="uploadFile"
                        name="uploadFile"
                        className="sr-only"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.heic,.heif"
                        multiple
                      />
                    </label>
                    <p className="pl-1">or drag and drop here</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PDF, DOC, DOCX, JPG, PNG, HEIC up to 20MB each
                  </p>
                  <p className="text-xs text-emerald-600 font-medium pt-1">
                    💡 Tip: Select multiple images or drop them directly into this area
                  </p>
                </div>
              </div>
            </div>

            {/* Selected Files Display */}
            {examFiles.length > 0 && (
              <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">
                    {examFiles.length} file{examFiles.length > 1 ? "s" : ""}{" "}
                    selected
                  </h4>
                  <p className="text-sm text-gray-500">
                    Total: {(getTotalFileSize() / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>

                {examFiles.length > 1 && (
                  <p className="text-xs text-gray-500 mb-3">
                    📄 Files will be displayed in this order. Use arrows to
                    reorder.
                  </p>
                )}

                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {examFiles.map((file, index) => (
                    <div
                      key={`${file.name}-${index}`}
                      className="flex items-center justify-between bg-white rounded-lg p-3 border border-emerald-100">
                      <div className="flex items-center space-x-3">
                        <span className="text-xs text-gray-400 w-6">
                          {index + 1}.
                        </span>
                        {isImageFile(file) ? (
                          <Image className="h-6 w-6 text-blue-500" />
                        ) : (
                          <FileText className="h-6 w-6 text-emerald-500" />
                        )}
                        <div>
                          <p className="font-medium text-gray-900 text-sm truncate max-w-xs">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        {examFiles.length > 1 && (
                          <>
                            <button
                              type="button"
                              onClick={() => moveFileUp(index)}
                              disabled={index === 0}
                              className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed">
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 15l7-7 7 7"
                                />
                              </svg>
                            </button>
                            <button
                              type="button"
                              onClick={() => moveFileDown(index)}
                              disabled={index === examFiles.length - 1}
                              className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed">
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 9l-7 7-7-7"
                                />
                              </svg>
                            </button>
                          </>
                        )}
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="p-1 text-gray-400 hover:text-red-500 transition-colors">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add more files button */}
                <label
                  htmlFor="uploadFile"
                  className="mt-3 flex items-center justify-center gap-2 py-2 px-4 border-2 border-dashed border-emerald-300 rounded-lg cursor-pointer hover:border-emerald-400 hover:bg-emerald-50 transition-all text-sm text-emerald-600 font-medium">
                  <UploadIcon className="h-4 w-4" />
                  Add more files
                </label>
              </div>
            )}

            {/* Form Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-300">
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-emerald-600 to-teal-600 border border-transparent rounded-lg hover:from-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center">
                <UploadIcon className="h-4 w-4 mr-2" />
                {loading ? "Uploading..." : "Upload Exam"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default UploadForm;