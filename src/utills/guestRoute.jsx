import { Navigate, useLocation } from "react-router-dom";
import { getToken } from "./checkToken";

const GuestRoute = ({ children }) => {
  const token = getToken();
  const location = useLocation();
  
  // If user is logged in, redirect to home
  if (token) {
    return <Navigate to="/" replace />;
  }

  // If trying to access OTP or reset password pages directly without proper state
  const protectedPaths = ['/verify-otp-signup', '/verify-otp-login', '/reset-password'];
  const isProtectedPath = protectedPaths.some(path => location.pathname.startsWith(path));
  
  if (isProtectedPath) {
    // Check if we have the required state for OTP or reset password flow
    const state = location.state;
    const hasValidState = 
      (location.pathname.startsWith('/verify-otp-') && state?.email) ||
      (location.pathname === '/reset-password' && state?.email && state?.otp);
    
    if (!hasValidState) {
      return <Navigate to="/login" replace />;
    }
  }

  return children;
};

export default GuestRoute;




