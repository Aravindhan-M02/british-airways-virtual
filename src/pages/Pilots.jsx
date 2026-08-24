import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Pilots.css";

function Pilots() {
  const [pilots, setPilots] = useState([]);
  const [openDepartment, setOpenDepartment] = useState(null);

  /*
   * ==========================================
   * BA VIRTUAL STAFF
   * ==========================================
   */

  const staffDepartments = [
    {
      id: "executive",
      title: "Executive Management",
      description:
        "Responsible for the overall direction, leadership and development of British Airways Virtual.",
      members: [
        {
          name: "Aravindh",
          role: "CEO",
        },
        {
          name: "Giri",
          role: "Vice President",
        },
        {
          name: "Dinesh",
          role: "Deputy Vice President",
        },
      ],
    },

    {
      id: "operations",
      title: "Flight Operations",
      description:
        "Responsible for flight operations, scheduling and maintaining the standards of the BA Virtual network.",
      members: [
        {
          name: "Dinesh",
          role: "Operations Director",
        },
        {
          name: "Giri",
          role: "Operations Director",
        },
        {
          name: "Chriz",
          role: "Operations Manager",
        },
        {
          name: "Louis",
          role: "Flight Operations Coordinator",
        },
      ],
    },

    {
      id: "training",
      title: "Training Department",
      description:
        "Responsible for pilot training, operational standards and helping pilots improve their aviation skills.",
      members: [
        {
          name: "Tintin",
          role: "Training Manager",
        },
        {
          name: "Captain Dreamliner",
          role: "Training Captain",
        },
      ],
    },
  ];

  /*
   * ==========================================
   * LOAD PILOTS
   * ==========================================
   */

  useEffect(() => {
    fetch("http://localhost:3000/pilots")
      .then((response) => response.json())
      .then((data) => setPilots(data))
      .catch((error) =>
        console.error("Error loading pilots:", error)
      );
  }, []);

  /*
   * ==========================================
   * DEPARTMENT TOGGLE
   * ==========================================
   */

  const handleDepartmentClick = (departmentId) => {
    setOpenDepartment(
      openDepartment === departmentId ? null : departmentId
    );
  };

  return (
    <main className="pilots-page">

      {/* ==========================================
          HEADER
      ========================================== */}

      <section className="pilots-header">

        <p className="section-tag">
          BA VIRTUAL
        </p>

        <h1>
          Our People
        </h1>

        <p>
          Meet the staff and pilots operating across
          the British Airways Virtual network.
        </p>

      </section>


      {/* ==========================================
          STAFF SECTION
      ========================================== */}

      <section className="staff-section">

        <div className="roster-section-header">

          <div>

            <p className="section-tag">
              OUR TEAM
            </p>

            <h2>
              Staff Members
            </h2>

            <p>
              Meet the people responsible for managing,
              operating and developing BA Virtual.
            </p>

          </div>

        </div>


        {/* ==========================================
            STAFF DEPARTMENTS
        ========================================== */}

        <div className="staff-departments">

          {staffDepartments.map((department) => (

            <div
              className={`department-card ${
                openDepartment === department.id
                  ? "department-open"
                  : ""
              }`}
              key={department.id}
            >

              {/* Department Header */}

              <button
                type="button"
                className="department-button"
                onClick={() =>
                  handleDepartmentClick(department.id)
                }
              >

                <div className="department-info">

                  <span className="department-label">
                    BA VIRTUAL
                  </span>

                  <h3>
                    {department.title}
                  </h3>

                  <p>
                    {department.description}
                  </p>

                </div>

                <div className="department-arrow">
                  {openDepartment === department.id
                    ? "−"
                    : "+"}
                </div>

              </button>


              {/* Department Members */}

              {openDepartment === department.id && (

                <div className="department-members">

                  {department.members.map((member, index) => (

                    <div
                      className="staff-member"
                      key={index}
                    >

                      <div className="staff-avatar">
                        {member.name.charAt(0)}
                      </div>

                      <div className="staff-member-info">

                        <span className="staff-label">
                          STAFF
                        </span>

                        <h4>
                          {member.name}
                        </h4>

                        <p>
                          {member.role}
                        </p>

                      </div>

                    </div>

                  ))}

                </div>

              )}

            </div>

          ))}

        </div>

      </section>


      {/* ==========================================
          PILOT SECTION
      ========================================== */}

      <section className="pilots-content">

        <div className="roster-section-header">

          <div>

            <p className="section-tag">
              FLIGHT OPERATIONS
            </p>

            <h2>
              Pilot Roster
            </h2>

            <p>
              Meet the pilots operating across the
              British Airways Virtual network.
            </p>

          </div>


          <div className="pilot-count">

            <strong>
              {pilots.length}
            </strong>

            <span>
              PILOTS
            </span>

          </div>

        </div>


        {/* ==========================================
            PILOT GRID
        ========================================== */}

        <div className="pilots-grid">

          {pilots.map((pilot) => (

            <Link
              to={`/pilots/${pilot.pilotId}`}
              className="pilot-card"
              key={pilot.id}
            >

              <div className="pilot-card-top">

                <div>

                  <span className="pilot-id">
                    {pilot.pilotId}
                  </span>

                  <h3>
                    {pilot.name}
                  </h3>

                  <p>
                    {pilot.rank}
                  </p>

                </div>


                <span className="pilot-status">
                  ● {pilot.status}
                </span>

              </div>


              {/* Pilot Statistics */}

              <div className="pilot-stats">

                <div>

                  <strong>
                    {pilot.hours || 0}
                  </strong>

                  <span>
                    HOURS
                  </span>

                </div>


                <div>

                  <strong>
                    {pilot.flights || 0}
                  </strong>

                  <span>
                    FLIGHTS
                  </span>

                </div>

              </div>


              {/* Joined Date */}

              <div className="pilot-footer">

                Joined{" "}

                {pilot.joinedDate
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

              </div>

            </Link>

          ))}

        </div>


        {/* ==========================================
            EMPTY STATE
        ========================================== */}

        {pilots.length === 0 && (

          <div className="empty-pilots">

            <h3>
              No pilots found
            </h3>

            <p>
              The pilot roster is currently empty.
            </p>

          </div>

        )}

      </section>

    </main>
  );
}

export default Pilots;