// Theme system types

export interface ThemeColors {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  border: string;
  input: string;
  ring: string;
  // IPAM-specific
  regionActive: string;
  regionReserved: string;
  regionRetired: string;
  hostActive: string;
  hostReleased: string;
  utilizationLow: string;
  utilizationMedium: string;
  utilizationHigh: string;
}

export interface ThemeTokens {
  name: string;
  colors: ThemeColors;
  shadows: {
    sm: string;
    md: string;
    lg: string;
  };
  radius: {
    sm: string;
    md: string;
    lg: string;
  };
}

export interface Theme {
  name: string;
  displayName: string;
  light: ThemeTokens;
  dark: ThemeTokens;
}

export type ThemeName = 'pacific-blue' | 'sunset-peach' | 'forest-green' | 'midnight-lavender' | 'crimson-red';
