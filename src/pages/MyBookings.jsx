import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import Header from "../common/Header";
import Footer from "../common/Footer";
import {
  myBookings,
  cancelBooking,
  rescheduleBooking,
  genOrderId,
  verifyPayment,
  addFeedback,
} from "../services/api";

const RAZORPAY_KEY = "rzp_test_VQhEfe2NCXbbwI"; // Update with actual key

export default function MyBookings({ isAuthenticated, setIsAuthenticated }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [feedbackModal, setFeedbackModal] = useState(null); // {booking_id, service_id}
  const [feedbackData, setFeedbackData] = useState({ rating: 5, feedback: "" });
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [rescheduleModal, setRescheduleModal] = useState(null);
  const [rescheduleData, setRescheduleData] = useState("");
  const [rescheduling, setRescheduling] = useState(false);
  const BACKEND = "http://localhost:8000";

  const fetchBookings = async () => {
    try {
      const res = await myBookings();
      setBookings(res.data.data || []);
    } catch {
      toast.error("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?"))
      return;
    try {
      const res = await cancelBooking({ booking_id: bookingId });
      if (res.data.success) {
        toast.success("Booking cancelled successfully!");
        fetchBookings();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Cancel failed!");
    }
  };

  const handlePay = async (booking) => {
    try {
      const orderRes = await genOrderId({ booking_id: booking._id });
      if (!orderRes.data.success) return toast.error("Failed to create order");
      const { order_id, amount } = orderRes.data.data;

      const options = {
        key: RAZORPAY_KEY,
        amount,
        currency: "INR",
        name: "Home Service",
        description: booking.service?.name || "Service Payment",
        order_id,
        handler: async (response) => {
          try {
            const verifyRes = await verifyPayment({
              booking_id: booking._id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            if (verifyRes.data.success) {
              toast.success("Payment successful!");
              fetchBookings();
            }
          } catch {
            toast.error("Payment verification failed!");
          }
        },
        prefill: { name: "", email: "", contact: "" },
        theme: { color: "#4caf50" },
      };

      if (!window.Razorpay) {
        // Dynamically load Razorpay script
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => {
          const rzp = new window.Razorpay(options);
          rzp.open();
        };
        document.body.appendChild(script);
      } else {
        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Payment initiation failed!",
      );
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setSubmittingFeedback(true);
    try {
      const res = await addFeedback({
        booking_id: feedbackModal.booking_id,
        service_id: feedbackModal.service_id,
        rating: feedbackData.rating,
        feedback: feedbackData.feedback,
      });
      if (res.data.success) {
        toast.success("Feedback submitted successfully!");
        setFeedbackModal(null);
        setFeedbackData({ rating: 5, feedback: "" });
        fetchBookings(); // Refresh list to show "Reviewed" badge immediately
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Feedback submission failed!",
      );
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const handleRescheduleSubmit = async (e) => {
    e.preventDefault();
    if (!rescheduleData) return toast.error("Please select a valid date & time");
    setRescheduling(true);
    try {
      const res = await rescheduleBooking({
        booking_id: rescheduleModal._id,
        new_datetime: rescheduleData,
      });
      if (res.data.success) {
        toast.success("Booking rescheduled successfully!");
        setRescheduleModal(null);
        setRescheduleData("");
        fetchBookings();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Reschedule failed!");
    } finally {
      setRescheduling(false);
    }
  };

  const getTomorrowMin = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(8, 0, 0, 0);
    return d.toISOString().slice(0, 16);
  };

  const filtered = bookings.filter((b) => {
    const matchSearch =
      b.service?.name?.toLowerCase().includes(search.toLowerCase()) ||
      b.category?.name?.toLowerCase().includes(search.toLowerCase()) ||
      b.status?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || b.status === filter;
    return matchSearch && matchFilter;
  });

  const getStatusStyle = (status) => {
    switch (status) {
      case "Ongoing":
        return {
          background: "#fff3cd",
          color: "#856404",
          border: "1px solid #ffc107",
        };
      case "Completed":
        return {
          background: "#d4edda",
          color: "#155724",
          border: "1px solid #28a745",
        };
      case "Cancelled":
        return {
          background: "#f8d7da",
          color: "#721c24",
          border: "1px solid #dc3545",
        };
      default:
        return { background: "#e2e3e5", color: "#383d41" };
    }
  };

  return (
    <>
      <Header
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
      />

      <div
        style={{
          background:
            "linear-gradient(rgba(0,0,0,0.6),rgba(0,0,0,0.6)), url(/images/banner.jpg) center/cover",
          padding: "50px 0",
          color: "#fff",
          textAlign: "center",
        }}
      >
        <div className="wrapper">
          <h2 style={{ fontSize: "32px" }}>My Bookings</h2>
          <p style={{ marginTop: "8px", opacity: 0.75, fontSize: "14px" }}>
            <Link to="/" style={{ color: "#4caf50" }}>
              Home
            </Link>{" "}
            / My Bookings
          </p>
        </div>
      </div>

      <section
        style={{ padding: "50px 0", background: "#f8f9fa", minHeight: "60vh" }}
      >
        <div className="wrapper">
          {/* Filters */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              marginBottom: "25px",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <input
              type="text"
              placeholder="Search bookings..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                padding: "10px 15px",
                border: "1px solid #e0e0e0",
                borderRadius: "4px",
                outline: "none",
                fontSize: "14px",
                flex: "1",
                minWidth: "200px",
              }}
            />
            {["All", "Ongoing", "Completed", "Cancelled"].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                style={{
                  padding: "10px 20px",
                  borderRadius: "4px",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: filter === s ? "700" : "400",
                  background: filter === s ? "#4caf50" : "#fff",
                  color: filter === s ? "#fff" : "#555",
                  boxShadow: "0 1px 5px rgba(0,0,0,0.1)",
                }}
              >
                {s}
              </button>
            ))}
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <span
                className="fa fa-spinner fa-spin"
                style={{ fontSize: "40px", color: "#4caf50" }}
              ></span>
            </div>
          ) : filtered.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "80px 20px",
                background: "#fff",
                borderRadius: "10px",
              }}
            >
              <span
                className="fa fa-calendar-times-o"
                style={{ fontSize: "60px", color: "#ccc" }}
              ></span>
              <h4 style={{ color: "#888", marginTop: "15px" }}>
                No bookings found
              </h4>
              <Link
                to="/services"
                className="btn"
                style={{ display: "inline-block", marginTop: "15px" }}
              >
                Browse Services
              </Link>
            </div>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              {filtered.map((b) => (
                <div
                  key={b._id}
                  style={{
                    background: "#fff",
                    borderRadius: "10px",
                    padding: "20px",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                    display: "flex",
                    gap: "20px",
                    alignItems: "flex-start",
                  }}
                >
                  <img
                    src={
                      b.service?.image
                        ? `${BACKEND}${b.service.image}`
                        : "/images/cleaning.jpg"
                    }
                    alt={b.service?.name}
                    style={{
                      width: "90px",
                      height: "90px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      flexShrink: 0,
                    }}
                    onError={(e) => {
                      e.target.src = "/images/cleaning.jpg";
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        flexWrap: "wrap",
                        gap: "10px",
                      }}
                    >
                      <div>
                        <h4
                          style={{
                            color: "#2c3038",
                            fontSize: "17px",
                            marginBottom: "4px",
                          }}
                        >
                          {b.service?.name || "Service"}
                        </h4>
                        {b.category?.name && (
                          <span
                            style={{
                              fontSize: "12px",
                              color: "#4caf50",
                              background: "#e8f5e9",
                              padding: "2px 8px",
                              borderRadius: "10px",
                            }}
                          >
                            {b.category.name}
                          </span>
                        )}
                      </div>
                      <span
                        style={{
                          padding: "4px 14px",
                          borderRadius: "20px",
                          fontSize: "12px",
                          fontWeight: "600",
                          ...getStatusStyle(b.status),
                        }}
                      >
                        {b.status}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(160px, 1fr))",
                        gap: "8px",
                        marginTop: "12px",
                      }}
                    >
                      <p style={{ fontSize: "13px", color: "#666" }}>
                        <span
                          className="fa fa-calendar"
                          style={{ color: "#4caf50", marginRight: "6px" }}
                        ></span>
                        <strong>Booked:</strong>{" "}
                        {new Date(b.booking_datetime).toLocaleString()}
                      </p>
                      <p style={{ fontSize: "13px", color: "#666" }}>
                        <span
                          className="fa fa-inr"
                          style={{ color: "#4caf50", marginRight: "6px" }}
                        ></span>
                        <strong>Amount:</strong> ₹{b.amount || b.service?.price}
                      </p>
                      <p style={{ fontSize: "13px", color: "#666" }}>
                        <span
                          className="fa fa-credit-card"
                          style={{ color: "#4caf50", marginRight: "6px" }}
                        ></span>
                        <strong>Payment:</strong>{" "}
                        <span
                          style={{
                            color:
                              b.payment_status === "Success"
                                ? "#28a745"
                                : b.payment_status === "Pending"
                                  ? "#ffc107"
                                  : "#dc3545",
                            fontWeight: "600",
                          }}
                        >
                          {b.payment_status || "Pending"}
                        </span>
                      </p>
                    </div>
                  </div>
                  {/* Actions */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                      flexShrink: 0,
                    }}
                  >
                     {(b.status === "Ongoing" || b.status === "Pending") &&
                      b.payment_status !== "Success" && (
                        <button
                          onClick={() => handlePay(b)}
                          className="btn"
                          style={{
                            padding: "8px 16px",
                            fontSize: "13px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          <span
                            className="fa fa-credit-card"
                            style={{ marginRight: "5px" }}
                          ></span>
                          Pay Now
                        </button>
                      )}
                    {(b.status === "Ongoing" || b.status === "Pending") && (
                      <button
                        onClick={() => handleCancel(b._id)}
                        style={{
                          padding: "8px 16px",
                          fontSize: "13px",
                          background: "#dc3545",
                          color: "#fff",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <span
                          className="fa fa-times"
                          style={{ marginRight: "5px" }}
                        ></span>
                        Cancel
                      </button>
                    )}
                    {(b.status === "Ongoing" || b.status === "Pending") && (
                      <button
                        onClick={() => setRescheduleModal(b)}
                        style={{
                          padding: "8px 16px",
                          fontSize: "13px",
                          background: "#ffc107",
                          color: "#333",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <span
                          className="fa fa-calendar"
                          style={{ marginRight: "5px" }}
                        ></span>
                        Reschedule
                      </button>
                    )}
                    {b.status === "Completed" && (
                      !b.hasFeedback ? (
                        <button
                          onClick={() =>
                            setFeedbackModal({
                              booking_id: b._id,
                              service_id: b.service_id || b.service?._id,
                            })
                          }
                          style={{
                            padding: "8px 16px",
                            fontSize: "13px",
                            background: "#4caf50",
                            color: "#fff",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            whiteSpace: "nowrap",
                          }}
                        >
                          <span
                            className="fa fa-star"
                            style={{ marginRight: "5px" }}
                          ></span>
                          Feedback
                        </button>
                      ) : (
                        <span style={{ 
                          padding: "6px 12px", 
                          fontSize: "12px", 
                          background: "#e8f5e9", 
                          color: "#2e7d32", 
                          borderRadius: "4px",
                          fontWeight: "600",
                          textAlign: "center"
                        }}>
                          <i className="fa fa-check-circle" style={{ marginRight: "5px" }}></i>
                          Reviewed
                        </span>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Feedback Modal */}
      {feedbackModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "10px",
              padding: "30px",
              width: "100%",
              maxWidth: "450px",
            }}
          >
            <h4
              style={{
                color: "#2c3038",
                marginBottom: "20px",
                borderBottom: "2px solid #4caf50",
                paddingBottom: "10px",
              }}
            >
              Submit Feedback
            </h4>
            <form onSubmit={handleFeedbackSubmit}>
              <label
                style={{
                  fontWeight: "600",
                  marginBottom: "8px",
                  display: "block",
                }}
              >
                Rating
              </label>
              <div
                style={{ display: "flex", gap: "8px", marginBottom: "16px" }}
              >
                {[1, 2, 3, 4, 5].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() =>
                      setFeedbackData({ ...feedbackData, rating: r })
                    }
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      border: "none",
                      cursor: "pointer",
                      background:
                        r <= feedbackData.rating ? "#4caf50" : "#e0e0e0",
                      color: r <= feedbackData.rating ? "#fff" : "#888",
                      fontWeight: "700",
                    }}
                  >
                    {r}
                  </button>
                ))}
              </div>
              <label
                style={{
                  fontWeight: "600",
                  marginBottom: "8px",
                  display: "block",
                }}
              >
                Your Review
              </label>
              <textarea
                value={feedbackData.feedback}
                onChange={(e) =>
                  setFeedbackData({ ...feedbackData, feedback: e.target.value })
                }
                placeholder="Share your experience with this service..."
                required
                rows={4}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid #e0e0e0",
                  borderRadius: "4px",
                  resize: "vertical",
                  fontSize: "14px",
                  outline: "none",
                  marginBottom: "16px",
                }}
              />
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  type="submit"
                  className="btn"
                  disabled={submittingFeedback}
                  style={{ flex: 1, padding: "12px" }}
                >
                  {submittingFeedback ? "Submitting..." : "Submit Feedback"}
                </button>
                <button
                  type="button"
                  onClick={() => setFeedbackModal(null)}
                  style={{
                    flex: 1,
                    padding: "12px",
                    background: "#f0f0f0",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {rescheduleModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "10px",
              padding: "30px",
              width: "100%",
              maxWidth: "400px",
            }}
          >
            <h4
              style={{
                color: "#2c3038",
                marginBottom: "20px",
                borderBottom: "2px solid #4caf50",
                paddingBottom: "10px",
              }}
            >
              Reschedule Booking
            </h4>
            <p style={{ marginBottom: "15px", fontSize: "14px", color: "#555" }}>
              Select a new date and time for your booking.
            </p>
            <form onSubmit={handleRescheduleSubmit}>
              <label
                style={{
                  fontWeight: "600",
                  marginBottom: "8px",
                  display: "block",
                  fontSize: "14px",
                }}
              >
                New Date & Time
              </label>
              <input
                type="datetime-local"
                value={rescheduleData}
                onChange={(e) => setRescheduleData(e.target.value)}
                min={getTomorrowMin()}
                required
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid #e0e0e0",
                  borderRadius: "4px",
                  marginBottom: "16px",
                  fontSize: "14px",
                  outline: "none",
                }}
              />
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  type="submit"
                  className="btn"
                  disabled={rescheduling}
                  style={{ flex: 1, padding: "12px" }}
                >
                  {rescheduling ? "Updating..." : "Confirm"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRescheduleModal(null);
                    setRescheduleData("");
                  }}
                  style={{
                    flex: 1,
                    padding: "12px",
                    background: "#f0f0f0",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
