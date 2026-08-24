import { useEffect, useState } from "react";
import "./Profile.css";

function Profile() {

  const [pilot, setPilot] = useState(null);

  const loggedInPilot = JSON.parse(
    localStorage.getItem("loggedInPilot")
  );

  useEffect(() => {

    const loadPilot = async () => {

      if (!loggedInPilot) {
        return;
      }

      try {

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/pilots?pilotId=${encodeURIComponent(
            loggedInPilot.pilotId
          )}`
        );

        const pilots = await response.json();

        if (pilots.length > 0) {
          setPilot(pilots[0]);
        }

      } catch (error) {

        console.error(
          "Error loading profile:",
          error
        );

      }
    };

    loadPilot();

  }, [loggedInPilot?.pilotId]);


  if (!loggedInPilot) {
    return (
      <main className="profile-page">
        <h1>Please login</h1>
      </main>
    );
  }


  if (!pilot) {
    return (
      <main className="profile-page">
        <p>Loading profile...</p>
      </main>
    );
  }


  return (
    <main className="profile-page">

      <section className="profile-header">

        <p className="section-tag">
          BA VIRTUAL
        </p>

        <h1>
          My Profile
        </h1>

        <p>
          Your pilot information and flight statistics.
        </p>

      </section>


      <section className="profile-card">

        <div className="profile-info">

          <div>
            <span>PILOT ID</span>
            <strong>{pilot.pilotId}</strong>
          </div>

          <div>
            <span>NAME</span>
            <strong>{pilot.name}</strong>
          </div>

          <div>
            <span>EMAIL</span>
            <strong>{pilot.email}</strong>
          </div>

          <div>
            <span>RANK</span>
            <strong>{pilot.rank}</strong>
          </div>

          <div>
            <span>FLIGHT HOURS</span>
            <strong>{pilot.hours || 0}</strong>
          </div>

          <div>
            <span>FLIGHTS</span>
            <strong>{pilot.flights || 0}</strong>
          </div>

          <div>
            <span>STATUS</span>
            <strong>{pilot.status}</strong>
          </div>

          <div>
            <span>JOINED</span>
            <strong>{pilot.joinedDate}</strong>
          </div>

        </div>

      </section>

    </main>
  );
}

export default Profile;