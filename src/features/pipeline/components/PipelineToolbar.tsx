/**
 * Barre d'outils du Pipeline Kanban.
 * Regroupe la recherche, les filtres, le tri et le rafraîchissement.
 */
import type { PipelineFilters as PipelineFiltersType, PipelineSort } from '@/features/pipeline/types/pipeline.types';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Icons } from '@/components/ui/icons';

interface PipelineToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sort: PipelineSort;
  onSortChange: (sort: PipelineSort) => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
  onToggleFilters: () => void;
  filtersVisible: boolean;
  hasActiveFilters: boolean;
  filters: PipelineFiltersType;
  onFiltersChange: (filters: PipelineFiltersType) => void;
  onResetFilters: () => void;
}

const SORT_OPTIONS = [
  { label: 'Ordre personnalisé', value: 'order' as const },
  { label: 'Valeur (décroissant)', value: 'value_desc' as const },
  { label: 'Valeur (croissant)', value: 'value_asc' as const },
  { label: 'Probabilité', value: 'probability' as const },
  { label: 'Nom', value: 'name' as const },
];

export function PipelineToolbar({
  searchQuery,
  onSearchChange,
  sort,
  onSortChange,
  onRefresh,
  isRefreshing = false,
  onToggleFilters,
  filtersVisible,
  hasActiveFilters,
}: PipelineToolbarProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3 flex-wrap">
        {/* Search */}
        <div className="flex-1 min-w-[200px] max-w-md">
          <Input
            placeholder="Rechercher une opportunité..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            leftIcon={<Icons.search className="h-4 w-4" />}
          />
        </div>

        {/* Sort */}
        <div className="w-[180px]">
          <Select
            value={sort}
            onChange={(e) => onSortChange(e.target.value as PipelineSort)}
            options={SORT_OPTIONS}
          />
        </div>

        {/* Refresh */}
        <Button
          variant="outline"
          size="sm"
          leadingIcon={<Icons.refresh className={`size-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />}
          onClick={onRefresh}
          disabled={isRefreshing}
        >
          Actualiser
        </Button>
      </div>
    </div>
  );
}

