import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useSearchParams, useNavigate } from "react-router-dom";

const VerifyOtp = () => {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [touched, setTouched] = useState(false);
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const navigate = useNavigate();
  const inputsRef = useRef([]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const value = digits.join("").trim();
    const msg = validate(value);
    setError(msg);
    setTouched(true);
    if (msg) {
      toast.error("Please fix the highlighted errors");
      return;
    }
    try {
      const res = await axios.post("http://localhost:5000/api/auth/verify-otp", { email, otp: value });
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
    if (touched) {
      const joined = next.join("").trim();
      if (joined.length === next.length) {
        setError(validate(joined));
      } else {
        setError("");
      }
    }
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
    const joined = digits.join("").trim();
    if (joined.length === digits.length) {
      setError(validate(joined));
    } else {
      setError("");
    }
  };

  return (
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
              </div>
              <button className="btn btn-primary w-100" type="submit">
                Verify
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
