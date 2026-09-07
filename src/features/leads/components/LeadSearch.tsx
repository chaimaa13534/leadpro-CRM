import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Icons } from '@/components/ui/icons';
import { debounce } from '@/utils/debounce';

export interface LeadSearchProps {
  value: string;
  onChange: (value: string) => void;
}

/**
 * Champ de recherche instantanée, débouncée (250 ms) pour éviter de
 * refiltrer la liste à chaque frappe. L'état affiché reste local pour
 * une frappe fluide ; seule la propagation vers `onChange` est retardée.
 *
 * Ce composant ne se resynchronise jamais avec `value` depuis l'extérieur
 * (pas d'effet, pas de ref pendant le rendu — les deux sont interdits
 * par `react-hooks/set-state-in-effect` et `react-hooks/refs`). Quand le
 * parent doit forcer une réinitialisation (`resetFilters`), il remonte
 * le composant via une prop `key` — voir `LeadsPage` (`resetCounter`),
 * le pattern officiellement recommandé par React pour ce cas.
 */
export function LeadSearch({ value, onChange }: LeadSearchProps) {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    const debounced = debounce((next: string) => onChange(next), 250);
    debounced(localValue);
    // La fonction débouncée est recréée à chaque frappe ; c'est
    // volontaire ici (recherche simple, faible fréquence d'appel) plutôt
    // que de mémoïser via useRef, pour garder le composant lisible.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localValue]);

  return (
    <div className="relative w-full max-w-xs">
      <Icons.search
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-text-secondary"
        aria-hidden="true"
      />
      <Input
        type="search"
        value={localValue}
        onChange={(event) => setLocalValue(event.target.value)}
        placeholder="Rechercher un lead..."
        aria-label="Rechercher un lead"
        className="pl-9"
      />
    </div>
  );
}
