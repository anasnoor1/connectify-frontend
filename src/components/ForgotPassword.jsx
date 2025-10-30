import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [step, setStep] = useState("email"); // email | otp | reset
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const requestOtp = async (e) => {
    e.preventDefault();
    const emailOk = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
    if (!emailOk) return toast.error("Invalid email");
    try {
      setLoading(true);
      await axios.post("/api/auth/password/forgot", { email });
      toast.success("OTP sent to your email)");
      setStep("otp");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) return toast.error("Enter OTP");
    try {
      setLoading(true);
      await axios.post("/api/auth/password/verify-reset", { email, otp });
      toast.success("OTP verified");
      setStep("reset");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) return toast.error("Password must be at least 6 characters");
    if (newPassword !== confirmPassword) return toast.error("Passwords do not match");
    try {
      setLoading(true);
      await axios.put("/api/auth/password/update", { email, otp, newPassword });
      toast.success("Password updated. Please login.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100 py-4">
      <div className="row justify-content-center w-100">
        <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5 col-xxl-4">
          <div className="card shadow border-0">
            <div className="card-header bg-transparent py-3">
              <div className="text-center">
                <h2 className="h5 fw-bold mb-1">Forgot Password</h2>
                <p className="text-muted small mb-0">
                  {step === "email" && "Enter your email to receive an OTP"}
                  {step === "otp" && "Enter the OTP sent to your email"}
                  {step === "reset" && "Set your new password"}
                </p>
              </div>
            </div>
            <div className="card-body p-3 p-md-4">
              {step === "email" && (
                <form onSubmit={requestOtp}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Email address</label>
                    <div className="input-group input-group-sm">
                      <span className="input-group-text">📧</span>
                      <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>
                  <button className="btn btn-primary w-100" type="submit" disabled={loading}>
                    {loading ? "Sending..." : "Send OTP"}
                  </button>
                </form>
              )}

              {step === "otp" && (
                <form onSubmit={verifyOtp}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">OTP</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      disabled={loading}
                      placeholder="Enter 6-digit OTP"
                    />
                  </div>
                  <button className="btn btn-primary w-100" type="submit" disabled={loading}>
                    {loading ? "Verifying..." : "Verify OTP"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-link w-100 mt-2"
                    disabled={loading}
                    onClick={requestOtp}
                  >
                    Resend OTP
                  </button>
                </form>
              )}

              {step === "reset" && (
                <form onSubmit={updatePassword}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">New Password</label>
                    <div className="input-group input-group-sm">
                      <input
                        type={showNew ? "text" : "password"}
                        className="form-control"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        disabled={loading}
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setShowNew((v) => !v)}
                        tabIndex={-1}
                        aria-label="Toggle password visibility"
                      >
                        <i className={`bi bi-eye${showNew ? "-slash" : ""}`}></i>
                      </button>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Confirm Password</label>
                    <div className="input-group input-group-sm">
                      <input
                        type={showConfirm ? "text" : "password"}
                        className="form-control"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={loading}
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setShowConfirm((v) => !v)}
                        tabIndex={-1}
                        aria-label="Toggle password visibility"
                      >
                        <i className={`bi bi-eye${showConfirm ? "-slash" : ""}`}></i>
                      </button>
                    </div>
                  </div>

                  <button className="btn btn-primary w-100" type="submit" disabled={loading}>
                    {loading ? "Updating..." : "Confirm"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;