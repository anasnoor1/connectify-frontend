import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { FiKey, FiArrowLeft, FiX } from "react-icons/fi";

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

  // Log the current location and search params for debugging
  console.log('Current location:', location);
  console.log('Search params:', Object.fromEntries(searchParams.entries()));
  
  // Get email from URL params or location state
  const emailFromUrl = searchParams.get("email");
  const locationState = location.state || {};
  const emailFromState = locationState.email;
  const from = locationState.from || 'signup'; // Default to 'signup' if not specified
  
  const email = emailFromState || emailFromUrl;
  const isPasswordReset = from === 'forgot-password';
  
  console.log('Email from state/URL:', { email, from, isPasswordReset });
  
  // Redirect if no email is found
  useEffect(() => {
    console.log('VerifyOtp component mounted with:', { 
      email, 
      from, 
      isPasswordReset,
      locationState,
      searchParams: Object.fromEntries(searchParams.entries())
    });
    
    if (!email) {
      console.log('No email found, redirecting...');
      toast.error("Email not found. Please try again.");
      const redirectTo = isPasswordReset ? '/forgot-password' : '/signup';
      console.log('Redirecting to:', redirectTo);
      navigate(redirectTo, { replace: true });
    } else {
      console.log('Email found, rendering OTP form');
    }
  }, [email, isPasswordReset, navigate]);

  // API endpoints based on flow
  const verifyEndpoint = isPasswordReset 
    ? "/api/auth/password/verify-reset" 
    : "/api/auth/verify-otp";
  const resendEndpoint = isPasswordReset
    ? "/api/auth/password/forgot"
    : "/api/auth/resend-otp";
  const successMessage = isPasswordReset 
    ? "OTP verified. Please set your new password." 
    : "Email verified successfully!";
  const successRedirect = isPasswordReset 
    ? "/reset-password" 
    : "/login";

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
      console.log("Verifying OTP for:", { email, otp, verifyEndpoint });
      
      // Verify the OTP
      const response = await axios.post(verifyEndpoint, { email, otp });
      console.log("OTP verification response:", response.data);
      
      toast.success(successMessage);
      
      if (isPasswordReset) {
        // For password reset flow
        console.log("Navigating to reset-password with state:", { email, otp });
        navigate("/reset-password", { 
          state: { 
            email, 
            otp,
            from: 'verify-otp' 
          },
          replace: true
        });
      } else {
        // For signup flow
        navigate("/login", { 
          state: { email },
          replace: true 
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to verify OTP");
      toast.error(err.response?.data?.message || "Failed to verify OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      toast.error("Email not found. Please try again.");
      return;
    }
    
    try {
      setLoading(true);
      console.log("Resending OTP to:", email);
      
      await axios.post(resendEndpoint, { email });
      
      // Reset the form
      setDigits(["", "", "", "", "", ""]);
      inputsRef.current[0]?.focus();
      setTouched(false);
      setError("");
      setTimeLeft(120);
      
      toast.success("OTP has been resent to your email");
    } catch (err) {
      console.error("Error resending OTP:", err);
      const errorMessage = err.response?.data?.message || "Failed to resend OTP";
      toast.error(errorMessage);
      
      // If email is invalid or not found
      if (err.response?.status === 400 || err.response?.status === 404) {
        navigate(isPasswordReset ? '/forgot-password' : '/signup');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center p-4 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
      <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm"></div>

      <div className="relative z-10 w-full max-w-md bg-white rounded-xl shadow-2xl p-8">
        <button
          type="button"
          aria-label="Close"
          onClick={() => navigate(-1)}
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