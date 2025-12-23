// // components/PrivateRoute.jsx

import { Navigate } from "react-router-dom";
import { getToken } from "./checkToken";
import { connectSocket } from "../socket";

const PrivateRoute = ({ children }) => {
  const token = getToken();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Ensure socket.io connects with the latest JWT for all private pages
  connectSocket();

  return children;
};

export default PrivateRoute;
