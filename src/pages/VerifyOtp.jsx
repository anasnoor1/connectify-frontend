import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { FiArrowLeft, FiX } from "react-icons/fi";

const VerifyOtp = () => {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [touched, setTouched] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const inputsRef = useRef([]);

  // Get email from URL params or location state
  const emailFromUrl = searchParams.get("email");
  const emailFromState = location.state?.email;
  const email = emailFromState || emailFromUrl;
  
  // Determine flow type (signup or password reset)
  const from = location.state?.from || 'signup';
  const isPasswordReset = from === 'forgot-password';

  // Determine localStorage key and API endpoints based on flow
  const localStorageKey = isPasswordReset ? "otpExpiryTime" : "signupOtpExpiryTime";
  const verifyEndpoint = isPasswordReset 
    ? "/api/auth/password/verify-reset" 
    : "/api/auth/verify-otp";
  const resendEndpoint = isPasswordReset
    ? "/api/auth/password/forgot"
    : "/api/auth/resend-otp";

  // UI text based on flow
  const title = isPasswordReset ? "Verify Your Identity" : "Verify Your Email";
  const buttonText = isPasswordReset ? "Continue to Reset Password" : "Verify Email";
  const successMessage = isPasswordReset 
    ? "OTP verified. Please set your new password." 
    : "Email verified successfully! You can now login.";
  const errorRedirect = isPasswordReset ? "/forgot-password" : "/signup";
  const errorMessage = isPasswordReset 
    ? "Invalid access. Please request a password reset first."
    : "Invalid access. Please sign up first.";

  // Redirect if no email is found or if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');

    // If user is already logged in, redirect to home
    if (token) {
      navigate('/', { replace: true });
      return;
    }

    // If no email in state or params, redirect based on flow
    if (!email) {
      toast.error(errorMessage);
      navigate(errorRedirect, { replace: true });
    }
  }, [email, navigate, errorMessage, errorRedirect]);

  // Focus first input on mount
  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  // Timer effect
  useEffect(() => {
    if (timeLeft <= 0) return;
    const id = setInterval(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [timeLeft]);

  // Initialize timer from localStorage
  useEffect(() => {
    const expiryTime = localStorage.getItem(localStorageKey);
    const now = Date.now();

    if (expiryTime) {
      const remaining = Math.floor((Number(expiryTime) - now) / 1000);
      if (remaining > 0) {
        setTimeLeft(remaining);
      } else {
        // Expired → reset timer
        const newExpiry = now + 120 * 1000;
        localStorage.setItem(localStorageKey, newExpiry);
        setTimeLeft(120);
        setDigits(["", "", "", "", "", ""]);
      }
    } else {
      // No existing timer, set a new expiry time
      const newExpiry = now + 120 * 1000;
      localStorage.setItem(localStorageKey, newExpiry);
      setTimeLeft(120);
    }
  }, [localStorageKey]);

  const validate = (value) => {
    if (!value) return "OTP is required";
    if (!/^\d{6}$/.test(value)) return "Enter a valid 6-digit OTP";
    return "";
  };

  const handleChange = (index, char) => {
    const c = char.replace(/[^0-9]/g, "");
    const next = [...digits];
    if (!c) {
      next[index] = "";
      setDigits(next);
      if (index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
      return;
    }
    next[index] = c;
    setDigits(next);
    if (index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
    if (touched) {
      const joined = next.join("");
      setError(joined.length === 6 ? validate(joined) : "");
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain').trim();
    if (!/^\d{6}$/.test(text)) {
      setError("Please paste a valid 6-digit OTP");
      return;
    }
    const next = [...digits];
    for (let i = 0; i < 6; i++) {
      next[i] = text[i] || "";
    }
    setDigits(next);
    inputsRef.current[5]?.focus();
    setTouched(true);
    setError("");
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleBlur = () => {
    setTouched(true);
    const joined = digits.join("");
    setError(joined.length === 6 ? validate(joined) : "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otp = digits.join("");
    const validationError = validate(otp);
    setError(validationError);
    setTouched(true);

    if (validationError) return;
    if (!email) {
      toast.error("Email not found. Please try again.");
      return;
    }

    try {
      setLoading(true);
      await axios.post(verifyEndpoint, { email, otp });
      
      // Clear expiry when verified
      localStorage.removeItem(localStorageKey);

      toast.success(successMessage);
      
      if (isPasswordReset) {
        // For password reset flow, navigate to reset password with email and otp
        navigate("/reset-password", {
          state: { email, otp },
          replace: true
        });
      } else {
        // For signup flow, navigate to login
        navigate("/login", {
          state: { email },
          replace: true
        });
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to verify OTP";
      console.error("OTP verification error:", errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    if (!email) {
      toast.error("Email not found. Please try again.");
      return;
    }

    try {
      setLoading(true);
      await axios.post(resendEndpoint, { email });
      
      // Reset timer and store new expiry
      const newExpiry = Date.now() + 120 * 1000;
      localStorage.setItem(localStorageKey, newExpiry);

      setTimeLeft(120);
      setDigits(["", "", "", "", "", ""]);
      inputsRef.current[0]?.focus();
      setTouched(false);
      setError("");
      toast.success("New OTP has been sent to your email");
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to resend OTP";
      console.error("Resend OTP error:", errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md relative">
        <button
          type="button"
          aria-label={isPasswordReset ? "Back" : "Close"}
          onClick={() => navigate(-1)}
          className={`absolute ${isPasswordReset ? 'left-3' : 'right-3'} top-3 text-gray-500 hover:text-gray-700`}
          title={isPasswordReset ? "Back" : "Close"}
        >
          {isPasswordReset ? <FiArrowLeft size={24} /> : <FiX size={24} />}
        </button>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            {title}
          </h2>
          <p className="text-gray-500 mb-6">
            We've sent a 6-digit verification code to
            <span className="text-indigo-600 font-medium"> {email}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center gap-3" onPaste={handlePaste}>
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
                disabled={loading}
                className={`w-12 h-12 text-center text-xl font-semibold rounded-lg border ${touched && error
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
                Code expired. You can request a new one.
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || timeLeft <= 0}
            className={`w-full py-3 font-semibold text-white rounded-lg transition duration-150 ease-in-out ${loading || timeLeft <= 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
              }`}
          >
            {loading ? "Verifying..." : buttonText}
          </button>

          <div className="text-center text-sm text-gray-600">
            Didn't receive the code?{" "}
            <button
              type="button"
              onClick={resendOtp}
              disabled={timeLeft > 0 || loading}
              className={`font-semibold transition ${timeLeft > 0 || loading
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-indigo-600 hover:text-indigo-800"
                }`}
            >
              Resend Code
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtp;
