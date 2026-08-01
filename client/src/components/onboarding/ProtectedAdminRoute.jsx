import { Navigate, Outlet } from "react-router-dom"

export default function ProtectedAdminRoute() {
    let session;

    try {
      session = JSON.parse(
        localStorage.getItem("momentumAdminSession"),
      );
    } catch {
      // Invalid stored JSON is treated as no session.
      session = null;
    }

    const isAdmin =
      Boolean(session?.token) &&
      session?.user?.role === "admin";

    if (!isAdmin) {
      return <Navigate to="/admin/login" replace />;
    }

    return <Outlet />;
}