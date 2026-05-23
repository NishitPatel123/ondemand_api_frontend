import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { signup, verifyOTP } from "../services/api";

export default function Register() {
  const [step, setStep] = useState(1); // 1 = signup form, 2 = OTP verification
  const [data, setData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
  });
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (step === 2 && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, timeLeft]);

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60).toString().padStart(2, "0");
    const sec = (seconds % 60).toString().padStart(2, "0");
    return `${min}:${sec}`;
  };

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await signup(data);
      if (res.data.success) {
        toast.info(res.data.message || "OTP sent to your email!");
        setStep(2);
        setTimeLeft(600); // Initialize timer
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed!");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus to next input
    if (value !== "" && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
      }
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length !== 6) return toast.error("Please enter a valid 6-digit OTP");
    setLoading(true);
    try {
      const res = await verifyOTP({ email: data.email, otp: otpValue });
      if (res.data.success) {
        toast.success("Account activated successfully! Please login.");
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP!");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    try {
      const res = await signup(data);
      if (res.data.success) {
        toast.info("OTP resent successfully!");
        setOtp(["", "", "", "", "", ""]);
        setTimeLeft(600); // Reset timer
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP!");
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
                <h4>{step === 1 ? "Register here" : "OTP Verification"}</h4>
                <p>{step === 1 ? "Create your account" : "Activate your account"}</p>
              </div>
              <ul className="bottom-list">
                <li>
                  <span className="fa fa-check"></span> Get access to 100+
                  professional home services.
                </li>
                <li>
                  <span className="fa fa-check"></span> Book, reschedule or
                  cancel appointments anytime.
                </li>
                <li>
                  <span className="fa fa-check"></span> Pay securely and track
                  your service history.
                </li>
              </ul>
            </div>

            {/* Right form panel */}
            <div className="forms-17-form">
              <div className="form-17-tp">
                <h6>{step === 1 ? "Register" : "Enter OTP"}</h6>

                {step === 1 && (
                  <form onSubmit={handleSignupSubmit} className="signin-form">
                    <div className="form-input">
                      <input
                        type="text"
                        name="name"
                        placeholder="Your full name"
                        value={data.name}
                        onChange={handleChange}
                        minLength="2"
                        maxLength="50"
                        required
                      />
                    </div>
                    <div className="form-input">
                      <input
                        type="email"
                        name="email"
                        placeholder="Email address"
                        autoComplete="off"
                        value={data.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-input">
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Phone number"
                        value={data.phone}
                        onChange={handleChange}
                        minLength="10"
                        maxLength="15"
                        pattern="[0-9+]+"
                        title="Please enter a valid phone number containing 10-15 digits. You can use the '+' prefix."
                        required
                      />
                    </div>
                    <div className="form-input">
                      <input
                        type="text"
                        name="address"
                        placeholder="Your address"
                        value={data.address}
                        onChange={handleChange}
                        minLength="5"
                        maxLength="200"
                        required
                      />
                    </div>
                    <div className="form-input">
                      <input
                        type="password"
                        name="password"
                        placeholder="Create password"
                        autoComplete="new-password"
                        value={data.password}
                        onChange={handleChange}
                        minLength="6"
                        maxLength="50"
                        required
                      />
                    </div>
                    <div className="align-left-right margin-create">
                      <button className="btn" type="submit" disabled={loading}>
                        {loading ? "Creating..." : "Create Account"}
                      </button>
                    </div>
                    <div className="bottom-login">
                      <p>
                        Already a customer? <Link to="/login">Login</Link>
                      </p>
                    </div>
                  </form>
                )}

                {step === 2 && (
                  <form onSubmit={handleVerifyOtp} className="signin-form">
                    <p
                      style={{
                        marginBottom: "12px",
                        color: "#555",
                        fontSize: "13px",
                      }}
                    >
                      Enter the 6-digit OTP sent to: <br /> <strong>{data.email}</strong>
                    </p>

                    <div style={{ textAlign: "center", marginBottom: "15px", color: timeLeft > 0 ? "#4caf50" : "#d9534f", fontWeight: "bold" }}>
                      {timeLeft > 0 ? `Time remaining: ${formatTime(timeLeft)}` : "OTP Expired"}
                    </div>

                    <div className="form-input" style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '20px' }}>
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          id={`otp-input-${index}`}
                          type="text"
                          maxLength="1"
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                          disabled={timeLeft === 0}
                          style={{
                            width: "40px",
                            height: "45px",
                            textAlign: "center",
                            fontSize: "18px",
                            fontWeight: "bold",
                            borderRadius: "8px",
                            border: "1px solid #ddd",
                            padding: "0"
                          }}
                          required={timeLeft > 0}
                        />
                      ))}
                    </div>

                    <div className="align-left-right" style={{ flexDirection: "column", gap: "10px" }}>
                      <button className="btn" type="submit" disabled={loading || timeLeft === 0} style={{ width: '100%' }}>
                        {loading ? "Verifying..." : "Verify OTP"}
                      </button>

                      {timeLeft === 0 && (
                        <button type="button" className="btn" onClick={handleResendOTP} disabled={loading} style={{ width: '100%', backgroundColor: '#ff9800', marginTop: '10px' }}>
                          {loading ? "Resending..." : "Resend OTP"}
                        </button>
                      )}
                    </div>

                    <div className="bottom-login text-center mt-3" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                      <p>
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#4caf50",
                            cursor: "pointer",
                            padding: 0,
                            fontSize: "14px",
                          }}
                        >
                          ← Back
                        </button>
                      </p>
                    </div>
                  </form>
                )}
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
