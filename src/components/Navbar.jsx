import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Navbar.css";

function Navbar() {

  const navigate = useNavigate();
  const location = useLocation();

  const [loggedInPilot, setLoggedInPilot] = useState(() => {
    const savedPilot = localStorage.getItem("loggedInPilot");

    return savedPilot
      ? JSON.parse(savedPilot)
      : null;
  });


  // ==========================================
  // KEEP NAVBAR IN SYNC WITH LOGIN / LOGOUT
  // ==========================================

  useEffect(() => {

    const handlePilotLogin = () => {

      const savedPilot =
        localStorage.getItem("loggedInPilot");

      setLoggedInPilot(
        savedPilot
          ? JSON.parse(savedPilot)
          : null
      );
    };


    const handleStorageChange = () => {

      const savedPilot =
        localStorage.getItem("loggedInPilot");

      setLoggedInPilot(
        savedPilot
          ? JSON.parse(savedPilot)
          : null
      );
    };


    window.addEventListener(
      "pilotLogin",
      handlePilotLogin
    );

    window.addEventListener(
      "storage",
      handleStorageChange
    );


    return () => {

      window.removeEventListener(
        "pilotLogin",
        handlePilotLogin
      );

      window.removeEventListener(
        "storage",
        handleStorageChange
      );

    };

  }, []);


  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {

    localStorage.removeItem("loggedInPilot");

    setLoggedInPilot(null);

    navigate("/login");

  };


  return (

    <nav className="navbar">

      {/* ==========================================
          BRAND
      ========================================== */}

      <div className="navbar-brand">

        <Link to="/" className="navbar-logo">

          <span className="navbar-logo-main">
            BRITISH AIRWAYS
          </span>

          <span className="navbar-logo-sub">
            VIRTUAL
          </span>

        </Link>

      </div>


      {/* ==========================================
          NAVIGATION
      ========================================== */}

      <div className="navbar-links">

        {/* HOME */}

        <Link to="/">
          Home
        </Link>


        {/* ==========================================
            LOGGED-IN PILOT
        ========================================== */}

        {loggedInPilot ? (

          <>

            <Link to="/flights">
              Flights
            </Link>

            <Link to="/pilots">
              Pilots
            </Link>

            <Link to="/about">
              About
            </Link>

            <Link to="/my-flights">
              My Flights
            </Link>

            <Link to="/profile">
              Profile
            </Link>

            <button
              type="button"
              className="navbar-logout"
              onClick={handleLogout}
            >
              Logout
            </button>

          </>

        ) : (

          /* ==========================================
             LOGGED-OUT VISITOR
          ========================================== */

          <>

            <Link to="/about">
              About
            </Link>

            <Link to="/register">
              Join BA
            </Link>

            <Link to="/login">
              Login
            </Link>

          </>

        )}

      </div>

    </nav>

  );

}

export default Navbar;