import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";

function AdminLogin() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = (e) => {

    e.preventDefault();

    if (
      username === "admin" &&
      password === "admin123"
    ) {

      localStorage.setItem(
        "loggedInAdmin",
        JSON.stringify({
          username: "admin"
        })
      );

      navigate("/admin");

    } else {

      alert("Invalid admin credentials.");

    }
  };

  return (
    <main className="admin-login-page">

      <section className="admin-login-card">

        <p className="admin-login-tag">
          BA VIRTUAL MANAGEMENT
        </p>

        <h1>Admin Login</h1>

        <p className="admin-login-description">
          Sign in to access the British Airways
          Virtual management system.
        </p>

        <form
          className="admin-login-form"
          onSubmit={handleLogin}
        >

          <label>
            Username

            <input
              type="text"
              placeholder="Enter admin username"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
              required
            />
          </label>

          <label>
            Password

            <input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />
          </label>

          <button
            type="submit"
            className="admin-login-button"
          >
            Sign In
          </button>

        </form>

        <div className="admin-login-footer">
          Restricted access · BA Virtual Management
        </div>

      </section>

    </main>
  );
}

export default AdminLogin;