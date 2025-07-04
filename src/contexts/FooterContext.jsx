import { createContext } from 'react';
import { useLocation } from 'react-router-dom';

const FooterContext = createContext(false);

export const FooterProvider = ({ children }) => {
  const location = useLocation();
  const path = location.pathname;

  const visiblePathPatterns = [
    '/',
    '/products',
    '/profile',
    '/chat',
    '/home',
    '/search',
  ];

  const isVisibled = visiblePathPatterns.some((pattern) => {
    if (pattern === '/profile') {
      return path.startsWith(pattern);
    }
    return path === pattern;
  });

  return (
    <FooterContext.Provider value={{ isVisibled, path }}>
      {children}
    </FooterContext.Provider>
  );
};

export default FooterContext;
