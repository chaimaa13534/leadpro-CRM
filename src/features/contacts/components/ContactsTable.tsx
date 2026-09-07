import { Icons } from '@/components/ui/icons';
import { Card } from '@/components/ui/Card';
import { TableSkeleton } from '@/components/ui/TableSkeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorAlert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { ContactRow } from '@/features/contacts/components/ContactRow';
import { ContactCard } from '@/features/contacts/components/ContactCard';
import { cn } from '@/lib/cn';
import type { Contact } from '@/types/contact.types';
import type {
  ContactSortField,
  ContactSortState,
} from '@/features/contacts/hooks/useContactsTable';

export interface ContactsTableProps {
  contacts: Contact[];
  isLoading: boolean;
  error: string | null;
  sort: ContactSortState;
  onSortChange: (sort: ContactSortState) => void;
  onRetry: () => void;
  onResetFilters: () => void;
  onView: (contact: Contact) => void;
  onEdit: (contact: Contact) => void;
  onDelete: (contact: Contact) => void;
  hasActiveFilters: boolean;
}

const SORTABLE_COLUMNS: { field: ContactSortField; label: string }[] = [
  { field: 'name', label: 'Nom' },
  { field: 'company', label: 'Entreprise' },
  { field: 'city', label: 'Ville' },
];

interface SortableHeaderProps {
  field: ContactSortField;
  label: string;
  sort: ContactSortState;
  onSortChange: (sort: ContactSortState) => void;
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

export function ContactsTable({
  contacts,
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
}: ContactsTableProps) {
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
        <TableSkeleton columns={10} rows={8} />
      </Card>
    );
  }

  if (contacts.length === 0) {
    return (
      <Card>
        <EmptyState
          icon={<Icons.contacts className="size-6" aria-hidden="true" />}
          title="Aucun contact trouvé"
          description={
            hasActiveFilters
              ? 'Aucun contact ne correspond à votre recherche ou à vos filtres.'
              : 'Aucun contact pour le moment.'
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
                Poste
              </th>
              <th className="px-3 py-4 text-left text-caption font-medium tracking-wide text-text-secondary/70 uppercase">
                Téléphone
              </th>
              <th className="px-3 py-4 text-left text-caption font-medium tracking-wide text-text-secondary/70 uppercase">
                Pays
              </th>
              <th className="px-3 py-4 text-left text-caption font-medium tracking-wide text-text-secondary/70 uppercase">
                Statut
              </th>
              <th className="px-3 py-4 text-left text-caption font-medium tracking-wide text-text-secondary/70 uppercase">
                Responsable
              </th>
              <th className="px-3 py-4 text-left text-caption font-medium tracking-wide text-text-secondary/70 uppercase">
                Dernière activité
              </th>
              <th className="px-3 py-4 text-right text-caption font-medium tracking-wide text-text-secondary/70 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact, index) => (
              <ContactRow
                key={contact.id}
                contact={contact}
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
        {contacts.map((contact, index) => (
          <ContactCard
            key={contact.id}
            contact={contact}
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

