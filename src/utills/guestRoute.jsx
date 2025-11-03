import { Navigate } from "react-router-dom";
import { getToken} from "./checkToken";

const GuestRoute = ({ children }) => {
  const token = getToken();

  if (token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default GuestRoute;




