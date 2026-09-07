import { createContext } from 'react';

export interface LayoutContextValue {
  isSidebarCollapsed: boolean;
  toggleSidebarCollapsed: () => void;
  isMobileDrawerOpen: boolean;
  openMobileDrawer: () => void;
  closeMobileDrawer: () => void;
  toggleMobileDrawer: () => void;
  collapsed: boolean;
  toggleCollapsed: () => void;
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
}

/**
 * Contexte "léger" (pas de librairie externe) portant l'état d'affichage
 * du Main Layout : Sidebar ouverte/réduite, Drawer mobile. Le thème vit
 * désormais dans son propre `ThemeContext` (Jour 7) — voir
 * `theme-context.ts` — pour rester actif hors de `MainLayout`.
 *
 * Défini séparément de `LayoutProvider` pour que ce fichier n'exporte
 * qu'une valeur non-composant (meilleure compatibilité Fast Refresh).
 */
export const LayoutContext = createContext<LayoutContextValue | null>(null);
