import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { InfoRow } from '@/features/leads/components/InfoRow';
import type { Lead } from '@/types/lead.types';

export interface LeadAddressCardProps {
  lead: Lead;
}

/** Carte "Adresse". */
export function LeadAddressCard({ lead }: LeadAddressCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Adresse</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="divide-y divide-border">
          <InfoRow label="Pays" value={lead.country} />
          <InfoRow label="Ville" value={lead.city} />
          <InfoRow label="Adresse" value={lead.address} />
        </dl>
      </CardContent>
    </Card>
  );
}
