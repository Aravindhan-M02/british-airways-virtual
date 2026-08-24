import { BrowserRouter, Routes, Route } from "react-router-dom";

import PublicLayout from "./components/PublicLayout";

import Home from "./pages/Home";
import Flights from "./pages/Flights";
import Pilots from "./pages/Pilots";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import PilotProfile from "./pages/PilotProfile";
import FlightDetails from "./pages/FlightDetails";
import MyFlights from "./pages/MyFlights";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./pages/ProtectedRoute";
import Profile from "./pages/Profile";
import Pirep from "./pages/Pirep";

import AdminLogin from "./pages/AdminLogin";
import AdminProtectedRoute from "./pages/AdminProtectedRoute";
import AdminLayout from "./components/AdminLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================================
            PUBLIC / PILOT WEBSITE
        ================================= */}

        <Route element={<PublicLayout />}>

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/about"
            element={<About />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          <Route
            path="/flights"
            element={<Flights />}
          />

          <Route
            path="/pilots"
            element={<Pilots />}
          />

          <Route
            path="/pilots/:pilotId"
            element={<PilotProfile />}
          />

          <Route
            path="/flights/:flightId"
            element={<FlightDetails />}
          />

          {/* Protected pilot pages */}

          <Route element={<ProtectedRoute />}>

            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            <Route
              path="/my-flights"
              element={<MyFlights />}
            />

            <Route
              path="/profile"
              element={<Profile />}
            />

            <Route
              path="/pirep/:bookingId"
              element={<Pirep />}
            />

          </Route>

        </Route>


        {/* ================================
            ADMIN LOGIN
        ================================= */}

        <Route
          path="/admin-login"
          element={<AdminLogin />}
        />


        {/* ================================
            ADMIN SIDE
        ================================= */}

        <Route element={<AdminProtectedRoute />}>

          <Route element={<AdminLayout />}>

            <Route
              path="/admin"
              element={<Admin />}
            />

          </Route>

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
