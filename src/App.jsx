import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Signup from "./components/Signup";
import Login from "./components/Login";
import ForgotPassword from "./components/ForgotPassword";
import VerifyOtpSignup from "./pages/VerifyOtpSignup";
import VerifyOtpLogin from "./pages/VerifyOtpLogin";
import ResetPassword from "./components/resetPassword";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import RequireAuth from "./components/RequireAuth";
import Home from "./components/Home";
import BrandPartnership from "./components/services/BrandPartnership";
import About from "./components/About";
import Contact from "./components/Contact";
import GuestRoute from "./utills/guestRoute";
<<<<<<< HEAD
import { GoogleOAuthProvider } from '@react-oauth/google';

// In your main render function:

=======
import PrivateRoute from "./utills/privateRoute"
import Profile from "./components/Profile";
>>>>>>> auth-naeem
export default function App() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="dark"
        progressStyle={{ background: "#7c3aed" }}
      />

      <Routes>
        {/* Public home route with Navbar layout */}
        <Route element={<Navbar />}>
          <Route index element={<Home />} />
          <Route path="/brandpartnership" element={<PrivateRoute><BrandPartnership /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          
        </Route>

        {/* Auth routes without Navbar layout */}
        <Route path="/signup" element={<GuestRoute><Signup /></GuestRoute>} />
        <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/forgot-password" element={<GuestRoute><ForgotPassword /></GuestRoute>} />
        
        {/* Signup OTP Verification */}
        <Route 
          path="/verify-otp-signup" 
          element={
            <GuestRoute>
              <VerifyOtpSignup />
            </GuestRoute>
          } 
        />
        
        {/* Login/Password Reset OTP Verification */}
        <Route 
          path="/verify-otp-login" 
          element={
            <GuestRoute>
              <VerifyOtpLogin />
            </GuestRoute>
          } 
        />
        
        <Route 
          path="/reset-password" 
          element={
            <GuestRoute>
              <ResetPassword />
            </GuestRoute>
          } 
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

/////////////////////////
// import { Routes, Route } from "react-router-dom";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// import Signup from "./components/Signup";
// import Login from "./components/Login";
// import ForgotPassword from "./components/ForgotPassword";
// import VerifyOtp from "./pages/VerifyOtp";
// import NotFound from "./pages/NotFound";
// import Navbar from "./components/Navbar";
// import RequireAuth from "./components/RequireAuth";
// import Home from "./components/Home";
// import BrandPartnership from "./components/services/BrandPartnership";

// export default function App() {
//   return (
//     <>
//       <ToastContainer
//         position="top-right"
//         autoClose={3000}
//         theme="dark"
//         progressStyle={{ background: "#7c3aed" }}
//       />

//       <Routes>
//         {/* Public home route with Navbar layout */}
//         <Route element={<Navbar />}>
//           <Route index element={<Home />} />
//           <Route path="/brandpartnership" element={<BrandPartnership />} />
          
//         </Route>

//         {/* Auth routes without Navbar layout */}
//         <Route path="/signup" element={<Signup />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/forgot" element={<ForgotPassword />} />
//         <Route path="/verify" element={<VerifyOtp />} />
//         <Route path="/brandpartnership" element={<BrandPartnership />} />
//         <Route path="*" element={<NotFound />} />
//       </Routes>
//     </>
//   );
// }

