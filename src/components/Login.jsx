<<<<<<< HEAD
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate, Navigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const navigate = useNavigate();
  const googleBtnRef = useRef(null);

  const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
  if (token) {
    return <Navigate to="/" replace />;
  }

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

    loadGoogleScript();

    // Initialize Google Sign-In when script loads
    const checkGoogle = setInterval(() => {
      if (window.google) {
        clearInterval(checkGoogle);
        initializeGoogleSignIn();
      }
    }, 100);

    return () => clearInterval(checkGoogle);
  }, [navigate]);

  const initializeGoogleSignIn = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!window.google || !clientId) return;
    
    try {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async (response) => {
          try {
            const res = await axios.post("/api/auth/google", { 
              idToken: response.credential 
            });
            localStorage.setItem("token", res.data.token);
            toast.success("Logged in with Google");
            navigate("/");
          } catch (err) {
            toast.error(err.response?.data?.message || "Google login failed");
          }
        },
        context: "signin",
      });
      
      if (googleBtnRef.current) {
        window.google.accounts.id.renderButton(googleBtnRef.current, {
          theme: "outline",
          size: "large",
          shape: "rectangular",
          width: 360,
          text: "continue_with",
          logo_alignment: "left",
        });
      }
    } catch (error) {
      console.error("Google Sign-In initialization failed:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Only check email format; no other field validations
    const emailOk = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email);
    if (!emailOk) {
      toast.error("Invalid email");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("/api/auth/login", formData);
      toast.success("Login successful");
      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (err) {
      if (err.response?.status === 403) {
        toast.error(err.response?.data?.message || "Please verify your email first.");
        navigate(`/verify?email=${encodeURIComponent(formData.email)}`);
      } else if (err.response?.status === 400) {
        toast.error(err.response?.data?.message || "Login failed");
      } else {
        toast.error("Login failed");
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100 py-4">
      <div className="row justify-content-center w-100">
        <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5 col-xxl-4">
          <div className="card shadow border-0">
            <div className="card-header bg-transparent py-3">
              <div className="text-center">
                <h2 className="h4 fw-bold mb-1">Welcome back</h2>
                <p className="text-muted small mb-0">Sign in to continue to Connectify</p>
              </div>
            </div>

            <div className="card-body p-3 p-md-4">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold small">Email address</label>
                  <div className="input-group input-group-sm">
                    <span className="input-group-text">📧</span>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold small">Password</label>
                  <div className="input-group input-group-sm">
                    <span className="input-group-text">🔒</span>
                    <input
                      type={showPwd ? "text" : "password"}
                      name="password"
                      className="form-control"
                      value={formData.password}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="Your password"
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setShowPwd((v) => !v)}
                      tabIndex={-1}
                      aria-label="Toggle password visibility"
                    >
                      {showPwd ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-10-8-10-8a21.86 21.86 0 0 1 5.06-6.94" />
                          <path d="M1 1l22 22" />
                          <path d="M9.88 9.88A3 3 0 0 0 12 15a3 3 0 0 0 2.12-.88" />
                          <path d="M14.12 14.12L9.88 9.88" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s3-8 11-8 11 8 11 8-3 8-11 8S1 12 1 12z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="rememberMe" disabled={loading} />
                    <label className="form-check-label" htmlFor="rememberMe">Remember me</label>
                  </div>
                  <Link className="small" to="/forgot">Forgot password?</Link>
                </div>

                <button
                  className="btn btn-primary w-100 py-2 mb-3 d-flex align-items-center justify-content-center"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
                </button>

                <div className="position-relative text-center mb-3">
                  <hr className="my-2" />
                  <span className="position-absolute top-50 start-50 translate-middle bg-white px-2 text-muted small">
                    or continue with
                  </span>
                </div>

                <div className="d-flex justify-content-center">
                  <div ref={googleBtnRef} />
                </div>

                <div className="text-center mt-3">
                  <span className="text-muted small">New here? </span>
                  <Link to="/signup" className="text-primary text-decoration-none fw-semibold small">Create an account</Link>
                </div>
              </form>
            </div>
          </div>
=======
// import React from "react";
// import { FiUser, FiLock } from "react-icons/fi";

// const LoginPage = () => {
//   return (
//     // Outer Container: Flexbox to center the card on the screen
//     <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-br from-indigo-200 to-purple-300">
//       {/* Login Card/Wrapper: Holds both sections */}
//       <div className="flex max-w-4xl w-full mx-auto shadow-2xl rounded-xl overflow-hidden">
//         {/* ---  Left Section: Welcome and Decoration --- */}
//         <div className="flex-1 relative p-10 text-white bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 hidden lg:block">
//           {/* Main Content */}
//           <div className="relative z-10">
//             <h1 className="text-4xl font-bold mb-4">Welcome to Connectify</h1>
//             <p className="text-md font-light">
//               Log in to join your community. Connect with peers, share insights,
//               and build professional relationships that power your success.
//             </p>
//           </div>

//           {/* Decorative Shapes (Simulated with absolute positioned divs) */}
//           <div className="absolute top-1/4 left-1/4 h-3 w-40 bg-orange-400 opacity-70 transform -rotate-45 rounded-full z-0"></div>
//           <div className="absolute top-2/3 left-1/3 h-5 w-64 bg-pink-400 opacity-60 transform -skew-y-12 rounded-full z-0"></div>
//           <div className="absolute bottom-1/4 right-1/4 h-2 w-32 bg-orange-300 opacity-80 transform rotate-12 rounded-full z-0"></div>
//         </div>

//         {/* ---  Right Section: User Login Form --- */}
//         <div className="flex-1 bg-white p-10 flex flex-col justify-center min-w-[350px]">
//           <h2 className="text-xl font-semibold text-center mb-8 tracking-wider text-gray-700">
//             USER LOGIN
//           </h2>

//           {/* Input Field: Username/Email */}
//           <div className="mb-4 relative">
//             <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Username or Email"
//               className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             />
//           </div>

//           {/* Input Field: Password */}
//           <div className="mb-6 relative">
//             <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//             <input
//               type="password"
//               placeholder="Password"
//               className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             />
//           </div>

//           {/* Remember Me and Forgot Password */}
//           <div className="flex justify-between items-center text-sm mb-6">
//             <label className="flex items-center text-gray-600 cursor-pointer">
//               <input
//                 type="checkbox"
//                 className="mr-2 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
//               />
//               Remember
//             </label>
//             <a
//               href="#"
//               className="text-sm text-purple-600 hover:text-purple-800 transition duration-150"
//             >
//               Forgot password?
//             </a>
//           </div>

//           {/* Login Button */}
//           <button
//             type="submit"
//             className="w-full py-3 text-white font-semibold rounded-lg
//                        bg-gradient-to-r from-purple-500 to-indigo-600
//                        hover:from-purple-600 hover:to-indigo-700
//                        transition duration-150 ease-in-out"
//           >
//             LOGIN
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;
// ----------------------------------------------------------------------------------------------------------

// import React from "react";
// import { FiUser, FiLock } from "react-icons/fi";
// // Import your background image
// import backgroundImage from "../assets/Galaxy-Background.webp"; // <--- ADD THIS LINE

// const LoginPage = () => {
//   return (
//     // Outer Container: Flexbox to center the card on the screen
//     // Add `bg-cover`, `bg-center`, and `bg-no-repeat` for background image styling
//     // And use inline style for `backgroundImage` to reference the imported image
//     <div
//       className="flex min-h-screen items-center justify-center p-4"
//       style={{
//         backgroundImage: `url(${backgroundImage})`, // <--- MODIFIED LINE
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//         backgroundRepeat: "no-repeat",
//       }}
//     >
//       {/* Optional: Add a subtle overlay to the background image for better contrast with the card */}
//       <div className="absolute inset-0 bg-black opacity-30"></div>{" "}
//       {/* <--- OPTIONAL: ADD THIS OVERLAY */}
//       {/* Login Card/Wrapper: Holds both sections */}
//       {/* Add `relative` to the card if you add the absolute overlay, so the card stays above it */}
//       <div className="relative flex max-w-4xl w-full mx-auto shadow-2xl rounded-xl overflow-hidden z-10">
//         {" "}
//         {/* <--- MODIFIED LINE (added relative and z-10) */}
//         {/* --- 🎨 Left Section: Welcome and Decoration --- */}
//         <div className="flex-1 relative p-10 text-white bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 hidden lg:block">
//           {/* Main Content */}
//           <div className="relative z-10">
//             <h1 className="text-4xl font-bold mb-4">Welcome to Connectify</h1>
//             <p className="text-md font-light">
//               Log in to join your community. Connect with peers, share insights,
//               and build professional relationships that power your success.
//             </p>
//           </div>

//           {/* Decorative Shapes (Simulated with absolute positioned divs) */}
//           <div className="absolute top-1/4 left-1/4 h-3 w-40 bg-orange-400 opacity-70 transform -rotate-45 rounded-full z-0"></div>
//           <div className="absolute top-2/3 left-1/3 h-5 w-64 bg-pink-400 opacity-60 transform -skew-y-12 rounded-full z-0"></div>
//           <div className="absolute bottom-1/4 right-1/4 h-2 w-32 bg-orange-300 opacity-80 transform rotate-12 rounded-full z-0"></div>
//         </div>
//         {/* --- 📝 Right Section: User Login Form --- */}
//         <div className="flex-1 bg-white p-10 flex flex-col justify-center min-w-[350px]">
//           <h2 className="text-xl font-semibold text-center mb-8 tracking-wider text-gray-700">
//             USER LOGIN
//           </h2>

//           {/* Input Field: Username/Email */}
//           <div className="mb-4 relative">
//             <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Username or Email"
//               className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             />
//           </div>

//           {/* Input Field: Password */}
//           <div className="mb-6 relative">
//             <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//             <input
//               type="password"
//               placeholder="Password"
//               className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             />
//           </div>

//           {/* Remember Me and Forgot Password */}
//           <div className="flex justify-between items-center text-sm mb-6">
//             <label className="flex items-center text-gray-600 cursor-pointer">
//               <input
//                 type="checkbox"
//                 className="mr-2 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
//               />
//               Remember
//             </label>
//             <a
//               href="#"
//               className="text-sm text-purple-600 hover:text-purple-800 transition duration-150"
//             >
//               Forgot password?
//             </a>
//           </div>

//           {/* Login Button */}
//           <button
//             type="submit"
//             className="w-full py-3 text-white font-semibold rounded-lg
//                             bg-gradient-to-r from-purple-500 to-indigo-600
//                             hover:from-purple-600 hover:to-indigo-700
//                             transition duration-150 ease-in-out"
//           >
//             LOGIN
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;

import React from "react";
import { FiUser, FiLock } from "react-icons/fi";
// Import the Particles component
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim"; // Lightweight loader for common effects

const particleOptions = {
  // Configuration for a subtle, floating particle effect
  particles: {
    number: {
      value: 80, // Number of particles
      density: {
        enable: true,
        value_area: 800,
      },
    },
    color: {
      value: "#9e9e9e", // Light gray/white particles (for contrast on a darker base)
    },
    shape: {
      type: "circle",
    },
    opacity: {
      value: 0.5,
      random: false,
      anim: {
        enable: false,
      },
    },
    size: {
      value: 3, // Particle size
      random: true,
      anim: {
        enable: false,
      },
    },
    line_linked: {
      enable: true,
      distance: 150, // Line length
      color: "#9e9e9e", // Line color
      opacity: 0.4,
      width: 1,
    },
    move: {
      enable: true,
      speed: 2, // Movement speed
      direction: "none",
      random: false,
      straight: false,
      out_mode: "out",
      bounce: false,
      attract: {
        enable: false,
        rotateX: 600,
        rotateY: 1200,
      },
    },
  },
  interactivity: {
    detect_on: "canvas",
    events: {
      onhover: {
        enable: true,
        mode: "grab", // Particles will react to mouse hover
      },
      onclick: {
        enable: true,
        mode: "push", // Click to generate new particles
      },
      resize: true,
    },
    modes: {
      grab: {
        distance: 140,
        line_linked: {
          opacity: 1,
        },
      },
      push: {
        particles_number: 4,
      },
    },
  },
  retina_detect: true,
  // Set background to a darker color for contrast with the particles
  background: {
    color: "#1f2937", // A dark gray/blue
  },
};

const LoginPage = () => {
  const particlesInit = async (engine) => {
    await loadSlim(engine);
  };

  return (
    // Outer Container: Set to position relative to stack the particles behind the content
    <div className="relative flex min-h-screen items-center justify-center p-4 bg-gray-900">
      {/* Particle Background Layer */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={particleOptions}
        className="absolute inset-0 z-0" // Stretch to fill container and put behind content
      />

      {/* Login Card/Wrapper: Position z-10 to float above particles */}
      <div className="relative z-10 flex max-w-4xl w-full mx-auto shadow-2xl rounded-xl overflow-hidden">
        {/* --- Left Section: Welcome and Decoration --- */}
        <div className="flex-1 relative p-10 text-white bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 hidden lg:block">
          {/* Content is already z-10, keeping it for clarity */}
          <div className="relative z-10">
            <h1 className="text-4xl font-bold mb-4">Welcome to Connectify</h1>
            <p className="text-md font-light">
              Log in to join your community. Connect with peers, share insights,
              and build professional relationships that power your success.
            </p>
          </div>

          {/* Decorative Shapes (Simulated with absolute positioned divs) */}
          <div className="absolute top-1/4 left-1/4 h-3 w-40 bg-orange-400 opacity-70 transform -rotate-45 rounded-full z-0"></div>
          <div className="absolute top-2/3 left-1/3 h-5 w-64 bg-pink-400 opacity-60 transform -skew-y-12 rounded-full z-0"></div>
          <div className="absolute bottom-1/4 right-1/4 h-2 w-32 bg-orange-300 opacity-80 transform rotate-12 rounded-full z-0"></div>
        </div>

        {/* --- Right Section: User Login Form --- */}
        <div className="flex-1 bg-white p-10 flex flex-col justify-center min-w-[350px]">
          <h2 className="text-xl font-semibold text-center mb-8 tracking-wider text-gray-700">
            USER LOGIN
          </h2>

          {/* Input Field: Username/Email */}
          <div className="mb-4 relative">
            <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Username or Email"
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Input Field: Password */}
          <div className="mb-6 relative">
            <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Remember Me and Forgot Password */}
          <div className="flex justify-between items-center text-sm mb-6">
            <label className="flex items-center text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                className="mr-2 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              Remember
            </label>
            <a
              href="#"
              className="text-sm text-purple-600 hover:text-purple-800 transition duration-150"
            >
              Forgot password?
            </a>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full py-3 text-white font-semibold rounded-lg 
                        bg-gradient-to-r from-purple-500 to-indigo-600 
                        hover:from-purple-600 hover:to-indigo-700 
                        transition duration-150 ease-in-out"
          >
            LOGIN
          </button>
>>>>>>> auth-abid
        </div>
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default Login;
=======
export default LoginPage;
>>>>>>> auth-abid
