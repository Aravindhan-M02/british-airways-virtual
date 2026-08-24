import { Outlet } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";

function AdminLayout() {

  return (
    <>
      <AdminNavbar />
      <Outlet />
    </>
  );
}

export default AdminLayout;