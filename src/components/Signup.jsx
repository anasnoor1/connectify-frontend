import React, { useState } from "react";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, Navigate, Link } from "react-router-dom";
<<<<<<< HEAD
import { useGoogleLogin } from "@react-oauth/google";
import { setToken, getToken } from "../utills/checkToken";
=======
import { isLoggedIn } from "../utills/checkToken";
>>>>>>> auth-naeem

// ✅ Particles Config
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

<<<<<<< HEAD
// ✅ Validation Schema
=======
// ✅ Updated Validation Schema
>>>>>>> auth-naeem
const SignupSchema = Yup.object({
  name: Yup.string()
    .matches(
      /^(?! )[A-Za-z]+(?: [A-Za-z]+)*(?<! )$/,
      "Only letters allowed, single spaces between words, no leading/trailing/multiple spaces"
    )
    .min(3, "Name must be at least 3 characters")
    .required("Name is required"),
  email: Yup.string()
    .matches(
      /^(?![.])(?!.*[.]{2})[A-Za-z0-9._%+-]+(?<![.])@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
      "Enter a valid email (like a@b.com, must have @ and dot, no spaces, 2 letters after dot)"
    )
    .required("Email is required"),
  password: Yup.string()
    .matches(
      /^(?!\s)(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/,
      "Password must be at least 8 characters, include 1 uppercase, 1 number, 1 symbol, and cannot start with space"
    )
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
  role: Yup.string()
    .oneOf(["influencer", "brand"], "Role is required")
    .required("Role is required"),
});

// ✅ Prevent leading space & numbers in name
const handleInputChange = (e, setFieldValue) => {
  const { name, value } = e.target;
  if (value.startsWith(" ")) return; // block leading space
  if (name === "name" && /\d/.test(value)) return; // block numbers
  setFieldValue(name, value);
};

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
<<<<<<< HEAD
  const [googleSubmitting, setGoogleSubmitting] = useState(false);
  const [selectedRole, setSelectedRole] = useState("influencer");

  if (getToken()) return <Navigate to="/" replace />;
=======

  if (isLoggedIn()) return <Navigate to="/" replace />;
>>>>>>> auth-naeem

  // ✅ Particles Init
  const particlesInit = async (engine) => await loadSlim(engine);

  // ✅ Handle Regular Signup
  const handleSignup = async (values, { setSubmitting }) => {
    try {
      setLoading(true);
      const res = await axios.post("/api/auth/register", values);
      toast.success(res.data.message || "Verification code sent to your email");
      
      // Navigate to the new signup OTP verification page
      navigate("/verify-otp-signup", { 
        state: { 
          email: values.email,
          from: 'signup'
        },
        replace: true 
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

<<<<<<< HEAD
  // ✅ Handle Google Signup
  const handleGoogleSuccess = async (tokenResponse) => {
    const idToken = tokenResponse?.access_token || tokenResponse?.credential;
    if (!idToken) return toast.error("Failed to get token from Google.");

    try {
      setGoogleSubmitting(true);

      const response = await axios.post(
        "/api/auth/google",
        { idToken, role: selectedRole },
        { headers: { "Content-Type": "application/json" }, timeout: 10000 }
      );

      if (!response?.data?.token) throw new Error("No authentication token received");

      setToken(response.data.token);
      if (response.data.user)
        localStorage.setItem("user", JSON.stringify(response.data.user));

      toast.success(`Welcome ${response.data.user?.name || "User"}!`);
      navigate("/");
    } catch (error) {
      console.error("Google authentication error:", error);
      const status = error.response?.status;
      if (status === 409) {
        toast.info("Account already exists. Please log in.");
        navigate("/login", { state: { email: error.response.data?.email } });
      } else if (status === 500) {
        toast.error("Server error. Try again later.");
      } else {
        toast.error(error.response?.data?.message || "Authentication failed.");
      }
    } finally {
      setGoogleSubmitting(false);
    }
  };

  const handleGoogleError = (error) => {
    console.error("Google authentication error:", error);
    if (error.error === "popup_closed_by_user") toast.info("Sign in was cancelled");
    else toast.error("Failed to sign in with Google. Please try again.");
  };

  const googleSignup = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: handleGoogleError,
    flow: "implicit",
    prompt: "select_account",
    scope: "profile email",
  });

  // ✅ Google Sign Up Trigger
  const handleGoogleSignupWithRole = () => {
    googleSignup();
  };

  return (
    <div className="relative min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <Particles id="tsparticles" init={particlesInit} options={particleOptions} className="absolute inset-0 z-0" />
=======
  return (
    <div className="relative flex min-h-screen items-center justify-center p-4 bg-gray-900">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={particleOptions}
        className="absolute inset-0 z-0"
      />
>>>>>>> auth-naeem

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
          <h1 className="text-4xl font-bold mb-4">Join Connectify</h1>
          <p className="text-md font-light">
            Create your account and be part of a community that connects influencers and brands to grow together.
          </p>
        </div>

        {/* Right Side */}
        <div className="flex-1 bg-white p-10 flex flex-col justify-center min-w-[350px]">
          <h2 className="text-xl font-semibold text-center mb-8 tracking-wider text-gray-700">
            CREATE ACCOUNT
          </h2>

          <Formik
            initialValues={{
              name: "",
              email: "",
              password: "",
              confirmPassword: "",
<<<<<<< HEAD
              role: selectedRole,
=======
              role: "",
>>>>>>> auth-naeem
            }}
            validationSchema={SignupSchema}
            onSubmit={handleSignup}
          >
            {({ isSubmitting, errors, touched, values, setFieldValue }) => (
              <Form>
                {/* Role Selector */}
                <div className="flex gap-4 mb-6">
                  {["influencer", "brand"].map((role) => (
                    <button
                      type="button"
                      key={role}
<<<<<<< HEAD
                      onClick={() => {
                        setFieldValue("role", role);
                        setSelectedRole(role);
                      }}
                      className={`w-1/2 py-2 rounded-md border font-semibold transition ${
                        values.role === role
=======
                      onClick={() => setFieldValue("role", role)}
                      className={`w-1/2 py-2 rounded-md border font-semibold transition ${values.role === role
>>>>>>> auth-naeem
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "border-gray-300 text-gray-600 hover:bg-gray-100"
                        }`}
                    >
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </button>
                  ))}
                </div>

                {/* Name */}
                <div className="mb-4 relative">
                  <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Field
                    name="name"
                    type="text"
                    placeholder="Full Name"
<<<<<<< HEAD
                    className={`w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.name && touched.name ? "border-red-500" : "border-gray-300"
                    }`}
=======
                    value={values.name}
                    onChange={(e) => handleInputChange(e, setFieldValue)}
                    className={`w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.name && touched.name
                        ? "border-red-500"
                        : "border-gray-300"
                      }`}
>>>>>>> auth-naeem
                  />
                  {errors.name && touched.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div className="mb-4 relative">
                  <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Field
                    name="email"
                    type="email"
                    placeholder="Email Address"
<<<<<<< HEAD
                    className={`w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.email && touched.email ? "border-red-500" : "border-gray-300"
                    }`}
=======
                    className={`w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.email && touched.email
                        ? "border-red-500"
                        : "border-gray-300"
                      }`}
>>>>>>> auth-naeem
                  />
                  {errors.email && touched.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Password */}
                <div className="mb-4 relative">
                  <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Field
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
<<<<<<< HEAD
                    className={`w-full p-3 pl-10 pr-10 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.password && touched.password
=======
                    className={`w-full p-3 pl-10 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.password && touched.password
>>>>>>> auth-naeem
                        ? "border-red-500"
                        : "border-gray-300"
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>

                {/* Confirm Password */}
                <div className="mb-6 relative">
                  <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Field
                    name="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    placeholder="Confirm Password"
<<<<<<< HEAD
                    className={`w-full p-3 pl-10 pr-10 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.confirmPassword && touched.confirmPassword
=======
                    className={`w-full p-3 pl-10 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.confirmPassword && touched.confirmPassword
>>>>>>> auth-naeem
                        ? "border-red-500"
                        : "border-gray-300"
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    {showConfirm ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-indigo-700 mb-4"
                >
                  {isSubmitting ? "Creating account..." : "Create Account"}
                </button>

<<<<<<< HEAD
                {/* Divider */}
                <div className="flex items-center my-4">
                  <div className="flex-1 h-px bg-gray-300"></div>
                  <span className="px-4 text-gray-500 text-sm">OR</span>
                  <div className="flex-1 h-px bg-gray-300"></div>
                </div>

                {/* Google Sign Up */}
                <button
                  type="button"
                  onClick={handleGoogleSignupWithRole}
                  disabled={googleSubmitting}
                  className="w-full flex items-center justify-center gap-2 bg-white text-gray-800 py-3 rounded-lg border hover:bg-gray-50"
                >
                  <FcGoogle className="text-xl" />
                  <span>{googleSubmitting ? "Signing in..." : "Continue with Google"}</span>
                </button>

=======
>>>>>>> auth-naeem
                {/* Login Link */}
                <div className="text-center mt-6 text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link to="/login" className="text-purple-600 font-semibold hover:text-purple-800">
                    Sign in
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

export default Signup;
<<<<<<< HEAD
=======


// import React, { useState } from "react";
// import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
// import Particles from "react-tsparticles";
// import { loadSlim } from "tsparticles-slim";
// import { Formik, Form, Field } from "formik";
// import * as Yup from "yup";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { useNavigate, Navigate, Link } from "react-router-dom";
// import { isLoggedIn} from "../utills/checkToken";


// const particleOptions = {
//   particles: {
//     number: { value: 80, density: { enable: true, value_area: 800 } },
//     color: { value: "#9e9e9e" },
//     shape: { type: "circle" },
//     opacity: { value: 0.5 },
//     size: { value: 3, random: true },
//     line_linked: {
//       enable: true,
//       distance: 150,
//       color: "#9e9e9e",
//       opacity: 0.4,
//       width: 1,
//     },
//     move: { enable: true, speed: 2 },
//   },
//   interactivity: {
//     detect_on: "canvas",
//     events: {
//       onhover: { enable: true, mode: "grab" },
//       onclick: { enable: true, mode: "push" },
//       resize: true,
//     },
//     modes: {
//       grab: { distance: 140, line_linked: { opacity: 1 } },
//       push: { particles_number: 4 },
//     },
//   },
//   retina_detect: true,
//   background: { color: "#1f2937" },
// };

// //  Validation schema
// const SignupSchema = Yup.object({
//   name: Yup.string()
//     .trim()
//     .min(3, "Name must be at least 3 characters")
//     .matches(/^[A-Za-z ]+$/, "Only letters and spaces allowed")
//     .required("Name is required"),
//   email: Yup.string().email("Invalid email").required("Email is required"),
//   password: Yup.string()
//     .min(6, "Minimum 6 characters")
//     .matches(/[A-Z]/, "Must contain at least one uppercase letter")
//     .required("Password is required"),
//   confirmPassword: Yup.string()
//     .oneOf([Yup.ref("password"), null], "Passwords do not match")
//     .required("Please confirm password"),
//   role: Yup.string()
//     .oneOf(["influencer", "brand"], "Role is required")
//     .required("Role is required"),
// });

// const Signup = () => {
//   const navigate = useNavigate();
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirm, setShowConfirm] = useState(false);
//   const [loading, setLoading] = useState(false);

// if (isLoggedIn()) return <Navigate to="/" replace />;

//   const particlesInit = async (engine) => await loadSlim(engine);

//   const handleSignup = async (values, { setSubmitting }) => {
//     try {
//       setLoading(true);
//       const res = await axios.post("/api/auth/register", values);
//       toast.success(res.data.message || "Signup successful");
//       sessionStorage.setItem("allowVerifyOtp", "true");
//       navigate(`/verify?email=${encodeURIComponent(values.email)}`);
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Signup failed");
//     } finally {
//       setLoading(false);
//       setSubmitting(false);
//     }
//   };

//   // Google Sign-In removed from Signup (moved to Login)

//   return (
//     <div className="relative flex min-h-screen items-center justify-center p-4 bg-gray-900">
//       {/* Background Particles */}
//       <Particles
//         id="tsparticles"
//         init={particlesInit}
//         options={particleOptions}
//         className="absolute inset-0 z-0"
//       />

//       {/* Signup Card */}
//       <div className="relative z-10 flex max-w-4xl w-full mx-auto shadow-2xl rounded-xl overflow-hidden">
//         <Link
//           to="/"
//           aria-label="Close"
//           className="absolute top-3 right-3 z-20 text-white/90 hover:text-white bg-black/40 hover:bg-black/60 w-8 h-8 rounded-full grid place-items-center text-lg leading-none transition"
//         >
//           ×
//         </Link>
//         {/* Left Side */}
//         <div className="flex-1 relative p-10 text-white bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 hidden lg:block">
//           <div className="relative z-10">
//             <h1 className="text-4xl font-bold mb-4">Join Connectify</h1>
//             <p className="text-md font-light">
//               Create your account and be part of a community that connects
//               influencers and brands to grow together.
//             </p>
//           </div>
//           <div className="absolute top-1/4 left-1/4 h-3 w-40 bg-orange-400 opacity-70 transform -rotate-45 rounded-full z-0"></div>
//           <div className="absolute top-2/3 left-1/3 h-5 w-64 bg-pink-400 opacity-60 transform -skew-y-12 rounded-full z-0"></div>
//           <div className="absolute bottom-1/4 right-1/4 h-2 w-32 bg-orange-300 opacity-80 transform rotate-12 rounded-full z-0"></div>
//         </div>

//         {/* Right Side */}
//         <div className="flex-1 bg-white p-10 flex flex-col justify-center min-w-[350px]">
//           <h2 className="text-xl font-semibold text-center mb-8 tracking-wider text-gray-700">
//             CREATE ACCOUNT
//           </h2>

//           {/* Formik Signup Form */}
//           <Formik
//             initialValues={{
//               name: "",
//               email: "",
//               password: "",
//               confirmPassword: "",
//               role: "",
//             }}
//             validationSchema={SignupSchema}
//             onSubmit={handleSignup}
//           >
//             {({ isSubmitting, errors, touched, values, setFieldValue }) => (
//               <Form>
//                 {/* Role Selector */}
//                 <div className="flex gap-4 mb-6">
//                   {["influencer", "brand"].map((role) => (
//                     <button
//                       type="button"
//                       key={role}
//                       onClick={() => setFieldValue("role", role)}
//                       className={`w-1/2 py-2 rounded-md border font-semibold transition ${
//                         values.role === role
//                           ? "bg-indigo-600 text-white border-indigo-600"
//                           : "border-gray-300 text-gray-600 hover:bg-gray-100"
//                       }`}
//                     >
//                       {role.charAt(0).toUpperCase() + role.slice(1)}
//                     </button>
//                   ))}
//                 </div>
//                 {errors.role && (
//                   <p className="text-red-500 text-sm mb-2">{errors.role}</p>
//                 )}

//                 {/* Name */}
//                 <div className="mb-4 relative">
//                   <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                   <Field
//                     name="name"
//                     type="text"
//                     placeholder="Full Name"
//                     className={`w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
//                       errors.name && touched.name
//                         ? "border-red-500"
//                         : "border-gray-300"
//                     }`}
//                   />
//                   {errors.name && touched.name && (
//                     <p className="text-red-500 text-sm mt-1">{errors.name}</p>
//                   )}
//                 </div>

//                 {/* Email */}
//                 <div className="mb-4 relative">
//                   <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                   <Field
//                     name="email"
//                     type="email"
//                     placeholder="Email Address"
//                     className={`w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
//                       errors.email && touched.email
//                         ? "border-red-500"
//                         : "border-gray-300"
//                     }`}
//                   />
//                   {errors.email && touched.email && (
//                     <p className="text-red-500 text-sm mt-1">{errors.email}</p>
//                   )}
//                 </div>

//                 {/* Password */}
//                 <div className="mb-4 relative">
//                   <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                   <Field
//                     name="password"
//                     type={showPassword ? "text" : "password"}
//                     placeholder="Password"
//                     className={`w-full p-3 pl-10 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
//                       errors.password && touched.password
//                         ? "border-red-500"
//                         : "border-gray-300"
//                     }`}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
//                   >
//                     {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
//                   </button>
//                   {errors.password && touched.password && (
//                     <p className="text-red-500 text-sm mt-1">
//                       {errors.password}
//                     </p>
//                   )}
//                 </div>

//                 {/* Confirm Password */}
//                 <div className="mb-6 relative">
//                   <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                   <Field
//                     name="confirmPassword"
//                     type={showConfirm ? "text" : "password"}
//                     placeholder="Confirm Password"
//                     className={`w-full p-3 pl-10 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
//                       errors.confirmPassword && touched.confirmPassword
//                         ? "border-red-500"
//                         : "border-gray-300"
//                     }`}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowConfirm(!showConfirm)}
//                     className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
//                   >
//                     {showConfirm ? <FiEyeOff size={18} /> : <FiEye size={18} />}
//                   </button>
//                   {errors.confirmPassword && touched.confirmPassword && (
//                     <p className="text-red-500 text-sm mt-1">
//                       {errors.confirmPassword}
//                     </p>
//                   )}
//                 </div>

//                 {/* Submit */}
//                 <button
//                   type="submit"
//                   disabled={isSubmitting || loading}
//                   className="w-full py-3 text-white font-semibold rounded-lg
//              bg-gradient-to-r from-purple-500 to-indigo-600
//              hover:from-purple-600 hover:to-indigo-700
//              transition duration-150 ease-in-out cursor-pointer"
//                 >
//                   {loading ? "Creating account..." : "SIGN UP"}
//                 </button>

//                 {/* Google Sign-In is now on the Login page */}

//                 {/* Login Link */}
//                 <div className="text-center mt-6 text-sm text-gray-600">
//                   Already have an account?{" "}
//                   <Link
//                     to="/login"
//                     className="text-purple-600 hover:text-purple-800 font-semibold"
//                   >
//                     Sign in
//                   </Link>
//                 </div>
//               </Form>
//             )}
//           </Formik>
//         </div>
//       </div>

//       {/* Role selection modal removed from Signup */}
//     </div>
//   );
// };

// export default Signup;


>>>>>>> auth-naeem
