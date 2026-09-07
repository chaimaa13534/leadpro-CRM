/**
 * Panneau de filtres du Pipeline Kanban.
 * Filtres par commercial, pipeline, étape, priorité, valeur, entreprise, date, probabilité.
 */
import type { PipelineFilters as PipelineFiltersType } from '@/features/pipeline/types/pipeline.types';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Icons } from '@/components/ui/icons';
import { usersMock } from '@/mocks/users.mock';
import { PIPELINE_COLUMNS } from '@/features/pipeline/types/pipeline.types';

interface PipelineFiltersProps {
  filters: PipelineFiltersType;
  onFiltersChange: (filters: PipelineFiltersType) => void;
  onReset: () => void;
  isVisible?: boolean;
}

const PIPELINE_OPTIONS = [
  { label: 'Tous les pipelines', value: 'all' },
  { label: 'Sales Pipeline', value: 'Sales Pipeline' },
  { label: 'Enterprise Pipeline', value: 'Enterprise Pipeline' },
  { label: 'Partner Pipeline', value: 'Partner Pipeline' },
];

const PRIORITY_OPTIONS = [
  { label: 'Toutes les priorités', value: 'all' },
  { label: 'Critical', value: 'critical' },
  { label: 'High', value: 'high' },
  { label: 'Medium', value: 'medium' },
  { label: 'Low', value: 'low' },
];

const PROBABILITY_OPTIONS = [
  { label: 'Toutes', value: 'all' },
  { label: '0-25%', value: '0-25' },
  { label: '25-50%', value: '25-50' },
  { label: '50-75%', value: '50-75' },
  { label: '75-100%', value: '75-100' },
];

const VALUE_OPTIONS = [
  { label: 'Tous les montants', value: 'all' },
  { label: '0 - 50K', value: '0-50000' },
  { label: '50K - 200K', value: '50000-200000' },
  { label: '200K - 500K', value: '200000-500000' },
  { label: '500K - 1M', value: '500000-1000000' },
  { label: '1M+', value: '1000000-10000000' },
];

const STAGE_OPTIONS = [
  { label: 'Toutes les étapes', value: 'all' as const },
  ...PIPELINE_COLUMNS.map((col) => ({
    label: col.title,
    value: col.id,
  })),
];

export function PipelineFilters({
  filters,
  onFiltersChange,
  onReset,
  isVisible = true,
}: PipelineFiltersProps) {
  if (!isVisible) return null;

  const updateFilter = <K extends keyof PipelineFiltersType>(
    key: K,
    value: PipelineFiltersType[K],
  ) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[13px] font-semibold text-text-primary">Filtres</h3>
        <Button variant="ghost" size="xs" onClick={onReset}>
          <Icons.refresh className="h-3 w-3 mr-1" />
          Réinitialiser
        </Button>
      </div>

      <div className="grid grid-cols-2 tablet:grid-cols-3 laptop:grid-cols-4 gap-3">
        <Select
          placeholder="Commercial"
          value={filters.ownerId}
          onChange={(e) => updateFilter('ownerId', e.target.value)}
          options={[
            { label: 'Tous les commerciaux', value: 'all' },
            ...usersMock.map((u) => ({
              label: `${u.firstName} ${u.lastName}`,
              value: u.id,
            })),
          ]}
        />

        <Select
          placeholder="Pipeline"
          value={filters.pipeline}
          onChange={(e) => updateFilter('pipeline', e.target.value)}
          options={PIPELINE_OPTIONS}
        />

        <Select
          placeholder="Étape"
          value={filters.stage ?? 'all'}
          onChange={(e) => updateFilter('stage', e.target.value)}
          options={STAGE_OPTIONS}
        />

        <Select
          placeholder="Priorité"
          value={filters.priority}
          onChange={(e) => updateFilter('priority', e.target.value)}
          options={PRIORITY_OPTIONS}
        />

        <Select
          placeholder="Valeur"
          value={filters.valueRange}
          onChange={(e) => updateFilter('valueRange', e.target.value)}
          options={VALUE_OPTIONS}
        />

        <Select
          placeholder="Probabilité"
          value={filters.probabilityRange}
          onChange={(e) => updateFilter('probabilityRange', e.target.value)}
          options={PROBABILITY_OPTIONS}
        />
      </div>
    </div>
  );
}

