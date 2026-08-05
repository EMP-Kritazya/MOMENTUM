import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/authContext.js";

export default function RequireAdminRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <p className="p-8 text-momentum-muted">Loading account…</p>;
  }
  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }
  if (user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
