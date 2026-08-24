import { Navigate, Outlet } from "react-router-dom";

function AdminProtectedRoute() {

  const loggedInAdmin = JSON.parse(
    localStorage.getItem("loggedInAdmin")
  );

  if (!loggedInAdmin) {
    return <Navigate to="/admin-login" replace />;
  }

  return <Outlet />;
}

export default AdminProtectedRoute;