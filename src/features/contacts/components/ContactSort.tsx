import { Select } from '@/components/ui/Select';
import type {
  ContactSortField,
  ContactSortState,
} from '@/features/contacts/hooks/useContactsTable';

export interface ContactSortProps {
  sort: ContactSortState;
  onChange: (sort: ContactSortState) => void;
}

const SORT_OPTIONS: { value: string; label: string }[] = [
  { value: 'date-desc', label: 'Date (récent → ancien)' },
  { value: 'date-asc', label: 'Date (ancien → récent)' },
  { value: 'name-asc', label: 'Nom (A → Z)' },
  { value: 'name-desc', label: 'Nom (Z → A)' },
  { value: 'company-asc', label: 'Entreprise (A → Z)' },
  { value: 'company-desc', label: 'Entreprise (Z → A)' },
  { value: 'city-asc', label: 'Ville (A → Z)' },
  { value: 'city-desc', label: 'Ville (Z → A)' },
];

export function ContactSort({ sort, onChange }: ContactSortProps) {
  return (
    <Select
      aria-label="Trier les contacts"
      value={`${sort.field}-${sort.order}`}
      onChange={(event) => {
        const [field, order] = event.target.value.split('-') as [
          ContactSortField,
          ContactSortState['order'],
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

