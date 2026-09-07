import { useRef } from 'react';
import { Input } from '@/components/ui/Input';
import { Icons } from '@/components/ui/icons';
import { debounce } from '@/utils/debounce';

export interface OpportunitySearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function OpportunitySearch({ value, onChange }: OpportunitySearchProps) {
  const debouncedOnChange = useRef(
    debounce((val: string) => onChange(val), 200),
  ).current;

  return (
    <Input
      placeholder="Rechercher par nom, entreprise, contact..."
      defaultValue={value}
      onChange={(e) => debouncedOnChange(e.target.value)}
      leftIcon={<Icons.search className="size-3.5 text-text-tertiary" aria-hidden="true" />}
      aria-label="Rechercher une opportunité"
      className="min-w-[200px] tablet:min-w-[280px]"
    />
  );
}

