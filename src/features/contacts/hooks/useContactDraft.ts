import { useCallback, useState } from 'react';

const DRAFT_STORAGE_KEY = 'leadpro-crm:new-contact-draft';

export function useContactDraft<T>() {
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
      // Stockage indisponible — on continue sans brouillon.
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

