import {
  Navigate,
  useLocation,
} from "react-router-dom";

import { isTokenValid } from "../utils/auth";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();

  if (!isTokenValid()) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  return children;
};

export default ProtectedRoute;