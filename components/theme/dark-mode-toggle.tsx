'use client';

import { Moon, Sun } from 'lucide-react';
import { useThemeStore } from '@/lib/store/theme-store';
import { Button } from '@/components/ui/button';

export function DarkModeToggle() {
  const { darkMode, toggleDarkMode } = useThemeStore();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleDarkMode}
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
}
