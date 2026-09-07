import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { InfoRow } from '@/features/leads/components/InfoRow';
import { getLeadSystemInfo } from '@/features/leads/mocks/lead-details.mock';
import { formatDate } from '@/utils/formatDate';
import type { Lead } from '@/types/lead.types';

export interface LeadInfoCardProps {
  lead: Lead;
}

/** Carte "Informations système" : traçabilité du lead. */
export function LeadInfoCard({ lead }: LeadInfoCardProps) {
  const { createdByName } = getLeadSystemInfo(lead);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informations système</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="divide-y divide-border">
          <InfoRow
            label="Date de création"
            value={formatDate(lead.createdAt, 'datetime')}
          />
          <InfoRow
            label="Dernière modification"
            value={formatDate(lead.updatedAt, 'datetime')}
          />
          <InfoRow label="Créé par" value={createdByName} />
          <InfoRow
            label="Dernière activité"
            value={
              lead.lastActivityAt
                ? formatDate(lead.lastActivityAt, 'datetime')
                : undefined
            }
          />
        </dl>
      </CardContent>
    </Card>
  );
}
