import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useSearchParams, useNavigate } from "react-router-dom";

const VerifyOtp = () => {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [touched, setTouched] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120); // seconds
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const navigate = useNavigate();
  const inputsRef = useRef([]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const id = setInterval(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [timeLeft]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (timeLeft <= 0) {
      toast.error("OTP expired. Please resend a new code.");
      return;
    }
    const value = digits.join("").trim();
    const msg = validate(value);
    setError(msg);
    setTouched(true);
    if (msg) {
      toast.error("Please fix the errors");
      return;
    }
    try {
      const res = await axios.post("/api/auth/verify-otp", { email, otp: value });
      toast.success(res.data.message);
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Verification failed");
    }
  };

  const validate = (value) => {
    if (!value) return "OTP is required";
    if (!/^\d{4,8}$/.test(value)) return "Enter a valid numeric OTP";
    return "";
  };

  const validateSoft = (value) => {
    if (!value) return "OTP is required";
    if (value.length < 6) return "";
    return validate(value);
  };

  const handleChange = (index, char) => {
    const c = char.replace(/[^0-9]/g, "");
    if (!c) {
      const next = [...digits];
      next[index] = "";
      setDigits(next);
      return;
    }
    const next = [...digits];
    next[index] = c.charAt(0);
    setDigits(next);
    if (index < inputsRef.current.length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
<<<<<<< HEAD
    if (touched) {
      const joined = next.join("").trim();
      if (joined.length === next.length) {
        setError(validate(joined));
      } else {
        setError("");
      }
    }
=======
    if (touched) setError(validateSoft(next.join("").trim()));
>>>>>>> origin/auth-naeem
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (digits[index]) {
        const next = [...digits];
        next[index] = "";
        setDigits(next);
      } else if (index > 0) {
        inputsRef.current[index - 1]?.focus();
        const next = [...digits];
        next[index - 1] = "";
        setDigits(next);
      }
      e.preventDefault();
    }
    if (e.key === "ArrowLeft" && index > 0) {
      inputsRef.current[index - 1]?.focus();
      e.preventDefault();
    }
    if (e.key === "ArrowRight" && index < inputsRef.current.length - 1) {
      inputsRef.current[index + 1]?.focus();
      e.preventDefault();
    }
  };

  const handlePaste = (e) => {
    const text = (e.clipboardData.getData("text") || "").replace(/\D/g, "").slice(0, digits.length);
    if (!text) return;
    e.preventDefault();
    const next = [...digits];
    for (let i = 0; i < digits.length; i++) {
      next[i] = text[i] || "";
    }
    setDigits(next);
    const firstEmpty = next.findIndex((d) => d === "");
    const focusIndex = firstEmpty === -1 ? digits.length - 1 : firstEmpty;
    inputsRef.current[focusIndex]?.focus();
    if (touched) {
      const joined = next.join("").trim();
      if (joined.length === next.length) {
        setError(validate(joined));
      } else {
        setError("");
      }
    }
  };

  const handleBlur = () => {
    setTouched(true);
<<<<<<< HEAD
    const joined = digits.join("").trim();
    if (joined.length === digits.length) {
      setError(validate(joined));
    } else {
      setError("");
=======
    setError(validateSoft(digits.join("").trim()));
  };

  const resendOtp = async () => {
    try {
      await axios.post("/api/auth/send-otp", { email });
      toast.success("OTP sent again to your email");
      setDigits(["", "", "", "", "", ""]);
      inputsRef.current[0]?.focus();
      setTouched(false);
      setError("");
      setTimeLeft(120);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resend OTP");
>>>>>>> origin/auth-naeem
    }
  };

  return (
<<<<<<< HEAD
    <div className="row justify-content-center">
      <div className="col-12 col-md-7 col-lg-5">
        <div className="card shadow-sm">
          <div className="card-body p-4">
            <h3 className="text-center mb-4">Verify your email</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Enter OTP sent to {email}</label>
                <div className="d-flex justify-content-center gap-2" onPaste={handlePaste}>
                  {digits.map((d, i) => (
                    <input
                      key={i}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      className={`form-control text-center fs-4 py-2 ${touched && digits.every((x) => x !== "") && error ? "is-invalid" : ""}`}
                      style={{ width: "48px", height: "56px" }}
                      value={d}
                      ref={(el) => (inputsRef.current[i] = el)}
                      onChange={(e) => handleChange(i, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(i, e)}
                      onBlur={handleBlur}
                    />
                  ))}
                </div>
                {touched && error ? <div className="invalid-feedback d-block">{error}</div> : null}
=======
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5 col-xxl-4">
          <div className="card shadow border-0">
            <div className="card-header bg-transparent py-4">
              <div className="text-center">
                <h2 className="h3 fw-bold mb-2">Verify your email</h2>
                <p className="text-muted mb-0">Enter the OTP sent to your email</p>
>>>>>>> origin/auth-naeem
              </div>
            </div>
            
            <div className="card-body p-4 p-md-5">
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="form-label fw-semibold text-center w-100">
                    OTP sent to: <span className="text-primary">{email}</span>
                  </label>
                  <div className="d-flex justify-content-center gap-2 gap-sm-3 mb-3" onPaste={handlePaste}>
                    {digits.map((d, i) => (
                      <input
                        key={i}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={1}
                        className={`text-center otp-input ${touched && error ? "is-invalid" : ""}`}
                        style={{ width: "44px", height: "48px", fontSize: "22px", fontWeight: 600, color: "#111", backgroundColor: "#fff", lineHeight: "48px" }}
                        autoComplete="one-time-code"
                        value={d}
                        ref={(el) => (inputsRef.current[i] = el)}
                        onChange={(e) => handleChange(i, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(i, e)}
                        onFocus={(e) => e.target.select()}
                        onBlur={handleBlur}
                      />
                    ))}
                  </div>
                  {touched && error ? (
                    <div className="invalid-feedback d-block text-center">{error}</div>
                  ) : null}
                  <div className="text-center mt-2 small text-muted">
                    {timeLeft > 0 ? (
                      <span>
                        Code expires in {String(Math.floor(timeLeft / 60)).padStart(1, "0")}:
                        {String(timeLeft % 60).padStart(2, "0")}
                      </span>
                    ) : (
                      <span>Code expired. You can resend a new OTP.</span>
                    )}
                  </div>
                </div>
                
                <button className="btn btn-primary w-100 py-2" type="submit" disabled={timeLeft <= 0}>
                  Verify OTP
                </button>
                
                <div className="text-center mt-3">
                  <small className="text-muted">
                    Didn't receive the code?{" "}
                    <button type="button" className="btn btn-link p-0 text-primary text-decoration-none" onClick={resendOtp} disabled={timeLeft > 0}>
                      Resend OTP
                    </button>
                  </small>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
