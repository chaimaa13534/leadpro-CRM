import { Badge } from '@/components/ui/Badge';
import type { PipelineStage } from '@/types/opportunity.types';

const STAGE_LABELS: Record<PipelineStage, string> = {
  prospecting: 'Prospection',
  qualification: 'Qualification',
  proposal: 'Proposition',
  negotiation: 'Négociation',
  contract_sent: 'Contrat Envoyé',
  closed_won: 'Gagnée',
  closed_lost: 'Perdue',
};

const STAGE_VARIANTS: Record<PipelineStage, 'neutral' | 'info' | 'primary' | 'warning' | 'success' | 'danger'> = {
  prospecting: 'neutral',
  qualification: 'info',
  proposal: 'primary',
  negotiation: 'warning',
  contract_sent: 'primary',
  closed_won: 'success',
  closed_lost: 'danger',
};

export interface OpportunityStageBadgeProps {
  stage: PipelineStage;
}

export function OpportunityStageBadge({ stage }: OpportunityStageBadgeProps) {
  return (
    <Badge variant={STAGE_VARIANTS[stage]} size="sm" dot>
      {STAGE_LABELS[stage]}
    </Badge>
  );
}

