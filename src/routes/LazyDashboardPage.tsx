import { lazy } from 'react';

/**
 * `DashboardPage` est chargée en lazy (`React.lazy`) plutôt qu'importée
 * statiquement : c'est la seule page qui embarque Recharts, une
 * dépendance volumineuse. La séparer dans son propre chunk évite de
 * l'envoyer sur les pages qui n'en ont pas besoin (Leads, Contacts…).
 *
 * Isolée dans son propre fichier (plutôt que déclarée dans
 * `router.tsx`) pour que ce dernier ne mélange pas export de composant
 * et export de configuration — meilleure compatibilité Fast Refresh.
 */
export const LazyDashboardPage = lazy(() =>
  import('@/pages/DashboardPage').then((module) => ({
    default: module.DashboardPage,
  })),
);
