import { Select } from '@/components/ui/Select';
import type {
  CompanySortField,
  CompanySortState,
} from '@/features/companies/hooks/useCompaniesTable';

export interface CompanySortProps {
  sort: CompanySortState;
  onChange: (sort: CompanySortState) => void;
}

const SORT_OPTIONS: { value: string; label: string }[] = [
  { value: 'date-desc', label: 'Date (récent → ancien)' },
  { value: 'date-asc', label: 'Date (ancien → récent)' },
  { value: 'name-asc', label: 'Nom (A → Z)' },
  { value: 'name-desc', label: 'Nom (Z → A)' },
  { value: 'industry-asc', label: 'Secteur (A → Z)' },
  { value: 'industry-desc', label: 'Secteur (Z → A)' },
  { value: 'value-desc', label: 'Valeur (estimation ↓)' },
  { value: 'value-asc', label: 'Valeur (estimation ↑)' },
  { value: 'contacts-desc', label: 'Nb contacts (↓)' },
  { value: 'contacts-asc', label: 'Nb contacts (↑)' },
];

export function CompanySort({ sort, onChange }: CompanySortProps) {
  return (
    <Select
      aria-label="Trier les entreprises"
      value={`${sort.field}-${sort.order}`}
      onChange={(event) => {
        const [field, order] = event.target.value.split('-') as [
          CompanySortField,
          CompanySortState['order'],
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

