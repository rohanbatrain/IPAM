'use client';

import { useEffect } from 'react';
import { useThemeStore } from '@/lib/store/theme-store';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { currentTheme, applyTheme } = useThemeStore();

  useEffect(() => {
    applyTheme(currentTheme);
  }, [currentTheme, applyTheme]);

  return <>{children}</>;
}
