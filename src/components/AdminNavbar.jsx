import { useNavigate } from "react-router-dom";
import "./AdminNavbar.css";

function AdminNavbar() {

  const navigate = useNavigate();

  const handleLogout = () => {

    localStorage.removeItem("loggedInAdmin");

    navigate("/admin-login");
  };

  return (
    <nav className="admin-navbar">

      <div className="admin-navbar-brand">
        BA VIRTUAL
        <span>ADMIN</span>
      </div>

      <div className="admin-navbar-links">

        <button
          onClick={() => navigate("/admin")}
        >
          Dashboard
        </button>

        <button
          onClick={handleLogout}
          className="admin-navbar-logout"
        >
          Logout
        </button>

      </div>

    </nav>
  );
}

export default AdminNavbar;