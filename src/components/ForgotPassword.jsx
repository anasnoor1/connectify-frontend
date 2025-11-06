import React, { useState } from "react";
import { FiMail, FiLock, FiEye, FiEyeOff, FiKey, FiX } from "react-icons/fi";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

const particleOptions = {
  particles: {
    number: { value: 80, density: { enable: true, value_area: 800 } },
    color: { value: "#9e9e9e" },
    shape: { type: "circle" },
    opacity: { value: 0.5 },
    size: { value: 3, random: true },
    line_linked: {
      enable: true,
      distance: 150,
      color: "#9e9e9e",
      opacity: 0.4,
      width: 1,
    },
    move: { enable: true, speed: 2 },
  },
  interactivity: {
    detect_on: "canvas",
    events: {
      onhover: { enable: true, mode: "grab" },
      onclick: { enable: true, mode: "push" },
      resize: true,
    },
    modes: {
      grab: { distance: 140, line_linked: { opacity: 1 } },
      push: { particles_number: 4 },
    },
  },
  retina_detect: true,
  background: { color: "#1f2937" },
};

const EmailSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email is required"),
});

const OtpSchema = Yup.object({
  otp: Yup.string().trim().required("Enter OTP"),
});

const ResetSchema = Yup.object({
  newPassword: Yup.string()
    .min(8, "Minimum 8 characters")
    .matches(/[a-z]/, "At least one lowercase letter")
    .matches(/[A-Z]/, "At least one uppercase letter")
    .matches(/[0-9]/, "At least one number")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword"), null], "Passwords do not match")
    .required("Please confirm password"),
});

const ForgotPassword = () => {
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const particlesInit = async (engine) => await loadSlim(engine);

  // --- Step 1: Request OTP ---
  const requestOtp = async (values, { setSubmitting }) => {
    const normalized = String(values.email).trim();
    try {
      setLoading(true);
      await axios.post("/api/auth/password/forgot", { email: normalized });
      toast.success("OTP sent to your email");
      setEmail(normalized);
      setStep("otp");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  // --- Step 2: Verify OTP ---
  const verifyOtp = async (values, { setSubmitting }) => {
    try {
      setLoading(true);
      await axios.post("/api/auth/password/verify-reset", { email, otp: values.otp });
      toast.success("OTP verified");
      setOtp(values.otp);
      setStep("reset");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  // --- Step 3: Update Password ---
  const updatePassword = async (values, { setSubmitting }) => {
    try {
      setLoading(true);
      await axios.put("/api/auth/password/update", { email: String(email).trim(), otp, newPassword: values.newPassword });
      toast.success("Password updated successfully!");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update password");
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center p-4 bg-gray-900">
      {/* Background Particles */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={particleOptions}
        className="absolute inset-0 z-0"
      />

      {/* Forgot Password Card */}
      <div className="relative z-10 flex max-w-4xl w-full mx-auto shadow-2xl rounded-xl overflow-hidden">
        {/* Left Side (Gradient Info) */}
        <div className="flex-1 relative p-10 text-white bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 hidden lg:block">
          <div className="relative z-10">
            <h1 className="text-4xl font-bold mb-4">Reset Your Password</h1>
            <p className="text-md font-light">
              Secure your account by resetting your password. Enter your email,
              verify with the OTP, and create a new password to regain access.
            </p>
          </div>
          <div className="absolute top-1/4 left-1/4 h-3 w-40 bg-orange-400 opacity-70 transform -rotate-45 rounded-full z-0"></div>
          <div className="absolute top-2/3 left-1/3 h-5 w-64 bg-pink-400 opacity-60 transform -skew-y-12 rounded-full z-0"></div>
          <div className="absolute bottom-1/4 right-1/4 h-2 w-32 bg-orange-300 opacity-80 transform rotate-12 rounded-full z-0"></div>
        </div>

        {/* Right Side (Form Steps) */}
        <div className="flex-1 bg-white p-10 flex flex-col justify-center min-w-[350px]">
          {/* Close (Back) Button */}
          <button
            type="button"
            aria-label="Close"
            onClick={() => navigate(-1)}
            className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
            title="Close"
          >
            <FiX size={20} />
          </button>
          <h2 className="text-xl font-semibold text-center mb-8 tracking-wider text-gray-700">
            {step === "email" && "FORGOT PASSWORD"}
            {step === "otp" && "VERIFY OTP"}
            {step === "reset" && "RESET PASSWORD"}
          </h2>

          {/* Step 1: Email */}
          {step === "email" && (
            <Formik initialValues={{ email }} validationSchema={EmailSchema} onSubmit={requestOtp} enableReinitialize>
              {({ isSubmitting, errors, touched }) => (
                <Form className="space-y-5">
                  <div className="relative">
                    <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Field
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      className={`w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        errors.email && touched.email ? "border-red-500" : "border-gray-300"
                      }`}
                      disabled={loading}
                    />
                    {errors.email && touched.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading || isSubmitting}
                    className="w-full py-3 text-white font-semibold rounded-lg 
                    bg-gradient-to-r from-purple-500 to-indigo-600 
                    hover:from-purple-600 hover:to-indigo-700 
                    transition duration-150 ease-in-out cursor-pointer"
                  >
                    {loading || isSubmitting ? "Sending..." : "Send OTP"}
                  </button>
                </Form>
              )}
            </Formik>
          )}

          {/* Step 2: OTP */}
          {step === "otp" && (
            <Formik initialValues={{ otp }} validationSchema={OtpSchema} onSubmit={verifyOtp} enableReinitialize>
              {({ isSubmitting, errors, touched }) => (
                <Form className="space-y-5">
                  <div className="relative">
                    <FiKey className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Field
                      name="otp"
                      type="text"
                      placeholder="Enter OTP"
                      className={`w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        errors.otp && touched.otp ? "border-red-500" : "border-gray-300"
                      }`}
                      disabled={loading}
                    />
                    {errors.otp && touched.otp && (
                      <p className="text-red-500 text-sm mt-1">{errors.otp}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading || isSubmitting}
                    className="w-full py-3 text-white font-semibold rounded-lg 
                    bg-gradient-to-r from-purple-500 to-indigo-600 
                    hover:from-purple-600 hover:to-indigo-700 
                    transition duration-150 ease-in-out cursor-pointer"
                  >
                    {loading || isSubmitting ? "Verifying..." : "Verify OTP"}
                  </button>

                  <button
                    type="button"
                    onClick={() => requestOtp({ email }, { setSubmitting: () => {} })}
                    disabled={loading}
                    className="text-sm text-indigo-600 hover:text-indigo-800 mt-2"
                  >
                    Resend OTP
                  </button>
                </Form>
              )}
            </Formik>
          )}

          {/* Step 3: Reset Password */}
          {step === "reset" && (
            <Formik
              initialValues={{ newPassword: "", confirmPassword: "" }}
              validationSchema={ResetSchema}
              onSubmit={updatePassword}
            >
              {({ isSubmitting, errors, touched }) => (
                <Form className="space-y-5">
                  <div className="relative">
                    <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Field
                      name="newPassword"
                      type={showNew ? "text" : "password"}
                      placeholder="New Password"
                      className={`w-full p-3 pl-10 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        errors.newPassword && touched.newPassword ? "border-red-500" : "border-gray-300"
                      }`}
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showNew ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </button>
                    {errors.newPassword && touched.newPassword && (
                      <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
                    )}
                  </div>

                  <div className="relative">
                    <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Field
                      name="confirmPassword"
                      type={showConfirm ? "text" : "password"}
                      placeholder="Confirm Password"
                      className={`w-full p-3 pl-10 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        errors.confirmPassword && touched.confirmPassword ? "border-red-500" : "border-gray-300"
                      }`}
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirm ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </button>
                    {errors.confirmPassword && touched.confirmPassword && (
                      <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading || isSubmitting}
                    className="w-full py-3 text-white font-semibold rounded-lg 
                    bg-gradient-to-r from-purple-500 to-indigo-600 
                    hover:from-purple-600 hover:to-indigo-700 
                    transition duration-150 ease-in-out cursor-pointer"
                  >
                    {loading || isSubmitting ? "Updating..." : "Confirm"}
                  </button>
                </Form>
              )}
            </Formik>
          )}

          {/* Back to Login */}
          <div className="text-center mt-6 text-sm text-gray-600">
            Remembered your password?{" "}
            <Link
              to="/login"
              className="text-purple-600 hover:text-purple-800 font-semibold"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
