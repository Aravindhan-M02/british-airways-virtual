import { useEffect, useState } from "react";
import "./Admin.css";

function Admin() {
  const [pilots, setPilots] = useState([]);
  const [applications, setApplications] = useState([]);
  const [flights, setFlights] = useState([]);
  const [pireps, setPireps] = useState([]);

  const [pirepComments, setPirepComments] = useState({});

  const [loading, setLoading] = useState(true);

  // ==========================================
  // LOAD ADMIN DATA
  // ==========================================

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      setLoading(true);

      const [
        pilotsResponse,
        applicationsResponse,
        flightsResponse,
        pirepsResponse,
      ] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/pilots`),
fetch(`${import.meta.env.VITE_API_URL}/applications`),
fetch(`${import.meta.env.VITE_API_URL}/flights`),
fetch(`${import.meta.env.VITE_API_URL}/pireps`),
      ]);

      if (
        !pilotsResponse.ok ||
        !applicationsResponse.ok ||
        !flightsResponse.ok ||
        !pirepsResponse.ok
      ) {
        throw new Error("Failed to load admin data.");
      }

      const pilotsData = await pilotsResponse.json();
      const applicationsData = await applicationsResponse.json();
      const flightsData = await flightsResponse.json();
      const pirepsData = await pirepsResponse.json();

      setPilots(pilotsData);

      // Only pending applications
      setApplications(
        applicationsData.filter(
          (application) => application.status === "Pending"
        )
      );

      setFlights(flightsData);

      // Only PIREPs waiting for review
      setPireps(
        pirepsData.filter(
          (pirep) => pirep.status === "Pending Review"
        )
      );
    } catch (error) {
      console.error("Error loading admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // APPROVE PILOT APPLICATION
  // ==========================================

  const approveApplication = async (application) => {
    try {
      const pilotResponse = await fetch(
  `${import.meta.env.VITE_API_URL}/pilots`
);

      const pilotsData = await pilotResponse.json();

      // Generate next pilot number
      const usedNumbers = pilotsData
        .map((pilot) => {
          const match = pilot.pilotId?.match(/^BAW(\d+)$/);

          return match ? Number(match[1]) : 0;
        })
        .filter((number) => number > 0);

      const nextPilotNumber =
        usedNumbers.length > 0
          ? Math.max(...usedNumbers) + 1
          : 1;

      const pilotId = `BAW${String(nextPilotNumber).padStart(3, "0")}`;

      // ==========================================
      // CREATE PILOT
      // ==========================================

      const newPilot = {
        pilotId,
        name: application.name,
        email: application.email,
        password: application.password,

        rank: "Cadet",
        hours: 0,
        flights: 0,

        status: "Active",

        joinedDate: new Date()
          .toISOString()
          .split("T")[0],
      };

      const createPilotResponse = await fetch(`${import.meta.env.VITE_API_URL}/pilots`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(newPilot),
        }
      );

      if (!createPilotResponse.ok) {
        throw new Error(
          "Failed to create pilot account."
        );
      }

      // ==========================================
      // UPDATE APPLICATION
      // ==========================================

      const updateApplicationResponse = await fetch(
  `${import.meta.env.VITE_API_URL}/applications/${application.id}`,
  {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            status: "Approved",
          }),
        }
      );

      if (!updateApplicationResponse.ok) {
        throw new Error(
          "Pilot created but application status could not be updated."
        );
      }

      // Remove from pending list
      setApplications((currentApplications) =>
        currentApplications.filter(
          (item) => item.id !== application.id
        )
      );

      // Add pilot to screen
      setPilots((currentPilots) => [
        ...currentPilots,
        newPilot,
      ]);
    } catch (error) {
      console.error(
        "Error approving application:",
        error
      );

      alert(error.message);
    }
  };

  // ==========================================
  // REJECT PILOT APPLICATION
  // ==========================================

  const rejectApplication = async (application) => {
    try {
      const response = await fetch(
  `${import.meta.env.VITE_API_URL}/applications/${application.id}`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            status: "Rejected",
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to reject application."
        );
      }

      // Remove from pending screen
      setApplications((currentApplications) =>
        currentApplications.filter(
          (item) => item.id !== application.id
        )
      );
    } catch (error) {
      console.error(
        "Error rejecting application:",
        error
      );

      alert(error.message);
    }
  };

  // ==========================================
  // DELETE PILOT
  // ==========================================

  const deletePilot = async (pilot) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${pilot.name} (${pilot.pilotId})?`
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
  `${import.meta.env.VITE_API_URL}/pilots/${pilot.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to delete pilot."
        );
      }

      setPilots((currentPilots) =>
        currentPilots.filter(
          (item) => item.id !== pilot.id
        )
      );
    } catch (error) {
      console.error(
        "Error deleting pilot:",
        error
      );

      alert(error.message);
    }
  };

  // ==========================================
  // APPROVE PIREP
  // ==========================================

  const approvePirep = async (pirep) => {
    try {
      // ==========================================
      // GET MANAGER COMMENT
      // ==========================================

      const comment =
        pirepComments[pirep.id]?.trim() || "";

      // ==========================================
      // GET PILOT
      // ==========================================

      const pilotResponse = await fetch(
  `${import.meta.env.VITE_API_URL}/pilots?pilotId=${encodeURIComponent(
    pirep.pilotId
  )}`
);

      if (!pilotResponse.ok) {
        throw new Error(
          "Failed to find pilot."
        );
      }

      const pilotsData =
        await pilotResponse.json();

      if (pilotsData.length === 0) {
        throw new Error(
          "Pilot not found."
        );
      }

      const pilot = pilotsData[0];

      // ==========================================
      // UPDATE PIREP
      // ==========================================

      const pirepResponse = await fetch(
  `${import.meta.env.VITE_API_URL}/pireps/${pirep.id}`,
  {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            status: "Approved",
            reviewComment: comment,
          }),
        }
      );

      if (!pirepResponse.ok) {
        throw new Error(
          "Failed to approve PIREP."
        );
      }

      // ==========================================
      // CALCULATE PILOT STATISTICS
      // ==========================================

      const currentHours =
        Number(pilot.hours) || 0;

      const currentFlights =
        Number(pilot.flights) || 0;

      const flightHours =
        Number(pirep.flightTime) / 60;

      const updatedHours =
        currentHours + flightHours;

      // ==========================================
      // UPDATE PILOT
      // ==========================================

      const updatePilotResponse =
        await fetch(
  `${import.meta.env.VITE_API_URL}/pilots/${pilot.id}`,
  {
            method: "PATCH",

            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify({
              hours: Number(
                updatedHours.toFixed(2)
              ),

              flights:
                currentFlights + 1,
            }),
          }
        );

      if (!updatePilotResponse.ok) {
        throw new Error(
          "PIREP approved but pilot statistics could not be updated."
        );
      }

      // ==========================================
      // COMPLETE BOOKING
      // ==========================================

      const bookingResponse =
        await fetch(
  `${import.meta.env.VITE_API_URL}/bookings/${pirep.bookingId}`,
  {
            method: "PATCH",

            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify({
              status: "Completed",
            }),
          }
        );

      if (!bookingResponse.ok) {
        throw new Error(
          "Booking could not be completed."
        );
      }

      // ==========================================
      // UPDATE SCREEN
      // ==========================================

      setPireps((currentPireps) =>
        currentPireps.filter(
          (item) => item.id !== pirep.id
        )
      );

      setPilots((currentPilots) =>
        currentPilots.map((item) =>
          item.id === pilot.id
            ? {
                ...item,

                hours: Number(
                  updatedHours.toFixed(2)
                ),

                flights:
                  currentFlights + 1,
              }
            : item
        )
      );

      // Remove stored comment from local state
      setPirepComments((currentComments) => {
        const updated = {
          ...currentComments,
        };

        delete updated[pirep.id];

        return updated;
      });
    } catch (error) {
      console.error(
        "Error approving PIREP:",
        error
      );

      alert(error.message);
    }
  };

  // ==========================================
  // DENY PIREP
  // ==========================================

  const rejectPirep = async (pirep) => {
    try {
      // ==========================================
      // GET MANAGER COMMENT
      // ==========================================

      const comment =
        pirepComments[pirep.id]?.trim() || "";

      // ==========================================
      // DENY PIREP
      // ==========================================

      const pirepResponse = await fetch(
  `${import.meta.env.VITE_API_URL}/pireps/${pirep.id}`,
  {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            status: "Denied",
            reviewComment: comment,
          }),
        }
      );

      if (!pirepResponse.ok) {
        throw new Error(
          "Failed to deny PIREP."
        );
      }

      // ==========================================
      // RELEASE THE BOOKING
      // ==========================================
      //
      // Denied means the pilot is free to
      // book another flight.
      //
      // We keep the booking record as "Denied"
      // so the pilot can still see the previous
      // flight and manager comment.
      //

      const bookingResponse = await fetch(
  `${import.meta.env.VITE_API_URL}/bookings/${pirep.bookingId}`,
  {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            status: "Denied",
          }),
        }
      );

      if (!bookingResponse.ok) {
        throw new Error(
          "PIREP was denied but booking could not be released."
        );
      }

      // ==========================================
      // REMOVE FROM ADMIN PENDING LIST
      // ==========================================

      setPireps((currentPireps) =>
        currentPireps.filter(
          (item) => item.id !== pirep.id
        )
      );

      // Remove stored comment from local state
      setPirepComments((currentComments) => {
        const updated = {
          ...currentComments,
        };

        delete updated[pirep.id];

        return updated;
      });
    } catch (error) {
      console.error(
        "Error denying PIREP:",
        error
      );

      alert(error.message);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <main className="admin-page">
        <p>Loading admin dashboard...</p>
      </main>
    );
  }

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <main className="admin-page">

      {/* HEADER */}

      <section className="admin-header">

        <p className="section-tag">
          BA VIRTUAL MANAGEMENT
        </p>

        <h1>
          Admin Dashboard
        </h1>

        <p>
          Manage pilots, applications,
          PIREPs and flight operations.
        </p>

      </section>

      {/* STATS */}

      <section className="admin-stats">

        <div className="admin-stat">

          <span>
            ACTIVE PILOTS
          </span>

          <strong>
            {
              pilots.filter(
                (pilot) =>
                  pilot.status === "Active"
              ).length
            }
          </strong>

        </div>

        <div className="admin-stat">

          <span>
            PENDING APPLICATIONS
          </span>

          <strong>
            {applications.length}
          </strong>

        </div>

        <div className="admin-stat">

          <span>
            PENDING PIREPs
          </span>

          <strong>
            {pireps.length}
          </strong>

        </div>

        <div className="admin-stat">

          <span>
            SCHEDULED FLIGHTS
          </span>

          <strong>
            {flights.length}
          </strong>

        </div>

      </section>

      {/* PILOT APPLICATIONS */}

      <section className="applications-section">

        <div className="applications-heading">

          <p className="section-tag">
            PILOT RECRUITMENT
          </p>

          <h2>
            Pending Applications
          </h2>

        </div>

        <div className="applications-list">

          {applications.length === 0 ? (

            <div className="no-applications">

              <p>
                No pending applications.
              </p>

            </div>

          ) : (

            applications.map(
              (application) => (

                <article
                  className="application-card"
                  key={application.id}
                >

                  <div className="application-info">

                    <h3>
                      {application.name}
                    </h3>

                    <p>
                      {application.email}
                    </p>

                    <span>
                      Applied:{" "}
                      {application.appliedDate}
                    </span>

                  </div>

                  <div className="application-status pending">
                    Pending
                  </div>

                  <div className="application-actions">

                    <button
                      className="approve-button"
                      onClick={() =>
                        approveApplication(
                          application
                        )
                      }
                    >
                      Approve
                    </button>

                    <button
                      className="reject-button"
                      onClick={() =>
                        rejectApplication(
                          application
                        )
                      }
                    >
                      Reject
                    </button>

                  </div>

                </article>

              )
            )

          )}

        </div>

      </section>

      {/* PENDING PIREPs */}

      <section className="applications-section pirep-admin-section">

        <div className="applications-heading">

          <p className="section-tag">
            FLIGHT OPERATIONS
          </p>

          <h2>
            Pending PIREPs
          </h2>

        </div>

        <div className="applications-list">

          {pireps.length === 0 ? (

            <div className="no-applications">

              <p>
                No PIREPs waiting for review.
              </p>

            </div>

          ) : (

            pireps.map((pirep) => {

              const pilot =
                pilots.find(
                  (item) =>
                    item.pilotId ===
                    pirep.pilotId
                );

              return (

                <article
                  className="application-card pirep-card"
                  key={pirep.id}
                >

                  <div className="application-info">

                    <h3>
                      {pilot
                        ? pilot.name
                        : pirep.pilotId}
                    </h3>

                    <p>
                      Pilot ID:{" "}
                      {pirep.pilotId}
                    </p>

                    <span>
                      Flight time:{" "}
                      {Math.floor(
                        Number(
                          pirep.flightTime
                        ) / 60
                      )}
                      h{" "}
                      {Number(
                        pirep.flightTime
                      ) % 60}
                      m
                    </span>

                    <span>
                      Filed:{" "}
                      {pirep.filedDate
                        ? new Date(
                            pirep.filedDate
                          ).toLocaleString()
                        : "—"}
                    </span>

                  </div>

                  <div className="application-status pending">
                    Pending Review
                  </div>

                  {/* MANAGER COMMENT */}

                  <div className="pirep-review">

                    <textarea
                      className="pirep-comment-input"
                      placeholder="Add a comment for the pilot..."
                      value={
                        pirepComments[pirep.id] || ""
                      }
                      onChange={(event) =>
                        setPirepComments(
                          (current) => ({
                            ...current,

                            [pirep.id]:
                              event.target.value,
                          })
                        )
                      }
                    />

                    <div className="application-actions">

                      <button
                        className="approve-button"
                        onClick={() =>
                          approvePirep(pirep)
                        }
                      >
                        Approve
                      </button>

                      <button
                        className="reject-button"
                        onClick={() =>
                          rejectPirep(pirep)
                        }
                      >
                        Deny
                      </button>

                    </div>

                  </div>

                </article>

              );

            })

          )}

        </div>

      </section>

      {/* PILOT MANAGEMENT */}

      <section className="applications-section pilot-management-section">

        <div className="applications-heading">

          <p className="section-tag">
            PILOT OPERATIONS
          </p>

          <h2>
            Active Pilots
          </h2>

        </div>

        <div className="applications-list">

          {pilots.length === 0 ? (

            <div className="no-applications">

              <p>
                No pilots registered.
              </p>

            </div>

          ) : (

            pilots.map((pilot) => (

              <article
                className="application-card pilot-admin-card"
                key={pilot.id}
              >

                <div className="application-info">

                  <h3>
                    {pilot.name}
                  </h3>

                  <p>
                    {pilot.pilotId}
                  </p>

                  <span>
                    {pilot.email}
                  </span>

                  <span>
                    Rank: {pilot.rank}
                  </span>

                  <span>
                    Hours:{" "}
                    {Number(
                      pilot.hours || 0
                    ).toFixed(2)}
                  </span>

                  <span>
                    Flights:{" "}
                    {pilot.flights || 0}
                  </span>

                </div>

                <div
                  className={
                    pilot.status === "Active"
                      ? "application-status active"
                      : "application-status"
                  }
                >
                  {pilot.status}
                </div>

                <div className="application-actions">

                  <button
                    className="delete-pilot-button"
                    onClick={() =>
                      deletePilot(pilot)
                    }
                  >
                    Delete Pilot
                  </button>

                </div>

              </article>

            ))

          )}

        </div>

      </section>

    </main>
  );
}

export default Admin;
