import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import checkSession from "./auth/authService";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import MyBookings from "./pages/MyBookings";
import Profile from "./pages/Profile";

// Loader shown while session check runs
function PageLoader() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f8f9fa",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <span
        className="fa fa-spinner fa-spin"
        style={{ fontSize: "48px", color: "#4caf50" }}
      ></span>
      <p style={{ color: "#555a64", fontSize: "16px" }}>Loading...</p>
    </div>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verify = async () => {
      try {
        const result = await checkSession();
        setIsAuthenticated(result.isAuth || false);
      } catch {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    verify();
  }, []);

  if (loading) return <PageLoader />;

  const sharedProps = { isAuthenticated, setIsAuthenticated };

  return (
    <>
      <ToastContainer stacked autoClose={2500} position="top-right" />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home {...sharedProps} />} />
          <Route path="/services" element={<Services {...sharedProps} />} />
          <Route path="/service/:id" element={<ServiceDetail {...sharedProps} />} />
          <Route path="/categories" element={<Services {...sharedProps} />} />

          {/* Guest-only routes */}
          <Route
            path="/login"
            element={
              !isAuthenticated ? (
                <Login setIsAuthenticated={setIsAuthenticated} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/register"
            element={
              !isAuthenticated ? <Register /> : <Navigate to="/" replace />
            }
          />
          <Route
            path="/forgot-password"
            element={
              !isAuthenticated ? (
                <ForgotPassword />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          {/* Protected routes */}
          <Route
            path="/my-bookings"
            element={
              isAuthenticated ? (
                <MyBookings {...sharedProps} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/profile"
            element={
              isAuthenticated ? (
                <Profile {...sharedProps} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* 404 fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
