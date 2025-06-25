import { createContext } from "react";
import { useLocation } from "react-router-dom";

const FooterContext = createContext(false);

export const FooterProvider = ({children}) => {
  const location = useLocation();
  const path = location.pathname;
  const isVisibled = path === '/profile';

  return (
    <FooterContext.Provider value={{isVisibled, path}}>
      {children}
    </FooterContext.Provider>
  );
};

export default FooterContext;