import React, { memo, useCallback } from 'react';
import { FiMoon, FiSun } from 'react-icons/fi';
import { useThemeMode } from '../../context/ThemeContext';
import './ThemeToggle.css';

const ThemeToggle = memo(({ className = '' }) => {
  const { isLight, toggleTheme } = useThemeMode();

  const handleClick = useCallback(() => {
    toggleTheme();
  }, [toggleTheme]);

  return (
    <button
      type="button"
      className={`theme-toggle ${isLight ? 'is-light' : ''} ${className}`}
      onClick={handleClick}
      aria-label={isLight ? 'Switch to dark theme' : 'Switch to light theme'}
      aria-pressed={isLight}
    >
      <span className="theme-toggle__track" aria-hidden="true">
        <span className="theme-toggle__thumb">
          {isLight ? <FiSun /> : <FiMoon />}
        </span>
        <FiMoon className="theme-toggle__icon theme-toggle__icon--moon" />
        <FiSun className="theme-toggle__icon theme-toggle__icon--sun" />
      </span>
    </button>
  );
});

export default ThemeToggle;
