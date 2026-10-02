import { DefaultTheme, type Theme } from '@react-navigation/native';

/** Light-only theme adapted from progas-wms (web) design tokens; add dark mode when the web app gets one. */
export const THEME = {
  background: 'hsl(210 40% 98%)',
  foreground: 'hsl(222 47% 11%)',
  card: 'hsl(0 0% 100%)',
  cardForeground: 'hsl(222 47% 11%)',
  popover: 'hsl(0 0% 100%)',
  popoverForeground: 'hsl(222 47% 11%)',
  primary: 'hsl(243 75% 59%)',
  primaryForeground: 'hsl(0 0% 100%)',
  secondary: 'hsl(210 40% 96%)',
  secondaryForeground: 'hsl(222 47% 11%)',
  muted: 'hsl(210 40% 96%)',
  mutedForeground: 'hsl(215 16% 47%)',
  accent: 'hsl(226 100% 97%)',
  accentForeground: 'hsl(243 58% 51%)',
  destructive: 'hsl(345 83% 41%)',
  destructiveForeground: 'hsl(0 0% 100%)',
  border: 'hsl(214 32% 91%)',
  input: 'hsl(214 32% 91%)',
  ring: 'hsl(243 75% 59%)',
  radius: '0.75rem',
};

export const NAV_THEME: Theme = {
  ...DefaultTheme,
  colors: {
    background: THEME.background,
    border: THEME.border,
    card: THEME.card,
    notification: THEME.destructive,
    primary: THEME.primary,
    text: THEME.foreground,
  },
};
