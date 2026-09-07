import { Badge } from '@/components/ui/Badge';
import type { OpportunityStatus } from '@/types/opportunity.types';

const STATUS_LABELS: Record<OpportunityStatus, string> = {
  active: 'Active',
  on_hold: 'En attente',
  won: 'Gagnée',
  lost: 'Perdue',
  abandoned: 'Abandonnée',
};

const STATUS_VARIANTS: Record<OpportunityStatus, 'success' | 'warning' | 'info' | 'danger' | 'neutral'> = {
  active: 'success',
  on_hold: 'warning',
  won: 'info',
  lost: 'danger',
  abandoned: 'neutral',
};

export interface OpportunityStatusBadgeProps {
  status: OpportunityStatus;
}

export function OpportunityStatusBadge({ status }: OpportunityStatusBadgeProps) {
  return (
    <Badge variant={STATUS_VARIANTS[status]} size="sm" dot>
      {STATUS_LABELS[status]}
    </Badge>
  );
}

