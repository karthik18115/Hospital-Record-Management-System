import React from 'react';
import { useTheme } from '../context/useTheme';
import './ThemeToggleButton.css'; // Create this CSS file next

// Simple text-based icons for now. Consider using an icon library later.
const SunIcon = () => <span className="theme-icon">☀️</span>;
const MoonIcon = () => <span className="theme-icon">🌙</span>;

function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button 
      onClick={toggleTheme} 
      className="theme-toggle-button" 
      aria-label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
      title={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
    >
      {theme === 'light' ? <MoonIcon /> : <SunIcon />}
      <span className="sr-only">{theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}</span>
    </button>
  );
}

export default ThemeToggleButton; 