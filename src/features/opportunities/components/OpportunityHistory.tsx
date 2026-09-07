import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Icons } from '@/components/ui/icons';
import { formatDate } from '@/utils/formatDate';
import type { OpportunityHistoryEntry } from '@/types/opportunity.types';

export interface OpportunityHistoryProps {
  history?: OpportunityHistoryEntry[];
}

export function OpportunityHistory({ history = [] }: OpportunityHistoryProps) {
  if (history.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
          <Icons.clock className="size-8 text-text-tertiary" aria-hidden="true" />
          <p className="text-body text-text-secondary">
            Aucun historique de modification pour le moment.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historique des modifications</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative flex flex-col gap-4 pl-6 before:absolute before:left-2 before:top-2 before:h-[calc(100%-16px)] before:w-0.5 before:bg-border/60">
          {history.map((entry) => (
            <div key={entry.id} className="relative flex flex-col gap-1">
              <span className="absolute -left-6 flex size-4 items-center justify-center rounded-full bg-surface ring-2 ring-border">
                <Icons.statusChange className="size-2.5 text-text-secondary" aria-hidden="true" />
              </span>
              <p className="text-body font-medium text-text-primary">
                Modification de <strong>{entry.field}</strong>
              </p>
              <p className="text-caption text-text-secondary">
                <span className="line-through text-text-secondary/50">
                  {entry.oldValue}
                </span>{' '}
                → <span className="font-medium text-text-primary">{entry.newValue}</span>
              </p>
              <span className="text-caption text-text-secondary/60">
                {formatDate(entry.changedAt, 'datetime')}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

