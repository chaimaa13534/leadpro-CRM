import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { InfoRow } from '@/features/leads/components/InfoRow';
import { usersMock } from '@/mocks/users.mock';
import { getLeadSystemInfo } from '@/features/leads/mocks/lead-details.mock';
import { LEAD_SOURCES } from '@/lib/constants/statuses.constants';
import { PIPELINE_STAGES } from '@/lib/constants/pipeline.constants';
import { formatCurrency } from '@/utils/formatCurrency';
import type { Lead } from '@/types/lead.types';

export interface LeadBusinessCardProps {
  lead: Lead;
}

/**
 * Carte "Informations commerciales". `pipeline` / `étape actuelle` sont
 * dérivés (voir `getLeadSystemInfo`) : ce ne sont pas encore des champs
 * du modèle `Lead` — un lead entre "en pipeline" une fois converti en
 * opportunité, ce que la Semaine 2 formalisera.
 */
export function LeadBusinessCard({ lead }: LeadBusinessCardProps) {
  const owner = usersMock.find((user) => user.id === lead.ownerId);
  const { pipelineStage } = getLeadSystemInfo(lead);
  const stageMeta = PIPELINE_STAGES[pipelineStage];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informations commerciales</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="divide-y divide-border">
          <InfoRow label="Source" value={LEAD_SOURCES[lead.source].label} />
          <InfoRow
            label="Propriétaire"
            value={owner ? `${owner.firstName} ${owner.lastName}` : undefined}
          />
          <InfoRow
            label="Valeur estimée"
            value={
              lead.estimatedValue !== undefined ? (
                <span className="text-figure">
                  {formatCurrency(lead.estimatedValue)}
                </span>
              ) : undefined
            }
          />
          <InfoRow
            label="Probabilité"
            value={
              lead.conversionProbability !== undefined
                ? `${lead.conversionProbability}%`
                : undefined
            }
          />
          <InfoRow label="Pipeline" value="Pipeline commercial" />
          <InfoRow label="Étape actuelle" value={stageMeta.label} />
        </dl>
      </CardContent>
    </Card>
  );
}
