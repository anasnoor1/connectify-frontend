import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Signup from "./components/auth/Signup";
import Login from "./components/auth/Login";
import ForgotPassword from "./components/auth/ForgotPassword";
import VerifyOtp from "./pages/VerifyOtp";
import ResetPassword from "./components/auth/ResetPassword";
import NotFound from "./pages/NotFound";
import Navbar from "./components/navbar/Navbar";
import Home from "./components/home/Home";
import BrandPartnership from "./components/services/BrandPartnership";
import About from "./components/About";
import Contact from "./components/Contact";
import GuestRoute from "./utills/guestRoute";
import PrivateRoute from "./utills/privateRoute"
import Profile from "./components/profile/Profile"
import { GoogleOAuthProvider } from '@react-oauth/google';
import InstagramProfile from "./components/profile/ProfileComponents/InstagramProfile";
import InfluencerDashboard from "./components/dashboard/InfluencerDashboard";
import PublicInfluencerProfile from "./components/profile/PublicInfluencerProfile";
import PublicBrandProfile from "./components/profile/PublicBrandProfile";
import PublicProfile from "./pages/PublicProfile";
import DashboardRouter from "./components/dashboard/DashboardRouter";
import CampaignList from "./components/dashboard/campaign/CampaignList";
import CampaignDetail from "./components/dashboard/campaign/CampaignDetail";
import CreateCampaign from "./components/dashboard/campaign/CreateCampaign";
import MyProposals from "./components/dashboard/influencerDashboardComponents/myProposals";
import EditCampaign from "./components/dashboard/campaign/EditCampaign";
import InfluencerSuggestedCampaigns from "./components/dashboard/influencerDashboardComponents/InfluencerSuggestedCampaigns";
import ChatPage from "./pages/ChatPage";
import BrandChats from "./components/dashboard/brandDashboardComponents/chatList";
import BrandProposals from "./components/dashboard/brandDashboardComponents/BrandProposals";
import Chats from "./components/dashboard/brandDashboardComponents/chatList";
import ChatLayout from "./pages/chatLayout";
import ProposalPayment from "./pages/ProposalPayment";
import DisputeThread from "./pages/DisputeThread";
import ScrollToTop from "./utills/ScrollToTop";



export default function App() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
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

      <ScrollToTop />

      <Routes>
        {/* Public home route with Navbar layout */}
        <Route element={<Navbar />}>
          <Route path="/" element={<Home />} />
          <Route path="/brandpartnership" element={<PrivateRoute><BrandPartnership /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/profile/i/:slug" element={<PublicInfluencerProfile />} />
          <Route path="/profile/brand/:slug" element={<PublicBrandProfile />} />
          <Route path="/profile/:role/id/:id" element={<PublicProfile />} />
          <Route path="/instagram" element={<InstagramProfile />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          {/* Dashboard and Campaign Routes */}
          <Route path="/dashboard" element={<PrivateRoute><DashboardRouter /></PrivateRoute>} />
          <Route path="/campaigns" element={<PrivateRoute><CampaignList /></PrivateRoute>} />
          <Route path="/campaigns/create" element={<PrivateRoute><CreateCampaign /></PrivateRoute>} />
          <Route path="/campaigns/:id" element={<PrivateRoute><CampaignDetail /></PrivateRoute>} />
          <Route path="/campaigns/:id/edit" element={<PrivateRoute><EditCampaign /></PrivateRoute>} />

          {/* Influencer Routes */}
          <Route path="/influencer/dashboard" element={<PrivateRoute><InfluencerDashboard /></PrivateRoute>} />
          <Route path="/influencer/proposals" element={<PrivateRoute><MyProposals /></PrivateRoute>} />
          <Route path="/influencer/suggestion" element={<PrivateRoute><InfluencerSuggestedCampaigns /></PrivateRoute>} />

          <Route path="/chats" element={<PrivateRoute><ChatLayout /></PrivateRoute>} />
          <Route path="/chats/:roomId" element={<PrivateRoute><ChatLayout /></PrivateRoute>} />

          {/* Brand Routes */}
          <Route path="/brand/chats" element={<PrivateRoute><BrandChats /></PrivateRoute>} />
          <Route path="/brand/proposals" element={<PrivateRoute><BrandProposals /></PrivateRoute>} />
          <Route path="/brand/proposals/:proposalId/pay" element={<PrivateRoute><ProposalPayment /></PrivateRoute>} />

          {/* Disputes */}
          <Route path="/disputes/:id" element={<PrivateRoute><DisputeThread /></PrivateRoute>} />

          {/* Chat Route */}
          {/* <Route path="/chat/:campaignId" element={<PrivateRoute><ChatPage /></PrivateRoute>} /> */}
        </Route>

        {/* Auth routes without Navbar layout */}
        <Route path="/signup" element={<GuestRoute><Signup /></GuestRoute>} />
        <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/forgot-password" element={<GuestRoute><ForgotPassword /></GuestRoute>} />
        <Route path="/verify-otp" element={<GuestRoute><VerifyOtp /></GuestRoute>} />
        <Route path="/reset-password" element={<GuestRoute><ResetPassword /></GuestRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </GoogleOAuthProvider>
  );
}
