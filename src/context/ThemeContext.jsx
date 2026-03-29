import React, { useState, useEffect, useMemo } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeContext } from './ThemeContextData';

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const storedTheme = localStorage.getItem('theme');
    return storedTheme ? storedTheme : 'light'; // Default to light theme
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    // Apply theme class to the body or a root element
    document.body.className = 'theme-' + theme;
    // Or, for more specific targeting if you have a single root div like #root:
    // const rootElement = document.getElementById('root');
    // if (rootElement) {
    //   rootElement.className = 'theme-' + theme;
    // }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const muiTheme = useMemo(
    () => createTheme({ palette: { mode: theme } }),
    [theme]
  );

  return (
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline />
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        {children}
      </ThemeContext.Provider>
    </MuiThemeProvider>
  );
}; 