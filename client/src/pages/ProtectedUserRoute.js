import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCurrentUser } from "../api";
import { CircularProgress } from "@mui/material";

const ProctedUserRoute = ({ children }) => {
  const [isLoading, setLoading] = useState(true);
  const { loggedIn, setLoggedIn, setUser } = useAuth();
  useEffect(() => {
    getCurrentUser().then((user) => {
      if (!user) {
        setLoggedIn(false);
        setUser(null);
      } else {
        setLoggedIn(true);
        setUser(user);
      }
      setLoading(false);
    });
  }, [setUser, setLoggedIn]);
  if (isLoading) {
    return (
      <div style={{ align: "center" }}>
        <CircularProgress />
      </div>
    );
  }
  return loggedIn ? children : <Navigate to="/signIn" />;
};

export default ProctedUserRoute;
