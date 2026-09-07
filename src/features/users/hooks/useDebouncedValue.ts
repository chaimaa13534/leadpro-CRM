import { useEffect, useState } from 'react';

/**
 * Retarde la mise à jour d'une valeur jusqu'à ce qu'aucune nouvelle valeur
 * ne soit fournie pendant `delayMs`. Utilisé pour la recherche avec debounce.
 */
export function useDebouncedValue<T>(value: T, delayMs = 300): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebounced(value);
    }, delayMs);

    return () => clearTimeout(timeoutId);
  }, [value, delayMs]);

  return debounced;
}
