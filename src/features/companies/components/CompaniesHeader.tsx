import { Building2 } from 'lucide-react';

interface CompaniesHeaderProps {
  totalCount: number;
}

/**
 * En-tête de la page Companies. Affiche le titre, une description et le
 * nombre total d'entreprises chargées depuis l'API.
 */
export function CompaniesHeader({ totalCount }: CompaniesHeaderProps) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-subtle text-accent">
          <Building2 className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-text-primary">
            Entreprises
          </h1>
          <p className="mt-0.5 text-[13px] text-text-tertiary">
            Gérez vos comptes et entreprises clients.
          </p>
        </div>
      </div>
      <span className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-[12px] font-medium text-text-secondary sm:mt-0">
        <Building2 className="h-3.5 w-3.5 text-text-tertiary" aria-hidden="true" />
        {totalCount} entreprise{totalCount > 1 ? 's' : ''}
      </span>
    </div>
  );
}
