import { useEffect, useState } from 'react';

const useTheme = () => {
  const [theme, setTheme] = useState('dark');

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    const root = document.documentElement;

    const lightTheme = {
      '--background-color': '#ffffff',
      '--background-secondary-color': '#f0f0f0',
      '--text-color': '#000000',
      '--text-color-hover': '#333333',
      '--border-color': '#cccccc',
      '--active-color': '#007bff',
      '--reverse-color': 'black',
      '--theme-color': 'white',
      '--shadow-1-color': '#ffffff',
      '--shadow-2-color': '#827b7b'
    };

    const darkTheme = {
      '--background-color': '#181b1f',
      '--background-secondary-color': '#2e3136',
      '--text-color': '#ccccdc',
      '--text-color-hover': 'white',
      '--border-color': '#2e3136',
      '--active-color': '#f4821d',
      '--reverse-color': 'white',
      '--theme-color': 'black',
      '--shadow-1-color': '#0e0e0e',
      '--shadow-2-color': '#363636'
    };

    const themeStyles = theme === 'light' ? lightTheme : darkTheme;

    Object.keys(themeStyles).forEach((key) => {
      root.style.setProperty(key, themeStyles[key]);
    });

  }, [theme]);

  return [theme, toggleTheme];
};

export default useTheme;
