import { Select } from '@/components/ui/Select';
import type { OpportunityFilters as OpportunityFiltersState } from '@/features/opportunities/hooks/useOpportunitiesTable';

const STAGE_OPTIONS = [
  { label: 'Toutes les étapes', value: 'all' },
  { label: 'Prospection', value: 'prospecting' },
  { label: 'Qualification', value: 'qualification' },
  { label: 'Proposition', value: 'proposal' },
  { label: 'Négociation', value: 'negotiation' },
  { label: 'Gagnée', value: 'closed_won' },
  { label: 'Perdue', value: 'closed_lost' },
];

const STATUS_OPTIONS = [
  { label: 'Tous les statuts', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'En attente', value: 'on_hold' },
  { label: 'Gagnée', value: 'won' },
  { label: 'Perdue', value: 'lost' },
  { label: 'Abandonnée', value: 'abandoned' },
];

const PRIORITY_OPTIONS = [
  { label: 'Toutes les priorités', value: 'all' },
  { label: 'Basse', value: 'low' },
  { label: 'Moyenne', value: 'medium' },
  { label: 'Haute', value: 'high' },
  { label: 'Critique', value: 'critical' },
];

const PROBABILITY_OPTIONS = [
  { label: 'Toute probabilité', value: 'all' },
  { label: '0% – 25%', value: '0-25' },
  { label: '26% – 50%', value: '26-50' },
  { label: '51% – 75%', value: '51-75' },
  { label: '76% – 100%', value: '76-100' },
];

const AMOUNT_OPTIONS = [
  { label: 'Tout montant', value: 'all' },
  { label: '0 – 50k MAD', value: '0-50k' },
  { label: '50k – 200k MAD', value: '50k-200k' },
  { label: '200k – 500k MAD', value: '200k-500k' },
  { label: '500k+ MAD', value: '500k+' },
];

const DATE_OPTIONS = [
  { label: 'Toutes les dates', value: 'all' },
  { label: '7 derniers jours', value: '7d' },
  { label: '30 derniers jours', value: '30d' },
  { label: '90 derniers jours', value: '90d' },
];

export interface OpportunityFiltersProps {
  filters: OpportunityFiltersState;
  onChange: (filters: OpportunityFiltersState) => void;
  owners: { id: string; label: string }[];
  companies: { id: string; label: string }[];
}

export function OpportunityFilters({
  filters,
  onChange,
  owners,
  companies,
}: OpportunityFiltersProps) {
  function handleChange<K extends keyof OpportunityFiltersState>(
    key: K,
    value: OpportunityFiltersState[K],
  ) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select
        aria-label="Filtrer par étape"
        value={filters.stage}
        onChange={(e) => handleChange('stage', e.target.value as OpportunityFiltersState['stage'])}
        options={STAGE_OPTIONS}
        className="h-8 w-auto text-caption"
      />

      <Select
        aria-label="Filtrer par statut"
        value={filters.status}
        onChange={(e) => handleChange('status', e.target.value as OpportunityFiltersState['status'])}
        options={STATUS_OPTIONS}
        className="h-8 w-auto text-caption"
      />

      <Select
        aria-label="Filtrer par priorité"
        value={filters.priority}
        onChange={(e) => handleChange('priority', e.target.value as OpportunityFiltersState['priority'])}
        options={PRIORITY_OPTIONS}
        className="h-8 w-auto text-caption"
      />

      <Select
        aria-label="Filtrer par probabilité"
        value={filters.probabilityRange}
        onChange={(e) => handleChange('probabilityRange', e.target.value as OpportunityFiltersState['probabilityRange'])}
        options={PROBABILITY_OPTIONS}
        className="h-8 w-auto text-caption"
      />

      <Select
        aria-label="Filtrer par montant"
        value={filters.amountRange}
        onChange={(e) => handleChange('amountRange', e.target.value as OpportunityFiltersState['amountRange'])}
        options={AMOUNT_OPTIONS}
        className="h-8 w-auto text-caption"
      />

      <Select
        aria-label="Filtrer par date"
        value={filters.dateRange}
        onChange={(e) => handleChange('dateRange', e.target.value as OpportunityFiltersState['dateRange'])}
        options={DATE_OPTIONS}
        className="h-8 w-auto text-caption"
      />

      <Select
        aria-label="Filtrer par commercial"
        value={filters.ownerId}
        onChange={(e) => handleChange('ownerId', e.target.value)}
        options={[
          { label: 'Tous les commerciaux', value: 'all' },
          ...owners.map((o) => ({ label: o.label, value: o.id })),
        ]}
        className="h-8 w-auto text-caption"
      />

      <Select
        aria-label="Filtrer par entreprise"
        value={filters.companyId}
        onChange={(e) => handleChange('companyId', e.target.value)}
        options={[
          { label: 'Toutes les entreprises', value: 'all' },
          ...companies.map((c) => ({ label: c.label, value: c.id })),
        ]}
        className="h-8 w-auto text-caption"
      />
    </div>
  );
}

