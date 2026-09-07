import { Select } from '@/components/ui/Select';
import type {
  LeadSortField,
  LeadSortState,
} from '@/features/leads/hooks/useLeadsTable';

export interface LeadSortProps {
  sort: LeadSortState;
  onChange: (sort: LeadSortState) => void;
}

const SORT_OPTIONS: { value: string; label: string }[] = [
  { value: 'date-desc', label: 'Date (récent → ancien)' },
  { value: 'date-asc', label: 'Date (ancien → récent)' },
  { value: 'name-asc', label: 'Nom (A → Z)' },
  { value: 'name-desc', label: 'Nom (Z → A)' },
  { value: 'company-asc', label: 'Entreprise (A → Z)' },
  { value: 'company-desc', label: 'Entreprise (Z → A)' },
];

/**
 * Contrôle de tri compact pour la Toolbar — complète les en-têtes de
 * colonnes cliquables de `LeadsTable` (même état de tri partagé), utile
 * en particulier sur mobile où le tableau devient des cartes sans
 * en-têtes.
 */
export function LeadSort({ sort, onChange }: LeadSortProps) {
  return (
    <Select
      aria-label="Trier les leads"
      value={`${sort.field}-${sort.order}`}
      onChange={(event) => {
        const [field, order] = event.target.value.split('-') as [
          LeadSortField,
          LeadSortState['order'],
        ];
        onChange({ field, order });
      }}
      className="w-auto"
    >
      {SORT_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </Select>
  );
}
