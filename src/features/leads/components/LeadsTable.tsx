import { Icons } from '@/components/ui/icons';
import { Card } from '@/components/ui/Card';
import { TableSkeleton } from '@/components/ui/TableSkeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorAlert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { LeadRow } from '@/features/leads/components/LeadRow';
import { LeadCard } from '@/features/leads/components/LeadCard';
import { cn } from '@/lib/cn';
import type { Lead } from '@/types/lead.types';
import type {
  LeadSortField,
  LeadSortState,
} from '@/features/leads/hooks/useLeadsTable';

export interface LeadsTableProps {
  leads: Lead[];
  isLoading: boolean;
  error: string | null;
  sort: LeadSortState;
  onSortChange: (sort: LeadSortState) => void;
  onRetry: () => void;
  onResetFilters: () => void;
  onView: (lead: Lead) => void;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
  hasActiveFilters: boolean;
}

const SORTABLE_COLUMNS: { field: LeadSortField; label: string }[] = [
  { field: 'name', label: 'Nom' },
  { field: 'company', label: 'Entreprise' },
];

interface SortableHeaderProps {
  field: LeadSortField;
  label: string;
  sort: LeadSortState;
  onSortChange: (sort: LeadSortState) => void;
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

/**
 * Corps de la page Leads : tableau (desktop/tablette) ou cartes (mobile)
 * selon la largeur d'écran, plus les trois états demandés par le brief
 * (chargement, vide, erreur) — tous construits sur les primitives déjà
 * existantes (`TableSkeleton`, `EmptyState`, `ErrorAlert`) plutôt que
 * réinventées.
 */
export function LeadsTable({
  leads,
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
}: LeadsTableProps) {
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
        <TableSkeleton columns={8} rows={8} />
      </Card>
    );
  }

  if (leads.length === 0) {
    return (
      <Card>
        <EmptyState
          icon={<Icons.leads className="size-6" aria-hidden="true" />}
          title="Aucun lead trouvé"
          description={
            hasActiveFilters
              ? 'Aucun lead ne correspond à votre recherche ou à vos filtres.'
              : 'Aucun lead pour le moment.'
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
                Téléphone
              </th>
              <th className="px-3 py-4 text-left text-caption font-medium tracking-wide text-text-secondary/70 uppercase">
                Source
              </th>
              <th className="px-3 py-4 text-left text-caption font-medium tracking-wide text-text-secondary/70 uppercase">
                Statut
              </th>
              <th className="px-3 py-4 text-left text-caption font-medium tracking-wide text-text-secondary/70 uppercase">
                Responsable
              </th>
              <SortableHeader
                field="date"
                label="Date de création"
                sort={sort}
                onSortChange={onSortChange}
              />
              <th className="px-3 py-4 text-right text-caption font-medium tracking-wide text-text-secondary/70 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead, index) => (
              <LeadRow
                key={lead.id}
                lead={lead}
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
        {leads.map((lead, index) => (
          <LeadCard
            key={lead.id}
            lead={lead}
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
