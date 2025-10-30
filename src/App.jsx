import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import ForgotPassword from "./components/ForgotPassword";
import VerifyOtp from "./pages/VerifyOtp";
import NotFound from "./pages/NotFound";

import { ToastContainer } from "react-toastify";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import RequireAuth from "./components/RequireAuth";
import GuestRoute from "./utills/guestroute";



export default function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} theme="dark" progressStyle={{ background: "#7c3aed" }} />
      <Routes>
        <Route element={<Layout />}>
          <Route element={<RequireAuth />}>
            <Route index element={<Home />} />
          </Route>
          <Route path="/signup" element={
            <GuestRoute>
              <Signup />
            </GuestRoute>
          } />
          <Route path="/login" element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          } />
          <Route path="/forgot" element={<ForgotPassword />} />
          <Route path="/verify" element={<VerifyOtp />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>

    </Router>
  );
}