import { Badge } from '@/components/ui/Badge';
import type { OpportunityPriority } from '@/types/opportunity.types';

const PRIORITY_LABELS: Record<OpportunityPriority, string> = {
  low: 'Basse',
  medium: 'Moyenne',
  high: 'Haute',
  critical: 'Critique',
};

const PRIORITY_VARIANTS: Record<OpportunityPriority, 'neutral' | 'info' | 'warning' | 'danger'> = {
  low: 'neutral',
  medium: 'info',
  high: 'warning',
  critical: 'danger',
};

export interface OpportunityPriorityBadgeProps {
  priority: OpportunityPriority;
}

export function OpportunityPriorityBadge({ priority }: OpportunityPriorityBadgeProps) {
  return (
    <Badge variant={PRIORITY_VARIANTS[priority]} size="sm" dot>
      {PRIORITY_LABELS[priority]}
    </Badge>
  );
}

