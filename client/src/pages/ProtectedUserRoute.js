import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const ProctedUserRoute = ({ children }) => {
  const { loggedIn } = useAuth();
  return loggedIn ? children : <Navigate to="/signIn" />;
};

export default ProctedUserRoute;
