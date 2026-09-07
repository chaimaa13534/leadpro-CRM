import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Icons } from '@/components/ui/icons';
import { opportunitiesMock } from '@/mocks/opportunities.mock';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDate } from '@/utils/formatDate';
import type { ID } from '@/types/common.types';

export interface CompanyOpportunitiesProps {
  linkedOpportunityIds: ID[];
}

const STAGE_LABELS: Record<string, { label: string; variant: 'primary' | 'warning' | 'success' | 'neutral' | 'danger' }> = {
  prospecting: { label: 'Prospection', variant: 'primary' },
  qualification: { label: 'Qualification', variant: 'warning' },
  proposal: { label: 'Proposition', variant: 'primary' },
  negotiation: { label: 'Négociation', variant: 'warning' },
  closed_won: { label: 'Gagnée', variant: 'success' },
  closed_lost: { label: 'Perdue', variant: 'danger' },
};

export function CompanyOpportunities({ linkedOpportunityIds }: CompanyOpportunitiesProps) {
  const linkedOpps = opportunitiesMock.filter((o) =>
    linkedOpportunityIds.includes(o.id),
  );

  if (linkedOpps.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Opportunités liées</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-caption text-text-secondary/60">
            Aucune opportunité liée à cette entreprise.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Opportunités liées ({linkedOpps.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          {linkedOpps.map((opp) => {
            const stageConfig = STAGE_LABELS[opp.stage] ?? STAGE_LABELS.prospecting;
            if (!stageConfig) return null;
            return (
              <div
                key={opp.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-border/60 px-3 py-2.5 transition-colors hover:bg-muted/40"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icons.opportunities className="size-4 shrink-0 text-text-secondary" aria-hidden="true" />
                  <div className="min-w-0">
                    <p className="text-body font-medium text-text-primary truncate">
                      {opp.name}
                    </p>
                    <p className="text-caption text-text-secondary/70">
                      {formatCurrency(opp.amount)} · {opp.probability}%
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Badge variant={stageConfig.variant} size="sm">
                    {stageConfig.label}
                  </Badge>
                  {opp.expectedCloseDate ? (
                    <span className="text-caption tabular-nums text-text-secondary">
                      {formatDate(opp.expectedCloseDate, 'short')}
                    </span>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

