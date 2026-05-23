import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { changePassword, sendOTP, verifyOTP } from "../services/api";

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1=email, 2=otp, 3=reset
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email");
    setLoading(true);
    try {
      const res = await sendOTP({ email });
      if (res.data.success) {
        toast.info(res.data.message || "OTP sent to your email!");
        setStep(2);
        setTimeLeft(600); // Initialize timer
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP!");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    try {
      const res = await sendOTP({ email });
      if (res.data.success) {
        toast.info(res.data.message || "OTP resent successfully!");
        setOtp(["", "", "", "", "", ""]);
        setTimeLeft(600); // Reset timer
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP!");
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
      const res = await verifyOTP({ email, otp: otpValue });
      if (res.data.success) {
        toast.success("OTP Verified Successfully!");
        setStep(3);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP!");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword)
      return toast.error("Passwords do not match!");
    if (newPassword.length < 6)
      return toast.error("Password must be at least 6 characters");
    setLoading(true);
    try {
      const res = await changePassword({ email, newPassword });
      if (res.data.success) {
        toast.success("Password changed successfully! Please login.");
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Reset failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w3l-forms-17">
      <div id="forms-17_sur">
        <div className="wrapper">
          <div className="forms-17-top">
            <div className="forms-17-text">
              <div className="top">
                <span className="fa fa-lock"></span>
                <h4>Forgot Password?</h4>
                <p>Reset your account password</p>
              </div>
              <ul className="bottom-list">
                <li>
                  <span className="fa fa-check"></span> Enter your registered
                  email address.
                </li>
                <li>
                  <span className="fa fa-check"></span> Check your inbox for the
                  6-digit OTP.
                </li>
                <li>
                  <span className="fa fa-check"></span> Set a strong new
                  password for your account.
                </li>
              </ul>
            </div>

            <div className="forms-17-form">
              <div className="form-17-tp">
                <h6>
                  {step === 1 && "Enter Email"}
                  {step === 2 && "Enter OTP"}
                  {step === 3 && "Reset Password"}
                </h6>

                {step === 1 && (
                  <form onSubmit={handleEmailSubmit} className="signin-form">
                    <div className="form-input">
                      <input
                        type="email"
                        placeholder="Your registered email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="align-left-right">
                      <button className="btn" type="submit" disabled={loading}>
                        {loading ? "Sending..." : "Send OTP"} <span className="fa fa-arrow-right"></span>
                      </button>
                    </div>
                    <div className="bottom-login">
                      <p>
                        Remember password? <Link to="/login">Login</Link>
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
                      Enter the 6-digit OTP sent to: <br/> <strong>{email}</strong>
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
                            width: "45px",
                            height: "50px",
                            textAlign: "center",
                            fontSize: "20px",
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

                {step === 3 && (
                  <form onSubmit={handleReset} className="signin-form">
                    <p
                      style={{
                        marginBottom: "12px",
                        color: "#555",
                        fontSize: "13px",
                      }}
                    >
                      Resetting for: <strong>{email}</strong>
                    </p>
                    <div className="form-input">
                      <input
                        type="password"
                        placeholder="New password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        minLength="6"
                        maxLength="50"
                        required
                      />
                    </div>
                    <div className="form-input">
                      <input
                        type="password"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        minLength="6"
                        maxLength="50"
                        required
                      />
                    </div>
                    <div className="align-left-right">
                      <button className="btn" type="submit" disabled={loading}>
                        {loading ? "Resetting..." : "Reset Password"}
                      </button>
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
