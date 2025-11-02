import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Signup from "./components/Signup";
import Login from "./components/Login";
import ForgotPassword from "./components/ForgotPassword";
import VerifyOtp from "./pages/VerifyOtp";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import RequireAuth from "./components/RequireAuth";
import Home from "./components/Home";

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
        {/* Protected app layout with Navbar wrapping content */}
        <Route element={<RequireAuth />}>
          <Route element={<Navbar />}>
            <Route index element={<Home />} />
          </Route>
        </Route>

        {/* Auth routes without Navbar layout */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/verify" element={<VerifyOtp />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}


