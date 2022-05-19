import { createContext, useContext, useState } from "react";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [relatives, setRelatives] = useState([]);
  const [medications, setMedications] = useState([]);
  const value = {
    relatives,
    user,
    medications,
    setUser,
    setRelatives,
    setMedications,
  };
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

const useUserContext = () => useContext(UserContext);

export { UserProvider, useUserContext };
