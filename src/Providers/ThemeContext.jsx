import React, { createContext, useContext, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme, setTheme } from '../redux/slices/themeSlice';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  const dispatch = useDispatch();

  // Keep body class updates synchronized
  useEffect(() => {
    try {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {
      // Ignore document element failures in test/SSR environments
    }
  }, [isDarkMode]);

  const handleToggle = () => {
    dispatch(toggleTheme());
  };

  const handleSetTheme = (val) => {
    dispatch(setTheme(val));
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, setIsDarkMode: handleSetTheme, toggleTheme: handleToggle }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
export default ThemeContext;
