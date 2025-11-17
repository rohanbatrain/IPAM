import { pacificBlueTheme } from './pacific-blue';
import type { Theme, ThemeName } from '@/lib/types/theme';

export const themes: Record<ThemeName, Theme> = {
  'pacific-blue': pacificBlueTheme,
  // Additional themes will be added later
  'sunset-peach': pacificBlueTheme, // Placeholder
  'forest-green': pacificBlueTheme, // Placeholder
  'midnight-lavender': pacificBlueTheme, // Placeholder
  'crimson-red': pacificBlueTheme, // Placeholder
};

export const defaultTheme: ThemeName = 'pacific-blue';
