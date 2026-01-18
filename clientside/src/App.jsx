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
import OfflineHandler from "./components/OfflineHandler";
import Header from "./pages/header/header";
import NotFound from "./pages/NotFound";

import ProtectedRoute from "./routes/ProtectedRoute";

import "./App.css";

function App() {
  return (
    <OfflineHandler>
      <ToastContainer position="top-right" autoClose={2000} />
      <Router>
        <Header />

        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />

          <Route path="/cupuriportal/login" element={<Login />} />
          <Route path="/cupuriportal/signup" element={<SignUp />} />

          {/* 🔐 Protected section */}
          <Route element={<ProtectedRoute />}>
            <Route path="/cupuriportal/dashboard" element={<Dashboard />} />
            <Route path="/cupuriportal/dashboard/upload" element={<UploadForm />} />
            <Route path="/cupuriportal/dashboard/browse" element={<BrowseExams />} />
            <Route path="/cupuriportal/dashboard/reviews" element={<AdminReviews />} />
            <Route path="/cupuriportal/reviews" element={<StudentReviews />} />
          </Route>

          {/* Catch all - 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </OfflineHandler>
  );
}

export default App;
