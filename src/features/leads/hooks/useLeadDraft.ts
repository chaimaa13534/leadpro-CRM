import { useCallback, useState } from 'react';

const DRAFT_STORAGE_KEY = 'leadpro-crm:new-lead-draft';

/**
 * Brouillon automatique du formulaire "Nouveau Lead", persisté dans
 * `localStorage`. La lecture initiale se fait via l'initialiseur
 * paresseux de `useState` (exécuté une seule fois, au premier rendu)
 * plutôt que dans un `useEffect` : `localStorage` est synchrone, un
 * effet ne ferait qu'ajouter un rendu superflu pour rien.
 */
export function useLeadDraft<T>() {
  const [draftValues] = useState<T | null>(() => {
    try {
      const stored = window.localStorage.getItem(DRAFT_STORAGE_KEY);
      return stored ? (JSON.parse(stored) as T) : null;
    } catch {
      return null;
    }
  });

  const [hasDraft, setHasDraft] = useState(draftValues !== null);

  const saveDraft = useCallback((values: T) => {
    try {
      window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(values));
    } catch {
      // Stockage indisponible (mode privé, quota…) — on continue sans
      // brouillon, ce n'est pas bloquant pour la création du lead.
    }
  }, []);

  const clearDraft = useCallback(() => {
    window.localStorage.removeItem(DRAFT_STORAGE_KEY);
    setHasDraft(false);
  }, []);

  const dismissDraftPrompt = useCallback(() => {
    setHasDraft(false);
  }, []);

  return { draftValues, hasDraft, saveDraft, clearDraft, dismissDraftPrompt };
}
