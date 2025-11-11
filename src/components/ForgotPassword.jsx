import React, { useState } from "react";
import { FiMail, FiX, FiArrowLeft } from "react-icons/fi";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";


// Email validation schema matching Signup component
const ForgotPasswordSchema = Yup.object({
  email: Yup.string()
    .matches(
      /^(?![.])(?!.*[.]{2})[A-Za-z0-9._%+-]+(?<![.])@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
      "Enter a valid email (like a@b.com, must have @ and dot, no spaces, 2 letters after dot)"
    )
    .required("Email is required"),
});

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
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const particlesInit = async (engine) => await loadSlim(engine);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setLoading(true);
      console.log("Sending OTP request to /api/auth/password/forgot with email:", values.email);
      
      // Add a timeout to the request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      try {
        const response = await axios.post(
          "/api/auth/password/forgot", 
          { email: values.email },
          { signal: controller.signal }
        );
        clearTimeout(timeoutId);
        
        console.log("OTP request successful:", response.data);
        toast.success("OTP sent to your email");
      
        // Navigate to the unified OTP verification page
        navigate("/verify-otp", { 
          state: { 
            email: values.email,
            from: 'forgot-password'
          },
          replace: true
        });
      } catch (requestError) {
        clearTimeout(timeoutId);
        throw requestError; // Re-throw to be caught by the outer catch
      }
    } catch (err) {
      console.error("Error in requestOtp:", err);
      
      if (err.code === 'ECONNABORTED' || err.message === 'canceled') {
        toast.error("Request timed out. Please check your internet connection.");
      } else if (err.response) {
        // Server responded with an error
        console.error("Server error:", err.response.data);
        toast.error(err.response.data?.message || "Failed to send OTP. Please try again.");
      } else if (err.request) {
        // No response received
        console.error("No response from server:", err.request);
        toast.error("Could not connect to the server. Please try again later.");
      } else {
        // Other errors
        console.error("Error:", err.message);
        toast.error("An unexpected error occurred. Please try again.");
      }
      throw err; // Re-throw the error to be handled by Formik
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
      <div className="relative z-10 w-full max-w-md mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="p-8">
          <div className="flex items-center mb-6">
            <button
              onClick={() => navigate(-1)}
              className="mr-4 p-1 rounded-full hover:bg-gray-100 text-gray-600 hover:text-gray-800 transition-colors"
              aria-label="Go back"
            >
              <FiArrowLeft size={20} />
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Reset Password</h1>
          </div>

          <p className="text-gray-600 mb-6">
            Enter your email address and we'll send you a verification code to
            reset your password.
          </p>

          <Formik
            initialValues={{ email: '' }}
            validationSchema={ForgotPasswordSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form className="space-y-6">
                <div className="space-y-1">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className="h-5 w-5 text-gray-400" />
                    </div>
                    <Field
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      className={`block w-full pl-10 pr-3 py-2 border ${errors.email && touched.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      placeholder="you@example.com"
                    />
                  </div>
                  {errors.email && touched.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting || loading}
                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isSubmitting || loading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                  >
                    {loading ? 'Sending...' : 'Send Verification Code'}
                  </button>
                </div>
              </Form>
            )}
          </Formik>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Remember your password?{" "}
              <Link
                to="/login"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
