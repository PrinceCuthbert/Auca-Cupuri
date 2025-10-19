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

import "./App.css";

function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} />
      <Router>
        {/* Common Header if you want it on all pages */}
        <Header />

        <Routes>
          {/* Default landing page */}
          <Route path="/" element={<Home />} />

          {/* All routes are children of /cupuriportal */}
          <Route path="/cupuriportal">
            {/* Auth pages */}
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<SignUp />} />

            {/* Dashboard, upload and browse */}
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="dashboard/upload" element={<UploadForm />} />
            <Route path="dashboard/browse" element={<BrowseExams />} />
            <Route path="dashboard/reviews" element={<AdminReviews />} />
            <Route path="reviews" element={<StudentReviews />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
