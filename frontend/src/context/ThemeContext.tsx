import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  brightness: number;
  setBrightness: (val: number) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('chargeshare_theme') as Theme) || 'dark';
  });

  const [brightness, setBrightnessState] = useState<number>(() => {
    const saved = localStorage.getItem('chargeshare_brightness');
    return saved ? Number(saved) : 100;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('chargeshare_theme', theme);
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    if (brightness < 100) {
      root.style.filter = `brightness(${brightness / 100})`;
    } else {
      root.style.filter = 'none';
    }
    localStorage.setItem('chargeshare_brightness', String(brightness));
  }, [brightness]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setBrightness = (val: number) => {
    const clamped = Math.max(50, Math.min(100, val));
    setBrightnessState(clamped);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, brightness, setBrightness }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
