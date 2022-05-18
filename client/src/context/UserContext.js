import { createContext, useContext, useState } from "react";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const value = { user, setUser };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

const useUserContext = () => useContext(UserContext);

export { UserProvider, useUserContext };
