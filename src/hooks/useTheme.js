import { useEffect, useState } from 'react';

const useTheme = () => {

  const getInitialTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme : 'light';
  };


  const [theme, setTheme] = useState(getInitialTheme);

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      return newTheme;
    });
  };

  useEffect(() => {

    const root = document.documentElement;
    const body = document.body;

    const fontWeight =  theme === 'dark' ? 'bold' : 'normal'

    body.style.setProperty('font-weight', fontWeight);

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
      '--shadow-2-color': '#827b7b',
      '--box-color': '#a3e89b',
      '--header-data-color': '#2e3136'
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
      '--shadow-2-color': '#363636',
      '--box-color': '#e563f9',
      '--header-data-color': 'white'
    };

    const themeStyles = theme === 'light' ? lightTheme : darkTheme;



    
    Object.keys(themeStyles).forEach((key) => {
      root.style.setProperty(key, themeStyles[key]);
    });

  }, [theme]);

  return [theme, toggleTheme];
};

export default useTheme;
