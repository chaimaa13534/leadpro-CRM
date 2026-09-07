import { Target } from 'lucide-react';

interface ManagedLeadsHeaderProps {
  totalCount: number;
}

/**
 * En-tête de la page Leads (module piloté par l'API). Affiche le titre,
 * une description et le nombre total de leads chargés depuis le backend.
 */
export function ManagedLeadsHeader({ totalCount }: ManagedLeadsHeaderProps) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-subtle text-accent">
          <Target className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-text-primary">
            Leads
          </h1>
          <p className="mt-0.5 text-[13px] text-text-tertiary">
            Gérez vos prospects et suivez leur progression.
          </p>
        </div>
      </div>
      <span className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-[12px] font-medium text-text-secondary sm:mt-0">
        <Target className="h-3.5 w-3.5 text-text-tertiary" aria-hidden="true" />
        {totalCount} lead{totalCount > 1 ? 's' : ''}
      </span>
    </div>
  );
}
