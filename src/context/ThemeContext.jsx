import React, { createContext, memo, useCallback, useContext, useMemo, useState } from 'react';

const THEME_KEY = 'lexodd-theme';
const ThemeContext = createContext(null);

const getInitialTheme = () => {
  if (typeof document !== 'undefined') {
    return document.documentElement.classList.contains('light-theme') ? 'light' : 'dark';
  }
  return 'dark';
};

const applyTheme = (nextTheme) => {
  const root = document.documentElement;
  root.classList.toggle('light-theme', nextTheme === 'light');
  root.classList.toggle('dark-theme', nextTheme !== 'light');
  root.dataset.theme = nextTheme;
  localStorage.setItem(THEME_KEY, nextTheme);
};

export const ThemeProvider = memo(({ children }) => {
  const [theme, setTheme] = useState(getInitialTheme);

  const setPreferredTheme = useCallback((nextTheme) => {
    setTheme(nextTheme);
    requestAnimationFrame(() => applyTheme(nextTheme));
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((currentTheme) => {
      const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
      requestAnimationFrame(() => applyTheme(nextTheme));
      return nextTheme;
    });
  }, []);

  const value = useMemo(() => ({
    theme,
    isLight: theme === 'light',
    setTheme: setPreferredTheme,
    toggleTheme
  }), [setPreferredTheme, theme, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
});

export const useThemeMode = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useThemeMode must be used within ThemeProvider');
  return context;
};
