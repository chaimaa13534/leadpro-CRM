import { Button } from '@/components/ui/Button';
import { Icons } from '@/components/ui/icons';
import { LeadSearch } from '@/features/leads/components/LeadSearch';
import { LeadFilters } from '@/features/leads/components/LeadFilters';
import { LeadSort } from '@/features/leads/components/LeadSort';
import type {
  LeadFilters as LeadFiltersState,
  LeadSortState,
} from '@/features/leads/hooks/useLeadsTable';

export interface LeadsToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  resetKey: number;
  filters: LeadFiltersState;
  onFiltersChange: (filters: LeadFiltersState) => void;
  sort: LeadSortState;
  onSortChange: (sort: LeadSortState) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  onExport?: () => void;
  onImport?: () => void;
}

/**
 * Barre d'outils — design clarifié.
 * Les actions de gauche (recherche, filtres, tri) sont regroupées
 * visuellement, les actions secondaires (colonnes, refresh) à droite.
 */
export function LeadsToolbar({
  searchQuery,
  onSearchChange,
  resetKey,
  filters,
  onFiltersChange,
  sort,
  onSortChange,
  onRefresh,
  isRefreshing,
  onExport,
  onImport,
}: LeadsToolbarProps) {
  return (
    <div className="flex flex-col gap-3 tablet:flex-row tablet:items-center tablet:justify-between">
      <div className="flex flex-1 flex-wrap items-center gap-2">
        <LeadSearch
          key={resetKey}
          value={searchQuery}
          onChange={onSearchChange}
        />
        <LeadFilters filters={filters} onChange={onFiltersChange} />
        <div className="h-6 w-px bg-border/60" aria-hidden="true" />
        <LeadSort sort={sort} onChange={onSortChange} />
      </div>

      <div className="flex items-center gap-2">
        {onImport && (
          <Button
            variant="secondary"
            size="sm"
            aria-label="Importer des leads"
            onClick={onImport}
            leadingIcon={<Icons.add className="size-3.5" />}
          >
            Importer
          </Button>
        )}
        {onExport && (
          <Button
            variant="secondary"
            size="sm"
            aria-label="Exporter les leads"
            onClick={onExport}
            leadingIcon={<Icons.export className="size-3.5" />}
          >
            Exporter
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          aria-label="Actualiser la liste"
          onClick={onRefresh}
          isLoading={isRefreshing}
          leadingIcon={<Icons.refresh className="size-3.5" />}
        >
          Actualiser
        </Button>
      </div>
    </div>
  );
}
