import { Icons } from '@/components/ui/icons';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorAlert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { OpportunityRow } from '@/features/opportunities/components/OpportunityRow';
import { OpportunityCard } from '@/features/opportunities/components/OpportunityCard';
import { cn } from '@/lib/cn';
import type { Opportunity } from '@/types/opportunity.types';
import type {
  OpportunitySortField,
  OpportunitySortState,
} from '@/features/opportunities/hooks/useOpportunitiesTable';

export interface OpportunitiesTableProps {
  opportunities: Opportunity[];
  isLoading: boolean;
  error: string | null;
  sort: OpportunitySortState;
  onSortChange: (sort: OpportunitySortState) => void;
  onRetry: () => void;
  onResetFilters: () => void;
  onView: (opportunity: Opportunity) => void;
  onEdit: (opportunity: Opportunity) => void;
  onDelete: (opportunity: Opportunity) => void;
  hasActiveFilters: boolean;
}

const SORTABLE_COLUMNS: { field: OpportunitySortField; label: string }[] = [
  { field: 'name', label: 'Nom' },
  { field: 'companyName', label: 'Entreprise' },
  { field: 'amount', label: 'Valeur' },
  { field: 'probability', label: 'Probabilité' },
  { field: 'expectedCloseDate', label: 'Clôture' },
];

interface SortableHeaderProps {
  field: OpportunitySortField;
  label: string;
  sort: OpportunitySortState;
  onSortChange: (sort: OpportunitySortState) => void;
}

function SortableHeader({
  field,
  label,
  sort,
  onSortChange,
}: SortableHeaderProps) {
  const isActive = sort.field === field;

  return (
    <th className="px-3 py-4 text-left text-caption font-medium tracking-wide text-text-secondary/70 uppercase first:pl-4">
      <button
        type="button"
        onClick={() =>
          onSortChange({
            field,
            order: isActive && sort.order === 'asc' ? 'desc' : 'asc',
          })
        }
        className="flex items-center gap-1.5 transition-colors duration-150 hover:text-text-primary"
      >
        {label}
        <Icons.sort
          className={cn(
            'size-3',
            isActive ? 'text-primary-500' : 'text-text-secondary/40',
          )}
          aria-hidden="true"
        />
      </button>
    </th>
  );
}

export function OpportunitiesTable({
  opportunities,
  isLoading,
  error,
  sort,
  onSortChange,
  onRetry,
  onResetFilters,
  onView,
  onEdit,
  onDelete,
  hasActiveFilters,
}: OpportunitiesTableProps) {
  if (error) {
    return (
      <Card className="flex flex-col items-center gap-4 p-8 text-center">
        <ErrorAlert>{error}</ErrorAlert>
        <Button variant="outline" onClick={onRetry}>
          Réessayer
        </Button>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="hidden overflow-hidden tablet:block">
        <div className="flex flex-col gap-4 p-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </Card>
    );
  }

  if (opportunities.length === 0) {
    return (
      <Card>
        <EmptyState
          icon={<Icons.opportunities className="size-6" aria-hidden="true" />}
          title="Aucune opportunité trouvée"
          description={
            hasActiveFilters
              ? 'Aucune opportunité ne correspond à votre recherche ou à vos filtres.'
              : 'Aucune opportunité pour le moment.'
          }
          action={
            hasActiveFilters ? (
              <Button variant="outline" onClick={onResetFilters}>
                Réinitialiser les filtres
              </Button>
            ) : undefined
          }
        />
      </Card>
    );
  }

  return (
    <>
      <Card className="hidden overflow-x-auto tablet:block">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-border/60 bg-muted/30">
              {SORTABLE_COLUMNS.map((column) => (
                <SortableHeader
                  key={column.field}
                  field={column.field}
                  label={column.label}
                  sort={sort}
                  onSortChange={onSortChange}
                />
              ))}
              <th className="px-3 py-4 text-left text-caption font-medium tracking-wide text-text-secondary/70 uppercase">
                Contact
              </th>
              <th className="px-3 py-4 text-left text-caption font-medium tracking-wide text-text-secondary/70 uppercase">
                Commercial
              </th>
              <th className="px-3 py-4 text-left text-caption font-medium tracking-wide text-text-secondary/70 uppercase">
                Devise
              </th>
              <th className="px-3 py-4 text-left text-caption font-medium tracking-wide text-text-secondary/70 uppercase">
                Étape
              </th>
              <th className="px-3 py-4 text-left text-caption font-medium tracking-wide text-text-secondary/70 uppercase">
                Dernière activité
              </th>
              <th className="px-3 py-4 text-left text-caption font-medium tracking-wide text-text-secondary/70 uppercase">
                Statut
              </th>
              <th className="px-3 py-4 text-right text-caption font-medium tracking-wide text-text-secondary/70 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {opportunities.map((opportunity, index) => (
              <OpportunityRow
                key={opportunity.id}
                opportunity={opportunity}
                index={index}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </Card>

      <div className="flex flex-col gap-3 tablet:hidden">
        {opportunities.map((opportunity, index) => (
          <OpportunityCard
            key={opportunity.id}
            opportunity={opportunity}
            index={index}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </>
  );
}

