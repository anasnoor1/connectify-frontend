import { Navigate } from "react-router-dom";

const VerifyRoute = ({ children }) => {
  const allowed = sessionStorage.getItem("allowVerifyOtp");

  if (!allowed) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default VerifyRoute;
