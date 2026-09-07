import { useCallback, useEffect, useMemo } from 'react';
import type { ReactNode } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import {
  ThemeContext,
  type Theme,
  type ThemeContextValue,
} from '@/store/slices/theme-context';

const THEME_STORAGE_KEY = 'leadpro-crm:theme';

export interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * Gère le thème clair/sombre pour toute l'application : persiste le
 * choix dans `localStorage` et applique la classe `dark` sur `<html>`,
 * ce qui active les variantes `dark:` de Tailwind partout — y compris
 * sur les pages d'authentification, contrairement à l'ancienne
 * implémentation scopée à `MainLayout`.
 *
 * Monté au tout premier niveau de `App`, avant même `AuthProvider` : le
 * thème ne dépend d'aucune session.
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useLocalStorage<Theme>(THEME_STORAGE_KEY, 'light');

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    root.style.colorScheme = theme;
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, [setTheme]);

  const applyTheme = useCallback(
    (nextTheme: Theme) => {
      setTheme(nextTheme);
    },
    [setTheme],
  );

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, toggleTheme, setTheme: applyTheme }),
    [theme, toggleTheme, applyTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
