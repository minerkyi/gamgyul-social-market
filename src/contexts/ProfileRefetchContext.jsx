import { createContext, useCallback, useContext, useState } from 'react';

const ProfileRefetchContext = createContext();

export const useProfileRefetch = () => useContext(ProfileRefetchContext);

export const ProfileRefetchProvider = ({ children }) => {
  const [refetchKey, setRefetchKey] = useState(0);

  const refetch = useCallback(() => {
    setRefetchKey((prevKey) => prevKey + 1);
  }, []);

  return (
    <ProfileRefetchContext.Provider value={{ refetchKey, refetch }}>
      {children}
    </ProfileRefetchContext.Provider>
  );
};
