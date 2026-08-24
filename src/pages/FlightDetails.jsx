import { useEffect, useState } from "react";
import "./FlightDetails.css";
import {
  Link,
  useParams,
  useLocation,
  useNavigate,
} from "react-router-dom";

function FlightDetails() {
  const { flightId } = useParams();

  const location = useLocation();
  const navigate = useNavigate();

  const fromMyFlights =
    location.state?.fromMyFlights;

  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);

  const [booking, setBooking] = useState(null);
  const [bookingLoading, setBookingLoading] =
    useState(false);

  const [checkingBooking, setCheckingBooking] =
    useState(true);

  const [activeBooking, setActiveBooking] =
    useState(null);

  const [bookingSuccess, setBookingSuccess] =
    useState(false);

  // ==========================================
  // GET LOGGED-IN PILOT
  // ==========================================

  const loggedInPilot = JSON.parse(
    localStorage.getItem("loggedInPilot")
  );

  // ==========================================
  // 1. GET FLIGHT DETAILS
  // ==========================================

  useEffect(() => {
    const loadFlight = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/flights/${flightId}`
        );

        if (!response.ok) {
          throw new Error("Flight not found");
        }

        const data = await response.json();

        setFlight(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadFlight();
  }, [flightId]);

  // ==========================================
  // 2. CHECK BOOKING STATUS
  // ==========================================

  useEffect(() => {
    const checkBookingStatus = async () => {
      if (!loggedInPilot) {
        setCheckingBooking(false);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:3000/bookings?pilotId=${encodeURIComponent(
            loggedInPilot.pilotId
          )}`
        );

        if (!response.ok) {
          throw new Error(
            "Failed to fetch bookings"
          );
        }

        const data = await response.json();

        // ==========================================
        // ACTIVE BOOKING STATUSES
        // ==========================================
        //
        // Booked:
        // Pilot currently has the flight.
        //
        // Pending Review:
        // PIREP is being reviewed.
        //
        // Completed:
        // Historical flight. Does not block booking.
        //
        // Denied:
        // PIREP was denied. Does not block booking.
        //

        const activeStatuses = [
          "Booked",
          "Pending Review",
        ];

        // ==========================================
        // THIS FLIGHT
        // ==========================================

        const currentBooking = data.find(
          (item) =>
            String(item.flightId) ===
              String(flightId) &&
            activeStatuses.includes(
              item.status
            )
        );

        // ==========================================
        // ANY ACTIVE FLIGHT FOR PILOT
        // ==========================================

        const activeBookingForPilot =
          data.find((item) =>
            activeStatuses.includes(
              item.status
            )
          );

        setBooking(
          currentBooking || null
        );

        setActiveBooking(
          activeBookingForPilot || null
        );

      } catch (error) {
        console.error(
          "Error checking booking status:",
          error
        );
      } finally {
        setCheckingBooking(false);
      }
    };

    checkBookingStatus();

  }, [
    flightId,
    loggedInPilot?.pilotId,
  ]);

  // ==========================================
  // 3. BOOK FLIGHT
  // ==========================================

  const bookFlight = async () => {

    // Make sure pilot is logged in
    if (!loggedInPilot) {
      alert(
        "Please login to book a flight."
      );
      return;
    }

    // Prevent another active booking
    if (activeBooking) {
      alert(
        `You already have an active flight: ${activeBooking.flightId}`
      );
      return;
    }

    // Prevent duplicate booking of this flight
    if (booking) {
      alert(
        "You already have this flight booked."
      );
      return;
    }

    setBookingLoading(true);
    setBookingSuccess(false);

    try {

      const response = await fetch(
        "http://localhost:3000/bookings",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            flightId: flight.id,
            pilotId: loggedInPilot.pilotId,
            status: "Booked",
            bookedDate:
              new Date().toISOString(),
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to book flight"
        );
      }

      const newBooking =
        await response.json();

      // ==========================================
      // UPDATE UI
      // ==========================================

      setBooking(newBooking);

      setActiveBooking(newBooking);

      setBookingSuccess(true);

    } catch (error) {

      console.error(
        "Booking error:",
        error
      );

      alert(
        "Unable to book this flight."
      );

    } finally {

      setBookingLoading(false);

    }
  };

  // ==========================================
  // 4. LOADING
  // ==========================================

  if (loading) {
    return (
      <main className="flight-details-page">
        <p>Loading flight...</p>
      </main>
    );
  }

  // ==========================================
  // 5. FLIGHT NOT FOUND
  // ==========================================

  if (!flight) {
    return (
      <main className="flight-details-page">

        <div className="flight-not-found">

          <h1>
            Flight not found
          </h1>

          <Link to="/flights">
            ← Back to Flight Schedule
          </Link>

        </div>

      </main>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <main className="flight-details-page">

      {/* HEADER */}

      <section className="flight-details-header">

        {fromMyFlights ? (

          <button
            className="flight-back-link"
            onClick={() =>
              navigate(-1)
            }
          >
            ← Back to My Flights
          </button>

        ) : (

          <Link
            to="/flights"
            className="flight-back-link"
          >
            ← Back to Flight Schedule
          </Link>

        )}

        <p className="section-tag">
          BA VIRTUAL OPERATIONS
        </p>

        <div className="flight-detail-number">
          {flight.flightNumber}
        </div>

        <h1>

          {flight.departure}

          <span> → </span>

          {flight.arrival}

        </h1>

        <span className="flight-detail-status">
          ● {flight.status || "Scheduled"}
        </span>

      </section>


      {/* FLIGHT CARD */}

      <section className="flight-detail-card">

        {/* ROUTE */}

        <div className="flight-route-display">

          <div className="airport">

            <span>
              DEPARTURE
            </span>

            <strong>
              {flight.departure}
            </strong>

          </div>


          <div className="route-line">
            ✈
          </div>


          <div className="airport">

            <span>
              ARRIVAL
            </span>

            <strong>
              {flight.arrival}
            </strong>

          </div>

        </div>


        {/* FLIGHT INFORMATION */}

        <div className="flight-information">

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
              STATUS
            </span>

            <strong>
              {flight.status ||
                "Scheduled"}
            </strong>

          </div>


          <div>

            <span>
              FLIGHT NUMBER
            </span>

            <strong>
              {flight.flightNumber}
            </strong>

          </div>

        </div>


        {/* BOOKING STATUS */}

        {checkingBooking ? (

          <div className="booking-checking">
            Checking booking status...
          </div>

        ) : bookingSuccess ? (

          <div className="booking-success">
            ✓ Flight booked successfully
          </div>

        ) : booking ? (

          <div className="booking-success">
            ✓ Flight already booked
          </div>

        ) : activeBooking ? (

          <div className="booking-warning">

            You already have an active flight:

            {" "}

            <strong>
              {activeBooking.flightId}
            </strong>

          </div>

        ) : (

          <button
            className="book-flight-button"
            onClick={bookFlight}
            disabled={bookingLoading}
          >

            {bookingLoading
              ? "Booking..."
              : "Book Flight"}

          </button>

        )}

      </section>

    </main>
  );
}

export default FlightDetails;