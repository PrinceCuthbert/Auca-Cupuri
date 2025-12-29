import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute() {
  const { isAuthenticated } = useAuth();

  // Not logged in → back to login
  if (!isAuthenticated) {
    return <Navigate to="/cupuriportal/login" replace />;
  }

  // Logged in → allow access
  return <Outlet />;
}
