import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { login } from "../services/api";

export default function Login({ setIsAuthenticated }) {
  const [data, setData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(data);
      if (res.data.success) {
        Cookies.set("token", res.data.token, { expires: 7, sameSite: "Lax" });
        setIsAuthenticated(true);
        toast.success("Logged in successfully!");
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w3l-forms-17">
      <div id="forms-17_sur">
        <div className="wrapper">
          <div className="forms-17-top">
            {/* Left info panel */}
            <div className="forms-17-text">
              <div className="top">
                <span className="fa fa-user"></span>
                <h4>Hey, welcome back</h4>
                <p>Login to your account now</p>
              </div>
              <ul className="bottom-list">
                <li>
                  <span className="fa fa-check"></span> Browse and book from
                  100+ professional home services.
                </li>
                <li>
                  <span className="fa fa-check"></span> Track your bookings in
                  real-time and manage appointments.
                </li>
                <li>
                  <span className="fa fa-check"></span> Secure payments via
                  Razorpay — multiple payment methods.
                </li>
              </ul>
            </div>

            {/* Right form panel */}
            <div className="forms-17-form">
              <div className="form-17-tp">
                <h6>Login</h6>
                <form onSubmit={handleSubmit} className="signin-form">
                  <div className="form-input">
                    <input
                      type="email"
                      name="email"
                      placeholder="Your email address"
                      autoComplete="off"
                      value={data.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-input">
                    <input
                      type="password"
                      name="password"
                      placeholder="Your password"
                      autoComplete="new-password"
                      value={data.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="forget">
                    <Link to="/forgot-password" className="forget-pas">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="align-left-right">
                    <button className="btn" type="submit" disabled={loading}>
                      {loading ? "Logging in..." : "Login"}
                    </button>
                  </div>
                  <div className="bottom-login">
                    <p>
                      Not a customer? <Link to="/register">Sign Up</Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="btn btn-home text-center">
            <Link to="/">
              Back to home <span className="fa fa-long-arrow-right"></span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
