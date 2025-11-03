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
import PrivateRoute from "./utills/privateRoute";
import GuestRoute from "./utills/guestRoute";

export default function App() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="dark"
        progressStyle={{ background: "#7C3AED" }}
      />

      <Routes>
        {/* Navbar layout */}
        <Route element={<Navbar />}>
          {/* Default route (Home) */}
          <Route path="/" element={<Home />} />
        </Route>

        {/* Protected routes */}
        <Route element={<RequireAuth />}>
          <Route element={<Navbar />}>
            {/* Example of a protected route */}
            <Route path="/dashboard" element={<PrivateRoute>Dashboard</PrivateRoute>} />
          </Route>
        </Route>

        {/* Auth routes (public) */}
        <Route
          path="/signup"
          element={
            <GuestRoute>
              <Signup />
            </GuestRoute>
          }
        />
        <Route
          path="/login"
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />
        <Route
          path="/forgot"
          element={
            <GuestRoute>
              <ForgotPassword />
            </GuestRoute>
          }
        />
        <Route path="/verify" element={<VerifyOtp />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}



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
// export default function App() {
//   return (
//     <>
//       <ToastContainer
//         position="top-right"
//         autoClose={3000}
//         theme="dark"
//         progressStyle={{ background: "#7C3AED" }}
//       />
//       <Routes>
//         {/* Protected app layout with Navbar wrapping content */}
//         <Route element={<RequireAuth />}>
//           <Route element={<Navbar />}>
//             <Route index element={<Home />} />
//           </Route>
//         </Route>
//         {/* Auth routes without Navbar layout */}
//         <Route path="/signup" element={<Signup />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/forgot" element={<ForgotPassword />} />
//         <Route path="/verify" element={<VerifyOtp />} />
//         <Route path="*" element={<NotFound />} />
//       </Routes>
//     </>
//   );
// }

// import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
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

// export default function App() {
//   const location = useLocation();
//   const pathname = location.pathname;

//   const isAuthPage =
//     pathname === "/login" ||
//     pathname === "/signup" ||
//     pathname === "/forgot" ||
//     pathname.startsWith("/verify");

//   return (
//     <>
//       <ToastContainer
//         position="top-right"
//         autoClose={3000}
//         theme="dark"
//         progressStyle={{ background: "#7c3aed" }}
//       />

//       {/* ✅ Only show Navbar when not on auth pages */}
//       {!isAuthPage && <Navbar />}

//       <Routes>
//         <Route element={<RequireAuth />}>
//           <Route index element={<Home />} />
//         </Route>
//         <Route path="/signup" element={<Signup />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/forgot" element={<ForgotPassword />} />
//         <Route path="/verify" element={<VerifyOtp />} />
//         <Route path="*" element={<NotFound />} />
//       </Routes>
//     </>
//   );
// }
