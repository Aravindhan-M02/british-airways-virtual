import { useState } from "react";
import "./Register.css";
import baLogo from "../assets/ba-logo.jpg";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const application = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      status: "Pending",
      appliedDate: new Date().toISOString().split("T")[0]
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/applications`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(application)
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit application");
      }

      setFormData({
        name: "",
        email: "",
        password: ""
      });

      setSubmitted(true);

    } catch (error) {
      console.error("Error submitting application:", error);
    }
  };

  return (
    <main className="register-page">

      {/* FULL BACKGROUND IMAGE */}
      <img
        src={baLogo}
        alt=""
        className="register-background-image"
      />

      {/* DARK OVERLAY */}
      <div className="register-background-overlay"></div>

      {/* REGISTER CARD */}
      <section className="register-container">

        <div className="register-card-content">

          <div className="register-header">

            <p className="section-tag">
              JOIN BA VIRTUAL
            </p>

            <h1>
              Become a pilot.
            </h1>

            <p>
              Create your pilot application and begin your
              journey with British Airways Virtual.
            </p>

          </div>

          {submitted ? (

            <div className="application-success">

              <h2>
                Application Submitted ✈️
              </h2>

              <p>
                Thank you for applying to British Airways Virtual.
                Your application has been sent to our administration
                team for review.
              </p>

              <p>
                You will become an active pilot once your application
                has been approved.
              </p>

            </div>

          ) : (

            <form onSubmit={handleSubmit}>

              <div className="form-group">

                <label>
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />

              </div>

              <div className="form-group">

                <label>
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />

              </div>

              <div className="form-group">

                <label>
                  Password
                </label>

                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  required
                />

              </div>

              <button
                type="submit"
                className="register-button"
              >
                Submit Pilot Application
              </button>

            </form>

          )}

        </div>

      </section>

    </main>
  );
}

export default Register;