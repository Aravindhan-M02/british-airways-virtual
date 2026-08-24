import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import baLogo from "../assets/ba-logo.jpg";
import baMainLogo from "../assets/ba-main-logo.jpg";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/pilots?email=${encodeURIComponent(
          email.trim()
        )}`
      );

      if (!response.ok) {
        throw new Error("Unable to load pilot account.");
      }

      const pilots = await response.json();

      if (pilots.length === 0) {
        setError("Invalid email or password.");
        return;
      }

      const pilot = pilots[0];

      if (pilot.password !== password) {
        setError("Invalid email or password.");
        return;
      }

      if (pilot.status !== "Active") {
        setError(
          "Your pilot account is not currently active."
        );
        return;
      }

      localStorage.setItem(
        "loggedInPilot",
        JSON.stringify({
          pilotId: pilot.pilotId,
          name: pilot.name,
          email: pilot.email,
          rank: pilot.rank,
        })
      );

      window.dispatchEvent(
        new Event("pilotLogin")
      );

      navigate("/dashboard");

    } catch (error) {
      console.error("Login error:", error);

      setError(
        "Unable to connect to the server."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">

      {/* ==========================================
          FULL BACKGROUND FLIGHT IMAGE
      ========================================== */}

      <img
        src={baLogo}
        alt=""
        className="login-background-image"
      />

      {/* ==========================================
          DARK OVERLAY
      ========================================== */}

      <div className="login-background-overlay"></div>


      {/* ==========================================
          LOGIN CARD
      ========================================== */}

      <section className="login-card">

        <div className="login-card-content">

          <p className="section-tag">
            BRITISH AIRWAYS VIRTUAL
          </p>

          <h1>
            Pilot Login
          </h1>

          <p className="login-description">
            Sign in to access your pilot operations.
          </p>


          <form onSubmit={handleLogin}>

            <div className="login-field">

              <label>
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="Enter your email"
                required
              />

            </div>


            <div className="login-field">

              <label>
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="Enter your password"
                required
              />

            </div>


            {error && (
              <div className="login-error">
                {error}
              </div>
            )}


            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading
                ? "Signing in..."
                : "Sign In"}
            </button>

          </form>


          <div className="login-register">

            <p>
              Don't have a pilot account?
            </p>

            <button
              type="button"
              className="register-link"
              onClick={() =>
                navigate("/register")
              }
            >
              Join BA Virtual
            </button>

          </div>

        </div>

      </section>

    </main>
  );
}

export default Login;
