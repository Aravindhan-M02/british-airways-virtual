import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {

  const loggedInPilot = localStorage.getItem("loggedInPilot");

  if (!loggedInPilot) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;