import React, { useState,useEffect} from "react";
import { FiUser, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { setToken , getToken} from "../utills/check token";

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

// ✅ Yup validation (email check only)
const LoginSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().required("Required"),
});

 const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Load Google Sign-In script
    const loadGoogleScript = () => {
      if (document.getElementById('google-signin-script')) return;
      
      const script = document.createElement('script');
      script.id = 'google-signin-script';
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    };
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (token) return <Navigate to="/" replace />;

  const particlesInit = async (engine) => await loadSlim(engine);

  const handleLogin = async (values, { setSubmitting }) => {
    try {
      const res = await axios.post("/api/auth/login", values);
      toast.success("Login successful");

      // localStorage.setItem("token", res.data.token);

      setToken(res.data.token);
      navigate("/");
    } catch (err) {
      if (err.response?.status === 403) {
        toast.error(err.response?.data?.message || "Please verify your email first.");
        navigate(`/verify?email=${encodeURIComponent(values.email)}`);
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
                    <p className="text-red-500 text-sm mt-1">{errors.password}</p>
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
        </div>
      </div>
    </div>
  );
});
 }
export default Login;

