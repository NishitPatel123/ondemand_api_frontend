import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <>
      <section className="w3l-footer-28-main">
        <div className="footer-28">
          <div className="wrapper">
            <div className="d-grid grid-col-4 footer-top-28">
              <div className="footer-list-28">
                <h6 className="footer-title-28">
                  Address Info<span className="line"></span>
                </h6>
                <ul>
                  <li>
                    <p>
                      <span className="fa fa-map-marker"></span> Home
                      maintenance, Ahmedabad, Gujarat, India.
                    </p>
                  </li>
                  <li>
                    <a href="tel:+919999999999">
                      <span className="fa fa-phone"></span> +91-99999-99999
                    </a>
                  </li>
                  <li>
                    <a href="mailto:support@homeservice.com" className="mail">
                      <span className="fa fa-envelope-o"></span>{" "}
                      support@homeservice.com
                    </a>
                  </li>
                </ul>
              </div>
              <div className="footer-list-28">
                <h6 className="footer-title-28">
                  Quick Links<span className="line"></span>
                </h6>
                <ul>
                  <li>
                    <Link to="/">Home</Link>
                  </li>
                  <li>
                    <Link to="/services">Our Services</Link>
                  </li>
                  <li>
                    <Link to="/categories">Categories</Link>
                  </li>
                  <li>
                    <Link to="/my-bookings">My Bookings</Link>
                  </li>
                </ul>
              </div>
              <div className="footer-list-28">
                <h6 className="footer-title-28">
                  Our Services<span className="line"></span>
                </h6>
                <ul className="d-grid footer-column-2">
                  <li>
                    <Link to="/services">Plumbing</Link>
                  </li>
                  <li>
                    <Link to="/services">Carpenter</Link>
                  </li>
                  <li>
                    <Link to="/services">Electrician</Link>
                  </li>
                  <li>
                    <Link to="/services">Wall Painting</Link>
                  </li>
                  <li>
                    <Link to="/services">House Cleaning</Link>
                  </li>
                  <li>
                    <Link to="/services">AC Service</Link>
                  </li>
                </ul>
              </div>
              <div className="footer-list-28">
                <h6 className="footer-title-28">
                  Support<span className="line"></span>
                </h6>
                <ul>
                  <li>
                    <Link to="/register">Create Account</Link>
                  </li>
                  <li>
                    <Link to="/login">Login</Link>
                  </li>
                  <li>
                    <Link to="/forgot-password">Forgot Password</Link>
                  </li>
                  <li>
                    <a href="#support">24/7 Support</a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="midd-footer-28 align-center">
              <div className="main-social-footer-28">
                <a href="#facebook">
                  <span className="fa fa-facebook"></span>
                </a>
                <a href="#twitter">
                  <span className="fa fa-twitter"></span>
                </a>
                <a href="#google">
                  <span className="fa fa-google-plus"></span>
                </a>
                <a href="#linkedin">
                  <span className="fa fa-linkedin"></span>
                </a>
                <a href="#instagram">
                  <span className="fa fa-instagram"></span>
                </a>
              </div>
              <p className="copy-footer-28">
                © 2025 Home Service. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Scroll to top */}
      <button
        onClick={scrollTop}
        id="movetop"
        title="Go to top"
        style={{ display: "block" }}
      >
        <span className="fa fa-angle-up"></span>
      </button>
    </>
  );
}
