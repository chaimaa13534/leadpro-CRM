import { useContext } from 'react';
import {
  ThemeContext,
  type ThemeContextValue,
} from '@/store/slices/theme-context';

/**
 * Accès au thème clair/sombre courant. Doit être utilisé sous
 * `ThemeProvider` (monté dans `App`, voir Jour 7).
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme doit être utilisé sous un <ThemeProvider>.');
  }

  return context;
}
