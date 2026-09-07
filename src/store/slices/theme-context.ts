import { createContext } from 'react';

export type Theme = 'light' | 'dark';

export interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

/**
 * Contexte de thème, monté une seule fois au niveau de `App` (Jour 7).
 *
 * Avant ce jour, le thème était géré à l'intérieur de `LayoutProvider`
 * (Jour 4), donc uniquement actif tant que `MainLayout` était monté : en
 * se déconnectant, l'utilisateur atterrissait sur `AuthLayout` où plus
 * rien n'appliquait la classe `.dark`, un vrai problème d'architecture
 * corrigé ici en sortant le thème de `LayoutContext`.
 */
export const ThemeContext = createContext<ThemeContextValue | null>(null);
