import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "../common/Header";
import Footer from "../common/Footer";
import { getServiceDetails, bookService, genOrderId, verifyPayment, getFeedbacks, getProfile } from "../services/api";

export default function ServiceDetail({ isAuthenticated, setIsAuthenticated }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingDatetime, setBookingDatetime] = useState("");
  const [address, setAddress] = useState("");
  const [booking, setBooking] = useState(false);
  const BACKEND = "https://ondemand-api-backend-m1v5.onrender.com";

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [svcRes, fbRes] = await Promise.all([
          getServiceDetails(id),
          getFeedbacks(),
        ]);
        setService(svcRes.data.data);
        const allFb = fbRes.data.data || [];
        setFeedbacks(allFb.filter((f) => f.service?._id === id || f.service_id === id));
        
        if (isAuthenticated) {
          try {
            const profRes = await getProfile();
            if (profRes.data?.data?.address) {
              setAddress(profRes.data.data.address);
            }
          } catch (e) {
            console.error("Failed to load user profile for address", e);
          }
        }
      } catch {
        toast.error("Service not found!");
        navigate("/services");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [id, isAuthenticated]);

  const handleBook = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.info("Please login to book a service");
      return navigate("/login");
    }
    if (!bookingDatetime) return toast.error("Please select date and time");
    setBooking(true);
    try {
      const res = await bookService({ service_id: id, booking_datetime: bookingDatetime, address });
      if (res.data.success) {
        toast.success("Service booked successfully! You can pay from My Bookings.");
        navigate("/my-bookings");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Booking failed!");
    } finally {
      setBooking(false);
    }
  };

  const getTomorrowMin = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(8, 0, 0, 0);
    return d.toISOString().slice(0, 16);
  };

  const avgRating =
    feedbacks.length > 0
      ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)
      : null;

  if (loading) {
    return (
      <>
        <Header isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
        <div style={{ textAlign: "center", padding: "100px 0" }}>
          <span className="fa fa-spinner fa-spin" style={{ fontSize: "50px", color: "#4caf50" }}></span>
        </div>
        <Footer />
      </>
    );
  }

  if (!service) return null;

  return (
    <>
      <Header isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />

      {/* Inner Banner */}
      <div style={{ background: "linear-gradient(rgba(0,0,0,0.6),rgba(0,0,0,0.6)), url(/images/banner.jpg) center/cover", padding: "50px 0", color: "#fff", textAlign: "center" }}>
        <div className="wrapper">
          <h2 style={{ fontSize: "32px" }}>{service.name}</h2>
          <p style={{ marginTop: "8px", opacity: 0.75, fontSize: "14px" }}>
            <Link to="/" style={{ color: "#4caf50" }}>Home</Link> /{" "}
            <Link to="/services" style={{ color: "#4caf50" }}>Services</Link> / {service.name}
          </p>
        </div>
      </div>

      <section style={{ padding: "60px 0", background: "#f8f9fa" }}>
        <div className="wrapper">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "30px" }}>
            {/* ── Service Info ── */}
            <div>
              <div style={{ background: "#fff", borderRadius: "10px", overflow: "hidden", boxShadow: "0 2px 15px rgba(0,0,0,0.08)", marginBottom: "25px" }}>
                <img
                  src={service.image ? `${BACKEND}${service.image}` : "/images/cleaning.jpg"}
                  alt={service.name}
                  style={{ width: "100%", height: "350px", objectFit: "cover" }}
                  onError={(e) => { e.target.src = "/images/cleaning.jpg"; }}
                />
                <div style={{ padding: "25px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "15px" }}>
                    <div>
                      {service.category?.name && (
                        <span style={{ background: "#e8f5e9", color: "#4caf50", padding: "3px 12px", borderRadius: "12px", fontSize: "12px", fontWeight: "600" }}>
                          {service.category.name}
                        </span>
                      )}
                      <h2 style={{ color: "#2c3038", marginTop: "10px", fontSize: "26px" }}>{service.name}</h2>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "28px", fontWeight: "700", color: "#4caf50" }}>₹{service.price}</div>
                      {avgRating && (
                        <div style={{ display: "flex", alignItems: "center", gap: "4px", justifyContent: "flex-end", marginTop: "5px" }}>
                          <span className="fa fa-star" style={{ color: "#f5a623", fontSize: "14px" }}></span>
                          <span style={{ fontWeight: "600" }}>{avgRating}</span>
                          <span style={{ color: "#aaa", fontSize: "13px" }}>({feedbacks.length} reviews)</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <p style={{ color: "#555a64", lineHeight: "1.7", fontSize: "15px" }}>{service.description}</p>

                  {/* Service Features */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "15px", marginTop: "25px", background: "#f8f9fa", borderRadius: "8px", padding: "20px" }}>
                    {[
                      { icon: "fa-shield", label: "Verified Expert" },
                      { icon: "fa-clock-o", label: "Timely Service" },
                      { icon: "fa-thumbs-up", label: "Quality Work" },
                    ].map((f, i) => (
                      <div key={i} style={{ textAlign: "center" }}>
                        <span className={`fa ${f.icon}`} style={{ fontSize: "24px", color: "#4caf50" }}></span>
                        <p style={{ marginTop: "5px", fontSize: "12px", color: "#555" }}>{f.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Reviews */}
              {feedbacks.length > 0 && (
                <div style={{ background: "#fff", borderRadius: "10px", padding: "25px", boxShadow: "0 2px 15px rgba(0,0,0,0.08)" }}>
                  <h4 style={{ color: "#2c3038", marginBottom: "20px", borderBottom: "2px solid #4caf50", paddingBottom: "10px" }}>
                    Customer Reviews ({feedbacks.length})
                  </h4>
                  {feedbacks.map((fb, i) => (
                    <div key={fb._id || i} style={{ borderBottom: i < feedbacks.length - 1 ? "1px solid #f0f0f0" : "none", paddingBottom: "15px", marginBottom: "15px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                        <div>
                          <strong style={{ color: "#2c3038" }}>{fb.user?.name || "Anonymous"}</strong>
                          <div>
                            {[...Array(5)].map((_, s) => (
                              <span key={s} className={`fa ${s < Math.round(fb.rating) ? "fa-star" : "fa-star-o"}`} style={{ color: "#f5a623", fontSize: "12px" }} />
                            ))}
                          </div>
                        </div>
                        <span style={{ fontSize: "12px", color: "#aaa" }}>
                          {new Date(fb.datetime).toLocaleDateString()}
                        </span>
                      </div>
                      <p style={{ color: "#555", fontSize: "14px" }}>{fb.feedback}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── Booking Form ── */}
            <div>
              <div style={{ background: "#fff", borderRadius: "10px", padding: "25px", boxShadow: "0 2px 15px rgba(0,0,0,0.08)", position: "sticky", top: "20px" }}>
                <h4 style={{ color: "#2c3038", borderBottom: "2px solid #4caf50", paddingBottom: "12px", marginBottom: "20px" }}>
                  Book this Service
                </h4>
                <div style={{ background: "#f8f9fa", borderRadius: "8px", padding: "15px", marginBottom: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span style={{ color: "#666" }}>Service Charge:</span>
                    <strong>₹{service.price}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#666" }}>Taxes & Fees:</span>
                    <strong>Included</strong>
                  </div>
                  <hr style={{ margin: "10px 0", border: "1px solid #e0e0e0" }} />
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontWeight: "700" }}>Total:</span>
                    <strong style={{ color: "#4caf50", fontSize: "20px" }}>₹{service.price}</strong>
                  </div>
                </div>
                <form onSubmit={handleBook}>
                  <label style={{ display: "block", fontWeight: "600", marginBottom: "6px", color: "#2c3038", fontSize: "14px" }}>
                    Select Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={bookingDatetime}
                    onChange={(e) => setBookingDatetime(e.target.value)}
                    min={getTomorrowMin()}
                    required
                    style={{ width: "100%", padding: "10px 12px", border: "1px solid #e0e0e0", borderRadius: "4px", marginBottom: "16px", fontSize: "14px", outline: "none" }}
                  />
                  
                  {isAuthenticated && (
                    <>
                      <label style={{ display: "block", fontWeight: "600", marginBottom: "6px", color: "#2c3038", fontSize: "14px" }}>
                        Service Address
                      </label>
                      <input
                        type="text"
                        placeholder="Enter the service address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                        style={{ width: "100%", padding: "10px 12px", border: "1px solid #e0e0e0", borderRadius: "4px", marginBottom: "16px", fontSize: "14px", outline: "none" }}
                      />
                    </>
                  )}

                  <button
                    type="submit"
                    className="btn"
                    disabled={booking}
                    style={{ width: "100%", padding: "12px", fontSize: "16px" }}
                  >
                    {booking ? "Booking..." : isAuthenticated ? "Book Now" : "Login to Book"}
                  </button>
                </form>
                <div style={{ marginTop: "20px", padding: "15px", background: "#e8f5e9", borderRadius: "8px" }}>
                  {[
                    "Free cancellation (before service)",
                    "Verified & background-checked experts",
                    "Secure online payment",
                  ].map((item, i) => (
                    <p key={i} style={{ fontSize: "13px", color: "#2e7d32", margin: "4px 0" }}>
                      <span className="fa fa-check" style={{ marginRight: "8px" }}></span>
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
