import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../common/Header";
import Footer from "../common/Footer";
import { getCategories, getServices, getFeedbacks } from "../services/api";

export default function Home({ isAuthenticated, setIsAuthenticated }) {
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const slides = [
    {
      tag: "We provide quality service",
      title: "Home Maintenance and Services for you",
      para: "Professional home services delivered at your doorstep. Book trusted experts for all your home needs.",
    },
    {
      tag: "We provide quality service",
      title: "We are Professional and provide Repair Services",
      para: "Expert technicians available 24/7 for all types of home repairs and maintenance work.",
    },
    {
      tag: "We provide quality service",
      title: "The Best Company to provide Home Services",
      para: "100% satisfaction guaranteed. Experienced professionals with verified credentials.",
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, svcRes, fbRes] = await Promise.all([
          getCategories(),
          getServices(),
          getFeedbacks(),
        ]);
        setCategories(catRes.data.data || []);
        setServices((svcRes.data.data || []).slice(0, 8));
        setFeedbacks((fbRes.data.data || []).slice(0, 3));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    const timer = setInterval(
      () => setCurrentSlide((prev) => (prev + 1) % slides.length),
      4000
    );
    return () => clearInterval(timer);
  }, []);

  const BACKEND = "http://localhost:8000";

  return (
    <>
      <Header
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
      />

      {/* ── Hero Slider ────────────────────────────────────────────── */}
      <section className="w3l-covers-9-main">
        <div className="covers-9">
          <div
            className="csslider infinity"
            id="slider1"
            style={{ position: "relative", overflow: "hidden" }}
          >
            <ul className="banner_slide_bg">
              {slides.map((slide, i) => (
                <li
                  key={i}
                  style={{
                    display: currentSlide === i ? "block" : "none",
                    background:
                      "linear-gradient(rgba(0,0,0,0.55),rgba(0,0,0,0.55)), url(/images/banner.jpg) center/cover no-repeat",
                    minHeight: "500px",
                  }}
                >
                  <div className="wrapper">
                    <div className="cover-top-center-9">
                      <div className="w3ls_cover_txt-9">
                        <h6 className="tag-cover-9">{slide.tag}</h6>
                        <h3 className="title-cover-9">{slide.title}</h3>
                        <p className="para-cover-9">{slide.para}</p>
                        <Link to="/services" className="actionbg button-cover-9">
                          Our Services
                        </Link>
                        <Link
                          to="/register"
                          className="actionbg-border button-cover-9"
                        >
                          Get Started
                        </Link>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            {/* Slide dots */}
            <div className="navigation">
              <div>
                {slides.map((_, i) => (
                  <span
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    style={{
                      display: "inline-block",
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      background: currentSlide === i ? "#4caf50" : "#ccc",
                      margin: "0 5px",
                      cursor: "pointer",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────────── */}
      <section className="w3l-feature-9">
        <div className="main-w3">
          <div className="wrapper">
            <div className="d-flex main-cont-wthree-fea">
              {[
                { icon: "fa-bath", title: "Best Quality", desc: "Top-rated professionals for every service category with verified reviews." },
                { icon: "fa-cogs", title: "Expert Advice", desc: "Our experts consult you before starting any work to ensure satisfaction." },
                { icon: "fa-users", title: "Labour Expertise", desc: "Skilled and experienced technicians trained to handle any home issue." },
                { icon: "fa-clock-o", title: "On Time Service", desc: "We respect your time. Punctual service delivery guaranteed." },
              ].map((f, i) => (
                <div className="grids-feature" key={i}>
                  <span className={`fa ${f.icon}`}></span>
                  <h4>
                    <a href="#feature" className="title-head">
                      {f.title}
                    </a>
                  </h4>
                  <p>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Services Carousel ─────────────────────────────────────── */}
      <section className="w3l-grids-4">
        <div id="grids4-block">
          <div className="wrapper">
            <h5 className="heading">Services</h5>
            <h3 className="heading">What we offer</h3>
            {loading ? (
              <p style={{ textAlign: "center", color: "#888" }}>
                Loading services...
              </p>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                  gap: "20px",
                }}
              >
                {services.map((svc) => (
                  <div
                    className="grids4-info"
                    key={svc._id}
                    style={{
                      borderRadius: "8px",
                      overflow: "hidden",
                      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                      transition: "transform 0.3s",
                      cursor: "pointer",
                    }}
                    onClick={() => navigate(`/service/${svc._id}`)}
                  >
                    <img
                      src={
                        svc.image
                          ? `${BACKEND}${svc.image}`
                          : "/images/cleaning.jpg"
                      }
                      className="img-responsive"
                      alt={svc.name}
                      style={{ width: "100%", height: "160px", objectFit: "cover" }}
                      onError={(e) => {
                        e.target.src = "/images/cleaning.jpg";
                      }}
                    />
                    <div className="info" style={{ padding: "14px" }}>
                      <h5>
                        <Link to={`/service/${svc._id}`}>{svc.name}</Link>
                      </h5>
                      <p style={{ fontSize: "13px", color: "#777", margin: "5px 0" }}>
                        {svc.description?.slice(0, 70)}...
                      </p>
                      <strong style={{ color: "#4caf50" }}>₹{svc.price}</strong>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div style={{ textAlign: "center", marginTop: "30px" }}>
              <Link
                to="/services"
                className="actionbg button-cover-9"
                style={{ display: "inline-block" }}
              >
                View All Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Book Service CTA Section ──────────────────────────────── */}
      <section className="w3l-form-16">
        <div className="form-16-mian">
          <div className="wrapper">
            <div className="forms-16-top">
              <div className="forms-16-info">
                <h5>Book service</h5>
                <h3>All types of Service Maintenance at your house</h3>
                <p>
                  Professional home services on demand. Browse our wide range of
                  categories and book the service you need in just a few clicks.
                  We guarantee quality, punctuality, and 100% satisfaction.
                </p>
                <Link to="/services" className="read1">
                  Browse Services
                </Link>
                <Link
                  to={isAuthenticated ? "/my-bookings" : "/login"}
                  className="read2"
                >
                  {isAuthenticated ? "My Bookings" : "Login to Book"}
                </Link>
              </div>
              <div className="form-right-inf">
                <div className="form-inner-cont">
                  <h6>
                    Quick Book<span className="line"></span>
                  </h6>
                  <div className="d-grid book-form">
                    {categories.slice(0, 6).map((cat) => (
                      <Link
                        key={cat._id}
                        to={`/services?category_id=${cat._id}`}
                        className="form-input"
                        style={{
                          display: "block",
                          padding: "10px 15px",
                          background: "#f8f9fa",
                          border: "1px solid #e0e0e0",
                          borderRadius: "4px",
                          color: "#2c3038",
                          textDecoration: "none",
                          marginBottom: "8px",
                          transition: "all 0.3s",
                        }}
                      >
                        <span className="fa fa-wrench" style={{ marginRight: "8px", color: "#4caf50" }}></span>
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                  <Link
                    to={isAuthenticated ? "/services" : "/login"}
                    className="btn"
                    style={{ display: "block", marginTop: "10px" }}
                  >
                    Book a Service
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Categories Section ────────────────────────────────────── */}
      {categories.length > 0 && (
        <section
          style={{
            padding: "60px 0",
            background: "#f8f9fa",
          }}
        >
          <div className="wrapper">
            <h5 className="heading">Browse by Category</h5>
            <h3 className="heading">Our Categories</h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: "20px",
              }}
            >
              {categories.map((cat) => (
                <Link
                  key={cat._id}
                  to={`/services?category_id=${cat._id}`}
                  style={{
                    background: "#fff",
                    borderRadius: "8px",
                    overflow: "hidden",
                    textDecoration: "none",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                    transition: "transform 0.3s, box-shadow 0.3s",
                    display: "block",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 8px 20px rgba(76,175,80,0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.08)";
                  }}
                >
                  <img
                    src={
                      cat.image
                        ? `${BACKEND}${cat.image}`
                        : "/images/cleaning.jpg"
                    }
                    alt={cat.name}
                    style={{ width: "100%", height: "130px", objectFit: "cover" }}
                    onError={(e) => { e.target.src = "/images/cleaning.jpg"; }}
                  />
                  <div style={{ padding: "14px", textAlign: "center" }}>
                    <h5 style={{ color: "#2c3038", fontSize: "15px", fontWeight: "600" }}>
                      {cat.name}
                    </h5>
                    <p style={{ color: "#888", fontSize: "12px", marginTop: "5px" }}>
                      {cat.description?.slice(0, 50)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Testimonials ─────────────────────────────────────────── */}
      {feedbacks.length > 0 && (
        <section className="w3l-customers-8">
          <div className="customers-main">
            <div className="wrapper">
              <h5 className="heading">Customers</h5>
              <h3 className="heading">What our clients say</h3>
              <div className="customer">
                {feedbacks.map((fb, i) => (
                  <div className="card" key={fb._id || i}>
                    <img
                      className="card-img-top img-responsive"
                      src={
                        fb.user?.profile_image
                          ? `${BACKEND}${fb.user.profile_image}`
                          : `/images/testi${(i % 3) + 1}.jpg`
                      }
                      alt={fb.user?.name}
                      style={{ height: "150px", objectFit: "cover" }}
                      onError={(e) => {
                        e.target.src = `/images/testi${(i % 3) + 1}.jpg`;
                      }}
                    />
                    <div className="card-body">
                      <div style={{ marginBottom: "8px" }}>
                        {[...Array(5)].map((_, s) => (
                          <span
                            key={s}
                            className={`fa ${s < Math.round(fb.rating) ? "fa-star" : "fa-star-o"}`}
                            style={{ color: "#f5a623", fontSize: "13px" }}
                          />
                        ))}
                        <span style={{ marginLeft: "6px", fontSize: "13px", color: "#888" }}>
                          ({fb.rating}/5)
                        </span>
                      </div>
                      <p className="card-text">
                        {fb.feedback?.slice(0, 100)}
                        {fb.feedback?.length > 100 ? "..." : ""}
                      </p>
                      <a href="#link" className="customer-link">
                        <h3 className="card-title">{fb.user?.name || "Anonymous"}</h3>
                      </a>
                      {fb.service?.name && (
                        <small style={{ color: "#4caf50" }}>
                          <span className="fa fa-wrench"></span> {fb.service.name}
                        </small>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Why Choose Us ────────────────────────────────────────── */}
      <section
        style={{
          padding: "60px 0",
          background: "linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)",
          color: "#fff",
        }}
      >
        <div className="wrapper">
          <h5 style={{ textAlign: "center", color: "#fff", fontStyle: "italic", fontSize: "24px", marginBottom: "10px" }}>
            Why Choose Us
          </h5>
          <h3 style={{ textAlign: "center", color: "#fff", fontSize: "36px", marginBottom: "40px" }}>
            Trusted by Thousands
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "30px",
              textAlign: "center",
            }}
          >
            {[
              { icon: "fa-shield", num: "500+", label: "Verified Experts" },
              { icon: "fa-calendar-check-o", num: "10,000+", label: "Bookings Done" },
              { icon: "fa-star", num: "4.8/5", label: "Average Rating" },
              { icon: "fa-clock-o", num: "24/7", label: "Support" },
            ].map((stat, i) => (
              <div key={i}>
                <span className={`fa ${stat.icon}`} style={{ fontSize: "40px", opacity: 0.85 }}></span>
                <h2 style={{ fontSize: "36px", fontWeight: "700", marginTop: "10px" }}>
                  {stat.num}
                </h2>
                <p style={{ opacity: 0.85 }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
