import { Button } from '@/components/ui/Button';
import { Icons } from '@/components/ui/icons';
import { OpportunitySearch } from '@/features/opportunities/components/OpportunitySearch';
import { OpportunityFilters } from '@/features/opportunities/components/OpportunityFilters';
import { OpportunitySort } from '@/features/opportunities/components/OpportunitySort';
import type {
  OpportunityFilters as OpportunityFiltersState,
  OpportunitySortState,
} from '@/features/opportunities/hooks/useOpportunitiesTable';

export interface OpportunitiesToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  resetKey: number;
  filters: OpportunityFiltersState;
  onFiltersChange: (filters: OpportunityFiltersState) => void;
  sort: OpportunitySortState;
  onSortChange: (sort: OpportunitySortState) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  owners: { id: string; label: string }[];
  companies: { id: string; label: string }[];
  onExport?: () => void;
  onImport?: () => void;
}

export function OpportunitiesToolbar({
  searchQuery,
  onSearchChange,
  resetKey,
  filters,
  onFiltersChange,
  sort,
  onSortChange,
  onRefresh,
  isRefreshing,
  owners,
  companies,
  onExport,
  onImport,
}: OpportunitiesToolbarProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-1 flex-wrap items-center gap-2">
        <OpportunitySearch
          key={resetKey}
          value={searchQuery}
          onChange={onSearchChange}
        />
        <div className="h-6 w-px bg-border/60" aria-hidden="true" />
        <OpportunitySort sort={sort} onChange={onSortChange} />
      </div>

      <OpportunityFilters
        filters={filters}
        onChange={onFiltersChange}
        owners={owners}
        companies={companies}
      />

      <div className="flex items-center gap-2">
        {onImport && (
          <Button
            variant="secondary"
            size="sm"
            aria-label="Importer des opportunités"
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
            aria-label="Exporter les opportunités"
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

