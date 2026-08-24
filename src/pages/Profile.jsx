import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Profile.css";

function Profile() {
  const storedPilot = JSON.parse(
    localStorage.getItem("loggedInPilot")
  );

  const [pilot, setPilot] = useState(storedPilot);

  const [bookings, setBookings] = useState([]);
  const [pireps, setPireps] = useState([]);

  const [loading, setLoading] = useState(true);

  // ==========================================
  // LOAD PILOT
  // ==========================================

  useEffect(() => {
    const loadPilot = async () => {
      if (!storedPilot?.pilotId) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/pilots?pilotId=${encodeURIComponent(
            storedPilot.pilotId
          )}`
        );

        if (!response.ok) {
          throw new Error("Failed to load pilot");
        }

        const data = await response.json();

        if (data.length > 0) {
          setPilot(data[0]);

          // Keep localStorage updated
          localStorage.setItem(
            "loggedInPilot",
            JSON.stringify(data[0])
          );
        }
      } catch (error) {
        console.error(
          "Error loading pilot:",
          error
        );
      }
    };

    loadPilot();
  }, [storedPilot?.pilotId]);

  // ==========================================
  // LOAD BOOKINGS
  // ==========================================

  useEffect(() => {
    const loadBookings = async () => {
      if (!pilot?.pilotId) {
        return;
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/bookings?pilotId=${encodeURIComponent(
            pilot.pilotId
          )}`
        );

        if (!response.ok) {
          throw new Error(
            "Failed to load bookings"
          );
        }

        const data = await response.json();

        setBookings(data);
      } catch (error) {
        console.error(
          "Error loading bookings:",
          error
        );
      }
    };

    loadBookings();
  }, [pilot?.pilotId]);

  // ==========================================
  // LOAD PIREPS
  // ==========================================

  useEffect(() => {
    const loadPireps = async () => {
      if (!pilot?.pilotId) {
        setPireps([]);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/pireps?pilotId=${encodeURIComponent(
            pilot.pilotId
          )}`
        );

        if (!response.ok) {
          throw new Error(
            "Failed to load PIREPs"
          );
        }

        const data = await response.json();

        setPireps(data);
      } catch (error) {
        console.error(
          "Error loading PIREPs:",
          error
        );

        setPireps([]);
      } finally {
        setLoading(false);
      }
    };

    loadPireps();
  }, [pilot?.pilotId]);

  // ==========================================
  // APPROVED PIREPS
  // ==========================================

  const approvedPireps = pireps.filter(
    (pirep) =>
      pirep.status === "Approved"
  );

  // ==========================================
  // FLIGHT HOURS
  // ==========================================
  //
  // IMPORTANT:
  //
  // We DO NOT calculate flight hours from
  // scheduled flight departure/arrival times.
  //
  // We use the actual flightTime stored inside
  // the approved PIREP.
  //
  // Example:
  //
  // Pilot entered:
  // Actual departure = 10:15
  // Actual arrival   = 13:13
  //
  // PIREP flightTime = 178 minutes
  //
  // Profile adds 178 minutes.
  //
  // ==========================================

  const totalMinutes = approvedPireps.reduce(
    (total, pirep) => {
      return (
        total +
        Number(pirep.flightTime || 0)
      );
    },
    0
  );

  // ==========================================
  // FORMAT FLIGHT HOURS
  // ==========================================

  const totalHours = Math.floor(
    totalMinutes / 60
  );

  const remainingMinutes =
    totalMinutes % 60;

  const formattedHours =
    `${totalHours}h ${remainingMinutes}m`;

  // ==========================================
  // COMPLETED FLIGHTS
  // ==========================================
  //
  // Only APPROVED PIREPs count as completed
  // flights.
  //
  // ==========================================

  const completedFlights =
    approvedPireps.length;

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <main className="profile-page">
        <p>Loading profile...</p>
      </main>
    );
  }

  // ==========================================
  // LOGIN CHECK
  // ==========================================

  if (!pilot) {
    return (
      <main className="profile-page">

        <h1>Please login</h1>

        <Link to="/login">
          Go to Login
        </Link>

      </main>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <main className="profile-page">

      {/* ========================================
          HEADER
      ======================================== */}

      <section className="profile-header">

        <p className="section-tag">
          PILOT OPERATIONS
        </p>

        <h1>
          My Profile
        </h1>

        <p>
          Pilot information and operational
          statistics.
        </p>

      </section>


      {/* ========================================
          PROFILE CARD
      ======================================== */}

      <section className="profile-card">

        <div className="profile-identity">

          <div className="pilot-avatar">
            {pilot.name
              ?.charAt(0)
              .toUpperCase()}
          </div>

          <div>

            <p className="profile-label">
              PILOT
            </p>

            <h2>
              {pilot.name}
            </h2>

            <span className="pilot-id">
              {pilot.pilotId}
            </span>

          </div>

          <span className="active-status">
            ● {pilot?.status || "Not available"}
          </span>

        </div>


        {/* ======================================
            PILOT INFORMATION
        ====================================== */}

        <div className="profile-details">

          <div>

            <span>
              RANK
            </span>

            <strong>
              {pilot.rank}
            </strong>

          </div>


          <div>

            <span>
              EMAIL
            </span>

            <strong>
              {pilot.email}
            </strong>

          </div>


          <div>

            <span>
              JOINED
            </span>

            <strong>
              {pilot?.joinedDate
                ? new Date(
                    pilot.joinedDate
                  ).toLocaleDateString(
                    "en-GB",
                    {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }
                  )
                : "Not available"}
            </strong>

          </div>


          <div>

            <span>
              STATUS
            </span>

            <strong>
              {pilot?.status ||
                "Not available"}
            </strong>

          </div>

        </div>

      </section>


      {/* ========================================
          STATISTICS
      ======================================== */}

      <section className="profile-statistics">


        {/* ======================================
            COMPLETED FLIGHTS
        ====================================== */}

        <div className="profile-stat-card">

          <span>
            ✈
          </span>

          <div>

            <p>
              Completed Flights
            </p>

            <h2>
              {completedFlights}
            </h2>

          </div>

        </div>


        {/* ======================================
            FLIGHT HOURS
        ====================================== */}

        <div className="profile-stat-card">

          <span>
            ⏱
          </span>

          <div>

            <p>
              Flight Hours
            </p>

            <h2>
              {formattedHours}
            </h2>

          </div>

        </div>


        {/* ======================================
            RANK
        ====================================== */}

        <div className="profile-stat-card">

          <span>
            ★
          </span>

          <div>

            <p>
              Rank
            </p>

            <h2>
              {pilot.rank}
            </h2>

          </div>

        </div>


      </section>


      {/* ========================================
          DEBUG / INFORMATION
          REMOVE LATER IF YOU WANT
      ======================================== */}

      {/* 
        Approved PIREPs:
        {approvedPireps.length}

        Total Flight Minutes:
        {totalMinutes}

        Bookings:
        {bookings.length}
      */}


      {/* ========================================
          BACK
      ======================================== */}

      <div className="profile-back">

        <Link to="/dashboard">
          ← Back to Dashboard
        </Link>

      </div>

    </main>
  );
}

export default Profile;