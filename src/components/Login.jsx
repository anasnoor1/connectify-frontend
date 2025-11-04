import React, { useState } from "react";
import { FiUser, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, Navigate, Link } from "react-router-dom";
import { setToken, getToken } from "../utills/checkToken";
import { useGoogleLogin } from '@react-oauth/google'; 

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

// ✅ Yup validation
const LoginSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().required("Required"),
});

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  
  // Redirect if already logged in
  if (getToken()) return <Navigate to="/" replace />;

  // Handle Google OAuth
  const handleGoogleSuccess = async (tokenResponse) => {
    if (!tokenResponse) {
      toast.error('No response from Google. Please try again.');
      return;
    }

    const idToken = tokenResponse.access_token || tokenResponse.credential;
    if (!idToken) {
      toast.error('Failed to get token from Google. Please try again.');
      return;
    }

    try {
      setIsGoogleSubmitting(true);
      const response = await axios.post(
        "/api/auth/google", 
        { idToken },
        {
          timeout: 10000,
          headers: { 'Content-Type': 'application/json' }
        }
      );
      
      if (!response?.data?.token) {
        throw new Error('No authentication token received');
      }

      setToken(response.data.token);
      
      // Store additional user data if available
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }

      toast.success(`Welcome back!`);
      navigate("/");
      
    } catch (error) {
      console.error('Google auth failed:', error);
      
      if (error.code === 'ERR_NETWORK') {
        toast.error('Network error. Please check your connection.');
      } else if (error.response?.status === 401) {
        toast.error('Invalid credentials. Please try again.');
      } else if (error.response?.status === 404) {
        toast.info('No account found. Please sign up first.');
        navigate('/signup');
      } else {
        toast.error(error.response?.data?.message || 'Google authentication failed');
      }
    } finally {
      setIsGoogleSubmitting(false);
    }
  };

  const handleGoogleError = (error) => {
    console.error('Google sign in error:', error);
    
    // Don't show error if user closed the popup
    if (error.error !== 'popup_closed_by_user') {
      toast.error("Failed to sign in with Google. Please try again.");
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: handleGoogleError,
    flow: 'implicit',
    prompt: 'select_account', // Always show account selection
    scope: 'profile email',   // Request basic profile info and email
  });

  const particlesInit = async (engine) => await loadSlim(engine);


  const handleLogin = async (values, { setSubmitting }) => {
    try {
      setSubmitting(true);
      const response = await axios.post(
        "/api/auth/login", 
        values,
        {
          timeout: 10000,
          headers: { 'Content-Type': 'application/json' }
        }
      );
      
      if (response.data.token) {
        setToken(response.data.token);
        
        // Store additional user data if available
        if (response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        
        toast.success("Login successful");
        navigate("/");
      } else {
        throw new Error('No token received');
      }
    } catch (err) {
      console.error('Login error:', err);
      
      if (err.code === 'ERR_NETWORK') {
        toast.error('Network error. Please check your connection.');
      } else if (err.response?.status === 403) {
        const message = err.response?.data?.message || "Please verify your email first.";
        toast.error(message);
        navigate(`/verify?email=${encodeURIComponent(values.email)}`);
      } else if (err.response?.status === 400 || err.response?.status === 401) {
        toast.error(err.response?.data?.message || "Invalid email or password");
      } else if (err.response?.status === 500) {
        toast.error('Server error. Please try again later.');
      } else {
        toast.error(err.response?.data?.message || "Login failed. Please try again.");
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
            {({ isSubmitting, errors, touched }) => (
              <Form>
                {/* Email Input */}
                <div className="mb-4 relative">
                  <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Field
                    type="email"
                    name="email"
                    placeholder="Username or Email"
                    className={`w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      errors.email && touched.email
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
                    className={`w-full p-3 pl-10 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      errors.password && touched.password
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
                    to="/forgot"
                    className="text-purple-600 hover:text-purple-800 transition duration-150"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 text-white font-semibold rounded-lg
                  bg-gradient-to-r from-purple-500 to-indigo-600
                  hover:from-purple-600 hover:to-indigo-700
                  transition duration-150 ease-in-out mb-4
                  ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Logging in...
                    </span>
                  ) : 'LOGIN'}
                </button>

                {/* Divider */}
                <div className="flex items-center my-4">
                  <div className="flex-1 h-px bg-gray-200"></div>
                  <span className="px-4 text-gray-500 text-sm">OR</span>
                  <div className="flex-1 h-px bg-gray-200"></div>
                </div>

                {/* Google Sign In Button */}
                <button
                  type="button"
                  onClick={googleLogin}
                  disabled={isGoogleSubmitting}
                  className="w-full flex items-center justify-center gap-2 bg-white text-gray-800 py-3 px-4 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors mb-6 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isGoogleSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Signing in with Google...</span>
                    </>
                  ) : (
                    <>
                      <FcGoogle className="text-xl" />
                      <span>Continue with Google</span>
                    </>
                  )}
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
        </div>
      </div>
    </div>
  );
};

export default Login;