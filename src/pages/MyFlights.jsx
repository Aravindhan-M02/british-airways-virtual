import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./MyFlights.css";

function MyFlights() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const loggedInPilot = JSON.parse(
    localStorage.getItem("loggedInPilot")
  );

  useEffect(() => {
    const loadMyFlights = async () => {
      if (!loggedInPilot) {
        setLoading(false);
        return;
      }

      try {
        // ==========================================
        // LOAD BOOKINGS
        // ==========================================

        const bookingResponse = await fetch(
          `http://localhost:3000/bookings?pilotId=${encodeURIComponent(
            loggedInPilot.pilotId
          )}`
        );

        if (!bookingResponse.ok) {
          throw new Error(
            "Failed to load bookings."
          );
        }

        const bookingData =
          await bookingResponse.json();

        // ==========================================
        // LOAD FLIGHT + PIREP
        // ==========================================

        const flightsWithDetails =
          await Promise.all(
            bookingData.map(async (booking) => {

              // ==========================================
              // LOAD FLIGHT
              // ==========================================

              const flightResponse =
                await fetch(
                  `http://localhost:3000/flights/${booking.flightId}`
                );

              let flight = null;

              if (flightResponse.ok) {
                flight =
                  await flightResponse.json();
              }

              // ==========================================
              // LOAD PIREPS
              // ==========================================

              const pirepResponse =
                await fetch(
                  `http://localhost:3000/pireps?bookingId=${encodeURIComponent(
                    booking.id
                  )}`
                );

              let pireps = [];

              if (pirepResponse.ok) {
                pireps =
                  await pirepResponse.json();
              }

              // ==========================================
              // GET LATEST PIREP
              // ==========================================

              const pirep =
                pireps.length > 0
                  ? pireps[pireps.length - 1]
                  : null;

              return {
                ...booking,
                flight,
                pirep,
              };
            })
          );

        setBookings(flightsWithDetails);

      } catch (error) {
        console.error(
          "Error loading my flights:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadMyFlights();

  }, [loggedInPilot?.pilotId]);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <main className="my-flights-page">
        <p>Loading your flights...</p>
      </main>
    );
  }

  // ==========================================
  // LOGIN CHECK
  // ==========================================

  if (!loggedInPilot) {
    return (
      <main className="my-flights-page">

        <h1>
          Please login
        </h1>

        <Link to="/login">
          Go to Login
        </Link>

      </main>
    );
  }

  return (
    <main className="my-flights-page">

      {/* HEADER */}

      <section className="my-flights-header">

        <p className="section-tag">
          PILOT OPERATIONS
        </p>

        <h1>
          My Flights
        </h1>

        <p>
          Welcome back, {loggedInPilot.name}.
          Here are your booked flights.
        </p>

      </section>

      {/* NO FLIGHTS */}

      {bookings.length === 0 ? (

        <section className="no-flights">

          <h2>
            No flights booked
          </h2>

          <p>
            You don't have any flights booked yet.
          </p>

          <Link
            to="/flights"
            className="book-flight-link"
          >
            Browse Flight Schedule
          </Link>

        </section>

      ) : (

        <section className="my-flights-list">

          {bookings.map((booking) => {

            // ==========================================
            // DETERMINE PIREP STATUS
            // ==========================================

            const pirepStatus =
              booking.pirep?.status || null;

            const isPending =
              pirepStatus === "Pending Review";

            const isApproved =
              pirepStatus === "Approved";

            const isDenied =
              pirepStatus === "Denied";

            const isCompleted =
              booking.status === "Completed" ||
              pirepStatus === "Completed";

            const isBooked =
              booking.status === "Booked" &&
              !booking.pirep;

            return (

              <article
                className="my-flight-card"
                key={booking.id}
              >

                {booking.flight ? (

                  <>

                    {/* TOP */}

                    <div className="my-flight-top">

                      <div>

                        <span className="flight-label">
                          FLIGHT
                        </span>

                        <h2>
                          {booking.flight.flightNumber}
                        </h2>

                      </div>

                      {/* STATUS */}

                      <span
                        className={
                          isCompleted ||
                          isApproved
                            ? "booking-status completed"
                            : isDenied
                            ? "booking-status denied"
                            : isPending
                            ? "booking-status pirep-pending"
                            : "booking-status"
                        }
                      >

                        ●{" "}

                        {isCompleted ||
                        isApproved
                          ? "Completed"
                          : isDenied
                          ? "PIREP Denied"
                          : isPending
                          ? "PIREP Pending Review"
                          : booking.status}

                      </span>

                    </div>

                    {/* ROUTE */}

                    <div className="my-flight-route">

                      <div>

                        <span>
                          DEPARTURE
                        </span>

                        <strong>
                          {booking.flight.departure}
                        </strong>

                      </div>

                      <div className="route-arrow">
                        →
                      </div>

                      <div>

                        <span>
                          ARRIVAL
                        </span>

                        <strong>
                          {booking.flight.arrival}
                        </strong>

                      </div>

                    </div>

                    {/* FLIGHT INFORMATION */}

                    <div className="my-flight-info">

                      <div>

                        <span>
                          AIRCRAFT
                        </span>

                        <strong>
                          {booking.flight.aircraft}
                        </strong>

                      </div>

                      <div>

                        <span>
                          BOOKED
                        </span>

                        <strong>
                          {new Date(
                            booking.bookedDate
                          )
                            .toISOString()
                            .slice(0, 16)
                            .replace(
                              "T",
                              " "
                            ) + "Z"}
                        </strong>

                      </div>

                    </div>

                    {/* =================================
                        NORMAL BOOKING
                    ================================= */}

                    {isBooked && (

                      <div className="flight-actions">

                        <Link
                          to={`/flights/${booking.flight.id}`}
                          state={{
                            fromMyFlights: true,
                          }}
                          className="view-flight-button"
                        >
                          View Flight
                        </Link>

                        <Link
                          to={`/pirep/${booking.id}`}
                          className="complete-flight-button"
                        >
                          File PIREP
                        </Link>

                      </div>

                    )}

                    {/* =================================
                        PIREP PENDING
                    ================================= */}

                    {isPending && (

                      <div className="flight-pending-message">

                        <div>
                          ⏳ PIREP submitted successfully —
                          awaiting manager review
                        </div>

                      </div>

                    )}

                    {/* =================================
                        PIREP DENIED
                    ================================= */}

                    {isDenied && (

                      <div className="flight-denied-message">

                        <div>
                          ✕ PIREP denied by manager.
                        </div>

                        {/* MANAGER COMMENT */}

                        {booking.pirep?.reviewComment && (

                          <div className="manager-comment">

                            <strong>
                              Manager comment
                            </strong>

                            <p>
                              {booking.pirep.reviewComment}
                            </p>

                          </div>

                        )}

                        <small>
                          Please review your flight details
                          and submit the PIREP again.
                        </small>

                        <Link
                          to={`/pirep/${booking.id}`}
                          className="complete-flight-button"
                        >
                          File PIREP Again
                        </Link>

                      </div>

                    )}

                    {/* =================================
                        COMPLETED
                    ================================= */}

                    {isCompleted && (

                      <div className="flight-completed-message">

                        <div>
                          ✓ Flight completed
                        </div>

                        {/* MANAGER COMMENT */}

                        {booking.pirep?.reviewComment && (

                          <div className="manager-comment">

                            <strong>
                              Manager comment
                            </strong>

                            <p>
                              {booking.pirep.reviewComment}
                            </p>

                          </div>

                        )}

                      </div>

                    )}

                  </>

                ) : (

                  <p>
                    Flight information unavailable.
                  </p>

                )}

              </article>

            );

          })}

        </section>

      )}

    </main>
  );
}

export default MyFlights;
