import { createContext, useContext, useState } from 'react';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null);

    const saveUser = (userData) => {
        setUser(userData);
        setToken(userData.token);
        setRefreshToken(userData.refreshToken);
    };

    const clearUser = () => {
        setUser(null);
        setToken(null);
        setRefreshToken(null);
    };

    return (
    <UserContext.Provider value={{ user, token, refreshToken, saveUser, clearUser }}>
        {children}
    </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);