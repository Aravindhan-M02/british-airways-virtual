import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Flights.css";

function Flights() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/flights")
      .then((response) => response.json())
      .then((data) => {
        setFlights(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading flights:", error);
        setLoading(false);
      });
  }, []);

  return (
    <main className="flights-page">

      <section className="flights-header">

        <p className="section-tag">
          BA VIRTUAL OPERATIONS
        </p>

        <h1>Flight Schedule</h1>

        <p>
          Explore the current British Airways Virtual
          flight network and available operations.
        </p>

      </section>

      <section className="flights-content">

        {loading ? (
          <div className="flights-message">
            Loading flight schedule...
          </div>
        ) : flights.length === 0 ? (
          <div className="flights-message">
            No flights currently available.
          </div>
        ) : (

          <div className="flights-table">

            <div className="flight-table-header">
              <span>FLIGHT</span>
              <span>ROUTE</span>
              <span>AIRCRAFT</span>
              <span>STATUS</span>
              <span></span>
            </div>

            {flights.map((flight) => (

              <div
                className="flight-row"
                key={flight.id}
              >

                <div className="flight-number">
                  {flight.flightNumber}
                </div>

                <div className="flight-route">

                  <strong>
                    {flight.departure}
                  </strong>

                  <span>→</span>

                  <strong>
                    {flight.arrival}
                  </strong>

                </div>

                <div className="flight-aircraft">
                  {flight.aircraft}
                </div>

                <div>
                  <span className="flight-status">
                    {flight.status || "Scheduled"}
                  </span>
                </div>

                <Link
                  to={`/flights/${flight.id}`}
                  className="flight-view"
                >
                  View →
                </Link>

              </div>

            ))}

          </div>

        )}

      </section>

    </main>
  );
}

export default Flights;