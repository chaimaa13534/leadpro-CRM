import { useCallback, useEffect, useState } from 'react';

type SetValue<T> = (value: T | ((prev: T) => T)) => void;

/**
 * Synchronise un état React avec `localStorage`, avec sérialisation JSON
 * automatique. Se comporte comme `useState`, mais persiste la valeur entre
 * les rechargements de page et la synchronise entre onglets ouverts.
 *
 * @param key          Clé utilisée dans `localStorage`.
 * @param initialValue Valeur par défaut si aucune valeur n'est stockée.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, SetValue<T>] {
  const readValue = useCallback((): T => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const [storedValue, setStoredValue] = useState<T>(readValue);

  const setValue: SetValue<T> = useCallback(
    (value) => {
      setStoredValue((prev) => {
        const nextValue = value instanceof Function ? value(prev) : value;

        try {
          window.localStorage.setItem(key, JSON.stringify(nextValue));
        } catch {
          // Le stockage peut échouer (mode privé, quota dépassé…) ; l'état
          // React reste malgré tout à jour pour la session en cours.
        }

        return nextValue;
      });
    },
    [key],
  );

  useEffect(() => {
    function handleStorageChange(event: StorageEvent) {
      if (event.key === key && event.newValue) {
        setStoredValue(JSON.parse(event.newValue) as T);
      }
    }

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue];
}
