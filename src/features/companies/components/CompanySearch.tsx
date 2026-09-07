import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Icons } from '@/components/ui/icons';
import { debounce } from '@/utils/debounce';

export interface CompanySearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function CompanySearch({ value, onChange }: CompanySearchProps) {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    const debounced = debounce((next: string) => onChange(next), 250);
    debounced(localValue);
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
        placeholder="Rechercher une entreprise..."
        aria-label="Rechercher une entreprise"
        className="pl-9"
      />
    </div>
  );
}

