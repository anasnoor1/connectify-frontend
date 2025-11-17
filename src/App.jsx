import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Signup from "./components/auth/Signup";
import Login from "./components/auth/Login";
import ForgotPassword from "./components/auth/ForgotPassword";
import VerifyOtp from "./pages/VerifyOtp";
import ResetPassword from "./components/auth/resetPassword";
import NotFound from "./pages/NotFound";
import Navbar from "./components/navbar/Navbar";
// import RequireAuth from "./components/auth/RequireAuth";
import Home from "./components/home/Home";
import BrandPartnership from "./components/services/BrandPartnership";
import About from "./components/About";
import Contact from "./components/Contact";
import GuestRoute from "./utills/guestRoute";
import PrivateRoute from "./utills/privateRoute"
import Profile from "./components/profile/Profile"
import { GoogleOAuthProvider } from '@react-oauth/google';
import InstagramProfile from "./components/profile/ProfileComponents/InstagramProfile";

// Import new dashboard and campaign components
import DashboardRouter from "./components/dashboard/DashboardRouter";
import CampaignList from "./components/dashboard/campaign/CampaignList";
import CreateCampaign from "./components/dashboard/campaign/CreateCampaign";

// In your main render function:

export default function App() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  
  // Always wrap with GoogleOAuthProvider to allow hooks to be called
  // Use a placeholder if clientId is not set (prevents provider error, but OAuth won't work)
  const providerClientId = clientId && clientId.trim() !== '' 
    ? clientId 
    : 'placeholder-client-id.apps.googleusercontent.com';
  
  return (
    <GoogleOAuthProvider clientId={providerClientId}>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        theme="dark"
        progressStyle={{ background: "#7c3aed" }}
      />

      <Routes>
        {/* Public home route with Navbar layout */}
        <Route element={<Navbar />}>
          <Route path="/" element={<Home />} />
          <Route path="/brandpartnership" element={<PrivateRoute><BrandPartnership /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/instagram" element={<InstagramProfile/>} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* New Dashboard and Campaign Routes - Protected */}
          <Route path="/dashboard" element={<PrivateRoute><DashboardRouter /></PrivateRoute>} />
          <Route path="/campaigns" element={<PrivateRoute><CampaignList /></PrivateRoute>} />
          <Route path="/campaigns/create" element={<PrivateRoute><CreateCampaign /></PrivateRoute>} />
        </Route>

        {/* Auth routes without Navbar layout */}
        <Route path="/signup" element={<GuestRoute><Signup /></GuestRoute>} />
        <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/forgot-password" element={<GuestRoute><ForgotPassword /></GuestRoute>} />
        
        {/* Unified OTP Verification (handles both signup and password reset) */}
        <Route 
          path="/verify-otp" 
          element={
            <GuestRoute>
              <VerifyOtp />
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
    </GoogleOAuthProvider>
  );
}