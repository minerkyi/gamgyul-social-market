import { createContext, useContext, useState } from "react";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [refreshToken, setRefreshToken] = useState(() =>
    localStorage.getItem("refreshToken")
  );

  const saveUser = (userData) => {
    setUser(userData);
    setToken(userData.token);
    setRefreshToken(userData.refreshToken);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", userData.token);
    localStorage.setItem("refreshToken", userData.refreshToken);
  };

  const clearUser = () => {
    setUser(null);
    setToken(null);
    setRefreshToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
  };

  return (
    <UserContext.Provider
      value={{ user, token, refreshToken, saveUser, clearUser }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
