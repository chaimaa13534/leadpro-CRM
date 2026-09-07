import { Select } from '@/components/ui/Select';
import type {
  OpportunitySortField,
  OpportunitySortState,
  SortOrder,
} from '@/features/opportunities/hooks/useOpportunitiesTable';

const SORT_OPTIONS: { label: string; field: OpportunitySortField; order: SortOrder }[] = [
  { label: 'Plus récentes', field: 'createdAt', order: 'desc' },
  { label: 'Plus anciennes', field: 'createdAt', order: 'asc' },
  { label: 'Nom (A–Z)', field: 'name', order: 'asc' },
  { label: 'Nom (Z–A)', field: 'name', order: 'desc' },
  { label: 'Montant (croissant)', field: 'amount', order: 'asc' },
  { label: 'Montant (décroissant)', field: 'amount', order: 'desc' },
  { label: 'Probabilité (croissante)', field: 'probability', order: 'asc' },
  { label: 'Probabilité (décroissante)', field: 'probability', order: 'desc' },
  { label: 'Entreprise (A–Z)', field: 'companyName', order: 'asc' },
  { label: 'Entreprise (Z–A)', field: 'companyName', order: 'desc' },
];

export interface OpportunitySortProps {
  sort: OpportunitySortState;
  onChange: (sort: OpportunitySortState) => void;
}

export function OpportunitySort({ sort, onChange }: OpportunitySortProps) {
  const currentValue = `${sort.field}-${sort.order}`;

  function handleChange(value: string) {
    const [field, order] = value.split('-') as [OpportunitySortField, SortOrder];
    onChange({ field, order });
  }

  return (
    <Select
      aria-label="Trier les opportunités"
      value={currentValue}
      onChange={(e) => handleChange(e.target.value)}
      options={SORT_OPTIONS.map((opt) => ({
        label: opt.label,
        value: `${opt.field}-${opt.order}`,
      }))}
      className="h-8 w-auto text-caption"
    />
  );
}

