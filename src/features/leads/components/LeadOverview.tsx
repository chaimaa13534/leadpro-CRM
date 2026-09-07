import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { LeadProfileCard } from '@/features/leads/components/LeadProfileCard';
import { LeadBusinessCard } from '@/features/leads/components/LeadBusinessCard';
import { LeadAddressCard } from '@/features/leads/components/LeadAddressCard';
import { LeadInfoCard } from '@/features/leads/components/LeadInfoCard';
import { LeadTags } from '@/features/leads/components/LeadTags';
import type { Lead } from '@/types/lead.types';

export interface LeadOverviewProps {
  lead: Lead;
}

/**
 * Onglet "Overview" : toutes les cartes d'information en un coup d'œil.
 * Grille à 2 colonnes desktop/tablette, 1 colonne mobile (brief
 * explicite) — chaque carte reste indépendante et réutilisable ailleurs
 * si besoin.
 */
export function LeadOverview({ lead }: LeadOverviewProps) {
  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Tags</CardTitle>
        </CardHeader>
        <CardContent>
          <LeadTags tags={lead.tags ?? []} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 laptop:grid-cols-2">
        <LeadProfileCard lead={lead} />
        <LeadBusinessCard lead={lead} />
        <LeadAddressCard lead={lead} />
        <LeadInfoCard lead={lead} />
      </div>
    </div>
  );
}
