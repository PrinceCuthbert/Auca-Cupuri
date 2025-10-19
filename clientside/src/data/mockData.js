export const mockFaculties = [
  { _id: "1", name: "Software Engineering" },
  { _id: "2", name: "Information Management" },
  { _id: "3", name: "Networking and Telecommunications" },
];

export const mockCourses = [
  // Software Engineering - Year I
  { _id: "1", title: "AMAT 8111 – Applied Mathematics", facultyId: "1" },
  { _id: "2", title: "INSY 8121 – Computer Maintenance", facultyId: "1" },
  {
    _id: "3",
    title: "INSY 8122 – Introduction to Computer Programming",
    facultyId: "1",
  },
  {
    _id: "4",
    title: "MATH 8126 – Digital Computer Fundamentals",
    facultyId: "1",
  },
  { _id: "5", title: "INSY 8211 – Computer Networks", facultyId: "1" },
  { _id: "6", title: "INSY 8212 – Programming in C", facultyId: "1" },
  {
    _id: "7",
    title: "INSY 8215 – Software Engineering (intro)",
    facultyId: "1",
  },
  { _id: "8", title: "ENGL – English Grammar / Writing", facultyId: "1" },
  { _id: "9", title: "RELT / Bible Study", facultyId: "1" },

  // Software Engineering - Year II
  {
    _id: "10",
    title: "INSY 8221 – Object‑Oriented Programming",
    facultyId: "1",
  },
  {
    _id: "11",
    title: "INSY 8222 – Database Management Systems",
    facultyId: "1",
  },
  { _id: "12", title: "INSY 8223 – Operating Systems", facultyId: "1" },
  {
    _id: "13",
    title: "INSY 8311 – Database Development (PL/SQL)",
    facultyId: "1",
  },
  { _id: "14", title: "COSC 8312 – Linux Introduction", facultyId: "1" },
  { _id: "15", title: "INSY 8312 – Java Programming", facultyId: "1" },
  { _id: "16", title: "COSC 8314 – Web Design", facultyId: "1" },
  {
    _id: "17",
    title: "INSY 8321 – Data Structures & Algorithms",
    facultyId: "1",
  },
  {
    _id: "18",
    title: "INSY 8322 – Web Technologies & Internet",
    facultyId: "1",
  },

  // Software Engineering - Year III
  { _id: "19", title: "SENG 8224 – Requirements Engineering", facultyId: "1" },
  {
    _id: "20",
    title: "SENG 8315 – Software Project Management",
    facultyId: "1",
  },
  {
    _id: "21",
    title: "SENG 8323 – Software Modeling & Design",
    facultyId: "1",
  },
  {
    _id: "22",
    title: "SENG 8324 – Software Quality Assurance",
    facultyId: "1",
  },
  {
    _id: "23",
    title: "SENG 8325 – Software Testing Techniques",
    facultyId: "1",
  },
  { _id: "24", title: "INSY 8411 – .NET", facultyId: "1" },
  { _id: "25", title: "INSY 8413 – Introduction to Big Data", facultyId: "1" },
  { _id: "26", title: "INSY 8414 – Mobile Programming", facultyId: "1" },
  { _id: "27", title: "SENG 8414 – Software Security", facultyId: "1" },
  {
    _id: "28",
    title: "SENG 8415 – Design Patterns & Best Practices",
    facultyId: "1",
  },

  // Software Engineering - Year IV
  {
    _id: "29",
    title: "INSY 8421 – Internship (Industrial Attachment)",
    facultyId: "1",
  },
  { _id: "30", title: "INSY 8422 – Final Year Project", facultyId: "1" },

  // Information Management
  { _id: "31", title: "MGMT 8124 – Principles of Management", facultyId: "2" },
  { _id: "32", title: "ACCT 8124 – Intermediate Accounting I", facultyId: "2" },
  {
    _id: "33",
    title: "ACCT 8121 – Principles of Accounting II",
    facultyId: "2",
  },
  {
    _id: "34",
    title: "INSY 8313 – Management Information Systems",
    facultyId: "2",
  },
  {
    _id: "35",
    title: "Bible Doctrine / Introduction to Bible Study",
    facultyId: "2",
  },
  {
    _id: "36",
    title: "Academic / English Grammar / English Writing",
    facultyId: "2",
  },
  { _id: "37", title: "Health Principles", facultyId: "2" },

  // Networking and Telecommunications
  { _id: "38", title: "Computer Networks", facultyId: "3" },
  { _id: "39", title: "Electronic Devices and Circuits", facultyId: "3" },
  { _id: "40", title: "Programming with C", facultyId: "3" },
  { _id: "41", title: "Database Management Systems", facultyId: "3" },
  { _id: "42", title: "Software Engineering", facultyId: "3" },
  {
    _id: "43",
    title: "Bible Doctrine / Introduction to Bible Study",
    facultyId: "3",
  },
  {
    _id: "44",
    title: "Academic / English Grammar / English Writing",
    facultyId: "3",
  },
  { _id: "45", title: "Health Principles", facultyId: "3" },
];

export const mockExams = [
  {
    _id: "1",
    title: "Applied Mathematics Final 2023",
    courseId: "1",
    examType: "Final",
    fileUrl: "/files/applied-math-final-2023.pdf",
    uploadedBy: "admin1",
    uploadDate: "2023-12-15T10:00:00Z",
    fileName: "applied-math-final-2023.pdf",
    fileType: "application/pdf",
    fileSize: "2.5 MB",
  },
  {
    _id: "2",
    title: "Computer Programming Mid-Term 2023",
    courseId: "3",
    examType: "Mid-Term",
    fileUrl: "/files/programming-midterm-2023.pdf",
    uploadedBy: "admin1",
    uploadDate: "2023-10-20T14:30:00Z",
    fileName: "programming-midterm-2023.pdf",
    fileType: "application/pdf",
    fileSize: "1.8 MB",
  },
  {
    _id: "3",
    title: "Database Management Systems Final 2023",
    courseId: "11",
    examType: "Final",
    fileUrl: "/files/database-final-2023.pdf",
    uploadedBy: "admin1",
    uploadDate: "2023-12-18T09:00:00Z",
    fileName: "database-final-2023.pdf",
    fileType: "application/pdf",
    fileSize: "3.2 MB",
  },
  {
    _id: "4",
    title: "Principles of Management Final 2023",
    courseId: "31",
    examType: "Final",
    fileUrl: "/files/management-final-2023.pdf",
    uploadedBy: "admin1",
    uploadDate: "2023-12-20T11:00:00Z",
    fileName: "management-final-2023.pdf",
    fileType: "application/pdf",
    fileSize: "2.1 MB",
  },
  {
    _id: "5",
    title: "Computer Networks Mid-Term 2023",
    courseId: "38",
    examType: "Mid-Term",
    fileUrl: "/files/networks-midterm-2023.pdf",
    uploadedBy: "admin1",
    uploadDate: "2023-10-25T13:00:00Z",
    fileName: "networks-midterm-2023.pdf",
    fileType: "application/pdf",
    fileSize: "2.8 MB",
  },
];

export const mockUsers = [
  {
    _id: "admin1",
    name: "Admin User",
    email: "admin@auca.ac.rw",
    role: "admin",
    createdAt: "2023-01-01T00:00:00Z",
  },
  {
    _id: "student1",
    name: "Student User",
    email: "student@auca.ac.rw",
    role: "student",
    createdAt: "2023-01-15T00:00:00Z",
  },
];
