import React, { useState, useEffect, useRef } from "react";
import { FiUser, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, Navigate, Link } from "react-router-dom";
import { setToken, getToken } from "../utills/checkToken";


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

const LoginSchema = Yup.object({
  email: Yup.string()
    .matches(
      /^(?![.])(?!.*[.]{2})[A-Za-z0-9._%+-]+(?<![.])@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
      "Enter a valid email (like a@b.com, must have @ and dot, no spaces, 2 letters after dot)"
    )
    .required("Email is required"),

  // password: Yup.string()
  //   .min(8, "Password must be at least 8 characters")
  //   .matches(/[a-z]/, "At least one lowercase letter")
  //   .matches(/[A-Z]/, "At least one uppercase letter")
  //   .matches(/[0-9]/, "At least one number")
  //   .matches(/[!@#$%^&*(),.?":{}|<>]/, "At least one special character")
  //   .required("Password is required"),
  password: Yup.string()
  .min(8, "Password must be at least 8 characters")
  .matches(/[a-z]/, "At least one lowercase letter")
  .matches(/[A-Z]/, "At least one uppercase letter")
  .matches(/[0-9]/, "At least one number")
  .matches(/[!@#$%^&*(),.?":{}|<>]/, "At least one special character")
  .matches(/^\S*$/, "Password cannot contain spaces") // <- disallow spaces
  .required("Password is required"),

});

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const googleBtnRef = useRef(null);
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("influencer");
  const [pendingIdToken, setPendingIdToken] = useState("");
  const [googleSubmitting, setGoogleSubmitting] = useState(false);

  if (getToken()) return <Navigate to="/" replace />;

  const particlesInit = async (engine) => await loadSlim(engine);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const google = window.google;
    if (!google || !google.accounts || !google.accounts.id) {
      console.log("Google API not loaded");
      return;
    }
    try {
      google.accounts.id.initialize({
        client_id: "720475734209-do0bg2s9kce36tp0hvc6dlfvh9qhtvnf.apps.googleusercontent.com",
        callback: (response) => {
          console.log("Google callback received:", response);
          const idToken = response?.credential;
          if (!idToken) {
            toast.error("Google sign-in failed - no token received");
            return;
          }
          console.log("Google ID token received, length:", idToken.length);
          setPendingIdToken(idToken);
          setRoleModalOpen(true);
        },
      });
      if (googleBtnRef.current) {
        google.accounts.id.renderButton(googleBtnRef.current, {
          theme: "outline",
          size: "large",
          text: "continue_with",
          shape: "rectangular",
          width: 320,
        });
        console.log("Google button rendered");
      }
    } catch (error) {
      console.error("Google Sign-In initialization error:", error);
    }
  }, []);

  const handleConfirmGoogleRole = async () => {
    if (!pendingIdToken) {
      toast.error("No Google token received");
      return;
    }

    setGoogleSubmitting(true);
    try {
      console.log('Sending Google auth request with:', {
        idTokenLength: pendingIdToken.length,
        role: selectedRole
      });

      const res = await axios.post("/api/auth/google", {
        idToken: pendingIdToken,
        role: selectedRole,
      });

      console.log('Google auth response:', res.data);

      const { token: jwtToken, user } = res.data || {};
      if (jwtToken) {
        // localStorage.setItem("token", jwtToken);
        setToken(jwtToken);
        if (user) localStorage.setItem("user", JSON.stringify(user));
        toast.success("Logged in with Google");
        setRoleModalOpen(false);
        setPendingIdToken("");
        navigate("/");
      } else {
        console.error('No token in response');
        toast.error("Login failed - no token received");
      }
    } catch (e) {
      console.error('Google auth error:', e);

      if (e?.response?.status === 403) {
        toast.error(e?.response?.data?.message || "Account is blocked");
      } else if (e?.response?.status === 409) {
        toast.error(e?.response?.data?.message || "Account already exists. Please login.");
      } else if (e?.response?.status === 401) {
        toast.error(e?.response?.data?.message || "Invalid Google token");
      } else if (e?.response?.status === 400) {
        toast.error(e?.response?.data?.message || "Bad request - missing information");
      } else if (e?.response?.data?.message) {
        toast.error(e.response.data.message);
      } else if (e?.request) {
        toast.error("Network error - cannot connect to server");
      } else {
        toast.error("Google authentication failed. Please try again.");
      }
    } finally {
      setGoogleSubmitting(false);
    }
  };

  const handleLogin = async (values, { setSubmitting }) => {
    try {
      const res = await axios.post("/api/auth/login", values);
      toast.success("Login successful");
      setToken(res.data.token);
      navigate("/");
    } catch (err) {
      if (err.response?.status === 403) {
        toast.error(
          err.response?.data?.message || "Please verify your email first."
        );
        navigate(`/verify?email=${encodeURIComponent(values.email)}`);
      } else if (err.response?.status === 401) {
        toast.error(err.response?.data?.message || "Invalid credentials");
      } else if (err.response?.status === 400) {
        toast.error(err.response?.data?.message || "Invalid credentials");
      } else {
        toast.error("Login failed");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center p-4 bg-gray-900">
      {/* Particles Background */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={particleOptions}
        className="absolute inset-0 z-0"
      />

      {/* Login Card */}
      <div className="relative z-10 flex max-w-4xl w-full mx-auto shadow-2xl rounded-xl overflow-hidden">
        <Link
          to="/"
          aria-label="Close"
          className="absolute top-3 right-3 z-20 text-white/90 hover:text-white bg-black/40 hover:bg-black/60 w-8 h-8 rounded-full grid place-items-center text-lg leading-none transition"
        >
          ×
        </Link>
        {/* Left Side */}
        <div className="flex-1 relative p-10 text-white bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 hidden lg:block">
          <div className="relative z-10">
            <h1 className="text-4xl font-bold mb-4">Welcome to Connectify</h1>
            <p className="text-md font-light">
              Log in to join your community. Connect with peers, share insights,
              and build professional relationships that power your success.
            </p>
          </div>
          <div className="absolute top-1/4 left-1/4 h-3 w-40 bg-orange-400 opacity-70 transform -rotate-45 rounded-full z-0"></div>
          <div className="absolute top-2/3 left-1/3 h-5 w-64 bg-pink-400 opacity-60 transform -skew-y-12 rounded-full z-0"></div>
          <div className="absolute bottom-1/4 right-1/4 h-2 w-32 bg-orange-300 opacity-80 transform rotate-12 rounded-full z-0"></div>
        </div>

        {/* Right Side */}
        <div className="flex-1 bg-white p-10 flex flex-col justify-center min-w-[350px]">
          <h2 className="text-xl font-semibold text-center mb-8 tracking-wider text-gray-700">
            USER LOGIN
          </h2>

          {/* ✅ Formik Form */}
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={LoginSchema}
            onSubmit={handleLogin}
          >
            {({ isSubmitting, errors, touched, isValid, dirty }) => (
              <Form noValidate>
                {/* Email Input */}
                <div className="mb-4 relative">
                  <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Field
                    type="email"
                    name="email"
                    placeholder="Enter Your Email"
                    className={`w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.email && touched.email
                        ? "border-red-500"
                        : "border-gray-300"
                      }`}
                  />
                  {errors.email && touched.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Password Input */}
                <div className="mb-6 relative">
                  <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Field
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    className={`w-full p-3 pl-10 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.password && touched.password
                        ? "border-red-500"
                        : "border-gray-300"
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                  {errors.password && touched.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Forgot Password */}
                <div className="flex justify-end mb-6 text-sm">
                  <Link
                    to="/forgot-password"
                    className="text-purple-600 hover:text-purple-800 transition duration-150"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 text-white font-semibold rounded-lg
              bg-gradient-to-r from-purple-500 to-indigo-600
              hover:from-purple-600 hover:to-indigo-700
              transition duration-150 ease-in-out cursor-pointer"
                >
                  {isSubmitting ? "Logging in..." : "LOGIN"}
                </button>

                {/* Signup Link */}
                <div className="text-center mt-6 text-sm text-gray-600">
                  New here?{" "}
                  <Link
                    to="/signup"
                    className="text-purple-600 hover:text-purple-800 font-semibold"
                  >
                    Create an account
                  </Link>
                </div>
              </Form>
            )}
          </Formik>
          <div className="flex items-center my-4">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="px-3 text-sm text-gray-500">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
          <div className="w-full flex justify-center">
            <div ref={googleBtnRef} />
          </div>
        </div>
      </div>

      {/* Role Selection Modal */}
      {roleModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Select Your Role</h3>
            <p className="text-gray-600 mb-6">Please choose how you want to use Connectify:</p>

            <div className="flex gap-4 mb-6">
              {["influencer", "brand"].map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setSelectedRole(role)}
                  className={`flex-1 py-3 rounded-lg border-2 font-semibold transition ${selectedRole === role
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "border-gray-300 text-gray-600 hover:border-indigo-400 hover:bg-gray-50"
                    }`}
                >
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setRoleModalOpen(false);
                  setPendingIdToken("");
                }}
                className="flex-1 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition font-medium"
                disabled={googleSubmitting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmGoogleRole}
                disabled={googleSubmitting}
                className="flex-1 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {googleSubmitting ? "Continuing..." : "Continue"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
