import { createContext } from 'react';
import { useLocation } from 'react-router-dom';

const FooterContext = createContext(false);

export const FooterProvider = ({ children }) => {
  const location = useLocation();
  const path = location.pathname;

  const visiblePathPatterns = [
    '/profile',
    '/chat',
    '/home',
    '/search',
  ];

  const isVisibled = visiblePathPatterns.some((pattern) => {
    if (pattern === '/chat' || pattern === '/home' || pattern === '/search') {
      return path === pattern;
    }
    return path.startsWith(pattern);
  });

  return (
    <FooterContext.Provider value={{ isVisibled, path }}>
      {children}
    </FooterContext.Provider>
  );
};

export default FooterContext;
