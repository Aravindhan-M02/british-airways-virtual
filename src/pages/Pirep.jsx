import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./Pirep.css";

function Pirep() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [flight, setFlight] = useState(null);

  // ==========================================
  // FLIGHT DATE + TIME
  // ==========================================

  const [departureDate, setDepartureDate] = useState("");
  const [arrivalDate, setArrivalDate] = useState("");

  const [departureTime, setDepartureTime] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");

  // ==========================================
  // PIREP DETAILS
  // ==========================================

  const [flightBonus, setFlightBonus] = useState("No");
  const [originalFlightTime, setOriginalFlightTime] = useState("");
  const [comments, setComments] = useState("");

  // ==========================================
  // CALCULATED FLIGHT TIME
  // ==========================================

  const [flightTime, setFlightTime] = useState(0);

  // ==========================================
  // PAGE STATE
  // ==========================================

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const loggedInPilot = JSON.parse(
    localStorage.getItem("loggedInPilot")
  );

  // ==========================================
  // LOAD BOOKING + FLIGHT
  // ==========================================

  useEffect(() => {
    const loadBooking = async () => {
      if (!loggedInPilot) {
        setError("Please login first.");
        setLoading(false);
        return;
      }

      try {
        // ==========================================
        // LOAD BOOKING
        // ==========================================

        const bookingResponse = await fetch(
          `http://localhost:3000/bookings/${bookingId}`
        );

        if (!bookingResponse.ok) {
          throw new Error("Booking not found.");
        }

        const bookingData = await bookingResponse.json();

        // ==========================================
        // CHECK BOOKING OWNER
        // ==========================================

        if (
          bookingData.pilotId !==
          loggedInPilot.pilotId
        ) {
          throw new Error(
            "You are not authorized to file a PIREP for this booking."
          );
        }

        // ==========================================
        // CHECK BOOKING STATUS
        // ==========================================

        if (bookingData.status !== "Booked") {
          throw new Error(
            "This booking is no longer available for PIREP filing."
          );
        }

        setBooking(bookingData);

        // ==========================================
        // LOAD FLIGHT
        // ==========================================

        const flightResponse = await fetch(
          `http://localhost:3000/flights/${bookingData.flightId}`
        );

        if (!flightResponse.ok) {
          throw new Error(
            "Flight information not found."
          );
        }

        const flightData =
          await flightResponse.json();

        setFlight(flightData);

      } catch (err) {
        console.error(
          "Error loading PIREP:",
          err
        );

        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadBooking();
  }, [bookingId, loggedInPilot?.pilotId]);

  // ==========================================
  // CALCULATE FLIGHT TIME
  // ==========================================

  useEffect(() => {
    if (
      !departureDate ||
      !arrivalDate ||
      !departureTime ||
      !arrivalTime
    ) {
      setFlightTime(0);
      return;
    }

    const departure = new Date(
      `${departureDate}T${departureTime}`
    );

    const arrival = new Date(
      `${arrivalDate}T${arrivalTime}`
    );

    // Invalid date protection
    if (
      Number.isNaN(departure.getTime()) ||
      Number.isNaN(arrival.getTime())
    ) {
      setFlightTime(0);
      return;
    }

    const difference =
      arrival.getTime() -
      departure.getTime();

    const calculatedMinutes = Math.floor(
      difference / (1000 * 60)
    );

    if (calculatedMinutes > 0) {
      setFlightTime(calculatedMinutes);
    } else {
      setFlightTime(0);
    }

  }, [
    departureDate,
    arrivalDate,
    departureTime,
    arrivalTime,
  ]);

  // ==========================================
  // FORMAT FLIGHT TIME
  // ==========================================

  const formatFlightTime = (minutes) => {
    if (!minutes || minutes <= 0) {
      return "0h 0m";
    }

    const hours = Math.floor(
      minutes / 60
    );

    const mins = minutes % 60;

    return `${hours}h ${mins}m`;
  };

  // ==========================================
  // SUBMIT PIREP
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // ==========================================
    // VALIDATE DATES + TIMES
    // ==========================================

    if (
      !departureDate ||
      !arrivalDate ||
      !departureTime ||
      !arrivalTime
    ) {
      setError(
        "Please enter both departure and arrival dates and times."
      );

      return;
    }

    // ==========================================
    // VALIDATE FLIGHT TIME
    // ==========================================

    if (flightTime <= 0) {
      setError(
        "Arrival date and time must be after departure date and time."
      );

      return;
    }

    // ==========================================
    // VALIDATE ORIGINAL FLIGHT TIME
    // ==========================================

    if (!originalFlightTime) {
      setError(
        "Please enter the original scheduled flight time."
      );

      return;
    }

    try {
      setSubmitting(true);

      // ==========================================
      // CREATE PIREP
      // ==========================================

      const pirepData = {
        pilotId: loggedInPilot.pilotId,

        bookingId: booking.id,

        flightId: flight.id,

        // ========================================
        // ACTUAL FLIGHT DATE + TIME
        // ========================================

        departureDate,
        departureTime,

        arrivalDate,
        arrivalTime,

        // ========================================
        // CALCULATED FLIGHT TIME
        // Stored in minutes
        // ========================================

        flightTime,

        // ========================================
        // FLIGHT BONUS
        // ========================================

        flightBonus,

        // ========================================
        // ORIGINAL SCHEDULED TIME
        // ========================================

        originalFlightTime:
          Number(originalFlightTime),

        // ========================================
        // COMMENTS
        // ========================================

        comments,

        // ========================================
        // PIREP STATUS
        // ========================================
        // IMPORTANT:
        // Statistics should NOT be updated here.
        // Manager must approve this PIREP first.
        // ========================================

        status: "Pending Review",

        // ========================================
        // FILED DATE
        // ========================================

        filedDate:
          new Date().toISOString(),
      };

      // ==========================================
      // SEND PIREP TO JSON SERVER
      // ==========================================

      const response = await fetch(
        "http://localhost:3000/pireps",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            pirepData
          ),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to submit PIREP."
        );
      }

      // ==========================================
      // SUCCESS
      // ==========================================

      navigate("/my-flights");

    } catch (err) {
      console.error(
        "Error submitting PIREP:",
        err
      );

      setError(
        err.message ||
        "Something went wrong while submitting the PIREP."
      );

    } finally {
      setSubmitting(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <main className="pirep-page">

        <section className="pirep-header">

          <p>
            Loading flight information...
          </p>

        </section>

      </main>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error && !flight) {
    return (
      <main className="pirep-page">

        <section className="pirep-header">

          <p className="section-tag">
            PILOT OPERATIONS
          </p>

          <h1>
            Unable to File PIREP
          </h1>

          <p>
            {error}
          </p>

          <br />

          <Link to="/my-flights">
            ← Back to My Flights
          </Link>

        </section>

      </main>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <main className="pirep-page">

      {/* ========================================
          HEADER
      ======================================== */}

      <section className="pirep-header">

        <p className="section-tag">
          PILOT OPERATIONS
        </p>

        <h1>
          File PIREP
        </h1>

        <p>
          Submit your Pilot Report for this flight.
        </p>

      </section>


      {/* ========================================
          FLIGHT INFORMATION
      ======================================== */}

      <section className="pirep-flight-card">

        {/* TOP */}

        <div className="pirep-flight-top">

          <div>

            <span>
              FLIGHT
            </span>

            <h2>
              {flight.flightNumber}
            </h2>

          </div>

          <span className="pirep-status">
            ● Ready for PIREP
          </span>

        </div>


        {/* ROUTE */}

        <div className="pirep-route">

          <div>

            <span>
              DEPARTURE
            </span>

            <strong>
              {flight.departure}
            </strong>

          </div>

          <div className="pirep-arrow">
            →
          </div>

          <div>

            <span>
              ARRIVAL
            </span>

            <strong>
              {flight.arrival}
            </strong>

          </div>

        </div>


        {/* FLIGHT INFO */}

        <div className="pirep-flight-info">

          <div>

            <span>
              AIRCRAFT
            </span>

            <strong>
              {flight.aircraft}
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
                .replace("T", " ") + "Z"}
            </strong>

          </div>

        </div>

      </section>


      {/* ========================================
          PIREP FORM
      ======================================== */}

      <form
        className="pirep-form"
        onSubmit={handleSubmit}
      >

        {/* ======================================
            FLIGHT DETAILS
        ====================================== */}

        <section className="pirep-section">

          <div className="pirep-section-title">

            <span>
              01
            </span>

            <div>

              <h2>
                Flight Details
              </h2>

              <p>
                Enter the actual details from your
                completed Infinite Flight session.
              </p>

            </div>

          </div>


          <div className="pirep-fields">

            {/* =================================
                DEPARTURE DATE
            ================================= */}

            <div className="pirep-field">

              <label>
                ACTUAL DEPARTURE DATE
              </label>

              <input
                type="date"
                value={departureDate}
                onChange={(e) =>
                  setDepartureDate(
                    e.target.value
                  )
                }
                required
              />

            </div>


            {/* =================================
                ARRIVAL DATE
            ================================= */}

            <div className="pirep-field">

              <label>
                ACTUAL ARRIVAL DATE
              </label>

              <input
                type="date"
                value={arrivalDate}
                onChange={(e) =>
                  setArrivalDate(
                    e.target.value
                  )
                }
                required
              />

            </div>


            {/* =================================
                DEPARTURE TIME
            ================================= */}

            <div className="pirep-field">

              <label>
                ACTUAL DEPARTURE TIME
              </label>

              <input
                type="time"
                value={departureTime}
                onChange={(e) =>
                  setDepartureTime(
                    e.target.value
                  )
                }
                required
              />

            </div>


            {/* =================================
                ARRIVAL TIME
            ================================= */}

            <div className="pirep-field">

              <label>
                ACTUAL ARRIVAL TIME
              </label>

              <input
                type="time"
                value={arrivalTime}
                onChange={(e) =>
                  setArrivalTime(
                    e.target.value
                  )
                }
                required
              />

            </div>


            {/* =================================
                FLIGHT BONUS
            ================================= */}

            <div className="pirep-field">

              <label>
                FLIGHT BONUS
              </label>

              <select
                value={flightBonus}
                onChange={(e) =>
                  setFlightBonus(
                    e.target.value
                  )
                }
              >

                <option value="No">
                  No
                </option>

                <option value="Yes">
                  Yes
                </option>

              </select>

            </div>


            {/* =================================
                ORIGINAL FLIGHT TIME
            ================================= */}

            <div className="pirep-field">

              <label>
                ORIGINAL FLIGHT TIME (MINUTES)
              </label>

              <input
                type="number"
                min="1"
                placeholder="Example: 165"
                value={originalFlightTime}
                onChange={(e) =>
                  setOriginalFlightTime(
                    e.target.value
                  )
                }
                required
              />

            </div>

          </div>


          {/* =================================
              CALCULATED TIME
          ================================= */}

          <div className="calculated-time">

            <div>

              <span>
                CALCULATED FLIGHT TIME
              </span>

              <strong>
                {formatFlightTime(
                  flightTime
                )}
              </strong>

            </div>

            <div className="calculated-icon">
              ⏱
            </div>

          </div>

        </section>


        {/* ======================================
            COMMENTS
        ====================================== */}

        <section className="pirep-section">

          <div className="pirep-section-title">

            <span>
              02
            </span>

            <div>

              <h2>
                Additional Information
              </h2>

              <p>
                Add any information managers should
                know about this flight.
              </p>

            </div>

          </div>


          <div className="pirep-field">

            <label>
              COMMENTS
            </label>

            <textarea
              rows="6"
              placeholder="Headwinds, IFATC, delays, connection issues, or other review notes..."
              value={comments}
              onChange={(e) =>
                setComments(
                  e.target.value
                )
              }
            />

          </div>

        </section>


        {/* ======================================
            ERROR
        ====================================== */}

        {error && (

          <div
            style={{
              color: "#b42318",
              background: "#fef3f2",
              border: "1px solid #fecdca",
              padding: "12px 15px",
              borderRadius: "6px",
              marginBottom: "20px",
            }}
          >
            {error}
          </div>

        )}


        {/* ======================================
            SUBMIT
        ====================================== */}

        <div className="pirep-submit">

          <Link
            to="/my-flights"
            className="pirep-cancel"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="pirep-submit-button"
            disabled={submitting}
          >

            {submitting
              ? "Submitting..."
              : "Submit PIREP"}

          </button>

        </div>

      </form>

    </main>
  );
}

export default Pirep;