import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Icons } from '@/components/ui/icons';
import { leadsMock } from '@/mocks/leads.mock';
import { formatCurrency } from '@/utils/formatCurrency';
import type { ID } from '@/types/common.types';

export interface CompanyLeadsProps {
  linkedLeadIds: ID[];
}

const STATUS_LABELS: Record<string, { label: string; variant: 'primary' | 'warning' | 'success' | 'neutral' | 'danger' }> = {
  new: { label: 'Nouveau', variant: 'primary' },
  contacted: { label: 'Contacté', variant: 'warning' },
  qualified: { label: 'Qualifié', variant: 'success' },
  unqualified: { label: 'Non qualifié', variant: 'neutral' },
  converted: { label: 'Converti', variant: 'success' },
};

export function CompanyLeads({ linkedLeadIds }: CompanyLeadsProps) {
  const linkedLeads = leadsMock.filter((l) => linkedLeadIds.includes(l.id));

  if (linkedLeads.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Leads liés</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-caption text-text-secondary/60">
            Aucun lead lié à cette entreprise.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Leads liés ({linkedLeads.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          {linkedLeads.map((lead) => {
            const statusConfig = STATUS_LABELS[lead.status] ?? STATUS_LABELS.new;
            if (!statusConfig) return null;
            return (
              <div
                key={lead.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-border/60 px-3 py-2.5 transition-colors hover:bg-muted/40"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icons.leads className="size-4 shrink-0 text-text-secondary" aria-hidden="true" />
                  <div className="min-w-0">
                    <p className="text-body font-medium text-text-primary truncate">
                      {lead.firstName} {lead.lastName}
                    </p>
                    <p className="text-caption text-text-secondary/70 truncate">
                      {lead.jobTitle ?? '—'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Badge variant={statusConfig.variant} size="sm">
                    {statusConfig.label}
                  </Badge>
                  {lead.estimatedValue ? (
                    <span className="text-caption tabular-nums text-text-secondary">
                      {formatCurrency(lead.estimatedValue)}
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

