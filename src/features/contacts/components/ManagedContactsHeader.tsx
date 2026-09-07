import { Users } from 'lucide-react';

interface ManagedContactsHeaderProps {
  totalCount: number;
}

/**
 * En-tête de la page Contacts (module piloté par l'API). Affiche le titre,
 * une description et le nombre total de contacts chargés depuis le backend.
 */
export function ManagedContactsHeader({ totalCount }: ManagedContactsHeaderProps) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-subtle text-accent">
          <Users className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-text-primary">
            Contacts
          </h1>
          <p className="mt-0.5 text-[13px] text-text-tertiary">
            Gérez les contacts de vos clients.
          </p>
        </div>
      </div>
      <span className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-[12px] font-medium text-text-secondary sm:mt-0">
        <Users className="h-3.5 w-3.5 text-text-tertiary" aria-hidden="true" />
        {totalCount} contact{totalCount > 1 ? 's' : ''}
      </span>
    </div>
  );
}
