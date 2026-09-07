import { useCallback, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import {
  LayoutContext,
  type LayoutContextValue,
} from '@/store/slices/layout-context';

const SIDEBAR_COLLAPSED_STORAGE_KEY = 'leadpro-crm:sidebar-collapsed';

export interface LayoutProviderProps {
  children: ReactNode;
}

/**
 * Fournit l'état du Main Layout à toute l'arborescence (Sidebar, Topbar,
 * MobileDrawer…) : Sidebar réduite/étendue et Drawer mobile.
 *
 * Le thème (clair/sombre) n'est plus géré ici depuis le Jour 7 — il a
 * été promu en `ThemeProvider` au niveau de `App`, pour rester actif
 * même sur les pages qui n'utilisent pas `MainLayout` (Login…). Ce
 * provider garde une responsabilité unique : l'état visuel propre au
 * Main Layout.
 *
 * Volontairement scopé à `MainLayout` uniquement (pas au niveau de
 * `App`) : `AuthLayout` n'a pas de Sidebar et n'a pas besoin de cet état.
 */
export function LayoutProvider({ children }: LayoutProviderProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useLocalStorage(
    SIDEBAR_COLLAPSED_STORAGE_KEY,
    false,
  );
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const toggleSidebarCollapsed = useCallback(() => {
    setIsSidebarCollapsed((prev) => !prev);
  }, [setIsSidebarCollapsed]);

  const openMobileDrawer = useCallback(() => setIsMobileDrawerOpen(true), []);
  const closeMobileDrawer = useCallback(() => setIsMobileDrawerOpen(false), []);
  const toggleMobileDrawer = useCallback(
    () => setIsMobileDrawerOpen((prev) => !prev),
    [],
  );

  const value = useMemo<LayoutContextValue>(
    () => ({
      isSidebarCollapsed,
      toggleSidebarCollapsed,
      isMobileDrawerOpen,
      openMobileDrawer,
      closeMobileDrawer,
      toggleMobileDrawer,
      collapsed: isSidebarCollapsed,
      toggleCollapsed: toggleSidebarCollapsed,
      drawerOpen: isMobileDrawerOpen,
      openDrawer: openMobileDrawer,
      closeDrawer: closeMobileDrawer,
      toggleDrawer: toggleMobileDrawer,
    }),
    [
      isSidebarCollapsed,
      toggleSidebarCollapsed,
      isMobileDrawerOpen,
      openMobileDrawer,
      closeMobileDrawer,
      toggleMobileDrawer,
    ],
  );

  return (
    <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>
  );
}
