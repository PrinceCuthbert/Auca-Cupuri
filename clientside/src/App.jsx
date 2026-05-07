import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Home from "./pages/homepage/Home";
import Login from "./pages/login/login";
import SignUp from "./pages/signup/signup";
import Dashboard from "./pages/dashboard/dashboard";
import UploadForm from "./pages/form/uploadForm";
import BrowseExams from "./pages/browse/BrowseExams";
import AdminReviews from "./pages/admin/AdminReviews";
import UserManagement from "./pages/admin/UserManagement";
import About from "./pages/about/About";
import StudentReviews from "./pages/student/StudentReviews";
import OfflineHandler from "./components/OfflineHandler";
import Header from "./pages/header/header";
import PublicHeader from "./components/PublicHeader";
import NotFound from "./pages/NotFound";

import ProtectedRoute from "./routes/ProtectedRoute";

import "./App.css";

function AppContent() {
  const location = useLocation();
  
  // Public routes that use the unified PublicHeader
  const publicPaths = ["/", "/about", "/login", "/signup"];
  const isPublicPage = publicPaths.includes(location.pathname);

  return (
    <>
      {isPublicPage ? <PublicHeader /> : <Header />}
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* 🔐 Protected section */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/upload" element={<UploadForm />} />
          <Route path="/dashboard/browse" element={<BrowseExams />} />
          <Route path="/dashboard/reviews" element={<AdminReviews />} />
          <Route path="/dashboard/users" element={<UserManagement />} />
          <Route path="/reviews" element={<StudentReviews />} />
        </Route>

        {/* Catch all - 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <OfflineHandler>
      <ToastContainer position="top-right" autoClose={2000} />
      <Router>
        <AppContent />
      </Router>
    </OfflineHandler>
  );
}

export default App;
