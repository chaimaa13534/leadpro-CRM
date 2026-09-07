import { useEffect } from 'react';
import { useBlocker } from 'react-router-dom';

/**
 * Protège contre la perte de modifications non enregistrées :
 * - `beforeunload` natif pour la fermeture d'onglet / rechargement /
 *   navigation hors de l'application ;
 * - `useBlocker` (React Router, routeur de données) pour la navigation
 *   interne (clic sur un lien, retour arrière) — affiche une boîte de
 *   dialogue de confirmation gérée par l'appelant via `blocker.state`.
 */
export function useUnsavedChangesGuard(isDirty: boolean) {
  useEffect(() => {
    function handleBeforeUnload(event: BeforeUnloadEvent) {
      if (!isDirty) return;
      event.preventDefault();
    }

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  return useBlocker(
    ({ currentLocation, nextLocation }) =>
      isDirty && currentLocation.pathname !== nextLocation.pathname,
  );
}
