import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Home from "./pages/homepage/Home";
import Login from "./pages/login/login";
import SignUp from "./pages/signup/signup";
import Dashboard from "./pages/dashboard/dashboard";
import UploadForm from "./pages/form/uploadForm";
import BrowseExams from "./pages/browse/BrowseExams";
import AdminReviews from "./pages/admin/AdminReviews";
import StudentReviews from "./pages/student/StudentReviews";
import Header from "./pages/header/header";

import ProtectedRoute from "./routes/ProtectedRoute";

import "./App.css";

function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} />
      <Router>
        <Header />

        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />

          <Route path="/cupuriportal">
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<SignUp />} />

            {/* 🔐 Protected section */}
            <Route element={<ProtectedRoute />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="dashboard/upload" element={<UploadForm />} />
              <Route path="dashboard/browse" element={<BrowseExams />} />
              <Route path="dashboard/reviews" element={<AdminReviews />} />
              <Route path="reviews" element={<StudentReviews />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
