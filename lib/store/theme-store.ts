import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { themes, defaultTheme } from '@/lib/themes';
import type { ThemeName } from '@/lib/types/theme';

interface ThemeState {
  currentTheme: ThemeName;
  darkMode: boolean;

  // Actions
  setTheme: (themeName: ThemeName) => void;
  toggleDarkMode: () => void;
  applyTheme: (themeName: ThemeName) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      currentTheme: defaultTheme,
      darkMode: false,

      setTheme: (themeName) => {
        set({ currentTheme: themeName });
        get().applyTheme(themeName);
      },

      toggleDarkMode: () => {
        set((state) => ({ darkMode: !state.darkMode }));
        get().applyTheme(get().currentTheme);
      },

      applyTheme: (themeName) => {
        if (typeof window === 'undefined') return;

        const theme = themes[themeName];
        const { darkMode } = get();
        const tokens = darkMode ? theme.dark : theme.light;

        // Apply CSS variables to :root
        const root = document.documentElement;
        Object.entries(tokens.colors).forEach(([key, value]) => {
          // Convert camelCase to kebab-case
          const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
          root.style.setProperty(`--${cssKey}`, value);
        });

        // Apply dark mode class
        if (darkMode) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      },
    }),
    {
      name: 'ipam-theme',
    }
  )
);
