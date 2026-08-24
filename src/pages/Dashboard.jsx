import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const pilot = JSON.parse(
    localStorage.getItem("loggedInPilot")
  );

  const [bookings, setBookings] = useState([]);
  const [pireps, setPireps] = useState([]);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // LOAD DASHBOARD DATA
  // ==========================================

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!pilot) {
        setLoading(false);
        return;
      }

      try {
        // ==========================================
        // LOAD BOOKINGS
        // ==========================================

        const bookingResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/bookings?pilotId=${encodeURIComponent(
  pilot.pilotId
          )}`
        );

        if (!bookingResponse.ok) {
          throw new Error("Failed to load bookings");
        }

        const bookingData =
          await bookingResponse.json();

        // ==========================================
        // LOAD FLIGHT DETAILS
        // ==========================================

        const flightsWithDetails =
          await Promise.all(
            bookingData.map(async (booking) => {
              const flightResponse = await fetch(
  `${import.meta.env.VITE_API_URL}/flights/${booking.flightId}`
);

              if (!flightResponse.ok) {
                return {
                  ...booking,
                  flight: null,
                };
              }

              const flight =
                await flightResponse.json();

              return {
                ...booking,
                flight,
              };
            })
          );

        setBookings(flightsWithDetails);

        // ==========================================
        // LOAD PIREPS
        // ==========================================

        const pirepResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/pireps?pilotId=${encodeURIComponent(
  pilot.pilotId
)}`
        );

        if (!pirepResponse.ok) {
          throw new Error("Failed to load PIREPs");
        }

        const pirepData =
          await pirepResponse.json();

        setPireps(pirepData);

      } catch (error) {
        console.error(
          "Error loading dashboard data:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [pilot?.pilotId]);

  // ==========================================
  // APPROVED PIREPS
  // ==========================================

  const approvedPireps = pireps.filter(
    (pirep) =>
      pirep.status === "Approved" ||
      pirep.status === "Completed"
  );

  // ==========================================
  // COMPLETED FLIGHTS
  // ==========================================

  const completedBookings =
    bookings.filter(
      (booking) =>
        booking.status === "Completed"
    );

  // ==========================================
  // BOOKED FLIGHTS
  // ==========================================

  const bookedFlights =
    bookings.filter(
      (booking) =>
        booking.status === "Booked"
    );

  // ==========================================
  // TOTAL FLIGHTS
  // ==========================================

  /*
   * Count approved PIREPs as completed flights.
   *
   * This is better than simply checking booking.status
   * because the manager's PIREP approval is what
   * officially completes the flight.
   */

  const totalFlights =
    approvedPireps.length;

  const completedFlights =
    approvedPireps.length;

  // ==========================================
  // TOTAL FLIGHT MINUTES
  // ==========================================

  /*
   * IMPORTANT:
   *
   * PIREP flightTime is stored in MINUTES.
   *
   * Example:
   *
   * 390 = 6h 30m
   * 420 = 7h 00m
   * 435 = 7h 15m
   */

  const totalMinutes =
    approvedPireps.reduce(
      (total, pirep) => {
        const minutes =
          Number(pirep.flightTime) || 0;

        return total + minutes;
      },
      0
    );

  // ==========================================
  // FORMAT FLIGHT HOURS
  // ==========================================

  const totalHours =
    Math.floor(totalMinutes / 60);

  const remainingMinutes =
    totalMinutes % 60;

  const formattedFlightHours =
    `${totalHours}h ${remainingMinutes}m`;

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <main className="dashboard-page">
        <p>Loading dashboard...</p>
      </main>
    );
  }

  // ==========================================
  // NOT LOGGED IN
  // ==========================================

  if (!pilot) {
    return (
      <main className="dashboard-page">
        <h1>Please login</h1>

        <Link to="/login">
          Go to Login
        </Link>
      </main>
    );
  }

  // ==========================================
  // DASHBOARD
  // ==========================================

  return (
    <main className="dashboard-page">

      {/* HEADER */}

      <section className="dashboard-header">

        <p className="section-tag">
          PILOT OPERATIONS
        </p>

        <h1>
          Welcome back, {pilot.name}
        </h1>

        <p>
          Manage your British Airways Virtual
          operations from your pilot dashboard.
        </p>

      </section>


      {/* PILOT STATISTICS */}

      <section className="pilot-statistics">

        {/* TOTAL FLIGHTS */}

        <div className="stat-card">

          <span className="stat-icon">
            ✈
          </span>

          <div>

            <p>
              Total Flights
            </p>

            <h2>
              {totalFlights}
            </h2>

          </div>

        </div>


        {/* FLIGHT HOURS */}

        <div className="stat-card">

          <span className="stat-icon">
            ⏱
          </span>

          <div>

            <p>
              Flight Hours
            </p>

            <h2>
              {formattedFlightHours}
            </h2>

          </div>

        </div>


        {/* COMPLETED */}

        <div className="stat-card">

          <span className="stat-icon">
            ✓
          </span>

          <div>

            <p>
              Completed
            </p>

            <h2>
              {completedFlights}
            </h2>

          </div>

        </div>


        {/* BOOKED */}

        <div className="stat-card">

          <span className="stat-icon">
            ●
          </span>

          <div>

            <p>
              Booked
            </p>

            <h2>
              {bookedFlights.length}
            </h2>

          </div>

        </div>

      </section>


      {/* DASHBOARD MENU */}

      <section className="dashboard-grid">

        <Link
          to="/flights"
          className="dashboard-card"
        >

          <span>
            01
          </span>

          <h2>
            Flight Schedule
          </h2>

          <p>
            Browse available BA Virtual flights.
          </p>

        </Link>


        <Link
          to="/my-flights"
          className="dashboard-card"
        >

          <span>
            02
          </span>

          <h2>
            My Flights
          </h2>

          <p>
            View your booked and completed flights.
          </p>

        </Link>


        <Link
          to="/profile"
          className="dashboard-card"
        >

          <span>
            03
          </span>

          <h2>
            My Profile
          </h2>

          <p>
            Pilot profile and statistics.
          </p>

        </Link>

      </section>

    </main>
  );
}

export default Dashboard;