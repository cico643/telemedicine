import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "../api";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);

  const logIn = (data) => {
    setLoggedIn(true);
    setUser(data);
  };
  useEffect(() => {
    (async () => {
      try {
        const currentUser = await getCurrentUser();
        console.log(currentUser);
        setLoggedIn(true);
        setUser(currentUser);
      } catch (error) {
        setLoggedIn(false);
        setUser(null);
      }
    })();
  }, []);
  const value = { user, loggedIn, logIn };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
