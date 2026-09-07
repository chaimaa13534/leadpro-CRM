import { useContext } from 'react';
import {
  LayoutContext,
  type LayoutContextValue,
} from '@/store/slices/layout-context';

/**
 * Accès à l'état du Main Layout (Sidebar, Dark Mode, Drawer mobile).
 * Doit être utilisé sous `LayoutProvider` (monté dans `MainLayout`).
 */
export function useLayout(): LayoutContextValue {
  const context = useContext(LayoutContext);

  if (!context) {
    throw new Error('useLayout doit être utilisé sous un <LayoutProvider>.');
  }

  return context;
}
