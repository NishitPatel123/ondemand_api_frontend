import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../services/api";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

export default function Header({ isAuthenticated, setIsAuthenticated }) {
  const [navOpen, setNavOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      Cookies.remove("token");
      setIsAuthenticated(false);
      toast.success("Logged out successfully!");
      navigate("/");
    } catch {
      toast.error("Logout failed!");
    }
  };

  const isActive = (path) => (location.pathname === path ? "active-link" : "");

  return (
    <div className="w3l-headers-9">
      <header>
        <div className="wrapper">
          <div className="header">
            <div>
              <h1>
                <Link to="/" className="logo">
                  Home <span>Service</span>
                </Link>
              </h1>
            </div>
            <div className="bottom-menu-content">
              <input
                type="checkbox"
                id="nav"
                checked={navOpen}
                onChange={() => setNavOpen(!navOpen)}
              />
              <label htmlFor="nav" className="menu-bar"></label>
              <nav>
                <ul className="menu">
                  <li>
                    <Link to="/" className={`link-nav ${isActive("/")}`}>
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/services"
                      className={`link-nav ${isActive("/services")}`}
                    >
                      Services
                    </Link>
                  </li>

                  {/* <li>
                    <Link to="/categories" className={`link-nav ${isActive("/categories")}`}>
                      Categories
                    </Link>
                  </li> */}
                  {isAuthenticated ? (
                    <>
                      <li>
                        <Link
                          to="/profile"
                          className={`link-nav ${isActive("/services")}`}
                        >
                          My Profile
                        </Link>
                      </li>
                      <li>
                        <Link
                          onClick={handleLogout}
                          className={`link-nav ${isActive("/services")}`}
                        >
                          Logout
                        </Link>
                      </li>
                    </>
                  ) : (
                    <>
                      <li>
                        <Link
                          to="/login"
                          className={`link-nav ${isActive("/login")}`}
                        >
                          Login
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/register"
                          className={`link-nav ${isActive("/register")}`}
                        >
                          Register
                        </Link>
                      </li>
                    </>
                  )}
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
