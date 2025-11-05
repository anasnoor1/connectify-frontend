import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useSearchParams, useNavigate } from "react-router-dom";

const VerifyOtp = () => {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [touched, setTouched] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
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
    const next = [...digits];
    if (!c) {
      next[index] = "";
      setDigits(next);
      return;
    }
    next[index] = c.charAt(0);
    setDigits(next);
    if (index < inputsRef.current.length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
    if (touched) {
      const joined = next.join("").trim();
      setError(joined.length === next.length ? validate(joined) : "");
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
    const text = (e.clipboardData.getData("text") || "")
      .replace(/\D/g, "")
      .slice(0, digits.length);
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
      setError(joined.length === next.length ? validate(joined) : "");
    }
  };

  const handleBlur = () => {
    setTouched(true);
    const joined = digits.join("").trim();
    setError(
      joined.length === digits.length ? validate(joined) : validateSoft(joined)
    );
  };

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
      sessionStorage.removeItem("allowVerifyOtp");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Verification failed");
    }
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
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center p-4 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
      <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm"></div>

      <div className="relative z-10 w-full max-w-md bg-white rounded-xl shadow-2xl p-8">
        <button
          type="button"
          aria-label="Close"
          onClick={() => {
            sessionStorage.removeItem("allowVerifyOtp");
            navigate(-1)}}
          className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
          title="Close"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-3">
          Verify Your Email
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Enter the 6-digit code sent to{" "}
          <span className="text-indigo-600 font-medium">{email}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div
            className="flex justify-center gap-3"
            onPaste={handlePaste}
          >
            {digits.map((d, i) => (
              <input
                key={i}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={d}
                ref={(el) => (inputsRef.current[i] = el)}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onFocus={(e) => e.target.select()}
                onBlur={handleBlur}
                className={`w-12 h-12 text-center text-xl font-semibold rounded-lg border ${
                  touched && error
                    ? "border-red-500"
                    : "border-gray-300 focus:border-indigo-500"
                } focus:ring-2 focus:ring-indigo-500 outline-none`}
              />
            ))}
          </div>

          {touched && error && (
            <p className="text-center text-red-500 text-sm">{error}</p>
          )}

          <div className="text-center text-sm text-gray-500">
            {timeLeft > 0 ? (
              <span>
                Code expires in{" "}
                <span className="font-semibold text-indigo-600">
                  {String(Math.floor(timeLeft / 60)).padStart(1, "0")}:
                  {String(timeLeft % 60).padStart(2, "0")}
                </span>
              </span>
            ) : (
              <span className="text-red-500 font-medium">
                Code expired. You can resend a new OTP.
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={timeLeft <= 0}
            className={`w-full py-3 font-semibold text-white rounded-lg transition duration-150 ease-in-out cursor-pointer 
            ${
              timeLeft <= 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
            }`}
          >
            Verify OTP
          </button>

          <div className="text-center text-sm text-gray-600">
            Didn’t receive the code?{" "}
            <button
              type="button"
              onClick={resendOtp}
              disabled={timeLeft > 0}
              className={`font-semibold transition ${
                timeLeft > 0
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-indigo-600 hover:text-indigo-800 cursor-pointer"
              }`}
            >
              Resend OTP
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtp;